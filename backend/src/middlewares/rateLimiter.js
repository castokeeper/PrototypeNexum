import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 100 requests
    message: {
        error: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo más tarde'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter más estricto para autenticación
export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // 5 intentos de login
    message: {
        error: 'Demasiados intentos de inicio de sesión. Por favor intenta de nuevo en 15 minutos'
    },
    skipSuccessfulRequests: true, // No contar requests exitosos
});
