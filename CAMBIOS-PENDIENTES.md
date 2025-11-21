# 🔄 Cambios Pendientes - Flujo de Admisión

**Fecha**: 2025-11-21 13:40  
**Estado**: ⚠️ EN IMPLEMENTACIÓN

---

## ✅ Completado

1. ✅ Documentación del nuevo flujo (`FLUJO-ADMISION.md`)
2. ✅ Schema de Prisma actualizado:
   - Enum RolUsuario con `aspirante`
   - Usuario con campo `temporal`
   - FichaExamen con relación a Usuario

---

## ⚠️ Pendiente de Aplicar

### 1. **Detener Servidores**

El servidor debe detenerse para aplicar la migración:

```bash
# Detener el proceso npm run dev que está corriendo
# Ctrl+C en la terminal
```

### 2. **Aplicar Migración de Base de Datos**

```bash
cd backend

# Opción A: Migración automática de Prisma (Recomendado)
npx prisma db push

# Opción B: Migración manual con el SQL creado
# Ejecutar manualmente el archivo:
# backend/prisma/migrations/manual_add_usuario_temporal/migration.sql
```

### 3. **Generar Cliente de Prisma**

```bash
npx prisma generate
```

### 4. **Actualizar Controladores**

#### `backend/src/controllers/fichaExamenController.js`

**Función `crearFicha()`** - Agregar lógica para crear usuario temporal:

```javascript
import bcrypt from 'bcrypt';
import { generarPassword } from '../utils/passwordGenerator.js';

export const crearFicha = async (req, res) => {
    try {
        const { nombre, apellidoPaterno, apellidoMaterno, curp, email, ... } = req.body;

        // 1. Generar contraseña temporal
        const passwordTemporal = generarPassword(12);
        const passwordHash = await bcrypt.hash(passwordTemporal, 10);

        // 2. Crear usuario temporal
        const usuario = await prisma.usuario.create({
            data: {
                username: email.toLowerCase(),
                passwordHash,
                nombre: `${nombre} ${apellidoPaterno} ${apellidoMaterno}`,
                email: email.toLowerCase(),
                rol: 'aspirante',
                temporal: true,
                activo: true
            }
        });

        // 3. Generar folio
        const folio = await generarFolioUnico();

        // 4. Crear ficha vinculada al usuario
        const ficha = await prisma.fichaExamen.create({
            data: {
                folio,
                nombre,
                apellidoPaterno,
                apellidoMaterno,
                curp: curp.toUpperCase(),
                fechaNacimiento: new Date(fechaNacimiento),
                telefono,
                email: email.toLowerCase(),
                direccion,
                carreraId: parseInt(carreraId),
                turnoPreferido: turnoPreferido,
            usuarioId: usuario.id  // ⭐ VINCULAR
            },
            include: { carrera: true }
        });

        // 5. Agregar a lista de espera
        const posicion = await obtenerSiguientePosicion();
        await prisma.listaEspera.create({
            data: {
                fichaId: ficha.id,
                posicion
            }
        });

        // 6. TODO: Enviar email con credenciales
        // await enviarEmailCredenciales(email, passwordTemporal);

        res.status(201).json({
            success: true,
            ficha: {
                folio: ficha.folio,
                nombre: `${ficha.nombre} ${ficha.apellidoPaterno} ${ficha.apellidoMaterno}`,
                carrera: ficha.carrera.nombre,
                posicionEspera: posicion
            },
            credenciales: {
                username: email,
                // ⚠️ Solo para desarrollo - NO enviar en producción
                passwordTemporal: process.env.NODE_ENV === 'development' ? passwordTemporal : undefined
            },
            mensaje: 'Ficha creada. Revisa tu email para las credenciales de acceso.'
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al crear la ficha' });
    }
};
```

#### `backend/src/controllers/listaEsperaController.js`

**Función `aceptarAspirante()`**:

```javascript
export const aceptarAspirante = async (req, res) => {
    try {
        const { id } = req.params;
        const { observaciones } = req.body;

        const listaEspera = await prisma.listaEspera.findUnique({
            where: { id: parseInt(id) },
            include: {
                ficha: {
                    include: { usuario: true, carrera: true }
                }
            }
        });

        if (!listaEspera) {
            return res.status(404).json({ error: 'Registro no encontrado' });
        }

        // IMPORTANTE: Usar transacción
        const result = await prisma.$transaction(async (tx) => {
            // 1. Formalizar usuario (ya no es temporal)
            await tx.usuario.update({
                where: { id: listaEspera.ficha.usuarioId },
                data: { temporal: false }
            });

            // 2. Crear alumno
            const alumno = await tx.alumno.create({
                data: {
                    nombre: listaEspera.ficha.nombre,
                    apellidoPaterno: listaEspera.ficha.apellidoPaterno,
                    apellidoMaterno: listaEspera.ficha.apellidoMaterno,
                    curp: listaEspera.ficha.curp,
                    fechaNacimiento: listaEspera.ficha.fechaNacimiento,
                    telefono: listaEspera.ficha.telefono,
                    email: listaEspera.ficha.email,
                    direccion: listaEspera.ficha.direccion,
                    fichaExamenId: listaEspera.ficha.id,
                    semestreActual: 1,
                    estatusAlumno: 'activo'
                }
            });

            // 3. Actualizar lista de espera
            await tx.listaEspera.update({
                where: { id: parseInt(id) },
                data: {
                    estadoActual: 'aceptado',
                    fechaAceptacion: new Date(),
                    observaciones
                }
            });

            // 4. Actualizar ficha
            await tx.fichaExamen.update({
                where: { id: listaEspera.fichaId },
                data: { estatus: 'aprobado' }
            });

            return { alumno };
        });

        // TODO: Enviar email de aceptación
        // await enviarEmailAceptacion(listaEspera.ficha.email);

        res.json({
            success: true,
            message: 'Aspirante aceptado exitosamente',
            alumno: result.alumno
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al aceptar aspirante' });
    }
};
```

