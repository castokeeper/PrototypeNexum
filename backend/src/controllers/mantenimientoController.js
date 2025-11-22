/**
 * Controlador de Mantenimiento
 * Endpoints para tareas de mantenimiento y limpieza
 */

import {
    limpiarUsuariosRechazados,
    obtenerEstadisticasRechazados,
    eliminarUsuarioRechazadoManual
} from '../services/cleanupService.js';

/**
 * Obtener estadísticas de usuarios rechazados
 * GET /api/mantenimiento/estadisticas-rechazados
 */
export const obtenerEstadisticas = async (req, res) => {
    try {
        const stats = await obtenerEstadisticasRechazados();

        res.json({
            success: true,
            estadisticas: stats
        });

    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({
            error: 'Error al obtener estadísticas',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Ejecutar limpieza manual
 * POST /api/mantenimiento/ejecutar-limpieza
 */
export const ejecutarLimpieza = async (req, res) => {
    try {
        console.log(`🧹 Limpieza manual iniciada por: ${req.user.nombre} (${req.user.rol})`);

        const resultado = await limpiarUsuariosRechazados();

        res.json({
            success: true,
            ...resultado
        });

    } catch (error) {
        console.error('Error al ejecutar limpieza:', error);
        res.status(500).json({
            error: 'Error al ejecutar la limpieza',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Eliminar usuario rechazado específico
 * DELETE /api/mantenimiento/eliminar-rechazado/:id
 */
export const eliminarUsuarioEspecifico = async (req, res) => {
    try {
        const { id } = req.params;

        console.log(`🗑️  Eliminación manual de usuario ${id} por: ${req.user.nombre}`);

        const resultado = await eliminarUsuarioRechazadoManual(parseInt(id));

        res.json({
            success: true,
            ...resultado
        });

    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(400).json({
            error: error.message || 'Error al eliminar el usuario',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Obtener lista de usuarios rechazados pendientes de eliminación
 * GET /api/mantenimiento/rechazados-pendientes
 */
export const obtenerRechazadosPendientes = async (req, res) => {
    try {
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() - 7);

        const { prisma } = await import('../config/database.js');

        const usuariosPendientes = await prisma.usuario.findMany({
            where: {
                estatus: 'rechazado',
                fechaRechazo: {
                    lte: fechaLimite
                }
            },
            select: {
                id: true,
                nombre: true,
                email: true,
                estatus: true,
                fechaRechazo: true,
                createdAt: true,
                fichaExamen: {
                    select: {
                        folio: true,
                        carrera: {
                            select: {
                                nombre: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                fechaRechazo: 'asc'
            }
        });

        res.json({
            success: true,
            total: usuariosPendientes.length,
            fechaLimite,
            usuarios: usuariosPendientes
        });

    } catch (error) {
        console.error('Error al obtener rechazados pendientes:', error);
        res.status(500).json({
            error: 'Error al obtener la lista',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
