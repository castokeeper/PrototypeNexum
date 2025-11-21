# 🎓 Flujo Completo de Admisión e Inscripción

**Fecha**: 2025-11-21  
**Versión**: 2.0 - Flujo Correcto Definitivo

---

## 🔄 Flujo Completo (6 Etapas)

### **ETAPA 1: Registro de Aspirante** 📝

**Página**: `/registro-ficha` (Público)

**El aspirante llena**:
- Datos básicos (nombre, CURP, fecha nacimiento)
- Contacto (email, teléfono)
- Carrera deseada

**El sistema crea**:
1. ✅ `FichaExamen` con folio único
2. ✅ `Usuario` temporal:
   - `rol`: `aspirante`
   - `temporal`: `true`
   - `estatus`: `en_revision`
3. ✅ `ListaEspera` con estado `en_espera`

**El aspirante recibe**:
- Email con folio y credenciales temporales
- Link al portal: `/portal-aspirante`

---

### **ETAPA 2: Lista de Espera** ⏳

**Página**: `/admin/lista-espera` (Admin)

**Estado del aspirante**: `en_revision`

**El admin puede**:
- ✅ Ver todos los aspirantes en espera
- ✅ Revisar sus datos básicos
- ✅ **ACEPTAR** → Va a ETAPA 3
- ❌ **RECHAZAR** → Va a ETAPA 4 (rechazo)

**El aspirante puede**:
- 🔐 Login con sus credenciales
- 👁️ Ver su estado: "En revisión"
- ⏰ Ver su posición en la lista

---

### **ETAPA 3: Aspirante ACEPTADO** ✅

**Acción admin**: Click en "Aceptar"

**El sistema actualiza**:
1. `Usuario`:
   - `estatus`: `pendiente_formulario`
   - `temporal`: sigue siendo `true`
2. `ListaEspera`:
   - `estadoActual`: `aceptado`
   - `fechaAceptacion`: Timestamp
3. `FichaExamen`:
   - `estatus`: `aprobado`

**El aspirante recibe**:
- ✉️ Email: "¡Felicidades! Has sido aceptado"
- 🔗 Link al formulario de inscripción

**El aspirante ahora puede**:
- 🔐 Login en `/portal-aspirante`
- 📝 Ver formulario de inscripción completo
- ⚠️ **OBLIGATORIO**: Llenar todos los datos

---

### **FORMULARIO DE INSCRIPCIÓN** 📋

**Página**: `/portal-aspirante/inscripcion`

**Datos que debe llenar**:
- Información completa del alumno
- Datos académicos previos
- Documentos requeridos (PDF/imágenes):
  - Acta de nacimiento
  - CURP
  - Certificado de estudios
  - Comprobante de domicilio
  - 6 fotografías
- Selección de turno y grupo
- Datos de tutor (si es menor de edad)

**Al enviar el formulario**:
1. `Solicitud` se crea con:
   - `tipo`: `nuevo_ingreso` o `reinscripcion`
   - `estatus`: `pendiente_pago` ⭐
   - Todos los datos capturados
   - Referencias a documentos subidos
2. `Usuario`:
   - `estatus`: `pendiente_pago`
3. Se calcula el monto a pagar:
   - Inscripción nueva: $X
   - Reinscripción: $Y

**El aspirante recibe**:
- Resumen de su solicitud
- **Botón para pagar con Stripe** 💳

---

### **ETAPA 5: Proceso de Pago** 💳

**Página**: `/portal-aspirante/pagar`

**El sistema**:
1. Crea sesión de pago en Stripe:
   ```javascript
   const session = await stripe.checkout.sessions.create({
     amount: calculoMonto(solicitud.tipo),
     metadata: { solicitudId: solicitud.id }
   });
   ```
2. Redirige a Stripe Checkout
3. El aspirante paga

**Stripe webhook** (`/api/webhooks/stripe`):
```javascript
// Cuando el pago es exitoso
if (event.type === 'checkout.session.completed') {
  // 1. Actualizar solicitud
  await prisma.solicitud.update({
    where: { id: metadata.solicitudId },
    data: { 
      estatus: 'aprobada',
      estatusPago: 'pagado',
      fechaPago: new Date()
    }
  });

  // 2. Formalizar usuario
  await prisma.usuario.update({
    where: { id: solicitud.usuarioId },
    data: { 
      temporal: false,  // ⭐ Ya NO es temporal
      estatus: 'activo'
    }
  });

  // 3. Crear Alumno
  await prisma.alumno.create({
    data: { ...solicitud.datos }
  });
}
```

---

### **ETAPA 6: Alumno Inscrito** 🎉

**Después del pago exitoso**:

**El alumno ahora es**:
- ✅ Usuario permanente (`temporal: false`)
- ✅ Alumno activo en el sistema
- ✅ Aparece en `/admin/alumnos`
- ✅ Tiene número de control

**El alumno puede**:
- 🔐 Login en su portal
- 📊 Ver su información completa
- 📚 Ver sus materias
- 💵 Ver su historial de pagos
- 📄 Descargar su comprobante

