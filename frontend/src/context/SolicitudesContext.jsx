import { createContext, useContext, useState, useEffect } from 'react';
import { dbService } from '../services/database';

const SolicitudesContext = createContext();

export const useSolicitudes = () => {
  const context = useContext(SolicitudesContext);
  if (!context) {
    throw new Error('useSolicitudes debe usarse dentro de SolicitudesProvider');
  }
  return context;
};

export const SolicitudesProvider = ({ children }) => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [aceptados, setAceptados] = useState([]);
  const [dbReady, setDbReady] = useState(false);

  // Inicializar la base de datos
  useEffect(() => {
    const initDatabase = async () => {
      try {
        await dbService.initDB();
        setDbReady(true);
        // Cargar solicitudes existentes
        await cargarSolicitudes();
        await cargarAceptados();
      } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
      }
    };
    initDatabase();
  }, []);

  const cargarSolicitudes = async () => {
    try {
      const solicitudesDB = await dbService.obtenerSolicitudes();
      setSolicitudes(solicitudesDB);
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
    }
  };

  const cargarAceptados = async () => {
    try {
      const aceptadosDB = await dbService.obtenerAceptados();
      setAceptados(aceptadosDB);
    } catch (error) {
      console.error('Error al cargar aceptados:', error);
    }
  };

  const agregarSolicitud = async (solicitud) => {
    const nuevaSolicitud = {
      ...solicitud,
      id: Date.now(),
      fecha: new Date().toISOString(),
      estatus: 'pendiente'
    };

    try {
      await dbService.agregarSolicitud(nuevaSolicitud);
      await cargarSolicitudes();
      return nuevaSolicitud.id;
    } catch (error) {
      console.error('Error al agregar solicitud:', error);
      throw error;
    }
  };

  const actualizarEstatus = async (id, nuevoEstatus) => {
    try {
      await dbService.actualizarEstatusSolicitud(id, nuevoEstatus);

      // Optimización: actualizar estado local sin recargar todo
      setSolicitudes(prev =>
        prev.map(sol =>
          sol.id === id ? { ...sol, estatus: nuevoEstatus } : sol
        )
      );

      // Si fue aprobada, actualizar también la lista de aceptados
      if (nuevoEstatus === 'aprobada') {
        await cargarAceptados();
      }
    } catch (error) {
      console.error('Error al actualizar estatus:', error);
      throw error;
    }
  };

  const obtenerSolicitudPorId = (id) => {
    return solicitudes.find(sol => sol.id === id);
  };

  return (
    <SolicitudesContext.Provider value={{
      solicitudes,
      aceptados,
      agregarSolicitud,
      actualizarEstatus,
      obtenerSolicitudPorId,
      dbReady
    }}>
      {children}
    </SolicitudesContext.Provider>
  );
};
