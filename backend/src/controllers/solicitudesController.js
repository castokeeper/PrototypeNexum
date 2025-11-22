import { prisma } from '../config/database.js';

export const crearSolicitud = async (req, res, next) => {
    try {
        const { alumno, solicitud } = req.body;

        // Validar datos requeridos
        if (!alumno || !solicitud) {
            return res.status(400).json({
                error: 'Datos del alumno y solicitud son requeridos'
            });
        }

        // Crear o encontrar alumno por email
        let alumnoDb = await prisma.alumno.findUnique({
            where: { email: alumno.email }
        });

        if (!alumnoDb) {
            // Crear nuevo alumno
            alumnoDb = await prisma.alumno.create({
                data: {
                    nombre: alumno.nombre,
                    apellidoPaterno: alumno.apellidoPaterno,
                    apellidoMaterno: alumno.apellidoMaterno,
                    curp: alumno.curp.toUpperCase(),
                    fechaNacimiento: new Date(alumno.fechaNacimiento),
                    telefono: alumno.telefono,
                    email: alumno.email,
                    direccion: alumno.direccion || null
                }
            });
        }

        // Crear solicitud
        const solicitudDb = await prisma.solicitud.create({
            data: {
                alumnoId: alumnoDb.id,
                carreraId: parseInt(solicitud.carrera),
                tipo: solicitud.tipo,
                turno: solicitud.turno,
                matricula: solicitud.matricula || null,
                semestre: solicitud.semestre ? parseInt(solicitud.semestre) : null,
                grupo: solicitud.grupo || null,
            },
            include: {
                alumno: true,
                carrera: true
            }
        });

        res.status(201).json({
            message: 'Solicitud creada exitosamente',
            solicitud: solicitudDb
        });
    } catch (error) {
        next(error);
    }
};

export const obtenerSolicitudes = async (req, res, next) => {
    try {
        const { tipo, estatus, page = 1, limit = 50 } = req.query;

        const where = {};
        if (tipo) where.tipo = tipo;
        if (estatus) where.estatus = estatus;

        const [solicitudes, total] = await Promise.all([
            prisma.solicitud.findMany({
                where,
                include: {
                    alumno: true,
                    carrera: true,
                    aprobador: { select: { nombre: true, username: true } },
                    rechazador: { select: { nombre: true, username: true } },
                    documentos: true
                },
                orderBy: { fechaSolicitud: 'desc' },
                skip: (parseInt(page) - 1) * parseInt(limit),
                take: parseInt(limit)
            }),
            prisma.solicitud.count({ where })
        ]);

        res.json({
            data: solicitudes,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        next(error);
    }
};

export const obtenerSolicitudPorId = async (req, res, next) => {
    try {
        const { id } = req.params;

        const solicitud = await prisma.solicitud.findUnique({
            where: { id: parseInt(id) },
            include: {
                alumno: true,
                carrera: true,
                aprobador: { select: { nombre: true, username: true } },
                rechazador: { select: { nombre: true, username: true } },
                documentos: true
            }
        });

        if (!solicitud) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }

        res.json(solicitud);
    } catch (error) {
        next(error);
    }
};

export const aprobarSolicitud = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { comentarios } = req.body;

        const solicitud = await prisma.solicitud.update({
            where: { id: parseInt(id) },
            data: {
                estatus: 'aprobada',
                aprobadoPor: req.user.id,
                fechaAprobacion: new Date(),
                comentarios: comentarios || null
            },
            include: {
                alumno: true,
                carrera: true,
                aprobador: { select: { nombre: true } }
            }
        });

        res.json({
            message: 'Solicitud aprobada exitosamente',
            solicitud
        });
    } catch (error) {
        next(error);
    }
};

export const rechazarSolicitud = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { comentarios } = req.body;

        if (!comentarios) {
            return res.status(400).json({
                error: 'Los comentarios son requeridos al rechazar una solicitud'
            });
        }

        const solicitud = await prisma.solicitud.update({
            where: { id: parseInt(id) },
            data: {
                estatus: 'rechazada',
                rechazadoPor: req.user.id,
                fechaRechazo: new Date(),
                comentarios
            },
            include: {
                alumno: true,
                carrera: true,
                rechazador: { select: { nombre: true } }
            }
        });

        res.json({
            message: 'Solicitud rechazada',
            solicitud
        });
    } catch (error) {
        next(error);
    }
};

export const obtenerAceptados = async (req, res, next) => {
    try {
        const { tipo } = req.query;

        const where = { estatus: 'aprobada' };
        if (tipo) where.tipo = tipo;

        const aceptados = await prisma.solicitud.findMany({
            where,
            include: {
                alumno: {
                    select: {
                        nombre: true,
                        apellidoPaterno: true,
                        apellidoMaterno: true,
                        email: true,
                        telefono: true
                    }
                },
                carrera: {
                    select: {
                        nombre: true,
                        codigo: true
                    }
                }
            },
            orderBy: { fechaAprobacion: 'desc' }
        });

        res.json(aceptados);
    } catch (error) {
        next(error);
    }
};

