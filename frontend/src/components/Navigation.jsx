import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Shield, LogOut, User, CheckCircle, Sun, Moon, FileText, Search,
  Users, Menu, X, ChevronDown, Home, GraduationCap, Settings, ClipboardList, Award
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';

const Navigation = () => {
  const { isAuthenticated, usuario, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const adminRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (adminRef.current && !adminRef.current.contains(event.target)) {
        setAdminOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setAdminOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    toast.info('Sesion cerrada correctamente');
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;
  const isAdmin = isAuthenticated && ['admin', 'director', 'control_escolar'].includes(usuario?.rol);
  const isAspirante = isAuthenticated && usuario?.rol === 'aspirante';

  const navLinkStyle = (active) => ({
    color: active ? 'var(--primary-blue)' : 'var(--text-primary)',
    fontWeight: active ? '600' : '500'
  });

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-color)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to={isAdmin ? '/admin' : '/'}
            className="flex items-center gap-3"
          >
            <div
              className="p-2 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--primary-blue)' }}
            >
              <img
                src="/logo.svg"
                alt="Nexum Logo"
                className="w-6 h-6"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>
            <div className="hidden sm:block">
              <span
                className="text-xl font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                Nexum
              </span>
              <span
                className="block text-xs"
                style={{ color: 'var(--text-secondary)' }}
              >
                Sistema de Admisiones
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {!isAdmin && (
              <>
                <Link
                  to="/"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                  style={navLinkStyle(isActive('/'))}
                >
                  <Home size={18} />
                  Inicio
                </Link>

                {!isAspirante && (
                  <>
                    <Link
                      to="/registro-ficha"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                      style={navLinkStyle(isActive('/registro-ficha'))}
                    >
                      <FileText size={18} />
                      Solicitar Ficha
                    </Link>

                    <Link
                      to="/consulta-ficha"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                      style={navLinkStyle(isActive('/consulta-ficha'))}
                    >
                      <Search size={18} />
                      Consultar Ficha
                    </Link>
                  </>
                )}

                {isAspirante && (
                  <Link
                    to="/portal-aspirante"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                    style={navLinkStyle(isActive('/portal-aspirante'))}
                  >
                    <ClipboardList size={18} />
                    Mi Portal
                  </Link>
                )}

                <Link
                  to="/aceptados"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                  style={navLinkStyle(isActive('/aceptados'))}
                >
                  <CheckCircle size={18} />
                  Aceptados
                </Link>
              </>
            )}

            {isAdmin && (
              <div className="relative" ref={adminRef}>
                <button
                  onClick={() => setAdminOpen(!adminOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <Shield size={18} />
                  Administracion
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${adminOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {adminOpen && (
                  <div
                    className="absolute top-full left-0 mt-2 w-56 rounded-lg shadow-lg border py-2"
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-color)'
                    }}
                  >
                    <Link
                      to="/admin"
                      className="flex items-center gap-3 px-4 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      <Settings size={18} />
                      Panel Principal
                    </Link>
                    <Link
                      to="/admin/lista-espera"
                      className="flex items-center gap-3 px-4 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      <Users size={18} />
                      Lista de Espera
                    </Link>
                    <Link
                      to="/admin/alumnos"
                      className="flex items-center gap-3 px-4 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      <GraduationCap size={18} />
                      Alumnos Inscritos
                    </Link>
                    <Link
                      to="/admin/calificaciones"
                      className="flex items-center gap-3 px-4 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      <Award size={18} />
                      Calificaciones
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Cambiar tema"
              style={{ color: 'var(--text-secondary)' }}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right">
                  <p
                    className="text-sm font-medium"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {usuario?.nombre}
                  </p>
                  <p
                    className="text-xs capitalize"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {usuario?.rol}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                  style={{ color: '#ef4444' }}
                  title="Cerrar sesion"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
                style={{
                  backgroundColor: 'var(--primary-blue)',
                  color: 'white'
                }}
              >
                <User size={18} />
                Acceder
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              style={{ color: 'var(--text-primary)' }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          className="md:hidden border-t"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)'
          }}
        >
          <div className="px-4 py-4 space-y-2">
            {!isAdmin && (
              <>
                <Link
                  to="/"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
                  style={{
                    backgroundColor: isActive('/') ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                    color: isActive('/') ? 'var(--primary-blue)' : 'var(--text-primary)'
                  }}
                >
                  <Home size={20} />
                  Inicio
                </Link>

                {!isAspirante && (
                  <>
                    <Link
                      to="/registro-ficha"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
                      style={{
                        backgroundColor: isActive('/registro-ficha') ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                        color: isActive('/registro-ficha') ? 'var(--primary-blue)' : 'var(--text-primary)'
                      }}
                    >
                      <FileText size={20} />
                      Solicitar Ficha
                    </Link>

                    <Link
                      to="/consulta-ficha"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
                      style={{
                        backgroundColor: isActive('/consulta-ficha') ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                        color: isActive('/consulta-ficha') ? 'var(--primary-blue)' : 'var(--text-primary)'
                      }}
                    >
                      <Search size={20} />
                      Consultar Ficha
                    </Link>
                  </>
                )}

                {isAspirante && (
                  <Link
                    to="/portal-aspirante"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
                    style={{
                      backgroundColor: isActive('/portal-aspirante') ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                      color: isActive('/portal-aspirante') ? 'var(--primary-blue)' : 'var(--text-primary)'
                    }}
                  >
                    <ClipboardList size={20} />
                    Mi Portal
                  </Link>
                )}

                <Link
                  to="/aceptados"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
                  style={{
                    backgroundColor: isActive('/aceptados') ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                    color: isActive('/aceptados') ? 'var(--primary-blue)' : 'var(--text-primary)'
                  }}
                >
                  <CheckCircle size={20} />
                  Aceptados
                </Link>
              </>
            )}

            {isAdmin && (
              <>
                <Link
                  to="/admin"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
                  style={{
                    backgroundColor: isActive('/admin') ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                    color: isActive('/admin') ? 'var(--primary-blue)' : 'var(--text-primary)'
                  }}
                >
                  <Settings size={20} />
                  Panel Principal
                </Link>
                <Link
                  to="/admin/lista-espera"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
                  style={{
                    backgroundColor: isActive('/admin/lista-espera') ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                    color: isActive('/admin/lista-espera') ? 'var(--primary-blue)' : 'var(--text-primary)'
                  }}
                >
                  <Users size={20} />
                  Lista de Espera
                </Link>
                <Link
                  to="/admin/alumnos"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
                  style={{
                    backgroundColor: isActive('/admin/alumnos') ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                    color: isActive('/admin/alumnos') ? 'var(--primary-blue)' : 'var(--text-primary)'
                  }}
                >
                  <GraduationCap size={20} />
                  Alumnos Inscritos
                </Link>
                <Link
                  to="/admin/calificaciones"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
                  style={{
                    backgroundColor: isActive('/admin/calificaciones') ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                    color: isActive('/admin/calificaciones') ? 'var(--primary-blue)' : 'var(--text-primary)'
                  }}
                >
                  <Award size={20} />
                  Calificaciones
                </Link>
              </>
            )}

            <div
              className="border-t pt-4 mt-4"
              style={{ borderColor: 'var(--border-color)' }}
            >
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div
                    className="px-4 py-2 rounded-lg"
                    style={{ backgroundColor: 'var(--bg-hover)' }}
                  >
                    <p
                      className="font-medium"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {usuario?.nombre}
                    </p>
                    <p
                      className="text-sm capitalize"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {usuario?.rol}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
                    style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      color: '#ef4444'
                    }}
                  >
                    <LogOut size={20} />
                    Cerrar Sesion
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium"
                  style={{
                    backgroundColor: 'var(--primary-blue)',
                    color: 'white'
                  }}
                >
                  <User size={20} />
                  Acceder al Sistema
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
