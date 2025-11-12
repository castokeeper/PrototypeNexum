# 🚀 Guía de Instalación de PostgreSQL

## 📋 Tabla de Contenido

1. [Instalación de PostgreSQL](#instalación-de-postgresql)
2. [Configuración Inicial](#configuración-inicial)
3. [Crear la Base de Datos](#crear-la-base-de-datos)
4. [Configurar el Backend](#configurar-el-backend)
5. [Migración de Datos](#migración-de-datos)
6. [Verificación](#verificación)

---

## 1. 🔧 Instalación de PostgreSQL

### Windows

1. **Descargar PostgreSQL:**
   - Ir a https://www.postgresql.org/download/windows/
   - Descargar el instalador (versión 14 o superior)

2. **Ejecutar el instalador:**
   ```
   - Instalar PostgreSQL Server
   - Instalar pgAdmin 4 (interfaz gráfica)
   - Puerto: 5432 (por defecto)
   - Contraseña del superusuario (postgres): [Tu contraseña]
   ```

3. **Verificar instalación:**
   ```cmd
   psql --version
   ```

### macOS

```bash
# Usando Homebrew
brew install postgresql@14

# Iniciar el servicio
brew services start postgresql@14

# Verificar
psql --version
```

### Linux (Ubuntu/Debian)

```bash
# Actualizar repositorios
sudo apt update

# Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib

# Verificar instalación
psql --version

# Iniciar servicio
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

---

## 2. ⚙️ Configuración Inicial

### Conectarse a PostgreSQL

**Windows (usando psql):**
```cmd
psql -U postgres
```

**macOS/Linux:**
```bash
sudo -u postgres psql
```

### Crear usuario para la aplicación

```sql
-- Crear usuario
CREATE USER reinscripciones_app WITH PASSWORD 'tu_password_seguro_aqui';

-- Otorgar permisos para crear bases de datos
ALTER USER reinscripciones_app CREATEDB;
```

---

## 3. 🗄️ Crear la Base de Datos

### Opción 1: Ejecutar el script SQL completo

```bash
# Desde la terminal
psql -U postgres -f database/schema.sql
```

### Opción 2: Usar pgAdmin

1. Abrir pgAdmin 4
2. Conectarse al servidor PostgreSQL
3. Click derecho en "Databases" → "Create" → "Database"
4. Nombre: `reinscripciones_db`
5. Owner: `reinscripciones_app`
6. Abrir Query Tool
7. Copiar y pegar el contenido de `database/schema.sql`
8. Ejecutar (F5)

### Opción 3: Línea por línea

```bash
# Crear la base de datos
createdb -U postgres reinscripciones_db

# Ejecutar el script
psql -U postgres -d reinscripciones_db -f database/schema.sql
```

---

## 4. 🔌 Configurar el Backend

### Paso 1: Instalar dependencias

```bash
# Navegar al directorio del proyecto
cd prototipo

# Instalar Prisma (si usas Prisma)
npm install prisma @prisma/client

# O Sequelize (alternativa)
npm install sequelize pg pg-hstore

# Para manejo de archivos
npm install multer

# Para hash de contraseñas
npm install bcrypt

# Para JWT
npm install jsonwebtoken
```

### Paso 2: Configurar variables de entorno

```bash
# Copiar el archivo de ejemplo
cp database/.env.example .env

# Editar .env con tus credenciales
# DATABASE_URL="postgresql://reinscripciones_app:tu_password@localhost:5432/reinscripciones_db"
```

### Paso 3: Inicializar Prisma (si usas Prisma)

```bash
# Copiar el schema de Prisma
cp database/prisma/schema.prisma prisma/schema.prisma

# Generar el cliente de Prisma
npx prisma generate

# Aplicar migraciones (si hay cambios)
npx prisma db push
```

---

## 5. 📦 Migración de Datos

### Script de migración desde IndexedDB

Crear archivo `scripts/migrate-indexeddb-to-postgres.js`:

```javascript
// Este script se ejecutará en el navegador
// para extraer datos de IndexedDB y enviarlos al backend

const DB_NAME = 'ReinscripcionesDB';

async function exportarDatos() {
  const db = await new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  // Exportar solicitudes
  const solicitudes = await new Promise((resolve) => {
    const tx = db.transaction(['solicitudes'], 'readonly');
    const store = tx.objectStore('solicitudes');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
  });

  // Exportar aceptados
  const aceptados = await new Promise((resolve) => {
    const tx = db.transaction(['aceptados'], 'readonly');
    const store = tx.objectStore('aceptados');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
  });

  // Descargar como JSON
  const data = { solicitudes, aceptados };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'datos-indexeddb.json';
  a.click();
  
  console.log('Datos exportados:', data);
  return data;
}

// Ejecutar en la consola del navegador
exportarDatos();
```

### Importar datos a PostgreSQL

Crear endpoint en el backend:

```javascript
// POST /api/migrate
app.post('/api/migrate', async (req, res) => {
  const { solicitudes, aceptados } = req.body;
  
  try {
    for (const solicitud of solicitudes) {
      // 1. Crear alumno si no existe
      const alumno = await prisma.alumno.upsert({
        where: { curp: solicitud.curp },
        create: {
          nombre: solicitud.nombre,
          apellidoPaterno: solicitud.apellidoPaterno,
          apellidoMaterno: solicitud.apellidoMaterno,
          curp: solicitud.curp,
          fechaNacimiento: new Date(solicitud.fechaNacimiento),
          telefono: solicitud.telefono,
          email: solicitud.email,
          direccion: solicitud.direccion
        },
        update: {}
      });
      
      // 2. Crear solicitud
      await prisma.solicitud.create({
        data: {
          alumnoId: alumno.id,
          carreraId: await obtenerCarreraId(solicitud.carrera),
          tipo: solicitud.tipo,
          estatus: solicitud.estatus,
          turno: solicitud.turno,
          matricula: solicitud.matricula,
          semestre: solicitud.grado,
          grupo: solicitud.grupo
        }
      });
    }
    
    res.json({ success: true, migrated: solicitudes.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## 6. ✅ Verificación

### Verificar que la BD está funcionando

```sql
-- Conectarse a la base de datos
psql -U reinscripciones_app -d reinscripciones_db

-- Verificar tablas creadas
\dt

-- Ver estadísticas
SELECT * FROM obtener_estadisticas();

-- Ver carreras
SELECT * FROM carreras;

-- Ver usuarios
SELECT id, username, nombre, rol FROM usuarios;

-- Contar registros por tabla
SELECT 
    'usuarios' as tabla, COUNT(*) as registros FROM usuarios
UNION ALL
SELECT 'carreras', COUNT(*) FROM carreras
UNION ALL
SELECT 'alumnos', COUNT(*) FROM alumnos
UNION ALL
SELECT 'solicitudes', COUNT(*) FROM solicitudes;
```

### Verificar conexión desde Node.js

Crear archivo `scripts/test-connection.js`:

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testConnection() {
  try {
    // Probar consulta simple
    const usuarios = await prisma.usuario.findMany();
    console.log('✅ Conexión exitosa!');
    console.log('Usuarios encontrados:', usuarios.length);
    
    // Estadísticas
    const carreras = await prisma.carrera.count();
    console.log('Carreras:', carreras);
    
  } catch (error) {
    console.error('❌ Error de conexión:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
```

Ejecutar:
```bash
node scripts/test-connection.js
```

---

## 🔒 Seguridad

### En Desarrollo

1. **Contraseñas de prueba** están OK
2. **Puerto 5432** abierto solo para localhost
3. **pgAdmin** protegido con contraseña

### En Producción

1. **Cambiar todas las contraseñas**
   ```sql
   ALTER USER reinscripciones_app PASSWORD 'password_super_seguro_aleatorio';
   ```

2. **Configurar SSL**
   ```sql
   ALTER SYSTEM SET ssl = on;
   ```

3. **Restringir acceso por IP** (pg_hba.conf)
   ```
   # Solo permitir conexiones desde el servidor de aplicación
   host    reinscripciones_db    reinscripciones_app    10.0.0.5/32    md5
   ```

4. **Backups automáticos**
   ```bash
   # Crear backup
   pg_dump -U postgres reinscripciones_db > backup_$(date +%Y%m%d).sql
   
   # Restaurar backup
   psql -U postgres reinscripciones_db < backup_20251104.sql
   ```

---

## 📊 Herramientas Útiles

### pgAdmin 4
- Interfaz gráfica para administrar PostgreSQL
- Crear consultas, ver datos, gestionar usuarios

### DBeaver
- Cliente universal de bases de datos
- Más ligero que pgAdmin
- https://dbeaver.io/

### Prisma Studio
```bash
npx prisma studio
```
- Interfaz web para ver y editar datos
- http://localhost:5555

---

## ❓ Solución de Problemas

### Error: "role does not exist"

```sql
-- Crear el rol
CREATE USER reinscripciones_app WITH PASSWORD 'password';
```

### Error: "database does not exist"

```bash
# Crear la base de datos
createdb -U postgres reinscripciones_db
```

### Error: "password authentication failed"

1. Verificar contraseña en .env
2. Verificar pg_hba.conf
3. Reiniciar PostgreSQL

### Error de conexión desde Node.js

1. Verificar que PostgreSQL está corriendo:
   ```bash
   # Windows
   services.msc (buscar PostgreSQL)
   
   # macOS/Linux
   sudo systemctl status postgresql
   ```

2. Verificar DATABASE_URL en .env
3. Verificar firewall (puerto 5432)

---

## 🎯 Próximos Pasos

1. ✅ PostgreSQL instalado y configurado
2. ✅ Base de datos creada con el esquema
3. ✅ Usuario de aplicación creado
4. ⏭️ Crear el backend con Node.js + Express
5. ⏭️ Implementar endpoints REST API
6. ⏭️ Conectar el frontend React
7. ⏭️ Migrar datos de IndexedDB

---

**¿Necesitas ayuda?** Consulta DATABASE-SCHEMA.md para más detalles sobre el diseño de la base de datos.

