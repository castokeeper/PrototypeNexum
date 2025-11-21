import { prisma } from '../config/database.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadComprobante = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se proporcionó ningún archivo' });
        }

        const { solicitudId } = req.body;

        if (!solicitudId) {
            // Eliminar archivo si no hay solicitudId
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ error: 'El ID de la solicitud es requerido' });
        }

        // Verificar que la solicitud existe
        const solicitud = await prisma.solicitud.findUnique({
            where: { id: parseInt(solicitudId) }
        });

        if (!solicitud) {
            // Eliminar archivo si la solicitud no existe
            fs.unlinkSync(req.file.path);
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }

        // Crear registro de documento
        const documento = await prisma.documento.create({
            data: {
                solicitudId: parseInt(solicitudId),
                tipoDocumento: 'comprobante_pago',
                nombreArchivo: req.file.originalname,
                rutaArchivo: req.file.path,
                mimeType: req.file.mimetype,
                tamañoBytes: req.file.size
            }
        });

        res.status(201).json({
            message: 'Archivo subido exitosamente',
            documento: {
                id: documento.id,
                nombreArchivo: documento.nombreArchivo,
                url: `/api/archivos/${documento.id}`
            }
        });
    } catch (error) {
        // Eliminar archivo en caso de error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        next(error);
    }
};

export const obtenerArchivo = async (req, res, next) => {
    try {
        const { id } = req.params;

        const documento = await prisma.documento.findUnique({
            where: { id: parseInt(id) }
        });

        if (!documento) {
            return res.status(404).json({ error: 'Documento no encontrado' });
        }

        // Verificar que el archivo existe
        if (!fs.existsSync(documento.rutaArchivo)) {
            return res.status(404).json({ error: 'Archivo no encontrado en el sistema' });
        }

        // Enviar archivo
        res.sendFile(path.resolve(documento.rutaArchivo));
    } catch (error) {
        next(error);
    }
};

export const eliminarArchivo = async (req, res, next) => {
    try {
        const { id } = req.params;

        const documento = await prisma.documento.findUnique({
            where: { id: parseInt(id) }
        });

        if (!documento) {
            return res.status(404).json({ error: 'Documento no encontrado' });
        }

        // Eliminar archivo físico si existe
        if (fs.existsSync(documento.rutaArchivo)) {
            fs.unlinkSync(documento.rutaArchivo);
        }

        // Eliminar registro de la BD
        await prisma.documento.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: 'Archivo eliminado exitosamente' });
    } catch (error) {
        next(error);
    }
};
