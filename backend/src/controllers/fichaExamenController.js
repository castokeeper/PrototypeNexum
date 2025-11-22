/**
 * Controlador para Fichas de Examen
 */

import { prisma } from '../config/database.js';
import { generarFolio } from '../utils/folioGenerator.js';
import { generarPassword } from '../utils/passwordGenerator.js';
import bcrypt from 'bcrypt';

/**
 * Crear nueva ficha de examen
 * POST /api/fichas
 * 
 * FLUJO COMPLETO:
 * 1. Validar datos
 * 2. Generar contraseña temporal
 * 3. Crear Usuario temporal (rol: aspirante, estatus: en_revision)
 * 4. Crear FichaExamen vinculada al usuario
 * 5. Agregar a ListaEspera
 * 6. Retornar credenciales (solo en desarrollo)
 */
export const crearFicha = async (req, res) => {
    try {
        const {
            nombre,
            apellidoPaterno,
            apellidoMaterno,
            curp,
            fechaNacimiento,
            telefono,
            email,
            direccion,
            carreraId,
            turnoPreferido
        } = req.body;

        // Validar datos requeridos
        if (!nombre || !apellidoPaterno || !apellidoMaterno || !curp || !email) {
            return res.status(400).json({
                error: 'Faltan datos requeridos'
            });
        }

        // Verificar si ya existe una ficha con este CURP
        const fichaExistente = await prisma.fichaExamen.findUnique({
            where: { curp: curp.toUpperCase() }
        });

        if (fichaExistente) {
            return res.status(400).json({
                error: 'Ya existe una ficha registrada con este CURP',
                folio: fichaExistente.folio
            });
        }

        // Verificar si el email ya fue usado
        const emailExistente = await prisma.usuario.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (emailExistente) {
            return res.status(400).json({
                error: 'Este email ya ha sido registrado'
            });
        }

        // Verificar que la carrera existe y está activa
        const carrera = await prisma.carrera.findUnique({
            where: { id: parseInt(carreraId) }
        });

        if (!carrera || !carrera.activa) {
            return res.status(400).json({
                error: 'La carrera seleccionada no está disponible'
            });
        }

        // TRANSACCIÓN: Todo o nada
        const resultado = await prisma.$transaction(async (tx) => {
            // 1. Generar contraseña temporal segura
            const passwordTemporal = generarPassword(12);
            const passwordHash = await bcrypt.hash(passwordTemporal, 10);

            // 2. Crear Usuario temporal
            const usuario = await tx.usuario.create({
                data: {
                    username: email.toLowerCase(),
                    passwordHash,
                    nombre: `${nombre} ${apellidoPaterno} ${apellidoMaterno}`,
                    email: email.toLowerCase(),
                    rol: 'aspirante',
                    temporal: true,
                    estatus: 'en_revision',
                    activo: true
                }
            });

            // 3. Generar folio único
            const folio = await generarFolio();

            // 4. Crear FichaExamen vinculada al usuario
            const ficha = await tx.fichaExamen.create({
                data: {
                    folio,
                    nombre,
                    apellidoPaterno,
                    apellidoMaterno,
                    curp: curp.toUpperCase(),
                    fechaNacimiento: new Date(fechaNacimiento),
                    telefono,
                    email: email.toLowerCase(),
                    direccion,
                    carreraId: parseInt(carreraId),
                    turnoPreferido,
                    estatus: 'pendiente',
                    usuarioId: usuario.id  // ⭐ VINCULAR
                },
                include: {
                    carrera: true
                }
            });

            // 5. Obtener la siguiente posición en lista de espera
            const ultimaPosicion = await tx.listaEspera.findFirst({
                orderBy: { posicion: 'desc' }
            });

            const nuevaPosicion = ultimaPosicion ? ultimaPosicion.posicion + 1 : 1;

            // 6. Agregar a lista de espera
            await tx.listaEspera.create({
                data: {
                    fichaId: ficha.id,
                    posicion: nuevaPosicion,
                    estadoActual: 'en_espera'
                }
            });

            return { usuario, ficha, nuevaPosicion, passwordTemporal };
        });

        // TODO: Enviar email con credenciales
        // await enviarEmailBienvenida(email, resultado.passwordTemporal, resultado.ficha.folio);

        // Respuesta exitosa
        res.status(201).json({
            success: true,
            message: 'Ficha registrada exitosamente. Revisa tu email para las credenciales de acceso.',
            ficha: {
                folio: resultado.ficha.folio,
                nombre: `${resultado.ficha.nombre} ${resultado.ficha.apellidoPaterno} ${resultado.ficha.apellidoMaterno}`,
                carrera: resultado.ficha.carrera.nombre,
                turno: resultado.ficha.turnoPreferido,
                estatus: resultado.ficha.estatus,
                posicionEspera: resultado.nuevaPosicion,
                createdAt: resultado.ficha.createdAt
            },
            credenciales: {
                username: email.toLowerCase(),
                // ⚠️ Solo enviar contraseña en desarrollo
                password: process.env.NODE_ENV === 'development' ? resultado.passwordTemporal : undefined,
                mensaje: process.env.NODE_ENV === 'development'
                    ? 'Guarda estas credenciales. En producción se enviarán por email.'
                    : 'Revisa tu email para obtener tus credenciales de acceso.'
            }
        });
    } catch (error) {
        console.error('Error al crear ficha:', error);

        // Manejar errores específicos de Prisma
        if (error.code === 'P2002') {
            return res.status(409).json({
                error: 'Ya existe un registro con estos datos (CURP o Email duplicado)'
            });
        }

        res.status(500).json({
            error: 'Error al generar la ficha de examen',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Consultar ficha por folio
 * GET /api/fichas/:folio
 */
export const consultarFicha = async (req, res) => {
    try {
        const { folio } = req.params;

        const ficha = await prisma.fichaExamen.findUnique({
            where: { folio: folio.toUpperCase() },
            include: {
                carrera: true,
                listaEspera: true
            }
        });

        if (!ficha) {
            return res.status(404).json({
                error: 'No se encontró ninguna ficha con este folio'
            });
        }

        res.json({
            folio: ficha.folio,
            aspirante: {
                nombre: `${ficha.nombre} ${ficha.apellidoPaterno} ${ficha.apellidoMaterno}`,
                curp: ficha.curp,
                email: ficha.email,
                telefono: ficha.telefono
            },
            carrera: ficha.carrera.nombre,
            turno: ficha.turnoPreferido,
            examen: {
                fechaExamen: ficha.fechaExamen,
                lugarExamen: ficha.lugarExamen,
                calificacion: ficha.calificacion,
                aprobado: ficha.aprobado
            },
            estatus: ficha.estatus,
            listaEspera: ficha.listaEspera ? {
                posicion: ficha.listaEspera.posicion,
                estadoActual: ficha.listaEspera.estadoActual
            } : null,
            fechaRegistro: ficha.createdAt
        });
    } catch (error) {
        console.error('Error al consultar ficha:', error);
        res.status(500).json({
            error: 'Error al consultar la ficha'
        });
    }
};

/**
 * Listar todas las fichas (admin)
 * GET /api/fichas
 */
export const listarFichas = async (req, res) => {
    try {
        const {
            estatus,
            carreraId,
            page = 1,
            limit = 20
        } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const where = {};
        if (estatus) where.estatus = estatus;
        if (carreraId) where.carreraId = parseInt(carreraId);

        const [fichas, total] = await Promise.all([
            prisma.fichaExamen.findMany({
                where,
                include: {
                    carrera: true,
                    listaEspera: true
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: parseInt(limit)
            }),
            prisma.fichaExamen.count({ where })
        ]);

        res.json({
            fichas: fichas.map(f => ({
                id: f.id,
                folio: f.folio,
                nombre: `${f.nombre} ${f.apellidoPaterno} ${f.apellidoMaterno}`,
                curp: f.curp,
                email: f.email,
                carrera: f.carrera.nombre,
                estatus: f.estatus,
                fechaExamen: f.fechaExamen,
                calificacion: f.calificacion,
                aprobado: f.aprobado,
                posicionEspera: f.listaEspera?.posicion,
                estadoEspera: f.listaEspera?.estadoActual,
                createdAt: f.createdAt
            })),
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Error al listar fichas:', error);
        res.status(500).json({
            error: 'Error al obtener las fichas'
        });
    }
};

/**
 * Actualizar resultado de examen
 * PUT /api/fichas/:id/resultado
 */
export const actualizarResultado = async (req, res) => {
    try {
        const { id } = req.params;
        const { fechaExamen, lugarExamen, calificacion, aprobado } = req.body;

        const ficha = await prisma.fichaExamen.findUnique({
            where: { id: parseInt(id) }
        });

        if (!ficha) {
            return res.status(404).json({
                error: 'Ficha no encontrada'
            });
        }

        // Actualizar ficha
        const fichaActualizada = await prisma.fichaExamen.update({
            where: { id: parseInt(id) },
            data: {
                fechaExamen: fechaExamen ? new Date(fechaExamen) : undefined,
                lugarExamen,
                calificacion: calificacion ? parseFloat(calificacion) : undefined,
                aprobado: aprobado !== undefined ? aprobado : undefined,
                estatus: aprobado === true ? 'aprobado' :
                    aprobado === false ? 'rechazado' :
                        fechaExamen ? 'programado' : 'pendiente'
            },
            include: {
                carrera: true,
                listaEspera: true
            }
        });

        // Si fue aprobado, actualizar lista de espera
        if (aprobado === true && fichaActualizada.listaEspera) {
            await prisma.listaEspera.update({
                where: { id: fichaActualizada.listaEspera.id },
                data: {
                    estadoActual: 'aceptado',
                    fechaAceptacion: new Date()
                }
            });
        }

        // Si fue rechazado, actualizar lista de espera
        if (aprobado === false && fichaActualizada.listaEspera) {
            await prisma.listaEspera.update({
                where: { id: fichaActualizada.listaEspera.id },
                data: {
                    estadoActual: 'rechazado',
                    fechaRechazo: new Date()
                }
            });
        }

        res.json({
            success: true,
            message: 'Resultado actualizado correctamente',
            ficha: {
                folio: fichaActualizada.folio,
                estatus: fichaActualizada.estatus,
                calificacion: fichaActualizada.calificacion,
                aprobado: fichaActualizada.aprobado
            }
        });
    } catch (error) {
        console.error('Error al actualizar resultado:', error);
        res.status(500).json({
            error: 'Error al actualizar el resultado'
        });
    }
};
