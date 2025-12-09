# Sistema de Reinscripciones

<!-- Badges de Estado -->
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Status](https://img.shields.io/badge/status-operational-success)
![License](https://img.shields.io/badge/license-MIT-green)

<!-- Badges de Frontend -->
![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.1.14-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.17-06B6D4?logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7.9.4-CA4245?logo=reactrouter&logoColor=white)

<!-- Badges de Backend -->
![Express](https://img.shields.io/badge/Express-5.1.0-000000?logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6.19.0-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens&logoColor=white)

<!-- Badges de Servicios -->
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?logo=stripe&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)

---

Sistema web completo con frontend (React + Vite) y backend (Express + Prisma + PostgreSQL) para gestionar el proceso de inscripción y reinscripción de alumnos con panel administrativo.


## 🏗️ Arquitectura Monorepo

Proyecto organizado como **monorepo** con frontend y backend completamente separados:

```
prototipo/
├── frontend/              # React + Vite (puerto 5173)
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js    # Proxy configurado
│   └── README.md
├── backend/               # Express + Prisma (puerto 3000)
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   ├── SETUP.md          # Guía de configuración
│   ├── AZURE-SETUP.md    # Guía Azure PostgreSQL
│   └── SECURITY-AUDIT.md # Reporte de seguridad
├── package.json           # Scripts coordinados
├── MIGRATION.md           # Guía de cambios
└── PAYMENT-SYSTEMS.md     # Sistemas de pago
```

### Beneficios

✅ **Sin conflictos de dependencias** - Frontend y backend independientes  
✅ **Desarrollo paralelo** - Equipos pueden trabajar sin interferir  
✅ **Deploy independiente** - Frontend y backend en diferentes hosts  
✅ **Mejor organización** - Código claramente separado  
✅ **Escalabilidad** - Fácil de escalar cada parte

---

## 🚀 Inicio Rápido

### Instalación Completa

```bash
# Clonar repositorio
git clone <url-del-repo>
cd prototipo

# Instalar TODAS las dependencias
npm run install:all
```

### Configurar Backend

1. **Configurar Base de Datos** (elige una opción):

   **Opción A: PostgreSQL Local**
   ```bash
   # Instalar PostgreSQL
   # Crear base de datos "reinscripciones"
   ```

   **Opción B: Azure Database for PostgreSQL** (Recomendado)
   ```bash
   # Ver guía completa en backend/AZURE-SETUP.md
   # Crear servidor en Azure Portal
   # Configurar firewall
   ```

2. **Configurar Variables de Entorno**:
   ```bash
   cd backend
   
   # Copiar template
   cp .env.example .env
   
   # Editar .env con tus credenciales
   # DATABASE_URL=postgresql://user:pass@host:5432/dbname?sslmode=require
   ```

3. **Ejecutar Migraciones**:
   ```bash
   # Generar Prisma Client
   npm run prisma:generate
   
   # Crear tablas
   npm run prisma:migrate
   
   # Poblar datos iniciales
   npm run prisma:seed
   ```

### Configurar Frontend

```bash
cd frontend

# Copiar template (opcional)
cp .env.example .env.local

# Ya configurado con proxy a localhost:3000
```

### Iniciar Sistema

```bash
# Desde la raíz - Inicia frontend Y backend
npm run dev

# O por separado:
npm run dev:frontend  # Solo frontend (puerto 5173)
npm run dev:backend   # Solo backend (puerto 3000)
```

---

## 🎯 Características

### Frontend
- ✅ Panel de nuevo ingreso y reinscripción
- ✅ Validaciones robustas (CURP, email, teléfono)
- ✅ Panel administrativo con autenticación
- ✅ Vista de alumnos aceptados
- ✅ Sistema de tema claro/oscuro
- ✅ Interfaz responsive y moderna
- ✅ Notificaciones toast
- ✅ Enrutamiento con React Router v7

### Backend
- ✅ API REST con endpoints seguros
- ✅ Autenticación JWT con bcrypt
- ✅ Base de datos PostgreSQL con Prisma ORM
- ✅ Validación de datos (express-validator)
- ✅ Rate limiting y seguridad (Helmet)
- ✅ Upload de archivos (Multer + Sharp)
- ✅ Sistema de auditoría
- ✅ Soporte para Azure PostgreSQL
- ✅ SSL/TLS configurado

---

## 📦 Tecnologías

### Frontend
| Tecnología | Versión | Uso |
|------------|---------|-----|
| React | 19.1.1 | UI Framework |
| Vite | 6.0.11 | Build Tool |
| React Router | 7.9.4 | Enrutamiento |
| Lucide React | 0.546.0 | Iconos |
| React Toastify | 11.0.5 | Notificaciones |

### Backend
| Tecnología | Versión | Uso |
|------------|---------|-----|
| Express.js | 4.18.2 | Web Framework |
| Prisma | 6.19.0 | ORM |
| PostgreSQL | 15+ | Base de Datos |
| JWT | 9.0.2 | Autenticación |
| bcrypt | 5.1.1 | Hash de passwords |
| Helmet | 7.1.0 | Seguridad |
| Multer | 1.4.5 | Subida de archivos |
| Sharp | 0.33.1 | Procesamiento imágenes |

---

## 📚 Comandos Disponibles

### Desarrollo

```bash
# Sistema completo
npm run dev              # Frontend + Backend simultáneamente

# Componentes individuales
npm run dev:frontend     # Solo frontend (puerto 5173)
npm run dev:backend      # Solo backend (puerto 3000)
```

### Base de Datos

```bash
cd backend

npm run prisma:generate  # Generar Prisma Client
npm run prisma:migrate   # Ejecutar migraciones
npm run prisma:seed      # Poblar datos iniciales
npm run prisma:studio    # Abrir Prisma Studio (GUI)
```

### Build

```bash
npm run build            # Build de ambos
npm run build:frontend   # Build solo frontend
```

### Mantenimiento

```bash
npm run install:all      # Instalar todas las dependencias
npm run lint            # Lint de ambos proyectos
npm run lint:frontend   # Lint solo frontend
npm run lint:backend    # Lint solo backend (si configurado)
```

---

## 🔐 Configuración

### Variables de Entorno

#### Backend (`backend/.env`)
```env
# Database (Azure o local)
DATABASE_URL="postgresql://user:pass@host:5432/dbname?sslmode=require"

# JWT
JWT_SECRET="tu-secret-key-cambiar-en-produccion"
JWT_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV=development

# CORS
FRONTEND_URL="http://localhost:5173"
```

**Ejemplos de DATABASE_URL**:
- **Azure**: `postgresql://user:pass@servidor.postgres.database.azure.com:5432/reinscripciones?sslmode=require`
- **Local**: `postgresql://postgres:password@localhost:5432/reinscripciones`
- **Neon**: `postgresql://user:pass@ep-xxx.region.neon.tech/dbname?sslmode=require`

#### Frontend (`frontend/.env.local`)
```env
VITE_API_URL=http://localhost:5173
VITE_APP_NAME=Sistema de Reinscripciones
```

---

## 🗄️ Base de Datos

### Schema Principal

| Tabla | Descripción |
|-------|-------------|
| `usuarios` | Usuarios administrativos (admin, director, control_escolar) |
| `alumnos` | Datos de alumnos |
| `solicitudes` | Solicitudes de inscripción/reinscripción |
| `carreras` | Catálogo de carreras |
| `documentos` | Archivos adjuntos |
| `auditoria` | Registro de cambios |

Ver detalles completos en [`DATABASE-SCHEMA.md`](./DATABASE-SCHEMA.md)

### Usuarios por Defecto

Después de ejecutar `npm run prisma:seed`:

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin | admin123 | Administrador |
| director | director123 | Director |
| control | control123 | Control Escolar |

⚠️ **Cambiar en producción**

---

## 💳 Sistema de Pagos

Se documentaron 5 opciones de pago optimizadas para México:

| Proveedor | Desarrollo | Producción | Comisión |
|-----------|------------|------------|----------|
| **Stripe** | ⭐⭐⭐ | ✅ | 3.6% + $3 |
| **Conekta** | ✅ | ⭐⭐⭐ | 3.5% + $3 |
| **Mercado Pago** | ✅ | ✅ | 3.99% + IVA |
| **PayPal** | ✅ | ✅ | 4.4% + fija |
| **OpenPay** | ✅ | ⭐⭐ | 2.9% + $2.5 |

Ver guía completa con ejemplos de código en [`PAYMENT-SYSTEMS.md`](./PAYMENT-SYSTEMS.md)

**Recomendación**:
- **Desarrollo**: Stripe (mejor documentación y testing)
- **Producción México**: Conekta (OXXO + SPEI)

---

## 🔒 Seguridad

### Implementado

- ✅ JWT para autenticación
- ✅ bcrypt para hash de passwords
- ✅ Helmet.js para headers de seguridad
- ✅ CORS configurado
- ✅ Rate limiting (100 req/15min)
- ✅ Validación de entrada
- ✅ SSL/TLS con Azure

### Auditoría

Ver reporte completo en [`backend/SECURITY-AUDIT.md`](./backend/SECURITY-AUDIT.md)

**Estado actual**: 
- ⚠️ 3 vulnerabilidades en dependencias de desarrollo (no producción)
- ✅ Sistema seguro en producción

---

## Documentación

| Documento | Descripción |
|-----------|-------------|
| [`README.md`](./README.md) | Este archivo |
| [`docs/dev-log/DEV-LOG.md`](./docs/dev-log/DEV-LOG.md) | Bitácora de desarrollo |
| [`STRIPE-SETUP.md`](./STRIPE-SETUP.md) | Configuración de Stripe |
| [`backend/AZURE-SETUP.md`](./backend/AZURE-SETUP.md) | Guía de Azure PostgreSQL |
| [`backend/SECURITY-AUDIT.md`](./backend/SECURITY-AUDIT.md) | Reporte de seguridad |

---

## 🚢 Deployment

### Frontend (Recomendaciones)

- **Vercel** (Recomendado): Deploy automático desde GitHub
- **Netlify**: Alternativa con CI/CD
- **GitHub Pages**: Para sitios estáticos

```bash
cd frontend
npm run build
# Subir carpeta dist/
```

### Backend (Recomendaciones)

- **Railway**: Simple y con PostgreSQL incluido
- **Render**: Free tier disponible
- **Azure App Service**: Integrado con Azure PostgreSQL
- **Heroku**: Clásico (requiere plan de pago)

**Variables de entorno requeridas**:
- `DATABASE_URL`
- `JWT_SECRET`
- `FRONTEND_URL`

### Base de Datos

- **Azure Database for PostgreSQL**: Recomendado ($12-15/mes)
- **Neon**: Free tier disponible
- **Supabase**: Alternativa gratuita
- **Railway**: Incluido con el backend

---

## 🛠️ Desarrollo

### Estructura de Código

#### Frontend
```
frontend/src/
├── components/       # Componentes reutilizables
├── pages/           # Páginas principales
├── context/         # Context API
├── hooks/           # Custom hooks
├── services/        # API services
└── utils/           # Utilidades
```

#### Backend
```
backend/src/
├── config/          # Configuraciones
├── controllers/     # Lógica de negocio
├── middlewares/     # Middlewares
├── routes/          # Rutas de la API
└── utils/           # Utilidades
```

### Agregar Nuevas Dependencias

```bash
# Frontend
cd frontend
npm install nombre-paquete

# Backend
cd backend
npm install nombre-paquete
```

---

## 🐛 Solución de Problemas

### Backend no inicia

1. Verificar que PostgreSQL esté corriendo
2. Verificar credenciales en `.env`
3. Ejecutar `npm run prisma:generate`

### Frontend no conecta al backend

1. Verificar que backend esté en puerto 3000
2. Verificar proxy en `frontend/vite.config.js`
3. Verificar CORS en backend

### Error de Prisma

```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

### Problemas con Azure

Ver sección "Solución de Problemas" en [`backend/AZURE-SETUP.md`](./backend/AZURE-SETUP.md)

---

## 📊 Estado del Proyecto

- ✅ Arquitectura monorepo implementada
- ✅ Frontend operacional
- ✅ Backend operacional  
- ✅ Azure PostgreSQL configurado
- ✅ Migraciones ejecutadas
- ✅ Documentación completa
- ✅ Sistema de pagos documentado
- ⚠️ Pendiente: Implementación de pagos
- ⚠️ Pendiente: Tests automatizados

---

## 👥 Contribuir

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add: Amazing Feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

---

## 🆘 Soporte

¿Problemas o preguntas?

1. Revisar la documentación en `/backend` y `/frontend`
2. Revisar [`MIGRATION.md`](./MIGRATION.md) para cambios recientes
3. Revisar issues en el repositorio

---

**Última actualización**: 2025-11-21  
**Versión**: 1.0.0  
**Estado**: ✅ Operacional
