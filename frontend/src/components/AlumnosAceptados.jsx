import { useSolicitudes } from '../context/SolicitudesContext';
import { CheckCircle, User, GraduationCap, Clock, FileText, Mail, Phone, Calendar, Award, Sparkles } from 'lucide-react';
import { Card } from './common';
import { formatearNombreCompleto, formatearFecha, formatearTipoSolicitud } from '../utils';

const AlumnosAceptados = () => {
  const { aceptados } = useSolicitudes();

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-8 fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect mb-4">
            <Award className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-semibold gradient-text">Bienvenidos</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Estudiantes Aceptados
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            Felicidades a los nuevos miembros de nuestra comunidad académica
          </p>
        </div>

        {/* Stats Card */}
        <Card className="scale-in mb-8" style={{
          background: 'linear-gradient(135deg, var(--success-green) 0%, #059669 100%)',
          color: 'white',
          borderRadius: '1.5rem',
          boxShadow: 'var(--shadow-2xl)'
        }}>
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                <CheckCircle size={40} className="text-white" />
              </div>
              <div>
                <p className="text-white/80 text-sm font-medium">Total de Aceptados</p>
                <p className="text-4xl font-bold">{aceptados.length}</p>
              </div>
            </div>
            <Sparkles size={48} className="text-white/30" />
          </div>
        </Card>
      </div>

      {/* Alumnos Grid */}
      <div className="max-w-7xl mx-auto">
        {aceptados.length === 0 ? (
          <Card className="scale-in">
            <div className="p-12 text-center">
              <div className="inline-flex p-6 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                <CheckCircle size={64} style={{ color: 'var(--text-tertiary)' }} />
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                No hay alumnos aceptados aún
              </h3>
              <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
                Los alumnos aparecerán aquí una vez que sus solicitudes sean aprobadas
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {aceptados.map((alumno, index) => (
              <Card
                key={alumno.id}
                className="hover-lift scale-in"
                style={{
                  animationDelay: `${index * 100}ms`,
                  background: 'var(--bg-card)',
                  borderRadius: '1.25rem',
                  border: '2px solid var(--success-green)',
                  overflow: 'hidden'
                }}
              >
                {/* Card Header */}
                <div className="p-4 flex items-center justify-between gap-2" style={{
                  background: 'linear-gradient(135deg, var(--success-green) 0%, #059669 100%)'
                }}>
                  <span className="px-3 py-1 bg-white/90 rounded-full text-xs font-bold flex items-center gap-1.5" style={{
                    color: alumno.tipo === 'nuevo-ingreso' ? 'var(--primary-blue)' : 'var(--purple)'
                  }}>
                    <FileText size={14} />
                    {formatearTipoSolicitud(alumno.tipo)}
                  </span>
                  <span className="px-3 py-1 bg-white/90 text-green-700 rounded-full text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle size={14} />
                    Aceptado
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4">
                  {/* Avatar and Name */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 shadow-md" style={{
                      background: 'linear-gradient(135deg, var(--primary-blue) 0%, var(--purple) 100%)'
                    }}>
                      <User size={32} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                        {formatearNombreCompleto(alumno.nombre, alumno.apellidoPaterno, alumno.apellidoMaterno)}
                      </h3>
                      {alumno.matricula && (
                        <p className="text-sm font-mono font-semibold" style={{ color: 'var(--primary-blue)' }}>
                          {alumno.matricula}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="h-px" style={{ backgroundColor: 'var(--border-color)' }}></div>

                  {/* Info Grid */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <GraduationCap size={18} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                          Carrera
                        </p>
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {alumno.carrera}
                        </p>
                      </div>
                    </div>

                    {alumno.grado && (
                      <div className="flex items-start gap-3">
                        <FileText size={18} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                            Grado y Grupo
                          </p>
                          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {alumno.grado}° - Grupo {alumno.grupo}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <Clock size={18} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                          Turno
                        </p>
                        <p className="text-sm font-semibold capitalize" style={{ color: 'var(--text-primary)' }}>
                          {alumno.turno}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="h-px" style={{ backgroundColor: 'var(--border-color)' }}></div>

                  {/* Contact Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <Mail size={14} className="flex-shrink-0" />
                      <span className="truncate">{alumno.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <Phone size={14} className="flex-shrink-0" />
                      <span>{alumno.telefono}</span>
                    </div>
                    {alumno.fechaAceptacion && (
                      <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        <Calendar size={14} className="flex-shrink-0" />
                        <span>Aceptado: {formatearFecha(alumno.fechaAceptacion)}</span>
                      </div>
                    )}
                  </div>

                  {/* Acceptance Badge */}
                  {alumno.fechaAceptacion && (
                    <div className="pt-3">
                      <div className="p-3 rounded-lg text-center text-xs font-semibold" style={{
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
                        color: 'var(--success-green)',
                        border: '1px solid rgba(16, 185, 129, 0.2)'
                      }}>
                        ✨ ¡Bienvenido a la comunidad! ✨
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumnosAceptados;
