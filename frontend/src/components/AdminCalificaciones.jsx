import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
    Award, Search, Edit3, Save, X, CheckCircle, XCircle,
    Users, Filter, ChevronDown, ChevronUp
} from 'lucide-react';
import { Button, Card, Input } from './common';

const AdminCalificaciones = () => {
    const [fichas, setFichas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtros, setFiltros] = useState({
        estatus: '',
        busqueda: ''
    });
    const [editando, setEditando] = useState(null);
    const [guardando, setGuardando] = useState(false);
    const [formData, setFormData] = useState({
        calificacion: '',
        aprobado: null,
        fechaExamen: '',
        lugarExamen: ''
    });

    useEffect(() => {
        cargarFichas();
    }, [filtros.estatus]);

    const cargarFichas = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams();
            if (filtros.estatus) params.append('estatus', filtros.estatus);

            const response = await fetch(`/api/fichas?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Error al cargar fichas');

            const data = await response.json();
            setFichas(data.fichas);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al cargar las fichas');
        } finally {
            setLoading(false);
        }
    };

    const iniciarEdicion = (ficha) => {
        setEditando(ficha.id);
        setFormData({
            calificacion: ficha.calificacion?.toString() || '',
            aprobado: ficha.aprobado,
            fechaExamen: ficha.fechaExamen ? new Date(ficha.fechaExamen).toISOString().slice(0, 16) : '',
            lugarExamen: ficha.lugarExamen || ''
        });
    };

    const cancelarEdicion = () => {
        setEditando(null);
        setFormData({
            calificacion: '',
            aprobado: null,
            fechaExamen: '',
            lugarExamen: ''
        });
    };

    const guardarCalificacion = async (fichaId) => {
        if (!formData.calificacion) {
            toast.error('Ingresa una calificación');
            return;
        }

        const calificacion = parseFloat(formData.calificacion);
        if (isNaN(calificacion) || calificacion < 0 || calificacion > 100) {
            toast.error('La calificación debe ser un número entre 0 y 100');
            return;
        }

        setGuardando(true);
        try {
            const token = localStorage.getItem('token');

            // Determinar si aprobó basado en la calificación (60 es el mínimo)
            const aprobado = formData.aprobado !== null ? formData.aprobado : calificacion >= 60;

            const response = await fetch(`/api/fichas/${fichaId}/resultado`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    calificacion,
                    aprobado,
                    fechaExamen: formData.fechaExamen || new Date().toISOString(),
                    lugarExamen: formData.lugarExamen || 'Presencial'
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al guardar');
            }

            toast.success('Calificación guardada correctamente');
            cancelarEdicion();
            cargarFichas();
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message || 'Error al guardar la calificación');
        } finally {
            setGuardando(false);
        }
    };

    const fichasFiltradas = fichas.filter(ficha => {
        if (filtros.busqueda) {
            const busqueda = filtros.busqueda.toLowerCase();
            return (
                ficha.nombre.toLowerCase().includes(busqueda) ||
                ficha.folio.toLowerCase().includes(busqueda) ||
                ficha.curp.toLowerCase().includes(busqueda)
            );
        }
        return true;
    });

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

    const getAprobadoBadge = (aprobado, calificacion) => {
        if (calificacion === null || calificacion === undefined) {
            return <span style={{ color: '#6b7280' }}>Sin calificar</span>;
        }
        if (aprobado) {
            return (
                <span className="flex items-center gap-1" style={{ color: '#10b981' }}>
                    <CheckCircle size={16} />
                    Aprobado
                </span>
            );
        }
        return (
            <span className="flex items-center gap-1" style={{ color: '#ef4444' }}>
                <XCircle size={16} />
                No aprobado
            </span>
        );
    };

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <div style={headerContentStyle}>
                    <div style={iconHeaderStyle}>
                        <Award size={32} color="var(--primary-blue)" />
                    </div>
                    <div>
                        <h1 style={titleStyle}>Calificaciones de Exámenes</h1>
                        <p style={subtitleStyle}>
                            Registra y actualiza las calificaciones de los aspirantes
                        </p>
                    </div>
                </div>
                <Button
                    variant="secondary"
                    icon={<Filter size={18} />}
                    onClick={cargarFichas}
                >
                    Actualizar
                </Button>
            </div>

            {/* Estadísticas rápidas */}
            <div style={statsContainerStyle}>
                <div style={statCardStyle}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>{fichas.length}</span>
                </div>
                <div style={statCardStyle}>
                    <span style={{ color: '#f59e0b', fontSize: '0.875rem' }}>Sin calificar</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f59e0b' }}>
                        {fichas.filter(f => f.calificacion === null).length}
                    </span>
                </div>
                <div style={statCardStyle}>
                    <span style={{ color: '#10b981', fontSize: '0.875rem' }}>Aprobados</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>
                        {fichas.filter(f => f.aprobado === true).length}
                    </span>
                </div>
                <div style={statCardStyle}>
                    <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>No aprobados</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ef4444' }}>
                        {fichas.filter(f => f.aprobado === false).length}
                    </span>
                </div>
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
                        value={filtros.estatus}
                        onChange={(e) => setFiltros({ ...filtros, estatus: e.target.value })}
                        style={selectStyle}
                    >
                        <option value="">Todos los estados</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="programado">Programado</option>
                        <option value="aprobado">Aprobado</option>
                        <option value="rechazado">Rechazado</option>
                    </select>
                </div>
            </Card>

            {/* Lista de fichas */}
            {loading ? (
                <Card padding="comfortable">
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        Cargando fichas...
                    </div>
                </Card>
            ) : fichasFiltradas.length === 0 ? (
                <Card padding="comfortable">
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                        No se encontraron fichas
                    </div>
                </Card>
            ) : (
                <div style={tableContainerStyle}>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Folio</th>
                                <th style={thStyle}>Aspirante</th>
                                <th style={thStyle}>Carrera</th>
                                <th style={thStyle}>Estatus</th>
                                <th style={thStyle}>Calificación</th>
                                <th style={thStyle}>Resultado</th>
                                <th style={thStyle}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fichasFiltradas.map(ficha => (
                                <tr key={ficha.id} style={trStyle}>
                                    <td style={tdStyle}>
                                        <strong>{ficha.folio}</strong>
                                    </td>
                                    <td style={tdStyle}>
                                        <div>
                                            <div style={{ fontWeight: '500' }}>{ficha.nombre}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                {ficha.curp}
                                            </div>
                                        </div>
                                    </td>
                                    <td style={tdStyle}>{ficha.carrera}</td>
                                    <td style={tdStyle}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            backgroundColor: `${getEstatusColor(ficha.estatus)}15`,
                                            color: getEstatusColor(ficha.estatus)
                                        }}>
                                            {ficha.estatus}
                                        </span>
                                    </td>
                                    <td style={tdStyle}>
                                        {editando === ficha.id ? (
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                step="0.1"
                                                value={formData.calificacion}
                                                onChange={(e) => setFormData({ ...formData, calificacion: e.target.value })}
                                                style={inputCalificacionStyle}
                                                placeholder="0-100"
                                            />
                                        ) : (
                                            <span style={{ fontWeight: '600', fontSize: '1.125rem' }}>
                                                {ficha.calificacion !== null ? ficha.calificacion.toFixed(1) : '-'}
                                            </span>
                                        )}
                                    </td>
                                    <td style={tdStyle}>
                                        {editando === ficha.id ? (
                                            <select
                                                value={formData.aprobado === null ? '' : formData.aprobado.toString()}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    aprobado: e.target.value === '' ? null : e.target.value === 'true'
                                                })}
                                                style={selectSmallStyle}
                                            >
                                                <option value="">Automático</option>
                                                <option value="true">Aprobado</option>
                                                <option value="false">No aprobado</option>
                                            </select>
                                        ) : (
                                            getAprobadoBadge(ficha.aprobado, ficha.calificacion)
                                        )}
                                    </td>
                                    <td style={tdStyle}>
                                        {editando === ficha.id ? (
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => guardarCalificacion(ficha.id)}
                                                    disabled={guardando}
                                                    style={saveButtonStyle}
                                                    title="Guardar"
                                                >
                                                    <Save size={16} />
                                                </button>
                                                <button
                                                    onClick={cancelarEdicion}
                                                    style={cancelButtonStyle}
                                                    title="Cancelar"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => iniciarEdicion(ficha)}
                                                style={editButtonStyle}
                                                title="Editar calificación"
                                            >
                                                <Edit3 size={16} />
                                                {ficha.calificacion === null ? 'Calificar' : 'Editar'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

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

const statsContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem'
};

const statCardStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: 'var(--bg-card)',
    borderRadius: '0.75rem',
    border: '1px solid var(--border-color)'
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
    minWidth: '180px'
};

const tableContainerStyle = {
    backgroundColor: 'var(--bg-card)',
    borderRadius: '0.75rem',
    border: '1px solid var(--border-color)',
    overflow: 'hidden'
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse'
};

const thStyle = {
    padding: '1rem',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
    borderBottom: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-secondary)'
};

const tdStyle = {
    padding: '1rem',
    borderBottom: '1px solid var(--border-color)',
    color: 'var(--text-primary)'
};

const trStyle = {
    transition: 'background-color 0.2s'
};

const inputCalificacionStyle = {
    width: '80px',
    padding: '0.5rem',
    borderRadius: '0.375rem',
    border: '2px solid var(--primary-blue)',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    fontSize: '1rem',
    fontWeight: '600',
    textAlign: 'center'
};

const selectSmallStyle = {
    padding: '0.375rem 0.5rem',
    borderRadius: '0.375rem',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    fontSize: '0.75rem'
};

const editButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.5rem',
    border: 'none',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    color: '#3b82f6',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500'
};

const saveButtonStyle = {
    padding: '0.5rem',
    borderRadius: '0.375rem',
    border: 'none',
    backgroundColor: '#10b981',
    color: 'white',
    cursor: 'pointer'
};

const cancelButtonStyle = {
    padding: '0.5rem',
    borderRadius: '0.375rem',
    border: 'none',
    backgroundColor: '#6b7280',
    color: 'white',
    cursor: 'pointer'
};

export default AdminCalificaciones;
