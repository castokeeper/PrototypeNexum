# ⚡ Aplicar Migración - Pasos

## 📋 Cambios en el Schema

✅ Agregado enum `EstatusUsuario`
✅ Agregado enum `EstatusPago`  
✅ Actualizado modelo `Usuario` con campos: estatus, fechaRechazo
✅ Actualizado modelo `Solicitud` con campos de pago y datos JSON
✅ Creado modelo `Pago` para registros de Stripe

---

## 🚀 Comandos a Ejecutar

### Opción A: Usando db push (Recomendado para desarrollo)

```bash
cd backend
npx prisma db push
npx prisma generate
```

Este comando:
- Aplica los cambios directamente a la BD
- NO crea archivos de migración
- Es más rápido para desarrollo

### Opción B: Crear migración formal

```bash
cd backend
npx prisma migrate dev --name add_flujo_completo_admision
```

Este comando:
- Crea archivo de migración
- Aplica cambios a la BD
- Genera cliente de Prisma
- **Requiere interacción** (confirmación)

---

## ⚠️ IMPORTANTE

El servidor debe estar **DETENIDO** antes de ejecutar estos comandos.

1. Detener `npm run dev` (Ctrl+C)
2. Ejecutar migración
3. Reiniciar servidor

---

## ✅ Verificación

Después de aplicar la migración:

```bash
# Ver la BD en navegador
npx prisma studio
```

Verifica que existan:
- Tabla `pagos`
- Columnas nuevas en `usuarios` (estatus, fecha_rechazo)
- Columnas nuevas en `solicitudes` (datos_personales, monto_pagar, etc.)

---

## 🐛 Si hay errores

Si Prisma muestra errores de constraint o datos existentes:

```bash
# Opción 1: Reset completo (⚠️ BORRA TODOS LOS DATOS)
npx prisma migrate reset

# Opción 2: Aplicar cambios manualmente
# (Contactar para ayuda)
```

---

**Estado**: Listo para aplicar
**Siguiente paso**: Actualizar controladores
