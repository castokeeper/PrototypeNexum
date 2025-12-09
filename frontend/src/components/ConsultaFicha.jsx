import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Search, FileText, CheckCircle, XCircle, Clock, AlertCircle, ArrowLeft, User, GraduationCap, MapPin, Calendar, Award, Sparkles } from 'lucide-react';
import { Button, Input, Card } from './common';

const ConsultaFicha = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [folio, setFolio] = useState('');
    const [ficha, setFicha] = useState(null);
    const [loading, setLoading] = useState(false);

    const fichaGenerada = location.state?.fichaGenerada;

    const handleBuscar = async (e) => {
        e.preventDefault();

        if (!folio || folio.length < 12) {
            toast.error('Ingresa un folio válido (ej: FE-2024-0001)');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`/api/fichas/${folio.toUpperCase()}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Ficha no encontrada');
            }

            setFicha(data);
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message);
            setFicha(null);
        } finally {
            setLoading(false);
        }
    };

    const getEstatusIcon = (estatus) => {
        switch (estatus) {
            case 'aprobado':
                return <CheckCircle size={32} className="text-green-500" />;
            case 'rechazado':
                return <XCircle size={32} className="text-red-500" />;
            case 'programado':
                return <Clock size={32} className="text-orange-500" />;
            case 'pendiente':
                return <AlertCircle size={32} className="text-gray-500" />;
            default:
                return <FileText size={32} className="text-gray-500" />;
        }
    };

    const getEstatusColor = (estatus) => {
        const colors = {
            aprobado: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
            rechazado: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
            programado: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
            pendiente: 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700',
        };
        return colors[estatus] || colors.pendiente;
    };

    const getEstatusTexto = (estatus) => {
        const textos = {
            pendiente: 'Pendiente de Programación',
            programado: 'Examen Programado',
            presentado: 'Examen Presentado',
            aprobado: 'Aprobado',
            rechazado: '✗ No Aprobado',
            cancelado: 'Cancelado'
        };
        return textos[estatus] || estatus;
    };

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <div className="max-w-4xl mx-auto mb-12 text-center fade-in">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect mb-4">
                    <Search className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-semibold gradient-text">Consulta tu Estado</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                    Consultar Ficha de Examen
                </h1>
                <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                    Ingresa tu folio para consultar el estado de tu solicitud
                </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
                {/* Ficha Recién Generada */}
                {fichaGenerada && (
                    <Card className="scale-in border-2 border-green-500" style={{
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
                        borderRadius: '1.5rem'
                    }}>
                        <div className="p-6 md:p-8 text-center space-y-6">
                            <div className="inline-flex p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
                                <CheckCircle size={48} className="text-green-600 dark:text-green-400" />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                                    ¡Ficha Generada Exitosamente!
                                </h2>
                                <div className="text-4xl font-bold mb-4" style={{ color: 'var(--primary-blue)' }}>
                                    {fichaGenerada.folio}
                                </div>
                                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                    Guarda este folio, lo necesitarás para consultar tu estado
                                </p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <InfoBox label="Nombre" value={fichaGenerada.nombre} />
                                <InfoBox label="Carrera" value={fichaGenerada.carrera} />
                                <InfoBox label="Turno" value={fichaGenerada.turno} />
                                <InfoBox label="Posición" value={`#${fichaGenerada.posicionEspera}`} />
                            </div>
                        </div>
                    </Card>
                )}

                {/* Formulario de Búsqueda */}
                <Card className="scale-in" style={{
                    background: 'var(--bg-card)',
                    borderRadius: '1.5rem',
                    boxShadow: 'var(--shadow-2xl)'
                }}>
                    <div className="p-6 md:p-8">
                        <form onSubmit={handleBuscar} className="space-y-6">
                            <Input
                                label="Folio de Ficha"
                                name="folio"
                                value={folio}
                                onChange={(e) => setFolio(e.target.value.toUpperCase())}
                                placeholder="FE-2024-0001"
                                icon={<FileText size={18} />}
                                helperText="Formato: FE-AAAA-#### (ej: FE-2024-0001)"
                            />

                            <Button
                                type="submit"
                                fullWidth
                                loading={loading}
                                disabled={loading}
                                icon={<Search size={20} />}
                                className="py-4 text-lg font-semibold rounded-xl hover-lift"
                                style={{
                                    background: loading
                                        ? 'var(--text-tertiary)'
                                        : 'linear-gradient(135deg, var(--primary-blue) 0%, var(--purple) 100%)',
                                    color: 'white',
                                    border: 'none'
                                }}
                            >
                                {loading ? 'Buscando Ficha...' : 'Buscar Mi Ficha'}
                            </Button>
                        </form>

                        {/* Resultados */}
                        {ficha && (
                            <div className="mt-8 pt-8 border-t-2 space-y-6" style={{ borderColor: 'var(--border-color)' }}>
                                {/* Status Badge */}
                                <div className={`p-6 rounded-2xl border-2 ${getEstatusColor(ficha.estatus)}`}>
                                    <div className="flex flex-col items-center gap-4">
                                        {getEstatusIcon(ficha.estatus)}
                                        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                            {getEstatusTexto(ficha.estatus)}
                                        </h2>
                                    </div>
                                </div>

                                {/* Información en Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Datos del Aspirante */}
                                    <div className="p-6 rounded-xl border" style={{
                                        backgroundColor: 'var(--bg-hover)',
                                        borderColor: 'var(--border-color)'
                                    }}>
                                        <div className="flex items-center gap-3 mb-4 pb-3 border-b-2" style={{ borderColor: 'var(--primary-blue)' }}>
                                            <User className="w-5 h-5" style={{ color: 'var(--primary-blue)' }} />
                                            <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                                                Datos del Aspirante
                                            </h3>
                                        </div>
                                        <div className="space-y-3">
                                            <DataItem label="Folio" value={ficha.folio} />
                                            <DataItem label="Nombre" value={ficha.aspirante.nombre} />
                                            <DataItem label="CURP" value={ficha.aspirante.curp} />
                                            <DataItem label="Email" value={ficha.aspirante.email} />
                                            <DataItem label="Teléfono" value={ficha.aspirante.telefono} />
                                        </div>
                                    </div>

                                    {/* Carrera Seleccionada */}
                                    <div className="p-6 rounded-xl border" style={{
                                        backgroundColor: 'var(--bg-hover)',
                                        borderColor: 'var(--border-color)'
                                    }}>
                                        <div className="flex items-center gap-3 mb-4 pb-3 border-b-2" style={{ borderColor: 'var(--purple)' }}>
                                            <GraduationCap className="w-5 h-5" style={{ color: 'var(--purple)' }} />
                                            <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                                                Carrera Seleccionada
                                            </h3>
                                        </div>
                                        <div className="space-y-3">
                                            <DataItem label="Carrera" value={ficha.carrera} />
                                            <DataItem label="Turno" value={ficha.turno.charAt(0).toUpperCase() + ficha.turno.slice(1)} />
                                        </div>
                                    </div>

                                    {/* Información del Examen */}
                                    {ficha.examen.fechaExamen && (
                                        <div className="p-6 rounded-xl border md:col-span-2" style={{
                                            backgroundColor: 'var(--bg-hover)',
                                            borderColor: 'var(--border-color)'
                                        }}>
                                            <div className="flex items-center gap-3 mb-4 pb-3 border-b-2" style={{ borderColor: 'var(--success-green)' }}>
                                                <Calendar className="w-5 h-5" style={{ color: 'var(--success-green)' }} />
                                                <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                                                    Información del Examen
                                                </h3>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <DataItem label="Fecha" value={new Date(ficha.examen.fechaExamen).toLocaleDateString('es-MX')} />
                                                <DataItem label="Lugar" value={ficha.examen.lugarExamen || 'Por confirmar'} />
                                                {ficha.examen.calificacion !== null && (
                                                    <DataItem
                                                        label="Calificación"
                                                        value={`${ficha.examen.calificacion}/100`}
                                                        highlight={ficha.examen.aprobado}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Lista de Espera */}
                                    {ficha.listaEspera && (
                                        <div className="p-6 rounded-xl border md:col-span-2" style={{
                                            backgroundColor: 'var(--bg-hover)',
                                            borderColor: 'var(--border-color)'
                                        }}>
                                            <div className="flex items-center gap-3 mb-4 pb-3 border-b-2" style={{ borderColor: 'var(--warning-orange)' }}>
                                                <Award className="w-5 h-5" style={{ color: 'var(--warning-orange)' }} />
                                                <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                                                    Estado en Lista de Espera
                                                </h3>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <DataItem label="Posición" value={`#${ficha.listaEspera.posicion}`} />
                                                <DataItem label="Estado" value={ficha.listaEspera.estadoActual.replace('_', ' ')} />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Success Box */}
                                {ficha.estatus === 'aprobado' && (
                                    <div className="p-6 rounded-2xl text-center border-2" style={{
                                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
                                        borderColor: 'var(--success-green)'
                                    }}>
                                        <Sparkles className="w-12 h-12 mx-auto mb-3 text-yellow-400" />
                                        <h4 className="text-xl font-bold mb-2" style={{ color: 'var(--success-green)' }}>
                                            Felicidades
                                        </h4>
                                        <p style={{ color: 'var(--text-secondary)' }}>
                                            Has sido aceptado. Pronto recibirás más información para completar tu inscripción.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </Card>

                {/* Botón Volver */}
                <div className="text-center">
                    <Button
                        variant="secondary"
                        icon={<ArrowLeft size={18} />}
                        onClick={() => navigate('/')}
                        className="hover-lift"
                    >
                        Volver al Inicio
                    </Button>
                </div>
            </div>
        </div>
    );
};

// Componentes auxiliares
const InfoBox = ({ label, value }) => (
    <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-hover)' }}>
        <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--text-secondary)' }}>
            {label}
        </p>
        <p className="font-bold" style={{ color: 'var(--text-primary)' }}>
            {value}
        </p>
    </div>
);

const DataItem = ({ label, value, highlight }) => (
    <div className="flex justify-between items-center py-2">
        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            {label}:
        </span>
        <span className={`text-sm font-bold ${highlight ? 'text-green-600 dark:text-green-400' : ''}`}
            style={!highlight ? { color: 'var(--text-primary)' } : {}}>
            {value}
        </span>
    </div>
);

export default ConsultaFicha;
