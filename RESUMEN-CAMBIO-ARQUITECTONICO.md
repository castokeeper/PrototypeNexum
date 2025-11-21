# 📊 Resumen: Cambio Arquitectónico del Flujo de Admisión

**Fecha**: 2025-11-21  
**Tipo**: Cambio Mayor en el Flujo de Datos

---

## 🎯 Problema Identificado

El usuario mencionó que el flujo actual no era correcto:

> "Debería ser el registro de la ficha el 'registro del alumno' y se vaya a lista de espera, posteriormente SI es aceptado aparecerá únicamente el formulario y debe quedarse guardado su usuario temporalmente, SI es rechazado debe eliminarse y SI es aceptado se formaliza en la base de datos su usuario sin permisos de administrador"

---

## ❌ FlujoAnterior (Incorrecto)

```
1. Registro de Ficha (público)
   └─> Crea FichaExamen
   └─> Agrega a ListaEspera
   └─> FIN (no crea usuario)

2. Admin acepta aspirante
   └─> Marca como aceptado en lista
   └─> Admin debe crear manualmente el alumno ❌ INCORRECTO
```

**Problemas**:
- El aspirante NO tenía credenciales de acceso
- NO podía consultar su estado fácilmente
- Admin debía crear alumnos manualmente
- Aspirantes rechazados no se limpiaban

---

## ✅ Flujo Nuevo (Correcto)

```
1. Registro de Ficha (público)
   ├─> Crea FichaExamen
   ├─> Crea Usuario TEMPORAL (rol: aspirante) ⭐
   ├─> Vincula FichaExamen ↔ Usuario
   ├─> Agrega a ListaEspera (estado: en_espera)
   └─> Envía credenciales por email

2. Admin ACEPTA aspirante
   ├─> Usuario: temporal = false (se formaliza) ⭐
   ├─> Crea Alumno automáticamente ⭐
   ├─> ListaEspera: estado = aceptado
   └─> FichaExamen: estatus = aprobado

3. Admin RECHAZA aspirante
   ├─> ELIMINA Usuario (CASCADE) ⭐
   ├─> ListaEspera: estado = rechazado
   └─> FichaExamen: estatus = rechazado
```

---

## 🔄 Diferencias Clave

| Aspecto | Antes | Ahora |
|---------|-------|-------|
| **Usuario en registro** | ❌ No se crea | ✅ Se crea temporal |
| **Credenciales** | ❌ No tiene | ✅ Recibe por email |
| **Acceso aspirante** | ❌ No puede entrar | ✅ Puede ver su estado |
| **Al ACEPTAR** | ⚠️ Manual | ✅ Automático |
| **Al RECHAZAR** | ⚠️ Usuario queda | ✅ Usuario se elimina |
| **Base de datos** | ⚠️ Usuarios basura | ✅ Limpia |

---

## 📐 Cambios en la Arquitectura

### Base de Datos

```sql
-- ENUM actualizado
RolUsuario: admin | director | control_escolar | aspirante ⭐

-- Tabla usuarios
ALTER TABLE usuarios ADD COLUMN temporal BOOLEAN DEFAULT false; ⭐

-- Tabla fichas_examen
ALTER TABLE fichas_examen ADD COLUMN usuario_id INTEGER UNIQUE; ⭐
ALTER TABLE fichas_examen ADD FOREIGN KEY (usuario_id) 
  REFERENCES usuarios(id) ON DELETE CASCADE; ⭐
```

### Modelos Prisma

```prisma
enum RolUsuario {
  admin
  director
  control_escolar
  aspirante  // ⭐ NUEVO
}

model Usuario {
  // ... campos existentes
  temporal Boolean @default(false)  // ⭐ NUEVO
  fichaExamen FichaExamen? @relation("UsuarioFicha")  // ⭐ NUEVO
}

model FichaExamen {
  // ... campos existentes
  usuarioId Int? @unique  // ⭐ NUEVO
  usuario Usuario? @relation("UsuarioFicha", fields: [usuarioId], ...)  // ⭐ NUEVO
}
```

---

## 🎭 Rol de "Aspirante"

### Permisos

```javascript
// Puede acceder:
✅ /portal - Dashboard
✅ /portal/mi-ficha - Ver su ficha
✅ /portal/estado - Ver posición en lista
✅ /portal/documentos - Subir documentos
✅ /portal/perfil - Actualizar datos

// NO puede acceder:
❌ /admin/* - Rutas administrativas
❌ /api/lista-espera - Ver otros aspirantes
❌ /api/alumnos - Gestión de alumnos
```

### Transiciones de Estado

```
temporal=true, rol=aspirante
         ↓ (ACEPTADO)
temporal=false, rol=aspirante → Puede cambiarse a 'alumno' después
         ↓ (RECHAZADO)
    [ELIMINADO]
```

---

## 🔧 Cambios en el Código

### 1. Controlador de Fichas

