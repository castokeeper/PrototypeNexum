# Sistema de Reinscripciones

Sistema web para gestionar el proceso de inscripción y reinscripción de alumnos con panel administrativo protegido por autenticación y base de datos persistente.

## Características

### 1. Panel de Alumno de Nuevo Ingreso
- Formulario de registro con datos personales del alumno
- Carga de comprobante de pago
- Validación de datos
- Los datos del comprobante se validan contra los datos del alumno
- **Almacenamiento persistente en base de datos local**

### 2. Panel de Reinscripción
- Formulario para alumnos que se reinscriben
- Captura de datos: nombre, matrícula, grado, grupo, carrera y turno
- Carga de comprobante de pago
- Validación de datos
- **Almacenamiento persistente en base de datos local**

### 3. Panel de Administración (Protegido)
- **Requiere autenticación de usuario autorizado**
- Visualización de todas las solicitudes (nuevo ingreso y reinscripciones)
- Vista previa de comprobantes de pago
- Verificación visual de datos
- Botones para aprobar o rechazar solicitudes
- Filtros por tipo de solicitud y estatus
- Solo accesible por usuarios autorizados
- **Los alumnos aprobados se guardan automáticamente en el apartado de aceptados**

### 4. Apartado de Alumnos Aceptados ⭐ NUEVO
- Lista completa de todos los alumnos cuyas solicitudes fueron aprobadas
- Visualización organizada con tarjetas informativas
- Información detallada de cada alumno aceptado
- Fecha y hora de aceptación
- Filtrado por tipo (nuevo ingreso/reinscripción)
- **Datos persistentes almacenados en base de datos**

### 5. Sistema de Autenticación
- Login seguro para acceder al panel administrativo
- Sesión persistente (se mantiene al recargar la página)
- Protección de rutas - redirige al login si no está autenticado
- Botón de cerrar sesión
- Múltiples usuarios con diferentes niveles de acceso

### 6. Base de Datos Local (IndexedDB) 💾 NUEVO
- **Almacenamiento persistente** de todas las solicitudes
- **Los datos NO se pierden** al recargar la página o cerrar el navegador
- Dos tablas separadas:
  - `solicitudes`: Todas las solicitudes con sus estados
  - `aceptados`: Alumnos cuyas solicitudes fueron aprobadas
- Operaciones asíncronas para mejor rendimiento
- Sistema de índices para búsquedas rápidas

## Credenciales de Acceso

**Usuarios de demostración para el panel administrativo:**

| Usuario   | Contraseña | Rol              |
|-----------|------------|------------------|
| admin     | admin123   | Administrador    |
| director  | dir123     | Director         |
| control   | ctrl123    | Control Escolar  |

> **Nota de Seguridad:** En un entorno de producción, estos usuarios deben estar almacenados en una base de datos con contraseñas hasheadas.

## Tecnologías Utilizadas

- **React 19** - Framework principal
- **Vite** - Build tool y desarrollo
- **React Router DOM** - Navegación entre paneles y rutas protegidas
- **Lucide React** - Iconos
- **React Toastify** - Notificaciones
- **Context API** - Gestión de estado (autenticación y solicitudes)
- **LocalStorage** - Persistencia de sesión
- **IndexedDB** - Base de datos local del navegador 💾

## Instalación

```bash
npm install
```

## Ejecutar en desarrollo

```bash
npm run dev
```

## Compilar para producción

```bash
npm run build
```

## Estructura del Proyecto

```
src/
  ├── components/
  │   ├── NuevoIngreso.jsx      # Formulario de nuevo ingreso
  │   ├── Reinscripcion.jsx     # Formulario de reinscripción
  │   ├── AdminPanel.jsx        # Panel administrativo (protegido)
  │   ├── AlumnosAceptados.jsx  # Lista de alumnos aceptados ⭐
  │   ├── Navigation.jsx        # Barra de navegación con auth
  │   ├── Login.jsx             # Formulario de inicio de sesión
  │   └── ProtectedRoute.jsx    # Componente de ruta protegida
  ├── context/
  │   ├── SolicitudesContext.jsx # Estado global de solicitudes
  │   └── AuthContext.jsx        # Estado global de autenticación
  ├── services/
  │   └── database.js            # Servicio de base de datos IndexedDB 💾
  ├── App.jsx                    # Componente principal con rutas
  └── main.jsx                   # Punto de entrada
```

