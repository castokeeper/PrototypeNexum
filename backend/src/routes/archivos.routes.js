import express from 'express';
import { uploadComprobante, obtenerArchivo, eliminarArchivo } from '../controllers/archivosController.js';
import { upload } from '../config/multer.js';
import { authenticateToken, requireRole } from '../middlewares/auth.js';

const router = express.Router();

// POST /api/archivos/upload - Subir comprobante (público)
router.post('/upload', upload.single('comprobante'), uploadComprobante);

// GET /api/archivos/:id - Obtener archivo (requiere autenticación)
router.get('/:id', authenticateToken, obtenerArchivo);

// DELETE /api/archivos/:id - Eliminar archivo (solo admins)
router.delete('/:id', authenticateToken, requireRole('admin'), eliminarArchivo);

export default router;
