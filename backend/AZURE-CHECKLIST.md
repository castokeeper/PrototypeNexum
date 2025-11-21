# ✅ Checklist de Configuración Azure PostgreSQL

## Antes de comenzar
- [ ] Cuenta de Azure activa
- [ ] Acceso a Azure Portal o Azure CLI instalado

## 1. Crear Base de Datos en Azure

### Portal de Azure
- [ ] Ir a portal.azure.com
- [ ] Buscar "Azure Database for PostgreSQL"
- [ ] Crear servidor flexible
- [ ] Configurar:
  - [ ] Grupo de recursos: `rg-reinscripciones`
  - [ ] Nombre del servidor: (anotar aquí) `___________________________`
  - [ ] Usuario admin: (anotar aquí) `___________________________`
  - [ ] Contraseña: (guardar en lugar seguro) ⚠️
  - [ ] Región: `___________________________`
  - [ ] Versión PostgreSQL: 15
  - [ ] Tipo: Development (Burstable B1ms)
- [ ] Configurar red:
  - [ ] Acceso público habilitado
  - [ ] Agregar regla de firewall para tu IP
  - [ ] O permitir 0.0.0.0-255.255.255.255 (solo desarrollo)
- [ ] Crear servidor (esperar 5-10 min)
- [ ] Crear base de datos "reinscripciones"

### Azure CLI (alternativo)
```bash
# Copiar y ejecutar estos comandos (ajustar valores)
az login
az group create --name rg-reinscripciones --location eastus
az postgres flexible-server create \
  --name TU-SERVIDOR-NOMBRE \
  --resource-group rg-reinscripciones \
  --admin-user adminuser \
  --admin-password "TuPassword123!" \
  --public-access 0.0.0.0-255.255.255.255
```

## 2. Configurar el Backend

- [ ] Copiar `.env.azure.template` a `.env`
  ```bash
  cd backend
  cp .env.azure.template .env
  ```

- [ ] Editar `.env` y reemplazar:
  - [ ] `USUARIO` → tu usuario admin
  - [ ] `PASSWORD` → tu contraseña
  - [ ] `NOMBRE_SERVIDOR` → nombre de tu servidor Azure
  
- [ ] Verificar que la URL tenga `?sslmode=require` al final

## 3. Ejecutar Migraciones

```bash
cd backend

# 1. Generar Prisma Client
npm run prisma:generate
- [ ] Ejecutado sin errores

# 2. Crear tablas en Azure
npm run prisma:migrate
- [ ] Ejecutado sin errores
- [ ] Nombre de migración: ___________________________

# 3. Poblar datos iniciales
npm run prisma:seed
- [ ] Ejecutado sin errores
- [ ] Usuarios creados: admin, director, control
- [ ] Carreras creadas: 7
```

## 4. Verificar Conexión

```bash
# Ver datos en Prisma Studio
npm run prisma:studio
- [ ] Se abre en navegador
- [ ] Puedo ver tablas: usuarios, carreras, alumnos, solicitudes
- [ ] Hay datos de prueba

# Iniciar backend
npm run dev
- [ ] Backend inicia en puerto 3000
- [ ] Mensaje: "Base de datos conectada"
- [ ] Sin errores de conexión
```

## 5. Probar Endpoints

Abrir navegador o Postman:

```bash
# Health check
GET http://localhost:3000/health
- [ ] Respuesta: {"status": "OK"}

# Login de prueba
POST http://localhost:3000/api/auth/login
Body: {"username": "admin", "password": "admin123"}
- [ ] Respuesta: token JWT
```

## 6. Iniciar Sistema Completo

```bash
# Desde la raíz del proyecto
npm run dev
- [ ] Backend inicia en puerto 3000
- [ ] Frontend inicia en puerto 5173
- [ ] Sin errores en ninguno de los dos
```

## 7. Verificar en Azure Portal

- [ ] Ir a tu servidor en Azure Portal
- [ ] Métricas → Verificar "Conexiones activas" > 0
- [ ] Logs → Ver actividad de conexión

## ✅ Configuración Completada

- [ ] Base de datos en Azure funcionando
- [ ] Backend conectado a Azure
- [ ] Migraciones ejecutadas
- [ ] Datos de prueba cargados
- [ ] Sistema frontend + backend funcionando

## 📊 Información del Servidor

- **Nombre del servidor**: _________________________________
- **Usuario admin**: _________________________________
- **Base de datos**: reinscripciones
- **Región**: _________________________________
- **Nivel**: Burstable B1ms
- **Costo estimado**: ~$12-15 USD/mes

## ⚠️ Importante

- [ ] Guardar las credenciales en un lugar seguro
- [ ] NO subir el archivo `.env` a Git
- [ ] Considerar detener el servidor cuando no lo uses (ahorra costos)
- [ ] En producción, restringir las IPs del firewall

## 🆘 Solución de Problemas

Si algo falla:
1. Ver `backend/AZURE-SETUP.md` sección "Solución de Problemas"
2. Verificar firewall en Azure
3. Verificar que `sslmode=require` esté en la URL
4. Ver logs en Azure Portal

---

**Última actualización**: 2025-11-20
