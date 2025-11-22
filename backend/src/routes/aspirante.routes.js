/**
 * Rutas para el Portal del Aspirante
 */

import express from 'express';
import { authenticateToken } from '../middlewares/auth.js';
import {
    obtenerEstado,
    obtenerFicha,
    actualizarContacto
} from '../controllers/aspiranteController.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

/**
 * @route   GET /api/aspirante/estado
 * @desc    Obtener estado actual del aspirante
 * @access  Privado (Aspirante)
 */
router.get('/estado', obtenerEstado);

/**
 * @route   GET /api/aspirante/ficha
 * @desc    Obtener información completa de la ficha
 * @access  Privado (Aspirante)
 */
router.get('/ficha', obtenerFicha);

/**
 * @route   PUT /api/aspirante/contacto
 * @desc    Actualizar datos de contacto (teléfono, dirección)
 * @access  Privado (Aspirante)
 */
router.put('/contacto', actualizarContacto);

export default router;
