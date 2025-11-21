import { useNavigate } from 'react-router-dom';
import { useSolicitudes } from '../context/SolicitudesContext';
import { toast } from 'react-toastify';
import { Upload, Send, Mail, Phone, User, BookOpen, Calendar } from 'lucide-react';
import { Button, Input, Card } from './common';
import { useForm, useFileUpload } from '../hooks';
import { validarFormularioNuevoIngreso, CARRERAS, TURNOS } from '../utils';

const initialFormData = {
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  edad: '',
  carrera: '',
  turno: '',
  telefono: '',
  email: ''
};

const NuevoIngreso = () => {
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
  } = useForm(initialFormData, validarFormularioNuevoIngreso);

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
        tipo: 'nuevoIngreso',
        ...formData,
        comprobante: previewUrl
      });

      toast.success('Solicitud de nuevo ingreso enviada correctamente');
      resetForm();
      clearFile();

      // Redirigir después de 1.5 segundos
      setTimeout(() => {
        navigate('/aceptados');
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
      <Card title="Nuevo Ingreso" subtitle="Completa todos los campos para iniciar tu proceso de inscripción">
        <form onSubmit={handleSubmit} style={formStyle}>

          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>Datos Personales</h3>

            <Input
              label="Nombre(s)"
              name="nombre"
              type="text"
              value={formData.nombre}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.nombre}
              icon={<User size={18} />}
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
              label="Edad"
              name="edad"
              type="number"
              value={formData.edad}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.edad}
              placeholder="Ej: 18"
              icon={<Calendar size={18} />}
              min="15"
              max="100"
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
                  <option key={carrera.value} value={carrera.value}>
                    {carrera.label}
                  </option>
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
                  <option key={turno.value} value={turno.value}>
                    {turno.label}
                  </option>
                ))}
              </select>
              {errors.turno && (
                <span style={{ fontSize: '0.875rem', color: 'var(--danger-red)' }}>
                  {errors.turno}
                </span>
              )}
            </div>
          </div>

          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>Documentación</h3>

            <div style={fileUploadContainerStyle}>
              <label style={labelStyle}>
                Comprobante de Pago * {fileError && <span style={errorTextStyle}>({fileError})</span>}
              </label>
              <div style={uploadAreaStyle}>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  id="fileInput"
                />
                <label htmlFor="fileInput" style={uploadLabelStyle}>
                  <Upload size={32} color="var(--primary-blue)" />
                  <span style={uploadTextStyle}>
                    {comprobante ? comprobante.name : 'Haz clic o arrastra el archivo aquí'}
                  </span>
                  <span style={uploadHintStyle}>
                    PDF, JPG o PNG (máx. 5MB)
                  </span>
                </label>
              </div>

              {previewUrl && (
                <div style={previewContainerStyle}>
                  {comprobante?.type?.startsWith('image/') ? (
                    <img src={previewUrl} alt="Preview" style={previewImageStyle} />
                  ) : (
                    <div style={pdfPreviewStyle}>
                      <BookOpen size={48} color="var(--primary-blue)" />
                      <p>{comprobante?.name}</p>
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearFile}
                    style={{ marginTop: '1rem' }}
                  >
                    Cambiar archivo
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div style={buttonContainerStyle}>
            <Button
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
              icon={<Send size={18} />}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
            </Button>
          </div>

        </form>
      </Card>
    </div>
  );
};

// Estilos
const containerStyle = {
  padding: '2rem',
  maxWidth: '900px',
  margin: '0 auto',
  width: '100%'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem'
};

const sectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem'
};

const sectionTitleStyle = {
  fontSize: '1.25rem',
  fontWeight: '600',
  color: 'var(--text-primary)',
  marginBottom: '0.5rem',
  paddingBottom: '0.5rem',
  borderBottom: '2px solid var(--primary-blue)'
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
  fontSize: '0.875rem',
  fontWeight: '500',
  color: 'var(--text-primary)',
  marginBottom: '0.25rem'
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  fontSize: '1rem',
  border: '1px solid var(--border-color)',
  borderRadius: '8px',
  backgroundColor: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  transition: 'all 0.2s ease',
  outline: 'none'
};

const fileUploadContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};

const uploadAreaStyle = {
  border: '2px dashed var(--border-color)',
  borderRadius: '12px',
  padding: '2rem',
  textAlign: 'center',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  backgroundColor: 'var(--bg-primary)'
};

const uploadLabelStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.75rem',
  cursor: 'pointer'
};

const uploadTextStyle = {
  fontSize: '1rem',
  color: 'var(--text-primary)',
  fontWeight: '500'
};

const uploadHintStyle = {
  fontSize: '0.875rem',
  color: 'var(--text-secondary)'
};

const previewContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem',
  marginTop: '1rem'
};

const previewImageStyle = {
  maxWidth: '100%',
  maxHeight: '300px',
  borderRadius: '8px',
  objectFit: 'contain'
};

const pdfPreviewStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '2rem',
  backgroundColor: 'var(--bg-secondary)',
  borderRadius: '8px',
  color: 'var(--text-primary)'
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  paddingTop: '1rem'
};

const errorTextStyle = {
  color: 'var(--danger-red)',
  fontSize: '0.875rem'
};

export default NuevoIngreso;

