import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';
import { jwtConfig, hashRounds } from '../config/jwt.js';

export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                error: 'Usuario y contraseña son requeridos'
            });
        }

        // Buscar usuario
        const usuario = await prisma.usuario.findUnique({
            where: { username }
        });

        if (!usuario || !usuario.activo) {
            return res.status(401).json({
                error: 'Credenciales inválidas'
            });
        }

        // Verificar contraseña
        const passwordValida = await bcrypt.compare(password, usuario.passwordHash);

        if (!passwordValida) {
            return res.status(401).json({
                error: 'Credenciales inválidas'
            });
        }

        // Actualizar último acceso
        await prisma.usuario.update({
            where: { id: usuario.id },
            data: { ultimoAcceso: new Date() }
        });

        // Generar JWT
        const token = jwt.sign(
            {
                userId: usuario.id,
                username: usuario.username,
                rol: usuario.rol
            },
            jwtConfig.secret,
            {
                expiresIn: jwtConfig.expiresIn,
                algorithm: jwtConfig.algorithm
            }
        );

        res.json({
            token,
            usuario: {
                id: usuario.id,
                username: usuario.username,
                nombre: usuario.nombre,
                rol: usuario.rol
            }
        });
    } catch (error) {
        next(error);
    }
};

export const verifyToken = async (req, res) => {
    // El middleware authenticateToken ya validó el token
    res.json({ usuario: req.user });
};

export const logout = async (req, res) => {
    // En JWT stateless, el logout se maneja en el cliente
    // Aquí podríamos registrar la acción en auditoría si fuera necesario
    res.json({ message: 'Sesión cerrada exitosamente' });
};
