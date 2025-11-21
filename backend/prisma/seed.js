import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed de la base de datos...');

    const carreras = [
        { codigo: 'ISC', nombre: 'Ingeniería en Sistemas Computacionales', activa: true },
        { codigo: 'II', nombre: 'Ingeniería Industrial', activa: true },
        { codigo: 'IGE', nombre: 'Ingeniería en Gestión Empresarial', activa: true },
        { codigo: 'LA', nombre: 'Licenciatura en Administración', activa: true },
        { codigo: 'CP', nombre: 'Contador Público', activa: true },
        { codigo: 'IM', nombre: 'Ingeniería Mecánica', activa: true },
        { codigo: 'IE', nombre: 'Ingeniería Electrónica', activa: true }
    ];

    console.log('📚 Creando carreras...');

    for (const carrera of carreras) {
        const existe = await prisma.carrera.findUnique({
            where: { codigo: carrera.codigo }
        });

        if (!existe) {
            await prisma.carrera.create({ data: carrera });
            console.log(`✅ Carrera creada: ${carrera.nombre}`);
        } else {
            console.log(`⏭️  Carrera ya existe: ${carrera.nombre}`);
        }
    }

    console.log('\n✨ Seed completado exitosamente!');
}

main()
    .catch((e) => {
        console.error('❌ Error durante el seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
