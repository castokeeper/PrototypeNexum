import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createAdmin() {
    try {
        const hashedPassword = await bcrypt.hash('admin123', 10);

        const admin = await prisma.usuario.upsert({
            where: { username: 'admin' },
            update: {},
            create: {
                username: 'admin',
                passwordHash: hashedPassword,
                nombre: 'Administrador del Sistema',
                rol: 'admin',
                activo: true
            }
        });

        console.log('✅ Usuario admin creado/verificado:', admin.username);
    } catch (error) {
        console.error('❌ Error al crear admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
