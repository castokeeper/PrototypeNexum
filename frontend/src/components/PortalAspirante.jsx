/**
 * Portal del Aspirante
 * Dashboard principal para aspirantes según su estatus
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Clock,
    CheckCircle,
    CreditCard,
    UserCheck,
    XCircle,
    FileText,
    MapPin,
    Phone,
    Mail,
    Calendar,
    Award,
    AlertCircle
} from 'lucide-react';
import { toast } from 'react-toastify';

const PortalAspirante = () => {
    const [loading, setLoading] = useState(true);
    const [estado, setEstado] = useState(null);
    const [editandoContacto, setEditandoContacto] = useState(false);
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        cargarEstado();
    }, []);

    const cargarEstado = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch('http://localhost:3000/api/aspirante/estado', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }

            const data = await response.json();
            setEstado(data);
            setTelefono(data.ficha?.telefono || '');
            setDireccion(data.ficha?.direccion || '');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al cargar tu información');
        } finally {
            setLoading(false);
        }
    };

    const actualizarContacto = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/aspirante/contacto', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ telefono, direccion })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Datos actualizados correctamente');
                setEditandoContacto(false);
                cargarEstado();
            } else {
                toast.error(data.error || 'Error al actualizar datos');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al actualizar datos');
        }
    };

    const getIcono = (estatus) => {
        const iconos = {
            en_revision: <Clock className="w-16 h-16" />,
            pendiente_formulario: <CheckCircle className="w-16 h-16" />,
            pendiente_pago: <CreditCard className="w-16 h-16" />,
            activo: <UserCheck className="w-16 h-16" />,
            rechazado: <XCircle className="w-16 h-16" />
        };
        return iconos[estatus] || iconos.en_revision;
    };

    const getColorClase = (color) => {
        const colores = {
            warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            success: 'bg-green-100 text-green-800 border-green-300',
            info: 'bg-blue-100 text-blue-800 border-blue-300',
            danger: 'bg-red-100 text-red-800 border-red-300'
        };
        return colores[color] || colores.warning;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando tu información...</p>
                </div>
            </div>
        );
    }

    if (!estado) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error al cargar</h2>
                    <p className="text-gray-600">No pudimos cargar tu información</p>
                    <button
                        onClick={cargarEstado}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Portal del Aspirante</h1>
                    <p className="mt-2 text-gray-600">Bienvenido, {estado.usuario.nombre}</p>
                </div>

                {/* Tarjeta de Estado Principal */}
                <div className={`mb-8 p-8 rounded-2xl border-2 ${getColorClase(estado.estado.color)}`}>
                    <div className="flex items-start gap-6">
                        <div className="flex-shrink-0">
                            {getIcono(estado.usuario.estatus)}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-2">{estado.estado.titulo}</h2>
                            <p className="text-lg mb-4">{estado.estado.descripcion}</p>

                            {estado.estado.accion && (
                                <button
                                    onClick={() => navigate(estado.estado.accion.ruta)}
                                    className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-50 shadow-md transition-all"
                                >
                                    {estado.estado.accion.texto}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Columna Izquierda: Información de Ficha */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Información de Ficha */}
                        {estado.ficha && (
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <FileText className="w-6 h-6 text-blue-600" />
                                        Tu Ficha de Registro
                                    </h3>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                                        {estado.ficha.folio}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Carrera</p>
                                        <p className="font-semibold text-gray-900">{estado.ficha.carrera}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Turno Preferido</p>
                                        <p className="font-semibold text-gray-900 capitalize">{estado.ficha.turno}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Estatus de Ficha</p>
                                        <p className="font-semibold text-gray-900 capitalize">{estado.ficha.estatus}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Fecha de Registro</p>
                                        <p className="font-semibold text-gray-900">
                                            {new Date(estado.ficha.fechaRegistro).toLocaleDateString('es-MX')}
                                        </p>
                                    </div>
                                </div>

                                {/* Datos de Contacto Editables */}
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-semibold text-gray-900">Datos de Contacto</h4>
                                        {!editandoContacto && (
                                            <button
                                                onClick={() => setEditandoContacto(true)}
                                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                            >
                                                Editar
                                            </button>
                                        )}
                                    </div>

                                    {editandoContacto ? (
                                        <form onSubmit={actualizarContacto} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Teléfono
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={telefono}
                                                    onChange={(e) => setTelefono(e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Dirección
                                                </label>
                                                <textarea
                                                    value={direccion}
                                                    onChange={(e) => setDireccion(e.target.value)}
                                                    rows="3"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    type="submit"
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                                >
                                                    Guardar
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setEditandoContacto(false)}
                                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <Phone className="w-5 h-5 text-gray-400" />
                                                <span className="text-gray-700">{telefono}</span>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                                                <span className="text-gray-700">{direccion}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Mail className="w-5 h-5 text-gray-400" />
                                                <span className="text-gray-700">{estado.usuario.email}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Próximos Pasos */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Award className="w-6 h-6 text-green-600" />
                                Próximos Pasos
                            </h3>
                            <ol className="space-y-3">
                                {estado.proximosPasos.map((paso, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                            {index + 1}
                                        </span>
                                        <span className="text-gray-700 pt-0.5">{paso}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>

                    {/* Columna Derecha: Información Adicional */}
                    <div className="space-y-6">
                        {/* Lista de Espera */}
                        {estado.listaEspera && (
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Lista de Espera</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Posición</p>
                                        <p className="text-3xl font-bold text-blue-600">#{estado.listaEspera.posicion}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Estado</p>
                                        <p className="font-semibold text-gray-900 capitalize">{estado.listaEspera.estado}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Fecha de Ingreso</p>
                                        <p className="text-gray-700">
                                            {new Date(estado.listaEspera.fechaIngreso).toLocaleDateString('es-MX')}
                                        </p>
                                    </div>
                                    {estado.listaEspera.fechaAceptacion && (
                                        <div>
                                            <p className="text-sm text-gray-500">Fecha de Aceptación</p>
                                            <p className="text-gray-700">
                                                {new Date(estado.listaEspera.fechaAceptacion).toLocaleDateString('es-MX')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Solicitud */}
                        {estado.solicitud && (
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Tu Solicitud</h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-500">Tipo</p>
                                        <p className="font-semibold text-gray-900 capitalize">{estado.solicitud.tipo.replace('_', ' ')}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Estatus</p>
                                        <p className="font-semibold text-gray-900 capitalize">{estado.solicitud.estatus}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Estatus de Pago</p>
                                        <p className="font-semibold text-gray-900 capitalize">{estado.solicitud.estatusPago}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Monto a Pagar</p>
                                        <p className="text-2xl font-bold text-green-600">${estado.solicitud.montoPagar} MXN</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Información de Usuario */}
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
                            <h3 className="text-lg font-bold mb-4">Tu Cuenta</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-blue-100 text-sm">Estado</p>
                                    <p className="font-semibold capitalize">
                                        {estado.usuario.temporal ? 'Temporal' : 'Permanente'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-blue-100 text-sm">Miembro desde</p>
                                    <p className="font-semibold">
                                        {new Date(estado.usuario.createdAt).toLocaleDateString('es-MX')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortalAspirante;
