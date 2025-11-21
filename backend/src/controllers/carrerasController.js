import { prisma } from '../config/database.js';

export const obtenerCarreras = async (req, res, next) => {
    try {
        const { activa } = req.query;

        const where = {};
        if (activa !== undefined) {
            where.activa = activa === 'true';
        }

        const carreras = await prisma.carrera.findMany({
            where,
            orderBy: { nombre: 'asc' }
        });

        res.json(carreras);
    } catch (error) {
        next(error);
    }
};

export const crearCarrera = async (req, res, next) => {
    try {
        const { nombre, codigo } = req.body;

        if (!nombre) {
            return res.status(400).json({ error: 'El nombre de la carrera es requerido' });
        }

        const carrera = await prisma.carrera.create({
            data: {
                nombre,
                codigo: codigo || null
            }
        });

        res.status(201).json({
            message: 'Carrera creada exitosamente',
            carrera
        });
    } catch (error) {
        next(error);
    }
};

export const actualizarCarrera = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nombre, codigo, activa } = req.body;

        const carrera = await prisma.carrera.update({
            where: { id: parseInt(id) },
            data: {
                ...(nombre && { nombre }),
                ...(codigo !== undefined && { codigo }),
                ...(activa !== undefined && { activa })
            }
        });

        res.json({
            message: 'Carrera actualizada exitosamente',
            carrera
        });
    } catch (error) {
        next(error);
    }
};
