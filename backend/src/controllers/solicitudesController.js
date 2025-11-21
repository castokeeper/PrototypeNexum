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
