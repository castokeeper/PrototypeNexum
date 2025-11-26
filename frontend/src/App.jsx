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
              <div className="min-h-screen w-full flex flex-col" style={{
                backgroundColor: 'var(--bg-secondary)',
                transition: 'background-color 0.3s ease'
              }}>
                <Navigation />

                {/* Main Content Area */}
                <main className="flex-1 w-full">
                  <Suspense fallback={<Loading message="Cargando..." overlay />}>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<NuevoIngreso />} />
                      <Route path="/reinscripcion" element={<Reinscripcion />} />
                      <Route path="/aceptados" element={<AlumnosAceptados />} />
                      <Route path="/login" element={<Login />} />

                      {/* Exam Form Routes */}
                      <Route path="/registro-ficha" element={<RegistroFicha />} />
                      <Route path="/consulta-ficha" element={<ConsultaFicha />} />

                      {/* Protected Routes - Aspirants */}
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

                      {/* Protected Routes - Admin */}
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
                </main>

                {/* Toast Notifications */}
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
                  theme="colored"
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: '500'
                  }}
                  toastClassName={() =>
                    "relative flex p-4 min-h-16 rounded-xl overflow-hidden cursor-pointer shadow-xl"
                  }
                  bodyClassName={() => "flex items-center gap-2 px-2"}
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
