# 🧪 Guía de Prueba: Módulo de Gestión de Alumnos

**Fecha**: 2025-11-21  
**Módulo**: AdminAlumnos

---

## 🎯 Objetivo

Probar el módulo completo de gestión de alumnos que incluye:
- Visualización de alumnos
- Filtros y búsqueda
- Estadísticas
- Cambio de estatus
- Paginación

---

## 📋 Pre-requisitos

### 1. Servidores Corriendo

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

### 2. Acceso Admin

- URL: `http://localhost:5173/admin/login`
- Usuario: `admin`
- Contraseña: `admin123`

---

## 🧪 Pruebas a Realizar

### Prueba 1: Crear Datos de Prueba

Primero necesitamos crear algunos alumnos de prueba. Ejecuta este script:

```bash
cd backend
node create-test-alumnos.js
```

---

### Prueba 2: Acceder al Módulo

1. **Login**:
   - Ve a `http://localhost:5173/admin/login`
   - Ingresa credenciales de admin
   - Deberías ser redirigido a `/admin`

2. **Navegar a Alumnos**:
   - Ve a `http://localhost:5173/admin/alumnos`
   - O agrega un enlace en el menú de navegación

**Resultado esperado**:
- ✅ Se muestra la página de gestión de alumnos
- ✅ Aparecen tarjetas de estadísticas
- ✅ Se muestra una tabla con los alumnos

---

### Prueba 3: Visualización de Estadísticas

**Ubicación**: Parte superior de la página

**Verifica**:
- ✅ Tarjeta "Total Alumnos" muestra el número correcto
- ✅ Tarjeta "Activos" muestra alumnos con estatus activo
- ✅ Tarjeta "Egresados" muestra alumnos egresados
- ✅ Tarjeta "Bajas" suma bajas temporales y definitivas

---

### Prueba 4: Tabla de Alumnos

**Columnas que deben aparecer**:
1. No. Control
2. Nombre
3. CURP
4. Carrera
5. Semestre
6. Promedio
7. Estatus
8. Acciones

**Verifica**:
- ✅ Todos los datos se muestran correctamente
- ✅ El CURP se muestra en formato monoespaciado
- ✅ El promedio tiene 1 decimal
- ✅ El estatus tiene un badge con color:
  - Verde para "Activo"
  - Amarillo para "Baja Temporal"
  - Azul para "Egresado"
  - Rojo para "Baja Definitiva"

---

### Prueba 5: Filtros

#### A. Búsqueda por Texto

1. **En el campo de búsqueda**, escribe:
   - Un nombre (ej: "Juan")
   - Un número de control (ej: "TEMP-")
   - Un CURP completo

**Resultado esperado**:
- ✅ La tabla se filtra mostrando solo resultados coincidentes
- ✅ La búsqueda funciona en tiempo real

#### B. Filtro por Carrera

1. **En el select "Carrera"**, selecciona:
   - Una carrera específica

**Resultado esperado**:
- ✅ Solo se muestran alumnos de esa carrera

#### C. Filtro por Estatus

1. **En el select "Estatus"**, selecciona:
   - "Activo"
   - "Baja Temporal"
   - "Egresado"
   - "Baja Definitiva"

**Resultado esperado**:
- ✅ Solo se muestran alumnos con ese estatus

#### D. Filtros Combinados

1. **Combina filtros**:
   - Busca "Juan"
   - Selecciona carrera "ISC"
   - Selecciona estatus "Activo"

**Resultado esperado**:
- ✅ Se aplican todos los filtros simultáneamente

---

### Prueba 6: Cambio de Estatus

#### A. Activo → Baja Temporal

1. **Encuentra un alumno activo**
2. **Click en el ícono de "Baja Temporal"** (UserX en naranja)
3. **En el prompt**, escribe un motivo (ej: "Problemas de salud")
4. **Confirma**

**Resultado esperado**:
- ✅ Aparece toast de éxito
- ✅ El alumno cambia a estatus "Baja Temporal"
- ✅ El badge se actualiza a amarillo
- ✅ Las estadísticas se actualizan
- ✅ Ya no aparece el botón de baja temporal
- ✅ Aparece botón de "Reactivar"

#### B. Baja Temporal → Activo

1. **Encuentra un alumno con baja temporal**
2. **Click en el ícono "Reactivar"** (UserCheck en verde)
3. **Ingresa motivo** (ej: "Recuperación completa")
4. **Confirma**

**Resultado esperado**:
- ✅ Alumno vuelve a estatus "Activo"
- ✅ Badge verde
- ✅ Estadísticas actualizadas

