/**
 * Generador de contraseñas seguras
 */

import crypto from 'crypto';

/**
 * Genera una contraseña aleatoria segura
 * @param {number} length - Longitud de la contraseña (por defecto 12)
 * @returns {string} Contraseña generada
 */
export const generarPassword = (length = 12) => {
    // Caracteres sin ambigüedades (sin 0, O, l, 1, I)
    const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$%&';
    let password = '';

    // Asegurar al menos un carácter de cada tipo
    const mayusculas = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const minusculas = 'abcdefghjkmnpqrstuvwxyz';
    const numeros = '23456789';
    const especiales = '@#$%&';

    // Agregar al menos uno de cada tipo
    password += mayusculas[crypto.randomInt(0, mayusculas.length)];
    password += minusculas[crypto.randomInt(0, minusculas.length)];
    password += numeros[crypto.randomInt(0, numeros.length)];
    password += especiales[crypto.randomInt(0, especiales.length)];

    // Llenar el resto de la longitud
    for (let i = password.length; i < length; i++) {
        const randomIndex = crypto.randomInt(0, charset.length);
        password += charset[randomIndex];
    }

    // Mezclar los caracteres
    return password.split('').sort(() => crypto.randomInt(0, 2) - 0.5).join('');
};

/**
 * Genera un número de control único para un alumno
 * Formato: AAMMNNNN (Año, Mes, Número secuencial)
 * Ejemplo: 25110001
 */
export const generarNumeroControl = async (prisma) => {
    const fecha = new Date();
    const anio = fecha.getFullYear().toString().slice(-2);
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');

    // Obtener el último número de control del mes actual
    const prefijo = `${anio}${mes}`;

    const ultimoAlumno = await prisma.alumno.findFirst({
        where: {
            numeroControl: {
                startsWith: prefijo
            }
        },
        orderBy: {
            numeroControl: 'desc'
        }
    });

    let numeroSecuencial = 1;

    if (ultimoAlumno) {
        // Extraer el número secuencial y sumar 1
        const ultimoNumero = parseInt(ultimoAlumno.numeroControl.slice(-4));
        numeroSecuencial = ultimoNumero + 1;
    }

    const numeroControl = `${prefijo}${numeroSecuencial.toString().padStart(4, '0')}`;

    return numeroControl;
};

/**
 * Valida que una contraseña cumpla con los requisitos mínimos
 * @param {string} password - Contraseña a validar
 * @returns {Object} { valida: boolean, errores: string[] }
 */
export const validarPassword = (password) => {
    const errores = [];

    if (password.length < 8) {
        errores.push('Debe tener al menos 8 caracteres');
    }

    if (!/[A-Z]/.test(password)) {
        errores.push('Debe tener al menos una mayúscula');
    }

    if (!/[a-z]/.test(password)) {
        errores.push('Debe tener al menos una minúscula');
    }

    if (!/[0-9]/.test(password)) {
        errores.push('Debe tener al menos un número');
    }

    if (!/[@#$%&!*]/.test(password)) {
        errores.push('Debe tener al menos un carácter especial (@#$%&!*)');
    }

    return {
        valida: errores.length === 0,
        errores
    };
};