**Antes**:
```javascript
// Solo creaba la ficha
const ficha = await prisma.fichaExamen.create({ ... });
```

**Ahora**:
```javascript
// 1. Genera contraseña temporal
const password = generarPassword(12);

// 2. Crea usuario temporal
const usuario = await prisma.usuario.create({
    username: email,
    passwordHash: await bcrypt.hash(password, 10),
    rol: 'aspirante',
    temporal: true  // ⭐
});

// 3. Crea ficha vinculada
const ficha = await prisma.fichaExamen.create({
    ...datos,
    usuarioId: usuario.id  // ⭐
});

// 4. TODO: Enviar email con credenciales
```

### 2. Controlador de Lista de Espera

**Función Aceptar - Antes**:
```javascript
await prisma.listaEspera.update({
    where: { id },
    data: { estadoActual: 'aceptado' }
});
// Admin debía crear alumno manualmente ❌
```

**Función Aceptar - Ahora**:
```javascript
await prisma.$transaction(async (tx) => {
    // 1. Formalizar usuario
    await tx.usuario.update({
        where: { id: ficha.usuarioId },
        data: { temporal: false }  // ⭐
    });

    // 2. Crear alumno automáticamente
    await tx.alumno.create({ ... });  // ⭐

    // 3. Actualizar lista de espera
    await tx.listaEspera.update({ ... });

    // 4. Actualizar ficha
    await tx.fichaExamen.update({ ... });
});
```

**Función Rechazar - Antes**:
```javascript
await prisma.listaEspera.update({
    where: { id },
    data: { estadoActual: 'rechazado' }
});
// Usuario quedaba en la base de datos ❌
```

**Función Rechazar - Ahora**:
```javascript
await prisma.$transaction(async (tx) => {
    // 1. ELIMINAR usuario (CASCADE limpia la relación)
    await tx.usuario.delete({
        where: { id: ficha.usuarioId }
    });  // ⭐

    // 2. Actualizar lista de espera
    await tx.listaEspera.update({ ... });

    // 3. Actualizar ficha
    await tx.fichaExamen.update({ ... });
});
```

---

## 🎯 Beneficios del Nuevo Flujo

### 1. **Mejor Experiencia de Usuario**
- ✅ El aspirante recibe credenciales inmediatamente
- ✅ Puede consultar su estado en cualquier momento
- ✅ No necesita recordar el folio (usa su email)
- ✅ Recibe notificaciones por email

### 2. **Proceso Automatizado**
- ✅ NO requiere intervención manual para crear alumnos
- ✅ Aceptar/Rechazar es un solo click
- ✅ Todo es consistente y transaccional

### 3. **Base de Datos Limpia**
- ✅ Aspirantes rechazados NO quedan como usuario
- ✅ No hay "usuarios zombie"
- ✅ Fácil de auditar

### 4. **Escalabilidad**
- ✅ Fácil agregar notificaciones
- ✅ Fácil agregar portal del aspirante
- ✅ Fácil agregar más estados

---

## 📋 Pasos para Implementar

### ✅ Completado
1. ✅ Documentación del nuevo flujo
2. ✅ Schema de Prisma actualizado
3. ✅ Migración SQL creada

### ⚠️ Pendiente
4. ⏳ Aplicar migración a la base de datos
5. ⏳ Actualizar controlador de fichas
6. ⏳ Actualizar controlador de lista de espera
7. ⏳ Crear generador de contraseñas
8. ⏳ Actualizar frontend
9. ⏳ Probar flujo completo
10. ⏳ (Futuro) Implementar servicio de email

---

## 📊 Impacto

### Archivos Modificados
- `backend/prisma/schema.prisma` ✅
- `backend/src/controllers/fichaExamenController.js` ⏳
- `backend/src/controllers/listaEsperaController.js` ⏳
- `backend/src/utils/passwordGenerator.js` ⏳ (nuevo)
- `frontend/src/components/RegistroFicha.jsx` ⏳

### Base de Datos
- ⚠️ Requiere migración
- ✅ Compatible con datos existentes
- ⚠️ Requiere reiniciar servidor

---

## 🚨 Importante

1. **El servidor debe detenerse** para aplicar la migración
2. **Probar primero en desarrollo** antes de producción
3. **Implementar servicio de email** es crítico (las contraseñas se generan automáticamente)
4. **NO enviar contraseñas en response** en producción (solo por email)

---

## 📚 Documentación Creada

1. `FLUJO-ADMISION.md` - Flujo detallado completo
2. `CAMBIOS-PENDIENTES.md` - Lista de cambios a implementar
3. `RESUMEN-CAMBIO-ARQUITECTONICO.md` - Este archivo
4. `backend/MIGRACION.md` - Instrucciones de migración
5. `backend/prisma/migrations/manual_add_usuario_temporal/migration.sql` - SQL

---

**Próximo paso**: Aplicar la migración y actualizar los controladores

**Tiempo estimado**: 1-2 horas para completar la implementación
