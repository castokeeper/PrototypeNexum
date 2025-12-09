import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SolicitudesProvider } from './context/SolicitudesContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navigation from './components/Navigation';
import Loading from './components/common/Loading';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute, { AdminRoute } from './components/ProtectedRoute';

const Home = lazy(() => import('./components/Home'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const AlumnosAceptados = lazy(() => import('./components/AlumnosAceptados'));
const Login = lazy(() => import('./components/Login'));
const RegistroFicha = lazy(() => import('./components/RegistroFicha'));
const ConsultaFicha = lazy(() => import('./components/ConsultaFicha'));
const AdminListaEspera = lazy(() => import('./components/AdminListaEspera'));
const AdminAlumnos = lazy(() => import('./components/AdminAlumnos'));
const AdminCalificaciones = lazy(() => import('./components/AdminCalificaciones'));
const PortalAspirante = lazy(() => import('./components/PortalAspirante'));
const FormularioInscripcion = lazy(() => import('./components/FormularioInscripcion'));
const ProcesoPago = lazy(() => import('./components/ProcesoPago'));
const PagoExitoso = lazy(() => import('./components/PagoExitoso'));
const PagoCancelado = lazy(() => import('./components/PagoCancelado'));

const ThemedToastContainer = () => {
  const { theme } = useTheme();

  return (
    <ToastContainer
      position="top-right"
      autoClose={3500}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={theme === 'dark' ? 'dark' : 'colored'}
      style={{ fontSize: '0.95rem', fontWeight: '500' }}
      toastClassName={() =>
        "relative flex p-4 min-h-16 rounded-xl overflow-hidden cursor-pointer shadow-xl"
      }
      bodyClassName={() => "flex items-center gap-2 px-2"}
    />
  );
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ThemeProvider>
          <AuthProvider>
            <SolicitudesProvider>
              <div
                className="min-h-screen w-full flex flex-col transition-colors duration-300"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)'
                }}
              >
                <Navigation />

                <main className="flex-1 w-full">
                  <Suspense fallback={<Loading message="Cargando..." overlay />}>
                    <Routes>
                      {/* Rutas Publicas */}
                      <Route path="/" element={<Home />} />
                      <Route path="/aceptados" element={<AlumnosAceptados />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/registro-ficha" element={<RegistroFicha />} />
                      <Route path="/consulta-ficha" element={<ConsultaFicha />} />

                      {/* Rutas de Aspirantes */}
                      <Route
                        path="/portal-aspirante"
                        element={
                          <ProtectedRoute allowedRoles={['aspirante']}>
                            <PortalAspirante />
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/portal-aspirante/inscripcion"
                        element={
                          <ProtectedRoute allowedRoles={['aspirante']} requireAccepted>
                            <FormularioInscripcion />
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/proceso-pago"
                        element={
                          <ProtectedRoute allowedRoles={['aspirante']} requireAccepted>
                            <ProcesoPago />
                          </ProtectedRoute>
                        }
                      />

                      <Route path="/pago-exitoso" element={<PagoExitoso />} />
                      <Route path="/pago-cancelado" element={<PagoCancelado />} />

                      {/* Rutas de Administracion */}
                      <Route
                        path="/admin"
                        element={
                          <AdminRoute>
                            <AdminPanel />
                          </AdminRoute>
                        }
                      />

                      <Route
                        path="/admin/lista-espera"
                        element={
                          <AdminRoute>
                            <AdminListaEspera />
                          </AdminRoute>
                        }
                      />

                      <Route
                        path="/admin/alumnos"
                        element={
                          <AdminRoute>
                            <AdminAlumnos />
                          </AdminRoute>
                        }
                      />

                      <Route
                        path="/admin/calificaciones"
                        element={
                          <AdminRoute>
                            <AdminCalificaciones />
                          </AdminRoute>
                        }
                      />
                    </Routes>
                  </Suspense>
                </main>

                <ThemedToastContainer />
              </div>
            </SolicitudesProvider>
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
