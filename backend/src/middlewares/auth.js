import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';
import { jwtConfig } from '../config/jwt.js';

export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, jwtConfig.secret);

        // Verificar que el usuario existe y está activo
        const usuario = await prisma.usuario.findUnique({
            where: { id: decoded.userId },
            select: { id: true, username: true, nombre: true, rol: true, activo: true }
        });

        if (!usuario || !usuario.activo) {
            return res.status(403).json({ error: 'Usuario no autorizado' });
        }

        req.user = usuario;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ error: 'Token inválido' });
        }
        return res.status(500).json({ error: 'Error al verificar token' });
    }
};

export const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'No autenticado' });
        }

        if (!roles.includes(req.user.rol)) {
            return res.status(403).json({
                error: 'No tienes permisos suficientes para realizar esta acción'
            });
        }

        next();
    };
};
