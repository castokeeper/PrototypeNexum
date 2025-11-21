import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Manejo de cierre de conexión
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});

export { prisma };
