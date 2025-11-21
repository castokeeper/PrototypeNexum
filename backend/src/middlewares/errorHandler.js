export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Error de Prisma - registro no encontrado
    if (err.code === 'P2025') {
        return res.status(404).json({
            error: 'Recurso no encontrado',
            details: err.meta?.cause || 'El registro solicitado no existe'
        });
    }

    // Error de Prisma - violación de constraint único
    if (err.code === 'P2002') {
        return res.status(409).json({
            error: 'Conflicto de datos',
            details: `El campo ${err.meta?.target} ya existe`
        });
    }

    // Error de Prisma - violación de foreign key
    if (err.code === 'P2003') {
        return res.status(400).json({
            error: 'Referencia inválida',
            details: 'El registro relacionado no existe'
        });
    }

    // Error de Multer - archivo muy grande
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
            error: 'Archivo muy grande',
            details: 'El archivo excede el tamaño máximo permitido de 5MB'
        });
    }

    // Error de validación
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Error de validación',
            details: err.message
        });
    }

    // Error genérico
    res.status(err.status || 500).json({
        error: err.message || 'Error interno del servidor',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};
