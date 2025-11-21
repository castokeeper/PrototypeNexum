import { useState, useMemo } from 'react';
import { useSolicitudes } from '../context/SolicitudesContext';
import { toast } from 'react-toastify';
import { Filter } from 'lucide-react';
import { Card } from './common';
import SolicitudCard from './admin/SolicitudCard';
import SolicitudDetalle from './admin/SolicitudDetalle';
import { TIPO_SOLICITUD, ESTATUS_SOLICITUD } from '../utils';

const AdminPanel = () => {
  const { solicitudes, actualizarEstatus } = useSolicitudes();
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroEstatus, setFiltroEstatus] = useState('todos');
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

  // Memoizar solicitudes filtradas para optimizar performance
  const solicitudesFiltradas = useMemo(() => {
    return solicitudes.filter(sol => {
      const pasaFiltroTipo = filtroTipo === 'todos' || sol.tipo === filtroTipo;
      const pasaFiltroEstatus = filtroEstatus === 'todos' || sol.estatus === filtroEstatus;
      return pasaFiltroTipo && pasaFiltroEstatus;
    });
  }, [solicitudes, filtroTipo, filtroEstatus]);

  const handleAprobar = async (id) => {
    try {
      await actualizarEstatus(id, ESTATUS_SOLICITUD.APROBADA);
      toast.success('Solicitud aprobada exitosamente');
      setSolicitudSeleccionada(null);
    } catch (error) {
      toast.error('Error al aprobar la solicitud');
      console.error('Error al aprobar:', error);
    }
  };

  const handleRechazar = async (id) => {
    try {
      await actualizarEstatus(id, ESTATUS_SOLICITUD.RECHAZADA);
      toast.error('Solicitud rechazada');
      setSolicitudSeleccionada(null);
    } catch (error) {
      toast.error('Error al rechazar la solicitud');
      console.error('Error al rechazar:', error);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>Panel de Administración</h2>
        <p style={subtitleStyle}>Total de solicitudes: {solicitudesFiltradas.length}</p>
      </div>

      {/* Filtros */}
      <Card padding="compact" style={{ marginBottom: '2rem' }}>
        <div style={filtersContainerStyle}>
          <div style={filterGroupStyle}>
            <Filter size={20} color="var(--text-primary)" />
            <label style={filterLabelStyle}>Tipo:</label>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              style={selectStyle}
              aria-label="Filtrar por tipo de solicitud"
            >
              <option value="todos">Todos</option>
              <option value={TIPO_SOLICITUD.NUEVO_INGRESO}>Nuevo Ingreso</option>
              <option value={TIPO_SOLICITUD.REINSCRIPCION}>Reinscripción</option>
            </select>
          </div>

          <div style={filterGroupStyle}>
            <label style={filterLabelStyle}>Estatus:</label>
            <select
              value={filtroEstatus}
              onChange={(e) => setFiltroEstatus(e.target.value)}
              style={selectStyle}
              aria-label="Filtrar por estatus de solicitud"
            >
              <option value="todos">Todos</option>
              <option value={ESTATUS_SOLICITUD.PENDIENTE}>Pendiente</option>
              <option value={ESTATUS_SOLICITUD.APROBADA}>Aprobada</option>
              <option value={ESTATUS_SOLICITUD.RECHAZADA}>Rechazada</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Lista de solicitudes */}
      <div style={gridStyle}>
        {solicitudesFiltradas.length === 0 ? (
          <Card style={{ gridColumn: '1 / -1' }}>
            <div style={emptyStateStyle}>
              <p>No hay solicitudes para mostrar</p>
            </div>
          </Card>
        ) : (
          solicitudesFiltradas.map((solicitud) => (
            <SolicitudCard
              key={solicitud.id}
              solicitud={solicitud}
              onVerDetalles={setSolicitudSeleccionada}
              onAprobar={handleAprobar}
              onRechazar={handleRechazar}
            />
          ))
        )}
      </div>

      {/* Modal de detalles */}
      <SolicitudDetalle
        solicitud={solicitudSeleccionada}
        onClose={() => setSolicitudSeleccionada(null)}
        onAprobar={handleAprobar}
        onRechazar={handleRechazar}
      />
    </div>
  );
};

// Estilos mínimos (componentes manejan la mayoría)
const containerStyle = {
  width: '100%',
  padding: '2rem',
  minHeight: 'calc(100vh - 80px)',
  backgroundColor: 'var(--bg-secondary)',
  transition: 'background-color 0.3s ease'
};

const headerStyle = {
  marginBottom: '2rem',
  textAlign: 'center'
};

const titleStyle = {
  fontSize: '2rem',
  fontWeight: '700',
  color: 'var(--primary-blue)',
  marginBottom: '0.5rem',
  transition: 'color 0.3s ease'
};

const subtitleStyle = {
  color: 'var(--text-secondary)',
  fontSize: '1rem',
  transition: 'color 0.3s ease'
};

const filtersContainerStyle = {
  display: 'flex',
  gap: '1rem',
  flexWrap: 'wrap',
  alignItems: 'center'
};

const filterGroupStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem'
};

const filterLabelStyle = {
  fontWeight: '500',
  color: 'var(--text-primary)',
  transition: 'color 0.3s ease'
};

const selectStyle = {
  padding: '0.5rem 1rem',
  border: '1px solid var(--border-color)',
  borderRadius: '0.5rem',
  fontSize: '1rem',
  backgroundColor: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  outline: 'none'
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
  gap: '1.5rem',
  width: '100%'
};

const emptyStateStyle = {
  textAlign: 'center',
  padding: '3rem',
  color: 'var(--text-secondary)'
};

export default AdminPanel;