**Función `rechazarAspirante()`**:

```javascript
export const rechazarAspirante = async (req, res) => {
    try {
        const { id } = req.params;
        const { motivo } = req.body;

        const listaEspera = await prisma.listaEspera.findUnique({
            where: { id: parseInt(id) },
            include: { ficha: true }
        });

        if (!listaEspera) {
            return res.status(404).json({ error: 'Registro no encontrado' });
        }

        // IMPORTANTE: Usar transacción
        await prisma.$transaction(async (tx) => {
            // 1. ELIMINAR usuario temporal (CASCADE elimina relación en ficha)
            await tx.usuario.delete({
                where: { id: listaEspera.ficha.usuarioId }
            });

            // 2. Actualizar lista de espera
            await tx.listaEspera.update({
                where: { id: parseInt(id) },
                data: {
                    estadoActual: 'rechazado',
                    fechaRechazo: new Date(),
                    observaciones: motivo
                }
            });

            // 3. Actualizar ficha (usuarioId ya es NULL por CASCADE)
            await tx.fichaExamen.update({
                where: { id: listaEspera.fichaId },
                data: { estatus: 'rechazado' }
            });
        });

        // TODO: Enviar email de rechazo
        // await enviarEmailRechazo(listaEspera.ficha.email, motivo);

        res.json({
            success: true,
            message: 'Aspirante rechazado'
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al rechazar aspirante' });
    }
};
```

### 5. **Crear Utilidades**

#### `backend/src/utils/passwordGenerator.js`

```javascript
import crypto from 'crypto';

export const generarPassword = (length = 12) => {
    const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let password = '';
    
    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, charset.length);
        password += charset[randomIndex];
    }
    
    return password;
};
```

### 6. **Actualizar Frontend**

#### `frontend/src/components/RegistroFicha.jsx`

Mostrar las credenciales generadas después del registro:

```javascript
// Después de crear la ficha exitosamente
if (data.credenciales) {
    toast.success(
        <div>
            <p><strong>¡Ficha generada!</strong></p>
            <p>Folio: {data.ficha.folio}</p>
            <p>Usuario: {data.credenciales.username}</p>
            {data.credenciales.passwordTemporal && (
                <p>Contraseña: {data.credenciales.passwordTemporal}</p>
            )}
            <p><small>Revisa tu email para más detalles</small></p>
        </div>,
        { autoClose: 10000 }
    );
}
```

### 7. **Servicio de Email (Futuro)**

Crear `backend/src/services/emailService.js` para:
- Enviar credenciales al registrarse
- Enviar notificación de aceptación
- Enviar notificación de rechazo

---

## 📋 Checklist de Implementación

- [ ] Detener servidores
- [ ] Aplicar migración (`npx prisma db push`)
- [ ] Generar cliente Prisma (`npx prisma generate`)
- [ ] Crear `passwordGenerator.js`
- [ ] Actualizar `fichaExamenController.js` - función `crearFicha()`
- [ ] Actualizar `listaEsperaController.js` - función `aceptarAspirante()`
- [ ] Actualizar `listaEsperaController.js` - función `rechazarAspirante()`
- [ ] Actualizar `RegistroFicha.jsx` - mostrar credenciales
- [ ] Probar flujo completo
- [ ] (Futuro) Implementar servicio de email

---

## 🧪 Pruebas a Realizar

1. **Registro de Ficha**:
   - ✅ Se crea usuario temporal
   - ✅ Se vincula con la ficha
   - ✅ Se agrega a lista de espera
   - ✅ Se muestra contraseña (solo dev)

2. **Aceptar Aspirante**:
   - ✅ Usuario deja de ser temporal
   - ✅ Se crea alumno
   - ✅ Estado cambia a "aceptado"
   - ✅ Puede hacer login

3. **Rechazar Aspirante**:
   - ✅ Usuario se elimina
   - ✅ Estado cambia a "rechazado"
   - ✅ NO puede hacer login
   - ✅ Ficha queda para historial

---

**Importante**: Los cambios requieren detener y reiniciar el servidor.
