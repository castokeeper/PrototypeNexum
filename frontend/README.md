# Frontend - Sistema de Reinscripciones

Aplicación React para la gestión de solicitudes de inscripción y reinscripción de alumnos.

## 🚀 Tecnologías

- **React 19** - Framework principal
- **Vite** - Build tool
- **React Router DOM v7** - Navegación
- **Lucide React** - Iconos
- **React Toastify** - Notificaciones

## 📦 Instalación

```bash
npm install
```

## 🔧 Desarrollo

```bash
npm run dev
```

El frontend se ejecutará en `http://localhost:5173` con proxy configurado al backend en `http://localhost:3000`.

## 🏗️ Build

```bash
npm run build
```

## 📁 Estructura

```
frontend/
├── src/
│   ├── components/     # Componentes React
│   ├── context/        # Contextos (Auth, Theme, etc.)
│   ├── hooks/          # Custom hooks
│   ├── services/       # Servicios API
│   ├── utils/          # Utilidades
│   ├── App.jsx
│   └── main.jsx
├── public/             # Archivos estáticos
└── index.html
```

## 🔌 Conexión con Backend

El frontend está configurado para comunicarse con el backend a través de un proxy en Vite:

- Las peticiones a `/api/*` se reenvían automáticamente a `http://localhost:3000`
- Asegúrate de que el backend esté corriendo en el puerto 3000

## 📝 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Vista previa del build
- `npm run lint` - Ejecutar ESLint
- `npm run lint:fix` - Corregir errores de linting
