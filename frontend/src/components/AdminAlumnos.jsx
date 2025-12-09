import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
    Users,
    Search,
    Filter,
    UserCheck,
    UserX,
    Award,
    Download,
    Eye
} from 'lucide-react';
import { Button, Input, Card, Badge } from './common';

const AdminAlumnos = () => {
    const [alumnos, setAlumnos] = useState([]);
    const [estadisticas, setEstadisticas] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filtros, setFiltros] = useState({
        search: '',
        carreraId: '',
        estatus: '',
        page: 1,
        limit: 20
    });
    const [carreras, setCarreras] = useState([]);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        totalPages: 1
    });

    useEffect(() => {
        cargarDatos();
    }, [filtros]);

    useEffect(() => {
        cargarCarreras();
        cargarEstadisticas();
    }, []);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            const params = new URLSearchParams();
            if (filtros.search) params.append('search', filtros.search);
            if (filtros.carreraId) params.append('carreraId', filtros.carreraId);
            if (filtros.estatus) params.append('estatus', filtros.estatus);
            params.append('page', filtros.page);
            params.append('limit', filtros.limit);

            const response = await fetch(`/api/alumnos?${params.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Error al cargar alumnos');

            const data = await response.json();
            setAlumnos(data.alumnos);
            setPagination(data.pagination);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al cargar los alumnos');
        } finally {
            setLoading(false);
        }
    };

    const cargarCarreras = async () => {
        try {
            const response = await fetch('/api/carreras');
            const data = await response.json();
            setCarreras(data.filter(c => c.activa));
        } catch (error) {
            console.error('Error al cargar carreras:', error);
        }
    };

    const cargarEstadisticas = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/alumnos/estadisticas', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setEstadisticas(data);
            }
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        }
    };

    const cambiarEstatus = async (id, nuevoEstatus) => {
        const motivo = prompt(`Motivo del cambio de estatus a "${nuevoEstatus}":`);
        if (!motivo) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/alumnos/${id}/estatus`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ estatus: nuevoEstatus, motivo })
            });

            if (!response.ok) throw new Error('Error al cambiar estatus');

            toast.success('Estatus actualizado correctamente');
            cargarDatos();
            cargarEstadisticas();
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setFiltros(prev => ({ ...prev, page: 1 }));
    };

    const getEstatusBadge = (estatus) => {
        const config = {
            aspirante: { variant: 'default', text: 'Aspirante' },
            activo: { variant: 'success', text: 'Activo' },
            baja_temporal: { variant: 'warning', text: 'Baja Temporal' },
            egresado: { variant: 'info', text: 'Egresado' },
            baja_definitiva: { variant: 'error', text: 'Baja Definitiva' }
        };

        const { variant, text } = config[estatus] || { variant: 'default', text: estatus };
        return <Badge variant={variant}>{text}</Badge>;
    };

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <div>
                    <h1 style={titleStyle}>
                        <Users size={32} />
                        Gestión de Alumnos
                    </h1>
                    <p style={subtitleStyle}>
                        Administración de alumnos registrados
                    </p>
                </div>
            </div>

            {/* Estadísticas */}
            {estadisticas && (
                <div style={statsGridStyle}>
                    <Card padding="comfortable">
                        <div style={statCardStyle}>
                            <Users size={24} color="var(--primary-blue)" />
                            <div>
                                <div style={statNumberStyle}>{estadisticas.total}</div>
                                <div style={statLabelStyle}>Total Alumnos</div>
                            </div>
                        </div>
                    </Card>

                    <Card padding="comfortable">
                        <div style={statCardStyle}>
                            <UserCheck size={24} color="#10b981" />
                            <div>
                                <div style={statNumberStyle}>{estadisticas.porEstatus.activo}</div>
                                <div style={statLabelStyle}>Activos</div>
                            </div>
                        </div>
                    </Card>

                    <Card padding="comfortable">
                        <div style={statCardStyle}>
                            <Award size={24} color="#3b82f6" />
                            <div>
                                <div style={statNumberStyle}>{estadisticas.porEstatus.egresado}</div>
                                <div style={statLabelStyle}>Egresados</div>
                            </div>
                        </div>
                    </Card>

                    <Card padding="comfortable">
                        <div style={statCardStyle}>
                            <UserX size={24} color="#f59e0b" />
                            <div>
                                <div style={statNumberStyle}>
                                    {estadisticas.porEstatus.bajaTemporal + estadisticas.porEstatus.bajaDefinitiva}
                                </div>
                                <div style={statLabelStyle}>Bajas</div>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Filtros */}
            <Card padding="comfortable">
                <form onSubmit={handleSearch} style={filtersFormStyle}>
                    <Input
                        placeholder="Buscar por nombre, número de control o CURP..."
                        value={filtros.search}
                        onChange={(e) => setFiltros(prev => ({ ...prev, search: e.target.value }))}
                        icon={<Search size={18} />}
                    />

                    <select
                        value={filtros.carreraId}
                        onChange={(e) => setFiltros(prev => ({ ...prev, carreraId: e.target.value, page: 1 }))}
                        style={selectStyle}
                    >
                        <option value="">Todas las carreras</option>
                        {carreras.map(c => (
                            <option key={c.id} value={c.id}>{c.nombre}</option>
                        ))}
                    </select>

                    <select
                        value={filtros.estatus}
                        onChange={(e) => setFiltros(prev => ({ ...prev, estatus: e.target.value, page: 1 }))}
                        style={selectStyle}
                    >
                        <option value="">Todos los estatus</option>
                        <option value="activo">Activo</option>
                        <option value="baja_temporal">Baja Temporal</option>
                        <option value="egresado">Egresado</option>
                        <option value="baja_definitiva">Baja Definitiva</option>
                    </select>

                    <Button type="submit" variant="primary" icon={<Filter size={18} />}>
                        Filtrar
                    </Button>
                </form>
            </Card>

            {/* Tabla de Alumnos */}
            <Card>
                {loading ? (
                    <div style={loadingStyle}>Cargando alumnos...</div>
                ) : alumnos.length === 0 ? (
                    <div style={emptyStyle}>
                        <Users size={48} color="var(--text-tertiary)" />
                        <p>No se encontraron alumnos</p>
                    </div>
                ) : (
                    <>
                        <div style={tableContainerStyle}>
                            <table style={tableStyle}>
                                <thead>
                                    <tr>
                                        <th style={thStyle}>Folio</th>
                                        <th style={thStyle}>Nombre</th>
                                        <th style={thStyle}>CURP</th>
                                        <th style={thStyle}>Carrera</th>
                                        <th style={thStyle}>Semestre</th>
                                        <th style={thStyle}>Estatus</th>
                                        <th style={thStyle}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {alumnos.map(alumno => (
                                        <tr key={alumno.id} style={trStyle}>
                                            <td style={tdStyle}>
                                                <strong>{alumno.folio || '-'}</strong>
                                            </td>
                                            <td style={tdStyle}>{alumno.nombre}</td>
                                            <td style={tdStyle}>
                                                <small style={{ fontFamily: 'monospace' }}>{alumno.curp}</small>
                                            </td>
                                            <td style={tdStyle}>{alumno.carrera}</td>
                                            <td style={tdStyle}>{alumno.semestre}°</td>
                                            <td style={tdStyle}>
                                                {getEstatusBadge(alumno.estatus)}
                                            </td>
                                            <td style={tdStyle}>
                                                <div style={actionsStyle}>
                                                    <button
                                                        onClick={() => toast.info('Función en desarrollo')}
                                                        style={actionButtonStyle}
                                                        title="Ver detalles"
                                                    >
                                                        <Eye size={16} />
                                                    </button>

                                                    {alumno.estatus === 'activo' && (
                                                        <>
                                                            <button
                                                                onClick={() => cambiarEstatus(alumno.id, 'baja_temporal')}
                                                                style={{ ...actionButtonStyle, color: '#f59e0b' }}
                                                                title="Baja temporal"
                                                            >
                                                                <UserX size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => cambiarEstatus(alumno.id, 'egresado')}
                                                                style={{ ...actionButtonStyle, color: '#10b981' }}
                                                                title="Marcar como egresado"
                                                            >
                                                                <Award size={16} />
                                                            </button>
                                                        </>
                                                    )}

                                                    {alumno.estatus === 'baja_temporal' && (
                                                        <button
                                                            onClick={() => cambiarEstatus(alumno.id, 'activo')}
                                                            style={{ ...actionButtonStyle, color: '#10b981' }}
                                                            title="Reactivar"
                                                        >
                                                            <UserCheck size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginación */}
                        {pagination.totalPages > 1 && (
                            <div style={paginationStyle}>
                                <Button
                                    variant="secondary"
                                    disabled={filtros.page === 1}
                                    onClick={() => setFiltros(prev => ({ ...prev, page: prev.page - 1 }))}
                                >
                                    Anterior
                                </Button>

                                <span style={paginationTextStyle}>
                                    Página {pagination.page} de {pagination.totalPages}
                                    ({pagination.total} alumnos)
                                </span>

                                <Button
                                    variant="secondary"
                                    disabled={filtros.page === pagination.totalPages}
                                    onClick={() => setFiltros(prev => ({ ...prev, page: prev.page + 1 }))}
                                >
                                    Siguiente
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </Card>
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
    marginBottom: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
};

const titleStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    margin: 0,
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
};

const subtitleStyle = {
    color: 'var(--text-secondary)',
    margin: 0
};

const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem'
};

const statCardStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
};

const statNumberStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    color: 'var(--text-primary)'
};

const statLabelStyle = {
    fontSize: '0.875rem',
    color: 'var(--text-secondary)'
};

const filtersFormStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr auto auto auto',
    gap: '1rem',
    alignItems: 'end'
};

const selectStyle = {
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    fontSize: '0.875rem',
    cursor: 'pointer',
    outline: 'none'
};

const tableContainerStyle = {
    overflowX: 'auto'
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse'
};

const thStyle = {
    textAlign: 'left',
    padding: '1rem',
    borderBottom: '2px solid var(--border-color)',
    color: 'var(--text-secondary)',
    fontSize: '0.875rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
};

const tdStyle = {
    padding: '1rem',
    borderBottom: '1px solid var(--border-color)',
    color: 'var(--text-primary)'
};

const trStyle = {
    transition: 'background-color 0.2s',
    ':hover': {
        backgroundColor: 'var(--bg-hover)'
    }
};

const actionsStyle = {
    display: 'flex',
    gap: '0.5rem'
};

const actionButtonStyle = {
    padding: '0.5rem',
    borderRadius: '0.375rem',
    border: 'none',
    background: 'transparent',
    color: 'var(--primary-blue)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const loadingStyle = {
    textAlign: 'center',
    padding: '3rem',
    color: 'var(--text-secondary)'
};

const emptyStyle = {
    textAlign: 'center',
    padding: '3rem',
    color: 'var(--text-tertiary)'
};

const paginationStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    borderTop: '1px solid var(--border-color)'
};

const paginationTextStyle = {
    color: 'var(--text-secondary)',
    fontSize: '0.875rem'
};

export default AdminAlumnos;
