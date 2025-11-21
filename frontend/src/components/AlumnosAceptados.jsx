import { useSolicitudes } from '../context/SolicitudesContext';
import { CheckCircle, User, GraduationCap, Clock, FileText } from 'lucide-react';
import { Card } from './common';
import { formatearNombreCompleto, formatearFecha, formatearTipoSolicitud } from '../utils';

const AlumnosAceptados = () => {
  const { aceptados } = useSolicitudes();

  return (
    <div style={containerStyle}>
      <Card padding="comfortable" style={{ marginBottom: '2rem' }}>
        <div style={headerContentStyle}>
          <CheckCircle size={48} color="var(--success-green)" />
          <div>
            <h2 style={titleStyle}>Alumnos Aceptados</h2>
            <p style={subtitleStyle}>
              Total de estudiantes aceptados: <strong>{aceptados.length}</strong>
            </p>
          </div>
        </div>
      </Card>

      {aceptados.length === 0 ? (
        <Card>
          <div style={emptyStateStyle}>
            <CheckCircle size={64} color="var(--text-tertiary)" />
            <h3 style={emptyTitleStyle}>No hay alumnos aceptados aún</h3>
            <p style={emptyTextStyle}>
              Los alumnos aparecerán aquí una vez que sus solicitudes sean aprobadas
            </p>
          </div>
        </Card>
      ) : (
        <div style={gridStyle}>
          {aceptados.map((alumno) => (
            <Card key={alumno.id} hoverable padding="normal" style={cardStyle}>
              <div style={cardHeaderStyle}>
                <span style={{
                  ...badgeStyle,
                  backgroundColor: alumno.tipo === 'nuevo-ingreso' ? 'var(--primary-blue-light)' : 'var(--purple)'
                }}>
                  {formatearTipoSolicitud(alumno.tipo)}
                </span>
                <span style={{ ...badgeStyle, backgroundColor: 'var(--success-green)' }}>
                  <CheckCircle size={16} />
                  Aceptado
                </span>
              </div>

              <div style={cardBodyStyle}>
                <div style={avatarSectionStyle}>
                  <div style={avatarStyle}>
                    <User size={40} color="var(--primary-blue)" />
                  </div>
                  <div>
                    <h3 style={nameStyle}>
                      {formatearNombreCompleto(alumno.nombre, alumno.apellidoPaterno, alumno.apellidoMaterno)}
                    </h3>
                    {alumno.matricula && (
                      <p style={matriculaStyle}>Matrícula: {alumno.matricula}</p>
                    )}
                  </div>
                </div>

                <div style={dividerStyle}></div>

                <div style={infoSectionStyle}>
                  <div style={infoItemStyle}>
                    <GraduationCap size={18} color="var(--text-secondary)" />
                    <div>
                      <p style={infoLabelStyle}>Carrera</p>
                      <p style={infoValueStyle}>{alumno.carrera}</p>
                    </div>
                  </div>

                  {alumno.grado && (
                    <div style={infoItemStyle}>
                      <FileText size={18} color="var(--text-secondary)" />
                      <div>
                        <p style={infoLabelStyle}>Grado y Grupo</p>
                        <p style={infoValueStyle}>{alumno.grado}° - Grupo {alumno.grupo}</p>
                      </div>
                    </div>
                  )}

                  <div style={infoItemStyle}>
                    <Clock size={18} color="var(--text-secondary)" />
                    <div>
                      <p style={infoLabelStyle}>Turno</p>
                      <p style={infoValueStyle}>{alumno.turno}</p>
                    </div>
                  </div>
                </div>

                <div style={dividerStyle}></div>

                <div style={contactSectionStyle}>
                  <div style={contactItemStyle}>
                    <strong>Email:</strong> {alumno.email}
                  </div>
                  <div style={contactItemStyle}>
                    <strong>Teléfono:</strong> {alumno.telefono}
                  </div>
                  {alumno.fechaAceptacion && (
                    <div style={dateAcceptedStyle}>
                      ✅ Aceptado el: {formatearFecha(alumno.fechaAceptacion)}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Estilos mínimos
const containerStyle = {
  maxWidth: '1400px',
  margin: '0 auto',
  padding: '2rem',
  minHeight: 'calc(100vh - 80px)'
};

const headerContentStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1.5rem'
};

const titleStyle = {
  fontSize: '2rem',
  fontWeight: '700',
  color: 'var(--primary-blue)',
  margin: 0,
  transition: 'color 0.3s ease'
};

const subtitleStyle = {
  color: 'var(--text-secondary)',
  fontSize: '1rem',
  margin: '0.5rem 0 0 0',
  transition: 'color 0.3s ease'
};

const emptyStateStyle = {
  padding: '4rem 2rem',
  textAlign: 'center'
};

const emptyTitleStyle = {
  fontSize: '1.5rem',
  color: 'var(--text-primary)',
  marginTop: '1rem',
  marginBottom: '0.5rem',
  transition: 'color 0.3s ease'
};

const emptyTextStyle = {
  color: 'var(--text-secondary)',
  fontSize: '1rem',
  transition: 'color 0.3s ease'
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
  gap: '1.5rem'
};

const cardStyle = {
  border: '2px solid var(--success-green)',
  transition: 'all 0.2s ease'
};

const cardHeaderStyle = {
  padding: '1rem',
  backgroundColor: 'var(--bg-hover)',
  borderBottom: '1px solid var(--border-color)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '0.5rem',
  flexWrap: 'wrap',
  transition: 'background-color 0.3s ease'
};

const badgeStyle = {
  padding: '0.375rem 0.875rem',
  borderRadius: '9999px',
  color: 'white',
  fontSize: '0.8rem',
  fontWeight: '600',
  display: 'flex',
  alignItems: 'center',
  gap: '0.375rem',
  whiteSpace: 'nowrap'
};

const cardBodyStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};

const avatarSectionStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem'
};

const avatarStyle = {
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  backgroundColor: 'rgba(59, 130, 246, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  transition: 'background-color 0.3s ease'
};

const nameStyle = {
  fontSize: '1.25rem',
  fontWeight: '700',
  color: 'var(--text-primary)',
  margin: 0,
  transition: 'color 0.3s ease'
};

const matriculaStyle = {
  fontSize: '0.875rem',
  color: 'var(--text-secondary)',
  marginTop: '0.25rem',
  transition: 'color 0.3s ease'
};

const dividerStyle = {
  height: '1px',
  backgroundColor: 'var(--border-color)',
  transition: 'background-color 0.3s ease'
};

const infoSectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem'
};

const infoItemStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '0.75rem'
};

const infoLabelStyle = {
  fontSize: '0.75rem',
  color: 'var(--text-secondary)',
  margin: 0,
  fontWeight: '500',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  transition: 'color 0.3s ease'
};

const infoValueStyle = {
  fontSize: '0.875rem',
  color: 'var(--text-primary)',
  margin: '0.125rem 0 0 0',
  fontWeight: '600',
  transition: 'color 0.3s ease'
};

const contactSectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  fontSize: '0.875rem'
};

const contactItemStyle = {
  color: 'var(--text-secondary)',
  transition: 'color 0.3s ease'
};

const dateAcceptedStyle = {
  marginTop: '0.5rem',
  padding: '0.5rem',
  backgroundColor: 'rgba(16, 185, 129, 0.1)',
  borderRadius: '0.375rem',
  fontSize: '0.8125rem',
  color: 'var(--success-green)',
  fontWeight: '500',
  textAlign: 'center',
  transition: 'background-color 0.3s ease'
};

export default AlumnosAceptados;

