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


