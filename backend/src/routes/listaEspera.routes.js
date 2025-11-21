/**
 * Rutas para Lista de Espera
 */

import express from 'express';
import { body, param } from 'express-validator';
import {
    obtenerListaEspera,
    aceptarAspirante,
    rechazarAspirante,
    actualizarObservaciones
} from '../controllers/listaEsperaController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// Validaciones
const aceptarRechazarValidation = [
    param('id').isInt({ min: 1 }).withMessage('ID inválido')
];

const observacionesValidation = [
    param('id').isInt({ min: 1 }).withMessage('ID inválido'),
    body('observaciones').optional().trim()
];

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas
router.get('/', obtenerListaEspera);
router.post('/:id/aceptar', aceptarRechazarValidation, aceptarAspirante);
router.post('/:id/rechazar', aceptarRechazarValidation, rechazarAspirante);
router.put('/:id/observaciones', observacionesValidation, actualizarObservaciones);

export default router;
