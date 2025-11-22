/**
 * Script de Prueba - Cron Job de Limpieza
 * Ejecuta la limpieza de usuarios rechazados manualmente
 */

import dotenv from 'dotenv';
import { prisma } from './src/config/database.js';
import { limpiarUsuariosRechazados, obtenerEstadisticasRechazados } from './src/services/cleanupService.js';

dotenv.config();

async function probarCronJob() {
    console.log('🧪 ===== PRUEBA DE CRON JOB =====\n');

    try {
        // 1. Mostrar estadísticas antes
        console.log('📊 Paso 1: Estadísticas ANTES de la limpieza');
        console.log('─'.repeat(50));
        const statsAntes = await obtenerEstadisticasRechazados();
        console.log('Total rechazados:', statsAntes.totalRechazados);
        console.log('Pendientes eliminación:', statsAntes.pendientesEliminacion);
        console.log('Rechazados recientes:', statsAntes.recientes);
        console.log('Fecha límite:', new Date(statsAntes.fechaLimite).toLocaleString('es-MX'));
        console.log('');

        // 2. Listar usuarios pendientes
        if (statsAntes.pendientesEliminacion > 0) {
            console.log('👥 Paso 2: Usuarios pendientes de eliminación');
            console.log('─'.repeat(50));

            const fechaLimite = new Date();
            fechaLimite.setDate(fechaLimite.getDate() - 7);

            const usuarios = await prisma.usuario.findMany({
                where: {
                    estatus: 'rechazado',
                    fechaRechazo: { lte: fechaLimite }
                },
                select: {
                    id: true,
                    nombre: true,
                    email: true,
                    fechaRechazo: true
                }
            });

            usuarios.forEach((usuario, index) => {
                const diasDesdeRechazo = Math.floor(
                    (new Date() - new Date(usuario.fechaRechazo)) / (1000 * 60 * 60 * 24)
                );
                console.log(`${index + 1}. ${usuario.nombre} (${usuario.email})`);
                console.log(`   ID: ${usuario.id}`);
                console.log(`   Rechazado hace: ${diasDesdeRechazo} días`);
                console.log('');
            });
        } else {
            console.log('✅ No hay usuarios pendientes de eliminación\n');
        }

        // 3. Ejecutar limpieza
        console.log('🧹 Paso 3: Ejecutando limpieza...');
        console.log('─'.repeat(50));
        const resultado = await limpiarUsuariosRechazados();
        console.log('\n📋 Resultado:');
        console.log('   Total procesados:', resultado.total || 0);
        console.log('   Eliminados:', resultado.eliminados || 0);
        console.log('   Errores:', resultado.errores || 0);
        console.log('   Mensaje:', resultado.mensaje);
        console.log('');

        // 4. Mostrar estadísticas después
        console.log('📊 Paso 4: Estadísticas DESPUÉS de la limpieza');
        console.log('─'.repeat(50));
        const statsDespues = await obtenerEstadisticasRechazados();
        console.log('Total rechazados:', statsDespues.totalRechazados);
        console.log('Pendientes eliminación:', statsDespues.pendientesEliminacion);
        console.log('Rechazados recientes:', statsDespues.recientes);
        console.log('');

        // 5. Resumen
        console.log('✅ ===== PRUEBA COMPLETADA =====');
        console.log('');
        console.log('Cambios:');
        console.log(`   Usuarios eliminados: ${statsAntes.pendientesEliminacion - statsDespues.pendientesEliminacion}`);
        console.log('');

    } catch (error) {
        console.error('❌ Error durante la prueba:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

// Para crear un usuario de prueba rechazado (opcional)
async function crearUsuarioPruebaRechazado() {
    console.log('🧪 Creando usuario de prueba rechazado...\n');

    try {
        // Crear fecha de rechazo hace 8 días (para que sea elegible)
        const fechaRechazo = new Date();
        fechaRechazo.setDate(fechaRechazo.getDate() - 8);

        const usuario = await prisma.usuario.create({
            data: {
                username: `test_rechazado_${Date.now()}@test.com`,
                passwordHash: 'hash_dummy',
                nombre: 'Usuario de Prueba Rechazado',
                email: `test_${Date.now()}@test.com`,
                rol: 'aspirante',
                estatus: 'rechazado',
                temporal: true,
                activo: false,
                fechaRechazo: fechaRechazo
            }
        });

        console.log('✅ Usuario de prueba creado:');
        console.log('   ID:', usuario.id);
        console.log('   Email:', usuario.email);
        console.log('   Fecha rechazo:', fechaRechazo.toLocaleString('es-MX'));
        console.log('   Días desde rechazo: 8');
        console.log('');
        console.log('Este usuario será eliminado al ejecutar la limpieza.\n');

        return usuario;

    } catch (error) {
        console.error('❌ Error al crear usuario de prueba:', error);
        throw error;
    }
}

// Menú interactivo
async function main() {
    const args = process.argv.slice(2);
    const comando = args[0];

    if (comando === 'crear-prueba') {
        await crearUsuarioPruebaRechazado();
        await prisma.$disconnect();
    } else if (comando === 'limpiar' || !comando) {
        await probarCronJob();
    } else {
        console.log('Uso:');
        console.log('  node test-cron.js              # Ejecutar limpieza');
        console.log('  node test-cron.js limpiar       # Ejecutar limpieza');
        console.log('  node test-cron.js crear-prueba # Crear usuario de prueba');
        await prisma.$disconnect();
    }
}

main().catch(console.error);
