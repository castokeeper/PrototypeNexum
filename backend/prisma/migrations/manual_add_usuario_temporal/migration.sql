-- CreateEnum para agregar 'aspirante' al RolUsuario
ALTER TYPE "RolUsuario" ADD VALUE IF NOT EXISTS 'aspirante';

-- Agregar campo temporal a usuarios
ALTER TABLE "usuarios" ADD COLUMN IF NOT EXISTS "temporal" BOOLEAN NOT NULL DEFAULT false;

-- Agregar campo usuario_id a fichas_examen
ALTER TABLE "fichas_examen" ADD COLUMN IF NOT EXISTS "usuario_id" INTEGER;

-- Agregar constraint de unique
ALTER TABLE "fichas_examen" ADD CONSTRAINT "fichas_examen_usuario_id_key" UNIQUE ("usuario_id");

-- Agregar foreign key con CASCADE DELETE
ALTER TABLE "fichas_examen" ADD CONSTRAINT "fichas_examen_usuario_id_fkey" 
  FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Crear índice para usuario_id
CREATE INDEX IF NOT EXISTS "fichas_examen_usuario_id_idx" ON "fichas_examen"("usuario_id");
