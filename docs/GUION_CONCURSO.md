# Guion para Concurso de Prototipos - CETis 120

## Informacion del Proyecto

**Nombre del Proyecto:** Nexum - Sistema de Admisiones  
**Desarrollador:** [Tu Nombre]  
**Institucion:** CETis 120  
**Tecnologias:** React, Node.js, PostgreSQL, Stripe

---

## 1. Presentacion Inicial (2-3 minutos)

### Introduccion
"Buenos dias/tardes. Mi nombre es [Tu Nombre] y les presento Nexum, un sistema web diseñado para digitalizar y optimizar el proceso de admision e inscripcion del CETis 120."

### Problema que Resuelve
"Actualmente, los procesos de admision implican:
- Filas extensas para tramites presenciales
- Papeleria excesiva y riesgo de perdida de documentos
- Dificultad para consultar el estado de solicitudes
- Proceso de pago limitado a efectivo

Nexum elimina estas barreras ofreciendo una plataforma digital accesible desde cualquier dispositivo."

---

## 2. Demostracion del Sistema (5-7 minutos)

### Flujo Publico
1. Pagina principal con informacion del proceso
2. Registro de ficha de examen
3. Consulta de estado con folio
4. Lista de estudiantes aceptados

### Flujo de Aspirante
1. Inicio de sesion con credenciales generadas
2. Portal personalizado del aspirante
3. Formulario de inscripcion multi-paso
4. Proceso de pago con Stripe

### Flujo Administrativo
1. Panel de estadisticas en tiempo real
2. Gestion de lista de espera
3. Aprobacion/rechazo de solicitudes
4. Administracion de alumnos inscritos

---

## 3. Aspectos Tecnicos Destacables

### Frontend
- **React 18** con componentes funcionales y hooks
- **Diseño responsivo** adaptable a moviles y escritorio
- **Tema claro/oscuro** para accesibilidad
- **Lazy loading** para optimizar carga de paginas

### Backend
- **Node.js con Express** para API REST
- **Prisma ORM** para manejo de base de datos
- **JWT** para autenticacion segura
- **Validaciones** de datos en servidor

### Base de Datos
- **PostgreSQL** o MySQL
- Modelo relacional con 7+ tablas
- Integridad referencial asegurada

### Pagos
- **Integracion con Stripe** para pagos seguros
- Soporte para tarjetas de credito y debito
- Confirmacion automatica de pagos

---

## 4. Preguntas Frecuentes del Jurado

### Tecnologia y Desarrollo

**P: ¿Por que eligieron estas tecnologias?**
R: "React ofrece una experiencia de usuario fluida y es la biblioteca mas popular para interfaces web. Node.js permite usar JavaScript tanto en frontend como backend, simplificando el desarrollo. PostgreSQL es robusto y gratuito."

**P: ¿Como garantizan la seguridad de los datos?**
R: "Utilizamos JWT para autenticacion, contraseñas encriptadas con bcrypt, HTTPS para comunicacion segura, y validaciones tanto en cliente como en servidor."

**P: ¿Cuanto tiempo les tomo desarrollarlo?**
R: "El desarrollo activo fue de aproximadamente [X semanas/meses], incluyendo diseño, desarrollo, pruebas y documentacion."

**P: ¿Trabajaron solos o en equipo?**
R: "Trabaje de forma individual, utilizando herramientas de asistencia para productividad y siguiendo metodologias agiles."

### Funcionalidad

**P: ¿Que pasa si un aspirante pierde su folio?**
R: "El sistema permite consultar por CURP o correo electronico como alternativa al folio."

**P: ¿Como se manejan los pagos?**
R: "Utilizamos Stripe, un procesador de pagos certificado PCI-DSS. El sistema solo recibe confirmacion de pago, nunca los datos de la tarjeta."

**P: ¿El sistema funciona sin internet?**
R: "Requiere conexion a internet ya que es una aplicacion web. Sin embargo, los datos se almacenan en servidor, no se pierden si se cierra el navegador."

**P: ¿Cuantos usuarios soporta simultaneamente?**
R: "La arquitectura soporta cientos de usuarios concurrentes. Para mayor escala, se pueden implementar balanceadores de carga."

### Viabilidad

**P: ¿Podria implementarse realmente en el CETis?**
R: "Si. El sistema esta diseñado especificamente para las 11 carreras tecnicas del CETis 120, con turnos matutino y vespertino. Solo requeriria configuracion de servidor y capacitacion del personal."

**P: ¿Cual seria el costo de implementacion?**
R: "El software es de codigo abierto. Los costos serian:
- Hosting: aproximadamente $200-500 MXN/mes
- Dominio: $300-500 MXN/año
- Stripe cobra 3.6% + $3 MXN por transaccion"

**P: ¿Que ventajas tiene sobre sistemas existentes?**
R: "Es personalizado para el CETis 120, incluye pago en linea, tiene interfaz moderna y accesible, y el codigo es propiedad de la institucion."

---

## 5. Diferenciadores Clave

1. **Diseño Centrado en Usuario**
   - Interfaz intuitiva y moderna
   - Proceso guiado paso a paso
   - Mensajes claros de error y confirmacion

2. **Accesibilidad**
   - Tema claro y oscuro
   - Diseño responsivo
   - Compatible con lectores de pantalla

3. **Seguridad**
   - Autenticacion con tokens
   - Roles y permisos
   - Encriptacion de datos sensibles

4. **Escalabilidad**
   - Arquitectura modular
   - Base de datos relacional
   - API REST documentada

---

## 6. Cierre de Presentacion

"Nexum representa una solucion integral que moderniza los procesos administrativos del CETis 120, beneficiando tanto a aspirantes como al personal. Reduce tiempos de espera, elimina errores de papeleria y ofrece una experiencia profesional desde el primer contacto con la institucion.

¿Tienen alguna pregunta adicional?"

---

## Consejos para la Presentacion

- **Practica el flujo** de demostracion varias veces
- **Ten datos de prueba** listos en el sistema
- **Prepara respuestas** para posibles fallas tecnicas
- **Habla con seguridad** sobre decisiones de diseño
- **Menciona limitaciones** honestamente (es señal de madurez)
- **Enfoca en beneficios** para usuarios, no solo caracteristicas tecnicas
