/**
 * Generador de folios únicos para fichas de examen
 * Formato: FE-YYYY-NNNN
 * Ejemplo: FE-2024-0001
 */

import { prisma } from '../config/database.js';

/**
 * Genera un folio único para ficha de examen
 * @returns {Promise<string>} Folio en formato FE-YYYY-NNNN
 */
export const generarFolio = async () => {
    const año = new Date().getFullYear();
    const prefijo = `FE-${año}-`;

    try {
        // Obtener la última ficha del año actual
        const ultimaFicha = await prisma.fichaExamen.findFirst({
            where: {
                folio: {
                    startsWith: prefijo
                }
            },
            orderBy: {
                id: 'desc'
            }
        });

        let numero = 1;

        if (ultimaFicha) {
            // Extraer el número del folio anterior
            const partes = ultimaFicha.folio.split('-');
            numero = parseInt(partes[2]) + 1;
        }

        // Generar folio con padding de 4 dígitos
        const folio = `${prefijo}${numero.toString().padStart(4, '0')}`;

        return folio;
    } catch (error) {
        console.error('Error generando folio:', error);
        throw new Error('No se pudo generar el folio');
    }
};

/**
 * Valida formato de folio
 * @param {string} folio - Folio a validar
 * @returns {boolean} True si el formato es válido
 */
export const validarFormatoFolio = (folio) => {
    const regex = /^FE-\d{4}-\d{4}$/;
    return regex.test(folio);
};

/**
 * Verifica si un folio existe
 * @param {string} folio - Folio a verificar
 * @returns {Promise<boolean>} True si existe
 */
export const folioExiste = async (folio) => {
    const ficha = await prisma.fichaExamen.findUnique({
        where: { folio }
    });
    return !!ficha;
};
