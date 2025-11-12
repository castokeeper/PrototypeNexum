// Constantes de la aplicación

export const CARRERAS = [
  'Ingeniería en Sistemas',
  'Ingeniería Industrial',
  'Administración',
  'Contaduría',
  'Derecho'
];

export const TURNOS = [
  'Matutino',
  'Vespertino',
  'Nocturno'
];

export const SEMESTRES = [
  { value: '1', label: '1° Semestre' },
  { value: '2', label: '2° Semestre' },
  { value: '3', label: '3° Semestre' },
  { value: '4', label: '4° Semestre' },
  { value: '5', label: '5° Semestre' },
  { value: '6', label: '6° Semestre' },
  { value: '7', label: '7° Semestre' },
  { value: '8', label: '8° Semestre' },
  { value: '9', label: '9° Semestre' }
];

export const GRUPOS = ['A', 'B', 'C', 'D', 'E'];

export const ESTATUS_SOLICITUD = {
  PENDIENTE: 'pendiente',
  APROBADA: 'aprobada',
  RECHAZADA: 'rechazada'
};

export const TIPO_SOLICITUD = {
  NUEVO_INGRESO: 'nuevo-ingreso',
  REINSCRIPCION: 'reinscripcion'
};

export const ROLES = {
  ADMIN: 'admin',
  DIRECTOR: 'director',
  CONTROL_ESCOLAR: 'control'
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

