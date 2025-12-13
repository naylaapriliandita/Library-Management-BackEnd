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
        // Tambahkan search, sortBy, order
        let { page = 1, limit = 10, userId, status, search = "", sortBy = "borrowedAt", order = "desc" } = req.query; 
        page = Number(page);
        limit = Math.min(Number(limit), 50);

        // Filter dasar (status dan userId)
        const baseWhere = {};
        const authenticatedUserId = req.user.userId;
        const authenticatedUserRole = req.user.role; 

        // Logika BOLA (sudah diperbaiki di langkah sebelumnya)
        if (authenticatedUserRole !== "ADMIN") {
            baseWhere.userId = authenticatedUserId;
        } else {
            if (userId) {
                baseWhere.userId = Number(userId);
            }
        }
        
        if (status) baseWhere.status = status;

        // Logika Search
        const searchWhere = search ? {
            OR: [
                // Search berdasarkan Judul Buku
                { book: { title: { contains: search, mode: "insensitive" } } }, 
                // Search berdasarkan Nama User
                { user: { name: { contains: search, mode: "insensitive" } } },
            ],
        } : {};

        // Gabungkan semua kondisi where
        const where = {
            ...baseWhere,
            ...searchWhere,
        };

        const totalRecords = await prisma.transaction.count({ where });
        const totalPages = Math.ceil(totalRecords / limit);
        
        // Sorting
        const orderBy = {};
        orderBy[sortBy] = order;

        const transactions = await prisma.transaction.findMany({
            where,
            orderBy, // Terapkan sorting
            skip: (page - 1) * limit,
            take: limit,
            include: { book: true, user: true },
        });

        res.json({
            success: true,
            data: transactions,
            pagination: { totalRecords, totalPages, currentPage: page },
        });
    } catch (err) {
        next(err);
    }
};