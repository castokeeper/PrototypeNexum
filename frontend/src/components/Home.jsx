import { Link } from 'react-router-dom';
import {
    FileText,
    Search,
    CheckCircle,
    Shield,
    GraduationCap,
    Clock,
    Users,
    ArrowRight
} from 'lucide-react';
import { Card, Button } from './common';
import { useTheme } from '../context/ThemeContext';

const Home = () => {
    const { isDark } = useTheme();

    const servicios = [
        {
            icon: FileText,
            title: 'Registro de Ficha',
            description: 'Solicita tu ficha de examen de admisión para iniciar tu proceso de inscripción.',
            link: '/registro-ficha',
            color: '#3b82f6',
            bgColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)'
        },
        {
            icon: Search,
            title: 'Consulta de Ficha',
            description: 'Verifica el estado de tu solicitud con tu número de folio.',
            link: '/consulta-ficha',
            color: '#8b5cf6',
            bgColor: isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)'
        },
        {
            icon: CheckCircle,
            title: 'Lista de Aceptados',
            description: 'Consulta los resultados de admisión del ciclo escolar actual.',
            link: '/aceptados',
            color: '#10b981',
            bgColor: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)'
        }
    ];

    const caracteristicas = [
        {
            icon: Clock,
            title: 'Proceso Ágil',
            description: 'Realiza tus trámites de forma rápida y sin filas.'
        },
        {
            icon: Shield,
            title: 'Seguro y Confiable',
            description: 'Tu información está protegida con los más altos estándares.'
        },
        {
            icon: Users,
            title: 'Soporte Continuo',
            description: 'Asistencia disponible durante todo el proceso.'
        }
    ];

    return (
        <div className="min-h-screen">
            <section
                className="py-16 px-4 sm:px-6 lg:px-8"
                style={{
                    background: isDark
                        ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
                        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
                }}
            >
                <div className="max-w-6xl mx-auto text-center">
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <div
                            className="w-32 h-32 rounded-3xl flex items-center justify-center shadow-2xl"
                            style={{ backgroundColor: 'var(--primary-blue)' }}
                        >
                            <img
                                src="/logo.svg"
                                alt="Nexum Logo"
                                className="w-20 h-20"
                                style={{ filter: 'brightness(0) invert(1)' }}
                            />
                        </div>
                    </div>

                    <h1
                        className="text-4xl md:text-5xl font-bold mb-4"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        Sistema de Admisiones
                    </h1>

                    <p
                        className="text-xl mb-2"
                        style={{ color: 'var(--primary-blue)' }}
                    >
                        CETis 120
                    </p>

                    <p
                        className="text-lg max-w-2xl mx-auto mb-8"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        Plataforma digital para gestionar el proceso de admisión
                        e inscripción al bachillerato técnico.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/registro-ficha">
                            <Button
                                icon={<FileText size={20} />}
                                className="px-8 py-3 text-lg font-semibold"
                                style={{
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                    color: 'white',
                                    border: 'none'
                                }}
                            >
                                Solicitar Ficha de Examen
                            </Button>
                        </Link>

                        <Link to="/consulta-ficha">
                            <Button
                                variant="outline"
                                icon={<Search size={20} />}
                                className="px-8 py-3 text-lg font-semibold"
                            >
                                Consultar Estado
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <h2
                        className="text-2xl md:text-3xl font-bold text-center mb-12"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        Servicios Disponibles
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {servicios.map((servicio, index) => (
                            <Link
                                key={index}
                                to={servicio.link}
                                className="block group"
                            >
                                <Card
                                    className="h-full transition-all duration-300 hover:shadow-lg"
                                    style={{
                                        backgroundColor: servicio.bgColor,
                                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`
                                    }}
                                >
                                    <div className="p-6">
                                        <div
                                            className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                                            style={{
                                                backgroundColor: servicio.color,
                                                opacity: 0.9
                                            }}
                                        >
                                            <servicio.icon size={24} className="text-white" />
                                        </div>

                                        <h3
                                            className="text-xl font-bold mb-2"
                                            style={{ color: 'var(--text-primary)' }}
                                        >
                                            {servicio.title}
                                        </h3>

                                        <p
                                            className="mb-4"
                                            style={{ color: 'var(--text-secondary)' }}
                                        >
                                            {servicio.description}
                                        </p>

                                        <div
                                            className="flex items-center gap-2 font-medium group-hover:gap-3 transition-all"
                                            style={{ color: servicio.color }}
                                        >
                                            Acceder
                                            <ArrowRight size={16} />
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section
                className="py-16 px-4 sm:px-6 lg:px-8"
                style={{ backgroundColor: 'var(--bg-card)' }}
            >
                <div className="max-w-6xl mx-auto">
                    <h2
                        className="text-2xl md:text-3xl font-bold text-center mb-12"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        Beneficios del Sistema
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {caracteristicas.map((caracteristica, index) => (
                            <div key={index} className="text-center">
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                                    style={{
                                        backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                                        border: '2px solid var(--primary-blue)'
                                    }}
                                >
                                    <caracteristica.icon
                                        size={28}
                                        style={{ color: 'var(--primary-blue)' }}
                                    />
                                </div>

                                <h3
                                    className="text-lg font-bold mb-2"
                                    style={{ color: 'var(--text-primary)' }}
                                >
                                    {caracteristica.title}
                                </h3>

                                <p style={{ color: 'var(--text-secondary)' }}>
                                    {caracteristica.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <Card style={{ backgroundColor: 'var(--bg-card)' }}>
                        <div className="p-8">
                            <h2
                                className="text-xl font-bold mb-4"
                                style={{ color: 'var(--text-primary)' }}
                            >
                                Proceso de Admisión
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                <div className="p-4">
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 font-bold"
                                        style={{
                                            backgroundColor: 'var(--primary-blue)',
                                            color: 'white'
                                        }}
                                    >
                                        1
                                    </div>
                                    <p style={{ color: 'var(--text-secondary)' }}>
                                        Solicitar ficha de examen
                                    </p>
                                </div>

                                <div className="p-4">
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 font-bold"
                                        style={{
                                            backgroundColor: 'var(--primary-blue)',
                                            color: 'white'
                                        }}
                                    >
                                        2
                                    </div>
                                    <p style={{ color: 'var(--text-secondary)' }}>
                                        Presentar examen de admisión
                                    </p>
                                </div>

                                <div className="p-4">
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 font-bold"
                                        style={{
                                            backgroundColor: 'var(--primary-blue)',
                                            color: 'white'
                                        }}
                                    >
                                        3
                                    </div>
                                    <p style={{ color: 'var(--text-secondary)' }}>
                                        Consultar resultados
                                    </p>
                                </div>

                                <div className="p-4">
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 font-bold"
                                        style={{
                                            backgroundColor: 'var(--success-green)',
                                            color: 'white'
                                        }}
                                    >
                                        4
                                    </div>
                                    <p style={{ color: 'var(--text-secondary)' }}>
                                        Completar inscripción
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            <footer
                className="py-8 px-4 text-center"
                style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderTop: '1px solid var(--border-color)'
                }}
            >
                <p style={{ color: 'var(--text-secondary)' }}>
                    CETis 120 - Centro de Estudios Tecnológicos Industrial y de Servicios
                </p>
                <p
                    className="text-sm mt-2"
                    style={{ color: 'var(--text-secondary)', opacity: 0.7 }}
                >
                    Ciclo Escolar 2024-2025
                </p>
            </footer>
        </div>
    );
};

export default Home;
