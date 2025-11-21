# 📋 Plan de Implementación - Flujo Completo

**Objetivo**: Implementar el flujo de admisión e inscripción con 6 etapas + Stripe

---

## 🎯 Fase 1: Base de Datos y Modelos (1-2 horas)

### ✅ Tareas

1. **Actualizar `schema.prisma`**
   - Agregar enum `EstatusUsuario`
   - Agregar campo `estatus` a Usuario
   - Agregar campo `fechaRechazo` a Usuario
   - Crear modelo `Pago`
   - Actualizar modelo `Solicitud` con campos de pago

2. **Ejecutar migración**
   ```bash
   cd backend
   npx prisma db push
   npx prisma generate
   ```

3. **Verificar modelos**
   ```bash
   npx prisma studio
   ```

---

## 🎯 Fase 2: ETAPA 1 - Registro (2 horas)

### Backend

**Archivo**: `backend/src/controllers/fichaExamenController.js`

**Función**: `crearFicha()`

```javascript
export const crearFicha = async (req, res) => {
  try {
    // 1. Validar datos
    // 2. Generar contraseña temporal
    const password = generarPassword(12);
    const passwordHash = await bcrypt.hash(password, 10);

    // 3. Crear usuario temporal
    const usuario = await prisma.usuario.create({
      data: {
        username: email.toLowerCase(),
        passwordHash,
        nombre: `${nombre} ${apellidoPaterno} ${apellidoMaterno}`,
        email: email.toLowerCase(),
        rol: 'aspirante',
        temporal: true,
        estatus: 'en_revision',  // ⭐ NUEVO
        activo: true
      }
    });

    // 4. Crear ficha
    const ficha = await prisma.fichaExamen.create({
      data: { ...datos, usuarioId: usuario.id }
    });

    // 5. Crear entrada en lista de espera
    const posicion = await obtenerSiguientePosicion();
    await prisma.listaEspera.create({
      data: { fichaId: ficha.id, posicion }
    });

    // 6. Enviar email
    await enviarEmailBienvenida(email, password, ficha.folio);

    res.status(201).json({
      success: true,
      ficha: { folio: ficha.folio },
      mensaje: 'Revisa tu email para acceder a tu cuenta'
    });
  } catch (error) {
    handleError(res, error);
  }
};
```

### Frontend

**Archivo**: `frontend/src/components/RegistroFicha.jsx`

- Ya existe, solo actualizar mensajes

---

## 🎯 Fase 3: ETAPA 2 - Lista de Espera (2 horas)

### Backend

**Archivo**: `backend/src/controllers/listaEsperaController.js`

**Función**: `aceptarAspirante()`

```javascript
export const aceptarAspirante = async (req, res) => {
  try {
    await prisma.$transaction(async (tx) => {
      // 1. Actualizar usuario
      await tx.usuario.update({
        where: { id: usuarioId },
        data: { estatus: 'pendiente_formulario' }  // ⭐
      });

      // 2. Actualizar lista espera
      await tx.listaEspera.update({
        where: { id },
        data: { 
          estadoActual: 'aceptado',
          fechaAceptacion: new Date()
        }
      });

      // 3. Actualizar ficha
      await tx.fichaExamen.update({
        where: { id: fichaId },
        data: { estatus: 'aprobado' }
      });
    });

    // Enviar email
    await enviarEmailAceptacion(usuario.email);

    res.json({ success: true });
  } catch (error) {
    handleError(res, error);
  }
};
```

**Función**: `rechazarAspirante()`

```javascript
export const rechazarAspirante = async (req, res) => {
  try {
    await prisma.$transaction(async (tx) => {
      // 1. Actualizar usuario (NO eliminar todavía)
      await tx.usuario.update({
        where: { id: usuarioId },
        data: { 
          estatus: 'rechazado',
          activo: false,
          fechaRechazo: new Date()  // ⭐ Para el cron
        }
      });

      // 2. Actualizar lista espera
      await tx.listaEspera.update({
        where: { id },
        data: { 
          estadoActual: 'rechazado',
          fechaRechazo: new Date(),
          observaciones: motivo
        }
      });

      // 3. Actualizar ficha
      await tx.fichaExamen.update({
        where: { id: fichaId },
        data: { estatus: 'rechazado' }
      });
    });

    // Enviar email con motivo
    await enviarEmailRechazo(usuario.email, motivo);

    res.json({ success: true });
  } catch (error) {
    handleError(res, error);
  }
};
```

### Frontend

**Archivo**: `frontend/src/components/AdminListaEspera.jsx`

- Ya existe, funciona correctamente

---

## 🎯 Fase 4: Portal del Aspirante (3 horas)

### Backend

**Archivo**: `backend/src/controllers/aspiranteController.js` (NUEVO)

