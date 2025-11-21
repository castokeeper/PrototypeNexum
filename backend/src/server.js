import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/errorHandler.js';
import { rateLimiter } from './middlewares/rateLimiter.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de seguridad
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

// Rate limiting global
app.use(rateLimiter);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging en desarrollo
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API Routes
import authRoutes from './routes/auth.routes.js';
import solicitudesRoutes from './routes/solicitudes.routes.js';
import carrerasRoutes from './routes/carreras.routes.js';
import archivosRoutes from './routes/archivos.routes.js';
import fichaExamenRoutes from './routes/fichaExamen.routes.js';
import listaEsperaRoutes from './routes/listaEspera.routes.js';

app.use('/api/auth', authRoutes);
app.use('/api/solicitudes', solicitudesRoutes);
app.use('/api/carreras', carrerasRoutes);
app.use('/api/archivos', archivosRoutes);
app.use('/api/fichas', fichaExamenRoutes);
app.use('/api/lista-espera', listaEsperaRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'API de Sistema de Reinscripciones - Nexum',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            auth: '/api/auth',
            solicitudes: '/api/solicitudes',
            carreras: '/api/carreras',
            archivos: '/api/archivos',
            fichas: '/api/fichas',
            listaEspera: '/api/lista-espera'
        }
    });
});

// Error handler (debe ser el último middleware)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint no encontrado' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════╗
║  🚀 Servidor iniciado exitosamente                     ║
║                                                        ║
║  📡 URL: http://localhost:${PORT.toString().padEnd(31)}║
║  📊 Entorno: ${(process.env.NODE_ENV || 'development').padEnd(38)}║
║  🕐 Tiempo: ${new Date().toLocaleString('es-MX').padEnd(37)}║
║                                                        ║
║  📚 Endpoints disponibles:                             ║
║     - GET  /health                                     ║
║     - POST /api/auth/login                            ║
║     - GET  /api/carreras                              ║
║     - POST /api/fichas (público)                      ║
║     - GET  /api/fichas/:folio (público)               ║
║     - GET  /api/lista-espera                          ║
║     - POST /api/solicitudes                           ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
  `);
});

export default app;
