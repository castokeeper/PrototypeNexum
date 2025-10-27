import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SolicitudesProvider } from './context/SolicitudesContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navigation from './components/Navigation';
import NuevoIngreso from './components/NuevoIngreso';
import Reinscripcion from './components/Reinscripcion';
import AdminPanel from './components/AdminPanel';
import AlumnosAceptados from './components/AlumnosAceptados';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
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
                <Routes>
                  <Route path="/" element={<NuevoIngreso />} />
                  <Route path="/reinscripcion" element={<Reinscripcion />} />
                  <Route path="/aceptados" element={<AlumnosAceptados />} />
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <AdminPanel />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
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
  );
}

export default App;
