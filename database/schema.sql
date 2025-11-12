-- ============================================
-- ESQUEMA DE BASE DE DATOS - SISTEMA DE REINSCRIPCIONES
-- PostgreSQL 14+
-- Versión: 1.0.0
-- Fecha: 2025-11-04
-- ============================================

-- Eliminar base de datos si existe (¡CUIDADO EN PRODUCCIÓN!)
-- DROP DATABASE IF EXISTS reinscripciones_db;

-- Crear base de datos
CREATE DATABASE reinscripciones_db
    WITH
    ENCODING = 'UTF8'
    LC_COLLATE = 'es_MX.UTF-8'
    LC_CTYPE = 'es_MX.UTF-8'
    TEMPLATE = template0;

-- Conectar a la base de datos
\c reinscripciones_db;

-- ============================================
-- 1. CREAR TIPOS ENUM
-- ============================================

CREATE TYPE tipo_solicitud AS ENUM ('nuevo_ingreso', 'reinscripcion');
CREATE TYPE estatus_solicitud AS ENUM ('pendiente', 'aprobada', 'rechazada');
CREATE TYPE rol_usuario AS ENUM ('admin', 'director', 'control_escolar');
CREATE TYPE turno_enum AS ENUM ('matutino', 'vespertino', 'nocturno');
CREATE TYPE tipo_documento AS ENUM ('comprobante_pago', 'identificacion', 'certificado');
CREATE TYPE accion_auditoria AS ENUM ('INSERT', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT');

-- ============================================
-- 2. CREAR FUNCIÓN PARA UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 3. TABLA: usuarios
-- ============================================

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    rol rol_usuario NOT NULL DEFAULT 'control_escolar',
    activo BOOLEAN DEFAULT true,
    ultimo_acceso TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_usuarios_username ON usuarios(username);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);
CREATE INDEX idx_usuarios_activo ON usuarios(activo);

CREATE TRIGGER trigger_usuarios_updated_at
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_timestamp();

COMMENT ON TABLE usuarios IS 'Usuarios administradores del sistema';
COMMENT ON COLUMN usuarios.password_hash IS 'Hash bcrypt de la contraseña';

-- ============================================
-- 4. TABLA: carreras
-- ============================================

CREATE TABLE carreras (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    codigo VARCHAR(20) UNIQUE,
    activa BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_carreras_activa ON carreras(activa);
CREATE INDEX idx_carreras_codigo ON carreras(codigo);

COMMENT ON TABLE carreras IS 'Catálogo de carreras disponibles';

-- ============================================
-- 5. TABLA: alumnos
-- ============================================

CREATE TABLE alumnos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100) NOT NULL,
    curp VARCHAR(18) NOT NULL UNIQUE,
    fecha_nacimiento DATE NOT NULL,
    telefono VARCHAR(15) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    direccion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT curp_length CHECK (LENGTH(curp) = 18),
    CONSTRAINT curp_uppercase CHECK (curp = UPPER(curp)),
    CONSTRAINT telefono_digits CHECK (telefono ~ '^[0-9]{10}$'),
    CONSTRAINT email_valid CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT fecha_nacimiento_valida CHECK (fecha_nacimiento < CURRENT_DATE),
    CONSTRAINT edad_minima CHECK (EXTRACT(YEAR FROM AGE(fecha_nacimiento)) >= 15)
);

CREATE INDEX idx_alumnos_curp ON alumnos(curp);
CREATE INDEX idx_alumnos_email ON alumnos(email);
CREATE INDEX idx_alumnos_nombre_completo ON alumnos(apellido_paterno, apellido_materno, nombre);
CREATE INDEX idx_alumnos_created_at ON alumnos(created_at DESC);

CREATE TRIGGER trigger_alumnos_updated_at
    BEFORE UPDATE ON alumnos
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_timestamp();

COMMENT ON TABLE alumnos IS 'Información personal de los alumnos';
COMMENT ON COLUMN alumnos.curp IS 'CURP válido de 18 caracteres';

-- ============================================
-- 6. TABLA: solicitudes
-- ============================================

