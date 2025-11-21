/**
 * Script para crear alumnos de prueba
 * Ejecutar: node create-test-alumnos.js
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const alumnosPrueba = [
    {
        numeroControl: '21240001',
        nombre: 'Juan',
        apellidoPaterno: 'Pérez',
        apellidoMaterno: 'García',
        curp: 'PEGJ010115HDFRRS01',
        fechaNacimiento: new Date('2001-01-15'),
        genero: 'masculino',
        email: 'juan.perez@email.com',
        telefono: '5512345678',
        direccion: 'Calle Principal 123, Centro',
        semestre: 5,
        estatus: 'activo',
        promedio: 87.5,
        creditosAcumulados: 120
    },
    {
        numeroControl: '21240002',
        nombre: 'María',
        apellidoPaterno: 'González',
        apellidoMaterno: 'López',
        curp: 'GOLM020220MDFNPR02',
        fechaNacimiento: new Date('2002-02-20'),
        genero: 'femenino',
        email: 'maria.gonzalez@email.com',
        telefono: '5523456789',
        direccion: 'Avenida Reforma 456, Norte',
        semestre: 6,
        estatus: 'activo',
        promedio: 92.3,
        creditosAcumulados: 150
    },
    {
        numeroControl: '21240003',
        nombre: 'Carlos',
        apellidoPaterno: 'Martínez',
        apellidoMaterno: 'Hernández',
        curp: 'MAHC030312HDFRRR03',
        fechaNacimiento: new Date('2003-03-12'),
        genero: 'masculino',
        email: 'carlos.martinez@email.com',
        telefono: '5534567890',
        direccion: 'Calle Juárez 789, Sur',
        semestre: 4,
        estatus: 'activo',
        promedio: 85.0,
        creditosAcumulados: 100
    },
    {
        numeroControl: '21240004',
        nombre: 'Ana',
        apellidoPaterno: 'Rodríguez',
        apellidoMaterno: 'Sánchez',
        curp: 'ROSA040425MDFNNN04',
        fechaNacimiento: new Date('2004-04-25'),
        genero: 'femenino',
        email: 'ana.rodriguez@email.com',
        telefono: '5545678901',
        direccion: 'Avenida Hidalgo 321, Este',
        semestre: 3,
        estatus: 'baja_temporal',
        promedio: 78.9,
        creditosAcumulados: 75
    },
    {
        numeroControl: '20240001',
        nombre: 'Luis',
        apellidoPaterno: 'Fernández',
        apellidoMaterno: 'Morales',
        curp: 'FEML000530HDFRRS05',
        fechaNacimiento: new Date('2000-05-30'),
        genero: 'masculino',
        email: 'luis.fernandez@email.com',
        telefono: '5556789012',
        direccion: 'Calle Morelos 654, Oeste',
        semestre: 9,
        estatus: 'egresado',
        promedio: 89.7,
        creditosAcumulados: 240,
        fechaEgreso: new Date('2024-07-15')
    },
    {
        numeroControl: '21240005',
        nombre: 'Sofía',
        apellidoPaterno: 'Torres',
        apellidoMaterno: 'Ramírez',
        curp: 'TORS010606MDFRRR06',
        fechaNacimiento: new Date('2001-06-06'),
        genero: 'femenino',
        email: 'sofia.torres@email.com',
        telefono: '5567890123',
        direccion: 'Avenida Independencia 987, Centro',
        semestre: 7,
        estatus: 'activo',
        promedio: 94.2,
        creditosAcumulados: 180
    },
    {
        numeroControl: '21240006',
        nombre: 'Miguel',
        apellidoPaterno: 'Flores',
        apellidoMaterno: 'Castro',
        curp: 'FOCM020715HDFRRR07',
        fechaNacimiento: new Date('2002-07-15'),
        genero: 'masculino',
        email: 'miguel.flores@email.com',
        telefono: '5578901234',
        direccion: 'Calle Allende 135, Norte',
        semestre: 5,
        estatus: 'activo',
        promedio: 81.4,
        creditosAcumulados: 125
    },
    {
        numeroControl: '21240007',
        nombre: 'Valentina',
        apellidoPaterno: 'Ruiz',
        apellidoMaterno: 'Ortiz',
        curp: 'RUOV030820MDFRRR08',
        fechaNacimiento: new Date('2003-08-20'),
        genero: 'femenino',
        email: 'valentina.ruiz@email.com',
        telefono: '5589012345',
        direccion: 'Avenida 5 de Mayo 246, Sur',
        semestre: 4,
        estatus: 'activo',
        promedio: 88.6,
        creditosAcumulados: 105
    }
];

async function createTestAlumnos() {
    try {
        console.log('🔍 Verificando carreras...');

        // Obtener carreras disponibles
        const carreras = await prisma.carrera.findMany({
            where: { activa: true }
        });

        if (carreras.length === 0) {
            console.error('❌ No hay carreras activas. Ejecuta el seed primero.');
            return;
        }

        console.log(`✅ Encontradas ${carreras.length} carreras activas`);

        console.log('\n📝 Creando alumnos de prueba...\n');

        let creados = 0;
        let actualizados = 0;

        for (const alumnoData of alumnosPrueba) {
            // Asignar carrera aleatoria
            const carreraAleatoria = carreras[Math.floor(Math.random() * carreras.length)];

            try {
                const alumno = await prisma.alumno.upsert({
                    where: { numeroControl: alumnoData.numeroControl },
                    update: {},
                    create: {
                        ...alumnoData,
                        carreraId: carreraAleatoria.id,
                        fechaIngreso: new Date('2021-08-15')
                    }
                });

                if (alumno) {
                    if (alumno.createdAt.getTime() === alumno.updatedAt.getTime()) {
                        creados++;
                        console.log(`✅ Creado: ${alumno.nombre} ${alumno.apellidoPaterno} (${alumno.numeroControl})`);
                    } else {
                        actualizados++;
                        console.log(`↻  Ya existe: ${alumno.nombre} ${alumno.apellidoPaterno} (${alumno.numeroControl})`);
                    }
                }
            } catch (error) {
                console.error(`❌ Error al crear ${alumnoData.nombre}:`, error.message);
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('📊 RESUMEN');
        console.log('='.repeat(60));
        console.log(`Total de alumnos procesados: ${alumnosPrueba.length}`);
        console.log(`✅ Creados: ${creados}`);
        console.log(`↻  Ya existían: ${actualizados}`);
        console.log('='.repeat(60));

        // Mostrar estadísticas
        console.log('\n📈 Estadísticas del sistema:\n');

        const [total, activos, bajaTemporal, egresados, bajaDefinitiva] = await Promise.all([
            prisma.alumno.count(),
            prisma.alumno.count({ where: { estatus: 'activo' } }),
            prisma.alumno.count({ where: { estatus: 'baja_temporal' } }),
            prisma.alumno.count({ where: { estatus: 'egresado' } }),
            prisma.alumno.count({ where: { estatus: 'baja_definitiva' } })
        ]);

        console.log(`Total de alumnos en el sistema: ${total}`);
        console.log(`  - Activos: ${activos}`);
        console.log(`  - Baja Temporal: ${bajaTemporal}`);
        console.log(`  - Egresados: ${egresados}`);
        console.log(`  - Baja Definitiva: ${bajaDefinitiva}`);

        console.log('\n✨ Script completado exitosamente\n');

    } catch (error) {
        console.error('❌ Error general:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createTestAlumnos();
