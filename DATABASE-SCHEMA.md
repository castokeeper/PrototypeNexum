# 🗄️ Esquema de Base de Datos PostgreSQL

## 📋 Diseño del Sistema de Reinscripciones

### Entidades Identificadas

Basado en el análisis del código actual, estas son las entidades necesarias:

1. **Usuarios** (Administradores)
2. **Alumnos** (Datos personales)
3. **Solicitudes** (Nuevo ingreso y reinscripciones)
4. **Documentos** (Comprobantes de pago)
5. **Carreras** (Catálogo)
6. **Auditoría** (Log de cambios)

---

## 📊 Diagrama de Entidad-Relación

```
┌─────────────────┐
│    usuarios     │
│─────────────────│
│ id (PK)         │
│ username UNIQUE │
│ password_hash   │
│ nombre          │
│ rol             │
│ activo          │
│ created_at      │
│ updated_at      │
└────────┬────────┘
         │
         │ (registra cambios)
         │
         ▼
┌─────────────────┐       ┌──────────────────┐
│    alumnos      │       │    carreras      │
│─────────────────│       │──────────────────│
│ id (PK)         │       │ id (PK)          │
│ nombre          │       │ nombre UNIQUE    │
│ apellido_paterno│       │ activa           │
│ apellido_materno│       │ created_at       │
│ curp UNIQUE     │◄──┐   └──────────────────┘
│ fecha_nacimiento│   │
│ telefono        │   │
│ email UNIQUE    │   │
│ direccion       │   │
│ created_at      │   │
│ updated_at      │   │
└────────┬────────┘   │
         │            │
         │ (tiene)    │ (pertenece a)
         │            │
         ▼            │
┌─────────────────────┴──┐
│    solicitudes         │
│────────────────────────│
│ id (PK)                │
│ alumno_id (FK)         │
│ carrera_id (FK)        │
│ tipo ENUM              │
│ estatus ENUM           │
│ matricula (nullable)   │
│ semestre (nullable)    │
│ grupo (nullable)       │
│ turno                  │
│ fecha_solicitud        │
│ fecha_actualizacion    │
│ aprobado_por (FK)      │
│ fecha_aprobacion       │
│ comentarios            │
└────────┬───────────────┘
         │
         │ (adjunta)
         │
         ▼
┌─────────────────────┐
│    documentos       │
│─────────────────────│
│ id (PK)             │
│ solicitud_id (FK)   │
│ tipo_documento      │
│ nombre_archivo      │
│ ruta_archivo        │
│ mime_type           │
│ tamaño_bytes        │
│ uploaded_at         │
└─────────────────────┘

         │
         │ (genera)
         │
         ▼
┌─────────────────────┐
│    auditoria        │
│─────────────────────│
│ id (PK)             │
│ tabla_afectada      │
│ registro_id         │
│ accion              │
│ usuario_id (FK)     │
│ datos_anteriores    │
│ datos_nuevos        │
│ ip_address          │
│ created_at          │
└─────────────────────┘
```

---

## 🔧 Scripts SQL

### 1. Creación de Tipos ENUM

```sql
-- Tipo de solicitud
CREATE TYPE tipo_solicitud AS ENUM ('nuevo_ingreso', 'reinscripcion');

-- Estatus de solicitud
CREATE TYPE estatus_solicitud AS ENUM ('pendiente', 'aprobada', 'rechazada');

-- Rol de usuario
CREATE TYPE rol_usuario AS ENUM ('admin', 'director', 'control_escolar');

-- Turno
CREATE TYPE turno_enum AS ENUM ('matutino', 'vespertino', 'nocturno');

-- Tipo de documento
CREATE TYPE tipo_documento AS ENUM ('comprobante_pago', 'identificacion', 'certificado');

-- Acción de auditoría
CREATE TYPE accion_auditoria AS ENUM ('INSERT', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT');
```

### 2. Tabla: usuarios

