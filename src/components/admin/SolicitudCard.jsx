import { memo } from 'react';
import PropTypes from 'prop-types';
import { Check, X, Eye } from 'lucide-react';
import { Button } from '../common';
import { formatearNombreCompleto, formatearTipoSolicitud, formatearEstatus, obtenerColorEstatus } from '../../utils';

const SolicitudCard = memo(({ solicitud, onVerDetalles, onAprobar, onRechazar }) => {
  const tipoColor = solicitud.tipo === 'nuevo-ingreso' ? 'var(--primary-blue-light)' : 'var(--purple)';
  
  return (
    <div style={cardStyle}>
      <div style={cardHeaderStyle}>
        <span style={{ ...badgeStyle, backgroundColor: tipoColor }}>
          {formatearTipoSolicitud(solicitud.tipo)}
        </span>
        <span style={{ ...badgeStyle, backgroundColor: obtenerColorEstatus(solicitud.estatus) }}>
          {formatearEstatus(solicitud.estatus)}
        </span>
      </div>

      <div style={cardBodyStyle}>
        <h3 style={nameStyle}>
          {formatearNombreCompleto(solicitud.nombre, solicitud.apellidoPaterno, solicitud.apellidoMaterno)}
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

        <Button
          variant="primary"
          size="small"
          fullWidth
          icon={<Eye size={18} />}
          onClick={() => onVerDetalles(solicitud)}
        >
          Ver Detalles y Comprobante
        </Button>

        {solicitud.estatus === 'pendiente' && (
          <div style={actionsStyle}>
            <Button
              variant="success"
              size="small"
              icon={<Check size={18} />}
              onClick={() => onAprobar(solicitud.id)}
              style={{ flex: 1 }}
            >
              Aprobar
            </Button>
            <Button
              variant="danger"
              size="small"
              icon={<X size={18} />}
              onClick={() => onRechazar(solicitud.id)}
              style={{ flex: 1 }}
            >
              Rechazar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
});

SolicitudCard.displayName = 'SolicitudCard';

SolicitudCard.propTypes = {
  solicitud: PropTypes.object.isRequired,
  onVerDetalles: PropTypes.func.isRequired,
  onAprobar: PropTypes.func.isRequired,
  onRechazar: PropTypes.func.isRequired
};

// Estilos
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

const actionsStyle = {
  display: 'flex',
  gap: '0.5rem',
  marginTop: '0.5rem'
};

export default SolicitudCard;

