/**
 * Configuración de Tareas Programadas (Cron Jobs)
 * Ejecuta tareas de mantenimiento automáticamente
 */

import cron from 'node-cron';
import { limpiarUsuariosRechazados, obtenerEstadisticasRechazados } from '../services/cleanupService.js';

/**
 * Iniciar todas las tareas programadas
 */
export const iniciarCronJobs = () => {
    console.log('⏰ Iniciando tareas programadas...');

    // TAREA 1: Limpiar usuarios rechazados
    // Se ejecuta todos los días a las 2:00 AM
    const limpiezaJob = cron.schedule('0 2 * * *', async () => {
        console.log('\n🧹 ===== CRON: Limpieza de Usuarios Rechazados =====');
        console.log(`📅 Fecha: ${new Date().toLocaleString('es-MX')}`);

        try {
            const resultado = await limpiarUsuariosRechazados();
            console.log('✅ Limpieza completada:', resultado);
        } catch (error) {
            console.error('❌ Error en limpieza automática:', error);
        }

        console.log('===== FIN DE LIMPIEZA =====\n');
    }, {
        scheduled: true,
        timezone: "America/Mexico_City"
    });

    // TAREA 2: Reporte de estadísticas (opcional)
    // Se ejecuta todos los lunes a las 9:00 AM
    const reporteJob = cron.schedule('0 9 * * 1', async () => {
        console.log('\n📊 ===== CRON: Reporte Semanal =====');
        console.log(`📅 Fecha: ${new Date().toLocaleString('es-MX')}`);

        try {
            const stats = await obtenerEstadisticasRechazados();
            console.log('📈 Estadísticas de usuarios rechazados:');
            console.log(`   - Total rechazados: ${stats.totalRechazados}`);
            console.log(`   - Pendientes eliminación: ${stats.pendientesEliminacion}`);
            console.log(`   - Rechazados recientes: ${stats.recientes}`);
        } catch (error) {
            console.error('❌ Error en reporte:', error);
        }

        console.log('===== FIN DE REPORTE =====\n');
    }, {
        scheduled: true,
        timezone: "America/Mexico_City"
    });

    console.log('✅ Tareas programadas iniciadas:');
    console.log('   🧹 Limpieza diaria: Todos los días a las 2:00 AM');
    console.log('   📊 Reporte semanal: Lunes a las 9:00 AM');

    return {
        limpiezaJob,
        reporteJob
    };
};

/**
 * Detener todas las tareas programadas
 */
export const detenerCronJobs = (jobs) => {
    if (jobs.limpiezaJob) jobs.limpiezaJob.stop();
    if (jobs.reporteJob) jobs.reporteJob.stop();
    console.log('⏸️  Tareas programadas detenidas');
};

/**
 * Ejecutar limpieza manualmente (para testing)
 */
export const ejecutarLimpiezaManual = async () => {
    console.log('🧹 Ejecutando limpieza manual...');
    try {
        const resultado = await limpiarUsuariosRechazados();
        console.log('✅ Resultado:', resultado);
        return resultado;
    } catch (error) {
        console.error('❌ Error:', error);
        throw error;
    }
};

export default {
    iniciarCronJobs,
    detenerCronJobs,
    ejecutarLimpiezaManual
};