```sql
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

-- Índices
CREATE INDEX idx_usuarios_username ON usuarios(username);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);
CREATE INDEX idx_usuarios_activo ON usuarios(activo);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_usuarios_updated_at
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_timestamp();
```

### 3. Tabla: carreras

```sql
CREATE TABLE carreras (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    codigo VARCHAR(20) UNIQUE,
    activa BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_carreras_activa ON carreras(activa);

-- Insertar carreras iniciales
INSERT INTO carreras (nombre, codigo) VALUES
    ('Ingeniería en Sistemas', 'IS'),
    ('Ingeniería Industrial', 'II'),
    ('Administración', 'ADM'),
    ('Contaduría', 'CON'),
    ('Derecho', 'DER');
```

### 4. Tabla: alumnos

```sql
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
    
    -- Validaciones
    CONSTRAINT curp_length CHECK (LENGTH(curp) = 18),
    CONSTRAINT curp_uppercase CHECK (curp = UPPER(curp)),
    CONSTRAINT telefono_digits CHECK (telefono ~ '^[0-9]{10}$'),
    CONSTRAINT email_valid CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT fecha_nacimiento_valida CHECK (fecha_nacimiento < CURRENT_DATE),
    CONSTRAINT edad_minima CHECK (EXTRACT(YEAR FROM AGE(fecha_nacimiento)) >= 15)
);

-- Índices
CREATE INDEX idx_alumnos_curp ON alumnos(curp);
CREATE INDEX idx_alumnos_email ON alumnos(email);
CREATE INDEX idx_alumnos_nombre_completo ON alumnos(apellido_paterno, apellido_materno, nombre);

-- Trigger para updated_at
CREATE TRIGGER trigger_alumnos_updated_at
    BEFORE UPDATE ON alumnos
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_timestamp();
```

### 5. Tabla: solicitudes

```sql
CREATE TABLE solicitudes (
    id SERIAL PRIMARY KEY,
    alumno_id INTEGER NOT NULL REFERENCES alumnos(id) ON DELETE CASCADE,
    carrera_id INTEGER NOT NULL REFERENCES carreras(id),
    tipo tipo_solicitud NOT NULL,
    estatus estatus_solicitud NOT NULL DEFAULT 'pendiente',
    
    -- Datos específicos de reinscripción (nullable para nuevo ingreso)
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

-- Índices
CREATE INDEX idx_solicitudes_alumno ON solicitudes(alumno_id);
CREATE INDEX idx_solicitudes_carrera ON solicitudes(carrera_id);
CREATE INDEX idx_solicitudes_tipo ON solicitudes(tipo);
CREATE INDEX idx_solicitudes_estatus ON solicitudes(estatus);
CREATE INDEX idx_solicitudes_fecha ON solicitudes(fecha_solicitud DESC);
CREATE INDEX idx_solicitudes_matricula ON solicitudes(matricula) WHERE matricula IS NOT NULL;

-- Trigger para updated_at
CREATE TRIGGER trigger_solicitudes_updated_at
    BEFORE UPDATE ON solicitudes
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_timestamp();
```

### 6. Tabla: documentos

```sql
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
    
    -- Validaciones
    CONSTRAINT tamaño_maximo CHECK (tamaño_bytes <= 5242880), -- 5MB
    CONSTRAINT mime_type_valido CHECK (
        mime_type IN ('image/jpeg', 'image/png', 'image/jpg', 'application/pdf')
    )
);

-- Índices
CREATE INDEX idx_documentos_solicitud ON documentos(solicitud_id);
CREATE INDEX idx_documentos_tipo ON documentos(tipo_documento);
```

### 7. Tabla: auditoria

```sql
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

-- Índices
CREATE INDEX idx_auditoria_tabla ON auditoria(tabla_afectada);
CREATE INDEX idx_auditoria_registro ON auditoria(registro_id);
CREATE INDEX idx_auditoria_usuario ON auditoria(usuario_id);
CREATE INDEX idx_auditoria_fecha ON auditoria(created_at DESC);
CREATE INDEX idx_auditoria_accion ON auditoria(accion);
```

