import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Search, FileText, CheckCircle, XCircle, Clock, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button, Input, Card } from './common';

const ConsultaFicha = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [folio, setFolio] = useState('');
    const [ficha, setFicha] = useState(null);
    const [loading, setLoading] = useState(false);

    // Si llegamos desde el registro, mostrar la ficha generada
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
                return <CheckCircle size={24} color="#10b981" />;
            case 'rechazado':
                return <XCircle size={24} color="#ef4444" />;
            case 'programado':
                return <Clock size={24} color="#f59e0b" />;
            case 'pendiente':
                return <AlertCircle size={24} color="#6b7280" />;
            default:
                return <FileText size={24} color="#6b7280" />;
        }
    };

    const getEstatusColor = (estatus) => {
        switch (estatus) {
            case 'aprobado':
                return '#10b981';
            case 'rechazado':
                return '#ef4444';
            case 'programado':
                return '#f59e0b';
            case 'pendiente':
                return '#6b7280';
            default:
                return '#6b7280';
        }
    };

    const getEstatusTexto = (estatus) => {
        const textos = {
            pendiente: 'Pendiente de Programación',
            programado: 'Examen Programado',
            presentado: 'Examen Presentado',
            aprobado: '✓ Aprobado',
            rechazado: '✗ No Aprobado',
            cancelado: 'Cancelado'
        };
        return textos[estatus] || estatus;
    };

    return (
        <div style={containerStyle}>
            <div style={maxWidthContainer}>
                <div style={headerStyle}>
                    <div style={iconHeaderStyle}>
                        <Search size={48} color="var(--primary-blue)" />
                    </div>
                    <h1 style={titleStyle}>Consultar Ficha de Examen</h1>
                    <p style={subtitleStyle}>
                        Ingresa tu folio para consultar el estado de tu solicitud
                    </p>
                </div>

                {/* Mostrar ficha recién generada */}
                {fichaGenerada && (
                    <Card padding="comfortable" style={{ marginBottom: '2rem', backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                        <div style={{ textAlign: 'center' }}>
                            <CheckCircle size={48} color="#10b981" style={{ marginBottom: '1rem' }} />
                            <h2 style={{ color: '#10b981', marginBottom: '1rem' }}>¡Ficha Generada Exitosamente!</h2>
                            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary-blue)', marginBottom: '1rem' }}>
                                {fichaGenerada.folio}
                            </div>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                                Guarda este folio, lo necesitarás para consultar tu estado
                            </p>
                            <div style={infoGridStyle}>
                                <InfoItem label="Nombre" value={fichaGenerada.nombre} />
                                <InfoItem label="Carrera" value={fichaGenerada.carrera} />
                                <InfoItem label="Turno" value={fichaGenerada.turno} />
                                <InfoItem label="Posición en Lista" value={`#${fichaGenerada.posicionEspera}`} />
                            </div>
                        </div>
                    </Card>
                )}

                {/* Formulario de búsqueda */}
                <Card padding="comfortable">
                    <form onSubmit={handleBuscar} style={formStyle}>
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
                            variant="primary"
                            size="large"
                            fullWidth
                            loading={loading}
                            disabled={loading}
                            icon={<Search size={20} />}
                        >
                            {loading ? 'Buscando...' : 'Buscar Ficha'}
                        </Button>
                    </form>

                    {/* Resultados */}
                    {ficha && (
                        <div style={resultadoStyle}>
                            <div style={estatusHeaderStyle}>
                                {getEstatusIcon(ficha.estatus)}
                                <h2 style={{ ...estatusTitleStyle, color: getEstatusColor(ficha.estatus) }}>
                                    {getEstatusTexto(ficha.estatus)}
                                </h2>
                            </div>

                            <div style={dataGridStyle}>
                                <DataSection title="Datos del Aspirante">
                                    <DataItem label="Folio" value={ficha.folio} />
                                    <DataItem label="Nombre" value={ficha.aspirante.nombre} />
                                    <DataItem label="CURP" value={ficha.aspirante.curp} />
                                    <DataItem label="Email" value={ficha.aspirante.email} />
                                    <DataItem label="Teléfono" value={ficha.aspirante.telefono} />
                                </DataSection>

                                <DataSection title="Carrera Seleccionada">
                                    <DataItem label="Carrera" value={ficha.carrera} />
                                    <DataItem label="Turno" value={ficha.turno.charAt(0).toUpperCase() + ficha.turno.slice(1)} />
                                </DataSection>

                                {ficha.examen.fechaExamen && (
                                    <DataSection title="Información del Examen">
                                        <DataItem label="Fecha" value={new Date(ficha.examen.fechaExamen).toLocaleDateString('es-MX')} />
                                        <DataItem label="Lugar" value={ficha.examen.lugarExamen || 'Por confirmar'} />
                                        {ficha.examen.calificacion !== null && (
                                            <DataItem
                                                label="Calificación"
                                                value={`${ficha.examen.calificacion}/100`}
                                                highlight={ficha.examen.aprobado}
                                            />
                                        )}
                                    </DataSection>
                                )}

                                {ficha.listaEspera && (
                                    <DataSection title="Estado en Lista de Espera">
                                        <DataItem label="Posición" value={`#${ficha.listaEspera.posicion}`} />
                                        <DataItem label="Estado" value={ficha.listaEspera.estadoActual.replace('_', ' ')} />
                                    </DataSection>
                                )}
                            </div>

                            {ficha.estatus === 'aprobado' && (
                                <div style={successBoxStyle}>
                                    <h4 style={{ color: '#10b981', margin: 0 }}>🎉 ¡Felicidades!</h4>
                                    <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-secondary)' }}>
                                        Has sido aceptado. Pronto recibirás más información para completar tu inscripción.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </Card>

                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <Button
                        variant="secondary"
                        icon={<ArrowLeft size={18} />}
                        onClick={() => navigate('/')}
                    >
                        Volver al Inicio
                    </Button>
                </div>
            </div>
        </div>
    );
};

// Componentes auxiliares
const InfoItem = ({ label, value }) => (
    <div style={infoItemStyle}>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{value}</span>
    </div>
);

const DataSection = ({ title, children }) => (
    <div style={dataSectionStyle}>
        <h3 style={dataSectionTitleStyle}>{title}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {children}
        </div>
    </div>
);

const DataItem = ({ label, value, highlight }) => (
    <div style={dataItemStyle}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{label}:</span>
        <span style={{
            fontWeight: '600',
            color: highlight ? '#10b981' : 'var(--text-primary)',
            fontSize: '1rem'
        }}>
            {value}
        </span>
    </div>
);

// Estilos
const containerStyle = {
    minHeight: 'calc(100vh - 80px)',
    padding: '2rem',
    backgroundColor: 'var(--bg-secondary)'
};

const maxWidthContainer = {
    maxWidth: '800px',
    margin: '0 auto'
};

const headerStyle = {
    textAlign: 'center',
    marginBottom: '2rem'
};

const iconHeaderStyle = {
    display: 'inline-flex',
    padding: '1rem',
    borderRadius: '50%',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    marginBottom: '1rem'
};

const titleStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '0.5rem'
};

const subtitleStyle = {
    color: 'var(--text-secondary)',
    fontSize: '1rem'
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
};

const resultadoStyle = {
    marginTop: '2rem',
    paddingTop: '2rem',
    borderTop: '2px solid var(--border-color)'
};

const estatusHeaderStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem'
};

const estatusTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: '700',
    margin: 0
};

const dataGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '1.5rem'
};

const dataSectionStyle = {
    padding: '1.5rem',
    backgroundColor: 'var(--bg-hover)',
    borderRadius: '0.5rem',
    border: '1px solid var(--border-color)'
};

const dataSectionTitleStyle = {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: 'var(--primary-blue)',
    marginBottom: '1rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid var(--border-color)'
};

const dataItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
};

const infoGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginTop: '1.5rem'
};

const infoItemStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
};

const successBoxStyle = {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    border: '2px solid #10b981',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    textAlign: 'center'
};

export default ConsultaFicha;
