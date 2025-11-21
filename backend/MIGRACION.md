# Pasos para Aplicar los Cambios al Schema

## 1. Crear la migración

```bash
cd backend
npx prisma migrate dev --name add_usuario_temporal_y_aspirante
```

Esto creará:
- Nueva migración SQL
- Actualizará Prisma Client

## 2. Verificar que se generó correctamente

```bash
npx prisma generate
```

## 3. Si hay problemas, puedes hacer reset (⚠️ BORRA DATOS)

```bash
npx prisma migrate reset
```

## Cambios que se aplicarán:

1. **Enum RolUsuario**: Agregar valor `aspirante`
2. **Tabla usuarios**: Agregar campo `temporal BOOLEAN DEFAULT false`
3. **Tabla fichas_examen**: Agregar campo `usuario_id INT UNIQUE`
4. **Constraint**: Foreign key de `fichas_examen.usuario_id` a `usuarios.id` con CASCADE DELETE

## Nota:
Los cambios son compatibles con datos existentes.
El campo `temporal` se agregará como `false` para todos los usuarios existentes.
