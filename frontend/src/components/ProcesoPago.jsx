/**
 * Componente de Proceso de Pago
 * Maneja el proceso de pago con Stripe Checkout
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';
import {
    CreditCard,
    AlertCircle,
    CheckCircle,
    Loader,
    ArrowLeft,
    Shield
} from 'lucide-react';

// Inicializar Stripe con tu clave pública
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const ProcesoPago = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [procesando, setProcesando] = useState(false);
    const [solicitud, setSolicitud] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarSolicitud();
    }, []);

    const cargarSolicitud = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/solicitudes/mi-solicitud', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setSolicitud(data.solicitud);

                // Verificar que esté pendiente de pago
                if (data.solicitud.estatusPago !== 'pendiente') {
                    setError(`Tu solicitud está en estatus: ${data.solicitud.estatusPago}`);
                }
            } else {
                setError(data.error || 'No se pudo cargar tu solicitud');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Error al cargar la información');
        } finally {
            setLoading(false);
        }
    };

    const handlePagar = async () => {
        setProcesando(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');

            // 1. Crear sesión de Stripe
            const response = await fetch('http://localhost:3000/api/pagos/crear-sesion', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al crear sesión de pago');
            }

            // 2. Redirigir a Stripe Checkout
            const stripe = await stripePromise;
            const { error: stripeError } = await stripe.redirectToCheckout({
                sessionId: data.sessionId
            });

            if (stripeError) {
                throw new Error(stripeError.message);
            }

        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
            toast.error(error.message);
            setProcesando(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Cargando información...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="bg-white rounded-xl shadow-md p-8">
                        <div className="text-center">
                            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Error
                            </h2>
                            <p className="text-gray-600 mb-6">{error}</p>
                            <button
                                onClick={() => navigate('/portal-aspirante')}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                            >
                                Volver al Portal
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!solicitud) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto px-4">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/portal-aspirante')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Volver al Portal
                    </button>
                </div>

                {/* Tarjeta Principal */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                    {/* Header de la tarjeta */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                        <div className="flex items-center gap-3 mb-2">
                            <CreditCard className="w-8 h-8" />
                            <h1 className="text-3xl font-bold">Pago de Inscripción</h1>
                        </div>
                        <p className="text-blue-100">
                            Procesa tu pago de forma segura con Stripe
                        </p>
                    </div>

                    {/* Contenido */}
                    <div className="p-8">
                        {/* Resumen de Pago */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Resumen de Pago
                            </h2>

                            <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Carrera:</span>
                                    <span className="font-semibold text-gray-900">
                                        {solicitud.carrera.nombre}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Turno:</span>
                                    <span className="font-semibold text-gray-900 capitalize">
                                        {solicitud.turno}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Grupo:</span>
                                    <span className="font-semibold text-gray-900">
                                        {solicitud.grupo || 'Por asignar'}
                                    </span>
                                </div>

                                <div className="border-t border-gray-200 pt-3 mt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold text-gray-900">
                                            Total a Pagar:
                                        </span>
                                        <span className="text-3xl font-bold text-blue-600">
                                            ${Number(solicitud.montoPagar).toLocaleString('es-MX', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })} MXN
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Información de Seguridad */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                            <div className="flex items-start gap-3">
                                <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-blue-900 mb-2">
                                        Pago Seguro con Stripe
                                    </h3>
                                    <ul className="text-sm text-blue-700 space-y-1">
                                        <li>• Tus datos están protegidos con encriptación SSL</li>
                                        <li>• No guardamos información de tu tarjeta</li>
                                        <li>• Transacción procesada por Stripe (líder mundial en pagos)</li>
                                        <li>• Recibirás confirmación por correo electrónico</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Botón de Pago */}
                        <button
                            onClick={handlePagar}
                            disabled={procesando}
                            className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-3 transition-colors ${procesando
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                                } text-white shadow-lg`}
                        >
                            {procesando ? (
                                <>
                                    <Loader className="w-6 h-6 animate-spin" />
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    <CreditCard className="w-6 h-6" />
                                    Proceder al Pago
                                </>
                            )}
                        </button>

                        {/* Nota */}
                        <p className="text-sm text-gray-500 text-center mt-4">
                            Al proceder, serás redirigido a la página segura de Stripe para completar tu pago
                        </p>
                    </div>
                </div>

                {/* Tarjetas Informativas */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="font-semibold text-gray-900 mb-2">
                            ¿Qué pasa después del pago?
                        </h3>
                        <ul className="text-sm text-gray-600 space-y-2">
                            <li>✓ Confirmaremos tu pago automáticamente</li>
                            <li>✓ Recibirás tu número de control</li>
                            <li>✓ Tendrás acceso completo al sistema</li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="font-semibold text-gray-900 mb-2">
                            Métodos de Pago Aceptados
                        </h3>
                        <ul className="text-sm text-gray-600 space-y-2">
                            <li>✓ Tarjetas de crédito (Visa, Mastercard, etc.)</li>
                            <li>✓ Tarjetas de débito</li>
                            <li>✓ Pago seguro y verificado por Stripe</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProcesoPago;