#### C. Activo → Egresado

1. **Encuentra un alumno activo**
2. **Click en el ícono "Egresado"** (Award en verde) 
3. **Ingresa motivo** (ej: "Completó todos los créditos")
4. **Confirma**

**Resultado esperado**:
- ✅ Alumno cambia a "Egresado"
- ✅ Badge azul
- ✅ Ya no aparecen botones de acción
- ✅ Estadísticas actualizadas

---

### Prueba 7: Paginación

**Solo si hay más de 20 alumnos**:

1. **Verifica** que aparecen controles de paginación
2. **Click en "Siguiente"**
3. **Verifica** que cambia la página
4. **Click en "Anterior"**
5. **Verifica** que vuelve a la página anterior

**Resultado esperado**:
- ✅ Navegación entre páginas funciona
- ✅ Se muestra "Página X de Y (Z alumnos)"
- ✅ Botones se deshabilitan correctamente

---

### Prueba 8: Casos Extremos

#### A. Sin Resultados

1. **Busca algo que no existe** (ej: "XXXXXXXXXXX")

**Resultado esperado**:
- ✅ Mensaje "No se encontraron alumnos"
- ✅ Ícono de usuarios vacío

#### B. Sin Alumnos en el Sistema

1. **Con base de datos vacía**

**Resultado esperado**:
- ✅ Estadísticas muestran 0
- ✅ Mensaje de tabla vacía

---

### Prueba 9: Responsividad

1. **Reduce el tamaño de la ventana**
2. **Prueba en móvil** (F12 → modo responsive)

**Resultado esperado**:
- ✅ La tabla se puede hacer scroll horizontal
- ✅ Filtros se apilan verticalmente
- ✅ Estadísticas se reorganizan
- ✅ Todo es usable en móvil

---

### Prueba 10: Performance

1. **Con 100+ registros**:
   - La tabla carga rápidamente
   - La paginación funciona sin lag
   - Los filtros responden inmediatamente

---

## 🐛 Errores Comunes y Soluciones

### Error: "No se encontró el token"

**Causa**: No estás autenticado

**Solución**:
```javascript
// En consola del navegador
localStorage.clear();
// Volver a hacer login
```

### Error: "Cannot read property 'map' of undefined"

**Causa**: Los alumnos no se cargaron

**Solución**:
1. Verifica que el backend esté corriendo
2. Revisa la consola del navegador
3. Verifica que la ruta `/api/alumnos` responda

### Error: "401 Unauthorized"

**Causa**: Token expirado o inválido

**Solución**:
1. Hacer logout
2. Volver a hacer login
3. Intentar de nuevo

### No aparecen alumnos

**Causa**: Base de datos vacía

**Solución**:
```bash
cd backend
node create-test-alumnos.js
```

---

## 📊 Endpoints a Verificar Manualmente

### 1. Obtener alumnos
```bash
curl http://localhost:3000/api/alumnos \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. Estadísticas
```bash
curl http://localhost:3000/api/alumnos/estadisticas \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Cambiar estatus
```bash
curl -X PATCH http://localhost:3000/api/alumnos/1/estatus \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"estatus":"baja_temporal","motivo":"Prueba"}'
```

---

## ✅ Checklist de Verificación

Marca cada ítem cuando lo hayas probado exitosamente:

- [ ] Acceso al módulo funciona
- [ ] Estadísticas se muestran correctamente
- [ ] Tabla muestra todos los datos
- [ ] Búsqueda por texto funciona
- [ ] Filtro por carrera funciona
- [ ] Filtro por estatus funciona
- [ ] Filtros combinados funcionan
- [ ] Cambio a baja temporal funciona
- [ ] Reactivación funciona
- [ ] Cambio a egresado funciona
- [ ] Paginación funciona
- [ ] Toast de éxito aparece
- [ ] Estadísticas se actualizan al cambiar estatus
- [ ] Diseño responsive funciona
- [ ] Sin errores en consola

---

## 📝 Reportar Problemas

Si encuentras algún problema, documéntalo con:

1. **Qué acción estabas realizando**
2. **Qué esperabas que pasara**
3. **Qué pasó en realidad**
4. **Mensaje de error** (si hay)
5. **Screenshots** (si es posible)

---

## 🎯 Próximos Pasos

Una vez que todas las pruebas pasen:

1. ✅ El módulo de Alumnos está completo
2. 📝 Continuar con AdminSolicitudes
3. 📝 Mejorar el Dashboard con estadísticas
4. 📝 Agregar sistema de documentos

---

**¡Éxito en las pruebas!** 🚀
