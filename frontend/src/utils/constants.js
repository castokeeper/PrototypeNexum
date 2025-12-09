// Constantes de la aplicación - CETis 120

// Carreras técnicas del CETis 120 (Oferta educativa 2024-2025)
// Formato: { value: código, label: nombre completo }
export const CARRERAS = [
  { value: 'ARH', label: 'Técnico en Administración de Recursos Humanos' },
  { value: 'CIB', label: 'Técnico en Ciberseguridad' },
  { value: 'CON', label: 'Técnico en Contabilidad' },
  { value: 'ELE', label: 'Técnico en Electrónica' },
  { value: 'IA', label: 'Técnico en Inteligencia Artificial' },
  { value: 'OFI', label: 'Técnico en Ofimática' },
  { value: 'PRO', label: 'Técnico en Programación' },
  { value: 'PUE', label: 'Técnico en Puericultura' },
  { value: 'SHO', label: 'Técnico en Servicios de Hospedaje' },
  { value: 'SMC', label: 'Técnico en Soporte y Mantenimiento de Equipo de Cómputo' },
  { value: 'VEN', label: 'Técnico en Ventas' }
];

// Turnos disponibles en el CETis 120
export const TURNOS = [
  { value: 'matutino', label: 'Matutino' },
  { value: 'vespertino', label: 'Vespertino' }
];

// Semestres del bachillerato técnico (6 semestres)
export const SEMESTRES = [
  { value: '1', label: '1° Semestre' },
  { value: '2', label: '2° Semestre' },
  { value: '3', label: '3° Semestre' },
  { value: '4', label: '4° Semestre' },
  { value: '5', label: '5° Semestre' },
  { value: '6', label: '6° Semestre' }
];

// Grupos disponibles (mismos para ambos turnos)
export const GRUPOS_POR_TURNO = {
  matutino: [
    { value: 'A', label: 'Grupo A' },
    { value: 'B', label: 'Grupo B' },
    { value: 'C', label: 'Grupo C' },
    { value: 'D', label: 'Grupo D' },
    { value: 'E', label: 'Grupo E' },
    { value: 'F', label: 'Grupo F' }
  ],
  vespertino: [
    { value: 'A', label: 'Grupo A' },
    { value: 'B', label: 'Grupo B' },
    { value: 'C', label: 'Grupo C' },
    { value: 'D', label: 'Grupo D' },
    { value: 'E', label: 'Grupo E' },
    { value: 'F', label: 'Grupo F' }
  ]
};

// Todos los grupos (A-F para ambos turnos)
export const GRUPOS = [
  { value: 'A', label: 'Grupo A' },
  { value: 'B', label: 'Grupo B' },
  { value: 'C', label: 'Grupo C' },
  { value: 'D', label: 'Grupo D' },
  { value: 'E', label: 'Grupo E' },
  { value: 'F', label: 'Grupo F' }
];

// Estatus de solicitud
export const ESTATUS_SOLICITUD = {
  PENDIENTE: 'pendiente',
  APROBADA: 'aprobada',
  RECHAZADA: 'rechazada',
  EN_LISTA_ESPERA: 'en_lista_espera',
  ACEPTADO: 'aceptado'
};

// Tipo de solicitud
export const TIPO_SOLICITUD = {
  NUEVO_INGRESO: 'nuevo-ingreso',
  REINSCRIPCION: 'reinscripcion',
  FICHA_EXAMEN: 'ficha-examen'
};

// Roles del sistema
export const ROLES = {
  ADMIN: 'admin',
  DIRECTOR: 'director',
  CONTROL_ESCOLAR: 'control_escolar',
  ASPIRANTE: 'aspirante'
};

// Configuración de archivos
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

// Información del plantel
export const INFO_PLANTEL = {
  nombre: 'CETis 120',
  nombreCompleto: 'Centro de Estudios Tecnológicos Industrial y de Servicios No. 120',
  direccion: 'Dirección del plantel',
  telefono: '(000) 000-0000',
  email: 'contacto@cetis120.edu.mx'
};

// Ciclo escolar
export const CICLO_ESCOLAR = {
  actual: '2024-2025',
  siguiente: '2025-2026'
};

// Función helper para obtener grupos por turno seleccionado
export const getGruposPorTurno = (turno) => {
  if (!turno) return GRUPOS;
  return GRUPOS_POR_TURNO[turno.toLowerCase()] || GRUPOS;
};
