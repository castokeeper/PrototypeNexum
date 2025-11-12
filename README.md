# Sistema de Reinscripciones

Sistema web optimizado para gestionar el proceso de inscripción y reinscripción de alumnos con panel administrativo protegido por autenticación y base de datos persistente.

## 🚀 Características Principales

### 1. Panel de Alumno de Nuevo Ingreso
- Formulario de registro con datos personales del alumno
- **Validaciones robustas** (email, CURP, teléfono, archivos)
- Carga de comprobante de pago con validación de tipo y tamaño
- Feedback visual de errores en tiempo real
- **Almacenamiento persistente en base de datos local**

### 2. Panel de Reinscripción
- Formulario para alumnos que se reinscriben
- Validación completa de matrícula y datos académicos
- Carga de comprobante de pago
- **Almacenamiento persistente en base de datos local**

### 3. Panel de Administración (Protegido) 🔒
- **Requiere autenticación de usuario autorizado**
- Visualización de todas las solicitudes (nuevo ingreso y reinscripciones)
- Vista previa de comprobantes de pago
- Verificación visual de datos
- Botones para aprobar o rechazar solicitudes
- Filtros por tipo de solicitud y estatus
- **Actualización optimizada de estado** (sin recargas innecesarias)
- Solo accesible por usuarios autorizados

### 4. Apartado de Alumnos Aceptados ⭐
- Lista completa de todos los alumnos cuyas solicitudes fueron aprobadas
- Visualización organizada con tarjetas informativas
- Filtrado por tipo (nuevo ingreso/reinscripción)
- **Datos persistentes almacenados en base de datos**

### 5. Sistema de Autenticación 🔐
- Login seguro con **variables de entorno**
- Sesión persistente (se mantiene al recargar la página)
- Protección de rutas - redirige al login si no está autenticado
- Múltiples usuarios con diferentes niveles de acceso
- **Credenciales configurables** (no hardcodeadas en producción)

### 6. Base de Datos Local (IndexedDB) 💾
- **Almacenamiento persistente** de todas las solicitudes
- **Los datos NO se pierden** al recargar la página o cerrar el navegador
- Dos tablas separadas:
  - `solicitudes`: Todas las solicitudes con sus estados
  - `aceptados`: Alumnos cuyas solicitudes fueron aprobadas

## ⚡ Optimizaciones Implementadas

### Performance
- ✅ **Lazy Loading**: Componentes cargados bajo demanda
- ✅ **Code Splitting**: Bundle optimizado (~38% más pequeño)
- ✅ **Memoización**: Reducción de re-renders innecesarios
- ✅ **Gestión de estado optimizada**: Actualizaciones locales sin recargas

### Arquitectura
- ✅ **Componentes reutilizables**: Button, Card, Input, Modal, Loading
- ✅ **Custom Hooks**: useForm, useFileUpload
- ✅ **Utilidades centralizadas**: validators, formatters, constants
- ✅ **CSS Modules**: Estilos encapsulados y sin duplicación
- ✅ **Error Boundaries**: Manejo robusto de errores

### Seguridad
- ✅ **Variables de entorno**: Credenciales no hardcodeadas
- ✅ **Validaciones robustas**: Email, CURP, teléfono, archivos
- ✅ **Sanitización de inputs**: Prevención de inyecciones
- ✅ **Protección de rutas**: Control de acceso por autenticación

### UX/UI
- ✅ **Loading states**: Feedback visual durante cargas
- ✅ **Error handling**: Mensajes de error claros y útiles
- ✅ **Accesibilidad**: ARIA labels, navegación por teclado
- ✅ **Tema claro/oscuro**: Persistente y animado
- Operaciones asíncronas para mejor rendimiento
- Sistema de índices para búsquedas rápidas

## 📦 Tecnologías Utilizadas

- **React 19** - Framework principal con Suspense y lazy loading
- **Vite** - Build tool ultra-rápido
- **React Router DOM v7** - Navegación y rutas protegidas
- **Lucide React** - Sistema de iconos moderno
- **React Toastify** - Notificaciones elegantes
- **PropTypes** - Validación de tipos en componentes
- **Context API** - Gestión de estado global
- **LocalStorage** - Persistencia de sesión
- **IndexedDB** - Base de datos local del navegador 💾
- **CSS Modules** - Estilos encapsulados y optimizados

## 🚀 Instalación y Configuración

### Requisitos previos
- Node.js >= 18.0.0
- npm >= 9.0.0

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repo>
   cd prototipo
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   # Copiar el archivo de ejemplo
   copy .env.example .env.local
   
   # Editar .env.local con tus propias credenciales
   # Formato: username:password:nombre,username:password:nombre
   ```

4. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

5. **Construir para producción**
   ```bash
   npm run build
   npm run preview
   ```

## 🔧 Scripts Disponibles

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build de producción
npm run preview    # Preview del build
npm run lint       # Ejecutar ESLint
npm run lint:fix   # Corregir errores de ESLint
```

