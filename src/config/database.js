import { PrismaClient } from '@prisma/client';

// Inisialisasi Prisma Client
const prisma = new PrismaClient({
    // Log query yang dijalankan ke console
    log: ['query', 'info', 'warn', 'error'],
});

export default prisma;