import prisma from "../config/prisma.js";

// Pinjam buku
export const borrowBook = async (req, res, next) => {
    try {
        const { bookId } = req.body;
        const userId = req.user.userId;

        const book = await prisma.book.findUnique({ where: { id: Number(bookId) } });
        if (!book || book.stock <= 0) {
            return res.status(400).json({ success: false, message: "Buku tidak tersedia" });
        }

        // Kurangi stock
        await prisma.book.update({
            where: { id: Number(bookId) },
            data: { stock: book.stock - 1 },
        });

        const transaction = await prisma.transaction.create({
            data: { userId, bookId, status: "BORROWED" },
        });

        res.status(201).json({ success: true, data: transaction });
    } catch (err) {
        next(err);
    }
};

// Kembalikan buku
export const returnBook = async (req, res, next) => {
    try {
        const { id } = req.params; // transaction id
        const userId = req.user.userId;

        const transaction = await prisma.transaction.findUnique({ where: { id: Number(id) } });

        if (!transaction || transaction.userId !== userId) {
            return res.status(404).json({ success: false, message: "Transaksi tidak ditemukan" });
        }

        if (transaction.status === "RETURNED") {
            return res.status(400).json({ success: false, message: "Buku sudah dikembalikan" });
        }

        // Update status dan kembalikan stock
        await prisma.transaction.update({
            where: { id: Number(id) },
            data: { status: "RETURNED", returnedAt: new Date() },
        });

        await prisma.book.update({
            where: { id: transaction.bookId },
            data: { stock: { increment: 1 } },
        });

        res.json({ success: true, message: "Buku berhasil dikembalikan" });
    } catch (err) {
        next(err);
    }
};

// Lihat semua transaksi user
export const getTransactions = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const transactions = await prisma.transaction.findMany({
            where: { userId },
            include: { book: true },
        });
        res.json({ success: true, data: transactions });
    } catch (err) {
        next(err);
    }
};