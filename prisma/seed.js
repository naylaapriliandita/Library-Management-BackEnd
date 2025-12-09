import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10; 

// Utility function to hash password
async function hashPassword(password) {
    return bcrypt.hash(password, SALT_ROUNDS);
}

// Logika utama seeding
async function main() {
    console.log(`\nStart seeding...`);

    // Hashing password untuk initial users
    const adminPassword = await hashPassword('Admin123'); // Password kuat untuk Admin
    const userPassword = await hashPassword('User1234'); // Password standar untuk User
    
    // 1. ADMIN USER
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@library.com' },
        update: {},
        create: {
            name: 'Super Admin',
            email: 'admin@library.com',
            password: adminPassword,
            role: 'ADMIN',
        },
    });

    // 2. REGULAR USERS
    const usersData = [
        { name: 'User Pertama', email: 'user1@library.com', password: userPassword },
        { name: 'User Kedua', email: 'user2@library.com', password: userPassword },
        { name: 'User Ketiga', email: 'user3@library.com', password: userPassword },
    ];

    for (const data of usersData) {
        await prisma.user.upsert({
            where: { email: data.email },
            update: {},
            create: data,
        });
    }

    // 3. AUTHORS & BOOKS
    const author1 = await prisma.author.upsert({
        where: { name: 'Andrea Hirata' },
        update: {},
        create: { name: 'Andrea Hirata' },
    });

    const author2 = await prisma.author.upsert({
        where: { name: 'Tere Liye' },
        update: {},
        create: { name: 'Tere Liye' },
    });
    
    const booksData = [
        { title: 'Laskar Pelangi', isbn: '9789799845511', stock: 5, authorId: author1.id },
        { title: 'Sang Pemimpi', isbn: '9789799845528', stock: 2, authorId: author1.id },
        { title: 'Pergi', isbn: '9786020332214', stock: 8, authorId: author2.id },
        { title: 'Pulang', isbn: '9786020324844', stock: 0, authorId: author2.id, isAvailable: false }, // Stok 0
    ];

    for (const data of booksData) {
        await prisma.book.upsert({
            where: { isbn: data.isbn },
            update: {},
            create: data,
        });
    }

    console.log(`Created Admin ID: ${adminUser.id}. Seeding finished.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });