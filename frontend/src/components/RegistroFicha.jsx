import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FileText, User, Calendar, Phone, Mail, MapPin, GraduationCap, Clock } from 'lucide-react';
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

            toast.success('¡Ficha generada exitosamente!');

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
        <div style={containerStyle}>
            <div style={maxWidthContainer}>
                <div style={headerStyle}>
                    <div style={iconHeaderStyle}>
                        <FileText size={48} color="var(--primary-blue)" />
                    </div>
                    <h1 style={titleStyle}>Solicitar Ficha de Examen</h1>
                    <p style={subtitleStyle}>
                        Completa el formulario para generar tu ficha de examen de admisión
                    </p>
                </div>

                <Card padding="comfortable">
                    <form onSubmit={handleSubmit} style={formStyle}>
                        {/* Datos Personales */}
                        <div style={sectionStyle}>
                            <h3 style={sectionTitleStyle}>
                                <User size={20} />
                                Datos Personales
                            </h3>

                            <div style={gridStyle}>
                                <Input
                                    label="Nombre(s)"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    placeholder="Ingresa tu nombre"
                                    icon={<User size={18} />}
                                    required
                                />

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
                                    helperText="Escribe tu CURP completo (18 caracteres)"
                                />

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

                        {/* Contacto */}
                        <div style={sectionStyle}>
                            <h3 style={sectionTitleStyle}>
                                <Phone size={20} />
                                Información de Contacto
                            </h3>

                            <div style={gridStyle}>
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
                        <div style={sectionStyle}>
                            <h3 style={sectionTitleStyle}>
                                <GraduationCap size={20} />
                                Selección de Carrera
                            </h3>

                            <div style={gridStyle}>
                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>Carrera</label>
                                    <select
                                        name="carreraId"
                                        value={formData.carreraId}
                                        onChange={handleChange}
                                        style={selectStyle}
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

                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>
                                        <Clock size={18} />
                                        <span style={{ marginLeft: '0.5rem' }}>Turno Preferido</span>
                                    </label>
                                    <select
                                        name="turnoPreferido"
                                        value={formData.turnoPreferido}
                                        onChange={handleChange}
                                        style={selectStyle}
                                        required
                                    >
                                        <option value="matutino">Matutino</option>
                                        <option value="vespertino">Vespertino</option>
                                        <option value="nocturno">Nocturno</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Información importante */}
                        <div style={infoBoxStyle}>
                            <h4 style={{ margin: 0, color: 'var(--primary-blue)' }}>
                                📋 Información Importante
                            </h4>
                            <ul style={listStyle}>
                                <li>Al enviar este formulario se generará tu ficha de examen con un folio único</li>
                                <li>Recibirás el folio para consultar el estado de tu solicitud</li>
                                <li>Guarda tu folio, lo necesitarás para consultar tu resultado</li>
                                <li>Serás agregado automáticamente a la lista de espera</li>
                            </ul>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="large"
                            fullWidth
                            loading={loading}
                            disabled={loading}
                            icon={<FileText size={20} />}
                        >
                            {loading ? 'Generando Ficha...' : 'Generar Ficha de Examen'}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

// Estilos
const containerStyle = {
    minHeight: 'calc(100vh - 80px)',
    padding: '2rem',
    backgroundColor: 'var(--bg-secondary)'
};

const maxWidthContainer = {
    maxWidth: '900px',
    margin: '0 auto'
};

const headerStyle = {
    textAlign: 'center',
    marginBottom: '2rem'
};

const iconHeaderStyle = {
    display: 'inline-flex',
    padding: '1rem',
    borderRadius: '50%',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    marginBottom: '1rem'
};

const titleStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '0.5rem'
};

const subtitleStyle = {
    color: 'var(--text-secondary)',
    fontSize: '1rem'
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
};

const sectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
};

const sectionTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
    paddingBottom: '0.5rem',
    borderBottom: '2px solid var(--border-color)'
};

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem'
};

const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
};

const labelStyle = {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center'
};

const selectStyle = {
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none'
};

const infoBoxStyle = {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    border: '1px solid var(--primary-blue)',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    marginTop: '1rem'
};

const listStyle = {
    marginTop: '1rem',
    marginLeft: '1.5rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.8'
};

export default RegistroFicha;
