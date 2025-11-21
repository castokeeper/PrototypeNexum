/**
 * Controlador para Alumnos
 * Gestiona los alumnos aceptados y su información académica
 */

import { prisma } from '../config/database.js';

/**
 * Obtener todos los alumnos
 * GET /api/alumnos
 */
export const obtenerAlumnos = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            carreraId,
            estatus,
            search
        } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Construir filtros
        const where = {};

        if (carreraId) {
            where.carreraId = parseInt(carreraId);
        }

        if (estatus) {
            where.estatus = estatus;
        }

        if (search) {
            where.OR = [
                { numeroControl: { contains: search, mode: 'insensitive' } },
                { nombre: { contains: search, mode: 'insensitive' } },
                { apellidoPaterno: { contains: search, mode: 'insensitive' } },
                { apellidoMaterno: { contains: search, mode: 'insensitive' } },
                { curp: { contains: search, mode: 'insensitive' } }
            ];
        }

        const [alumnos, total] = await Promise.all([
            prisma.alumno.findMany({
                where,
                include: {
                    carrera: true,
                    solicitud: {
                        select: {
                            id: true,
                            folio: true,
                            estatusPago: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: parseInt(limit)
            }),
            prisma.alumno.count({ where })
        ]);

        res.json({
            alumnos: alumnos.map(a => ({
                id: a.id,
                numeroControl: a.numeroControl,
                nombre: `${a.nombre} ${a.apellidoPaterno} ${a.apellidoMaterno}`,
                nombreCompleto: {
                    nombre: a.nombre,
                    apellidoPaterno: a.apellidoPaterno,
                    apellidoMaterno: a.apellidoMaterno
                },
                curp: a.curp,
                email: a.email,
                telefono: a.telefono,
                carrera: a.carrera.nombre,
                carreraId: a.carreraId,
                semestre: a.semestre,
                estatus: a.estatus,
                promedio: a.promedio,
                creditosAcumulados: a.creditosAcumulados,
                fechaIngreso: a.fechaIngreso,
                solicitudId: a.solicitud?.id,
                folio: a.solicitud?.folio,
                estatusPago: a.solicitud?.estatusPago,
                createdAt: a.createdAt
            })),
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Error al obtener alumnos:', error);
        res.status(500).json({
            error: 'Error al obtener la lista de alumnos',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Obtener un alumno por ID
 * GET /api/alumnos/:id
 */
export const obtenerAlumnoPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const alumno = await prisma.alumno.findUnique({
            where: { id: parseInt(id) },
            include: {
                carrera: true,
                solicitud: {
                    include: {
                        documentos: true
                    }
                }
            }
        });

        if (!alumno) {
            return res.status(404).json({
                error: 'Alumno no encontrado'
            });
        }

        res.json({
            id: alumno.id,
            numeroControl: alumno.numeroControl,
            nombre: alumno.nombre,
            apellidoPaterno: alumno.apellidoPaterno,
            apellidoMaterno: alumno.apellidoMaterno,
            curp: alumno.curp,
            fechaNacimiento: alumno.fechaNacimiento,
            genero: alumno.genero,
            email: alumno.email,
            telefono: alumno.telefono,
            direccion: alumno.direccion,
            carrera: {
                id: alumno.carrera.id,
                nombre: alumno.carrera.nombre,
                codigo: alumno.carrera.codigo
            },
            semestre: alumno.semestre,
            estatus: alumno.estatus,
            promedio: alumno.promedio,
            creditosAcumulados: alumno.creditosAcumulados,
            fechaIngreso: alumno.fechaIngreso,
            fechaEgreso: alumno.fechaEgreso,
            solicitud: alumno.solicitud ? {
                id: alumno.solicitud.id,
                folio: alumno.solicitud.folio,
                estatusPago: alumno.solicitud.estatusPago,
                documentos: alumno.solicitud.documentos
            } : null,
            createdAt: alumno.createdAt,
            updatedAt: alumno.updatedAt
        });
    } catch (error) {
        console.error('Error al obtener alumno:', error);
        res.status(500).json({
            error: 'Error al obtener la información del alumno'
        });
    }
};

/**
 * Crear nuevo alumno (desde solicitud aceptada)
 * POST /api/alumnos
 */
export const crearAlumno = async (req, res) => {
    try {
        const {
            solicitudId,
            numeroControl,
            nombre,
            apellidoPaterno,
            apellidoMaterno,
            curp,
            fechaNacimiento,
            genero,
            email,
            telefono,
            direccion,
            carreraId,
            semestre = 1
        } = req.body;

        // Verificar que la solicitud existe y está aceptada
        if (solicitudId) {
            const solicitud = await prisma.solicitud.findUnique({
                where: { id: parseInt(solicitudId) }
            });

            if (!solicitud) {
                return res.status(404).json({
                    error: 'Solicitud no encontrada'
                });
            }

            if (solicitud.estatus !== 'aceptada') {
                return res.status(400).json({
                    error: 'La solicitud debe estar aceptada para crear un alumno'
                });
            }

            // Verificar que no exista ya un alumno con esta solicitud
            const alumnoExistente = await prisma.alumno.findUnique({
                where: { solicitudId: parseInt(solicitudId) }
            });

            if (alumnoExistente) {
                return res.status(400).json({
                    error: 'Ya existe un alumno registrado con esta solicitud'
                });
            }
        }

        // Verificar que el número de control no exista
        if (numeroControl) {
            const controlExistente = await prisma.alumno.findUnique({
                where: { numeroControl }
            });

            if (controlExistente) {
                return res.status(400).json({
                    error: 'El número de control ya está registrado'
                });
            }
        }

        // Verificar que el CURP no exista
        const curpExistente = await prisma.alumno.findUnique({
            where: { curp: curp.toUpperCase() }
        });

        if (curpExistente) {
            return res.status(400).json({
                error: 'El CURP ya está registrado'
            });
        }

        // Crear alumno
        const alumno = await prisma.alumno.create({
            data: {
                solicitudId: solicitudId ? parseInt(solicitudId) : undefined,
                numeroControl: numeroControl || `TEMP-${Date.now()}`,
                nombre,
                apellidoPaterno,
                apellidoMaterno,
                curp: curp.toUpperCase(),
                fechaNacimiento: new Date(fechaNacimiento),
                genero,
                email: email.toLowerCase(),
                telefono,
                direccion,
                carreraId: parseInt(carreraId),
                semestre: parseInt(semestre),
                estatus: 'activo',
                fechaIngreso: new Date()
            },
            include: {
                carrera: true,
                solicitud: true
            }
        });

        res.status(201).json({
            success: true,
            message: 'Alumno registrado exitosamente',
            alumno: {
                id: alumno.id,
                numeroControl: alumno.numeroControl,
                nombre: `${alumno.nombre} ${alumno.apellidoPaterno} ${alumno.apellidoMaterno}`,
                carrera: alumno.carrera.nombre,
                estatus: alumno.estatus
            }
        });
    } catch (error) {
        console.error('Error al crear alumno:', error);
        res.status(500).json({
            error: 'Error al registrar el alumno',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Actualizar información de alumno
 * PUT /api/alumnos/:id
 */
export const actualizarAlumno = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            numeroControl,
            email,
            telefono,
            direccion,
            semestre,
            estatus,
            promedio,
            creditosAcumulados
        } = req.body;

        const alumno = await prisma.alumno.findUnique({
            where: { id: parseInt(id) }
        });

        if (!alumno) {
            return res.status(404).json({
                error: 'Alumno no encontrado'
            });
        }

        // Si se cambia el número de control, verificar que no exista
        if (numeroControl && numeroControl !== alumno.numeroControl) {
            const controlExistente = await prisma.alumno.findUnique({
                where: { numeroControl }
            });

            if (controlExistente) {
                return res.status(400).json({
                    error: 'El número de control ya está registrado'
                });
            }
        }

        const alumnoActualizado = await prisma.alumno.update({
            where: { id: parseInt(id) },
            data: {
                numeroControl: numeroControl || undefined,
                email: email ? email.toLowerCase() : undefined,
                telefono: telefono || undefined,
                direccion: direccion || undefined,
                semestre: semestre ? parseInt(semestre) : undefined,
                estatus: estatus || undefined,
                promedio: promedio ? parseFloat(promedio) : undefined,
                creditosAcumulados: creditosAcumulados ? parseInt(creditosAcumulados) : undefined
            },
            include: {
                carrera: true
            }
        });

        res.json({
            success: true,
            message: 'Alumno actualizado exitosamente',
            alumno: {
                id: alumnoActualizado.id,
                numeroControl: alumnoActualizado.numeroControl,
                nombre: `${alumnoActualizado.nombre} ${alumnoActualizado.apellidoPaterno} ${alumnoActualizado.apellidoMaterno}`,
                estatus: alumnoActualizado.estatus,
                semestre: alumnoActualizado.semestre
            }
        });
    } catch (error) {
        console.error('Error al actualizar alumno:', error);
        res.status(500).json({
            error: 'Error al actualizar el alumno',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Cambiar estatus de alumno
 * PATCH /api/alumnos/:id/estatus
 */
export const cambiarEstatusAlumno = async (req, res) => {
    try {
        const { id } = req.params;
        const { estatus, motivo } = req.body;

        const estatusValidos = ['activo', 'baja_temporal', 'egresado', 'baja_definitiva'];

        if (!estatusValidos.includes(estatus)) {
            return res.status(400).json({
                error: 'Estatus inválido',
                estatusValidos
            });
        }

        const alumno = await prisma.alumno.findUnique({
            where: { id: parseInt(id) }
        });

        if (!alumno) {
            return res.status(404).json({
                error: 'Alumno no encontrado'
            });
        }

        const alumnoActualizado = await prisma.alumno.update({
            where: { id: parseInt(id) },
            data: {
                estatus,
                fechaEgreso: estatus === 'egresado' ? new Date() : undefined
            }
        });

        // Registrar en auditoría
        await prisma.auditoria.create({
            data: {
                usuarioId: req.user.id,
                accion: 'cambio_estatus_alumno',
                entidad: 'alumno',
                entidadId: parseInt(id),
                detalles: {
                    estatusAnterior: alumno.estatus,
                    estatusNuevo: estatus,
                    motivo: motivo || 'Sin motivo especificado'
                }
            }
        });

        res.json({
            success: true,
            message: `Estatus cambiado a: ${estatus}`,
            alumno: {
                id: alumnoActualizado.id,
                numeroControl: alumnoActualizado.numeroControl,
                estatus: alumnoActualizado.estatus
            }
        });
    } catch (error) {
        console.error('Error al cambiar estatus:', error);
        res.status(500).json({
            error: 'Error al cambiar el estatus del alumno'
        });
    }
};

/**
 * Obtener estadísticas de alumnos
 * GET /api/alumnos/estadisticas
 */
export const obtenerEstadisticas = async (req, res) => {
    try {
        const [
            totalAlumnos,
            activos,
            egresados,
            bajaTemporal,
            bajaDefinitiva,
            porCarrera
        ] = await Promise.all([
            prisma.alumno.count(),
            prisma.alumno.count({ where: { estatus: 'activo' } }),
            prisma.alumno.count({ where: { estatus: 'egresado' } }),
            prisma.alumno.count({ where: { estatus: 'baja_temporal' } }),
            prisma.alumno.count({ where: { estatus: 'baja_definitiva' } }),
            prisma.alumno.groupBy({
                by: ['carreraId'],
                _count: true
            })
        ]);

        // Obtener nombres de carreras
        const carreras = await prisma.carrera.findMany({
            where: {
                id: { in: porCarrera.map(c => c.carreraId) }
            }
        });

        const porCarreraConNombres = porCarrera.map(item => {
            const carrera = carreras.find(c => c.id === item.carreraId);
            return {
                carrera: carrera?.nombre || 'Desconocida',
                total: item._count
            };
        });

        res.json({
            total: totalAlumnos,
            porEstatus: {
                activo: activos,
                egresado: egresados,
                bajaTemporal,
                bajaDefinitiva
            },
            porCarrera: porCarreraConNombres
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({
            error: 'Error al obtener estadísticas'
        });
    }
};
