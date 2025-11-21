import express from 'express';
import { login, verifyToken, logout } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/auth.js';
import { authRateLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

// POST /api/auth/login - Iniciar sesión
router.post('/login', authRateLimiter, login);

// GET /api/auth/verify - Verificar token (requiere autenticación)
router.get('/verify', authenticateToken, verifyToken);

// POST /api/auth/logout - Cerrar sesión
router.post('/logout', authenticateToken, logout);

export default router;
