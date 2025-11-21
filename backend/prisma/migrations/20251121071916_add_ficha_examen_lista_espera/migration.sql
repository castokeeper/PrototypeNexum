/*
  Warnings:

  - A unique constraint covering the columns `[ficha_examen_id]` on the table `alumnos` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "EstatusFicha" AS ENUM ('pendiente', 'programado', 'presentado', 'aprobado', 'rechazado', 'cancelado');

-- CreateEnum
CREATE TYPE "EstadoEspera" AS ENUM ('en_espera', 'aceptado', 'rechazado', 'cancelado', 'expirado');

-- CreateEnum
CREATE TYPE "EstatusAlumno" AS ENUM ('aspirante', 'activo', 'baja_temporal', 'egresado', 'baja_definitiva');

-- AlterTable
ALTER TABLE "alumnos" ADD COLUMN     "estatus_alumno" "EstatusAlumno" NOT NULL DEFAULT 'activo',
ADD COLUMN     "ficha_examen_id" INTEGER,
ADD COLUMN     "semestre_actual" SMALLINT DEFAULT 1;

-- CreateTable
CREATE TABLE "fichas_examen" (
    "id" SERIAL NOT NULL,
    "folio" VARCHAR(20) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido_paterno" VARCHAR(100) NOT NULL,
    "apellido_materno" VARCHAR(100) NOT NULL,
    "curp" VARCHAR(18) NOT NULL,
    "fecha_nacimiento" DATE NOT NULL,
    "telefono" VARCHAR(15) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "direccion" TEXT,
    "carrera_id" INTEGER NOT NULL,
    "turno_preferido" "TurnoEnum" NOT NULL,
    "fecha_examen" TIMESTAMP,
    "lugar_examen" VARCHAR(255),
    "estatus" "EstatusFicha" NOT NULL DEFAULT 'pendiente',
    "calificacion" REAL,
    "aprobado" BOOLEAN,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "fichas_examen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lista_espera" (
    "id" SERIAL NOT NULL,
    "ficha_id" INTEGER NOT NULL,
    "posicion" INTEGER NOT NULL,
    "estado_actual" "EstadoEspera" NOT NULL DEFAULT 'en_espera',
    "fecha_ingreso" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_aceptacion" TIMESTAMP,
    "fecha_rechazo" TIMESTAMP,
    "observaciones" TEXT,

    CONSTRAINT "lista_espera_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fichas_examen_folio_key" ON "fichas_examen"("folio");

-- CreateIndex
CREATE UNIQUE INDEX "fichas_examen_curp_key" ON "fichas_examen"("curp");

-- CreateIndex
CREATE UNIQUE INDEX "fichas_examen_email_key" ON "fichas_examen"("email");

-- CreateIndex
CREATE INDEX "fichas_examen_folio_idx" ON "fichas_examen"("folio");

-- CreateIndex
CREATE INDEX "fichas_examen_curp_idx" ON "fichas_examen"("curp");

-- CreateIndex
CREATE INDEX "fichas_examen_email_idx" ON "fichas_examen"("email");

-- CreateIndex
CREATE INDEX "fichas_examen_estatus_idx" ON "fichas_examen"("estatus");

-- CreateIndex
CREATE INDEX "fichas_examen_carrera_id_idx" ON "fichas_examen"("carrera_id");

-- CreateIndex
CREATE INDEX "fichas_examen_created_at_idx" ON "fichas_examen"("created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "lista_espera_ficha_id_key" ON "lista_espera"("ficha_id");

-- CreateIndex
CREATE INDEX "lista_espera_posicion_idx" ON "lista_espera"("posicion");

-- CreateIndex
CREATE INDEX "lista_espera_estado_actual_idx" ON "lista_espera"("estado_actual");

-- CreateIndex
CREATE INDEX "lista_espera_fecha_ingreso_idx" ON "lista_espera"("fecha_ingreso" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "alumnos_ficha_examen_id_key" ON "alumnos"("ficha_examen_id");

-- AddForeignKey
ALTER TABLE "alumnos" ADD CONSTRAINT "alumnos_ficha_examen_id_fkey" FOREIGN KEY ("ficha_examen_id") REFERENCES "fichas_examen"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fichas_examen" ADD CONSTRAINT "fichas_examen_carrera_id_fkey" FOREIGN KEY ("carrera_id") REFERENCES "carreras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lista_espera" ADD CONSTRAINT "lista_espera_ficha_id_fkey" FOREIGN KEY ("ficha_id") REFERENCES "fichas_examen"("id") ON DELETE CASCADE ON UPDATE CASCADE;
