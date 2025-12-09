/**
 * ============================================================================
 * SCRIPT DE AUTOCOMPLETADO - FORMULARIO DE INSCRIPCIÓN CETIS 120
 * ============================================================================
 * 
 * Autor: Generado automáticamente
 * Fecha: 2025-12-09
 * Versión: 1.0.0
 * 
 * INSTRUCCIONES:
 * 1. Abre el formulario de inscripción en el navegador
 * 2. Abre las herramientas de desarrollador (F12)
 * 3. Ve a la pestaña "Console"
 * 4. Copia y pega todo este script
 * 5. Presiona Enter para ejecutar
 * 
 * NOTA: Este script está diseñado para el componente FormularioInscripcion.jsx
 *       del sistema de reinscripciones (React)
 * ============================================================================
 */

(function () {
    'use strict';

    // ========================================================================
    // DATOS DEL ESTUDIANTE - EDITA ESTOS VALORES SEGÚN SEA NECESARIO
    // ========================================================================

    const DATOS_ESTUDIANTE = {
        // --- Datos Personales (Paso 1) ---
        nombreCompleto: 'Juan Pérez López',
        curp: 'PELJ050815HDFRRN09',
        genero: 'masculino',                    // Opciones: 'masculino', 'femenino', 'otro'
        estadoCivil: 'soltero',                 // Opciones: 'soltero', 'casado', 'union_libre', 'divorciado', 'viudo'
        lugarNacimiento: 'Morelia, Michoacán',
        nacionalidad: 'Mexicana',
        telefono: '4431234567',
        celular: '4439876543',
        email: 'juan.perez.alumno@gmail.com',
        direccionCompleta: 'Av. Madero Poniente #1234, Col. Centro',
        municipio: 'Morelia',
        estado: 'Michoacán',
        codigoPostal: '58000',

        // --- Datos Académicos (Paso 2) ---
        escuelaProcedencia: 'Escuela Secundaria Técnica No. 3',
        promedioSecundaria: '9.5',
        ultimoGradoCursado: 'secundaria',       // Opciones: 'secundaria', 'preparatoria', 'otro'
        anioEgreso: '2024',
        certificadoObtenido: true,

        // --- Datos del Tutor (Paso 3) ---
        nombreTutor: 'María López García',
        parentesco: 'madre',                    // Opciones: 'padre', 'madre', 'hermano', 'abuelo', 'tio', 'otro'
        telefonoTutor: '4431112233',
        ocupacion: 'Docente',
        direccionTutor: 'Av. Madero Poniente #1234, Col. Centro, CP 58000',

        // --- Datos de Inscripción (Paso 4) ---
        carrera: 'Soporte y Mantenimiento de Equipo de Cómputo',
        turno: 'matutino',                      // Opciones: 'matutino', 'vespertino'
        grupo: 'A'
    };

    // ========================================================================
    // FUNCIONES AUXILIARES
    // ========================================================================

    /**
     * Dispara eventos de React para actualizar el state
     */
    function triggerReactChange(element, value) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype, 'value'
        )?.set;

        const nativeSelectValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLSelectElement.prototype, 'value'
        )?.set;

        if (element.tagName === 'SELECT') {
            if (nativeSelectValueSetter) {
                nativeSelectValueSetter.call(element, value);
            } else {
                element.value = value;
            }
        } else {
            if (nativeInputValueSetter) {
                nativeInputValueSetter.call(element, value);
            } else {
                element.value = value;
            }
        }

        // Disparar eventos que React escucha
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
    }

    /**
     * Encuentra un input por múltiples selectores
     */
    function findInput(selectors) {
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) return element;
        }
        return null;
    }

    /**
     * Establece valor en un campo de texto
     */
    function setTextField(selectors, value, fieldName) {
        const element = findInput(selectors);
        if (element) {
            triggerReactChange(element, value);
            console.log(`✅ ${fieldName}: "${value}"`);
            return true;
        } else {
            console.warn(`⚠️ ${fieldName}: Campo no encontrado`);
            return false;
        }
    }

    /**
     * Establece valor en un select/dropdown
     */
    function setSelectField(selectors, value, fieldName) {
        const element = findInput(selectors);
        if (element) {
            // Primero intentar por value
            let found = false;
            for (const option of element.options) {
                if (option.value === value ||
                    option.text.toLowerCase().includes(value.toLowerCase())) {
                    triggerReactChange(element, option.value);
                    console.log(`✅ ${fieldName}: "${option.text}" (value: ${option.value})`);
                    found = true;
                    break;
                }
            }
            if (!found) {
                console.warn(`⚠️ ${fieldName}: Opción "${value}" no encontrada`);
            }
            return found;
        } else {
            console.warn(`⚠️ ${fieldName}: Campo no encontrado`);
            return false;
        }
    }

    /**
     * Establece valor en un checkbox
     */
    function setCheckbox(selectors, checked, fieldName) {
        const element = findInput(selectors);
        if (element) {
            if (element.checked !== checked) {
                element.click();
            }
            console.log(`✅ ${fieldName}: ${checked ? 'Marcado' : 'Desmarcado'}`);
            return true;
        } else {
            console.warn(`⚠️ ${fieldName}: Campo no encontrado`);
            return false;
        }
    }

    /**
     * Espera a que un elemento esté presente en el DOM
     */
    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver(() => {
                const el = document.querySelector(selector);
                if (el) {
                    observer.disconnect();
                    resolve(el);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Timeout: Elemento "${selector}" no encontrado`));
            }, timeout);
        });
    }

    /**
     * Hace clic en el botón "Siguiente"
     */
    function clickNext() {
        const nextButton = document.querySelector('button[type="button"]');
        const buttons = document.querySelectorAll('button');

        for (const btn of buttons) {
            if (btn.textContent.includes('Siguiente')) {
                btn.click();
                return true;
            }
        }
        return false;
    }

    // ========================================================================
    // FUNCIONES DE LLENADO POR PASO
    // ========================================================================

    /**
     * PASO 1: Datos Personales
     */
    function llenarDatosPersonales() {
        console.log('\n📋 PASO 1: DATOS PERSONALES');
        console.log('─'.repeat(50));

        // Nombre Completo
        setTextField(
            ['input[type="text"]:first-of-type', 'input[placeholder*="nombre"]'],
            DATOS_ESTUDIANTE.nombreCompleto,
            'Nombre Completo'
        );

        // CURP (segundo input de texto, tiene maxLength=18)
        const curpInput = document.querySelector('input[maxlength="18"]');
        if (curpInput) {
            triggerReactChange(curpInput, DATOS_ESTUDIANTE.curp);
            console.log(`✅ CURP: "${DATOS_ESTUDIANTE.curp}"`);
        }

        // Género (select)
        const selects = document.querySelectorAll('select');
        if (selects[0]) {
            triggerReactChange(selects[0], DATOS_ESTUDIANTE.genero);
            console.log(`✅ Género: "${DATOS_ESTUDIANTE.genero}"`);
        }

        // Estado Civil (segundo select)
        if (selects[1]) {
            triggerReactChange(selects[1], DATOS_ESTUDIANTE.estadoCivil);
            console.log(`✅ Estado Civil: "${DATOS_ESTUDIANTE.estadoCivil}"`);
        }

        // Recopilar todos los inputs de texto
        const textInputs = document.querySelectorAll('input[type="text"]');
        const telInputs = document.querySelectorAll('input[type="tel"]');
        const emailInputs = document.querySelectorAll('input[type="email"]');

        // Lugar de Nacimiento (tercer input de texto aproximadamente)
        if (textInputs[2]) {
            triggerReactChange(textInputs[2], DATOS_ESTUDIANTE.lugarNacimiento);
            console.log(`✅ Lugar de Nacimiento: "${DATOS_ESTUDIANTE.lugarNacimiento}"`);
        }

        // Teléfono
        if (telInputs[0]) {
            triggerReactChange(telInputs[0], DATOS_ESTUDIANTE.telefono);
            console.log(`✅ Teléfono: "${DATOS_ESTUDIANTE.telefono}"`);
        }

        // Email
        if (emailInputs[0]) {
            triggerReactChange(emailInputs[0], DATOS_ESTUDIANTE.email);
            console.log(`✅ Email: "${DATOS_ESTUDIANTE.email}"`);
        }

        // Dirección Completa
        if (textInputs[3]) {
            triggerReactChange(textInputs[3], DATOS_ESTUDIANTE.direccionCompleta);
            console.log(`✅ Dirección: "${DATOS_ESTUDIANTE.direccionCompleta}"`);
        }

        // Municipio
        if (textInputs[4]) {
            triggerReactChange(textInputs[4], DATOS_ESTUDIANTE.municipio);
            console.log(`✅ Municipio: "${DATOS_ESTUDIANTE.municipio}"`);
        }

        // Estado
        if (textInputs[5]) {
            triggerReactChange(textInputs[5], DATOS_ESTUDIANTE.estado);
            console.log(`✅ Estado: "${DATOS_ESTUDIANTE.estado}"`);
        }

        // Código Postal (tiene maxLength=5)
        const cpInput = document.querySelector('input[maxlength="5"]');
        if (cpInput) {
            triggerReactChange(cpInput, DATOS_ESTUDIANTE.codigoPostal);
            console.log(`✅ Código Postal: "${DATOS_ESTUDIANTE.codigoPostal}"`);
        }
    }

    /**
     * PASO 2: Datos Académicos
     */
    function llenarDatosAcademicos() {
        console.log('\n📚 PASO 2: DATOS ACADÉMICOS');
        console.log('─'.repeat(50));

        const textInputs = document.querySelectorAll('input[type="text"]');
        const numberInputs = document.querySelectorAll('input[type="number"]');
        const selects = document.querySelectorAll('select');
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');

        // Escuela de Procedencia
        if (textInputs[0]) {
            triggerReactChange(textInputs[0], DATOS_ESTUDIANTE.escuelaProcedencia);
            console.log(`✅ Escuela de Procedencia: "${DATOS_ESTUDIANTE.escuelaProcedencia}"`);
        }

        // Promedio de Secundaria (input type="number")
        if (numberInputs[0]) {
            triggerReactChange(numberInputs[0], DATOS_ESTUDIANTE.promedioSecundaria);
            console.log(`✅ Promedio: "${DATOS_ESTUDIANTE.promedioSecundaria}"`);
        }

        // Último Grado Cursado (select)
        if (selects[0]) {
            triggerReactChange(selects[0], DATOS_ESTUDIANTE.ultimoGradoCursado);
            console.log(`✅ Último Grado Cursado: "${DATOS_ESTUDIANTE.ultimoGradoCursado}"`);
        }

        // Año de Egreso (segundo input type="number")
        if (numberInputs[1]) {
            triggerReactChange(numberInputs[1], DATOS_ESTUDIANTE.anioEgreso);
            console.log(`✅ Año de Egreso: "${DATOS_ESTUDIANTE.anioEgreso}"`);
        }

        // Certificado Obtenido (checkbox)
        if (checkboxes[0] && DATOS_ESTUDIANTE.certificadoObtenido) {
            if (!checkboxes[0].checked) {
                checkboxes[0].click();
            }
            console.log(`✅ Certificado Obtenido: Marcado`);
        }
    }

    /**
     * PASO 3: Datos del Tutor
     */
    function llenarDatosTutor() {
        console.log('\n👤 PASO 3: DATOS DEL TUTOR');
        console.log('─'.repeat(50));

        const textInputs = document.querySelectorAll('input[type="text"]');
        const telInputs = document.querySelectorAll('input[type="tel"]');
        const selects = document.querySelectorAll('select');

        // Nombre del Tutor
        if (textInputs[0]) {
            triggerReactChange(textInputs[0], DATOS_ESTUDIANTE.nombreTutor);
            console.log(`✅ Nombre del Tutor: "${DATOS_ESTUDIANTE.nombreTutor}"`);
        }

        // Parentesco (select)
        if (selects[0]) {
            triggerReactChange(selects[0], DATOS_ESTUDIANTE.parentesco);
            console.log(`✅ Parentesco: "${DATOS_ESTUDIANTE.parentesco}"`);
        }

        // Teléfono del Tutor
        if (telInputs[0]) {
            triggerReactChange(telInputs[0], DATOS_ESTUDIANTE.telefonoTutor);
            console.log(`✅ Teléfono del Tutor: "${DATOS_ESTUDIANTE.telefonoTutor}"`);
        }

        // Ocupación
        if (textInputs[1]) {
            triggerReactChange(textInputs[1], DATOS_ESTUDIANTE.ocupacion);
            console.log(`✅ Ocupación: "${DATOS_ESTUDIANTE.ocupacion}"`);
        }

        // Dirección del Tutor
        if (textInputs[2]) {
            triggerReactChange(textInputs[2], DATOS_ESTUDIANTE.direccionTutor);
            console.log(`✅ Dirección del Tutor: "${DATOS_ESTUDIANTE.direccionTutor}"`);
        }
    }

    /**
     * PASO 4: Datos de Inscripción
     */
    function llenarDatosInscripcion() {
        console.log('\n📝 PASO 4: DATOS DE INSCRIPCIÓN');
        console.log('─'.repeat(50));

        const selects = document.querySelectorAll('select');
        const textInputs = document.querySelectorAll('input[type="text"]');

        // Carrera (select dinámico con opciones cargadas del backend)
        if (selects[0]) {
            // Buscar la opción que contenga el texto de la carrera
            for (const option of selects[0].options) {
                if (option.text.toLowerCase().includes(DATOS_ESTUDIANTE.carrera.toLowerCase().substring(0, 15))) {
                    triggerReactChange(selects[0], option.value);
                    console.log(`✅ Carrera: "${option.text}"`);
                    break;
                }
            }
            // Si no se encontró coincidencia exacta, seleccionar la primera opción válida
            if (selects[0].value === '') {
                console.log(`ℹ️ Carreras disponibles:`);
                for (const option of selects[0].options) {
                    if (option.value !== '') {
                        console.log(`   - ${option.text} (value: ${option.value})`);
                    }
                }
            }
        }

        // Turno
        if (selects[1]) {
            triggerReactChange(selects[1], DATOS_ESTUDIANTE.turno);
            console.log(`✅ Turno: "${DATOS_ESTUDIANTE.turno}"`);
        }

        // Grupo (opcional)
        if (textInputs[0]) {
            triggerReactChange(textInputs[0], DATOS_ESTUDIANTE.grupo);
            console.log(`✅ Grupo: "${DATOS_ESTUDIANTE.grupo}"`);
        }
    }

    // ========================================================================
    // FUNCIÓN PRINCIPAL
    // ========================================================================

    /**
     * Ejecuta el autocompletado paso a paso
     */
    async function ejecutarAutocompletado() {
        console.clear();
        console.log('╔══════════════════════════════════════════════════════════════╗');
        console.log('║     SCRIPT DE AUTOCOMPLETADO - FORMULARIO CETIS 120          ║');
        console.log('║                    Sistema de Inscripciones                   ║');
        console.log('╚══════════════════════════════════════════════════════════════╝');
        console.log('\n⏳ Iniciando autocompletado...\n');

        // Detectar el paso actual del formulario
        const progressText = document.body.innerText;
        let currentStep = 1;

        if (progressText.includes('Paso 1')) currentStep = 1;
        else if (progressText.includes('Paso 2')) currentStep = 2;
        else if (progressText.includes('Paso 3')) currentStep = 3;
        else if (progressText.includes('Paso 4')) currentStep = 4;
        else if (progressText.includes('Datos Personales')) currentStep = 1;
        else if (progressText.includes('Datos Académicos')) currentStep = 2;
        else if (progressText.includes('Datos del Tutor')) currentStep = 3;
        else if (progressText.includes('Datos de Inscripción')) currentStep = 4;

        console.log(`📍 Paso actual detectado: ${currentStep}`);

        // Ejecutar el llenado según el paso
        switch (currentStep) {
            case 1:
                llenarDatosPersonales();
                break;
            case 2:
                llenarDatosAcademicos();
                break;
            case 3:
                llenarDatosTutor();
                break;
            case 4:
                llenarDatosInscripcion();
                break;
            default:
                console.warn('⚠️ No se pudo detectar el paso actual');
        }

        console.log('\n' + '═'.repeat(60));
        console.log('✅ AUTOCOMPLETADO COMPLETADO PARA ESTE PASO');
        console.log('═'.repeat(60));
        console.log('\n💡 Instrucciones:');
        console.log('   1. Revisa que los datos sean correctos');
        console.log('   2. Haz clic en "Siguiente" para avanzar');
        console.log('   3. Ejecuta este script de nuevo en cada paso');
        console.log('   4. O usa: llenarTodo() para completar todos los pasos');
    }

    /**
     * Llena todos los pasos automáticamente (con delays)
     */
    window.llenarTodo = async function () {
        console.log('🚀 Iniciando llenado completo de todos los pasos...\n');

        // Paso 1
        llenarDatosPersonales();
        await new Promise(r => setTimeout(r, 500));
        clickNext();
        await new Promise(r => setTimeout(r, 1000));

        // Paso 2
        llenarDatosAcademicos();
        await new Promise(r => setTimeout(r, 500));
        clickNext();
        await new Promise(r => setTimeout(r, 1000));

        // Paso 3
        llenarDatosTutor();
        await new Promise(r => setTimeout(r, 500));
        clickNext();
        await new Promise(r => setTimeout(r, 1000));

        // Paso 4
        llenarDatosInscripcion();

        console.log('\n✅ TODOS LOS PASOS HAN SIDO COMPLETADOS');
        console.log('📌 Revisa los datos y haz clic en "Enviar Formulario"');
    };

    /**
     * Funciones exportadas para uso individual
     */
    window.llenarPaso1 = llenarDatosPersonales;
    window.llenarPaso2 = llenarDatosAcademicos;
    window.llenarPaso3 = llenarDatosTutor;
    window.llenarPaso4 = llenarDatosInscripcion;

    // Ejecutar automáticamente al cargar
    ejecutarAutocompletado();

    console.log('\n📖 COMANDOS DISPONIBLES:');
    console.log('────────────────────────────────────────');
    console.log('  llenarPaso1()  → Llena Datos Personales');
    console.log('  llenarPaso2()  → Llena Datos Académicos');
    console.log('  llenarPaso3()  → Llena Datos del Tutor');
    console.log('  llenarPaso4()  → Llena Datos de Inscripción');
    console.log('  llenarTodo()   → Llena TODOS los pasos');
    console.log('────────────────────────────────────────');

})();