CREATE TABLE solicitudes (
    id SERIAL PRIMARY KEY,
    alumno_id INTEGER NOT NULL REFERENCES alumnos(id) ON DELETE CASCADE,
    carrera_id INTEGER NOT NULL REFERENCES carreras(id),
    tipo tipo_solicitud NOT NULL,
    estatus estatus_solicitud NOT NULL DEFAULT 'pendiente',

    -- Datos específicos de reinscripción
    matricula VARCHAR(20),
    semestre SMALLINT CHECK (semestre BETWEEN 1 AND 9),
    grupo CHAR(1) CHECK (grupo IN ('A', 'B', 'C', 'D', 'E')),

    -- Datos comunes
    turno turno_enum NOT NULL,

    -- Fechas y seguimiento
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    aprobado_por INTEGER REFERENCES usuarios(id),
    fecha_aprobacion TIMESTAMP,
    rechazado_por INTEGER REFERENCES usuarios(id),
    fecha_rechazo TIMESTAMP,

    -- Comentarios
    comentarios TEXT,

    -- Validaciones
    CONSTRAINT matricula_requerida_reinscripcion
        CHECK (
            (tipo = 'reinscripcion' AND matricula IS NOT NULL) OR
            (tipo = 'nuevo_ingreso' AND matricula IS NULL)
        ),
    CONSTRAINT datos_reinscripcion_completos
        CHECK (
            (tipo = 'reinscripcion' AND semestre IS NOT NULL AND grupo IS NOT NULL) OR
            (tipo = 'nuevo_ingreso')
        ),
    CONSTRAINT fecha_aprobacion_valida
        CHECK (
            (estatus = 'aprobada' AND fecha_aprobacion IS NOT NULL) OR
            (estatus != 'aprobada' AND fecha_aprobacion IS NULL)
        ),
    CONSTRAINT aprobador_valido
        CHECK (
            (estatus = 'aprobada' AND aprobado_por IS NOT NULL) OR
            (estatus != 'aprobada')
        )
);

CREATE INDEX idx_solicitudes_alumno ON solicitudes(alumno_id);
CREATE INDEX idx_solicitudes_carrera ON solicitudes(carrera_id);
CREATE INDEX idx_solicitudes_tipo ON solicitudes(tipo);
CREATE INDEX idx_solicitudes_estatus ON solicitudes(estatus);
CREATE INDEX idx_solicitudes_fecha ON solicitudes(fecha_solicitud DESC);
CREATE INDEX idx_solicitudes_matricula ON solicitudes(matricula) WHERE matricula IS NOT NULL;
CREATE INDEX idx_solicitudes_aprobado_por ON solicitudes(aprobado_por);

CREATE TRIGGER trigger_solicitudes_updated_at
    BEFORE UPDATE ON solicitudes
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_timestamp();

COMMENT ON TABLE solicitudes IS 'Solicitudes de nuevo ingreso y reinscripción';

-- ============================================
-- 7. TABLA: documentos
-- ============================================

CREATE TABLE documentos (
    id SERIAL PRIMARY KEY,
    solicitud_id INTEGER NOT NULL REFERENCES solicitudes(id) ON DELETE CASCADE,
    tipo_documento tipo_documento NOT NULL DEFAULT 'comprobante_pago',
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_archivo TEXT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    tamaño_bytes INTEGER NOT NULL,
    hash_sha256 VARCHAR(64),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT tamaño_maximo CHECK (tamaño_bytes <= 5242880),
    CONSTRAINT mime_type_valido CHECK (
        mime_type IN ('image/jpeg', 'image/png', 'image/jpg', 'application/pdf')
    )
);

CREATE INDEX idx_documentos_solicitud ON documentos(solicitud_id);
CREATE INDEX idx_documentos_tipo ON documentos(tipo_documento);
CREATE INDEX idx_documentos_uploaded_at ON documentos(uploaded_at DESC);

COMMENT ON TABLE documentos IS 'Documentos adjuntos a las solicitudes';
COMMENT ON COLUMN documentos.tamaño_bytes IS 'Tamaño máximo: 5MB';

