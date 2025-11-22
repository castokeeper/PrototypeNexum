/**
 * Test General del Sistema
 * Prueba los puntos críticos del sistema
 */

import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'http://localhost:3000';

// Colores para los logs
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(name, url, options = {}) {
    try {
        const response = await fetch(`${BASE_URL}${url}`, options);
        const data = await response.json();

        if (response.ok) {
            log(`✅ ${name}`, 'green');
            return { success: true, data };
        } else {
            log(`❌ ${name} - Error: ${data.error || response.statusText}`, 'red');
            return { success: false, error: data.error };
        }
    } catch (error) {
        log(`❌ ${name} - Error: ${error.message}`, 'red');
        return { success: false, error: error.message };
    }
}

async function runTests() {
    log('\n🧪 ===== TESTING DEL SISTEMA =====\n', 'bright');

    let passed = 0;
    let failed = 0;

    // Test 1: Health Check
    log('📋 Test 1: Health Check', 'cyan');
    const health = await testEndpoint('Health Check', '/health');
    health.success ? passed++ : failed++;

    // Test 2: Carreras públicas
    log('\n📋 Test 2: Listar Carreras (público)', 'cyan');
    const carreras = await testEndpoint('GET /api/carreras', '/api/carreras');
    carreras.success ? passed++ : failed++;

    // Test 3: Login con credenciales inválidas
    log('\n📋 Test 3: Login con credenciales inválidas', 'cyan');
    const badLogin = await testEndpoint(
        'POST /api/auth/login (credenciales inválidas)',
        '/api/auth/login',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'usuario_inventado',
                password: 'password_incorrecto'
            })
        }
    );
    // Este debe fallar, así que invertimos la lógica
    !badLogin.success ? passed++ : failed++;

    // Test 4: Endpoint protegido sin token
    log('\n📋 Test 4: Endpoint protegido sin autenticación', 'cyan');
    const noAuth = await testEndpoint(
        'GET /api/aspirante/estado (sin token)',
        '/api/aspirante/estado'
    );
    // Este debe fallar
    !noAuth.success ? passed++ : failed++;

    // Test 5: Webhook sin firma
    log('\n📋 Test 5: Webhook sin firma válida', 'cyan');
    const webhook = await testEndpoint(
        'POST /api/webhooks/stripe (sin firma)',
        '/api/webhooks/stripe',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'stripe-signature': 'firma_invalida'
            },
            body: JSON.stringify({ type: 'test' })
        }
    );
    // Este debe fallar
    !webhook.success ? passed++ : failed++;

    // Resumen
    log('\n' + '='.repeat(50), 'bright');
    log(`\n📊 RESUMEN:`, 'bright');
    log(`   ✅ Pasados: ${passed}`, 'green');
    log(`   ❌ Fallidos: ${failed}`, 'red');
    log(`   📈 Total: ${passed + failed}`, 'blue');

    if (failed === 0) {
        log('\n🎉 ¡TODOS LOS TESTS PASARON!', 'green');
    } else {
        log(`\n⚠️  ${failed} test(s) fallaron`, 'yellow');
    }

    log('\n' + '='.repeat(50) + '\n', 'bright');

    return { passed, failed };
}

// Ejecutar tests
console.log('Esperando que el servidor esté listo...\n');
setTimeout(async () => {
    const results = await runTests();

    // Información adicional
    log('ℹ️  NOTAS:', 'cyan');
    log('   - El servidor debe estar corriendo en http://localhost:3000');
    log('   - Algunos tests están diseñados para fallar (ej: login inválido)');
    log('   - Para tests completos con datos reales, usa Postman o similar');

    process.exit(results.failed === 0 ? 0 : 1);
}, 2000);
