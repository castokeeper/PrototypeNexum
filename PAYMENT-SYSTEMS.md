# 💳 Sistemas de Pago para el Prototipo

Guía completa de opciones de integración de sistemas de pago para el Sistema de Reinscripciones, con enfoque en el mercado mexicano.

---

## 📊 Comparativa de Opciones

| **Proveedor** | **Facilidad** | **Comisión** | **México** | **Métodos de Pago** | **Testing** | **Recomendado para** |
|---------------|---------------|--------------|------------|---------------------|-------------|-----------------------|
| **Stripe** | ⭐⭐⭐⭐⭐ | 3.6% + $3 MXN | ✅ | Tarjetas, OXXO, SPEI | Excelente | Desarrollo rápido, testing |
| **Conekta** | ⭐⭐⭐⭐ | 3.5% + $3 MXN | ✅✅ | Tarjetas, OXXO, SPEI | Muy bueno | Producción en México |
| **Mercado Pago** | ⭐⭐⭐⭐ | 3.99% + IVA | ✅ | Tarjetas, efectivo | Bueno | E-commerce, familiaridad |
| **PayPal** | ⭐⭐⭐ | 4.4% + comisión fija | ✅ | PayPal, tarjetas | Bueno | Reconocimiento de marca |
| **OpenPay** | ⭐⭐⭐ | 2.9% + $2.5 MXN | ✅✅ | Tarjetas, 7-Eleven, etc. | Bueno | Instituciones educativas |

---

## 🚀 Opción 1: Stripe (RECOMENDADO)

### ✅ Ventajas
- **Excelente documentación** en español e inglés
- **Modo de prueba robusto** con tarjetas de test
- **Webhooks confiables** para actualizar estados
- **Dashboard intuitivo** para monitoreo
- **Múltiples métodos de pago**: tarjetas, OXXO, SPEI
- **Sin costo de configuración**
- **API moderna y bien mantenida**

### ❌ Desventajas
- Comisión ligeramente más alta que algunas opciones locales
- Requiere verificación de cuenta para producción

### 💰 Costos
- **3.6% + $3 MXN** por transacción con tarjeta
- **$8 MXN** por pago en OXXO
- **Sin mensualidad**

### 🔧 Implementación

#### 1. Instalación

```bash
npm install stripe
```

#### 2. Configuración Backend (`backend/src/config/stripe.js`)

```javascript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export default stripe;
```

#### 3. Endpoint de Pago (`backend/src/controllers/pagosController.js`)

```javascript
import stripe from '../config/stripe.js';

export const crearIntentoPago = async (req, res) => {
  try {
    const { solicitudId, monto } = req.body;
    
    // Crear Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(monto * 100), // Convertir a centavos
      currency: 'mxn',
      metadata: {
        solicitudId: solicitudId.toString(),
      },
      payment_method_types: ['card', 'oxxo'],
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Webhook para confirmar pagos
export const webhookStripe = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const solicitudId = paymentIntent.metadata.solicitudId;
      
      // Actualizar estado del pago en la base de datos
      await prisma.pago.update({
        where: { pagoGatewayId: paymentIntent.id },
        data: { estatus: 'COMPLETADO', fechaPago: new Date() },
      });
    }

    res.json({ received: true });
  } catch (error) {
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};
```

#### 4. Frontend con Stripe Elements (`frontend/src/components/PagoForm.jsx`)

```javascript
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function PagoFormulario({ solicitudId, monto }) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Crear Payment Intent en el backend
    const response = await fetch('/api/pagos/crear-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ solicitudId, monto }),
    });
    const { clientSecret } = await response.json();

    // Confirmar el pago
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      console.error(result.error.message);
    } else {
      console.log('Pago exitoso!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>Pagar ${monto}</button>
    </form>
  );
}

export default function PagoForm(props) {
  return (
    <Elements stripe={stripePromise}>
      <PagoFormulario {...props} />
    </Elements>
  );
}
```

#### 5. Variables de Entorno

