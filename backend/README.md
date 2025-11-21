# Backend - Sistema de Reinscripciones

API REST construida con Express.js y Prisma ORM para el sistema de gestión de reinscripciones.

## 🚀 Tecnologías

- **Node.js** 18+
- **Express.js** - Framework web
- **Prisma** - ORM para PostgreSQL
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **bcrypt** - Hash de contraseñas
- **Multer** - Upload de archivos

## 📋 Prerequisitos

1. Node.js v18 o superior
2. PostgreSQL 15+ instalado y corriendo
3. npm o yarn

## ⚙️ Instalación

1. **Navegar a la carpeta backend**:
```bash
cd backend
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar variables de entorno**:
```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env con tus credenciales
```

Configurar `DATABASE_URL` en `.env`:
```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/reinscripciones?schema=public"
JWT_SECRET="tu-secret-key-muy-segura"
```

4. **Generar cliente de Prisma**:
```bash
npm run prisma:generate
```

5. **Ejecutar migraciones**:
```bash
npm run prisma:migrate
```

6. **Poblar base de datos inicial (seed)**:
```bash
npm run prisma:seed
```

## 🏃 Ejecutar en Desarrollo

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## 📚 Endpoints API

### Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/verify` - Verificar token
- `POST /api/auth/logout` - Cerrar sesión

### Carreras

- `GET /api/carreras` - Listar carreras (público)
- `POST /api/carreras` - Crear carrera (admin)
- `PUT /api/carreras/:id` - Actualizar carrera (admin)

### Solicitudes

- `POST /api/solicitudes` - Crear solicitud (público)
- `GET /api/solicitudes` - Listar solicitudes (admin)
- `GET /api/solicitudes/:id` - Ver solicitud (admin)
- `GET /api/solicitudes/aceptados` - Ver aceptados (público)
- `GET /api/solicitudes/estadisticas` - Estadísticas (admin)
- `PUT /api/solicitudes/:id/aprobar` - Aprobar (admin)
- `PUT /api/solicitudes/:id/rechazar` - Rechazar (admin)

### Archivos

- `POST /api/archivos/upload` - Subir comprobante (público)
- `GET /api/archivos/:id` - Descargar archivo (autenticado)
- `DELETE /api/archivos/:id` - Eliminar archivo (admin)

## 🔐 Credenciales de Prueba

Después de ejecutar el seed:

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| admin | admin123 | Administrador |
| director | dir123 | Director |
| control | ctrl123 | Control Escolar |

## 🗄️ Comandos de Prisma

```bash
# Ver base de datos en navegador
npm run prisma:studio

# Crear nueva migración
npm run prisma:migrate

# Generar cliente
npm run prisma:generate

# Resetear base de datos (¡CUIDADO!)
npx prisma migrate reset
```

## 📁 Estructura

```
backend/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.js
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── jwt.js
│   │   └── multer.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── solicitudesController.js
│   │   ├── carrerasController.js
│   │   └── archivosController.js
│   ├── middlewares/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── solicitudes.routes.js
│   │   ├── carreras.routes.js
│   │   └── archivos.routes.js
│   └── server.js
├── uploads/
├── .env
├── .env.example
└── package.json
```

## 🔒 Seguridad

- JWT para autenticación
- bcrypt para hash de contraseñas
- Rate limiting en endpoints
- CORS configurado
- Helmet para headers de seguridad
- Validación de archivos subidos

## 🚀 Deployment

Para producción, asegúrate de:

1. Cambiar `JWT_SECRET` a un valor seguro
2. Configurar `NODE_ENV=production`
3. Usar base de datos PostgreSQL en la nube
4. Configurar `FRONTEND_URL` correctamente
5. Cambiar las contraseñas por defecto

## 🛠️ Troubleshooting

### Error: Can't reach database server
- Verifica que PostgreSQL esté corriendo
- Verifica las credenciales en `DATABASE_URL`

### Error: Prisma Client not generated
```bash
npm run prisma:generate
```

### Error: Migration failed
```bash
npx prisma migrate reset
npm run prisma:migrate
```
