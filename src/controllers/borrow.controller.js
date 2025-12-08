import prisma from '../config/database.js';
import { borrowSchema } from '../validators/borrow.validator.js';

// Peminjaman Buku (Create BorrowRecord) 
export const borrowBook = async (req, res) => {
    // User ID diambil dari token. Hanya USER yang bisa meminjam.
    const borrowerId = req.user.id; 

    try {
        // 1. Validasi Input (hanya bookId yang dipertimbangkan)
        const { error, value } = borrowSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { bookId } = value;
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7); // Set due date 7 hari dari sekarang

        // 2. Cek Stok dan Ketersediaan Buku
        const book = await prisma.book.findUnique({ where: { id: bookId } });
        if (!book || book.stock <= 0) {
            return res.status(404).json({ message: 'Buku tidak tersedia atau stok habis.' });
        }

        // 3. Cek apakah User sudah meminjam buku ini dan belum mengembalikannya
        const existingBorrow = await prisma.borrowRecord.findFirst({
            where: {
                userId: borrowerId,
                bookId: bookId,
                status: 'BORROWED',
            },
        });
        if (existingBorrow) {
            return res.status(409).json({ message: 'Anda sudah meminjam buku ini dan belum mengembalikannya.' });        }

        // 4. Mulai Transaksi Database 
        // Transaksi memastikan update stok dan create record terjadi bersamaan, atau gagal bersamaan
        await prisma.$transaction([
            // a) Kurangi Stok Buku
            prisma.book.update({
                where: { id: bookId },
                data: { stock: { decrement: 1 } },
            }),
            // b) Buat Record Peminjaman Baru
            prisma.borrowRecord.create({
                data: {
                    userId: borrowerId,
                    bookId: bookId,
                    dueDate: dueDate,
                    status: 'BORROWED',
                },
            }),
        ]);
        res.status(201).json({ message: 'Peminjaman berhasil. Harap kembalikan dalam 7 hari.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal memproses peminjaman.' });
    }
};

// Pengembalian Buku (Update BorrowRecord) 
export const returnBook = async (req, res) => {
    const { recordId } = req.body;
    const recordIdNum = parseInt(recordId);
    try {
        // 1. Validasi Record Peminjaman
        const record = await prisma.borrowRecord.findUnique({ where: { id: recordIdNum } });
        if (!record) {
            return res.status(404).json({ message: 'Record peminjaman tidak ditemukan.' });
        }
        if (record.status !== 'BORROWED') {
            return res.status(400).json({ message: 'Buku ini sudah dikembalikan sebelumnya.' });
        }
        const returnDate = new Date();

        // 2. Tentukan status apakah OVERDUE
        const isOverdue = returnDate > record.dueDate;

        // 3. Mulai Transaksi Database
        await prisma.$transaction([
            // a) Tambah Stok Buku
            prisma.book.update({
                where: { id: record.bookId },
                data: { stock: { increment: 1 } },
            }),
            // b) Update Record Peminjaman
            prisma.borrowRecord.update({
                where: { id: recordIdNum },
                data: {
                    returnDate: returnDate,
                    status: isOverdue ? 'OVERDUE' : 'RETURNED',
                },
            }),
        ]);
        res.status(200).json({ 
            message: `Buku berhasil dikembalikan. Status: ${isOverdue ? 'OVERDUE (Terlambat)' : 'RETURNED'}` 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal memproses pengembalian.' });
    }
};