```javascript
// GET /api/aspirante/estado
export const obtenerEstado = async (req, res) => {
  const usuario = req.user;  // Del JWT

  const info = await prisma.usuario.findUnique({
    where: { id: usuario.id },
    include: {
      fichaExamen: {
        include: { listaEspera: true }
      },
      solicitudes: true
    }
  });

  res.json({
    estatus: info.estatus,
    mensaje: getMensajeEstatus(info.estatus),
    detalles: {
      posicionEspera: info.fichaExamen?.listaEspera?.posicion,
      formularioLlenado: info.solicitudes?.length > 0,
      pagoRealizado: info.solicitudes?.[0]?.estatusPago === 'pagado'
    }
  });
};
```

### Frontend

**Archivos NUEVOS**:

1. `frontend/src/pages/PortalAspirante.jsx`
2. `frontend/src/components/aspirante/Dashboard.jsx`
3. `frontend/src/components/aspirante/EstadoSolicitud.jsx`

```jsx
// Dashboard según estatus
const Dashboard = ({ usuario }) => {
  switch (usuario.estatus) {
    case 'en_revision':
      return <EstadoEnRevision />;
    
    case 'pendiente_formulario':
      return <FormularioInscripcion />;
    
    case 'pendiente_pago':
      return <ProcesoPago />;
    
    case 'activo':
      return <PortalAlumno />;
    
    case 'rechazado':
      return <Rechazado />;
  }
};
```

---

## 🎯 Fase 5: ETAPA 3 - Formulario de Inscripción (4 horas)

### Backend

**Archivo**: `backend/src/controllers/solicitudController.js` (NUEVO)

```javascript
// POST /api/solicitudes
export const crearSolicitud = async (req, res) => {
  try {
    const { datosPersonales, datosAcademicos, datosTutor, tipo } = req.body;
    const usuario = req.user;

    // Validar que el usuario esté en estado correcto
    if (usuario.estatus !== 'pendiente_formulario') {
      return res.status(400).json({
        error: 'No puedes llenar el formulario en este momento'
      });
    }

    // Calcular monto según tipo
    const montoPagar = tipo === 'nuevo_ingreso' 
      ? parseFloat(process.env.MONTO_INSCRIPCION)
      : parseFloat(process.env.MONTO_REINSCRIPCION);

    // Crear solicitud
    const solicitud = await prisma.solicitud.create({
      data: {
        usuarioId: usuario.id,
        tipo,
        estatus: 'pendiente_pago',
        datosPersonales,
        datosAcademicos,
        datosTutor,
        montoPagar,
        estatusPago: 'pendiente'
      }
    });

    // Actualizar usuario
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { estatus: 'pendiente_pago' }
    });

    res.status(201).json({
      success: true,
      solicitud: {
        id: solicitud.id,
        montoPagar: solicitud.montoPagar
      }
    });
  } catch (error) {
    handleError(res, error);
  }
};
```

### Frontend

**Archivo NUEVO**: `frontend/src/components/aspirante/FormularioInscripcion.jsx`

Formulario extenso multi-step con:
- Paso 1: Datos personales completos
- Paso 2: Datos académicos
- Paso 3: Datos de tutor (opcional)
- Paso 4: Subir documentos
- Paso 5: Revisión y envío

---

## 🎯 Fase 6: ETAPA 5 - Integración Stripe (5 horas)

### Configuración

1. **Instalar Stripe**
   ```bash
   cd backend
   npm install stripe
   ```

2. **Variables de entorno** (`.env`)
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   MONTO_INSCRIPCION=3500.00
   MONTO_REINSCRIPCION=2500.00
   ```

### Backend

**Archivo NUEVO**: `backend/src/services/stripeService.js`

```javascript
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const crearSesionPago = async (solicitudId, montoPagar) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'mxn',
          product_data: {
            name: 'Inscripción',
            description: `Solicitud #${solicitudId}`
          },
          unit_amount: Math.round(montoPagar * 100)  // Centavos
        },
        quantity: 1
      }
    ],
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/portal-aspirante/pago/exito?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/portal-aspirante/pago/cancelado`,
    metadata: { solicitudId }
  });

  return session;
};
```

**Archivo NUEVO**: `backend/src/controllers/pagoController.js`

```javascript
import { crearSesionPago } from '../services/stripeService.js';

// POST /api/pagos/crear-sesion
export const crearSesion = async (req, res) => {
  try {
    const { solicitudId } = req.body;
    const usuario = req.user;

    // Verificar que la solicitud existe y es del usuario
    const solicitud = await prisma.solicitud.findFirst({
      where: { 
        id: parseInt(solicitudId),
        usuarioId: usuario.id,
        estatusPago: 'pendiente'
      }
    });

    if (!solicitud) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    // Crear sesión en Stripe
    const session = await crearSesionPago(solicitud.id, solicitud.montoPagar);

    // Guardar session ID
    await prisma.solicitud.update({
      where: { id: solicitud.id },
      data: { stripeSessionId: session.id }
    });

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    handleError(res, error);
  }
};
```

**Archivo NUEVO**: `backend/src/webhooks/stripeWebhook.js`