**Admin puede ver**:
- Lista completa de alumnos inscritos
- Filtrar por nuevo ingreso / reinscripción
- Generar reportes
- Exportar datos

---

## ❌ ETAPA 4: Aspirante RECHAZADO

**Acción admin**: Click en "Rechazar" + Motivo

**Inmediatamente**:
1. `Usuario`:
   - `estatus`: `rechazado`
   - `activo`: `false`
   - `fechaRechazo`: Timestamp
2. `ListaEspera`:
   - `estadoActual`: `rechazado`
   - `fechaRechazo`: Timestamp
   - `observaciones`: Motivo
3. `FichaExamen`:
   - `estatus`: `rechazado`

**El aspirante**:
- ❌ NO puede hacer login
- 📧 Recibe email con el motivo del rechazo
- 👁️ Puede consultar su ficha por folio (solo lectura)

**Después de 7 días** (Tarea programada - Cron):
```javascript
// Ejecuta diariamente a las 00:00
cron.schedule('0 0 * * *', async () => {
  const hace7Dias = new Date();
  hace7Dias.setDate(hace7Dias.getDate() - 7);

  // Eliminar aspirantes rechazados hace más de 7 días
  await prisma.usuario.deleteMany({
    where: {
      estatus: 'rechazado',
      fechaRechazo: { lt: hace7Dias }
    }
  });
  // CASCADE eliminará: FichaExamen, ListaEspera, Documentos
});
```

---

## 🗄️ Modelo de Datos Actualizado

### Usuario
```prisma
model Usuario {
  id           Int        @id @default(autoincrement())
  username     String     @unique
  passwordHash String
  nombre       String
  email        String?    @unique
  rol          RolUsuario @default(aspirante)
  activo       Boolean    @default(true)
  temporal     Boolean    @default(true)  // true hasta que pague
  estatus      EstatusUsuario @default(en_revision)  // ⭐ NUEVO
  
  // Fechas importantes
  fechaRegistro DateTime @default(now())
  fechaRechazo  DateTime?
  ultimoAcceso  DateTime?
  
  // Relaciones
  fichaExamen  FichaExamen?
  solicitudes  Solicitud[]
  pagos        Pago[]
}
```

### Nuevo Enum: EstatusUsuario
```prisma
enum EstatusUsuario {
  en_revision         // Recién registrado, esperando decisión admin
  pendiente_formulario // Aceptado, debe llenar formulario
  pendiente_pago      // Formulario llenado, esperando pago
  activo              // Pago completado, alumno activo
  rechazado           // Admin lo rechazó
  suspendido          // Admin lo suspendió
  egresado            // Terminó sus estudios
}
```

### Solicitud
```prisma
model Solicitud {
  id        Int              @id @default(autoincrement())
  usuarioId Int              
  tipo      TipoSolicitud    // nuevo_ingreso | reinscripcion
  estatus   EstatusSolicitud @default(pendiente_pago)
  
  // Datos del formulario
  datosPersonales  Json
  datosAcademicos  Json
  datosTutor       Json?
  
  // Pago
  estatusPago      EstatusPago @default(pendiente)
  montoPagar       Decimal
  stripeSessionId  String?
  fechaPago        DateTime?
  
  // Relaciones
  usuario    Usuario
  documentos Documento[]
  pagos      Pago[]
}
```

### Pago
```prisma
model Pago {
  id              Int      @id @default(autoincrement())
  solicitudId     Int
  usuarioId       Int
  monto           Decimal
  moneda          String   @default("MXN")
  
  // Stripe
  stripePaymentId String   @unique
  stripeStatus    String   // succeeded, pending, failed
  
  // Metadata
  concepto        String   // inscription, reinscription, tuition
  fechaPago       DateTime @default(now())
  metodoPago      String   // card, oxxo, etc.
  
  // Relaciones
  solicitud Solicitud @relation(...)
  usuario   Usuario @relation(...)
}
```

---

## 🔐 Roles y Permisos Actualizados

### `aspirante` (Usuario temporal)

#### Estado: `en_revision`
- ✅ Login permitido
- ✅ Ver estado: "En revisión"
- ❌ No puede hacer nada más

#### Estado: `pendiente_formulario`
- ✅ Ver formulario de inscripción
- ✅ Llenar y enviar formulario
- ✅ Subir documentos

#### Estado: `pendiente_pago`
- ✅ Ver resumen de solicitud
- ✅ Botón de pagar
- ✅ Ver intentos de pago

#### Estado: `activo` (ya no es temporal)
- ✅ Portal completo de alumno
- ✅ Ver calificaciones
- ✅ Ver materias
- ✅ Hacer reinscripción

---

## 🎯 Flujo Visual Completo

