// Base de datos local usando IndexedDB para almacenar solicitudes
const DB_NAME = 'ReinscripcionesDB';
const DB_VERSION = 1;
const STORE_SOLICITUDES = 'solicitudes';
const STORE_ACEPTADOS = 'aceptados';

class DatabaseService {
  constructor() {
    this.db = null;
  }

  // Inicializar la base de datos
  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject('Error al abrir la base de datos');
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Crear object store para solicitudes si no existe
        if (!db.objectStoreNames.contains(STORE_SOLICITUDES)) {
          const solicitudesStore = db.createObjectStore(STORE_SOLICITUDES, { keyPath: 'id' });
          solicitudesStore.createIndex('tipo', 'tipo', { unique: false });
          solicitudesStore.createIndex('estatus', 'estatus', { unique: false });
          solicitudesStore.createIndex('fecha', 'fecha', { unique: false });
        }

        // Crear object store para aceptados si no existe
        if (!db.objectStoreNames.contains(STORE_ACEPTADOS)) {
          const aceptadosStore = db.createObjectStore(STORE_ACEPTADOS, { keyPath: 'id' });
          aceptadosStore.createIndex('tipo', 'tipo', { unique: false });
          aceptadosStore.createIndex('carrera', 'carrera', { unique: false });
          aceptadosStore.createIndex('fechaAceptacion', 'fechaAceptacion', { unique: false });
        }
      };
    });
  }

  // Agregar una solicitud
  async agregarSolicitud(solicitud) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_SOLICITUDES], 'readwrite');
      const store = transaction.objectStore(STORE_SOLICITUDES);
      const request = store.add(solicitud);

      request.onsuccess = () => {
        resolve(solicitud.id);
      };

      request.onerror = () => {
        reject('Error al agregar solicitud');
      };
    });
  }

  // Obtener todas las solicitudes
  async obtenerSolicitudes() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_SOLICITUDES], 'readonly');
      const store = transaction.objectStore(STORE_SOLICITUDES);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject('Error al obtener solicitudes');
      };
    });
  }

  // Actualizar el estatus de una solicitud
  async actualizarEstatusSolicitud(id, nuevoEstatus) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_SOLICITUDES], 'readwrite');
      const store = transaction.objectStore(STORE_SOLICITUDES);
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const solicitud = getRequest.result;
        if (solicitud) {
          solicitud.estatus = nuevoEstatus;

          // Si es aprobada, mover a la tabla de aceptados
          if (nuevoEstatus === 'aprobada') {
            solicitud.fechaAceptacion = new Date().toISOString();
            this.agregarAceptado(solicitud);
          }

          const updateRequest = store.put(solicitud);
          updateRequest.onsuccess = () => resolve(solicitud);
          updateRequest.onerror = () => reject('Error al actualizar solicitud');
        } else {
          reject('Solicitud no encontrada');
        }
      };

      getRequest.onerror = () => {
        reject('Error al obtener solicitud');
      };
    });
  }

  // Agregar a la lista de aceptados
  async agregarAceptado(solicitud) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_ACEPTADOS], 'readwrite');
      const store = transaction.objectStore(STORE_ACEPTADOS);
      const request = store.put(solicitud);

      request.onsuccess = () => {
        resolve(solicitud.id);
      };

      request.onerror = () => {
        reject('Error al agregar a aceptados');
      };
    });
  }

  // Obtener todos los aceptados
  async obtenerAceptados() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_ACEPTADOS], 'readonly');
      const store = transaction.objectStore(STORE_ACEPTADOS);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject('Error al obtener aceptados');
      };
    });
  }

  // Eliminar una solicitud de aceptados
  async eliminarAceptado(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_ACEPTADOS], 'readwrite');
      const store = transaction.objectStore(STORE_ACEPTADOS);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject('Error al eliminar de aceptados');
      };
    });
  }

  // Obtener una solicitud por ID
  async obtenerSolicitudPorId(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_SOLICITUDES], 'readonly');
      const store = transaction.objectStore(STORE_SOLICITUDES);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject('Error al obtener solicitud');
      };
    });
  }
}

export const dbService = new DatabaseService();

