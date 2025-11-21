/**
 * Script de Verificación del Sistema
 * Prueba la autenticación y los endpoints principales
 */

import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000';
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
    console.log('\n' + '='.repeat(60));
    log(`  ${title}`, 'cyan');
    console.log('='.repeat(60) + '\n');
}

async function testAuth() {
    logSection('PRUEBA 1: Autenticación');

    try {
        log('🔑 Intentando login con credenciales de admin...', 'blue');
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'admin',
                password: 'admin123'
            })
        });

        const data = await response.json();

        if (response.ok && data.token) {
            log('✅ Login exitoso', 'green');
            log(`   Token: ${data.token.substring(0, 20)}...`, 'reset');
            log(`   Usuario: ${data.usuario.nombre} (${data.usuario.username})`, 'reset');
            log(`   Rol: ${data.usuario.rol}`, 'reset');
            return data.token;
        } else {
            log('❌ Login fallido', 'red');
            log(`   Error: ${data.error || 'Desconocido'}`, 'red');
            return null;
        }
    } catch (error) {
        log('❌ Error de conexión', 'red');
        log(`   ${error.message}`, 'red');
        return null;
    }
}

async function testVerifyToken(token) {
    logSection('PRUEBA 2: Verificación de Token');

    try {
        log('🔐 Verificando token...', 'blue');
        const response = await fetch(`${API_URL}/api/auth/verify`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            log('✅ Token válido', 'green');
            log(`   Usuario verificado: ${data.usuario.nombre}`, 'reset');
            return true;
        } else {
            log('❌ Token inválido', 'red');
            return false;
        }
    } catch (error) {
        log('❌ Error al verificar token', 'red');
        log(`   ${error.message}`, 'red');
        return false;
    }
}

async function testListaEspera(token) {
    logSection('PRUEBA 3: Lista de Espera');

    try {
        log('📋 Consultando lista de espera...', 'blue');
        const response = await fetch(`${API_URL}/api/lista-espera`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            log('✅ Lista de espera obtenida', 'green');
            log(`   Total de aspirantes: ${data.total}`, 'reset');

            if (data.aspirantes && data.aspirantes.length > 0) {
                log(`   Primer aspirante:`, 'reset');
                const first = data.aspirantes[0];
                log(`     - Folio: ${first.folio}`, 'reset');
                log(`     - Nombre: ${first.nombre}`, 'reset');
                log(`     - Carrera: ${first.carrera}`, 'reset');
                log(`     - Estado: ${first.estadoEspera}`, 'reset');
            } else {
                log('   ⚠️  No hay aspirantes en la lista', 'yellow');
            }
            return true;
        } else {
            log('❌ Error al obtener lista de espera', 'red');
            log(`   ${data.error || 'Error desconocido'}`, 'red');
            return false;
        }
    } catch (error) {
        log('❌ Error en consulta', 'red');
        log(`   ${error.message}`, 'red');
        return false;
    }
}

async function testCarreras() {
    logSection('PRUEBA 4: Carreras (Endpoint Público)');

    try {
        log('🎓 Consultando carreras...', 'blue');
        const response = await fetch(`${API_URL}/api/carreras`);
        const data = await response.json();

        if (response.ok && Array.isArray(data)) {
            log('✅ Carreras obtenidas', 'green');
            log(`   Total de carreras: ${data.length}`, 'reset');

            if (data.length > 0) {
                log(`   Carreras disponibles:`, 'reset');
                data.forEach((carrera, index) => {
                    log(`     ${index + 1}. ${carrera.nombre} (${carrera.codigo || 'N/A'})`, 'reset');
                });
            }
            return true;
        } else {
            log('❌ Error al obtener carreras', 'red');
            return false;
        }
    } catch (error) {
        log('❌ Error en consulta', 'red');
        log(`   ${error.message}`, 'red');
        return false;
    }
}

async function testHealthCheck() {
    logSection('PRUEBA 5: Health Check');

    try {
        log('🏥 Verificando estado del servidor...', 'blue');
        const response = await fetch(`${API_URL}/health`);
        const data = await response.json();

        if (response.ok && data.status === 'OK') {
            log('✅ Servidor saludable', 'green');
            if (data.timestamp) {
                log(`   Timestamp: ${data.timestamp}`, 'reset');
            }
            return true;
        } else {
            log('❌ Servidor con problemas', 'red');
            return false;
        }
    } catch (error) {
        log('❌ Error al verificar servidor', 'red');
        log(`   ${error.message}`, 'red');
        return false;
    }
}