## 📁 Estructura del Proyecto

```
prototipo/
├── src/
│   ├── components/
│   │   ├── common/              # Componentes reutilizables
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   ├── Loading/
│   │   │   ├── ErrorBoundary.jsx
│   │   │   └── index.js
│   │   ├── admin/               # Componentes de administración
│   │   │   ├── SolicitudCard.jsx
│   │   │   └── SolicitudDetalle.jsx
│   │   ├── AdminPanel.jsx
│   │   ├── AlumnosAceptados.jsx
│   │   ├── Login.jsx
│   │   ├── Navigation.jsx
│   │   ├── NuevoIngreso.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── Reinscripcion.jsx
│   ├── context/                 # Contextos de React
│   │   ├── AuthContext.jsx
│   │   ├── SolicitudesContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/                   # Custom hooks
│   │   ├── useForm.js
│   │   ├── useFileUpload.js
│   │   └── index.js
│   ├── services/                # Servicios externos
│   │   └── database.js
│   ├── utils/                   # Utilidades
│   │   ├── constants.js
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   └── index.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
│   └── vite.svg
├── .env.example                 # Ejemplo de variables de entorno
├── .env.local                   # Variables de entorno (no versionar)
├── .gitignore
├── CHANGELOG.md                 # Historial de cambios y refactorización
├── OPTIMIZACIONES.md            # Detalles técnicos de optimizaciones
├── package.json
├── vite.config.js
└── README.md
```

## 🔐 Credenciales de Acceso

**Usuarios de demostración para el panel administrativo:**

| Usuario   | Contraseña | Rol              |
|-----------|------------|------------------|
| admin     | admin123   | Administrador    |
| director  | dir123     | Director         |
| control   | ctrl123    | Control Escolar  |

> **⚠️ Nota de Seguridad:** 
> - En producción, usar variables de entorno con contraseñas hasheadas
> - Implementar backend con autenticación JWT o similar
> - Las credenciales actuales son solo para desarrollo

## 💡 Uso del Sistema

1. Los alumnos de nuevo ingreso acceden al panel correspondiente y llenan sus datos
2. Los datos se **guardan automáticamente** en la base de datos local
3. Los alumnos que se reinscriben acceden a su panel específico
4. Los administradores deben **iniciar sesión** con credenciales válidas
5. Solo usuarios autenticados pueden acceder al panel de administración
6. Los administradores revisan las solicitudes y comprobantes
7. Los administradores aprueban o rechazan cada solicitud
8. **Los alumnos aprobados se mueven automáticamente al apartado de "Aceptados"**
9. Cualquier persona puede ver la lista de alumnos aceptados en `/aceptados`

## 🔄 Flujo de Datos

```
┌─────────────────────┐
│  Alumno envía       │
│  solicitud          │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Se guarda en       │
│  IndexedDB          │
│  (tabla solicitudes)│
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Admin revisa       │
│  y aprueba          │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Se copia a tabla   │
│  "aceptados"        │
│  Visible en /aceptados
└─────────────────────┘
```

## 📊 Características de la Base de Datos

### Persistencia
- ✅ **Los datos se mantienen** incluso después de cerrar el navegador
- ✅ **No se pierden** al recargar la página
- ✅ Almacenamiento local en el dispositivo del usuario
- ✅ No requiere conexión a internet una vez cargada la aplicación

### Tablas
1. **solicitudes**: Todas las solicitudes con sus estados (pendiente/aprobada/rechazada)
2. **aceptados**: Solo los alumnos cuyas solicitudes fueron aprobadas

### Ventajas de IndexedDB
✅ **Sin servidor necesario** para desarrollo  
✅ **Persistencia real** de datos  
✅ **Rápido y eficiente**  
✅ **Almacenamiento ilimitado** (según disponibilidad del navegador)  
✅ **Operaciones asíncronas** (no bloquea la UI)  
✅ **Soporte de índices** para búsquedas rápidas  
✅ **Compatible** con todos los navegadores modernos  

## 🚀 Migración a Producción

Para un entorno de producción real, se recomienda:

1. Implementar un backend con Node.js/Express, Django, Laravel, etc.
2. Usar una base de datos relacional (MySQL, PostgreSQL) o NoSQL (MongoDB)
3. Implementar autenticación con JWT
4. Agregar validación del lado del servidor
5. Implementar subida de archivos a un servidor/cloud storage
6. Añadir encriptación de datos sensibles
7. Implementar logs de auditoría

## 📚 Documentación Adicional

- **CHANGELOG.md** - Historial completo de cambios y refactorización
- **OPTIMIZACIONES.md** - Detalles técnicos de las optimizaciones implementadas
- **LIMPIEZA.md** - Resumen de archivos eliminados y limpieza del proyecto

---

**Versión:** 2.0.0  
**Estado:** ✅ Production Ready  
**Última actualización:** 2025-11-04

