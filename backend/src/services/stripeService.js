/**
 * Servicio de Stripe
 * Maneja la creación de sesiones de pago y verificación
 */

import Stripe from 'stripe';

// Inicializar Stripe con la clave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-11-20.acacia'
});

/**
 * Crear sesión de checkout de Stripe
 */
export const crearSesionCheckout = async ({
    solicitudId,
    montoPagar,
    emailCliente,
    nombreCliente,
    carreraNombre
}) => {
    try {
        // Crear la sesión de checkout
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'mxn',
                        product_data: {
                            name: `Inscripción - ${carreraNombre}`,
                            description: `Pago de inscripción para ${nombreCliente}`,
                            images: [], // Puedes agregar logos aquí
                        },
                        unit_amount: Math.round(montoPagar * 100), // Stripe usa centavos
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            customer_email: emailCliente,
            client_reference_id: solicitudId.toString(),
            metadata: {
                solicitudId: solicitudId.toString(),
                tipo: 'inscripcion',
                carrera: carreraNombre
            },
            success_url: `${process.env.FRONTEND_URL}/pago-exitoso?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/pago-cancelado`,
            // Configuración adicional
            payment_intent_data: {
                metadata: {
                    solicitudId: solicitudId.toString()
                }
            },
            expires_at: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24 horas
        });

        return {
            sessionId: session.id,
            url: session.url,
            expiresAt: new Date(session.expires_at * 1000)
        };
    } catch (error) {
        console.error('Error al crear sesión de Stripe:', error);
        throw new Error(`Error al crear sesión de pago: ${error.message}`);
    }
};

/**
 * Verificar sesión de checkout
 */
export const verificarSesion = async (sessionId) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['payment_intent']
        });

        return {
            id: session.id,
            payment_status: session.payment_status,
            amount_total: session.amount_total / 100, // Convertir de centavos
            customer_email: session.customer_email,
            metadata: session.metadata,
            payment_intent: session.payment_intent,
            created: new Date(session.created * 1000)
        };
    } catch (error) {
        console.error('Error al verificar sesión:', error);
        throw new Error(`Error al verificar sesión: ${error.message}`);
    }
};

/**
 * Obtener información del PaymentIntent
 */
export const obtenerPaymentIntent = async (paymentIntentId) => {
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        return {
            id: paymentIntent.id,
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency,
            status: paymentIntent.status,
            created: new Date(paymentIntent.created * 1000),
            metadata: paymentIntent.metadata
        };
    } catch (error) {
        console.error('Error al obtener PaymentIntent:', error);
        throw new Error(`Error al obtener información de pago: ${error.message}`);
    }
};

/**
 * Verificar webhook de Stripe
 */
export const verificarWebhook = (payload, signature) => {
    try {
        const event = stripe.webhooks.constructEvent(
            payload,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
        return event;
    } catch (error) {
        console.error('Error al verificar webhook:', error);
        throw new Error(`Webhook inválido: ${error.message}`);
    }
};

/**
 * Crear reembolso
 */
export const crearReembolso = async (paymentIntentId, monto = null) => {
    try {
        const refund = await stripe.refunds.create({
            payment_intent: paymentIntentId,
            amount: monto ? Math.round(monto * 100) : undefined, // Si no hay monto, reembolsa todo
        });

        return {
            id: refund.id,
            amount: refund.amount / 100,
            status: refund.status,
            created: new Date(refund.created * 1000)
        };
    } catch (error) {
        console.error('Error al crear reembolso:', error);
        throw new Error(`Error al crear reembolso: ${error.message}`);
    }
};

export default {
    crearSesionCheckout,
    verificarSesion,
    obtenerPaymentIntent,
    verificarWebhook,
    crearReembolso
};
