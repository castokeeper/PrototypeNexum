# 🚀 Guía de Inicio Rápido

Esta guía te ayudará a poner en marcha el sistema en 10 minutos.

---

## ⚡ Inicio Rápido (Quick Start)

### 1. Clonar/Verificar el Proyecto

```bash
cd c:\Users\yooh2\WebstormProjects\prototipo
```

### 2. Backend Setup

```bash
cd backend

# Si no has instalado dependencias
npm install

# Configurar variables de entorno
# Copiar .env.example a .env y completar:
# - DATABASE_URL (tu PostgreSQL de Azure)
# - JWT_SECRET
# - STRIPE_SECRET_KEY
# - STRIPE_WEBHOOK_SECRET (después de configurar webhook)
# - FRONTEND_URL=http://localhost:5173
# - MONTO_INSCRIPCION=1500.00

# Ejecutar migraciones
npx prisma migrate dev

# Seed inicial (opcional - crea admin)
npx prisma db seed

# Iniciar servidor
npm run dev
```

**El backend debería estar corriendo en**: `http://localhost:3000`

### 3. Frontend Setup

```bash
# En otra terminal
cd frontend

# Si no has instalado dependencias
npm install

# Configurar variables de entorno
# Crear .env:
# VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Iniciar desarrollo
npm run dev
```

**El frontend debería estar corriendo en**: `http://localhost:5173`

### 4. Configurar Stripe (Opcional para Testing)

```bash
# Instalar Stripe CLI
# Windows (con Scoop):
scoop install stripe

# Login
stripe login

# En otra terminal, ejecutar webhook listener
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Copiar el webhook secret (whsec_...) al .env del backend
```

---

## 🧪 Probar el Sistema

### Opción 1: Flujo Completo Manual

1. **Ir a** `http://localhost:5173/registro-ficha`
2. **Llenar** el formulario de registro
3. **Guardar** las credenciales que aparecen
4. **Login como admin** (si tienes):
   - Usuario: `admin`
   - Password: (tu password de admin)
5. **Ir a** "Lista de Espera" → Aceptar al aspirante
6. **Logout** y login con las credenciales del aspirante
7. **Ir al Portal** → "Llenar Formulario"
8. **Completar** los 4 pasos del formulario
9. **Hacer click** en "Realizar Pago"
10. **En Stripe** usar tarjeta: `4242 4242 4242 4242`
11. **Verificar** redirección a página de éxito

### Opción 2: Testing de Cron Job

```bash
cd backend

# Crear usuario de prueba rechazado
node test-cron.js crear-prueba

# Ejecutar limpieza
node test-cron.js limpiar
```

---

## 🔑 Credenciales de Prueba

### Admin (después del seed)
```
Usuario: admin
Password: admin123
```

### Stripe Testing
```
Tarjeta: 4242 4242 4242 4242
Fecha: 12/25 (cualquier fecha futura)
CVC: 123
ZIP: 12345
```

---

## 📋 Verificación Rápida

### Backend Running?
```bash
curl http://localhost:3000/health
```

**Debería responder**: `{"status":"ok"}`

### Frontend Running?
Abrir: `http://localhost:5173`

### Database Connected?
```bash
cd backend
npx prisma studio
```

Debería abrir Prisma Studio en el navegador.

---

## 🛠️ Comandos Útiles

```bash
# Backend
cd backend
npm run dev              # Iniciar servidor
npx prisma studio        # Ver base de datos
npx prisma migrate dev   # Ejecutar migraciones
node test-cron.js        # Probar cron job

# Frontend
cd frontend
npm run dev              # Iniciar frontend
npm run build            # Build de producción

# Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## ❓ Troubleshooting

### "Cannot connect to database"
- Verifica `DATABASE_URL` en backend/.env
- Asegúrate que la base de datos de Azure esté accesible

### "JWT secret is required"
- Agrega `JWT_SECRET` en backend/.env

### "Stripe API key invalid"
- Verifica que `STRIPE_SECRET_KEY` comience con `sk_test_`
- Asegúrate de estar en modo test en Stripe Dashboard

### "Webhook signature verification failed"
- Asegúrate que Stripe CLI esté corriendo
- Copia el nuevo webhook secret cada vez que reinicias Stripe CLI
- Pega el secret en backend/.env como `STRIPE_WEBHOOK_SECRET`

### Cron job no se ejecuta
- El cron job se ejecuta automáticamente al iniciar el servidor
- Verifica los logs: deberías ver "⏰ Iniciando tareas programadas..."
- Para testing, usa: `node test-cron.js`

---

## 📚 Documentación Completa

Para más detalles, consulta:

- **`PROYECTO-COMPLETADO.md`** - Resumen completo del proyecto
- **`STRIPE-SETUP.md`** - Configuración detallada de Stripe
- **`FASE-X-COMPLETADA.md`** - Detalles de cada fase
- **`FLUJO-COMPLETO-ADMISION.md`** - Flujo del sistema

---

## 🎯 Próximos Pasos

Una vez que todo esté funcionando:

1. **Personalizar** el frontend con el nombre de tu institución
2. **Configurar** montos de inscripción en .env
3. **Crear** usuarios admin adicionales
4. **Probar** todo el flujo completo
5. **Preparar** para producción (ver PROYECTO-COMPLETADO.md)

---

¡Listo! El sistema debería estar funcionando. 🎉