async function testInvalidAuth() {
    logSection('PRUEBA 6: Autenticación Inválida');

    try {
        log('🚫 Intentando login con credenciales incorrectas...', 'blue');
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'usuario_invalido',
                password: 'password_incorrecta'
            })
        });

        const data = await response.json();

        if (!response.ok) {
            log('✅ Credenciales inválidas rechazadas correctamente', 'green');
            log(`   Error esperado: ${data.error}`, 'reset');
            return true;
        } else {
            log('❌ PROBLEMA DE SEGURIDAD: Login exitoso con credenciales inválidas', 'red');
            return false;
        }
    } catch (error) {
        log('❌ Error en prueba', 'red');
        log(`   ${error.message}`, 'red');
        return false;
    }
}

async function testUnauthorizedAccess() {
    logSection('PRUEBA 7: Acceso No Autorizado');

    try {
        log('🔒 Intentando acceder a lista de espera sin token...', 'blue');
        const response = await fetch(`${API_URL}/api/lista-espera`);
        const data = await response.json();

        if (response.status === 401) {
            log('✅ Acceso denegado correctamente', 'green');
            log(`   Error esperado: ${data.error}`, 'reset');
            return true;
        } else {
            log('❌ PROBLEMA DE SEGURIDAD: Acceso permitido sin autenticación', 'red');
            return false;
        }
    } catch (error) {
        log('❌ Error en prueba', 'red');
        log(`   ${error.message}`, 'red');
        return false;
    }
}

// Función principal
async function runAllTests() {
    console.clear();
    log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
    log('║        SISTEMA DE VERIFICACIÓN - REINSCRIPCIONES           ║', 'cyan');
    log('╚════════════════════════════════════════════════════════════╝', 'cyan');

    const results = {
        passed: 0,
        failed: 0,
        total: 7
    };

    // Prueba 1: Health Check
    const health = await testHealthCheck();
    health ? results.passed++ : results.failed++;

    if (!health) {
        log('\n❌ El servidor no está respondiendo. Asegúrate de que el backend esté corriendo.', 'red');
        log('   Ejecuta: cd backend && npm run dev', 'yellow');
        return;
    }

    // Prueba 2: Carreras (público)
    const carreras = await testCarreras();
    carreras ? results.passed++ : results.failed++;

    // Prueba 3: Autenticación exitosa
    const token = await testAuth();
    token ? results.passed++ : results.failed++;

    if (!token) {
        log('\n❌ No se pudo obtener token. Las siguientes pruebas se saltarán.', 'red');
        results.failed += 2; // Pruebas 4 y 5
    } else {
        // Prueba 4: Verificación de token
        const verifyOk = await testVerifyToken(token);
        verifyOk ? results.passed++ : results.failed++;

        // Prueba 5: Lista de espera
        const listaOk = await testListaEspera(token);
        listaOk ? results.passed++ : results.failed++;
    }

    // Prueba 6: Credenciales inválidas
    const invalidAuth = await testInvalidAuth();
    invalidAuth ? results.passed++ : results.failed++;

    // Prueba 7: Acceso no autorizado
    const unauthorized = await testUnauthorizedAccess();
    unauthorized ? results.passed++ : results.failed++;

    // Resumen final
    logSection('RESUMEN DE PRUEBAS');

    const percentage = Math.round((results.passed / results.total) * 100);
    const barLength = 40;
    const filledLength = Math.round((percentage / 100) * barLength);
    const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);

    log(`Total de pruebas: ${results.total}`, 'cyan');
    log(`Exitosas: ${results.passed}`, 'green');
    log(`Fallidas: ${results.failed}`, 'red');
    log(`\nProgreso: [${bar}] ${percentage}%\n`, percentage === 100 ? 'green' : 'yellow');

    if (results.failed === 0) {
        log('🎉 ¡TODAS LAS PRUEBAS PASARON!', 'green');
        log('   El sistema está funcionando correctamente.', 'green');
    } else {
        log('⚠️  Algunas pruebas fallaron', 'yellow');
        log('   Revisa los errores anteriores para más detalles.', 'yellow');
    }

    console.log('\n' + '='.repeat(60) + '\n');
}

// Ejecutar pruebas
runAllTests().catch(error => {
    log('\n❌ Error fatal en las pruebas:', 'red');
    console.error(error);
    process.exit(1);
});
