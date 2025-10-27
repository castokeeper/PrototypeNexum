import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSolicitudes } from '../context/SolicitudesContext';
import { toast } from 'react-toastify';
import { Upload, Send } from 'lucide-react';

const NuevoIngreso = () => {
  const navigate = useNavigate();
  const { agregarSolicitud } = useSolicitudes();
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    fechaNacimiento: '',
    curp: '',
    telefono: '',
    email: '',
    direccion: '',
    carrera: '',
    turno: ''
  });

  const [comprobante, setComprobante] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setComprobante(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar que todos los campos estén completos
    const camposVacios = Object.values(formData).some(value => !value);
    if (camposVacios || !comprobante) {
      toast.error('Por favor completa todos los campos y sube el comprobante de pago');
      return;
    }

    // Agregar solicitud
    const solicitudId = agregarSolicitud({
      tipo: 'nuevo-ingreso',
      ...formData,
      comprobante: previewUrl
    });

    toast.success('Solicitud enviada correctamente');
    
    // Limpiar formulario
    setFormData({
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      fechaNacimiento: '',
      curp: '',
      telefono: '',
      email: '',
      direccion: '',
      carrera: '',
      turno: ''
    });
    setComprobante(null);
    setPreviewUrl(null);

    // Redirigir después de 2 segundos
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Registro de Nuevo Ingreso</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          
          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>Datos Personales</h3>
            
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Nombre(s)</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </div>

            <div style={rowStyle}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Apellido Paterno</label>
                <input
                  type="text"
                  name="apellidoPaterno"
                  value={formData.apellidoPaterno}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Apellido Materno</label>
                <input
                  type="text"
                  name="apellidoMaterno"
                  value={formData.apellidoMaterno}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>
            </div>

            <div style={rowStyle}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Fecha de Nacimiento</label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>CURP</label>
                <input
                  type="text"
                  name="curp"
                  value={formData.curp}
                  onChange={handleChange}
                  style={inputStyle}
                  maxLength="18"
                  required
                />
              </div>
            </div>

            <div style={rowStyle}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Teléfono</label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Dirección</label>
              <textarea
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                style={{...inputStyle, minHeight: '80px'}}
                required
              />
            </div>
          </div>

          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>Información Académica</h3>

            <div style={rowStyle}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Carrera</label>
                <select
                  name="carrera"
                  value={formData.carrera}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                >
                  <option value="">Selecciona una carrera</option>
                  <option value="Ingeniería en Sistemas">Ingeniería en Sistemas</option>
                  <option value="Ingeniería Industrial">Ingeniería Industrial</option>
                  <option value="Administración">Administración</option>
                  <option value="Contaduría">Contaduría</option>
                  <option value="Derecho">Derecho</option>
                </select>
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Turno</label>
                <select
                  name="turno"
                  value={formData.turno}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                >
                  <option value="">Selecciona un turno</option>
                  <option value="Matutino">Matutino</option>
                  <option value="Vespertino">Vespertino</option>
                  <option value="Nocturno">Nocturno</option>
                </select>
              </div>
            </div>
          </div>

          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>Comprobante de Pago</h3>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>
                <div style={uploadButtonStyle}>
                  <Upload size={20} />
                  <span>{comprobante ? comprobante.name : 'Seleccionar comprobante'}</span>
                </div>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  required
                />
              </label>

              {previewUrl && (
                <div style={previewStyle}>
                  <img src={previewUrl} alt="Comprobante" style={{ maxWidth: '100%', maxHeight: '300px' }} />
                </div>
              )}
            </div>
          </div>

          <button type="submit" style={submitButtonStyle}>
            <Send size={20} />
            <span>Enviar Solicitud</span>
          </button>
        </form>
      </div>
    </div>
  );
};

// Estilos
const containerStyle = {
  maxWidth: '900px',
  margin: '2rem auto',
  padding: '0 1rem'
};

const cardStyle = {
  backgroundColor: 'white',
  borderRadius: '0.5rem',
  padding: '2rem',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
};

const titleStyle = {
  fontSize: '2rem',
  fontWeight: 'bold',
  color: '#1e40af',
  marginBottom: '2rem',
  textAlign: 'center'
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
  color: '#374151',
  marginBottom: '0.5rem',
  paddingBottom: '0.5rem',
  borderBottom: '2px solid #e5e7eb'
};

const rowStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1rem'
};

const inputGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
};

const labelStyle = {
  fontWeight: '500',
  color: '#374151',
  fontSize: '0.875rem'
};

const inputStyle = {
  padding: '0.5rem',
  border: '1px solid #d1d5db',
  borderRadius: '0.375rem',
  fontSize: '1rem',
  width: '100%'
};

const uploadButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.75rem 1rem',
  backgroundColor: '#3b82f6',
  color: 'white',
  borderRadius: '0.375rem',
  cursor: 'pointer',
  justifyContent: 'center',
  transition: 'background-color 0.2s'
};

const previewStyle = {
  marginTop: '1rem',
  padding: '1rem',
  border: '2px dashed #d1d5db',
  borderRadius: '0.375rem',
  display: 'flex',
  justifyContent: 'center'
};

const submitButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  padding: '1rem',
  backgroundColor: '#10b981',
  color: 'white',
  border: 'none',
  borderRadius: '0.375rem',
  fontSize: '1.125rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.2s'
};

export default NuevoIngreso;