---

## 🔐 Vistas para Seguridad

### Vista: alumnos_aceptados (pública)

```sql
CREATE VIEW alumnos_aceptados AS
SELECT 
    a.id,
    a.nombre,
    a.apellido_paterno,
    a.apellido_materno,
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
```

### Vista: solicitudes_pendientes

```sql
CREATE VIEW solicitudes_pendientes AS
SELECT 
    s.id,
    s.tipo,
    s.fecha_solicitud,
    a.nombre || ' ' || a.apellido_paterno || ' ' || a.apellido_materno as nombre_completo,
    a.curp,
    a.email,
    a.telefono,
    c.nombre as carrera,
    s.turno,
    s.matricula,
    s.semestre,
    s.grupo
FROM solicitudes s
JOIN alumnos a ON s.alumno_id = a.id
JOIN carreras c ON s.carrera_id = c.id
WHERE s.estatus = 'pendiente'
ORDER BY s.fecha_solicitud ASC;
```

---

## 📊 Funciones Útiles

### Función: obtener_estadisticas

```sql
CREATE OR REPLACE FUNCTION obtener_estadisticas()
RETURNS TABLE (
    total_solicitudes BIGINT,
    pendientes BIGINT,
    aprobadas BIGINT,
    rechazadas BIGINT,
    nuevo_ingreso BIGINT,
    reinscripciones BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total_solicitudes,
        COUNT(*) FILTER (WHERE estatus = 'pendiente')::BIGINT as pendientes,
        COUNT(*) FILTER (WHERE estatus = 'aprobada')::BIGINT as aprobadas,
        COUNT(*) FILTER (WHERE estatus = 'rechazada')::BIGINT as rechazadas,
        COUNT(*) FILTER (WHERE tipo = 'nuevo_ingreso')::BIGINT as nuevo_ingreso,
        COUNT(*) FILTER (WHERE tipo = 'reinscripcion')::BIGINT as reinscripciones
    FROM solicitudes;
END;
$$ LANGUAGE plpgsql;
```

### Función: aprobar_solicitud

```sql
CREATE OR REPLACE FUNCTION aprobar_solicitud(
    p_solicitud_id INTEGER,
    p_usuario_id INTEGER,
    p_comentarios TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_solicitud_existe BOOLEAN;
BEGIN
    -- Verificar que la solicitud existe y está pendiente
    SELECT EXISTS(
        SELECT 1 FROM solicitudes 
        WHERE id = p_solicitud_id AND estatus = 'pendiente'
    ) INTO v_solicitud_existe;
    
    IF NOT v_solicitud_existe THEN
        RAISE EXCEPTION 'Solicitud no encontrada o no está pendiente';
    END IF;
    
    -- Actualizar la solicitud
    UPDATE solicitudes
    SET 
        estatus = 'aprobada',
        aprobado_por = p_usuario_id,
        fecha_aprobacion = CURRENT_TIMESTAMP,
        comentarios = p_comentarios
    WHERE id = p_solicitud_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
```

### Función: rechazar_solicitud

```sql
CREATE OR REPLACE FUNCTION rechazar_solicitud(
    p_solicitud_id INTEGER,
    p_usuario_id INTEGER,
    p_comentarios TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_solicitud_existe BOOLEAN;
BEGIN
    -- Verificar que la solicitud existe y está pendiente
    SELECT EXISTS(
        SELECT 1 FROM solicitudes 
        WHERE id = p_solicitud_id AND estatus = 'pendiente'
    ) INTO v_solicitud_existe;
    
    IF NOT v_solicitud_existe THEN
        RAISE EXCEPTION 'Solicitud no encontrada o no está pendiente';
    END IF;
    
    -- Actualizar la solicitud
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
```