export const obtenerEstadisticas = async (req, res, next) => {
    try {
        const [total, pendientes, aprobadas, rechazadas, nuevoIngreso, reinscripciones] = await Promise.all([
            prisma.solicitud.count(),
            prisma.solicitud.count({ where: { estatus: 'pendiente' } }),
            prisma.solicitud.count({ where: { estatus: 'aprobada' } }),
            prisma.solicitud.count({ where: { estatus: 'rechazada' } }),
            prisma.solicitud.count({ where: { tipo: 'nuevo_ingreso' } }),
            prisma.solicitud.count({ where: { tipo: 'reinscripcion' } })
        ]);

        res.json({
            total,
            pendientes,
            aprobadas,
            rechazadas,
            nuevoIngreso,
            reinscripciones
        });
    } catch (error) {
        next(error);
    }
};

/**
 * ========================================
 * NUEVOS ENDPOINTS PARA FLUJO DE ASPIRANTES
 * ========================================
 */

/**
 * Crear solicitud de inscripción desde el portal del aspirante
 * POST /api/solicitudes/inscripcion
 */
export const crearSolicitudInscripcion = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { datosPersonales, datosAcademicos, datosTutor, carreraId, turno, grupo } = req.body;

        // Validar que el usuario sea aspirante
        const usuario = await prisma.usuario.findUnique({
            where: { id: usuarioId },
            include: { fichaExamen: true }
        });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (usuario.estatus !== 'pendiente_formulario') {
            return res.status(400).json({
                error: 'No tienes permisos para llenar el formulario de inscripción',
                estatusActual: usuario.estatus
            });
        }

        // Verificar que no tenga ya una solicitud
        const solicitudExistente = await prisma.solicitud.findFirst({
            where: { usuarioId }
        });

        if (solicitudExistente) {
            return res.status(400).json({
                error: 'Ya tienes una solicitud de inscripción',
                solicitudId: solicitudExistente.id
            });
        }

        // Validar datos requeridos
        if (!datosPersonales || !datosAcademicos || !carreraId) {
            return res.status(400).json({
                error: 'Faltan datos requeridos (datosPersonales, datosAcademicos, carreraId)'
            });
        }

        // Obtener monto de inscripción de las variables de entorno
        const montoInscripcion = parseFloat(process.env.MONTO_INSCRIPCION || '1500.00');

        // TRANSACCIÓN: Crear solicitud y actualizar usuario
        const resultado = await prisma.$transaction(async (tx) => {
            // 1. Crear solicitud
            const solicitud = await tx.solicitud.create({
                data: {
                    usuarioId,
                    carreraId: parseInt(carreraId),
                    tipo: 'nuevo_ingreso',
                    turno,
                    grupo,
                    estatus: 'pendiente',
                    estatusPago: 'pendiente',
                    montoPagar: montoInscripcion,
                    datosPersonales: datosPersonales,  // JSON
                    datosAcademicos: datosAcademicos,  // JSON
                    datosTutor: datosTutor || null     // JSON (opcional)
                },
                include: {
                    carrera: true,
                    usuario: {
                        select: {
                            nombre: true,
                            email: true
                        }
                    }
                }
            });

            // 2. Actualizar estatus del usuario a pendiente_pago
            await tx.usuario.update({
                where: { id: usuarioId },
                data: {
                    estatus: 'pendiente_pago'
                }
            });

            return solicitud;
        });

        res.status(201).json({
            success: true,
            message: 'Solicitud de inscripción creada exitosamente',
            solicitud: {
                id: resultado.id,
                tipo: resultado.tipo,
                estatus: resultado.estatus,
                estatusPago: resultado.estatusPago,
                montoPagar: resultado.montoPagar,
                carrera: resultado.carrera.nombre,
                turno: resultado.turno,
                grupo: resultado.grupo,
                fechaSolicitud: resultado.fechaSolicitud
            },
            proximoPaso: 'Realizar el pago de inscripción'
        });
    } catch (error) {
        console.error('Error al crear solicitud de inscripción:', error);
        res.status(500).json({
            error: 'Error al crear la solicitud de inscripción',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Obtener la solicitud del usuario autenticado
 * GET /api/solicitudes/mi-solicitud
 */
export const obtenerMiSolicitud = async (req, res) => {
    try {
        const usuarioId = req.user.id;

        const solicitud = await prisma.solicitud.findFirst({
            where: { usuarioId },
            include: {
                carrera: true,
                documentos: true,
                usuario: {
                    select: {
                        nombre: true,
                        email: true,
                        estatus: true
                    }
                }
            }
        });

        if (!solicitud) {
            return res.status(404).json({
                error: 'No tienes ninguna solicitud de inscripción'
            });
        }

        res.json({
            solicitud: {
                id: solicitud.id,
                tipo: solicitud.tipo,
                estatus: solicitud.estatus,
                estatusPago: solicitud.estatusPago,
                montoPagar: solicitud.montoPagar,
                carrera: {
                    id: solicitud.carrera.id,
                    nombre: solicitud.carrera.nombre,
                    codigo: solicitud.carrera.codigo
                },
                turno: solicitud.turno,
                grupo: solicitud.grupo,
                datosPersonales: solicitud.datosPersonales,
                datosAcademicos: solicitud.datosAcademicos,
                datosTutor: solicitud.datosTutor,
                documentos: solicitud.documentos,
                fechaSolicitud: solicitud.fechaSolicitud,
                fechaPago: solicitud.fechaPago,
                stripeSessionId: solicitud.stripeSessionId
            }
        });
    } catch (error) {
        console.error('Error al obtener solicitud:', error);
        res.status(500).json({
            error: 'Error al obtener tu solicitud',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

