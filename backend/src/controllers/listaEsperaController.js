/**
 * Controlador para Lista de Espera
 */

import { prisma } from '../config/database.js';

/**
 * Obtener lista de espera
 * GET /api/lista-espera
 */
export const obtenerListaEspera = async (req, res) => {
    try {
        const { estado, carreraId, limit = 50 } = req.query;

        const where = {};
        if (estado) where.estadoActual = estado;

        const listaEspera = await prisma.listaEspera.findMany({
            where,
            include: {
                ficha: {
                    include: {
                        carrera: true
                    },
                    where: carreraId ? { carreraId: parseInt(carreraId) } : undefined
                }
            },
            orderBy: { posicion: 'asc' },
            take: parseInt(limit)
        });

        res.json({
            total: listaEspera.length,
            aspirantes: listaEspera.map(item => ({
                id: item.id,
                posicion: item.posicion,
                folio: item.ficha.folio,
                nombre: `${item.ficha.nombre} ${item.ficha.apellidoPaterno} ${item.ficha.apellidoMaterno}`,
                curp: item.ficha.curp,
                email: item.ficha.email,
                telefono: item.ficha.telefono,
                carrera: item.ficha.carrera.nombre,
                turnoPreferido: item.ficha.turnoPreferido,
                estadoFicha: item.ficha.estatus,
                estadoEspera: item.estadoActual,
                calificacion: item.ficha.calificacion,
                aprobado: item.ficha.aprobado,
                fechaExamen: item.ficha.fechaExamen,
                fechaIngreso: item.fechaIngreso,
                fechaAceptacion: item.fechaAceptacion,
                fechaRechazo: item.fechaRechazo,
                observaciones: item.observaciones
            }))
        });
    } catch (error) {
        console.error('Error al obtener lista de espera:', error);
        res.status(500).json({
            error: 'Error al obtener la lista de espera'
        });
    }
};

/**
 * Aceptar aspirante
 * POST /api/lista-espera/:id/aceptar
 * 
 * FLUJO:
 * 1. Cambiar estatus de Usuario a 'pendiente_formulario'
 * 2. Actualizar ListaEspera a 'aceptado'
 * 3. Actualizar FichaExamen a 'aprobado'
 * 
 * El aspirante ahora puede llenar el formulario de inscripción
 * El alumno se creará DESPUÉS del pago exitoso
 */
