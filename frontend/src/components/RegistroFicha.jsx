import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FileText, User, Calendar, Phone, Mail, MapPin, GraduationCap, Clock, Sparkles, Send, CheckCircle } from 'lucide-react';
import { Button, Input, Card } from './common';

const RegistroFicha = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [carreras, setCarreras] = useState([]);
    const [formData, setFormData] = useState({
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        curp: '',
        fechaNacimiento: '',
        telefono: '',
        email: '',
        direccion: '',
        carreraId: '',
        turnoPreferido: 'matutino'
    });

    useEffect(() => {
        cargarCarreras();
    }, []);

    const cargarCarreras = async () => {
        try {
            const response = await fetch('/api/carreras');
            const data = await response.json();
            setCarreras(data.filter(c => c.activa));
        } catch (error) {
            console.error('Error al cargar carreras:', error);
            toast.error('Error al cargar las carreras disponibles');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/fichas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al generar la ficha');
            }

            toast.success('Ficha generada exitosamente');

            // Redirigir a página de confirmación con el folio
            navigate(`/consulta-ficha?folio=${data.ficha.folio}`, {
                state: { fichaGenerada: data.ficha }
            });
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <div className="max-w-4xl mx-auto mb-8 text-center fade-in">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect mb-4">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <span className="text-sm font-semibold gradient-text">Proceso de Admisión</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                    Solicitar Ficha de Examen
                </h1>
                <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                    Inicia tu registro y forma parte de nuestra comunidad académica
                </p>
            </div>

            {/* Form Container */}
            <div className="max-w-4xl mx-auto">
                <Card className="scale-in" style={{
                    background: 'var(--bg-card)',
                    borderRadius: '1.5rem',
                    boxShadow: 'var(--shadow-2xl)',
                    border: '1px solid var(--border-color)'
                }}>
                    <form onSubmit={handleSubmit} className="space-y-8 p-6 md:p-8">

                        {/* Datos Personales */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 pb-3 border-b-2" style={{ borderColor: 'var(--primary-blue)' }}>
                                <User className="w-6 h-6" style={{ color: 'var(--primary-blue)' }} />
                                <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                    Datos Personales
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-3">
                                    <Input
                                        label="Nombre(s)"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        placeholder="Ingresa tu nombre"
                                        icon={<User size={18} />}
                                        required
                                    />
                                </div>

                                <Input
                                    label="Apellido Paterno"
                                    name="apellidoPaterno"
                                    value={formData.apellidoPaterno}
                                    onChange={handleChange}
                                    placeholder="Apellido paterno"
                                    required
                                />

                                <Input
                                    label="Apellido Materno"
                                    name="apellidoMaterno"
                                    value={formData.apellidoMaterno}
                                    onChange={handleChange}
                                    placeholder="Apellido materno"
                                    required
                                />

                                <Input
                                    label="CURP"
                                    name="curp"
                                    value={formData.curp}
                                    onChange={handleChange}
                                    placeholder="18 caracteres"
                                    maxLength={18}
                                    required
                                />

                                <div className="md:col-span-2">
                                    <Input
                                        label="Fecha de Nacimiento"
                                        name="fechaNacimiento"
                                        type="date"
                                        value={formData.fechaNacimiento}
                                        onChange={handleChange}
                                        icon={<Calendar size={18} />}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contacto */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 pb-3 border-b-2" style={{ borderColor: 'var(--success-green)' }}>
                                <Phone className="w-6 h-6" style={{ color: 'var(--success-green)' }} />
                                <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                    Información de Contacto
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Teléfono"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    placeholder="10 dígitos"
                                    maxLength={10}
                                    icon={<Phone size={18} />}
                                    required
                                />

                                <Input
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="correo@ejemplo.com"
                                    icon={<Mail size={18} />}
                                    required
                                />
                            </div>

                            <Input
                                label="Dirección"
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleChange}
                                placeholder="Calle, número, colonia, ciudad"
                                icon={<MapPin size={18} />}
                            />
                        </div>

                        {/* Carrera y Turno */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 pb-3 border-b-2" style={{ borderColor: 'var(--purple)' }}>
                                <GraduationCap className="w-6 h-6" style={{ color: 'var(--purple)' }} />
                                <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                    Selección de Carrera
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                        Carrera *
                                    </label>
                                    <select
                                        name="carreraId"
                                        value={formData.carreraId}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                                        style={{
                                            backgroundColor: 'var(--bg-primary)',
                                            color: 'var(--text-primary)',
                                            borderColor: 'var(--border-color)'
                                        }}
                                        required
                                    >
                                        <option value="">Selecciona una carrera</option>
                                        {carreras.map(carrera => (
                                            <option key={carrera.id} value={carrera.id}>
                                                {carrera.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                        <Clock size={18} />
                                        Turno Preferido *
                                    </label>
                                    <select
                                        name="turnoPreferido"
                                        value={formData.turnoPreferido}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                                        style={{
                                            backgroundColor: 'var(--bg-primary)',
                                            color: 'var(--text-primary)',
                                            borderColor: 'var(--border-color)'
                                        }}
                                        required
                                    >
                                        <option value="matutino">Matutino</option>
                                        <option value="vespertino">Vespertino</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Información importante */}
                        <div className="p-6 rounded-xl border-2 border-dashed" style={{
                            borderColor: 'var(--primary-blue)',
                            backgroundColor: 'rgba(37, 99, 235, 0.05)'
                        }}>
                            <h4 className="flex items-center gap-2 text-lg font-bold mb-3" style={{ color: 'var(--primary-blue)' }}>
                                <FileText size={20} />
                                Información Importante
                            </h4>
                            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                <li className="flex items-start gap-2">
                                    <CheckCircle size={14} className="text-blue-500 mt-0.5" />
                                    Al enviar este formulario se generará tu ficha de examen con un folio único
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle size={14} className="text-blue-500 mt-0.5" />
                                    Recibirás el folio para consultar el estado de tu solicitud
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle size={14} className="text-blue-500 mt-0.5" />
                                    Guarda tu folio, lo necesitarás para consultar tu resultado
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle size={14} className="text-blue-500 mt-0.5" />
                                    Serás agregado automáticamente a la lista de espera
                                </li>
                            </ul>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <Button
                                type="submit"
                                fullWidth
                                loading={loading}
                                disabled={loading}
                                icon={<Send size={20} />}
                                className="py-4 text-lg font-semibold rounded-xl hover-lift"
                                style={{
                                    background: loading
                                        ? 'var(--text-tertiary)'
                                        : 'linear-gradient(135deg, var(--purple) 0%, var(--primary-blue) 100%)',
                                    color: 'white',
                                    border: 'none'
                                }}
                            >
                                {loading ? 'Generando Tu Ficha...' : 'Generar Ficha de Examen'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default RegistroFicha;
