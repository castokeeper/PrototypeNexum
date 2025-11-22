/**
 * Controlador para el Portal del Aspirante
 * Endpoints para que los aspirantes vean su estado y gestionen su proceso
 */

import { prisma } from '../config/database.js';

/**
 * Obtener estado actual del aspirante
 * GET /api/aspirante/estado
 */
export const obtenerEstado = async (req, res) => {
    try {
        const usuarioId = req.user.id;

        // Obtener información completa del usuario
        const usuario = await prisma.usuario.findUnique({
            where: { id: usuarioId },
            include: {
                fichaExamen: {
                    include: {
                        carrera: true,
                        listaEspera: true
                    }
                },
                solicitudes: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    include: {
                        carrera: true
                    }
                }
            }
        });

        if (!usuario) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            });
        }

        // Determinar el mensaje según el estatus
        const mensajes = {
            en_revision: {
                titulo: 'Tu solicitud está en revisión',
                descripcion: 'Estamos revisando tu información. Te notificaremos cuando tengamos una respuesta.',
                icono: 'clock',
                color: 'warning'
            },
            pendiente_formulario: {
                titulo: '¡Felicidades! Has sido aceptado',
                descripcion: 'Ahora debes llenar el formulario de inscripción con todos tus datos.',
                icono: 'check-circle',
                color: 'success',
                accion: {
                    texto: 'Llenar Formulario',
                    ruta: '/portal-aspirante/inscripcion'
                }
            },
            pendiente_pago: {
                titulo: 'Formulario completado',
                descripcion: 'Tu formulario ha sido enviado. Ahora debes realizar el pago de inscripción.',
                icono: 'credit-card',
                color: 'info',
                accion: {
                    texto: 'Realizar Pago',
                    ruta: '/portal-aspirante/pago'
                }
            },
            activo: {
                titulo: '¡Bienvenido! Eres alumno activo',
                descripcion: 'Tu inscripción ha sido completada exitosamente.',
                icono: 'user-check',
                color: 'success'
            },
            rechazado: {
                titulo: 'Solicitud no aprobada',
                descripcion: 'Lamentablemente tu solicitud no fue aprobada en esta ocasión.',
                icono: 'x-circle',
                color: 'danger'
            }
        };

        const solicitud = usuario.solicitudes[0] || null;

        const response = {
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                estatus: usuario.estatus,
                temporal: usuario.temporal,
                createdAt: usuario.createdAt
            },
            estado: mensajes[usuario.estatus] || mensajes.en_revision,
            ficha: usuario.fichaExamen ? {
                folio: usuario.fichaExamen.folio,
                carrera: usuario.fichaExamen.carrera.nombre,
                turno: usuario.fichaExamen.turnoPreferido,
                estatus: usuario.fichaExamen.estatus,
                fechaRegistro: usuario.fichaExamen.createdAt
            } : null,
            listaEspera: usuario.fichaExamen?.listaEspera ? {
                posicion: usuario.fichaExamen.listaEspera.posicion,
                estado: usuario.fichaExamen.listaEspera.estadoActual,
                fechaIngreso: usuario.fichaExamen.listaEspera.fechaIngreso,
                fechaAceptacion: usuario.fichaExamen.listaEspera.fechaAceptacion
            } : null,
            solicitud: solicitud ? {
                id: solicitud.id,
                tipo: solicitud.tipo,
                estatus: solicitud.estatus,
                estatusPago: solicitud.estatusPago,
                montoPagar: solicitud.montoPagar,
                carrera: solicitud.carrera.nombre,
                fechaSolicitud: solicitud.fechaSolicitud
            } : null,
            proximosPasos: getProximosPasos(usuario.estatus, solicitud)
        };

        res.json(response);
    } catch (error) {
        console.error('Error al obtener estado:', error);
        res.status(500).json({
            error: 'Error al obtener el estado del aspirante',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Obtener información de la ficha
 * GET /api/aspirante/ficha
 */
export const obtenerFicha = async (req, res) => {
    try {
        const usuarioId = req.user.id;

        const usuario = await prisma.usuario.findUnique({
            where: { id: usuarioId },
            include: {
                fichaExamen: {
                    include: {
                        carrera: true,
                        listaEspera: true
                    }
                }
            }
        });

        if (!usuario || !usuario.fichaExamen) {
            return res.status(404).json({
                error: 'Ficha no encontrada'
            });
        }

        const ficha = usuario.fichaExamen;

        res.json({
            ficha: {
                folio: ficha.folio,
                nombre: ficha.nombre,
                apellidoPaterno: ficha.apellidoPaterno,
                apellidoMaterno: ficha.apellidoMaterno,
                curp: ficha.curp,
                fechaNacimiento: ficha.fechaNacimiento,
                telefono: ficha.telefono,
                email: ficha.email,
                direccion: ficha.direccion,
                carrera: {
                    id: ficha.carrera.id,
                    nombre: ficha.carrera.nombre,
                    codigo: ficha.carrera.codigo
                },
                turnoPreferido: ficha.turnoPreferido,
                estatus: ficha.estatus,
                fechaExamen: ficha.fechaExamen,
                lugarExamen: ficha.lugarExamen,
                calificacion: ficha.calificacion,
                aprobado: ficha.aprobado,
                createdAt: ficha.createdAt
            },
            listaEspera: ficha.listaEspera ? {
                posicion: ficha.listaEspera.posicion,
                estado: ficha.listaEspera.estadoActual,
                fechaIngreso: ficha.listaEspera.fechaIngreso,
                fechaAceptacion: ficha.listaEspera.fechaAceptacion,
                fechaRechazo: ficha.listaEspera.fechaRechazo,
                observaciones: ficha.listaEspera.observaciones
            } : null
        });
    } catch (error) {
        console.error('Error al obtener ficha:', error);
        res.status(500).json({
            error: 'Error al obtener la ficha',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Actualizar datos de contacto
 * PUT /api/aspirante/contacto
 */
export const actualizarContacto = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { telefono, direccion } = req.body;

        // Validar datos
        if (!telefono && !direccion) {
            return res.status(400).json({
                error: 'Debes proporcionar al menos un campo para actualizar'
            });
        }

        // Actualizar en transacción
        const updated = await prisma.$transaction(async (tx) => {
            // Actualizar ficha
            const ficha = await tx.fichaExamen.findFirst({
                where: { usuarioId },
                include: { carrera: true }
            });

            if (!ficha) {
                throw new Error('Ficha no encontrada');
            }

            const updatedFicha = await tx.fichaExamen.update({
                where: { id: ficha.id },
                data: {
                    telefono: telefono || ficha.telefono,
                    direccion: direccion || ficha.direccion
                },
                include: { carrera: true }
            });

            return updatedFicha;
        });

        res.json({
            success: true,
            message: 'Datos de contacto actualizados correctamente',
            ficha: {
                telefono: updated.telefono,
                direccion: updated.direccion
            }
        });
    } catch (error) {
        console.error('Error al actualizar contacto:', error);
        res.status(500).json({
            error: 'Error al actualizar datos de contacto',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Función auxiliar: Determinar próximos pasos según estatus
 */
function getProximosPasos(estatus, solicitud) {
    const pasos = {
        en_revision: [
            '1. Esperar respuesta del equipo de admisiones',
            '2. Revisar tu email regularmente para notificaciones',
            '3. Puedes consultar tu estado en cualquier momento'
        ],
        pendiente_formulario: [
            '1. Llenar el formulario de inscripción completo',
            '2. Subir los documentos requeridos',
            '3. Enviar el formulario para revisión'
        ],
        pendiente_pago: [
            `1. Realizar el pago de inscripción: $${solicitud?.montoPagar || '0.00'} MXN`,
            '2. El pago se procesa de forma segura con Stripe',
            '3. Una vez pagado, serás alumno activo'
        ],
        activo: [
            '1. Revisar tu número de control',
            '2. Consultar tu horario de clases',
            '3. Acceder al sistema académico'
        ],
        rechazado: [
            '1. Puedes consultar el motivo del rechazo',
            '2. Puedes registrarte nuevamente en el próximo ciclo',
            '3. Contacta con admisiones para más información'
        ]
    };

    return pasos[estatus] || pasos.en_revision;
}

export default {
    obtenerEstado,
    obtenerFicha,
    actualizarContacto
};
