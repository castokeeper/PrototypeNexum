/**
 * Controlador de Pagos
 * Maneja el proceso de pago con Stripe
 */

import { prisma } from '../config/database.js';
import * as stripeService from '../services/stripeService.js';
import { generarNumeroControl } from '../utils/passwordGenerator.js';

/**
 * Crear sesión de pago
 * POST /api/pagos/crear-sesion
 */
export const crearSesionPago = async (req, res) => {
    try {
        const usuarioId = req.user.id;

        // Obtener la solicitud del usuario
        const solicitud = await prisma.solicitud.findFirst({
            where: { usuarioId },
            include: {
                carrera: true,
                usuario: true
            }
        });

        if (!solicitud) {
            return res.status(404).json({
                error: 'No se encontró una solicitud de inscripción'
            });
        }

        // Validar que esté en estatus pendiente de pago
        if (solicitud.estatusPago !== 'pendiente') {
            return res.status(400).json({
                error: 'Esta solicitud no está pendiente de pago',
                estatusActual: solicitud.estatusPago
            });
        }

        // Verificar que no tenga una sesión activa
        if (solicitud.stripeSessionId) {
            // Verificar si la sesión sigue activa
            try {
                const sesionExistente = await stripeService.verificarSesion(solicitud.stripeSessionId);
                if (sesionExistente.payment_status !== 'paid') {
                    return res.json({
                        sessionId: solicitud.stripeSessionId,
                        mensaje: 'Ya tienes una sesión de pago activa'
                    });
                }
            } catch (error) {
                // Si la sesión no existe o expiró, continuar creando una nueva
                console.log('Sesión anterior expirada o inválida');
            }
        }

        // Crear sesión de Stripe
        const sesion = await stripeService.crearSesionCheckout({
            solicitudId: solicitud.id,
            montoPagar: Number(solicitud.montoPagar),
            emailCliente: solicitud.usuario.email,
            nombreCliente: solicitud.usuario.nombre,
            carreraNombre: solicitud.carrera.nombre
        });

        // Actualizar la solicitud con el sessionId
        await prisma.solicitud.update({
            where: { id: solicitud.id },
            data: {
                stripeSessionId: sesion.sessionId
            }
        });

        res.json({
            success: true,
            sessionId: sesion.sessionId,
            url: sesion.url,
            expiresAt: sesion.expiresAt
        });

    } catch (error) {
        console.error('Error al crear sesión de pago:', error);
        res.status(500).json({
            error: 'Error al crear la sesión de pago',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Verificar estado de pago
 * GET /api/pagos/verificar/:sessionId
 */
export const verificarPago = async (req, res) => {
    try {
        const { sessionId } = req.params;

        // Verificar sesión en Stripe
        const sesion = await stripeService.verificarSesion(sessionId);

        // Buscar la solicitud
        const solicitud = await prisma.solicitud.findFirst({
            where: { stripeSessionId: sessionId }
        });

        if (!solicitud) {
            return res.status(404).json({
                error: 'No se encontró la solicitud asociada a este pago'
            });
        }

        res.json({
            sessionId: sesion.id,
            paymentStatus: sesion.payment_status,
            amount: sesion.amount_total,
            email: sesion.customer_email,
            solicitudId: solicitud.id,
            estatusPago: solicitud.estatusPago
        });

    } catch (error) {
        console.error('Error al verificar pago:', error);
        res.status(500).json({
            error: 'Error al verificar el pago',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Webhook de Stripe
 * POST /api/webhooks/stripe
 */
export const webhookStripe = async (req, res) => {
    const signature = req.headers['stripe-signature'];
    let event;

    try {
        // Verificar el webhook
        event = stripeService.verificarWebhook(req.body, signature);
    } catch (error) {
        console.error('Error al verificar webhook:', error);
        return res.status(400).json({ error: 'Webhook signature verification failed' });
    }

    // Manejar el evento
    try {
        switch (event.type) {
            case 'checkout.session.completed':
                await manejarPagoExitoso(event.data.object);
                break;

            case 'checkout.session.expired':
                await manejarSesionExpirada(event.data.object);
                break;

            case 'payment_intent.succeeded':
                console.log('PaymentIntent exitoso:', event.data.object.id);
                break;

            case 'payment_intent.payment_failed':
                console.log('PaymentIntent fallido:', event.data.object.id);
                break;

            default:
                console.log(`Evento no manejado: ${event.type}`);
        }

        res.json({ received: true });

    } catch (error) {
        console.error('Error al procesar webhook:', error);
        res.status(500).json({ error: 'Error al procesar el webhook' });
    }
};

/**
 * Manejar pago exitoso
 * Esta función se ejecuta cuando Stripe confirma el pago
 */
async function manejarPagoExitoso(session) {
    console.log('🎉 Pago exitoso recibido:', session.id);

    const solicitudId = parseInt(session.metadata.solicitudId);

    // TRANSACCIÓN: Actualizar solicitud, usuario y crear alumno
    await prisma.$transaction(async (tx) => {
        // 1. Obtener la solicitud con todos los datos
        const solicitud = await tx.solicitud.findUnique({
            where: { id: solicitudId },
            include: {
                usuario: true,
                carrera: true,
                fichaExamen: true
            }
        });

        if (!solicitud) {
            throw new Error(`Solicitud ${solicitudId} no encontrada`);
        }

        // 2. Verificar que no se haya procesado antes
        if (solicitud.estatusPago === 'pagado') {
            console.log('⚠️ Pago ya procesado anteriormente');
            return;
        }

        // 3. Generar número de control único
        const numeroControl = await generarNumeroControl(tx);

        // 4. Crear el registro de Alumno
        const alumno = await tx.alumno.create({
            data: {
                numeroControl,
                nombre: solicitud.datosPersonales.nombreCompleto,
                apellidoPaterno: solicitud.datosPersonales.nombreCompleto.split(' ')[1] || '',
                apellidoMaterno: solicitud.datosPersonales.nombreCompleto.split(' ')[2] || '',
                curp: solicitud.datosPersonales.curp,
                fechaNacimiento: new Date(solicitud.datosPersonales.fechaNacimiento || '2000-01-01'),
                telefono: solicitud.datosPersonales.telefono,
                email: solicitud.usuario.email,
                direccion: solicitud.datosPersonales.direccionCompleta,
                carreraId: solicitud.carreraId,
                turno: solicitud.turno,
                grupo: solicitud.grupo,
                estatus: 'aspirante',
                usuarioId: solicitud.usuarioId,
                fichaExamenId: solicitud.usuario.fichaExamen?.id
            }
        });

        // 5. Actualizar la solicitud
        await tx.solicitud.update({
            where: { id: solicitudId },
            data: {
                estatusPago: 'pagado',
                fechaPago: new Date(),
                alumnoId: alumno.id
            }
        });

        // 6. Actualizar el usuario
        await tx.usuario.update({
            where: { id: solicitud.usuarioId },
            data: {
                estatus: 'activo',
                temporal: false // Ya no es temporal
            }
        });

        // 7. Crear registro de pago
        await tx.pago.create({
            data: {
                solicitudId,
                usuarioId: solicitud.usuarioId,
                monto: Number(solicitud.montoPagar),
                metodoPago: 'tarjeta',
                estatusPago: 'completado',
                stripePaymentIntentId: session.payment_intent,
                stripeSessionId: session.id,
                fechaPago: new Date(),
                concepto: `Inscripción - ${solicitud.carrera.nombre}`,
                referencia: numeroControl
            }
        });

        console.log(`✅ Pago procesado exitosamente. Alumno creado: ${numeroControl}`);
    });
}

/**
 * Manejar sesión expirada
 */
async function manejarSesionExpirada(session) {
    console.log('⏰ Sesión expirada:', session.id);

    const solicitudId = parseInt(session.metadata.solicitudId);

    // Limpiar el sessionId de la solicitud
    await prisma.solicitud.update({
        where: { id: solicitudId },
        data: {
            stripeSessionId: null
        }
    });
}

/**
 * Obtener historial de pagos del usuario
 * GET /api/pagos/mi-historial
 */
export const obtenerMiHistorial = async (req, res) => {
    try {
        const usuarioId = req.user.id;

        const pagos = await prisma.pago.findMany({
            where: { usuarioId },
            include: {
                solicitud: {
                    include: {
                        carrera: true
                    }
                }
            },
            orderBy: { fechaPago: 'desc' }
        });

        res.json({ pagos });

    } catch (error) {
        console.error('Error al obtener historial:', error);
        res.status(500).json({
            error: 'Error al obtener el historial de pagos',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
