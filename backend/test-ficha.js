import fetch from 'node-fetch';

async function testCreateFicha() {
    try {
        const response = await fetch('http://localhost:3000/api/fichas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: "Test",
                apellidoPaterno: "Usuario",
                apellidoMaterno: "Prueba",
                curp: "TEST990101HDFRXX01",
                fechaNacimiento: "1999-01-01",
                telefono: "5512345678",
                email: "test@example.com",
                carreraId: 1,
                turnoPreferido: "matutino"
            })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

testCreateFicha();
