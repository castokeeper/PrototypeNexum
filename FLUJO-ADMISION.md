# 🔄 Nuevo Flujo: Registro y Admisión de Alumnos

**Fecha**: 2025-11-21  
**Cambio Importante**: Usuario temporal se crea al registrar ficha

---

## 📋 Flujo Correcto del Sistema

### 1️⃣ **Registro de Ficha** (Público - Sin autenticación)

**URL**: `/registro-ficha`

**El aspirante llena el formulario con:**
- Datos personales (nombre, apellidos, CURP, fecha nacimiento)
- Datos de contacto (teléfono,email, dirección)
- Carrera y turno preferido

**El sistema automáticamente**:
1. ✅ Crea la `FichaExamen` con folio único
2. ✅ Crea un `Usuario` TEMPORAL con:
   - `username`: Email del aspirante
   - `password`: Generada automáticamente (se envía por email)
   - `rol`: `aspirante`
   - `temporal`: `true`
   - `activo`: `true`
3. ✅ Agrega a `ListaEspera` con estado `en_espera`
4. ✅ Vincula Usuario ↔ FichaExamen

**El aspirante recibe**:
- ✅ Folio único (ej: FE-2025-0001)
- ✅ Email con credenciales temporales
- ✅ Posición en lista de espera

---

### 2️⃣ **Admin Revisa Lista de Espera**

**URL**: `/admin/lista-espera`

**El administrador puede**:
- Ver todos los aspirantes en espera
- Revisar sus datos
- Tomar una decisión:
  - ✅ **ACEPTAR**
  - ❌ **RECHAZAR**

---

### 3️⃣ **Si es ACEPTADO**

**El sistema automáticamente**:
1. ✅ El `Usuario` deja de ser temporal:
   - `temporal`: `false` → Usuario permanente
   - `rol`: `aspirante` → Se mantiene (podrá cambiar a `alumno` después)
2. ✅ Se crea registro en `Alumno`:
   - Vinculado a la `FichaExamen`
   - Estado: `activo`
   - Semestre: 1
3. ✅ Se actualiza `ListaEspera`:
   - `estadoActual`: `aceptado`
   - `fechaAceptacion`: Timestamp actual
4. ✅ Se actualiza `FichaExamen`:
   - `estatus`: `aprobado`

**El aspirante (ahora alumno)**:
- ✅ Puede hacer LOGIN con sus credenciales
- ✅ Tiene acceso a su portal (sin permisos admin)
- ✅ Puede ver su información
- ✅ Puede subir documentos
- ✅ NO puede acceder a rutas `/admin/*`

---

### 4️⃣ **Si es RECHAZADO**

**El sistema automáticamente**:
1. ❌ **ELIMINA** el `Usuario` temporal
   - `CASCADE DELETE` en la base de datos
2. ✅ Actualiza `ListaEspera`:
   - `estadoActual`: `rechazado`
   - `fechaRechazo`: Timestamp actual
3. ✅ Actualiza `FichaExamen`:
   - `estatus`: `rechazado`
   - `usuarioId`: `NULL` (usuario ya eliminado)

**El aspirante rechazado**:
- ❌ NO puede hacer login (usuario eliminado)
- ✅ Puede consultar su ficha con el folio
- ✅ Ve el estado "rechazado"
- ⚠️ Puede volver a registrarse con otro email

---

## 🔐 Roles de Usuario

### `admin`
- ✅ Acceso completo al sistema
- ✅ Gestionar lista de espera
- ✅ Gestionar alumnos
- ✅ Gestionar solicitudes
- ✅ Ver estadísticas
- ✅ Configuración del sistema

### `director`
- ✅ Ver reportes
- ✅ Ver estadísticas
- ✅ Aprobar solicitudes
- ❌ No puede eliminar datos

### `control_escolar`
- ✅ Gestionar alumnos
- ✅ Gestionar solicitudes
- ✅ Ver lista de espera
- ❌ No puede eliminar usuarios

### `aspirante` (Nuevo)
- ✅ Ver su información personal
- ✅ Subir documentos
- ✅ Ver su estado en lista de espera
- ✅ Actualizar datos de contacto
- ❌ NO acceso a rutas `/admin/*`
- ❌ NO puede ver otros aspirantes

---

## 🗄️ Cambios en la Base de Datos

### Modelo `Usuario`
```prisma
model Usuario {
  // ... campos existentes
  temporal Boolean @default(false)  // ⭐ NUEVO
  
  // ... relaciones existentes
  fichaExamen FichaExamen? @relation("UsuarioFicha")  // ⭐ NUEVO
}
```

### Enum `RolUsuario`
```prisma
enum RolUsuario {
  admin
  director
  control_escolar
  aspirante  // ⭐ NUEVO
}
```

### Modelo `FichaExamen`
```prisma
model FichaExamen {
  // ... campos existentes
  usuarioId Int? @unique @map("usuario_id")  // ⭐ NUEVO
  
  // Relaciones
  usuario Usuario? @relation("UsuarioFicha", ...)  // ⭐ NUEVO
}
```

