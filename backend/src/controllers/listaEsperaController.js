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
 * Aceptar aspirante y crear alumno
 * POST /api/lista-espera/:id/aceptar
 */
export const aceptarAspirante = async (req, res) => {
    try {
        const { id } = req.params;
        const { observaciones } = req.body;

        const itemEspera = await prisma.listaEspera.findUnique({
            where: { id: parseInt(id) },
            include: {
                ficha: {
                    include: {
                        carrera: true
                    }
                }
            }
        });

        if (!itemEspera) {
            return res.status(404).json({
                error: 'Ítem de lista de espera no encontrado'
            });
        }

        const ficha = itemEspera.ficha;

        // Verificar que el aspirante aprobó el examen
        if (!ficha.aprobado) {
            return res.status(400).json({
                error: 'El aspirante no ha aprobado el examen'
            });
        }

        // Verificar si ya existe un alumno con este CURP
        const alumnoExistente = await prisma.alumno.findUnique({
            where: { curp: ficha.curp }
        });

        if (alumnoExistente) {
            return res.status(400).json({
                error: 'Ya existe un alumno registrado con este CURP'
            });
        }

        // Crear alumno en una transacción
        const result = await prisma.$transaction(async (tx) => {
            // Crear el alumno
            const nuevoAlumno = await tx.alumno.create({
                data: {
                    fichaExamenId: ficha.id,
                    nombre: ficha.nombre,
                    apellidoPaterno: ficha.apellidoPaterno,
                    apellidoMaterno: ficha.apellidoMaterno,
                    curp: ficha.curp,
                    fechaNacimiento: ficha.fechaNacimiento,
                    telefono: ficha.telefono,
                    email: ficha.email,
                    direccion: ficha.direccion,
                    semestreActual: 1,
                    estatusAlumno: 'activo'
                }
            });

            // Actualizar lista de espera
            await tx.listaEspera.update({
                where: { id: parseInt(id) },
                data: {
                    estadoActual: 'aceptado',
                    fechaAceptacion: new Date(),
                    observaciones
                }
            });

            // Actualizar ficha
            await tx.fichaExamen.update({
                where: { id: ficha.id },
                data: {
                    estatus: 'aprobado'
                }
            });

            return nuevoAlumno;
        });

        res.json({
            success: true,
            message: 'Aspirante aceptado y alumno creado exitosamente',
            alumno: {
                id: result.id,
                nombre: `${result.nombre} ${result.apellidoPaterno} ${result.apellidoMaterno}`,
                curp: result.curp,
                semestreActual: result.semestreActual,
                estatus: result.estatusAlumno
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
 */
export const rechazarAspirante = async (req, res) => {
    try {
        const { id } = req.params;
        const { motivo } = req.body;

        const itemEspera = await prisma.listaEspera.findUnique({
            where: { id: parseInt(id) },
            include: {
                ficha: true
            }
        });

        if (!itemEspera) {
            return res.status(404).json({
                error: 'Ítem de lista de espera no encontrado'
            });
        }

        // Actualizar en una transacción
        await prisma.$transaction(async (tx) => {
            // Actualizar lista de espera
            await tx.listaEspera.update({
                where: { id: parseInt(id) },
                data: {
                    estadoActual: 'rechazado',
                    fechaRechazo: new Date(),
                    observaciones: motivo
                }
            });

            // Actualizar ficha
            await tx.fichaExamen.update({
                where: { id: itemEspera.fichaId },
                data: {
                    estatus: 'rechazado',
                    aprobado: false
                }
            });
        });

        res.json({
            success: true,
            message: 'Aspirante rechazado correctamente'
        });
    } catch (error) {
        console.error('Error al rechazar aspirante:', error);
        res.status(500).json({
            error: 'Error al rechazar el aspirante'
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
