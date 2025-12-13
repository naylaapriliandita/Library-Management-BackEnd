import prisma from "../config/prisma.js";

export const createBook = async (req, res, next) => {
    try {
        // Ambil authorId, bukan author
        const { title, authorId, stock } = req.body; 

        const book = await prisma.book.create({
            data: {
                title,
                // Gunakan authorId dan pastikan tipenya Number
                authorId: Number(authorId), 
                stock: Number(stock),
            },
        });

        res.status(201).json({
            success: true,
            message: "Buku berhasil ditambahkan",
            data: book,
        });
    } catch (err) {
        next(err);
    }
};

export const getBooks = async (req, res, next) => {
    try {
        let { page = 1, limit = 10, search = "", sortBy = "createdAt", order = "asc" } = req.query;
        page = Number(page);
        limit = Math.min(Number(limit), 50); // max 50

        const where = search
            ? {
                OR: [
                        { title: { contains: search, mode: "insensitive" } },
                        { author: { name: { contains: search, mode: "insensitive" } } },
                    ],
                }
            : {};

        const totalRecords = await prisma.book.count({ where });
        const totalPages = Math.ceil(totalRecords / limit);
        const books = await prisma.book.findMany({
            where,
            orderBy: { [sortBy]: order },
            skip: (page - 1) * limit,
            take: limit,
            include: { author: true },
        });

        res.json({
            success: true,
            data: books,
            pagination: { totalRecords, totalPages, currentPage: page },
        });
    } catch (err) {
        next(err);
    }
};

export const getBookById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const book = await prisma.book.findUnique({
            where: { id: Number(id) },
        });

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Buku tidak ditemukan",
            });
        }

        res.json({
            success: true,
            data: book,
        });
    } catch (err) {
        next(err);
    }
};

export const updateBook = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Ambil authorId, bukan author
        const { title, authorId, stock } = req.body; 

        const updateData = {};
        // Hanya tambahkan field yang ada di body untuk diupdate
        if (title) updateData.title = title;
        if (authorId !== undefined) updateData.authorId = Number(authorId); 
        if (stock !== undefined) updateData.stock = Number(stock); 

        const book = await prisma.book.update({
            where: { id: Number(id) },
            data: updateData, // Kirim hanya data yang diubah
        });

        res.json({
            success: true,
            message: "Buku berhasil diperbarui",
            data: book,
        });
    } catch (err) {
        next(err);
    }
};

export const deleteBook = async (req, res, next) => {
    try {
        const { id } = req.params;

        await prisma.book.delete({
            where: { id: Number(id) },
        });

        res.json({
            success: true,
            message: "Buku berhasil dihapus",
        });
    } catch (err) {
        next(err);
    }
};