```env
# Backend (.env)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend (.env.local)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 🧪 Testing

**Tarjetas de prueba:**
- **Éxito**: `4242 4242 4242 4242`
- **Fallo**: `4000 0000 0000 0002`
- **Requiere autenticación 3D**: `4000 0027 6000 3184`

**OXXO test**: Disponible en modo test

---

## 🇲🇽 Opción 2: Conekta (MEXICANO)

### ✅ Ventajas
- **Diseñado específicamente para México**
- **OXXO Pay muy popular** entre estudiantes
- **SPEI (transferencia bancaria)**
- **Soporte en español**
- **Cumplimiento regulatorio mexicano**
- **Dashboard en español**

### ❌ Desventajas
- Documentación menos completa que Stripe
- Comunidad más pequeña

### 💰 Costos
- **3.5% + $3 MXN** por transacción con tarjeta
- **$8 MXN** por OXXO
- **Sin mensualidad**

### 🔧 Implementación

```bash
npm install conekta
```

```javascript
// Backend
import conekta from 'conekta';
conekta.api_key = process.env.CONEKTA_PRIVATE_KEY;
conekta.locale = 'es';

export const crearOrden = async (req, res) => {
  try {
    const { solicitudId, monto, metodoPago } = req.body;
    
    const order = await conekta.Order.create({
      currency: 'MXN',
      customer_info: {
        name: req.body.nombreAlumno,
        email: req.body.email,
        phone: req.body.telefono,
      },
      line_items: [{
        name: 'Pago de Inscripción',
        unit_price: monto * 100,
        quantity: 1,
      }],
      charges: [{
        payment_method: {
          type: metodoPago, // 'oxxo_cash' o 'card'
        },
      }],
      metadata: {
        solicitudId: solicitudId.toString(),
      },
    });

    res.json({
      orderId: order.id,
      paymentUrl: order.charges.data[0].payment_method.reference,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

---

## 🛍️ Opción 3: Mercado Pago

### ✅ Ventajas
- **Muy conocido** en Latinoamérica
- **Múltiples métodos de pago**
- **QR para pagos en tiendas**
- **App móvil popular**

### ❌ Desventajas
- Comisiones más altas
- Interfaz menos developer-friendly

### 💰 Costos
- **3.99% + IVA** por transacción

### 🔧 Implementación

```bash
npm install mercadopago
```

```javascript
import mercadopago from 'mercadopago';

mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

export const crearPreferencia = async (req, res) => {
  const preference = {
    items: [
      {
        title: 'Pago de Inscripción',
        unit_price: parseFloat(req.body.monto),
        quantity: 1,
      },
    ],
    back_urls: {
      success: 'http://localhost:5173/pago-exitoso',
      failure: 'http://localhost:5173/pago-fallido',
      pending: 'http://localhost:5173/pago-pendiente',
    },
    auto_return: 'approved',
  };

  const response = await mercadopago.preferences.create(preference);
  res.json({ preferenceId: response.body.id });
};
```

---

## 🏦 Opción 4: OpenPay (BBVA)

### ✅ Ventajas
- **Propiedad de BBVA** (confianza institucional)
- **Ideal para educación**
- **Múltiples tiendas de conveniencia**
- **PCI Compliant**

### ❌ Desventajas
- Proceso de alta más complejo
- Documentación menos moderna

### 💰 Costos
- **2.9% + $2.5 MXN** (las comisiones más bajas)

### 🔧 Implementación

```bash
npm install openpay
```

```javascript
import Openpay from 'openpay';

const openpay = new Openpay(
  process.env.OPENPAY_MERCHANT_ID,
  process.env.OPENPAY_PRIVATE_KEY
);

export const crearCargo = async (req, res) => {
  const chargeRequest = {
    method: 'store',
    amount: req.body.monto,
    description: 'Pago de Inscripción',
    customer: {
      name: req.body.nombreAlumno,
      email: req.body.email,
    },
  };

  openpay.charges.create(chargeRequest, (error, charge) => {
    if (error) {
      res.status(500).json({ error: error.description });
    } else {
      res.json({
        reference: charge.payment_method.reference,
        barcodeUrl: charge.payment_method.barcode_url,
      });
    }
  });
};
```

---

## 💡 Recomendación por Caso de Uso

### Para Desarrollo y Prototipo
🏆 **STRIPE** - La mejor opción por:
- Facilidad de implementación
- Excelente modo de prueba
- Documentación superior
- Transición fácil a producción

### Para Producción en México
🏆 **CONEKTA** - Mejor adaptado a México:
- Optimizado para mercado local
- OXXO muy usado por estudiantes
- Comisiones competitivas
- Cumplimiento local

### Para Instituciones Grandes
🏆 **OPENPAY** - Por:
- Respaldo de BBVA
- Comisiones más bajas
- Múltiples canales de pago

---

## 📋 Modificaciones al Schema de Base de Datos

### Agregar al archivo `backend/prisma/schema.prisma`:

```prisma
model Pago {
  id                String        @id @default(uuid())
  solicitudId       Int
  solicitud         Solicitud     @relation(fields: [solicitudId], references: [id])
  
  // Información del pago
  monto             Decimal       @db.Decimal(10, 2)
  moneda            String        @default("MXN")
  metodoPago        MetodoPago
  estatus           EstatusPago   @default(PENDIENTE)
  
  // Gateway
  pagoGatewayId     String?       @unique // ID del pago en Stripe/Conekta/etc
  gateway           String        // 'stripe', 'conekta', 'mercadopago', etc.
  
  // Comprobante  
  comprobanteUrl    String?
  referencia        String?       // Para OXXO, SPEI, etc.
  
  // Metadata
  metadata          Json?
  
  // Fechas
  fechaCreacion     DateTime      @default(now())
  fechaPago         DateTime?
  fechaExpiracion   DateTime?
  
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt
  
  @@index([solicitudId])
  @@index([estatus])
  @@index([pagoGatewayId])
}

enum MetodoPago {
  TARJETA_CREDITO
  TARJETA_DEBITO
  TRANSFERENCIA_SPEI
  OXXO
  PAYPAL
  MERCADOPAGO
  TIENDA_CONVENIENTE
}

enum EstatusPago {
  PENDIENTE
  PROCESANDO
  COMPLETADO
  CANCELADO
  REEMBOLSADO
  FALLIDO
  EXPIRADO
}
```

### Agregar relación a la tabla Solicitud:

```prisma
model Solicitud {
  // ... campos existentes ...
  pagos             Pago[]
}
```

---

## 🚀 Plan de Implementación Recomendado

### Fase 1: Prototipo (STRIPE)
1. Crear cuenta de Stripe (modo test)
2. Instalar dependencias
3. Configurar backend con Payment Intents
4. Integrar Stripe Elements en frontend
5. Probar con tarjetas de test

### Fase 2: Producción
1. Evaluar comisiones reales
2. Considerar migrar a Conekta si el volumen lo justifica
3. Activar cuenta en producción
4. Configurar webhooks
5. Implementar sistema de notificaciones

### Fase 3: Optimización
1. Agregar más métodos de pago (OXXO, SPEI)
2. Implementar retry logic
3. Dashboard de pagos
4. Reportes y conciliación

---

## 🔐 Consideraciones de Seguridad

- ✅ **NUNCA** guardar números de tarjeta completos
- ✅ Usar **HTTPS** en producción
- ✅ Validar **webhooks** con firma
- ✅ Implementar **CSRF protection**
- ✅ Logs de auditoría de pagos
- ✅ Cumplir con **PCI DSS** (los gateways lo manejan)
- ✅ Cifrar datos sensibles en la base de datos

---

## 📚 Recursos Adicionales

### Stripe
- Documentación: https://stripe.com/docs
- Dashboard: https://dashboard.stripe.com
- Testing: https://stripe.com/docs/testing

### Conekta
- Documentación: https://developers.conekta.com
- Dashboard: https://admin.conekta.com

### Mercado Pago
- Documentación: https://www.mercadopago.com.mx/developers

### OpenPay
- Documentación: https://www.openpay.mx/docs

---

**Actualizado:** 2025-11-20  
**Versión:** 1.0.0
