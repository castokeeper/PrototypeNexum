/**
 * Servicio de Limpieza Automática
 * Elimina usuarios rechazados después de 7 días
 */

import { prisma } from '../config/database.js';

/**
 * Eliminar usuarios rechazados que tengan más de 7 días
 */
export const limpiarUsuariosRechazados = async () => {
    try {
        // Calcular la fecha límite (hace 7 días)
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() - 7);

        console.log('🧹 Iniciando limpieza de usuarios rechazados...');
        console.log(`📅 Fecha límite: ${fechaLimite.toISOString()}`);

        // Buscar usuarios rechazados con más de 7 días
        const usuariosRechazados = await prisma.usuario.findMany({
            where: {
                estatus: 'rechazado',
                fechaRechazo: {
                    lte: fechaLimite // Less than or equal (antes o igual a la fecha límite)
                }
            },
            include: {
                fichaExamen: true,
                solicitud: true
            }
        });

        if (usuariosRechazados.length === 0) {
            console.log('✅ No hay usuarios rechazados para eliminar');
            return {
                eliminados: 0,
                mensaje: 'No hay usuarios rechazados para eliminar'
            };
        }

        console.log(`🔍 Encontrados ${usuariosRechazados.length} usuarios para eliminar`);

        let eliminadosExitosamente = 0;
        let errores = 0;

        // Eliminar cada usuario en una transacción
        for (const usuario of usuariosRechazados) {
            try {
                await eliminarUsuarioCompleto(usuario);
                eliminadosExitosamente++;
                console.log(`✓ Eliminado: ${usuario.email} (ID: ${usuario.id})`);
            } catch (error) {
                errores++;
                console.error(`✗ Error al eliminar usuario ${usuario.id}:`, error.message);
            }
        }

        const resultado = {
            total: usuariosRechazados.length,
            eliminados: eliminadosExitosamente,
            errores,
            mensaje: `Limpieza completada: ${eliminadosExitosamente} eliminados, ${errores} errores`
        };

        console.log(`✅ ${resultado.mensaje}`);
        return resultado;

    } catch (error) {
        console.error('❌ Error en limpieza automática:', error);
        throw error;
    }
};

/**
 * Eliminar un usuario y todos sus datos relacionados
 */
async function eliminarUsuarioCompleto(usuario) {
    return await prisma.$transaction(async (tx) => {
        const usuarioId = usuario.id;

        // 1. Eliminar documentos si existen
        if (usuario.solicitud && usuario.solicitud.length > 0) {
            for (const solicitud of usuario.solicitud) {
                await tx.documento.deleteMany({
                    where: { solicitudId: solicitud.id }
                });
            }
        }

        // 2. Eliminar pagos
        await tx.pago.deleteMany({
            where: { usuarioId }
        });

        // 3. Eliminar solicitudes
        await tx.solicitud.deleteMany({
            where: { usuarioId }
        });

        // 4. Eliminar de lista de espera
        if (usuario.fichaExamen) {
            await tx.listaEspera.deleteMany({
                where: { fichaExamenId: usuario.fichaExamen.id }
            });
        }

        // 5. Eliminar ficha de examen
        if (usuario.fichaExamen) {
            await tx.fichaExamen.delete({
                where: { id: usuario.fichaExamen.id }
            });
        }

        // 6. Eliminar auditorías relacionadas
        await tx.auditoria.deleteMany({
            where: { usuarioId }
        });

        // 7. Finalmente, eliminar el usuario
        await tx.usuario.delete({
            where: { id: usuarioId }
        });

        return true;
    });
}

/**
 * Obtener estadísticas de usuarios rechazados
 */
export const obtenerEstadisticasRechazados = async () => {
    try {
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() - 7);

        const [totalRechazados, pendientesEliminacion, recientes] = await Promise.all([
            // Total de usuarios rechazados
            prisma.usuario.count({
                where: { estatus: 'rechazado' }
            }),

            // Rechazados con más de 7 días (pendientes de eliminación)
            prisma.usuario.count({
                where: {
                    estatus: 'rechazado',
                    fechaRechazo: { lte: fechaLimite }
                }
            }),

            // Rechazados en los últimos 7 días
            prisma.usuario.count({
                where: {
                    estatus: 'rechazado',
                    fechaRechazo: { gt: fechaLimite }
                }
            })
        ]);

        return {
            totalRechazados,
            pendientesEliminacion,
            recientes,
            fechaLimite: fechaLimite.toISOString()
        };

    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        throw error;
    }
};

/**
 * Eliminar manualmente un usuario rechazado (endpoint para admins)
 */
export const eliminarUsuarioRechazadoManual = async (usuarioId) => {
    try {
        const usuario = await prisma.usuario.findUnique({
            where: { id: usuarioId },
            include: {
                fichaExamen: true,
                solicitud: true
            }
        });

        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }

        if (usuario.estatus !== 'rechazado') {
            throw new Error('Solo se pueden eliminar usuarios rechazados');
        }

        await eliminarUsuarioCompleto(usuario);

        return {
            success: true,
            mensaje: `Usuario ${usuario.email} eliminado exitosamente`
        };

    } catch (error) {
        console.error('Error al eliminar usuario manual:', error);
        throw error;
    }
};

export default {
    limpiarUsuariosRechazados,
    obtenerEstadisticasRechazados,
    eliminarUsuarioRechazadoManual
};
