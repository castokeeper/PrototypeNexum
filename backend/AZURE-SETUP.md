# 🌐 Configuración de Azure Database for PostgreSQL

Guía completa para configurar Azure Database for PostgreSQL con el backend del sistema de reinscripciones.

---

## 📋 Requisitos Previos

- Cuenta de Azure activa (puedes crear una gratuita en [azure.microsoft.com](https://azure.microsoft.com))
- Azure CLI instalado (opcional pero recomendado)

---

## 🚀 Opción 1: Crear Base de Datos desde Azure Portal

### Paso 1: Crear el Servidor PostgreSQL

1. Inicia sesión en [Azure Portal](https://portal.azure.com)

2. Busca "Azure Database for PostgreSQL" en la barra de búsqueda

3. Haz clic en **"Crear"** → **"Servidor flexible"** (recomendado para desarrollo)

4. Configuración básica:
   - **Suscripción**: Selecciona tu suscripción
   - **Grupo de recursos**: Crea uno nuevo o usa existente (ej: `rg-reinscripciones`)
   - **Nombre del servidor**: Elige un nombre único (ej: `reinscripciones-db-server`)
   - **Región**: Selecciona la más cercana a ti (ej: `East US`, `Central US`)
   - **Versión de PostgreSQL**: `15` o superior
   - **Tipo de carga de trabajo**: `Development` (para comenzar)

5. Autenticación:
   - **Método**: Solo autenticación de PostgreSQL
   - **Usuario admin**: `adminuser` (o el que prefieras)
   - **Contraseña**: Crea una contraseña segura y guárdala

6. Redes:
   - **Conectividad**: Acceso público
   - **Reglas de firewall**: 
     - ☑️ Permitir acceso público desde cualquier servicio de Azure
     - ☑️ Agregar dirección IP actual del cliente
     - O agregar regla: `0.0.0.0` - `255.255.255.255` (⚠️ solo para desarrollo)

7. Revisa y crea (puede tomar 5-10 minutos)

### Paso 2: Crear la Base de Datos

1. Una vez creado el servidor, ve al recurso

2. En el menú lateral, busca **"Bases de datos"**

3. Haz clic en **"+ Agregar"**

4. Configuración:
   - **Nombre**: `reinscripciones`
   - **Conjunto de caracteres**: `UTF8`

5. Crear

---

## 🔗 Obtener la Cadena de Conexión

### Desde Azure Portal

1. Ve a tu servidor PostgreSQL en el portal

2. En **"Información general"**, encontrarás:
   - **Nombre del servidor**: `nexumdb.postgres.database.azure.com`
   - **Usuario admin**: `nexumowner`

3. La cadena de conexión será:

```
postgresql://nexumowner:$R7eP4SJ4S6@uF9M5t2Z!3@nexumdb.postgres.database.azure.com:5432/reinscripciones?sslmode=require
```

## ⚙️ Configurar el Backend

### 1. Actualizar `.env`

Crea o edita el archivo `backend/.env`:

```env
# Azure PostgreSQL
DATABASE_URL="postgresql://adminuser:TU_PASSWORD@reinscripciones-db-server.postgres.database.azure.com:5432/reinscripciones?sslmode=require"

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

### 2. Ejecutar Migraciones

```bash
cd backend

# Generar Prisma Client
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# Poblar con datos iniciales
npm run prisma:seed
```

### 3. Verificar Conexión

```bash
# Abrir Prisma Studio para ver los datos
npm run prisma:studio
```

---

## 🔐 Configuración SSL (Recomendado para Producción)

Azure require SSL por defecto. Para producción, descarga el certificado:

### Opción A: Con sslmode=require (más simple)

Ya está incluido en la cadena de conexión:
```
?sslmode=require
```

### Opción B: Con certificado (más seguro)

1. Descarga el certificado de Azure:
   - [DigiCertGlobalRootCA.crt.pem](https://www.digicert.com/CACerts/DigiCertGlobalRootCA.crt)

2. Guárdalo en `backend/certs/DigiCertGlobalRootCA.crt.pem`

3. Actualiza la conexión en `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

4. Actualiza `.env`:

```env
DATABASE_URL="postgresql://adminuser:PASSWORD@servidor.postgres.database.azure.com:5432/reinscripciones?sslmode=require&sslcert=./certs/DigiCertGlobalRootCA.crt.pem"
```

---

## 💰 Costos y Niveles de Servicio

### Nivel Gratuito / Desarrollo

- **Burstable B1ms**: ~$12-15 USD/mes
  - 1 vCore
  - 2 GB RAM
  - 32 GB almacenamiento

### Producción

- **General Purpose D2s_v3**: ~$100-120 USD/mes
  - 2 vCores
  - 8 GB RAM
  - Mejor rendimiento

### Optimización de Costos

1. **Detener cuando no uses**: Azure permite detener el servidor (no cobra cómputo)
2. **Escalado automático**: Solo paga por lo que usas (Burstable)
3. **Región**: Algunas regiones son más baratas

---

## 🔍 Solución de Problemas

### Error: "Connection timed out"

**Solución:**
1. Verifica las reglas de firewall en Azure
2. Agrega tu IP actual en el portal de Azure
3. Asegúrate de tener `?sslmode=require` en la cadena de conexión

### Error: "SSL required"

**Solución:**
Agrega `?sslmode=require` al final de la `DATABASE_URL`

### Error: "password authentication failed"

**Solución:**
1. Verifica el usuario y contraseña
2. En Azure Portal → Servidor → Restablecer contraseña
3. Actualiza el archivo `.env`

### Error: "database does not exist"

**Solución:**
Crea la base de datos en Azure Portal o con CLI:
```bash
az postgres flexible-server db create \
  --resource-group rg-reinscripciones \
  --server-name reinscripciones-db-server \
  --database-name reinscripciones
```

---

## 🎯 Verificación Final

### 1. Probar Conexión

```bash
# Desde tu máquina local con psql
psql "postgresql://adminuser:PASSWORD@servidor.postgres.database.azure.com:5432/reinscripciones?sslmode=require"
```

### 2. Verificar Tablas

```sql
-- Ver todas las tablas
\dt

-- Ver datos de usuarios
SELECT * FROM usuarios;

-- Ver carreras
SELECT * FROM carreras;
```

### 3. Iniciar el Backend

```bash
cd backend
npm run dev
```

Deberías ver:
```
╔════════════════════════════════════════════════════════╗
║  🚀 Servidor iniciado exitosamente                     ║
║  📡 URL: http://localhost:3000                         ║
║  🗄️  Base de datos: Azure PostgreSQL conectada        ║
╚════════════════════════════════════════════════════════╝
```

---

## 📊 Monitoreo en Azure

1. **Métricas**: En Azure Portal → tu servidor → Métricas
   - Conexiones activas
   - CPU y memoria
   - Operaciones de I/O

2. **Logs**: Insights → Logs
   - Ver queries lentas
   - Errores de conexión

3. **Alertas**: Configurar notificaciones
   - CPU > 80%
   - Conexiones > umbral

---

## 🚀 Despliegue a Producción

Cuando estés listo para producción:

1. **Cambiar a plan de producción** (General Purpose)
2. **Habilitar backups automáticos** (7-35 días de retención)
3. **Configurar alta disponibilidad** (zona redundante)
4. **Restringir firewall** (solo IPs de tu app en producción)
5. **Usar variables de entorno** en tu plataforma de hosting

---

## 📚 Recursos Adicionales

- [Documentación Azure PostgreSQL](https://learn.microsoft.com/azure/postgresql/)
- [Precios de Azure Database for PostgreSQL](https://azure.microsoft.com/pricing/details/postgresql/)
- [Mejores prácticas de seguridad](https://learn.microsoft.com/azure/postgresql/flexible-server/concepts-security)
- [Guía de migración](https://learn.microsoft.com/azure/postgresql/migrate/how-to-migrate-online)

---

**Fecha de creación**: 2025-11-20  
**Versión**: 1.0.0  
**Estado**: ✅ Listo para uso
