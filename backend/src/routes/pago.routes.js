/**
 * Rutas de Pagos
 */

import express from 'express';
import {
    crearSesionPago,
    verificarPago,
    webhookStripe,
    obtenerMiHistorial
} from '../controllers/pagoController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// Ruta del webhook (DEBE ser raw body, sin JSON middleware)
// Por eso debe estar ANTES de las demás rutas
router.post('/webhooks/stripe', express.raw({ type: 'application/json' }), webhookStripe);

// Rutas protegidas para usuarios autenticados
router.post('/crear-sesion', authenticateToken, crearSesionPago);
router.get('/verificar/:sessionId', authenticateToken, verificarPago);
router.get('/mi-historial', authenticateToken, obtenerMiHistorial);

export default router;
