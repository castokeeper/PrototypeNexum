import { useNavigate } from 'react-router-dom';
import { useSolicitudes } from '../context/SolicitudesContext';
import { toast } from 'react-toastify';
import { Upload, Send, Mail, Phone, Hash, BookOpen, User, GraduationCap, Clock, RefreshCw, Sparkles } from 'lucide-react';
import { Button, Input, Card } from './common';
import { useForm, useFileUpload } from '../hooks';
import { validarFormularioReinscripcion, CARRERAS, TURNOS, SEMESTRES, getGruposPorTurno } from '../utils';

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

      toast.success('Solicitud de reinscripcion enviada correctamente');
      resetForm();
      clearFile();

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
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto mb-12 text-center fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect mb-4">
          <RefreshCw className="w-5 h-5 text-green-400" />
          <span className="text-sm font-semibold gradient-text">Renueva tu Matrícula</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
          Solicitud de Reinscripción
        </h1>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          Complete el formulario para renovar tu matrícula del próximo semestre
        </p>
      </div>

      {/* Form Container */}
      <div className="max-w-4xl mx-auto">
        <Card className="scale-in" style={{
          background: 'var(--bg-card)',
          borderRadius: '1.5rem',
          boxShadow: 'var(--shadow-2xl)',
          border: '1px solid var(--border-color)'
        }}>
          <form onSubmit={handleSubmit} className="space-y-8 p-6 md:p-8">

            {/* Datos del Alumno */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b-2" style={{ borderColor: 'var(--primary-blue)' }}>
                <User className="w-6 h-6" style={{ color: 'var(--primary-blue)' }} />
                <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Datos del Alumno
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3">
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
                </div>

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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* Información Académica */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b-2" style={{ borderColor: 'var(--purple)' }}>
                <GraduationCap className="w-6 h-6" style={{ color: 'var(--purple)' }} />
                <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Información Académica
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    Grado (Semestre) *
                  </label>
                  <select
                    name="grado"
                    value={formData.grado}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
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
                    <p className="text-sm" style={{ color: 'var(--danger-red)' }}>
                      {errors.grado}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    Grupo *
                  </label>
                  <select
                    name="grupo"
                    value={formData.grupo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      borderColor: errors.grupo ? 'var(--danger-red)' : 'var(--border-color)'
                    }}
                    required
                  >
                    <option value="">Selecciona el grupo</option>
                    {getGruposPorTurno(formData.turno).map(grupo => (
                      <option key={grupo.value} value={grupo.value}>{grupo.label}</option>
                    ))}
                  </select>
                  {errors.grupo && (
                    <p className="text-sm" style={{ color: 'var(--danger-red)' }}>
                      {errors.grupo}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    Carrera *
                  </label>
                  <select
                    name="carrera"
                    value={formData.carrera}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
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
                    <p className="text-sm" style={{ color: 'var(--danger-red)' }}>
                      {errors.carrera}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <Clock size={18} />
                    Turno *
                  </label>
                  <select
                    name="turno"
                    value={formData.turno}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
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
                    <p className="text-sm" style={{ color: 'var(--danger-red)' }}>
                      {errors.turno}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Comprobante de Pago */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b-2" style={{ borderColor: 'var(--success-green)' }}>
                <Upload className="w-6 h-6" style={{ color: 'var(--success-green)' }} />
                <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Comprobante de Pago
                </h3>
              </div>

              <div className="space-y-4">
                {fileError && (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-600 dark:text-red-400">{fileError}</p>
                  </div>
                )}

                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                    id="fileInput"
                  />
                  <label
                    htmlFor="fileInput"
                    className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 hover:border-green-500 hover:bg-green-50/50 dark:hover:bg-green-900/10"
                    style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-primary)' }}
                  >
                    <Upload size={48} style={{ color: 'var(--success-green)' }} className="mb-4" />
                    <span className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                      {comprobante ? comprobante.name : 'Haz clic o arrastra el archivo aquí'}
                    </span>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      PDF, JPG o PNG (máx. 5MB)
                    </span>
                  </label>
                </div>

                {previewUrl && (
                  <div className="fade-in space-y-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-hover)' }}>
                    {comprobante?.type?.startsWith('image/') ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-w-full max-h-64 mx-auto rounded-lg shadow-md object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-3 p-8">
                        <BookOpen size={64} style={{ color: 'var(--success-green)' }} />
                        <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                          {comprobante?.name}
                        </p>
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={clearFile}
                      className="w-full"
                    >
                      Cambiar archivo
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                loading={isSubmitting}
                icon={<Send size={18} />}
                className="w-full py-4 text-lg font-semibold rounded-xl hover-lift"
                style={{
                  background: isSubmitting
                    ? 'var(--text-tertiary)'
                    : 'linear-gradient(135deg, var(--success-green) 0%, #059669 100%)',
                  color: 'white',
                  border: 'none'
                }}
              >
                {isSubmitting ? 'Enviando Solicitud...' : 'Enviar Solicitud de Reinscripción'}
              </Button>
            </div>

          </form>
        </Card>
      </div>
    </div>
  );
};

export default Reinscripcion;