## Uso

1. Los alumnos de nuevo ingreso acceden al panel correspondiente y llenan sus datos
2. Los datos se **guardan automáticamente** en la base de datos local
3. Los alumnos que se reinscriben acceden a su panel específico
4. Los administradores deben **iniciar sesión** con credenciales válidas
5. Solo usuarios autenticados pueden acceder al panel de administración
6. Los administradores revisan las solicitudes y comprobantes
7. Los administradores aprueban o rechazan cada solicitud
8. **Los alumnos aprobados se mueven automáticamente al apartado de "Aceptados"**
9. Cualquier persona puede ver la lista de alumnos aceptados en `/aceptados`
10. Al terminar, los administradores pueden cerrar sesión

## Flujo de Datos con Base de Datos

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

## Características de la Base de Datos

### Persistencia
- ✅ **Los datos se mantienen** incluso después de cerrar el navegador
- ✅ **No se pierden** al recargar la página
- ✅ Almacenamiento local en el dispositivo del usuario
- ✅ No requiere conexión a internet una vez cargada la aplicación

### Tablas
1. **solicitudes**: Todas las solicitudes con sus estados (pendiente/aprobada/rechazada)
2. **aceptados**: Solo los alumnos cuyas solicitudes fueron aprobadas

### Operaciones
- Agregar nuevas solicitudes
- Actualizar estado de solicitudes
- Mover automáticamente a "aceptados" cuando se aprueba
- Consultar todas las solicitudes
- Consultar todos los aceptados
- Filtrar por tipo y estatus

## Diseño de Pantalla Completa

- ✅ Interfaz optimizada para **ocupar toda la pantalla**
- ✅ Navegación fija en la parte superior
- ✅ Contenido adaptable al tamaño de la ventana
- ✅ Grid responsive que se ajusta automáticamente
- ✅ Sin márgenes innecesarios
- ✅ Experiencia de aplicación web completa

## Seguridad

- ✅ Rutas protegidas con componente `ProtectedRoute`
- ✅ Validación de credenciales antes de permitir acceso
- ✅ Sesión persistente en localStorage
- ✅ Redirección automática si no está autenticado
- ✅ Cierre de sesión seguro
- ✅ Base de datos local (no expuesta a internet)
- ⚠️ Para producción: implementar backend con JWT y base de datos remota

## Notas Importantes

- Los comprobantes de pago se manejan como archivos de imagen (Base64)
- **Los datos se almacenan localmente en IndexedDB** (persistente)
- El sistema valida que todos los campos requeridos estén completos antes de enviar
- **El panel de administración solo es accesible con credenciales válidas**
- **Los alumnos aceptados son públicamente visibles** en `/aceptados`
- La base de datos es local a cada navegador/dispositivo
- Para producción, migrar a una base de datos remota (MySQL, PostgreSQL, MongoDB, etc.)

## Ventajas de IndexedDB

✅ **Sin servidor necesario** para desarrollo  
✅ **Persistencia real** de datos  
✅ **Rápido y eficiente**  
✅ **Almacenamiento ilimitado** (según disponibilidad del navegador)  
✅ **Operaciones asíncronas** (no bloquea la UI)  
✅ **Soporte de índices** para búsquedas rápidas  
✅ **Compatible** con todos los navegadores modernos  

## Migración a Producción

Para un entorno de producción real, se recomienda:

1. Implementar un backend con Node.js/Express, Django, Laravel, etc.
2. Usar una base de datos relacional (MySQL, PostgreSQL) o NoSQL (MongoDB)
3. Implementar autenticación con JWT
4. Agregar validación del lado del servidor
5. Implementar subida de archivos a un servidor/cloud storage
6. Añadir encriptación de datos sensibles
7. Implementar logs de auditoría
