import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verificar si hay una sesión guardada al cargar
  useEffect(() => {
    const verificarSesion = async () => {
      const token = localStorage.getItem('token');
      const usuarioGuardado = localStorage.getItem('usuario');

      if (token && usuarioGuardado) {
        try {
          // Verificar que el token siga siendo válido
          const response = await fetch('/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const userData = JSON.parse(usuarioGuardado);
            setUsuario(userData);
            setIsAuthenticated(true);
          } else {
            // Token inválido o expirado
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
          }
        } catch (error) {
          console.error('Error al verificar sesión:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
        }
      }
      setLoading(false);
    };

    verificarSesion();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Backend no devolvió JSON. Status:', response.status);
        return {
          success: false,
          message: 'Error en el servidor. Por favor intenta más tarde.'
        };
      }

      const data = await response.json();

      if (response.ok && data.token) {
        // Guardar token y datos del usuario
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));

        setUsuario(data.usuario);
        setIsAuthenticated(true);

        return { success: true, usuario: data.usuario };
      } else {
        return {
          success: false,
          message: data.error || 'Usuario o contraseña incorrectos'
        };
      }
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        message: 'Error al conectar con el servidor. Por favor verifica que el backend esté corriendo.'
      };
    }
  };

  const logout = () => {
    setUsuario(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    // Limpiar también la clave antigua si existiera
    localStorage.removeItem('usuarioAuth');
  };

  return (
    <AuthContext.Provider value={{
      usuario,
      isAuthenticated,
      loading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

