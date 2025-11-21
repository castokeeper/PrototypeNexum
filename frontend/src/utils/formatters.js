// Funciones de formateo

/**
 * Formatea un nombre completo
 */
export const formatearNombreCompleto = (nombre, apellidoPaterno, apellidoMaterno) => {
  return `${nombre} ${apellidoPaterno} ${apellidoMaterno}`.trim();
};

/**
 * Formatea una fecha ISO a formato legible
 */
export const formatearFecha = (fecha) => {
  if (!fecha) return '';
  const date = new Date(fecha);
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Formatea una fecha ISO a formato corto
 */
export const formatearFechaCorta = (fecha) => {
  if (!fecha) return '';
  const date = new Date(fecha);
  return date.toLocaleDateString('es-MX');
};

/**
 * Formatea un teléfono (agrega espacios)
 */
export const formatearTelefono = (telefono) => {
  if (!telefono) return '';
  const cleaned = telefono.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  return telefono;
};

/**
 * Capitaliza la primera letra de cada palabra
 */
export const capitalizarTexto = (texto) => {
  if (!texto) return '';
  return texto
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Formatea el tipo de solicitud para mostrar
 */
export const formatearTipoSolicitud = (tipo) => {
  switch (tipo) {
    case 'nuevo-ingreso':
      return 'Nuevo Ingreso';
    case 'reinscripcion':
      return 'Reinscripción';
    default:
      return tipo;
  }
};

/**
 * Formatea el estatus de solicitud para mostrar
 */
export const formatearEstatus = (estatus) => {
  switch (estatus) {
    case 'pendiente':
      return 'Pendiente';
    case 'aprobada':
      return 'Aprobada';
    case 'rechazada':
      return 'Rechazada';
    default:
      return estatus;
  }
};

/**
 * Obtiene el color según el estatus
 */
export const obtenerColorEstatus = (estatus) => {
  switch (estatus) {
    case 'pendiente':
      return 'var(--warning-orange)';
    case 'aprobada':
      return 'var(--success-green)';
    case 'rechazada':
      return 'var(--danger-red)';
    default:
      return 'var(--text-secondary)';
  }
};

/**
 * Trunca texto largo
 */
export const truncarTexto = (texto, maxLength = 50) => {
  if (!texto || texto.length <= maxLength) return texto;
  return texto.slice(0, maxLength) + '...';
};

/**
 * Formatea el tamaño de archivo
 */
export const formatearTamañoArchivo = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