---

## 🔒 Triggers de Auditoría

### Trigger: Auditar cambios en solicitudes

```sql
CREATE OR REPLACE FUNCTION auditoria_solicitudes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
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
            row_to_json(OLD),
            row_to_json(NEW)
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auditoria_solicitudes
    AFTER UPDATE ON solicitudes
    FOR EACH ROW
    WHEN (OLD.* IS DISTINCT FROM NEW.*)
    EXECUTE FUNCTION auditoria_solicitudes();
```

---

## 📝 Datos de Prueba

```sql
-- Insertar usuarios de prueba (contraseñas hasheadas con bcrypt)
INSERT INTO usuarios (username, password_hash, nombre, email, rol) VALUES
    ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Administrador', 'admin@escuela.edu', 'admin'),
    ('director', '$2a$10$Nm5YJeBaSGd4Cy5.P7eB8uFBDWg.ZJGlnqaIJA.HfGxJNnQE0A8Iu', 'Director', 'director@escuela.edu', 'director'),
    ('control', '$2a$10$3xVvD7CbGPnkqKUOzUvYVOPxXR0Jgm3Z5UwNlB.0m9a.qfA0v/1yW', 'Control Escolar', 'control@escuela.edu', 'control_escolar');

-- Insertar alumno de prueba
INSERT INTO alumnos (nombre, apellido_paterno, apellido_materno, curp, fecha_nacimiento, telefono, email, direccion)
VALUES ('Juan', 'Pérez', 'García', 'PEGJ000101HDFRXN09', '2000-01-01', '5512345678', 'juan.perez@alumno.edu', 'Calle Principal 123');

-- Insertar solicitud de prueba
INSERT INTO solicitudes (alumno_id, carrera_id, tipo, turno)
VALUES (1, 1, 'nuevo_ingreso', 'matutino');
```

---

## 🎯 Consultas Útiles

### Estadísticas por carrera

```sql
SELECT 
    c.nombre as carrera,
    COUNT(*) FILTER (WHERE s.estatus = 'pendiente') as pendientes,
    COUNT(*) FILTER (WHERE s.estatus = 'aprobada') as aprobadas,
    COUNT(*) FILTER (WHERE s.estatus = 'rechazada') as rechazadas,
    COUNT(*) as total
FROM carreras c
LEFT JOIN solicitudes s ON c.id = s.carrera_id
GROUP BY c.id, c.nombre
ORDER BY c.nombre;
```

### Solicitudes por período

```sql
SELECT 
    DATE_TRUNC('month', fecha_solicitud) as mes,
    tipo,
    COUNT(*) as cantidad
FROM solicitudes
WHERE fecha_solicitud >= CURRENT_DATE - INTERVAL '6 months'
GROUP BY mes, tipo
ORDER BY mes DESC, tipo;
```

### Rendimiento de aprobaciones por usuario

```sql
SELECT 
    u.nombre,
    COUNT(*) as total_aprobaciones,
    COUNT(*) FILTER (WHERE s.tipo = 'nuevo_ingreso') as nuevos_ingresos,
    COUNT(*) FILTER (WHERE s.tipo = 'reinscripcion') as reinscripciones
FROM usuarios u
JOIN solicitudes s ON u.id = s.aprobado_por
WHERE s.estatus = 'aprobada'
GROUP BY u.id, u.nombre
ORDER BY total_aprobaciones DESC;
```

---

## 📚 Próximos Pasos

1. Ejecutar los scripts SQL en PostgreSQL
2. Configurar el backend con Node.js + Express
3. Implementar Prisma o Sequelize como ORM
4. Crear los endpoints REST API
5. Conectar el frontend React actual
6. Migrar datos de IndexedDB a PostgreSQL

---

**Esquema diseñado el:** 2025-11-04  
**Versión:** 1.0.0  
**Estado:** ✅ Listo para implementación

