import dotenv from 'dotenv';
dotenv.config(); 

import prisma from "../src/config/prisma.js";
import { hashPassword } from "../src/utils/hash.js"; 

async function main() {
    console.log("Memulai proses seeding database...");

    // 1. CLEANUP (Idempotence): Hapus data lama (Child -> Parent)
    console.log("1. Cleaning up existing data...");
    await prisma.transaction.deleteMany();
    await prisma.book.deleteMany();
    await prisma.author.deleteMany();
    await prisma.user.deleteMany();
    console.log("Cleanup selesai.");

    // 2. USER SEEDING (Minimal 5 users, 1 Admin)
    const adminPassword = await hashPassword("admin123");
    const userPassword = await hashPassword("user123");

    await prisma.user.createMany({
        data: [
            { name: "Admin Utama", email: "admin@mail.com", password: adminPassword, role: "ADMIN" },
            { name: "User Reguler 1", email: "user1@mail.com", password: userPassword, role: "USER" },
            { name: "User Reguler 2", email: "user2@mail.com", password: userPassword, role: "USER" },
            { name: "User Reguler 3", email: "user3@mail.com", password: userPassword, role: "USER" },
            { name: "User Reguler 4", email: "user4@mail.com", password: userPassword, role: "USER" },
        ],
    });
    console.log("2. Seed 5 akun Pengguna berhasil.");

    // Ambil ID user untuk relasi
    const adminUser = await prisma.user.findFirst({ where: { email: "admin@mail.com" } });
    const user1 = await prisma.user.findFirst({ where: { email: "user1@mail.com" } });
    const user2 = await prisma.user.findFirst({ where: { email: "user2@mail.com" } });
    const user3 = await prisma.user.findFirst({ where: { email: "user3@mail.com" } });

    // 3. AUTHOR SEEDING
    await prisma.author.createMany({
        data: [
            { name: "J.K. Rowling", bio: "Penulis seri Harry Potter." },
            { name: "Andrea Hirata", bio: "Penulis Laskar Pelangi." },
            { name: "Haruki Murakami", bio: "Penulis surealisme Jepang." },
            { name: "Agatha Christie", bio: "Ratu fiksi kriminal." },
            { name: "Tere Liye", bio: "Penulis fiksi populer Indonesia." },
        ],
    });
    console.log("3. Seed 5 Penulis berhasil.");

    const jkRowling = await prisma.author.findFirst({ where: { name: "J.K. Rowling" } });
    const andreaHirata = await prisma.author.findFirst({ where: { name: "Andrea Hirata" } });
    const agathaChristie = await prisma.author.findFirst({ where: { name: "Agatha Christie" } });
    const harukiMurakami = await prisma.author.findFirst({ where: { name: "Haruki Murakami" } });
    const tereLiye = await prisma.author.findFirst({ where: { name: "Tere Liye" } });

    // 4. BOOK SEEDING
    await prisma.book.createMany({
        data: [
            { title: "Harry Potter 1", authorId: jkRowling.id, stock: 10 },
            { title: "Laskar Pelangi", authorId: andreaHirata.id, stock: 5 },
            { title: "Norwegian Wood", authorId: harukiMurakami.id, stock: 3 },
            { title: "And Then There Were None", authorId: agathaChristie.id, stock: 12 },
            { title: "Bumi", authorId: tereLiye.id, stock: 8 },
            { title: "Harry Potter 2", authorId: jkRowling.id, stock: 6 },
        ],
    });
    console.log("4. Seed 6 Buku berhasil.");

    // Asumsi: Title buku adalah @unique di schema Anda
    const book1 = await prisma.book.findFirst({ where: { title: "Harry Potter 1" } }); 
    const book2 = await prisma.book.findFirst({ where: { title: "Laskar Pelangi" } });  
    const book3 = await prisma.book.findFirst({ where: { title: "Norwegian Wood" } });  
    const book4 = await prisma.book.findFirst({ where: { title: "And Then There Were None" } }); 

    // 5. TRANSACTION SEEDING
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const yesterday = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);

    const transactionData = [
        // 1. User1 - Dipinjam (BORROWED)
        { userId: user1.id, bookId: book1.id, status: "BORROWED" },
        // 2. User2 - Dipinjam (BORROWED)
        { userId: user2.id, bookId: book2.id, status: "BORROWED" },
        // 3. User1 - Sudah Dikembalikan (RETURNED)
        { userId: user1.id, bookId: book3.id, status: "RETURNED", borrowedAt: threeDaysAgo, returnedAt: yesterday },
        // 4. User3 - Dipinjam (BORROWED)
        { userId: user3.id, bookId: book1.id, status: "BORROWED" },
        // 5. Admin - Dipinjam (BORROWED)
        { userId: adminUser.id, bookId: book4.id, status: "BORROWED" },
    ];

    await prisma.transaction.createMany({ data: transactionData });
    console.log("5. Seed 5 Transaksi berhasil.");

    // 6. FINAL STOCK ADJUSTMENT
    const borrowedBookIds = transactionData
        .filter(t => t.status === 'BORROWED')
        .map(t => t.bookId);

    const uniqueBorrowedIds = [...new Set(borrowedBookIds)];

    for (const bookId of uniqueBorrowedIds) {
        const count = borrowedBookIds.filter(id => id === bookId).length;

        await prisma.book.update({
            where: { id: bookId },
            data: { stock: { decrement: count } }
        });
    }

    console.log("6. Stock buku telah disesuaikan berdasarkan transaksi BORROWED.");
    console.log("Proses seeding selesai! Database siap digunakan.");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());