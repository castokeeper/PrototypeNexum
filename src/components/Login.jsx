import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';
import { Lock, User, LogIn, ShieldCheck } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDark } = useTheme();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!credentials.username || !credentials.password) {
      toast.error('Por favor ingresa usuario y contraseña');
      return;
    }

    const result = login(credentials.username, credentials.password);

    if (result.success) {
      toast.success('¡Bienvenido al panel de administración!');
      navigate('/admin');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle} className="fade-in">
        <div style={headerStyle}>
          <div style={{
            ...iconContainerStyle,
            backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe'
          }}>
            <ShieldCheck size={48} color={isDark ? '#60a5fa' : '#1e40af'} />
          </div>
          <h2 style={titleStyle}>Panel de Administración</h2>
          <p style={subtitleStyle}>Ingresa tus credenciales para continuar</p>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              <User size={18} />
              <span>Usuario</span>
            </label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              onFocus={() => setFocusedField('username')}
              onBlur={() => setFocusedField(null)}
              style={{
                ...inputStyle,
                ...(focusedField === 'username' ? inputFocusStyle : {})
              }}
              placeholder="Ingresa tu usuario"
              autoComplete="username"
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              <Lock size={18} />
              <span>Contraseña</span>
            </label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              style={{
                ...inputStyle,
                ...(focusedField === 'password' ? inputFocusStyle : {})
              }}
              placeholder="Ingresa tu contraseña"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            style={submitButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary-blue-hover)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary-blue)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            <LogIn size={20} />
            <span>Iniciar Sesión</span>
          </button>
        </form>

        <div style={infoBoxStyle}>
          <p style={infoTitleStyle}>👤 Usuarios de demostración:</p>
          <ul style={infoListStyle}>
            <li><strong>admin</strong> / admin123</li>
            <li><strong>director</strong> / dir123</li>
            <li><strong>control</strong> / ctrl123</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Estilos
const containerStyle = {
  minHeight: 'calc(100vh - 80px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem',
  backgroundColor: 'var(--bg-secondary)',
  transition: 'background-color 0.3s ease'
};

const cardStyle = {
  backgroundColor: 'var(--bg-card)',
  borderRadius: '1rem',
  padding: '2.5rem',
  boxShadow: 'var(--shadow-xl)',
  maxWidth: '450px',
  width: '100%',
  border: '1px solid var(--border-color)',
  transition: 'all 0.3s ease'
};

const headerStyle = {
  textAlign: 'center',
  marginBottom: '2rem'
};

const iconContainerStyle = {
  display: 'inline-flex',
  padding: '1rem',
  borderRadius: '50%',
  marginBottom: '1rem',
  transition: 'all 0.3s ease'
};

const titleStyle = {
  fontSize: '1.75rem',
  fontWeight: '700',
  color: 'var(--primary-blue)',
  marginBottom: '0.5rem',
  transition: 'color 0.3s ease'
};

const subtitleStyle = {
  color: 'var(--text-secondary)',
  fontSize: '0.875rem',
  transition: 'color 0.3s ease'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem'
};

const inputGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
};

const labelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontWeight: '500',
  color: 'var(--text-primary)',
  fontSize: '0.875rem',
  transition: 'color 0.3s ease'
};

const inputStyle = {
  padding: '0.75rem 1rem',
  border: '2px solid var(--border-color)',
  borderRadius: '0.5rem',
  fontSize: '1rem',
  width: '100%',
  backgroundColor: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  transition: 'all 0.2s ease',
  outline: 'none'
};

const inputFocusStyle = {
  borderColor: 'var(--primary-blue-light)',
  boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
};

const submitButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  padding: '1rem',
  backgroundColor: 'var(--primary-blue)',
  color: 'white',
  border: 'none',
  borderRadius: '0.5rem',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  marginTop: '0.5rem',
  boxShadow: 'var(--shadow-sm)'
};

const infoBoxStyle = {
  marginTop: '2rem',
  padding: '1rem',
  backgroundColor: 'var(--bg-hover)',
  borderRadius: '0.5rem',
  borderLeft: '4px solid var(--primary-blue-light)',
  transition: 'all 0.3s ease'
};

const infoTitleStyle = {
  fontSize: '0.875rem',
  fontWeight: '600',
  color: 'var(--text-primary)',
  marginBottom: '0.5rem',
  transition: 'color 0.3s ease'
};

const infoListStyle = {
  fontSize: '0.75rem',
  color: 'var(--text-secondary)',
  paddingLeft: '1.25rem',
  margin: 0,
  lineHeight: '1.75',
  transition: 'color 0.3s ease'
};

export default Login;