```
┌─────────────────────────────────────────────────────────────┐
│ ETAPA 1: REGISTRO                                           │
│                                                              │
│ Aspirante llena registro básico                             │
│ ↓                                                            │
│ Sistema crea: Usuario (temporal) + FichaExamen              │
│ ↓                                                            │
│ Email: credenciales + "Estamos revisando tu solicitud"     │
└─────────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│ ETAPA 2: LISTA DE ESPERA                                    │
│                                                              │
│ Usuario.estatus = 'en_revision'                             │
│ Aspirante puede login → Ve "En revisión"                    │
│ Admin revisa → ACEPTA o RECHAZA                             │
└─────────────────────────────────────────────────────────────┘
          ↓ ACEPTA           ↓ RECHAZA
┌──────────────────┐   ┌──────────────────────────────┐
│ ETAPA 3: ACEPTADO│   │ ETAPA 4: RECHAZADO           │
│                  │   │                              │
│ estatus =        │   │ estatus = 'rechazado'        │
│ 'pendiente_      │   │ activo = false               │
│  formulario'     │   │ ↓                            │
│ ↓                │   │ Email con motivo             │
│ Portal muestra   │   │ ↓                            │
│ formulario       │   │ Después de 7 días: DELETE    │
└──────────────────┘   └──────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────────┐
│ FORMULARIO DE INSCRIPCIÓN                                   │
│                                                              │
│ Aspirante llena TODOS los datos                             │
│ Sube documentos                                             │
│ ↓                                                            │
│ Sistema crea Solicitud (estatus = 'pendiente_pago')        │
│ Usuario.estatus = 'pendiente_pago'                          │
│ ↓                                                            │
│ Muestra botón: "Pagar Inscripción" → Stripe                │
└─────────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│ ETAPA 5: PAGO (STRIPE)                                      │
│                                                              │
│ Crea sesión Stripe                                          │
│ Aspirante paga con tarjeta                                  │
│ ↓                                                            │
│ Webhook de Stripe confirma pago                             │
│ ↓                                                            │
│ Sistema:                                                    │
│   1. Solicitud.estatus = 'aprobada'                         │
│   2. Usuario.temporal = FALSE ⭐                            │
│   3. Usuario.estatus = 'activo'                             │
│   4. Crea Alumno con núm. de control                        │
│   5. Guarda Pago en BD                                      │
└─────────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│ ETAPA 6: ALUMNO INSCRITO ✅                                 │
│                                                              │
│ Usuario permanente (temporal = false)                       │
│ Aparece en /admin/alumnos                                   │
│ Tiene acceso completo al portal                             │
│ Puede ver materias, calificaciones, etc.                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Estructura de Archivos Necesaria

```
backend/
├── src/
│   ├── controllers/
│   │   ├── fichaExamenController.js      ← Registro (ETAPA 1)
│   │   ├── listaEsperaController.js      ← Aceptar/Rechazar (ETAPA 2-4)
│   │   ├── solicitudController.js        ← Formulario (ETAPA 3)
│   │   ├── pagoController.js             ← Stripe (ETAPA 5)
│   │   └── alumnosController.js          ← Ver alumnos (ETAPA 6)
│   ├── services/
│   │   ├── stripeService.js              ← Integración Stripe
│   │   ├── emailService.js               ← Envío de emails
│   │   └── cleanupService.js             ← Eliminar rechazados (7 días)
│   ├── webhooks/
│   │   └── stripeWebhook.js              ← Confirmar pago
│   └── cron/
│       └── cleanupRejected.js            ← Cron diario

frontend/
├── src/
│   ├── components/
│   │   ├── RegistroFicha.jsx             ← ETAPA 1
│   │   ├── PortalAspirante.jsx           ← Portal aspirante
│   │   ├── FormularioInscripcion.jsx     ← ETAPA 3
│   │   ├── ProcesoPago.jsx               ← ETAPA 5
│   │   └── AdminAlumnos.jsx              ← ETAPA 6
│   └── pages/
│       └── portal-aspirante/
│           ├── Dashboard.jsx
│           ├── Inscripcion.jsx
│           ├── Pago.jsx
│           └── Estado.jsx
```

---

## 🚀 Próximos Pasos de Implementación

### Prioridad ALTA ⭐ (Esta semana)
1. ✅ Actualizar schema con nuevo enum `EstatusUsuario`
2. ✅ Aplicar migración
3. ✅ Actualizar controlador de fichas (ETAPA 1)
4. ✅ Actualizar controlador de lista espera (ETAPA 2-4)
5. ✅ Crear controlador de solicitudes (ETAPA 3)
6. ✅ Configurar Stripe (ETAPA 5)
7. ✅ Crear webhook de Stripe
8. ✅ Crear Portal Aspirante (frontend)

### Prioridad MEDIA (Próxima semana)
9. 📧 Implementar servicio de email completo
10. 🗑️ Crear cron job para eliminar rechazados
11. 📄 Sistema de gestión de documentos
12. 🧪 Pruebas completas del flujo

### Prioridad BAJA (Futuro)
13. 📊 Dashboard con métricas de conversión
14. 📈 Reportes de admisión
15. 🔔 Notificaciones en tiempo real

---

**Estado**: Diseño completo ✅  
**Próximo paso**: Implementar cambios en código

¿Te parece correcto este flujo? ¿Empezamos con la implementación?
