import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, RefreshCw, Shield, LogOut, User, CheckCircle, Sun, Moon, FileText, Search, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';

const Navigation = () => {
  const { isAuthenticated, usuario, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info('Sesión cerrada correctamente');
    navigate('/');
  };

  return (
    <nav style={{
      backgroundColor: 'var(--primary-blue)',
      padding: '1rem',
      boxShadow: 'var(--shadow-md)',
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        maxWidth: '100%',
        margin: '0 auto',
        padding: '0 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h1 style={{ color: 'white', margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
          Nexum
        </h1>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link to="/" style={linkStyle}>
            <UserPlus size={20} />
            <span>Nuevo Ingreso</span>
          </Link>
          <Link to="/reinscripcion" style={linkStyle}>
            <RefreshCw size={20} />
            <span>Reinscripción</span>
          </Link>

          {/* Nuevos links para fichas de examen */}
          <Link to="/registro-ficha" style={{ ...linkStyle, backgroundColor: '#8b5cf6' }}>
            <FileText size={20} />
            <span>Registro Examen</span>
          </Link>
          <Link to="/consulta-ficha" style={{ ...linkStyle, backgroundColor: '#06b6d4' }}>
            <Search size={20} />
            <span>Consultar Ficha</span>
          </Link>

          <Link to="/aceptados" style={{ ...linkStyle, backgroundColor: 'var(--success-green)' }}>
            <CheckCircle size={20} />
            <span>Aceptados</span>
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/admin" style={linkStyle}>
                <Shield size={20} />
                <span>Administración</span>
              </Link>
              <Link to="/admin/lista-espera" style={{ ...linkStyle, backgroundColor: '#f59e0b' }}>
                <Users size={20} />
                <span>Lista Espera</span>
              </Link>
              <div style={userInfoStyle}>
                <User size={18} />
                <span>{usuario?.nombre}</span>
              </div>
              <button onClick={handleLogout} style={logoutButtonStyle}>
                <LogOut size={18} />
                <span>Salir</span>
              </button>
            </>
          ) : (
            <Link to="/login" style={{ ...linkStyle, backgroundColor: 'var(--warning-orange)' }}>
              <Shield size={20} />
              <span>Admin</span>
            </Link>
          )}
          <button
            onClick={toggleTheme}
            style={themeButtonStyle}
            title={theme === 'light' ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro'}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.5rem 1rem',
  borderRadius: '0.5rem',
  transition: 'all 0.2s ease',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  fontSize: '0.875rem',
  fontWeight: '500'
};

const userInfoStyle = {
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.5rem 1rem',
  borderRadius: '0.5rem',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  fontSize: '0.875rem',
  fontWeight: '500'
};

const logoutButtonStyle = {
  color: 'white',
  backgroundColor: 'var(--danger-red)',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.5rem 1rem',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: '500',
  transition: 'all 0.2s ease'
};

const themeButtonStyle = {
  color: 'white',
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.5rem',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  width: '40px',
  height: '40px'
};

// Agregar estilos de hover en línea para mejor soporte de temas
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    nav a:hover {
      background-color: rgba(255, 255, 255, 0.2) !important;
      transform: translateY(-2px);
    }
    nav button:hover {
      transform: translateY(-2px);
      filter: brightness(1.1);
    }
  `;
  if (!document.getElementById('nav-hover-styles')) {
    style.id = 'nav-hover-styles';
    document.head.appendChild(style);
  }
}

export default Navigation;
