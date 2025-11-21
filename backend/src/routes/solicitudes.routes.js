import express from 'express';
import {
    crearSolicitud,
    obtenerSolicitudes,
    obtenerSolicitudPorId,
    aprobarSolicitud,
    rechazarSolicitud,
    obtenerAceptados,
    obtenerEstadisticas
} from '../controllers/solicitudesController.js';
import { authenticateToken, requireRole } from '../middlewares/auth.js';

const router = express.Router();

// POST /api/solicitudes - Crear nueva solicitud (público)
router.post('/', crearSolicitud);

// GET /api/solicitudes/aceptados - Ver alumnos aceptados (público)
router.get('/aceptados', obtenerAceptados);

// GET /api/solicitudes/estadisticas - Ver estadísticas (solo admins)
router.get('/estadisticas', authenticateToken, requireRole('admin', 'director', 'control_escolar'), obtenerEstadisticas);

// GET /api/solicitudes - Listar solicitudes (solo admins)
router.get('/', authenticateToken, requireRole('admin', 'director', 'control_escolar'), obtenerSolicitudes);

// GET /api/solicitudes/:id - Ver solicitud específica (solo admins)
router.get('/:id', authenticateToken, requireRole('admin', 'director', 'control_escolar'), obtenerSolicitudPorId);

// PUT /api/solicitudes/:id/aprobar - Aprobar solicitud (solo admins)
router.put('/:id/aprobar', authenticateToken, requireRole('admin', 'director', 'control_escolar'), aprobarSolicitud);

// PUT /api/solicitudes/:id/rechazar - Rechazar solicitud (solo admins)
router.put('/:id/rechazar', authenticateToken, requireRole('admin', 'director', 'control_escolar'), rechazarSolicitud);

export default router;
