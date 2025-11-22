/**
 * Página de Pago Exitoso
 * Se muestra cuando el pago se completó correctamente
 */

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Loader, Home, User } from 'lucide-react';

const PagoExitoso = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [verificando, setVerificando] = useState(true);
    const [datosPago, setDatosPago] = useState(null);
    const [error, setError] = useState(null);

    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        if (sessionId) {
            verificarPago();
        } else {
            setError('No se encontró la sesión de pago');
            setVerificando(false);
        }
    }, [sessionId]);

    const verificarPago = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/pagos/verificar/${sessionId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setDatosPago(data);
            } else {
                setError(data.error || 'Error al verificar el pago');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Error al verificar el pago');
        } finally {
            setVerificando(false);
        }
    };

    if (verificando) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Verificando tu pago...
                    </h2>
                    <p className="text-gray-600">
                        Por favor espera mientras confirmamos tu transacción
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-md mx-auto px-4 text-center">
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">⚠️</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Error
                        </h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={() => navigate('/portal-aspirante')}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                        >
                            Ir al Portal
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
            <div className="max-w-3xl mx-auto px-4">
                {/* Animación de éxito */}
                <div className="text-center mb-8 animate-bounce-in">
                    <div className="inline-block">
                        <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <CheckCircle className="w-20 h-20 text-green-600" />
                        </div>
                    </div>
                </div>

                {/* Tarjeta Principal */}
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-green-600 to-green-700 p-8 text-white text-center">
                        <h1 className="text-4xl font-bold mb-2">
                            ¡Pago Exitoso!
                        </h1>
                        <p className="text-green-100 text-lg">
                            Tu inscripción ha sido procesada correctamente
                        </p>
                    </div>

                    <div className="p-8">
                        {/* Información del Pago */}
                        {datosPago && (
                            <div className="space-y-6 mb-8">
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                                        Detalles del Pago
                                    </h2>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">ID de Transacción:</span>
                                            <span className="font-mono text-sm text-gray-900">
                                                {sessionId?.substring(0, 20)}...
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Monto Pagado:</span>
                                            <span className="text-xl font-bold text-green-600">
                                                ${datosPago.amount?.toLocaleString('es-MX', {
                                                    minimumFractionDigits: 2
                                                })} MXN
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Estado:</span>
                                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                                                {datosPago.paymentStatus === 'paid' ? 'Pagado' : datosPago.paymentStatus}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Correo:</span>
                                            <span className="text-gray-900">{datosPago.email}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Próximos Pasos */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                    <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                                        <span className="text-xl">📋</span>
                                        Próximos Pasos
                                    </h3>
                                    <ol className="space-y-3 text-blue-800">
                                        <li className="flex items-start gap-3">
                                            <span className="font-bold text-blue-600">1.</span>
                                            <span>Recibirás un correo de confirmación con los detalles de tu pago</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="font-bold text-blue-600">2.</span>
                                            <span>Tu número de control será asignado y enviado por correo</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="font-bold text-blue-600">3.</span>
                                            <span>Podrás acceder al portal de alumnos con tus credenciales</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="font-bold text-blue-600">4.</span>
                                            <span>Revisa tu correo para más información sobre el inicio de clases</span>
                                        </li>
                                    </ol>
                                </div>

                                {/* Mensaje de Bienvenida */}
                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6 text-center">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        ¡Bienvenido a la Familia!
                                    </h3>
                                    <p className="text-gray-700">
                                        Estamos emocionados de tenerte como parte de nuestra institución.
                                        ¡Te deseamos mucho éxito en esta nueva etapa!
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Botones de Acción */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => navigate('/')}
                                className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 flex items-center justify-center gap-2 shadow-md"
                            >
                                <Home className="w-5 h-5" />
                                Ir a Inicio
                            </button>
                            <button
                                onClick={() => navigate('/portal-aspirante')}
                                className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 flex items-center justify-center gap-2 shadow-md"
                            >
                                <User className="w-5 h-5" />
                                Ver Mi Portal
                            </button>
                        </div>
                    </div>
                </div>

                {/* Información Adicional */}
                <div className="bg-white rounded-lg shadow p-6 text-center">
                    <p className="text-sm text-gray-600">
                        Si tienes alguna pregunta o problema, no dudes en contactarnos.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        📧 Email: soporte@institucion.edu.mx | ☎️ Tel: (123) 456-7890
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PagoExitoso;