```javascript
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /webhooks/stripe
export const manejarWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Manejar evento
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const solicitudId = parseInt(session.metadata.solicitudId);

    await procesarPagoExitoso(solicitudId, session);
  }

  res.json({ received: true });
};

const procesarPagoExitoso = async (solicitudId, session) => {
  await prisma.$transaction(async (tx) => {
    // 1. Obtener solicitud
    const solicitud = await tx.solicitud.findUnique({
      where: { id: solicitudId },
      include: { usuario: { include: { fichaExamen: true } } }
    });

    // 2. Actualizar solicitud
    await tx.solicitud.update({
      where: { id: solicitudId },
      data: {
        estatus: 'aprobada',
        estatusPago: 'pagado',
        fechaPago: new Date()
      }
    });

    // 3. Formalizar usuario ⭐ IMPORTANTE
    await tx.usuario.update({
      where: { id: solicitud.usuarioId },
      data: { 
        temporal: false,  // ⭐ Ya no es temporal
        estatus: 'activo'
      }
    });

    // 4. Crear alumno
    const numeroControl = await generarNumeroControl();
    await tx.alumno.create({
      data: {
        numeroControl,
        nombre: solicitud.datosPersonales.nombre,
        apellidoPaterno: solicitud.datosPersonales.apellidoPaterno,
        apellidoMaterno: solicitud.datosPersonales.apellidoMaterno,
        curp: solicitud.datosPersonales.curp,
        fechaNacimiento: new Date(solicitud.datosPersonales.fechaNacimiento),
        telefono: solicitud.datosPersonales.telefono,
        email: solicitud.usuario.email,
        direccion: solicitud.datosPersonales.direccion,
        fichaExamenId: solicitud.usuario.fichaExamen.id,
        semestreActual: 1,
        estatusAlumno: 'activo'
      }
    });

    // 5. Guardar registro de pago
    await tx.pago.create({
      data: {
        solicitudId,
        usuarioId: solicitud.usuarioId,
        monto: solicitud.montoPagar,
        moneda: 'MXN',
        stripePaymentId: session.payment_intent,
        stripeStatus: 'succeeded',
        concepto: solicitud.tipo === 'nuevo_ingreso' ? 'inscription' : 'reinscription',
        metodoPago: 'card'
      }
    });
  });

  // Enviar email de confirmación
  await enviarEmailInscripcionExitosa(solicitud.usuario.email);
};
```

### Frontend

**Instalar Stripe**:
```bash
cd frontend
npm install @stripe/stripe-js
```

**Archivo NUEVO**: `frontend/src/components/aspirante/ProcesoPago.jsx`

```jsx
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const ProcesoPago = ({ solicitud }) => {
  const handlePagar = async () => {
    try {
      // Crear sesión de pago
      const response = await fetch('/api/pagos/crear-sesion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ solicitudId: solicitud.id })
      });

      const { sessionId } = await response.json();

      // Redirigir a Stripe
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      toast.error('Error al procesar el pago');
    }
  };

  return (
    <Card>
      <h2>Completar Inscripción</h2>
      <p>Monto a pagar: ${solicitud.montoPagar} MXN</p>
      <Button onClick={handlePagar} variant="primary">
        Pagar con Tarjeta
      </Button>
    </Card>
  );
};
```

---

## 🎯 Fase 7: Cron Job - Eliminar Rechazados (1 hora)

### Backend

**Archivo NUEVO**: `backend/src/cron/cleanupRejected.js`

```javascript
import cron from 'node-cron';
import { prisma } from '../config/database.js';

export const iniciarCronLimpieza = () => {
  // Ejecutar todos los días a las 00:00
  cron.schedule('0 0 * * *', async () => {
    console.log('🗑️ Ejecutando limpieza de usuarios rechazados...');

    const hace7Dias = new Date();
    hace7Dias.setDate(hace7Dias.getDate() - 7);

    try {
      const eliminados = await prisma.usuario.deleteMany({
        where: {
          estatus: 'rechazado',
          fechaRechazo: { lt: hace7Dias }
        }
      });

      console.log(`✅ ${eliminados.count} usuarios rechazados eliminados`);
    } catch (error) {
      console.error('❌ Error en limpieza:', error);
    }
  });
};
```

**En `server.js`**:
```javascript
import { iniciarCronLimpieza } from './cron/cleanupRejected.js';

// Al final del archivo
iniciarCronLimpieza();
```

---

## 📋 Checklist General

- [ ] Fase 1: Base de datos actualizada
- [ ] Fase 2: Registro de aspirante funcional
- [ ] Fase 3: Lista de espera con aceptar/rechazar
- [ ] Fase 4: Portal del aspirante
- [ ] Fase 5: Formulario de inscripción
- [ ] Fase 6: Integración Stripe completa
- [ ] Fase 7: Cron job de limpieza
- [ ] Pruebas end-to-end
- [ ] Documentación de usuario

---

**Tiempo total estimado**: 18-20 horas de desarrollo

**Estado**: Listo para iniciar  
**Próximo paso**: Actualizar schema y aplicar migración
