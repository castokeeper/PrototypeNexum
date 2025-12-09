import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed de la base de datos...');

    // Carreras técnicas del CETis 120 - Oferta educativa 2024-2025
    const carreras = [
        { codigo: 'ARH', nombre: 'Técnico en Administración de Recursos Humanos', activa: true },
        { codigo: 'CIB', nombre: 'Técnico en Ciberseguridad', activa: true },
        { codigo: 'CON', nombre: 'Técnico en Contabilidad', activa: true },
        { codigo: 'ELE', nombre: 'Técnico en Electrónica', activa: true },
        { codigo: 'IA', nombre: 'Técnico en Inteligencia Artificial', activa: true },
        { codigo: 'OFI', nombre: 'Técnico en Ofimática', activa: true },
        { codigo: 'PRO', nombre: 'Técnico en Programación', activa: true },
        { codigo: 'PUE', nombre: 'Técnico en Puericultura', activa: true },
        { codigo: 'SHO', nombre: 'Técnico en Servicios de Hospedaje', activa: true },
        { codigo: 'SMC', nombre: 'Técnico en Soporte y Mantenimiento de Equipo de Cómputo', activa: true },
        { codigo: 'VEN', nombre: 'Técnico en Ventas', activa: true }
    ];

    console.log('📚 Creando/actualizando carreras del CETis 120...');

    for (const carrera of carreras) {
        const existe = await prisma.carrera.findUnique({
            where: { codigo: carrera.codigo }
        });

        if (!existe) {
            await prisma.carrera.create({ data: carrera });
            console.log(`✅ Carrera creada: ${carrera.nombre}`);
        } else {
            // Actualizar si ya existe
            await prisma.carrera.update({
                where: { codigo: carrera.codigo },
                data: { nombre: carrera.nombre, activa: carrera.activa }
            });
            console.log(`🔄 Carrera actualizada: ${carrera.nombre}`);
        }
    }

    // Desactivar carreras antiguas que ya no están en la oferta
    const carrerasActuales = carreras.map(c => c.codigo);
    await prisma.carrera.updateMany({
        where: {
            codigo: { notIn: carrerasActuales }
        },
        data: { activa: false }
    });

    console.log('\n✨ Seed completado exitosamente!');
    console.log(`📊 Total de carreras activas: ${carreras.length}`);
}

main()
    .catch((e) => {
        console.error('❌ Error durante el seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
