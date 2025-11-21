-- CreateEnum
CREATE TYPE "TipoSolicitud" AS ENUM ('nuevo_ingreso', 'reinscripcion');

-- CreateEnum
CREATE TYPE "EstatusSolicitud" AS ENUM ('pendiente', 'aprobada', 'rechazada');

-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('admin', 'director', 'control_escolar');

-- CreateEnum
CREATE TYPE "TurnoEnum" AS ENUM ('matutino', 'vespertino', 'nocturno');

-- CreateEnum
CREATE TYPE "TipoDocumento" AS ENUM ('comprobante_pago', 'identificacion', 'certificado');

-- CreateEnum
CREATE TYPE "AccionAuditoria" AS ENUM ('INSERT', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100),
    "rol" "RolUsuario" NOT NULL DEFAULT 'control_escolar',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "ultimo_acceso" TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carreras" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "codigo" VARCHAR(20),
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "carreras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alumnos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido_paterno" VARCHAR(100) NOT NULL,
    "apellido_materno" VARCHAR(100) NOT NULL,
    "curp" VARCHAR(18) NOT NULL,
    "fecha_nacimiento" DATE NOT NULL,
    "telefono" VARCHAR(15) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "direccion" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "alumnos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solicitudes" (
    "id" SERIAL NOT NULL,
    "alumno_id" INTEGER NOT NULL,
    "carrera_id" INTEGER NOT NULL,
    "tipo" "TipoSolicitud" NOT NULL,
    "estatus" "EstatusSolicitud" NOT NULL DEFAULT 'pendiente',
    "matricula" VARCHAR(20),
    "semestre" SMALLINT,
    "grupo" CHAR(1),
    "turno" "TurnoEnum" NOT NULL,
    "fecha_solicitud" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP NOT NULL,
    "aprobado_por" INTEGER,
    "fecha_aprobacion" TIMESTAMP,
    "rechazado_por" INTEGER,
    "fecha_rechazo" TIMESTAMP,
    "comentarios" TEXT,

    CONSTRAINT "solicitudes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentos" (
    "id" SERIAL NOT NULL,
    "solicitud_id" INTEGER NOT NULL,
    "tipo_documento" "TipoDocumento" NOT NULL DEFAULT 'comprobante_pago',
    "nombre_archivo" VARCHAR(255) NOT NULL,
    "ruta_archivo" TEXT NOT NULL,
    "mime_type" VARCHAR(100) NOT NULL,
    "tamaño_bytes" INTEGER NOT NULL,
    "hash_sha256" VARCHAR(64),
    "uploaded_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auditoria" (
    "id" SERIAL NOT NULL,
    "tabla_afectada" VARCHAR(50) NOT NULL,
    "registro_id" INTEGER NOT NULL,
    "accion" "AccionAuditoria" NOT NULL,
    "usuario_id" INTEGER,
    "datos_anteriores" JSONB,
    "datos_nuevos" JSONB,
    "ip_address" INET,
    "user_agent" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auditoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_username_key" ON "usuarios"("username");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_username_idx" ON "usuarios"("username");

-- CreateIndex
CREATE INDEX "usuarios_rol_idx" ON "usuarios"("rol");

-- CreateIndex
CREATE INDEX "usuarios_activo_idx" ON "usuarios"("activo");

-- CreateIndex
CREATE UNIQUE INDEX "carreras_nombre_key" ON "carreras"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "carreras_codigo_key" ON "carreras"("codigo");

-- CreateIndex
CREATE INDEX "carreras_activa_idx" ON "carreras"("activa");

-- CreateIndex
CREATE INDEX "carreras_codigo_idx" ON "carreras"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "alumnos_curp_key" ON "alumnos"("curp");

-- CreateIndex
CREATE UNIQUE INDEX "alumnos_email_key" ON "alumnos"("email");

-- CreateIndex
CREATE INDEX "alumnos_curp_idx" ON "alumnos"("curp");

-- CreateIndex
CREATE INDEX "alumnos_email_idx" ON "alumnos"("email");

-- CreateIndex
CREATE INDEX "alumnos_apellido_paterno_apellido_materno_nombre_idx" ON "alumnos"("apellido_paterno", "apellido_materno", "nombre");

-- CreateIndex
CREATE INDEX "alumnos_created_at_idx" ON "alumnos"("created_at" DESC);

-- CreateIndex
CREATE INDEX "solicitudes_alumno_id_idx" ON "solicitudes"("alumno_id");

-- CreateIndex
CREATE INDEX "solicitudes_carrera_id_idx" ON "solicitudes"("carrera_id");

-- CreateIndex
CREATE INDEX "solicitudes_tipo_idx" ON "solicitudes"("tipo");

-- CreateIndex
CREATE INDEX "solicitudes_estatus_idx" ON "solicitudes"("estatus");

-- CreateIndex
CREATE INDEX "solicitudes_fecha_solicitud_idx" ON "solicitudes"("fecha_solicitud" DESC);

-- CreateIndex
CREATE INDEX "solicitudes_matricula_idx" ON "solicitudes"("matricula");

-- CreateIndex
CREATE INDEX "solicitudes_aprobado_por_idx" ON "solicitudes"("aprobado_por");

-- CreateIndex
CREATE INDEX "documentos_solicitud_id_idx" ON "documentos"("solicitud_id");

-- CreateIndex
CREATE INDEX "documentos_tipo_documento_idx" ON "documentos"("tipo_documento");

-- CreateIndex
CREATE INDEX "documentos_uploaded_at_idx" ON "documentos"("uploaded_at" DESC);

-- CreateIndex
CREATE INDEX "auditoria_tabla_afectada_idx" ON "auditoria"("tabla_afectada");

-- CreateIndex
CREATE INDEX "auditoria_registro_id_idx" ON "auditoria"("registro_id");

-- CreateIndex
CREATE INDEX "auditoria_usuario_id_idx" ON "auditoria"("usuario_id");

-- CreateIndex
CREATE INDEX "auditoria_created_at_idx" ON "auditoria"("created_at" DESC);

-- CreateIndex
CREATE INDEX "auditoria_accion_idx" ON "auditoria"("accion");

-- AddForeignKey
ALTER TABLE "solicitudes" ADD CONSTRAINT "solicitudes_alumno_id_fkey" FOREIGN KEY ("alumno_id") REFERENCES "alumnos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes" ADD CONSTRAINT "solicitudes_carrera_id_fkey" FOREIGN KEY ("carrera_id") REFERENCES "carreras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes" ADD CONSTRAINT "solicitudes_aprobado_por_fkey" FOREIGN KEY ("aprobado_por") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes" ADD CONSTRAINT "solicitudes_rechazado_por_fkey" FOREIGN KEY ("rechazado_por") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_solicitud_id_fkey" FOREIGN KEY ("solicitud_id") REFERENCES "solicitudes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auditoria" ADD CONSTRAINT "auditoria_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
