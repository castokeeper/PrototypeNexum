import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SolicitudesProvider } from './context/SolicitudesContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navigation from './components/Navigation';
import Loading from './components/common/Loading';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy loading de componentes para mejorar el performance
const NuevoIngreso = lazy(() => import('./components/NuevoIngreso'));
const Reinscripcion = lazy(() => import('./components/Reinscripcion'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const AlumnosAceptados = lazy(() => import('./components/AlumnosAceptados'));
const Login = lazy(() => import('./components/Login'));
const RegistroFicha = lazy(() => import('./components/RegistroFicha'));
const ConsultaFicha = lazy(() => import('./components/ConsultaFicha'));
const AdminListaEspera = lazy(() => import('./components/AdminListaEspera'));
const AdminAlumnos = lazy(() => import('./components/AdminAlumnos'));
const PortalAspirante = lazy(() => import('./components/PortalAspirante'));
const FormularioInscripcion = lazy(() => import('./components/FormularioInscripcion'));
const ProcesoPago = lazy(() => import('./components/ProcesoPago'));
const PagoExitoso = lazy(() => import('./components/PagoExitoso'));
const PagoCancelado = lazy(() => import('./components/PagoCancelado'));

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ThemeProvider>
          <AuthProvider>
            <SolicitudesProvider>
              <div style={{
                minHeight: '100vh',
                width: '100%',
                backgroundColor: 'var(--bg-secondary)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'background-color 0.3s ease'
              }}>
                <Navigation />
                <div style={{ flex: 1, width: '100%' }}>
                  <Suspense fallback={<Loading message="Cargando..." overlay />}>
                    <Routes>
                      <Route path="/" element={<NuevoIngreso />} />
                      <Route path="/reinscripcion" element={<Reinscripcion />} />
                      <Route path="/aceptados" element={<AlumnosAceptados />} />
                      <Route path="/login" element={<Login />} />

                      {/* Rutas públicas para fichas de examen */}
                      <Route path="/registro-ficha" element={<RegistroFicha />} />
                      <Route path="/consulta-ficha" element={<ConsultaFicha />} />

                      {/* Rutas protegidas para aspirantes */}
                      <Route
                        path="/portal-aspirante"
                        element={
                          <ProtectedRoute>
                            <PortalAspirante />
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/portal-aspirante/inscripcion"
                        element={
                          <ProtectedRoute>
                            <FormularioInscripcion />
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/proceso-pago"
                        element={
                          <ProtectedRoute>
                            <ProcesoPago />
                          </ProtectedRoute>
                        }
                      />

                      <Route path="/pago-exitoso" element={<PagoExitoso />} />
                      <Route path="/pago-cancelado" element={<PagoCancelado />} />

                      {/* Rutas protegidas de admin */}
                      <Route
                        path="/admin"
                        element={
                          <ProtectedRoute>
                            <AdminPanel />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/lista-espera"
                        element={
                          <ProtectedRoute>
                            <AdminListaEspera />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/alumnos"
                        element={
                          <ProtectedRoute>
                            <AdminAlumnos />
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  </Suspense>
                </div>
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="colored"
                />
              </div>
            </SolicitudesProvider>
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