export const aceptarAspirante = async (req, res) => {
    try {
        const { id } = req.params;
        const { observaciones } = req.body;

        // Obtener item de lista de espera con ficha y usuario
        const itemEspera = await prisma.listaEspera.findUnique({
            where: { id: parseInt(id) },
            include: {
                ficha: {
                    include: {
                        carrera: true,
                        usuario: true  // ⭐ Incluir usuario
                    }
                }
            }
        });

        if (!itemEspera) {
            return res.status(404).json({
                error: 'Ítem de lista de espera no encontrado'
            });
        }

        if (itemEspera.estadoActual !== 'en_espera') {
            return res.status(400).json({
                error: `Este aspirante ya fue ${itemEspera.estadoActual}`
            });
        }

        const ficha = itemEspera.ficha;

        if (!ficha.usuario) {
            return res.status(400).json({
                error: 'Esta ficha no tiene un usuario asociado'
            });
        }

        // TRANSACCIÓN: Actualizar todo de forma consistente
        await prisma.$transaction(async (tx) => {
            // 1. Actualizar Usuario: ya no está en revisión, puede llenar formulario
            await tx.usuario.update({
                where: { id: ficha.usuario.id },
                data: {
                    estatus: 'pendiente_formulario'  // ⭐ NUEVO ESTATUS
                }
            });

            // 2. Actualizar ListaEspera
            await tx.listaEspera.update({
                where: { id: parseInt(id) },
                data: {
                    estadoActual: 'aceptado',
                    fechaAceptacion: new Date(),
                    observaciones
                }
            });

            // 3. Actualizar FichaExamen
            await tx.fichaExamen.update({
                where: { id: ficha.id },
                data: {
                    estatus: 'aprobado'
                }
            });
        });

        // TODO: Enviar email de aceptación
        // await enviarEmailAceptacion(ficha.email, ficha.usuario.username);

        res.json({
            success: true,
            message: 'Aspirante aceptado. Ahora puede llenar el formulario de inscripción.',
            aspirante: {
                nombre: `${ficha.nombre} ${ficha.apellidoPaterno} ${ficha.apellidoMaterno}`,
                email: ficha.email,
                folio: ficha.folio,
                carrera: ficha.carrera.nombre,
                proximoPaso: 'Llenar formulario de inscripción'
            }
        });
    } catch (error) {
        console.error('Error al aceptar aspirante:', error);
        res.status(500).json({
            error: 'Error al aceptar el aspirante',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Rechazar aspirante
 * POST /api/lista-espera/:id/rechazar
 * 
 * FLUJO:
 * 1. Marcar Usuario como rechazado (NO eliminar todavía)
 * 2. Registrar fechaRechazo (para el cron job de 7 días)
 * 3. Desactivar usuario
 * 4. Actualizar ListaEspera
 * 5. Actualizar FichaExamen
 * 
 * El usuario se eliminará automáticamente después de 7 días (cron job)
 */
export const rechazarAspirante = async (req, res) => {
    try {
        const { id } = req.params;
        const { motivo } = req.body;

        const itemEspera = await prisma.listaEspera.findUnique({
            where: { id: parseInt(id) },
            include: {
                ficha: {
                    include: {
                        usuario: true
                    }
                }
            }
        });

        if (!itemEspera) {
            return res.status(404).json({
                error: 'Ítem de lista de espera no encontrado'
            });
        }

        if (itemEspera.estadoActual !== 'en_espera') {
            return res.status(400).json({
                error: `Este aspirante ya fue ${itemEspera.estadoActual}`
            });
        }

        const ficha = itemEspera.ficha;

        if (!ficha.usuario) {
            return res.status(400).json({
                error: 'Esta ficha no tiene un usuario asociado'
            });
        }

        // TRANSACCIÓN: Marcar como rechazado (no eliminar todavía)
        await prisma.$transaction(async (tx) => {
            // 1. Marcar usuario como rechazado y desactivado
            await tx.usuario.update({
                where: { id: ficha.usuario.id },
                data: {
                    estatus: 'rechazado',
                    activo: false,  // No puede hacer login
                    fechaRechazo: new Date()  // ⭐ Para el cron de 7 días
                }
            });

            // 2. Actualizar lista de espera
            await tx.listaEspera.update({
                where: { id: parseInt(id) },
                data: {
                    estadoActual: 'rechazado',
                    fechaRechazo: new Date(),
                    observaciones: motivo
                }
            });

            // 3. Actualizar ficha
            await tx.fichaExamen.update({
                where: { id: itemEspera.fichaId },
                data: {
                    estatus: 'rechazado',
                    aprobado: false
                }
            });
        });

        // TODO: Enviar email con el motivo del rechazo
        // await enviarEmailRechazo(ficha.email, motivo);

        res.json({
            success: true,
            message: 'Aspirante rechazado correctamente',
            info: 'El usuario será eliminado automáticamente después de 7 días'
        });
    } catch (error) {
        console.error('Error al rechazar aspirante:', error);
        res.status(500).json({
            error: 'Error al rechazar el aspirante',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Actualizar observaciones
 * PUT /api/lista-espera/:id/observaciones
 */
export const actualizarObservaciones = async (req, res) => {
    try {
        const { id } = req.params;
        const { observaciones } = req.body;

        const actualizado = await prisma.listaEspera.update({
            where: { id: parseInt(id) },
            data: { observaciones }
        });

        res.json({
            success: true,
            message: 'Observaciones actualizadas',
            observaciones: actualizado.observaciones
        });
    } catch (error) {
        console.error('Error al actualizar observaciones:', error);
        res.status(500).json({
            error: 'Error al actualizar las observaciones'
        });
    }
};
