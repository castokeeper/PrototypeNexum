import { useNavigate } from 'react-router-dom';
import { useSolicitudes } from '../context/SolicitudesContext';
import { toast } from 'react-toastify';
import { Upload, Send, Mail, Phone, Hash, BookOpen } from 'lucide-react';
import { Button, Input, Card } from './common';
import { useForm, useFileUpload } from '../hooks';
import { validarFormularioReinscripcion, CARRERAS, TURNOS, SEMESTRES, GRUPOS } from '../utils';

const initialFormData = {
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  matricula: '',
  grado: '',
  grupo: '',
  carrera: '',
  turno: '',
  telefono: '',
  email: ''
};

const Reinscripcion = () => {
  const navigate = useNavigate();
  const { agregarSolicitud } = useSolicitudes();

  // Usar custom hooks
  const {
    formData,
    errors,
    handleChange,
    handleBlur,
    validate,
    resetForm,
    isSubmitting,
    setIsSubmitting
  } = useForm(initialFormData, validarFormularioReinscripcion);

  const {
    file: comprobante,
    preview: previewUrl,
    error: fileError,
    handleFileChange,
    clearFile
  } = useFileUpload();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar todo el formulario
    if (!validate(comprobante)) {
      toast.error('Por favor corrige los errores en el formulario');
      return;
    }

    setIsSubmitting(true);

    try {
      await agregarSolicitud({
        tipo: 'reinscripcion',
        ...formData,
        comprobante: previewUrl
      });

      toast.success('Solicitud de reinscripción enviada correctamente');
      resetForm();
      clearFile();

      // Redirigir después de 1.5 segundos
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      toast.error('Error al enviar la solicitud. Por favor intenta de nuevo.');
      console.error('Error al enviar solicitud:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={containerStyle}>
      <Card title="Reinscripción" subtitle="Completa todos los campos para renovar tu matrícula">
        <form onSubmit={handleSubmit} style={formStyle}>

          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>Datos del Alumno</h3>

            <Input
              label="Nombre(s)"
              name="nombre"
              type="text"
              value={formData.nombre}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.nombre}
              required
            />

            <div style={rowStyle}>
              <Input
                label="Apellido Paterno"
                name="apellidoPaterno"
                type="text"
                value={formData.apellidoPaterno}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.apellidoPaterno}
                required
              />

              <Input
                label="Apellido Materno"
                name="apellidoMaterno"
                type="text"
                value={formData.apellidoMaterno}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.apellidoMaterno}
                required
              />
            </div>

            <Input
              label="Matrícula"
              name="matricula"
              type="text"
              value={formData.matricula}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.matricula}
              placeholder="Ej: 20221234"
              icon={<Hash size={18} />}
              required
            />

            <div style={rowStyle}>
              <Input
                label="Teléfono"
                name="telefono"
                type="tel"
                value={formData.telefono}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.telefono}
                placeholder="10 dígitos"
                icon={<Phone size={18} />}
                required
              />

              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
                placeholder="correo@ejemplo.com"
                icon={<Mail size={18} />}
                required
              />
            </div>
          </div>

          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>Información Académica</h3>

            <div style={rowStyle}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Grado (Semestre) *</label>
                <select
                  name="grado"
                  value={formData.grado}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{
                    ...inputStyle,
                    borderColor: errors.grado ? 'var(--danger-red)' : 'var(--border-color)'
                  }}
                  required
                >
                  <option value="">Selecciona el grado</option>
                  {SEMESTRES.map(semestre => (
                    <option key={semestre.value} value={semestre.value}>
                      {semestre.label}
                    </option>
                  ))}
                </select>
                {errors.grado && (
                  <span style={{ fontSize: '0.875rem', color: 'var(--danger-red)' }}>
                    {errors.grado}
                  </span>
                )}
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Grupo *</label>
                <select
                  name="grupo"
                  value={formData.grupo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{
                    ...inputStyle,
                    borderColor: errors.grupo ? 'var(--danger-red)' : 'var(--border-color)'
                  }}
                  required
                >
                  <option value="">Selecciona el grupo</option>
                  {GRUPOS.map(grupo => (
                    <option key={grupo} value={grupo}>{grupo}</option>
                  ))}
                </select>
                {errors.grupo && (
                  <span style={{ fontSize: '0.875rem', color: 'var(--danger-red)' }}>
                    {errors.grupo}
                  </span>
                )}
              </div>
            </div>

            <div style={rowStyle}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Carrera *</label>
                <select
                  name="carrera"
                  value={formData.carrera}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{
                    ...inputStyle,
                    borderColor: errors.carrera ? 'var(--danger-red)' : 'var(--border-color)'
                  }}
                  required
                >
                  <option value="">Selecciona una carrera</option>
                  {CARRERAS.map(carrera => (
                    <option key={carrera} value={carrera}>{carrera}</option>
                  ))}
                </select>
                {errors.carrera && (
                  <span style={{ fontSize: '0.875rem', color: 'var(--danger-red)' }}>
                    {errors.carrera}
                  </span>
                )}
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Turno *</label>
                <select
                  name="turno"
                  value={formData.turno}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{
                    ...inputStyle,
                    borderColor: errors.turno ? 'var(--danger-red)' : 'var(--border-color)'
                  }}
                  required
                >
                  <option value="">Selecciona un turno</option>
                  {TURNOS.map(turno => (
                    <option key={turno} value={turno}>{turno}</option>
                  ))}
                </select>
                {errors.turno && (
                  <span style={{ fontSize: '0.875rem', color: 'var(--danger-red)' }}>
                    {errors.turno}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>Comprobante de Pago</h3>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>
                <div style={{
                  ...uploadButtonStyle,
                  borderColor: errors.archivo || fileError ? 'var(--danger-red)' : '#3b82f6'
                }}>
                  <Upload size={20} />
                  <span>{comprobante ? comprobante.name : 'Seleccionar comprobante (JPG, PNG, PDF - Max 5MB)'}</span>
                </div>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  required
                />
              </label>
              {(errors.archivo || fileError) && (
                <span style={{ fontSize: '0.875rem', color: 'var(--danger-red)' }}>
                  {errors.archivo || fileError}
                </span>
              )}

              {previewUrl && (
                <div style={previewStyle}>
                  <img src={previewUrl} alt="Comprobante" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '0.5rem' }} />
                </div>
              )}
            </div>
          </div>

          <Button
            type="submit"
            variant="success"
            size="large"
            fullWidth
            icon={<Send size={20} />}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

