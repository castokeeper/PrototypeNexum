import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';
import { Lock, User, LogIn, ShieldCheck, Sparkles, Eye, EyeOff } from 'lucide-react';
import { Button, Input, Card } from './common';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDark } = useTheme();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        toast.success(`Bienvenido, ${result.usuario.nombre}`);
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

  // Estilos basados en tema
  const styles = {
    card: {
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderColor: isDark ? '#334155' : '#e2e8f0'
    },
    demoBox: {
      backgroundColor: isDark ? '#334155' : '#f1f5f9',
      borderColor: isDark ? '#475569' : '#cbd5e1'
    },
    demoItem: {
      backgroundColor: 'transparent'
    },
    demoItemHover: isDark ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff',
    badge: {
      admin: {
        backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe',
        color: isDark ? '#93c5fd' : '#1d4ed8'
      },
      director: {
        backgroundColor: isDark ? 'rgba(139, 92, 246, 0.2)' : '#ede9fe',
        color: isDark ? '#c4b5fd' : '#6d28d9'
      },
      control: {
        backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#d1fae5',
        color: isDark ? '#6ee7b7' : '#047857'
      }
    },
    username: {
      admin: { color: isDark ? '#60a5fa' : '#2563eb' },
      director: { color: isDark ? '#a78bfa' : '#7c3aed' },
      control: { color: isDark ? '#34d399' : '#059669' }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-bg opacity-10"></div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md scale-in">
        <Card
          className="backdrop-blur-sm border shadow-2xl"
          style={styles.card}
        >
          {/* Header */}
          <div className="text-center p-8 pb-6">
            <div className="inline-flex p-4 rounded-2xl gradient-bg mb-4 hover-glow">
              <ShieldCheck size={48} className="text-white" />
            </div>

            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <h2 className="text-3xl font-bold gradient-text">
                Panel de Administración
              </h2>
            </div>

            <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
              Acceso exclusivo para personal autorizado
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
            <div className="space-y-4">
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

              <div className="relative">
                <Input
                  label="Contraseña"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Ingresa tu contraseña"
                  icon={<Lock size={18} />}
                  autoComplete="current-password"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] p-1.5 rounded-lg transition-colors"
                  style={{
                    color: 'var(--text-secondary)',
                    backgroundColor: 'transparent'
                  }}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              icon={<LogIn size={20} />}
              loading={isSubmitting}
              disabled={isSubmitting}
              className="py-3.5 text-base font-semibold rounded-xl hover-lift gradient-bg"
              style={{
                color: 'white',
                border: 'none',
                opacity: isSubmitting ? 0.6 : 1
              }}
            >
              {isSubmitting ? 'Verificando acceso...' : 'Iniciar Sesión'}
            </Button>
          </form>

          {/* Demo Users Info */}
          <div className="px-8 pb-8">
            <div
              className="p-4 rounded-xl border-2 border-dashed"
              style={styles.demoBox}
            >
              <p className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                Usuarios de demostracion
              </p>
              <div className="space-y-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <div className="flex items-center justify-between p-2 rounded-lg transition-colors">
                  <span>
                    <strong style={styles.username.admin}>admin</strong> / admin123
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs"
                    style={styles.badge.admin}
                  >
                    Admin
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg transition-colors">
                  <span>
                    <strong style={styles.username.director}>director</strong> / director123
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs"
                    style={styles.badge.director}
                  >
                    Director
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg transition-colors">
                  <span>
                    <strong style={styles.username.control}>control</strong> / control123
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs"
                    style={styles.badge.control}
                  >
                    Control
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <Lock size={14} className="inline mr-1" />
          Conexión segura y encriptada
        </p>
      </div>
    </div>
  );
};

export default Login;
