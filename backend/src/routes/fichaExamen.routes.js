/**
 * Rutas para Fichas de Examen
 */

import express from 'express';
import { body, param, query } from 'express-validator';
import {
    crearFicha,
    consultarFicha,
    listarFichas,
    actualizarResultado
} from '../controllers/fichaExamenController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// Validaciones
const crearFichaValidation = [
    body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
    body('apellidoPaterno').trim().notEmpty().withMessage('El apellido paterno es requerido'),
    body('apellidoMaterno').trim().notEmpty().withMessage('El apellido materno es requerido'),
    body('curp')
        .trim()
        .isLength({ min: 18, max: 18 }).withMessage('El CURP debe tener 18 caracteres')
        .matches(/^[A-Z]{4}\d{6}[HM][A-Z]{5}\d{2}$/).withMessage('Formato de CURP inválido'),
    body('fechaNacimiento')
        .isISO8601().withMessage('Fecha de nacimiento inválida'),
    body('telefono')
        .matches(/^\d{10}$/).withMessage('El teléfono debe tener 10 dígitos'),
    body('email')
        .isEmail().withMessage('Email inválido')
        .normalizeEmail(),
    body('carreraId')
        .isInt({ min: 1 }).withMessage('ID de carrera inválido'),
    body('turnoPreferido')
        .isIn(['matutino', 'vespertino', 'nocturno']).withMessage('Turno inválido')
];

const folioValidation = [
    param('folio')
        .matches(/^FE-\d{4}-\d{4}$/).withMessage('Formato de folio inválido')
];

const actualizarResultadoValidation = [
    param('id').isInt({ min: 1 }).withMessage('ID de ficha inválido'),
    body('fechaExamen').optional().isISO8601().withMessage('Fecha de examen inválida'),
    body('lugarExamen').optional().trim().notEmpty(),
    body('calificacion').optional().isFloat({ min: 0, max: 100 }).withMessage('Calificación debe estar entre 0 y 100'),
    body('aprobado').optional().isBoolean().withMessage('El campo aprobado debe ser booleano')
];

// Rutas públicas
router.post('/', crearFichaValidation, crearFicha);
router.get('/:folio', folioValidation, consultarFicha);

// Rutas protegidas (solo admin)
router.get('/', authenticateToken, listarFichas);
router.put('/:id/resultado', authenticateToken, actualizarResultadoValidation, actualizarResultado);

export default router;
