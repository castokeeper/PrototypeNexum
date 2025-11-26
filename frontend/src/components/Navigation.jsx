import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserPlus, RefreshCw, Shield, LogOut, User, CheckCircle, Sun, Moon, FileText, Search, Users, Menu, X, ChevronDown, Home, GraduationCap, Settings } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';

const Navigation = () => {
  const { isAuthenticated, usuario, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solicitudesOpen, setSolicitudesOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.info('Sesión cerrada correctamente');
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  // Navegación principal para usuarios
  const mainNavLinks = [
    { to: '/', icon: Home, label: 'Inicio', description: 'Página principal' },
  ];

  // Dropdown de Solicitudes
  const solicitudesLinks = [
    { to: '/', icon: UserPlus, label: 'Nuevo Ingreso', description: 'Primera vez en la institución' },
    { to: '/reinscripcion', icon: RefreshCw, label: 'Reinscripción', description: 'Renovar matrícula' },
    { to: '/registro-ficha', icon: FileText, label: 'Registro de Examen', description: 'Solicitar ficha' },
    { to: '/consulta-ficha', icon: Search, label: 'Consultar Ficha', description: 'Ver estado de ficha' },
  ];

  // Navegación de resultados
  const resultsLinks = [
    { to: '/aceptados', icon: CheckCircle, label: 'Alumnos Aceptados', description: 'Ver estudiantes admitidos' },
  ];

  // Navegación de administración
  const adminLinks = isAuthenticated ? [
    { to: '/admin', icon: Settings, label: 'Panel Admin', description: 'Administración general' },
    { to: '/admin/lista-espera', icon: Users, label: 'Lista de Espera', description: 'Gestionar aspirantes' },
    { to: '/admin/alumnos', icon: GraduationCap, label: 'Alumnos', description: 'Gestionar estudiantes' },
  ] : [];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 shadow-2xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 scale-in group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-all">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  ✨ Nexum
                </h1>
                <p className="text-xs text-white/70">Sistema de Admisiones</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {/* Inicio */}
            {mainNavLinks.map((link) => (
              <NavButton
                key={link.to}
                to={link.to}
                icon={link.icon}
                label={link.label}
                isActive={isActive(link.to)}
              />
            ))}

            {/* Solicitudes Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSolicitudesOpen(!solicitudesOpen)}
                className={`
                  flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl text-white
                  transition-all duration-200 hover:bg-white/20
                  ${solicitudesOpen ? 'bg-white/20' : ''}
                `}
              >
                <div className="flex items-center gap-2">
                  <FileText size={20} />
                  <span className="text-sm font-medium">Solicitudes</span>
                  <ChevronDown size={16} className={`transition-transform ${solicitudesOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {solicitudesOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden scale-in">
                  {solicitudesLinks.map((link) => (
                    <DropdownLink
                      key={link.to}
                      to={link.to}
                      icon={link.icon}
                      label={link.label}
                      description={link.description}
                      isActive={isActive(link.to)}
                      onClick={() => setSolicitudesOpen(false)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Resultados */}
            {resultsLinks.map((link) => (
              <NavButton
                key={link.to}
                to={link.to}
                icon={link.icon}
                label={link.label}
                isActive={isActive(link.to)}
                color="green"
              />
            ))}

            {/* Admin Dropdown */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setAdminOpen(!adminOpen)}
                  className={`
                    flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl text-white
                    transition-all duration-200 hover:bg-orange-500/30
                    ${adminOpen ? 'bg-orange-500/30' : ''}
                  `}
                >
                  <div className="flex items-center gap-2">
                    <Shield size={20} />
                    <span className="text-sm font-medium">Administración</span>
                    <ChevronDown size={16} className={`transition-transform ${adminOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {adminOpen && (
                  <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden scale-in">
                    {adminLinks.map((link) => (
                      <DropdownLink
                        key={link.to}
                        to={link.to}
                        icon={link.icon}
                        label={link.label}
                        description={link.description}
                        isActive={isActive(link.to)}
                        onClick={() => setAdminOpen(false)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {!isAuthenticated && (
              <NavButton
                to="/login"
                icon={Shield}
                label="Admin"
                isActive={isActive('/login')}
                color="orange"
              />
            )}

            {/* User Info & Actions */}
            {isAuthenticated && (
              <>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 text-white ml-2">
                  <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">
                    <User size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-white/70">Hola,</span>
                    <span className="text-sm font-semibold">{usuario?.nombre}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/90 hover:bg-red-600 text-white transition-all hover:scale-105"
                  title="Cerrar sesión"
                >
                  <LogOut size={18} />
                </button>
              </>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-white/20 text-white hover:bg-white/30 transition-all hover:scale-110"
              title={theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/20 text-white"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 backdrop-blur-md bg-blue-700/95 slide-in max-h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {/* Main Links */}
            {mainNavLinks.map((link) => (
              <MobileNavLink
                key={link.to}
                to={link.to}
                icon={link.icon}
                label={link.label}
                description={link.description}
                isActive={isActive(link.to)}
                onClick={() => setMobileMenuOpen(false)}
              />
            ))}

            {/* Solicitudes Section */}
            <div className="py-2">
              <p className="px-3 text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                Solicitudes
              </p>
              {solicitudesLinks.map((link) => (
                <MobileNavLink
                  key={link.to}
                  to={link.to}
                  icon={link.icon}
                  label={link.label}
                  description={link.description}
                  isActive={isActive(link.to)}
                  onClick={() => setMobileMenuOpen(false)}
                />
              ))}
            </div>

            {/* Results Section */}
            <div className="py-2">
              <p className="px-3 text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                Resultados
              </p>
              {resultsLinks.map((link) => (
                <MobileNavLink
                  key={link.to}
                  to={link.to}
                  icon={link.icon}
                  label={link.label}
                  description={link.description}
                  isActive={isActive(link.to)}
                  onClick={() => setMobileMenuOpen(false)}
                />
              ))}
            </div>

            {/* Admin Section */}
            {isAuthenticated && (
              <div className="py-2">
                <p className="px-3 text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                  Administración
                </p>
                {adminLinks.map((link) => (
                  <MobileNavLink
                    key={link.to}
                    to={link.to}
                    icon={link.icon}
                    label={link.label}
                    description={link.description}
                    isActive={isActive(link.to)}
                    onClick={() => setMobileMenuOpen(false)}
                  />
                ))}
              </div>
            )}

            {!isAuthenticated && (
              <MobileNavLink
                to="/login"
                icon={Shield}
                label="Iniciar Sesión"
                description="Acceso administrativo"
                isActive={isActive('/login')}
                onClick={() => setMobileMenuOpen(false)}
              />
            )}

            {/* User Info Mobile */}
            {isAuthenticated && (
              <>
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/20 text-white mt-2">
                  <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-white/70">Sesión iniciada como</p>
                    <p className="font-semibold">{usuario?.nombre}</p>
                    <p className="text-xs text-white/70 capitalize">{usuario?.rol}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500/90 hover:bg-red-600 text-white font-medium transition-colors mt-2"
                >
                  <LogOut size={20} />
                  <span>Cerrar Sesión</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

// Desktop Nav Button Component
const NavButton = ({ to, icon: Icon, label, isActive, color = 'blue' }) => {
  const colorClasses = {
    blue: 'hover:bg-blue-500/20',
    green: 'hover:bg-green-500/20',
    orange: 'hover:bg-orange-500/20',
  };

  return (
    <Link
      to={to}
      className={`
        flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl text-white
        transition-all duration-200 hover:scale-105
        ${isActive
          ? 'bg-white/25 shadow-lg'
          : colorClasses[color]
        }
      `}
    >
      <Icon size={22} />
      <span className="text-xs font-medium whitespace-nowrap">{label}</span>
    </Link>
  );
};

// Dropdown Link Component
const DropdownLink = ({ to, icon: Icon, label, description, isActive, onClick }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`
        flex items-start gap-3 px-4 py-3 transition-all
        ${isActive
          ? 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-600'
          : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
        }
      `}
    >
      <Icon size={20} className={`mt-0.5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`} />
      <div className="flex-1">
        <p className={`text-sm font-semibold ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
          {label}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {description}
        </p>
      </div>
    </Link>
  );
};

// Mobile Nav Link Component
const MobileNavLink = ({ to, icon: Icon, label, description, isActive, onClick }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`
        flex items-start gap-3 px-4 py-3 rounded-lg font-medium
        transition-all duration-200
        ${isActive
          ? 'bg-white/25 text-white shadow-lg'
          : 'text-white/90 hover:bg-white/10'
        }
      `}
    >
      <Icon size={22} className="mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <p className="font-semibold">{label}</p>
        {description && (
          <p className="text-xs text-white/70 mt-0.5">{description}</p>
        )}
      </div>
    </Link>
  );
};

export default Navigation;
