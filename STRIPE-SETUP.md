# 🔧 Configuración de Stripe

Guía completa para configurar Stripe en el proyecto.

---

## 📝 Paso 1: Crear Cuenta de Stripe

1. Ve a [https://stripe.com](https://stripe.com)
2. Crea una cuenta o inicia sesión
3. Activa el **modo de prueba** (Test Mode) en la esquina superior derecha

---

## 🔑 Paso 2: Obtener Claves API

### En el Dashboard de Stripe:

1. Ve a **Developers** → **API keys**
2. Encontrarás dos claves en modo TEST:
   - **Publishable key** (clave pública): `pk_test_...`
   - **Secret key** (clave secreta): `sk_test_...`

### Configurar en el Backend:

Edita `backend/.env`:

```env
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta_aqui
STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_publica_aqui
```

### Configurar en el Frontend:

Crea `frontend/.env`:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_publica_aqui
```

---

## 🔔 Paso 3: Configurar Webhooks

Los webhooks permiten que Stripe notifique a tu backend cuando se completa un pago.

### Opción A: En Desarrollo (Local con Stripe CLI)

1. **Instalar Stripe CLI**:
   ```bash
   # Windows (con Scoop)
   scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
   scoop install stripe
   
   # O descargar desde: https://github.com/stripe/stripe-cli/releases/latest
   ```

2. **Login en Stripe CLI**:
   ```bash
   stripe login
   ```

3. **Ejecutar el webhook listener**:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. **Copiar el webhook secret** que aparece (empieza con `whsec_...`)

5. **Agregarlo al .env**:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_tu_secret_aqui
   ```

### Opción B: En Producción (con ngrok o servidor público)

1. **Instalar ngrok** (opcional, para desarrollo):
   ```bash
   # Descargar desde https://ngrok.com
   ngrok http 3000
   ```

2. **Configurar webhook en Stripe Dashboard**:
   - Ve a **Developers** → **Webhooks**
   - Click en **Add endpoint**
   - URL: `https://tu-dominio.com/api/webhooks/stripe`
   - Eventos a escuchar:
     - `checkout.session.completed`
     - `checkout.session.expired`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`

3. **Copiar el Signing secret** y agregarlo al `.env`

---

## 💰 Paso 4: Configurar Montos

Edita `backend/.env`:

```env
MONTO_INSCRIPCION=1500.00
FRONTEND_URL=http://localhost:5173
```

---

## 🧪 Paso 5: Probar con Tarjetas de Prueba

Stripe proporciona tarjetas de prueba para testing:

| Tarjeta | Número | Uso |
|---------|--------|-----|
| **Visa** | 4242 4242 4242 4242 | Pago exitoso |
| **Declined** | 4000 0000 0000 0002 | Pago rechazado |
| **Require 3DS** | 4000 0025 0000 3155 | Requiere autenticación |

- **Fecha de expiración**: Cualquier fecha futura (ej: 12/25)
- **CVC**: Cualquier 3 dígitos (ej: 123)
- **ZIP**: Cualquier código postal (ej: 12345)

---

## ✅ Paso 6: Verificar la Configuración

### 1. Verificar Variables de Entorno

**Backend**:
```bash
cd backend
# Debe tener:
# - STRIPE_SECRET_KEY
# - STRIPE_WEBHOOK_SECRET
# - FRONTEND_URL
# - MONTO_INSCRIPCION
```

**Frontend**:
```bash
cd frontend
# Debe tener:
# - VITE_STRIPE_PUBLISHABLE_KEY
```

### 2. Iniciar Servicios

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

**Terminal 3 - Stripe CLI** (opcional, para webhooks locales):
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## 🔄 Paso 7: Flujo Completo de Prueba

1. **Registrar un aspirante**:
   - Ir a `/registro-ficha`
   - Llenar el formulario
   - Guardar credenciales

2. **Login y aceptar como admin**:
   - Login como admin
   - Ir a `/admin/lista-espera`
   - Aceptar al aspirante

3. **Login como aspirante**:
   - Usar las credenciales del aspirante
   - Ir a `/portal-aspirante`
   - Click en **"Llenar Formulario"**

4. **Completar formulario**:
   - Llenar los 4 pasos
   - Enviar formulario

5. **Realizar pago**:
   - Click en **"Realizar Pago"**
   - Usar tarjeta de prueba: `4242 4242 4242 4242`
   - Completar el pago

6. **Verificar confirmación**:
   - Deberías ser redirigido a `/pago-exitoso`
   - Verificar en Prisma Studio que se creó el alumno
   - Verificar que el usuario cambió a estatus: `activo`

---

## 📊 Monitoreo

### Dashboard de Stripe
- Ve a **Payments** para ver los pagos de prueba
- Ve a **Events & logs** → **Webhooks** para ver los webhooks recibidos

### Base de Datos
```bash
cd backend
npx prisma studio
```

Verifica las tablas:
- **Solicitud**: `estatusPago` debe ser `"pagado"`
- **Usuario**: `estatus` debe ser `"activo"` y `temporal` debe ser `false`
- **Alumno**: Debe existir un registro nuevo
- **Pago**: Debe tener el registro del pago

---

## 🚨 Solución de Problemas

### Error: "Webhook signature verification failed"
- Verifica que `STRIPE_WEBHOOK_SECRET` esté configurado
- Si usas Stripe CLI, asegúrate que esté corriendo
- El webhook secret cambia cada vez que reinicias `stripe listen`

### Error: "Invalid API Key"
- Verifica que la clave empiece con `sk_test_` (backend) o `pk_test_` (frontend)
- Asegúrate de estar en **modo de prueba** en Stripe Dashboard
- Verifica que las variables estén en el archivo `.env` correcto

### Pago no se confirma automáticamente
- Verifica que el webhook esté recibiendo eventos
- Revisa los logs del backend
- Verifica en Stripe Dashboard → Webhooks que el endpoint esté activo

### No redirige después del pago
- Verifica `FRONTEND_URL` en backend/.env
- Debe ser exactamente: `http://localhost:5173` (sin / al final)

---

## 🌐 Producción

Para producción, deberás:

1. **Cambiar a claves LIVE**:
   - Modo LIVE en Stripe Dashboard
   - Usar claves `pk_live_...` y `sk_live_...`

2. **Configurar webhook con URL pública**:
   - URL: `https://tudominio.com/api/webhooks/stripe`
   - Usar el signing secret de producción

3. **Activar tu cuenta de Stripe**:
   - Completar información de negocio
   - Verificar identidad
   - Configurar métodos de pago

4. **Configurar SSL**:
   - Stripe requiere HTTPS en producción

---

## 📚 Recursos

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Webhooks Guide](https://stripe.com/docs/webhooks)

---

**¡Listo!** Ahora tienes Stripe completamente configurado en tu proyecto.