---

## 🔄 Flujo de Datos Detallado

### Registro de Ficha

```javascript
POST /api/fichas
{
  "nombre": "Juan",
  "apellidoPaterno": "Pérez",
  "apellidoMaterno": "García",
  "curp": "PEGJ010115HDFRRS01",
  "fechaNacimiento": "2001-01-15",
  "telefono": "5512345678",
  "email": "juan.perez@email.com",
  "direccion": "Calle Principal 123",
  "carreraId": 1,
  "turnoPreferido": "matutino"
}
```

**Respuesta**:
```json
{
  "success": true,
  "ficha": {
    "folio": "FE-2025-0002",
    "nombre": "Juan Pérez García",
    "carrera": "ISC",
    "posicionEspera": 5
  },
  "credenciales": {
    "username": "juan.perez@email.com",
    "passwordTemporal": "abc123xyz"  // Se envía por email
  }
}
```

---

### Aceptar Aspirante

```javascript
PATCH /api/lista-espera/:id/aceptar
Authorization: Bearer {admin_token}
{
  "observaciones": "Cumple con todos los requisitos"
}
```

**El sistema hace**:
1. `Usuario.update({ temporal: false })`
2. `Alumno.create({ ... })`
3. `ListaEspera.update({ estadoActual: 'aceptado' })`
4. `FichaExamen.update({ estatus: 'aprobado' })`

---

### Rechazar Aspirante

```javascript
PATCH /api/lista-espera/:id/rechazar
Authorization: Bearer {admin_token}
{
  "motivo": "Documentos incompletos"
}
```

**El sistema hace**:
1. `Usuario.delete()`  ← CASCADE elimina
2. `ListaEspera.update({ estadoActual: 'rechazado' })`
3. `FichaExamen.update({ estatus: 'rechazado', usuarioId: null })`

---

## 🎯 Rutas del Sistema

### Públicas (Sin autenticación)
```
GET  /                     → Página principal
POST /api/fichas           → Registrar ficha + crear usuario temporal
GET  /api/fichas/:folio    → Consultar estado de ficha
GET  /api/carreras         → Listar carreras disponibles
```

### Aspirantes (Rol: aspirante)
```
GET  /portal                      → Dashboard del aspirante
GET  /portal/mi-ficha             → Ver su ficha
GET  /portal/documentos           → Subir/ver documentos
GET  /portal/estado               → Ver estado admisión
PUT  /portal/actualizar-datos     → Actualizar contacto
```

### Administración (Roles: admin, director, control_escolar)
```
GET    /admin/lista-espera              → Ver aspirantes
PATCH  /admin/lista-espera/:id/aceptar  → Aceptar aspirante
PATCH  /admin/lista-espera/:id/rechazar → Rechazar aspirante
GET    /admin/alumnos                   → Ver alumnos aceptados
GET    /admin/solicitudes                → Ver solicitudes
```

---

## ✅ Beneficios de Este Flujo

1. **Usuario desde el inicio**
   - El aspirante tiene credenciales desde que se registra
   - Puede consultar su estado sin recordar el folio
   - Recibe notificaciones por email

2. **Proceso limpio**
   - Aspirantes rechazados NO quedan en usuarios
   - Base de datos limpia
   - No hay usuarios "zombie"

3. **Seguridad**
   - Aspirantes NO pueden acceder a admin
   - Cada rol tiene permisos específicos
   - Auditoría completa de acciones

4. **Escalable**
   - Fácil agregar más estados
   - Fácil agregar notificaciones
   - Fácil implementar workflows

---

## 🚀 Próximos Pasos de Implementación

### 1. Migración de Base de Datos
```bash
cd backend
npx prisma migrate dev --name add-usuario-temporal-and-aspirante
npx prisma generate
```

### 2. Actualizar Controladores
- ✅ `fichaExamenController.js` - Crear usuario al registrar ficha
- ✅ `listaEsperaController.js` - Aceptar/Rechazar con lógica de usuario
- ⭐ NUEVO: `aspiranteController.js` - Portal del aspirante

### 3. Actualizar Frontend
- ✅ `RegistroFicha.jsx` - Mostrar credenciales generadas
- ✅ `AdminListaEspera.jsx` - Botones aceptar/rechazar actualizados
- ⭐ NUEVO: `PortalAspirante.jsx` - Dashboard para aspirantes

### 4. Servicios Adicionales
- 📧 Servicio de email para enviar credenciales
- 🔒 Generador de contraseñas seguras
- 📝 Templates de email

---

## 📝 Notas Importantes

- ⚠️ **Eliminar usuario es permanente**: No se puede deshacer
- ✅ **Ficha se mantiene**: Aunque se elimine el usuario, la ficha queda para historial
- 🔐 **Credenciales por email**: IMPORTANTE implementar servicio de email
- 📊 **Métricas**: Tasa de aceptación/rechazo para mejorar proceso

---

**Estado**: En implementación  
**Próximo paso**: Actualizar controladores con nueva lógica
