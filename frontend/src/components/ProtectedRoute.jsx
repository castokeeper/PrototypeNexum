import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './common/Loading';

/**
 * ProtectedRoute - Componente para rutas protegidas con control de roles
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente a renderizar si está autorizado
 * @param {string[]} props.allowedRoles - Roles permitidos (opcional)
 * @param {boolean} props.requireAccepted - Si requiere que el aspirante esté aceptado (opcional)
 */
const ProtectedRoute = ({
  children,
  allowedRoles = [],
  requireAccepted = false
}) => {
  const { isAuthenticated, usuario, loading } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return <Loading message="Verificando acceso..." overlay />;
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar roles si se especificaron
  if (allowedRoles.length > 0 && !allowedRoles.includes(usuario?.rol)) {
    // Si es aspirante pero intenta acceder a rutas de admin
    if (usuario?.rol === 'aspirante') {
      return <Navigate to="/portal-aspirante" replace />;
    }
    // Si es admin pero intenta acceder a rutas de aspirante
    return <Navigate to="/admin" replace />;
  }

  // Verificar si el aspirante necesita estar aceptado
  if (requireAccepted && usuario?.rol === 'aspirante') {
    if (usuario?.estatus !== 'aceptado') {
      return <Navigate to="/portal-aspirante" replace />;
    }
  }

  return children;
};

/**
 * Componente para rutas solo de administradores
 */
export const AdminRoute = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={['admin', 'director', 'control_escolar']}>
      {children}
    </ProtectedRoute>
  );
};

/**
 * Componente para rutas solo de aspirantes
 */
export const AspiranteRoute = ({ children, requireAccepted = false }) => {
  return (
    <ProtectedRoute allowedRoles={['aspirante']} requireAccepted={requireAccepted}>
      {children}
    </ProtectedRoute>
  );
};

export default ProtectedRoute;
