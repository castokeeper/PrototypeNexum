import { useState } from 'react';
import { useSolicitudes } from '../context/SolicitudesContext';
import { toast } from 'react-toastify';
import { Check, X, Eye, Filter } from 'lucide-react';

const AdminPanel = () => {
  const { solicitudes, actualizarEstatus } = useSolicitudes();
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroEstatus, setFiltroEstatus] = useState('todos');
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

  const handleAprobar = (id) => {
    actualizarEstatus(id, 'aprobada');
    toast.success('Solicitud aprobada exitosamente');
    setSolicitudSeleccionada(null);
  };

  const handleRechazar = (id) => {
    actualizarEstatus(id, 'rechazada');
    toast.error('Solicitud rechazada');
    setSolicitudSeleccionada(null);
  };

  const solicitudesFiltradas = solicitudes.filter(sol => {
    const pasaFiltroTipo = filtroTipo === 'todos' || sol.tipo === filtroTipo;
    const pasaFiltroEstatus = filtroEstatus === 'todos' || sol.estatus === filtroEstatus;
    return pasaFiltroTipo && pasaFiltroEstatus;
  });

  const getEstatusColor = (estatus) => {
    switch(estatus) {
      case 'pendiente': return '#f59e0b';
      case 'aprobada': return '#10b981';
      case 'rechazada': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getEstatusTexto = (estatus) => {
    switch(estatus) {
      case 'pendiente': return 'Pendiente';
      case 'aprobada': return 'Aprobada';
      case 'rechazada': return 'Rechazada';
      default: return estatus;
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>Panel de Administración</h2>
        <p style={subtitleStyle}>Total de solicitudes: {solicitudesFiltradas.length}</p>
      </div>

      {/* Filtros */}
      <div style={filtersContainerStyle}>
        <div style={filterGroupStyle}>
          <Filter size={20} />
          <label style={filterLabelStyle}>Tipo:</label>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            style={selectStyle}
          >
            <option value="todos">Todos</option>
            <option value="nuevo-ingreso">Nuevo Ingreso</option>
            <option value="reinscripcion">Reinscripción</option>
          </select>
        </div>

        <div style={filterGroupStyle}>
          <label style={filterLabelStyle}>Estatus:</label>
          <select
            value={filtroEstatus}
            onChange={(e) => setFiltroEstatus(e.target.value)}
            style={selectStyle}
          >
            <option value="todos">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="aprobada">Aprobada</option>
            <option value="rechazada">Rechazada</option>
          </select>
        </div>
      </div>

      {/* Lista de solicitudes */}
      <div style={gridStyle}>
        {solicitudesFiltradas.length === 0 ? (
          <div style={emptyStateStyle}>
            <p>No hay solicitudes para mostrar</p>
          </div>
        ) : (
          solicitudesFiltradas.map((solicitud) => (
            <div key={solicitud.id} style={cardStyle}>
              <div style={cardHeaderStyle}>
                <span style={{
                  ...badgeStyle,
                  backgroundColor: solicitud.tipo === 'nuevo-ingreso' ? '#3b82f6' : '#8b5cf6'
                }}>
                  {solicitud.tipo === 'nuevo-ingreso' ? 'Nuevo Ingreso' : 'Reinscripción'}
                </span>
                <span style={{
                  ...badgeStyle,
                  backgroundColor: getEstatusColor(solicitud.estatus)
                }}>
                  {getEstatusTexto(solicitud.estatus)}
                </span>
              </div>

              <div style={cardBodyStyle}>
                <h3 style={nameStyle}>
                  {solicitud.nombre} {solicitud.apellidoPaterno} {solicitud.apellidoMaterno}
                </h3>

                <div style={infoGridStyle}>
                  {solicitud.matricula && (
                    <div style={infoItemStyle}>
                      <strong>Matrícula:</strong> {solicitud.matricula}
                    </div>
                  )}
                  <div style={infoItemStyle}>
                    <strong>Carrera:</strong> {solicitud.carrera}
                  </div>
                  <div style={infoItemStyle}>
                    <strong>Turno:</strong> {solicitud.turno}
                  </div>
                  {solicitud.grado && (
                    <>
                      <div style={infoItemStyle}>
                        <strong>Grado:</strong> {solicitud.grado}° Semestre
                      </div>
                      <div style={infoItemStyle}>
                        <strong>Grupo:</strong> {solicitud.grupo}
                      </div>
                    </>
                  )}
                  <div style={infoItemStyle}>
                    <strong>Email:</strong> {solicitud.email}
                  </div>
                  <div style={infoItemStyle}>
                    <strong>Teléfono:</strong> {solicitud.telefono}
                  </div>
                </div>

                <button
                  onClick={() => setSolicitudSeleccionada(solicitud)}
                  style={viewButtonStyle}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Eye size={18} />
                  <span>Ver Detalles y Comprobante</span>
                </button>

                {solicitud.estatus === 'pendiente' && (
                  <div style={actionsStyle}>
                    <button
                      onClick={() => handleAprobar(solicitud.id)}
                      style={approveButtonStyle}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.backgroundColor = 'var(--success-green-hover)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.backgroundColor = 'var(--success-green)';
                      }}
                    >
                      <Check size={18} />
                      <span>Aprobar</span>
                    </button>
                    <button
                      onClick={() => handleRechazar(solicitud.id)}
                      style={rejectButtonStyle}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.backgroundColor = 'var(--danger-red-hover)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.backgroundColor = 'var(--danger-red)';
                      }}
                    >
                      <X size={18} />
                      <span>Rechazar</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de detalles */}
      {solicitudSeleccionada && (
        <div style={modalOverlayStyle} onClick={() => setSolicitudSeleccionada(null)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h3 style={modalTitleStyle}>Detalles de la Solicitud</h3>
              <button
                onClick={() => setSolicitudSeleccionada(null)}
                style={closeButtonStyle}
              >
                <X size={24} />
              </button>
            </div>

            <div style={modalBodyStyle}>
              <div style={detailSectionStyle}>
                <h4 style={sectionTitleStyle}>Información Personal</h4>
                <div style={detailGridStyle}>
                  <div><strong>Nombre completo:</strong> {solicitudSeleccionada.nombre} {solicitudSeleccionada.apellidoPaterno} {solicitudSeleccionada.apellidoMaterno}</div>
                  {solicitudSeleccionada.curp && (
                    <div><strong>CURP:</strong> {solicitudSeleccionada.curp}</div>
                  )}
                  {solicitudSeleccionada.fechaNacimiento && (
                    <div><strong>Fecha de Nacimiento:</strong> {solicitudSeleccionada.fechaNacimiento}</div>
                  )}
                  <div><strong>Email:</strong> {solicitudSeleccionada.email}</div>
                  <div><strong>Teléfono:</strong> {solicitudSeleccionada.telefono}</div>
                  {solicitudSeleccionada.direccion && (
                    <div><strong>Dirección:</strong> {solicitudSeleccionada.direccion}</div>
                  )}
                </div>
              </div>

              <div style={detailSectionStyle}>
                <h4 style={sectionTitleStyle}>Información Académica</h4>
                <div style={detailGridStyle}>
                  {solicitudSeleccionada.matricula && (
                    <div><strong>Matrícula:</strong> {solicitudSeleccionada.matricula}</div>
                  )}
                  <div><strong>Carrera:</strong> {solicitudSeleccionada.carrera}</div>
                  <div><strong>Turno:</strong> {solicitudSeleccionada.turno}</div>
                  {solicitudSeleccionada.grado && (
                    <>
                      <div><strong>Grado:</strong> {solicitudSeleccionada.grado}° Semestre</div>
                      <div><strong>Grupo:</strong> {solicitudSeleccionada.grupo}</div>
                    </>
                  )}
                </div>
              </div>

              <div style={detailSectionStyle}>
                <h4 style={sectionTitleStyle}>Comprobante de Pago</h4>
                <div style={comprobanteContainerStyle}>
                  <img
                    src={solicitudSeleccionada.comprobante}
                    alt="Comprobante de pago"
                    style={comprobanteImageStyle}
                  />
                </div>
              </div>

              {solicitudSeleccionada.estatus === 'pendiente' && (
                <div style={modalActionsStyle}>
                  <button
                    onClick={() => handleAprobar(solicitudSeleccionada.id)}
                    style={approveButtonStyle}
                  >
                    <Check size={18} />
                    <span>Aprobar Solicitud</span>
                  </button>
                  <button
                    onClick={() => handleRechazar(solicitudSeleccionada.id)}
                    style={rejectButtonStyle}
                  >
                    <X size={18} />
                    <span>Rechazar Solicitud</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Estilos
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
  marginBottom: '2rem',
  padding: '1.5rem',
  backgroundColor: 'var(--bg-card)',
  borderRadius: '0.75rem',
  boxShadow: 'var(--shadow-md)',
  flexWrap: 'wrap',
  maxWidth: '100%',
  border: '1px solid var(--border-color)',
  transition: 'all 0.3s ease'
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
  gridColumn: '1 / -1',
  textAlign: 'center',
  padding: '3rem',
  backgroundColor: 'var(--bg-card)',
  borderRadius: '0.75rem',
  color: 'var(--text-secondary)',
  border: '1px solid var(--border-color)',
  transition: 'all 0.3s ease'
};

const cardStyle = {
  backgroundColor: 'var(--bg-card)',
  borderRadius: '0.75rem',
  boxShadow: 'var(--shadow-md)',
  overflow: 'hidden',
  transition: 'all 0.2s ease',
  border: '1px solid var(--border-color)'
};

const cardHeaderStyle = {
  padding: '1rem',
  backgroundColor: 'var(--bg-hover)',
  borderBottom: '1px solid var(--border-color)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  transition: 'background-color 0.3s ease'
};

const badgeStyle = {
  padding: '0.25rem 0.75rem',
  borderRadius: '9999px',
  color: 'white',
  fontSize: '0.875rem',
  fontWeight: '600',
  transition: 'all 0.2s ease'
};

const cardBodyStyle = {
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};

const nameStyle = {
  fontSize: '1.25rem',
  fontWeight: '600',
  color: 'var(--text-primary)',
  marginBottom: '0.5rem',
  transition: 'color 0.3s ease'
};

const infoGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '0.5rem',
  fontSize: '0.875rem',
  color: 'var(--text-secondary)',
  transition: 'color 0.3s ease'
};

const infoItemStyle = {
  padding: '0.25rem 0'
};

const viewButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  padding: '0.75rem',
  backgroundColor: 'var(--primary-blue-light)',
  color: 'white',
  border: 'none',
  borderRadius: '0.5rem',
  fontSize: '0.875rem',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  boxShadow: 'var(--shadow-sm)'
};

const actionsStyle = {
  display: 'flex',
  gap: '0.5rem',
  marginTop: '0.5rem'
};

const approveButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  padding: '0.75rem',
  backgroundColor: 'var(--success-green)',
  color: 'white',
  border: 'none',
  borderRadius: '0.5rem',
  fontSize: '0.875rem',
  fontWeight: '500',
  cursor: 'pointer',
  flex: 1,
  transition: 'all 0.2s ease',
  boxShadow: 'var(--shadow-sm)'
};

const rejectButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  padding: '0.75rem',
  backgroundColor: 'var(--danger-red)',
  color: 'white',
  border: 'none',
  borderRadius: '0.5rem',
  fontSize: '0.875rem',
  fontWeight: '500',
  cursor: 'pointer',
  flex: 1,
  transition: 'all 0.2s ease',
  boxShadow: 'var(--shadow-sm)'
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'var(--overlay-bg)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '1rem',
  animation: 'fadeIn 0.2s ease-out'
};

const modalContentStyle = {
  backgroundColor: 'var(--bg-card)',
  borderRadius: '0.75rem',
  maxWidth: '900px',
  width: '100%',
  maxHeight: '90vh',
  overflow: 'auto',
  boxShadow: 'var(--shadow-xl)',
  border: '1px solid var(--border-color)',
  transition: 'all 0.3s ease',
  animation: 'slideIn 0.3s ease-out'
};

const modalHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1.5rem',
  borderBottom: '1px solid var(--border-color)',
  transition: 'border-color 0.3s ease'
};

const modalTitleStyle = {
  fontSize: '1.5rem',
  fontWeight: '700',
  color: 'var(--text-primary)',
  transition: 'color 0.3s ease'
};

const closeButtonStyle = {
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--text-secondary)',
  padding: '0.5rem',
  borderRadius: '0.375rem',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const modalBodyStyle = {
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem'
};

const detailSectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};

const sectionTitleStyle = {
  fontSize: '1.125rem',
  fontWeight: '600',
  color: 'var(--text-primary)',
  paddingBottom: '0.5rem',
  borderBottom: '2px solid var(--border-color)',
  transition: 'all 0.3s ease'
};

const detailGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '0.75rem',
  fontSize: '0.875rem',
  color: 'var(--text-secondary)',
  transition: 'color 0.3s ease'
};

const comprobanteContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  padding: '1rem',
  backgroundColor: 'var(--bg-hover)',
  borderRadius: '0.5rem',
  transition: 'background-color 0.3s ease'
};

const comprobanteImageStyle = {
  maxWidth: '100%',
  maxHeight: '500px',
  borderRadius: '0.5rem',
  boxShadow: 'var(--shadow-md)',
  transition: 'all 0.2s ease'
};

const modalActionsStyle = {
  display: 'flex',
  gap: '1rem',
  paddingTop: '1rem',
  borderTop: '1px solid var(--border-color)',
  transition: 'border-color 0.3s ease'
};

export default AdminPanel;
