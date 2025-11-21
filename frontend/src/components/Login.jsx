import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Lock, User, LogIn, ShieldCheck } from 'lucide-react';
import { Button, Input, Card } from './common';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.username || !credentials.password) {
      toast.error('Por favor ingresa usuario y contraseña');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login(credentials.username, credentials.password);

      if (result.success) {
        toast.success(`¡Bienvenido ${result.usuario.nombre}!`);
        navigate('/admin');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Error al iniciar sesión. Por favor intenta de nuevo.');
      console.error('Error en login:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={containerStyle}>
      <Card padding="comfortable" style={{ maxWidth: '450px', width: '100%' }}>
        <div style={headerStyle}>
          <div style={iconContainerStyle}>
            <ShieldCheck size={48} color="var(--primary-blue)" />
          </div>
          <h2 style={titleStyle}>Panel de Administración</h2>
          <p style={subtitleStyle}>Ingresa tus credenciales para continuar</p>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <Input
            label="Usuario"
            name="username"
            type="text"
            value={credentials.username}
            onChange={handleChange}
            placeholder="Ingresa tu usuario"
            icon={<User size={18} />}
            autoComplete="username"
            required
            disabled={isSubmitting}
          />

          <Input
            label="Contraseña"
            name="password"
            type="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Ingresa tu contraseña"
            icon={<Lock size={18} />}
            autoComplete="current-password"
            required
            disabled={isSubmitting}
          />

          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            icon={<LogIn size={20} />}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>

        <div style={infoBoxStyle}>
          <p style={infoTitleStyle}>👤 Usuarios de demostración:</p>
          <ul style={infoListStyle}>
            <li><strong>admin</strong> / admin123 - Administrador</li>
            <li><strong>director</strong> / director123 - Director</li>
            <li><strong>control</strong> / control123 - Control Escolar</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

// Estilos mínimos
const containerStyle = {
  minHeight: 'calc(100vh - 80px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem',
  backgroundColor: 'var(--bg-secondary)',
  transition: 'background-color 0.3s ease'
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
  backgroundColor: 'rgba(59, 130, 246, 0.1)',
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
  gap: '1.5rem',
  marginBottom: '2rem'
};

const infoBoxStyle = {
  backgroundColor: 'var(--bg-hover)',
  borderRadius: '0.5rem',
  padding: '1rem',
  marginTop: '1.5rem',
  border: '1px solid var(--border-color)',
  transition: 'all 0.3s ease'
};

const infoTitleStyle = {
  fontSize: '0.875rem',
  fontWeight: '600',
  color: 'var(--text-primary)',
  marginBottom: '0.75rem',
  transition: 'color 0.3s ease'
};

const infoListStyle = {
  fontSize: '0.8125rem',
  color: 'var(--text-secondary)',
  listStyleType: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  transition: 'color 0.3s ease'
};

export default Login;

