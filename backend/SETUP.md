# 🚀 Guía de Configuración del Backend

Esta guía te ayudará a configurar y ejecutar el backend del sistema de reinscripciones.

## ✅ Lo que ya está hecho

- ✅ Estructura del proyecto backend creada
- ✅ Dependencias instaladas (Express, Prisma, bcrypt, JWT, etc.)
- ✅ Controllers, routes y middlewares implementados
- ✅ Schema de Prisma configurado
- ✅ Seed script para datos iniciales

## 📋 Pasos para completar la configuración

### 1. Configurar PostgreSQL

Tienes tres opciones:

#### Opción A: PostgreSQL Local (Recomendado para desarrollo inicial)

1. **Descargar PostgreSQL**:
   - Ve a https://www.postgresql.org/download/windows/
   - Descarga e instala PostgreSQL 15 o superior
   - Durante la instalación, establece una contraseña para el usuario `postgres`

2. **Crear la base de datos**:
   ```bash
   # Abrir PowerShell
   # Conectarse a PostgreSQL
   psql -U postgres
   
   # Crear base de datos
   CREATE DATABASE reinscripciones;
   
   # Salir
   \q
   ```

#### Opción B: Azure Database for PostgreSQL (🌟 Recomendado para producción)

**Ver guía completa**: [`AZURE-SETUP.md`](./AZURE-SETUP.md)

**Resumen rápido:**
1. Crear servidor PostgreSQL en Azure Portal
2. Configurar firewall para permitir tu IP
3. Crear base de datos "reinscripciones"
4. Obtener cadena de conexión
5. Usar en `.env`:
   ```
   DATABASE_URL="postgresql://USER:PASS@servidor.postgres.database.azure.com:5432/reinscripciones?sslmode=require"
   ```

**Checklist paso a paso**: Ver [`AZURE-CHECKLIST.md`](./AZURE-CHECKLIST.md)

#### Opción C: PostgreSQL en la nube (Alternativas gratuitas)

Servicios gratuitos recomendados:
- **Neon** (https://neon.tech) - 3GB gratis
- **ElephantSQL** (https://www.elephantsql.com) - 20MB gratis
- **Supabase** (https://supabase.com) - 500MB gratis
- **Railway** (https://railway.app) - $5 gratis

### 2. Configurar Variables de Entorno

El archivo `.env` está en `.gitignore` por seguridad. Debes crearlo manualmente:

```bash
cd backend
```

Crear archivo `.env` con el siguiente contenido:

```env
# Database - CAMBIAR según tu configuración
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/reinscripciones?schema=public"

# JWT
JWT_SECRET="reinscripciones-secret-key-2024-change-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV=development

# CORS
FRONTEND_URL="http://localhost:5173"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH="./uploads"
```

**Importante**: Cambia `TU_PASSWORD` por la contraseña de tu PostgreSQL.

Si usas servicio en la nube, la `DATABASE_URL` se verá así:
```
postgresql://user:password@host.region.provider.com:5432/database
```

### 3. Generar Cliente de Prisma

```bash
npm run prisma:generate
```

### 4. Ejecutar Migraciones

Esto creará las tablas en la base de datos:

```bash
npm run prisma:migrate
```

Si te pregunta el nombre de la migración, puedes poner: `init`

### 5. Poblar Base de Datos (Seed)

Esto creará:
- 3 usuarios administradores
- 7 carreras
- 1 alumno de prueba
- 1 solicitud de prueba

```bash
npm run prisma:seed
```

### 6. ¡Iniciar el Servidor!

```bash
npm run dev
```

Deberías ver:
```
╔════════════════════════════════════════════════════════╗
║  🚀 Servidor iniciado exitosamente                     ║
║  📡 URL: http://localhost:3000                         ║
╚════════════════════════════════════════════════════════╝
```

### 7. Verificar que Funciona

Abre tu navegador o Postman y prueba:

```
GET http://localhost:3000/health
```

Deberías recibir:
```json
{
  "status": "OK",
  "timestamp": "2024-11-19T...",
  "environment": "development"
}
```

**Probar login**:
```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

## 🎯 Siguientes Pasos

Una vez que el backend esté corriendo:

1. **Actualizar frontend** para usar el API
2. **Crear servicio API** en React (`src/services/api.js`)
3. **Migrar AuthContext** para usar JWT
4. **Actualizar componentes** para usar endpoints REST

## 🛠️ Comandos Útiles

```bash
# Ver base de datos en navegador
npm run prisma:studio

# Ver logs del servidor
npm run dev

# Resetear base de datos (¡CUIDADO!)
npx prisma migrate reset
```

## ❓ Troubleshooting

### Error: "Can't reach database server"
- Verifica que PostgreSQL esté corriendo
- Verifica las credenciales en `DATABASE_URL`
- Verifica que la base de datos `reinscripciones` existe

### Error: "Prisma Client not generated"
```bash
npm run prisma:generate
```

### Error: "Environment variable not found: DATABASE_URL"
- Asegúrate de que el archivo `.env` existe en la carpeta `backend`
- Verifica que `DATABASE_URL` está definida correctamente

### Error al ejecutar seed
- Verifica que las migraciones se ejecutaron correctamente
- Prueba resetear la base de datos: `npx prisma migrate reset`

## 📱 Credenciales de Acceso

Después del seed:

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| admin | admin123 | Administrador |
| director | dir123 | Director |
| control | ctrl123 | Control Escolar |

## 🎉 ¡Listo!

Una vez completados estos pasos, tu backend estará funcionando y listo para conectar con el frontend React.
