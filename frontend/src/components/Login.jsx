import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Lock, User, LogIn, ShieldCheck, Sparkles, Eye, EyeOff } from 'lucide-react';
import { Button, Input, Card } from './common';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
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
        toast.success(`¡Bienvenido ${result.usuario.nombre}! 🎉`);
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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-bg opacity-10"></div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md scale-in">
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-slate-900/90 border border-white/20 shadow-2xl">
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
                  className="absolute right-3 top-[38px] p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
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
            <div className="p-4 rounded-xl border-2 border-dashed" style={{
              borderColor: 'var(--border-color)',
              backgroundColor: 'var(--bg-hover)'
            }}>
              <p className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                👤 Usuarios de demostración
              </p>
              <div className="space-y-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  <span><strong className="text-blue-600 dark:text-blue-400">admin</strong> / admin123</span>
                  <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs">Admin</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                  <span><strong className="text-purple-600 dark:text-purple-400">director</strong> / director123</span>
                  <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs">Director</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
                  <span><strong className="text-green-600 dark:text-green-400">control</strong> / control123</span>
                  <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs">Control</span>
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