-- ============================================
-- 8. TABLA: auditoria
-- ============================================

CREATE TABLE auditoria (
    id SERIAL PRIMARY KEY,
    tabla_afectada VARCHAR(50) NOT NULL,
    registro_id INTEGER NOT NULL,
    accion accion_auditoria NOT NULL,
    usuario_id INTEGER REFERENCES usuarios(id),
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_auditoria_tabla ON auditoria(tabla_afectada);
CREATE INDEX idx_auditoria_registro ON auditoria(registro_id);
CREATE INDEX idx_auditoria_usuario ON auditoria(usuario_id);
CREATE INDEX idx_auditoria_fecha ON auditoria(created_at DESC);
CREATE INDEX idx_auditoria_accion ON auditoria(accion);

COMMENT ON TABLE auditoria IS 'Log de auditoría de cambios en el sistema';

-- ============================================
-- 9. VISTAS
-- ============================================

-- Vista: alumnos_aceptados
CREATE VIEW alumnos_aceptados AS
SELECT
    a.id,
    a.nombre,
    a.apellido_paterno,
    a.apellido_materno,
    CONCAT(a.nombre, ' ', a.apellido_paterno, ' ', a.apellido_materno) as nombre_completo,
    a.email,
    a.telefono,
    c.nombre as carrera,
    s.turno,
    s.matricula,
    s.semestre,
    s.grupo,
    s.tipo,
    s.fecha_aprobacion,
    u.nombre as aprobado_por
FROM solicitudes s
JOIN alumnos a ON s.alumno_id = a.id
JOIN carreras c ON s.carrera_id = c.id
LEFT JOIN usuarios u ON s.aprobado_por = u.id
WHERE s.estatus = 'aprobada'
ORDER BY s.fecha_aprobacion DESC;

-- Vista: solicitudes_pendientes
CREATE VIEW solicitudes_pendientes AS
SELECT
    s.id,
    s.tipo,
    s.fecha_solicitud,
    CONCAT(a.nombre, ' ', a.apellido_paterno, ' ', a.apellido_materno) as nombre_completo,
    a.curp,
    a.email,
    a.telefono,
    c.nombre as carrera,
    s.turno,
    s.matricula,
    s.semestre,
    s.grupo,
    COUNT(d.id) as documentos_adjuntos
FROM solicitudes s
JOIN alumnos a ON s.alumno_id = a.id
JOIN carreras c ON s.carrera_id = c.id
LEFT JOIN documentos d ON s.id = d.solicitud_id
WHERE s.estatus = 'pendiente'
GROUP BY s.id, a.id, c.id
ORDER BY s.fecha_solicitud ASC;

-- ============================================
-- 10. FUNCIONES
-- ============================================

-- Función: obtener_estadisticas
CREATE OR REPLACE FUNCTION obtener_estadisticas()
RETURNS TABLE (
    total_solicitudes BIGINT,
    pendientes BIGINT,
    aprobadas BIGINT,
    rechazadas BIGINT,
    nuevo_ingreso BIGINT,
    reinscripciones BIGINT,
    total_alumnos BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        (SELECT COUNT(*)::BIGINT FROM solicitudes) as total_solicitudes,
        (SELECT COUNT(*)::BIGINT FROM solicitudes WHERE estatus = 'pendiente') as pendientes,
        (SELECT COUNT(*)::BIGINT FROM solicitudes WHERE estatus = 'aprobada') as aprobadas,
        (SELECT COUNT(*)::BIGINT FROM solicitudes WHERE estatus = 'rechazada') as rechazadas,
        (SELECT COUNT(*)::BIGINT FROM solicitudes WHERE tipo = 'nuevo_ingreso') as nuevo_ingreso,
        (SELECT COUNT(*)::BIGINT FROM solicitudes WHERE tipo = 'reinscripcion') as reinscripciones,
        (SELECT COUNT(*)::BIGINT FROM alumnos) as total_alumnos;
END;
$$ LANGUAGE plpgsql;

-- Función: aprobar_solicitud
CREATE OR REPLACE FUNCTION aprobar_solicitud(
    p_solicitud_id INTEGER,
    p_usuario_id INTEGER,
    p_comentarios TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_solicitud_existe BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 1 FROM solicitudes
        WHERE id = p_solicitud_id AND estatus = 'pendiente'
    ) INTO v_solicitud_existe;

    IF NOT v_solicitud_existe THEN
        RAISE EXCEPTION 'Solicitud no encontrada o no está pendiente';
    END IF;

    UPDATE solicitudes
    SET
        estatus = 'aprobada',
        aprobado_por = p_usuario_id,
        fecha_aprobacion = CURRENT_TIMESTAMP,
        comentarios = COALESCE(p_comentarios, comentarios)
    WHERE id = p_solicitud_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Función: rechazar_solicitud
CREATE OR REPLACE FUNCTION rechazar_solicitud(
    p_solicitud_id INTEGER,
    p_usuario_id INTEGER,
    p_comentarios TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    v_solicitud_existe BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 1 FROM solicitudes
        WHERE id = p_solicitud_id AND estatus = 'pendiente'
    ) INTO v_solicitud_existe;

    IF NOT v_solicitud_existe THEN
        RAISE EXCEPTION 'Solicitud no encontrada o no está pendiente';
    END IF;

    UPDATE solicitudes
    SET
        estatus = 'rechazada',
        rechazado_por = p_usuario_id,
        fecha_rechazo = CURRENT_TIMESTAMP,
        comentarios = p_comentarios
    WHERE id = p_solicitud_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 11. TRIGGERS DE AUDITORÍA
-- ============================================

CREATE OR REPLACE FUNCTION auditoria_solicitudes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' AND OLD.estatus != NEW.estatus THEN
        INSERT INTO auditoria (
            tabla_afectada,
            registro_id,
            accion,
            datos_anteriores,
            datos_nuevos
        ) VALUES (
            'solicitudes',
            NEW.id,
            'UPDATE',
            jsonb_build_object('estatus', OLD.estatus),
            jsonb_build_object('estatus', NEW.estatus, 'usuario', NEW.aprobado_por)
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auditoria_solicitudes
    AFTER UPDATE ON solicitudes
    FOR EACH ROW
    EXECUTE FUNCTION auditoria_solicitudes();

-- ============================================
-- 12. INSERTAR DATOS INICIALES
-- ============================================

-- Carreras
INSERT INTO carreras (nombre, codigo) VALUES
    ('Ingeniería en Sistemas', 'IS'),
    ('Ingeniería Industrial', 'II'),
    ('Administración', 'ADM'),
    ('Contaduría', 'CON'),
    ('Derecho', 'DER');

-- Usuarios (contraseñas: admin123, dir123, ctrl123)
INSERT INTO usuarios (username, password_hash, nombre, email, rol) VALUES
    ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Administrador', 'admin@escuela.edu', 'admin'),
    ('director', '$2a$10$Nm5YJeBaSGd4Cy5.P7eB8uFBDWg.ZJGlnqaIJA.HfGxJNnQE0A8Iu', 'Director', 'director@escuela.edu', 'director'),
    ('control', '$2a$10$3xVvD7CbGPnkqKUOzUvYVOPxXR0Jgm3Z5UwNlB.0m9a.qfA0v/1yW', 'Control Escolar', 'control@escuela.edu', 'control_escolar');

-- ============================================
-- 13. PERMISOS Y SEGURIDAD
-- ============================================

-- Crear rol para la aplicación
CREATE ROLE reinscripciones_app WITH LOGIN PASSWORD 'tu_password_seguro_aqui';

-- Otorgar permisos
GRANT CONNECT ON DATABASE reinscripciones_db TO reinscripciones_app;
GRANT USAGE ON SCHEMA public TO reinscripciones_app;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO reinscripciones_app;
GRANT SELECT, USAGE ON ALL SEQUENCES IN SCHEMA public TO reinscripciones_app;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO reinscripciones_app;

-- ============================================
-- FIN DEL SCRIPT
-- ============================================

-- Verificar instalación
SELECT 'Base de datos creada exitosamente!' as mensaje;
SELECT * FROM obtener_estadisticas();

