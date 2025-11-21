/**
 * Rutas para Alumnos
 */

import express from 'express';
import {
    obtenerAlumnos,
    obtenerAlumnoPorId,
    crearAlumno,
    actualizarAlumno,
    cambiarEstatusAlumno,
    obtenerEstadisticas
} from '../controllers/alumnosController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// GET /api/alumnos/estadisticas - Obtener estadísticas
router.get('/estadisticas', obtenerEstadisticas);

// GET /api/alumnos - Listar todos los alumnos
router.get('/', obtenerAlumnos);

// GET /api/alumnos/:id - Obtener un alumno por ID
router.get('/:id', obtenerAlumnoPorId);

// POST /api/alumnos - Crear nuevo alumno
router.post('/', crearAlumno);

// PUT /api/alumnos/:id - Actualizar alumno
router.put('/:id', actualizarAlumno);

// PATCH /api/alumnos/:id/estatus - Cambiar estatus
router.patch('/:id/estatus', cambiarEstatusAlumno);

export default router;
