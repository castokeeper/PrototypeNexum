import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

// Usuarios autorizados (en producción esto vendría de una base de datos)
const USUARIOS_AUTORIZADOS = [
  { username: 'admin', password: 'admin123', nombre: 'Administrador' },
  { username: 'director', password: 'dir123', nombre: 'Director' },
  { username: 'control', password: 'ctrl123', nombre: 'Control Escolar' }
];

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar si hay una sesión guardada al cargar
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuarioAuth');
    if (usuarioGuardado) {
      const userData = JSON.parse(usuarioGuardado);
      setUsuario(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (username, password) => {
    const usuarioEncontrado = USUARIOS_AUTORIZADOS.find(
      u => u.username === username && u.password === password
    );

    if (usuarioEncontrado) {
      const userData = {
        username: usuarioEncontrado.username,
        nombre: usuarioEncontrado.nombre
      };
      setUsuario(userData);
      setIsAuthenticated(true);
      localStorage.setItem('usuarioAuth', JSON.stringify(userData));
      return { success: true };
    }

    return { success: false, message: 'Usuario o contraseña incorrectos' };
  };

  const logout = () => {
    setUsuario(null);
    setIsAuthenticated(false);
    localStorage.removeItem('usuarioAuth');
  };

  return (
    <AuthContext.Provider value={{
      usuario,
      isAuthenticated,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

