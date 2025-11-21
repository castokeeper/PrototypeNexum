# 🔧 Solución de Crashes de Nodemon

**Fecha**: 2025-11-21  
**Problema**: Nodemon se crashea o reinicia constantemente

---

## ✅ Correcciones Aplicadas

### 1. Archivo de Configuración de Nodemon Creado

He creado `backend/nodemon.json` con la siguiente configuración:

```json
{
  "watch": ["src"],
  "ext": "js,json",
  "ignore": ["src/**/*.spec.js", "src/**/*.test.js", "node_modules/**"],
  "delay": 1000,
  "env": {
    "NODE_ENV": "development"
  },
  "restartable": "rs",
  "verbose": true,
  "execMap": {
    "js": "node"
  },
  "signal": "SIGTERM"
}
```

**Beneficios**:
- ✅ Solo observa la carpeta `src` (evita archivos innecesarios)
- ✅ Delay de 1 segundo para evitar reinicios múltiples
- ✅ Ignora archivos de test y node_modules
- ✅ Modo verbose para ver qué está pasando
- ✅ Señal SIGTERM para cierre limpio

---

## 🔍 Posibles Causas del Crash

### 1. **Prisma Client no Generado**
**Síntoma**: Error sobre `@prisma/client` no encontrado

**Solución**:
```bash
cd backend
npm run prisma:generate
```

### 2. **Variables de Entorno Faltantes**
**Síntoma**: Error de conexión a base de datos o JWT

**Solución**:
```bash
# Verificar que existe backend/.env
cd backend
dir .env

# Si no existe, crearlo con:
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
JWT_SECRET="tu-secret-key"
PORT=3000
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
```

### 3. **Puerto 3000 Ocupado**
**Síntoma**: Error EADDRINUSE

**Solución** (Windows):
```bash
# Ver qué proceso usa el puerto 3000
netstat -ano | findstr :3000

# Matar el proceso (reemplazar PID)
taskkill /PID <numero> /F

# O cambiar el puerto en .env
PORT=3001
```

### 4. **Dependencias Faltantes**
**Síntoma**: Error de módulos no encontrados

**Solución**:
```bash
cd backend
npm install
```

### 5. **Error en Código que Causa Crash Inmediato**
**Síntoma**: El servidor se inicia y crashea inmediatamente

**Solución**:
```bash
# Ejecutar sin nodemon para ver el error completo
cd backend
node src/server.js
```

### 6. **Límite de Observadores de Archivos (Linux/Mac)**
**Síntoma**: Error ENOSPC (No en Windows)

**Solución** (Linux/Mac):
```bash
# Aumentar límite de observadores
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### 7. **Demasiados Archivos Siendo Observados**
**Síntoma**: Nodemon reinicia constantemente

**Solución**: Ya implementada en `nodemon.json` - solo observa `src/`

---

## 🧪 Diagnóstico

### Paso 1: Verificar Estado del Servidor
```bash
cd backend

# Ver si hay un proceso de node corriendo
tasklist /FI "IMAGENAME eq node.exe"

# Matar todos los procesos de node (si es necesario)
taskkill /IM node.exe /F
```

### Paso 2: Probar Sin Nodemon
```bash
cd backend
node src/server.js
```

Si funciona sin nodemon, el problema es con nodemon. Si no funciona, hay un error en el código.

### Paso 3: Verificar Logs Detallados
```bash
cd backend
# Con la nueva configuración verbose, verás más detalles
npm run dev
```

### Paso 4: Verificar Prisma
```bash
cd backend
npm run prisma:generate
npm run prisma:studio
# Si Prisma Studio abre, la conexión está bien
```

---

## 🚀 Reiniciar el Sistema Limpiamente

### Opción 1: Limpieza y Reinstalación
```bash
cd backend

# Detener todos los procesos de node
taskkill /IM node.exe /F

# Limpiar node_modules
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# Reinstalar
npm install

# Regenerar Prisma
npm run prisma:generate

# Iniciar
npm run dev
```

### Opción 2: Usar Node Directamente
```bash
cd backend
node src/server.js
# No usa nodemon, pero funciona para desarrollo
```

### Opción 3: Usar Nodemon con Watch Manual
```bash
cd backend
npx nodemon --watch src src/server.js
```

---

## ✅ Verificación

Después de aplicar las correcciones, deberías ver:

```
[nodemon] 3.1.11
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): src/**/*
[nodemon] watching extensions: js,json
[nodemon] starting `node src/server.js`

╔════════════════════════════════════════════════════════╗
║  🚀 Servidor iniciado exitosamente                     ║
║  📡 URL: http://localhost:3000                         ║
╚════════════════════════════════════════════════════════╝
```

**Señales de que funciona correctamente**:
- ✅ No se reinicia constantemente
- ✅ Responde en `http://localhost:3000/health`
- ✅ Solo reinicia cuando guardas archivos en `src/`
- ✅ Puedes escribir `rs` para reiniciar manualmente

---

## 🔧 Comandos Útiles

### Reiniciar Manualmente
```
rs
```
(Escribir en la terminal donde corre nodemon)

### Ver Qué Archivos Observa Nodemon
```bash
cd backend
npx nodemon --help
```

### Cambiar Delay de Reinicio
En `nodemon.json`, ajustar:
```json
{
  "delay": 2000  // 2 segundos (si 1 no es suficiente)
}
```

---

## 📊 Monitoreo

### Ver Logs en Tiempo Real
```bash
cd backend
npm run dev
# Modo verbose ya está activado en nodemon.json
```

### Verificar Recursos del Sistema
```bash
# Ver uso de CPU y memoria de Node
tasklist /FI "IMAGENAME eq node.exe" /V
```

---

## 🐛 Si Sigue Crasheando

### 1. Captura el Error Exacto
```bash
cd backend
npm run dev > debug.log 2>&1
# Luego revisar debug.log
```

### 2. Verifica la Base de Datos
```bash
cd backend
npm run prisma:studio
# Si no abre, hay problema con la DB
```

### 3. Revisa los Logs de Prisma
El servidor muestra queries de Prisma si `NODE_ENV=development`.
Busca errores como:
- `P2025` - Registro no encontrado
- `P2002` - Constraint único violado
- `P2003` - Foreign key inválida

---

## 📝 Mejoras Aplicadas

1. ✅ **Archivo `nodemon.json` creado** - Configuración optimizada
2. ✅ **Delay de 1 segundo** - Evita reinicios múltiples
3. ✅ **Solo observa `/src`** - Menos archivos, menos problemas
4. ✅ **Modo verbose** - Mejor diagnóstico
5. ✅ **Ignora archivos de test** - No reinicia por tests

---

## 🎯 Próximos Pasos

1. **Reinicia el servidor**:
   ```bash
   cd backend
   # Detener el proceso actual (Ctrl+C)
   npm run dev
   ```

2. **Verifica que funciona**:
   - Abre `http://localhost:3000/health`
   - Deberías ver `{"status":"OK"}`

3. **Prueba el auto-reinicio**:
   - Modifica algún archivo en `src/`
   - Nodemon debería reiniciar automáticamente

4. **Si todo funciona**:
   - ✅ El problema está resuelto
   - Continúa con el desarrollo

---

**Estado**: Configuración optimizada implementada  
**Acción recomendada**: Reiniciar el servidor con `npm run dev`
