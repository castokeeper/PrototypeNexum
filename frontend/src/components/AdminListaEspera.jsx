import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
    Users, Search, CheckCircle, XCircle, Calendar,
    GraduationCap, Filter, ChevronDown, ChevronUp
} from 'lucide-react';
import { Button, Card, Input } from './common';
import { useAuth } from '../context/AuthContext';

const AdminListaEspera = () => {
    const [aspirantes, setAspirantes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtros, setFiltros] = useState({
        estado: '',
        carreraId: '',
        busqueda: ''
    });
    const [expandido, setExpandido] = useState(null);
    const [procesando, setProcesando] = useState(null);

    const { logout } = useAuth();

    useEffect(() => {
        cargarListaEspera();
    }, []);

    const cargarListaEspera = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('No hay sesión activa');
                return;
            }

            const params = new URLSearchParams();
            if (filtros.estado) params.append('estado', filtros.estado);
            if (filtros.carreraId) params.append('carreraId', filtros.carreraId);

            const response = await fetch(`/api/lista-espera?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401 || response.status === 403) {
                toast.error('Sesión expirada o inválida. Por favor inicia sesión nuevamente.');
                logout(); // Limpia estado y redirige
                return;
            }

            if (!response.ok) throw new Error('Error al cargar la lista');

            const data = await response.json();
            setAspirantes(data.aspirantes);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al cargar la lista de espera');
        } finally {
            setLoading(false);
        }
    };

    const aceptarAspirante = async (id) => {
        if (!confirm('¿Estás seguro de aceptar este aspirante? Se creará su registro como alumno.')) {
            return;
        }

        setProcesando(id);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/lista-espera/${id}/aceptar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    observaciones: 'Aceptado desde panel de administración'
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Error al aceptar aspirante');
            }

            toast.success('Aspirante aceptado y alumno creado exitosamente');
            cargarListaEspera();
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message);
        } finally {
            setProcesando(null);
        }
    };

    const rechazarAspirante = async (id) => {
        const motivo = prompt('Ingresa el motivo del rechazo:');
        if (!motivo) return;

        setProcesando(id);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/lista-espera/${id}/rechazar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ motivo })
            });

            if (!response.ok) throw new Error('Error al rechazar aspirante');

            toast.success('Aspirante rechazado');
            cargarListaEspera();
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al rechazar el aspirante');
        } finally {
            setProcesando(null);
        }
    };

    const getEstadoColor = (estado) => {
        const colores = {
            en_espera: '#f59e0b',
            aceptado: '#10b981',
            rechazado: '#ef4444',
            cancelado: '#6b7280',
            expirado: '#9ca3af'
        };
        return colores[estado] || '#6b7280';
    };

    const getEstatusColor = (estatus) => {
        const colores = {
            pendiente: '#6b7280',
            programado: '#f59e0b',
            presentado: '#3b82f6',
            aprobado: '#10b981',
            rechazado: '#ef4444'
        };
        return colores[estatus] || '#6b7280';
    };

    const aspirantesFiltrados = aspirantes.filter(asp => {
        if (filtros.busqueda) {
            const busqueda = filtros.busqueda.toLowerCase();
            return (
                asp.nombre.toLowerCase().includes(busqueda) ||
                asp.folio.toLowerCase().includes(busqueda) ||
                asp.curp.toLowerCase().includes(busqueda)
            );
        }
        return true;
    });

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <div style={headerContentStyle}>
                    <div style={iconHeaderStyle}>
                        <Users size={32} color="var(--primary-blue)" />
                    </div>
                    <div>
                        <h1 style={titleStyle}>Lista de Espera</h1>
                        <p style={subtitleStyle}>
                            {aspirantes.length} aspirante{aspirantes.length !== 1 ? 's' : ''} en total
                        </p>
                    </div>
                </div>
                <Button
                    variant="secondary"
                    icon={<Filter size={18} />}
                    onClick={cargarListaEspera}
                >
                    Actualizar
                </Button>
            </div>

            {/* Filtros */}
            <Card padding="comfortable" style={{ marginBottom: '1.5rem' }}>
                <div style={filtrosStyle}>
                    <Input
                        placeholder="Buscar por nombre, folio o CURP..."
                        value={filtros.busqueda}
                        onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
                        icon={<Search size={18} />}
                    />

                    <select
                        value={filtros.estado}
                        onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
                        style={selectStyle}
                    >
                        <option value="">Todos los estados</option>
                        <option value="en_espera">En Espera</option>
                        <option value="aceptado">Aceptado</option>
                        <option value="rechazado">Rechazado</option>
                    </select>
                </div>
            </Card>

            {/* Lista de aspirantes */}
            {loading ? (
                <Card padding="comfortable">
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        Cargando lista de espera...
                    </div>
                </Card>
            ) : aspirantesFiltrados.length === 0 ? (
                <Card padding="comfortable">
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                        No se encontraron aspirantes
                    </div>
                </Card>
            ) : (
                <div style={listaStyle}>
                    {aspirantesFiltrados.map((aspirante) => (
                        <Card key={aspirante.id} padding="comfortable" hover>
                            <div style={aspiranteCardStyle}>
                                {/* Header */}
                                <div style={aspiranteHeaderStyle}>
                                    <div style={posicionBadgeStyle}>
                                        #{aspirante.posicion}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={nombreStyle}>{aspirante.nombre}</h3>
                                        <div style={metadataStyle}>
                                            <span>{aspirante.folio}</span>
                                            <span>•</span>
                                            <span>{aspirante.carrera}</span>
                                        </div>
                                    </div>
                                    <div style={badgesStyle}>
                                        <span style={{
                                            ...badgeStyle,
                                            backgroundColor: `${getEstadoColor(aspirante.estadoEspera)}15`,
                                            color: getEstadoColor(aspirante.estadoEspera)
                                        }}>
                                            {aspirante.estadoEspera.replace('_', ' ')}
                                        </span>
                                        <span style={{
                                            ...badgeStyle,
                                            backgroundColor: `${getEstatusColor(aspirante.estadoFicha)}15`,
                                            color: getEstatusColor(aspirante.estadoFicha)
                                        }}>
                                            {aspirante.estadoFicha}
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="small"
                                        icon={expandido === aspirante.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                        onClick={() => setExpandido(expandido === aspirante.id ? null : aspirante.id)}
                                    />
                                </div>

                                {/* Detalles expandidos */}
                                {expandido === aspirante.id && (
                                    <div style={detallesStyle}>
                                        <div style={detallesGridStyle}>
                                            <DetailItem label="CURP" value={aspirante.curp} />
                                            <DetailItem label="Email" value={aspirante.email} />
                                            <DetailItem label="Teléfono" value={aspirante.telefono} />
                                            <DetailItem label="Turno" value={aspirante.turnoPreferido} />
                                            {aspirante.calificacion !== null && (
                                                <DetailItem
                                                    label="Calificación"
                                                    value={`${aspirante.calificacion}/100`}
                                                    highlight={aspirante.aprobado}
                                                />
                                            )}
                                            {aspirante.fechaExamen && (
                                                <DetailItem
                                                    label="Fecha Examen"
                                                    value={new Date(aspirante.fechaExamen).toLocaleDateString('es-MX')}
                                                />
                                            )}
                                        </div>

                                        {/* Acciones */}
                                        {aspirante.estadoEspera === 'en_espera' && (
                                            <>
                                                {/* Advertencia si no tiene calificación */}
                                                {aspirante.calificacion === null && (
                                                    <div style={infoBoxStyle}>
                                                        <Calendar size={18} />
                                                        <span>Este aspirante aún no tiene calificación registrada</span>
                                                    </div>
                                                )}

                                                <div style={accionesStyle}>
                                                    <Button
                                                        variant="success"
                                                        icon={<CheckCircle size={18} />}
                                                        onClick={() => aceptarAspirante(aspirante.id)}
                                                        loading={procesando === aspirante.id}
                                                        disabled={procesando !== null}
                                                    >
                                                        Aceptar Aspirante
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        icon={<XCircle size={18} />}
                                                        onClick={() => rechazarAspirante(aspirante.id)}
                                                        loading={procesando === aspirante.id}
                                                        disabled={procesando !== null}
                                                    >
                                                        Rechazar
                                                    </Button>
                                                </div>
                                            </>
                                        )}

                                        {aspirante.aprobado === false && aspirante.estadoEspera !== 'en_espera' && (
                                            <div style={warningBoxStyle}>
                                                <XCircle size={18} />
                                                <span>Este aspirante no aprobó el examen</span>
                                            </div>
                                        )}

                                        {aspirante.estadoEspera === 'rechazado' && (
                                            <div style={warningBoxStyle}>
                                                <XCircle size={18} />
                                                <span>Aspirante rechazado</span>
                                            </div>
                                        )}

                                        {aspirante.estadoEspera === 'aceptado' && (
                                            <div style={successBoxStyle}>
                                                <CheckCircle size={18} />
                                                <span>Aspirante aceptado - Puede llenar formulario de inscripción</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

const DetailItem = ({ label, value, highlight }) => (
    <div style={detailItemStyle}>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{
            fontWeight: '600',
            color: highlight ? '#10b981' : 'var(--text-primary)'
        }}>
            {value}
        </span>
    </div>
);

// Estilos
const containerStyle = {
    padding: '2rem',
    maxWidth: '1400px',
    margin: '0 auto'
};

const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
};

const headerContentStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
};

const iconHeaderStyle = {
    display: 'flex',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    backgroundColor: 'rgba(59, 130, 246, 0.1)'
};

const titleStyle = {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    margin: 0
};

const subtitleStyle = {
    color: 'var(--text-secondary)',
    fontSize: '0.875rem',
    margin: '0.25rem 0 0 0'
};

const filtrosStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: '1rem'
};

const selectStyle = {
    padding: '0.625rem 1rem',
    borderRadius: '0.5rem',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    minWidth: '200px'
};

const listaStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
};

const aspiranteCardStyle = {
    display: 'flex',
    flexDirection: 'column'
};

const aspiranteHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
};

const posicionBadgeStyle = {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'var(--primary-blue)',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    minWidth: '60px',
    textAlign: 'center'
};

const nombreStyle = {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    margin: 0
};

const metadataStyle = {
    display: 'flex',
    gap: '0.5rem',
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
    marginTop: '0.25rem'
};

const badgesStyle = {
    display: 'flex',
    gap: '0.5rem'
};

const badgeStyle = {
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'capitalize'
};

const detallesStyle = {
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid var(--border-color)'
};

const detallesGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem'
};

const detailItemStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
};

const accionesStyle = {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem'
};

const infoBoxStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    border: '1px solid #3b82f6',
    borderRadius: '0.5rem',
    color: '#3b82f6',
    marginTop: '1rem'
};

const warningBoxStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid #ef4444',
    borderRadius: '0.5rem',
    color: '#ef4444',
    marginTop: '1rem'
};

const successBoxStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid #10b981',
    borderRadius: '0.5rem',
    color: '#10b981',
    marginTop: '1rem'
};

export default AdminListaEspera;
