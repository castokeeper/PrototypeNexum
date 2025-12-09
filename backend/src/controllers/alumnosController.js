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
            estatus,
            search
        } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Construir filtros
        const where = {};

        if (estatus) {
            where.estatusAlumno = estatus;
        }

        if (search) {
            where.OR = [
                { nombre: { contains: search } },
                { apellidoPaterno: { contains: search } },
                { apellidoMaterno: { contains: search } },
                { curp: { contains: search } },
                { email: { contains: search } }
            ];
        }

        const [alumnos, total] = await Promise.all([
            prisma.alumno.findMany({
                where,
                include: {
                    fichaExamen: {
                        include: {
                            carrera: true
                        }
                    },
                    solicitudes: {
                        take: 1,
                        orderBy: { fechaSolicitud: 'desc' },
                        select: {
                            id: true,
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
                nombre: `${a.nombre} ${a.apellidoPaterno} ${a.apellidoMaterno}`,
                nombreCompleto: {
                    nombre: a.nombre,
                    apellidoPaterno: a.apellidoPaterno,
                    apellidoMaterno: a.apellidoMaterno
                },
                curp: a.curp,
                email: a.email,
                telefono: a.telefono,
                carrera: a.fichaExamen?.carrera?.nombre || 'Sin asignar',
                carreraId: a.fichaExamen?.carreraId,
                semestre: a.semestreActual || 1,
                estatus: a.estatusAlumno,
                folio: a.fichaExamen?.folio,
                solicitudId: a.solicitudes?.[0]?.id,
                estatusPago: a.solicitudes?.[0]?.estatusPago,
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
                fichaExamen: {
                    include: {
                        carrera: true
                    }
                },
                solicitudes: {
                    include: {
                        documentos: true
                    },
                    orderBy: { fechaSolicitud: 'desc' },
                    take: 1
                }
            }
        });

        if (!alumno) {
            return res.status(404).json({
                error: 'Alumno no encontrado'
            });
        }

        const ultimaSolicitud = alumno.solicitudes?.[0];

        res.json({
            id: alumno.id,
            nombre: alumno.nombre,
            apellidoPaterno: alumno.apellidoPaterno,
            apellidoMaterno: alumno.apellidoMaterno,
            curp: alumno.curp,
            fechaNacimiento: alumno.fechaNacimiento,
            email: alumno.email,
            telefono: alumno.telefono,
            direccion: alumno.direccion,
            carrera: alumno.fichaExamen?.carrera ? {
                id: alumno.fichaExamen.carrera.id,
                nombre: alumno.fichaExamen.carrera.nombre,
                codigo: alumno.fichaExamen.carrera.codigo
            } : null,
            semestre: alumno.semestreActual || 1,
            estatus: alumno.estatusAlumno,
            folio: alumno.fichaExamen?.folio,
            solicitud: ultimaSolicitud ? {
                id: ultimaSolicitud.id,
                estatusPago: ultimaSolicitud.estatusPago,
                documentos: ultimaSolicitud.documentos
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
 * Crear nuevo alumno (desde ficha de examen aprobada)
 * POST /api/alumnos
 */
export const crearAlumno = async (req, res) => {
    try {
        const {
            fichaExamenId,
            nombre,
            apellidoPaterno,
            apellidoMaterno,
            curp,
            fechaNacimiento,
            email,
            telefono,
            direccion,
            semestre = 1
        } = req.body;

        // Verificar que la ficha existe
        if (fichaExamenId) {
            const ficha = await prisma.fichaExamen.findUnique({
                where: { id: parseInt(fichaExamenId) }
            });

            if (!ficha) {
                return res.status(404).json({
                    error: 'Ficha de examen no encontrada'
                });
            }

            // Verificar que no exista ya un alumno con esta ficha
            const alumnoExistente = await prisma.alumno.findUnique({
                where: { fichaExamenId: parseInt(fichaExamenId) }
            });

            if (alumnoExistente) {
                return res.status(400).json({
                    error: 'Ya existe un alumno registrado con esta ficha'
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

        // Verificar que el email no exista
        const emailExistente = await prisma.alumno.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (emailExistente) {
            return res.status(400).json({
                error: 'El email ya está registrado'
            });
        }

        // Crear alumno
        const alumno = await prisma.alumno.create({
            data: {
                fichaExamenId: fichaExamenId ? parseInt(fichaExamenId) : undefined,
                nombre,
                apellidoPaterno,
                apellidoMaterno,
                curp: curp.toUpperCase(),
                fechaNacimiento: new Date(fechaNacimiento),
                email: email.toLowerCase(),
                telefono,
                direccion,
                semestreActual: parseInt(semestre),
                estatusAlumno: 'activo'
            },
            include: {
                fichaExamen: {
                    include: {
                        carrera: true
                    }
                }
            }
        });

        res.status(201).json({
            success: true,
            message: 'Alumno registrado exitosamente',
            alumno: {
                id: alumno.id,
                nombre: `${alumno.nombre} ${alumno.apellidoPaterno} ${alumno.apellidoMaterno}`,
                carrera: alumno.fichaExamen?.carrera?.nombre || 'Sin asignar',
                estatus: alumno.estatusAlumno
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
            email,
            telefono,
            direccion,
            semestre,
            estatus
        } = req.body;

        const alumno = await prisma.alumno.findUnique({
            where: { id: parseInt(id) }
        });

        if (!alumno) {
            return res.status(404).json({
                error: 'Alumno no encontrado'
            });
        }

        // Si se cambia el email, verificar que no exista
        if (email && email.toLowerCase() !== alumno.email) {
            const emailExistente = await prisma.alumno.findUnique({
                where: { email: email.toLowerCase() }
            });

            if (emailExistente) {
                return res.status(400).json({
                    error: 'El email ya está registrado'
                });
            }
        }

        const alumnoActualizado = await prisma.alumno.update({
            where: { id: parseInt(id) },
            data: {
                email: email ? email.toLowerCase() : undefined,
                telefono: telefono || undefined,
                direccion: direccion || undefined,
                semestreActual: semestre ? parseInt(semestre) : undefined,
                estatusAlumno: estatus || undefined
            },
            include: {
                fichaExamen: {
                    include: {
                        carrera: true
                    }
                }
            }
        });

        res.json({
            success: true,
            message: 'Alumno actualizado exitosamente',
            alumno: {
                id: alumnoActualizado.id,
                nombre: `${alumnoActualizado.nombre} ${alumnoActualizado.apellidoPaterno} ${alumnoActualizado.apellidoMaterno}`,
                estatus: alumnoActualizado.estatusAlumno,
                semestre: alumnoActualizado.semestreActual
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

        const estatusValidos = ['aspirante', 'activo', 'baja_temporal', 'egresado', 'baja_definitiva'];

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
                estatusAlumno: estatus
            }
        });

        // Registrar en auditoría
        await prisma.auditoria.create({
            data: {
                tablaAfectada: 'alumnos',
                registroId: parseInt(id),
                accion: 'UPDATE',
                usuarioId: req.user?.id || null,
                datosAnteriores: { estatusAlumno: alumno.estatusAlumno },
                datosNuevos: {
                    estatusAlumno: estatus,
                    motivo: motivo || 'Sin motivo especificado'
                }
            }
        });

        res.json({
            success: true,
            message: `Estatus cambiado a: ${estatus}`,
            alumno: {
                id: alumnoActualizado.id,
                nombre: `${alumnoActualizado.nombre} ${alumnoActualizado.apellidoPaterno} ${alumnoActualizado.apellidoMaterno}`,
                estatus: alumnoActualizado.estatusAlumno
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
            aspirantes
        ] = await Promise.all([
            prisma.alumno.count(),
            prisma.alumno.count({ where: { estatusAlumno: 'activo' } }),
            prisma.alumno.count({ where: { estatusAlumno: 'egresado' } }),
            prisma.alumno.count({ where: { estatusAlumno: 'baja_temporal' } }),
            prisma.alumno.count({ where: { estatusAlumno: 'baja_definitiva' } }),
            prisma.alumno.count({ where: { estatusAlumno: 'aspirante' } })
        ]);

        // Obtener alumnos con sus fichas para agrupar por carrera
        const alumnosConCarrera = await prisma.alumno.findMany({
            where: {
                fichaExamenId: { not: null }
            },
            include: {
                fichaExamen: {
                    include: {
                        carrera: true
                    }
                }
            }
        });

        // Agrupar por carrera manualmente
        const porCarreraMap = new Map();
        alumnosConCarrera.forEach(alumno => {
            const carreraNombre = alumno.fichaExamen?.carrera?.nombre || 'Sin asignar';
            const count = porCarreraMap.get(carreraNombre) || 0;
            porCarreraMap.set(carreraNombre, count + 1);
        });

        const porCarreraConNombres = Array.from(porCarreraMap.entries()).map(([carrera, total]) => ({
            carrera,
            total
        }));

        res.json({
            total: totalAlumnos,
            porEstatus: {
                activo: activos,
                egresado: egresados,
                bajaTemporal,
                bajaDefinitiva,
                aspirante: aspirantes
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
