import fetch from 'node-fetch';

async function testListaEspera() {
    try {
        // 1. Login
        console.log('🔑 Iniciando sesión...');
        const loginRes = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'admin',
                password: 'admin123'
            })
        });

        const loginData = await loginRes.json();

        if (!loginData.token) {
            console.error('❌ Error en login:', loginData);
            return;
        }

        console.log('✅ Login exitoso. Token obtenido.');

        // 2. Consultar Lista de Espera
        console.log('📋 Consultando lista de espera...');
        const listaRes = await fetch('http://localhost:3000/api/lista-espera', {
            headers: {
                'Authorization': `Bearer ${loginData.token}`
            }
        });

        const listaData = await listaRes.json();
        console.log('Status:', listaRes.status);
        console.log('Response:', JSON.stringify(listaData, null, 2));

    } catch (error) {
        console.error('Error:', error);
    }
}

testListaEspera();
