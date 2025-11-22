/**
 * Página de Pago Cancelado
 * Se muestra cuando el usuario cancela el pago
 */

import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, CreditCard, HelpCircle } from 'lucide-react';

const PagoCancelado = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12">
            <div className="max-w-2xl mx-auto px-4">
                {/* Icono Principal */}
                <div className="text-center mb-8">
                    <div className="inline-block">
                        <div className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <XCircle className="w-20 h-20 text-orange-600" />
                        </div>
                    </div>
                </div>

                {/* Tarjeta Principal */}
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 p-8 text-white text-center">
                        <h1 className="text-4xl font-bold mb-2">
                            Pago Cancelado
                        </h1>
                        <p className="text-orange-100 text-lg">
                            No se completó el proceso de pago
                        </p>
                    </div>

                    <div className="p-8">
                        {/* Mensaje */}
                        <div className="text-center mb-8">
                            <p className="text-lg text-gray-700 mb-4">
                                Has cancelado el proceso de pago. No te preocupes, tu solicitud de inscripción sigue activa.
                            </p>
                            <p className="text-gray-600">
                                Puedes intentar realizar el pago nuevamente cuando estés listo.
                            </p>
                        </div>

                        {/* Razones Comunes */}
                        <div className="bg-gray-50 rounded-lg p-6 mb-8">
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <HelpCircle className="w-5 h-5 text-blue-600" />
                                Razones Comunes para Cancelar
                            </h3>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-orange-500 mt-1">•</span>
                                    <span>Necesitas verificar los datos de tu tarjeta</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-orange-500 mt-1">•</span>
                                    <span>Quieres consultar con tu familia antes de proceder</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-orange-500 mt-1">•</span>
                                    <span>Prefieres realizar el pago en otro momento</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-orange-500 mt-1">•</span>
                                    <span>Tienes dudas sobre el proceso</span>
                                </li>
                            </ul>
                        </div>

                        {/* Información Importante */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                            <h3 className="font-bold text-blue-900 mb-3">
                                ℹ️ Información Importante
                            </h3>
                            <ul className="space-y-2 text-blue-800">
                                <li>✓ Tu solicitud de inscripción sigue activa</li>
                                <li>✓ Puedes realizar el pago en cualquier momento</li>
                                <li>✓ No se ha realizado ningún cargo a tu tarjeta</li>
                                <li>✓ Tus datos están seguros y protegidos</li>
                            </ul>
                        </div>

                        {/* Botones de Acción */}
                        <div className="space-y-4">
                            <button
                                onClick={() => navigate('/proceso-pago')}
                                className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 flex items-center justify-center gap-2 shadow-md"
                            >
                                <CreditCard className="w-5 h-5" />
                                Intentar Pago Nuevamente
                            </button>

                            <button
                                onClick={() => navigate('/portal-aspirante')}
                                className="w-full px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 flex items-center justify-center gap-2"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Volver al Portal
                            </button>
                        </div>
                    </div>
                </div>

                {/* Ayuda */}
                <div className="bg-white rounded-lg shadow p-6 text-center">
                    <h3 className="font-semibold text-gray-900 mb-2">
                        ¿Necesitas Ayuda?
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Si tienes problemas con el pago o preguntas sobre el proceso, estamos aquí para ayudarte.
                    </p>
                    <p className="text-sm text-gray-500">
                        📧 Email: soporte@institucion.edu.mx | ☎️ Tel: (123) 456-7890
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                        Horario de atención: Lunes a Viernes, 9:00 AM - 6:00 PM
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PagoCancelado;
