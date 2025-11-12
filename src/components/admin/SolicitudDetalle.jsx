import PropTypes from 'prop-types';
import { Check, X } from 'lucide-react';
import { Modal, Button } from '../common';
import { formatearNombreCompleto } from '../../utils';

const SolicitudDetalle = ({ solicitud, onClose, onAprobar, onRechazar }) => {
  if (!solicitud) return null;

  return (
    <Modal
      isOpen={!!solicitud}
      onClose={onClose}
      title="Detalles de la Solicitud"
      size="large"
      footer={
        solicitud.estatus === 'pendiente' && (
          <>
            <Button
              variant="success"
              icon={<Check size={18} />}
              onClick={() => onAprobar(solicitud.id)}
            >
              Aprobar Solicitud
            </Button>
            <Button
              variant="danger"
              icon={<X size={18} />}
              onClick={() => onRechazar(solicitud.id)}
            >
              Rechazar Solicitud
            </Button>
          </>
        )
      }
    >
      <div style={modalBodyStyle}>
        <div style={detailSectionStyle}>
          <h4 style={sectionTitleStyle}>Información Personal</h4>
          <div style={detailGridStyle}>
            <div>
              <strong>Nombre completo:</strong>{' '}
              {formatearNombreCompleto(solicitud.nombre, solicitud.apellidoPaterno, solicitud.apellidoMaterno)}
            </div>
            {solicitud.curp && (
              <div>
                <strong>CURP:</strong> {solicitud.curp}
              </div>
            )}
            {solicitud.fechaNacimiento && (
              <div>
                <strong>Fecha de Nacimiento:</strong> {solicitud.fechaNacimiento}
              </div>
            )}
            <div>
              <strong>Email:</strong> {solicitud.email}
            </div>
            <div>
              <strong>Teléfono:</strong> {solicitud.telefono}
            </div>
            {solicitud.direccion && (
              <div>
                <strong>Dirección:</strong> {solicitud.direccion}
              </div>
            )}
          </div>
        </div>

        <div style={detailSectionStyle}>
          <h4 style={sectionTitleStyle}>Información Académica</h4>
          <div style={detailGridStyle}>
            {solicitud.matricula && (
              <div>
                <strong>Matrícula:</strong> {solicitud.matricula}
              </div>
            )}
            <div>
              <strong>Carrera:</strong> {solicitud.carrera}
            </div>
            <div>
              <strong>Turno:</strong> {solicitud.turno}
            </div>
            {solicitud.grado && (
              <>
                <div>
                  <strong>Grado:</strong> {solicitud.grado}° Semestre
                </div>
                <div>
                  <strong>Grupo:</strong> {solicitud.grupo}
                </div>
              </>
            )}
          </div>
        </div>

        <div style={detailSectionStyle}>
          <h4 style={sectionTitleStyle}>Comprobante de Pago</h4>
          <div style={comprobanteContainerStyle}>
            <img
              src={solicitud.comprobante}
              alt="Comprobante de pago"
              style={comprobanteImageStyle}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

SolicitudDetalle.propTypes = {
  solicitud: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onAprobar: PropTypes.func.isRequired,
  onRechazar: PropTypes.func.isRequired
};

// Estilos
const modalBodyStyle = {
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
  transition: 'all 0.3s ease',
  margin: 0
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

export default SolicitudDetalle;

