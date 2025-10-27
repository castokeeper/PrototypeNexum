import { useSolicitudes } from '../context/SolicitudesContext';
import { CheckCircle, User, GraduationCap, Clock, FileText } from 'lucide-react';

const AlumnosAceptados = () => {
  const { aceptados } = useSolicitudes();

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={headerContentStyle}>
          <CheckCircle size={48} color="#10b981" />
          <div>
            <h2 style={titleStyle}>Alumnos Aceptados</h2>
            <p style={subtitleStyle}>
              Total de estudiantes aceptados: <strong>{aceptados.length}</strong>
            </p>
          </div>
        </div>
      </div>

      {aceptados.length === 0 ? (
        <div style={emptyStateStyle}>
          <CheckCircle size={64} color="#d1d5db" />
          <h3 style={emptyTitleStyle}>No hay alumnos aceptados aún</h3>
          <p style={emptyTextStyle}>
            Los alumnos aparecerán aquí una vez que sus solicitudes sean aprobadas
          </p>
        </div>
      ) : (
        <div style={gridStyle}>
          {aceptados.map((alumno) => (
            <div key={alumno.id} style={cardStyle}>
              <div style={cardHeaderStyle}>
                <span style={{
                  ...badgeStyle,
                  backgroundColor: alumno.tipo === 'nuevo-ingreso' ? '#3b82f6' : '#8b5cf6'
                }}>
                  {alumno.tipo === 'nuevo-ingreso' ? 'Nuevo Ingreso' : 'Reinscripción'}
                </span>
                <span style={{...badgeStyle, backgroundColor: '#10b981'}}>
                  <CheckCircle size={16} />
                  Aceptado
                </span>
              </div>

              <div style={cardBodyStyle}>
                <div style={avatarSectionStyle}>
                  <div style={avatarStyle}>
                    <User size={40} color="#1e40af" />
                  </div>
                  <div>
                    <h3 style={nameStyle}>
                      {alumno.nombre} {alumno.apellidoPaterno} {alumno.apellidoMaterno}
                    </h3>
                    {alumno.matricula && (
                      <p style={matriculaStyle}>Matrícula: {alumno.matricula}</p>
                    )}
                  </div>
                </div>

                <div style={dividerStyle}></div>

                <div style={infoSectionStyle}>
                  <div style={infoItemStyle}>
                    <GraduationCap size={18} color="#6b7280" />
                    <div>
                      <p style={infoLabelStyle}>Carrera</p>
                      <p style={infoValueStyle}>{alumno.carrera}</p>
                    </div>
                  </div>

                  {alumno.grado && (
                    <div style={infoItemStyle}>
                      <FileText size={18} color="#6b7280" />
                      <div>
                        <p style={infoLabelStyle}>Grado y Grupo</p>
                        <p style={infoValueStyle}>{alumno.grado}° - Grupo {alumno.grupo}</p>
                      </div>
                    </div>
                  )}

                  <div style={infoItemStyle}>
                    <Clock size={18} color="#6b7280" />
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
                      Aceptado el: {formatearFecha(alumno.fechaAceptacion)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Estilos
const containerStyle = {
  maxWidth: '1400px',
  margin: '0 auto',
  padding: '2rem',
  minHeight: 'calc(100vh - 80px)'
};

const headerStyle = {
  marginBottom: '2rem',
  backgroundColor: 'white',
  padding: '2rem',
  borderRadius: '0.5rem',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const headerContentStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1.5rem'
};

const titleStyle = {
  fontSize: '2rem',
  fontWeight: 'bold',
  color: '#1e40af',
  margin: 0
};

const subtitleStyle = {
  color: '#6b7280',
  fontSize: '1rem',
  margin: '0.5rem 0 0 0'
};

const emptyStateStyle = {
  backgroundColor: 'white',
  padding: '4rem 2rem',
  borderRadius: '0.5rem',
  textAlign: 'center',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const emptyTitleStyle = {
  fontSize: '1.5rem',
  color: '#374151',
  marginTop: '1rem',
  marginBottom: '0.5rem'
};

const emptyTextStyle = {
  color: '#6b7280',
  fontSize: '1rem'
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
  gap: '1.5rem'
};

const cardStyle = {
  backgroundColor: 'white',
  borderRadius: '0.5rem',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  overflow: 'hidden',
  transition: 'transform 0.2s, box-shadow 0.2s',
  border: '2px solid #10b981'
};

const cardHeaderStyle = {
  padding: '1rem 1.5rem',
  backgroundColor: '#f0fdf4',
  borderBottom: '1px solid #bbf7d0',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '0.5rem',
  flexWrap: 'wrap'
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
  padding: '1.5rem',
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
  backgroundColor: '#dbeafe',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
};

const nameStyle = {
  fontSize: '1.25rem',
  fontWeight: '700',
  color: '#111827',
  margin: 0
};

const matriculaStyle = {
  fontSize: '0.875rem',
  color: '#6b7280',
  margin: '0.25rem 0 0 0',
  fontWeight: '500'
};

const dividerStyle = {
  height: '1px',
  backgroundColor: '#e5e7eb',
  margin: '0.5rem 0'
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
  color: '#6b7280',
  fontWeight: '500',
  margin: 0,
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

const infoValueStyle = {
  fontSize: '0.95rem',
  color: '#111827',
  fontWeight: '600',
  margin: '0.125rem 0 0 0'
};

const contactSectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  fontSize: '0.875rem'
};

const contactItemStyle = {
  color: '#4b5563',
  wordBreak: 'break-word'
};

const dateAcceptedStyle = {
  marginTop: '0.5rem',
  padding: '0.5rem',
  backgroundColor: '#f0fdf4',
  borderRadius: '0.375rem',
  fontSize: '0.8rem',
  color: '#047857',
  fontWeight: '500',
  textAlign: 'center'
};

export default AlumnosAceptados;

