import express from 'express';
import { obtenerCarreras, crearCarrera, actualizarCarrera } from '../controllers/carrerasController.js';
import { authenticateToken, requireRole } from '../middlewares/auth.js';

const router = express.Router();

// GET /api/carreras - Listar carreras (público)
router.get('/', obtenerCarreras);

// POST /api/carreras - Crear carrera (solo admins)
router.post('/', authenticateToken, requireRole('admin'), crearCarrera);

// PUT /api/carreras/:id - Actualizar carrera (solo admins)
router.put('/:id', authenticateToken, requireRole('admin'), actualizarCarrera);

export default router;
