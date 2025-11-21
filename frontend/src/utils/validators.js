// Validadores de formularios

/**
 * Valida formato de email
 */
export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Valida formato de CURP (18 caracteres alfanuméricos)
 */
export const validarCURP = (curp) => {
  if (!curp || curp.length !== 18) return false;
  const regex = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/;
  return regex.test(curp.toUpperCase());
};

/**
 * Valida formato de teléfono (10 dígitos)
 */
export const validarTelefono = (telefono) => {
  const regex = /^\d{10}$/;
  return regex.test(telefono.replace(/\s/g, ''));
};

/**
 * Valida formato de matrícula
 */
export const validarMatricula = (matricula) => {
  if (!matricula || matricula.length < 4) return false;
  const regex = /^\d{4,10}$/;
  return regex.test(matricula);
};

/**
 * Valida archivo (tipo y tamaño)
 */
export const validarArchivo = (file, maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']) => {
  if (!file) return { valid: false, error: 'No se ha seleccionado ningún archivo' };

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Tipo de archivo no permitido. Solo se aceptan imágenes (JPG, PNG) y PDF'
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `El archivo es demasiado grande. Tamaño máximo: ${(maxSize / (1024 * 1024)).toFixed(1)}MB`
    };
  }

  return { valid: true };
};

/**
 * Valida fecha de nacimiento (mayor de edad)
 */
export const validarFechaNacimiento = (fecha) => {
  if (!fecha) return { valid: false, error: 'Fecha de nacimiento requerida' };

  const fechaNac = new Date(fecha);
  const hoy = new Date();
  const edad = hoy.getFullYear() - fechaNac.getFullYear();
  const m = hoy.getMonth() - fechaNac.getMonth();

  if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) {
    return edad - 1 >= 15 ? { valid: true } : { valid: false, error: 'Debes tener al menos 15 años' };
  }

  return edad >= 15 ? { valid: true } : { valid: false, error: 'Debes tener al menos 15 años' };
};

/**
 * Valida objeto completo de formulario de nuevo ingreso
 */
export const validarFormularioNuevoIngreso = (formData, archivo) => {
  const errores = {};

  // Validar campos obligatorios
  if (!formData.nombre?.trim()) errores.nombre = 'El nombre es obligatorio';
  if (!formData.apellidoPaterno?.trim()) errores.apellidoPaterno = 'El apellido paterno es obligatorio';
  if (!formData.apellidoMaterno?.trim()) errores.apellidoMaterno = 'El apellido materno es obligatorio';

  // Validar edad
  const edad = parseInt(formData.edad);
  if (!formData.edad || isNaN(edad)) {
    errores.edad = 'La edad es obligatoria';
  } else if (edad < 15 || edad > 100) {
    errores.edad = 'La edad debe estar entre 15 y 100 años';
  }

  // Validar email
  if (!validarEmail(formData.email)) {
    errores.email = 'Email inválido';
  }

  // Validar teléfono
  if (!validarTelefono(formData.telefono)) {
    errores.telefono = 'Teléfono inválido (debe tener 10 dígitos)';
  }

  // Validar carrera y turno
  if (!formData.carrera) errores.carrera = 'Selecciona una carrera';
  if (!formData.turno) errores.turno = 'Selecciona un turno';

  // Validar archivo
  const validacionArchivo = validarArchivo(archivo);
  if (!validacionArchivo.valid) {
    errores.archivo = validacionArchivo.error;
  }

  return {
    valido: Object.keys(errores).length === 0,
    errores
  };
};

/**
 * Valida objeto completo de formulario de reinscripción
 */
export const validarFormularioReinscripcion = (formData, archivo) => {
  const errores = {};

  // Validar campos obligatorios
  if (!formData.nombre?.trim()) errores.nombre = 'El nombre es obligatorio';
  if (!formData.apellidoPaterno?.trim()) errores.apellidoPaterno = 'El apellido paterno es obligatorio';
  if (!formData.apellidoMaterno?.trim()) errores.apellidoMaterno = 'El apellido materno es obligatorio';

  // Validar matrícula
  if (!validarMatricula(formData.matricula)) {
    errores.matricula = 'Matrícula inválida';
  }

  // Validar email
  if (!validarEmail(formData.email)) {
    errores.email = 'Email inválido';
  }

  // Validar teléfono
  if (!validarTelefono(formData.telefono)) {
    errores.telefono = 'Teléfono inválido (debe tener 10 dígitos)';
  }

  // Validar datos académicos
  if (!formData.carrera) errores.carrera = 'Selecciona una carrera';
  if (!formData.turno) errores.turno = 'Selecciona un turno';
  if (!formData.grado) errores.grado = 'Selecciona el grado';
  if (!formData.grupo) errores.grupo = 'Selecciona el grupo';

  // Validar archivo
  const validacionArchivo = validarArchivo(archivo);
  if (!validacionArchivo.valid) {
    errores.archivo = validacionArchivo.error;
  }

  return {
    valido: Object.keys(errores).length === 0,
    errores
  };
};

