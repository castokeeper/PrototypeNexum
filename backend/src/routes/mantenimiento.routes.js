/**
 * Rutas de Mantenimiento
 * Solo accesibles por administradores
 */

import express from 'express';
import {
    obtenerEstadisticas,
    ejecutarLimpieza,
    eliminarUsuarioEspecifico,
    obtenerRechazadosPendientes
} from '../controllers/mantenimientoController.js';
import { authenticateToken, requireRole } from '../middlewares/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación y rol de admin
router.use(authenticateToken);
router.use(requireRole('admin', 'director'));

// GET /api/mantenimiento/estadisticas-rechazados
router.get('/estadisticas-rechazados', obtenerEstadisticas);

// GET /api/mantenimiento/rechazados-pendientes
router.get('/rechazados-pendientes', obtenerRechazadosPendientes);

// POST /api/mantenimiento/ejecutar-limpieza
router.post('/ejecutar-limpieza', ejecutarLimpieza);

// DELETE /api/mantenimiento/eliminar-rechazado/:id
router.delete('/eliminar-rechazado/:id', eliminarUsuarioEspecifico);

export default router;