// Estilos mínimos (la mayoría ahora vienen de componentes)
const containerStyle = {
  maxWidth: '900px',
  margin: '2rem auto',
  padding: '0 1rem'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem'
};

const sectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};

const sectionTitleStyle = {
  fontSize: '1.25rem',
  fontWeight: '600',
  color: 'var(--text-primary)',
  marginBottom: '0.5rem',
  paddingBottom: '0.5rem',
  borderBottom: '2px solid var(--border-color)',
  transition: 'color 0.3s ease'
};

const rowStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1rem'
};

const inputGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
};

const labelStyle = {
  fontWeight: '500',
  color: 'var(--text-primary)',
  fontSize: '0.875rem',
  transition: 'color 0.3s ease'
};

const inputStyle = {
  padding: '0.75rem',
  border: '1px solid var(--border-color)',
  borderRadius: '0.5rem',
  fontSize: '1rem',
  width: '100%',
  backgroundColor: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  transition: 'all 0.2s ease',
  outline: 'none'
};

const uploadButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.75rem 1rem',
  backgroundColor: 'var(--primary-blue-light)',
  color: 'white',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  justifyContent: 'center',
  transition: 'all 0.2s ease',
  border: '2px dashed transparent'
};

const previewStyle = {
  marginTop: '1rem',
  padding: '1rem',
  border: '2px dashed var(--border-color)',
  borderRadius: '0.5rem',
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: 'var(--bg-hover)',
  transition: 'all 0.3s ease'
};

export default Reinscripcion;

