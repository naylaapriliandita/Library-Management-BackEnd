import prisma from "../config/prisma.js";

export const createAuthor = async (req, res, next) => {
    try {
        const { name, bio } = req.body;
        const author = await prisma.author.create({ data: { name, bio } });
        res.status(201).json({
        success: true,
        message: "Author berhasil ditambahkan",
        data: author,
        });
    } catch (err) {
        next(err);
    }
};

export const getAuthors = async (req, res, next) => {
    try {
        // Tambahkan query params: page, limit, search, sortBy, order
        let { page = 1, limit = 10, search = "", sortBy = "createdAt", order = "desc" } = req.query; 
        page = Number(page);
        limit = Math.min(Number(limit), 50); // Maksimal 50 records per halaman

        const where = search
            ? {
                // Search hanya berdasarkan nama penulis (case-insensitive)
                name: { contains: search, mode: "insensitive" },
              }
            : {};

        const totalRecords = await prisma.author.count({ where });
        const totalPages = Math.ceil(totalRecords / limit);

        const authors = await prisma.author.findMany({
            where,
            orderBy: { [sortBy]: order },
            skip: (page - 1) * limit,
            take: limit,
            include: { books: true },
        });

        res.json({
            success: true,
            data: authors,
            // Tambahkan objek pagination
            pagination: { totalRecords, totalPages, currentPage: page }, 
        });
    } catch (err) {
        next(err);
    }
};

export const getAuthorById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const author = await prisma.author.findUnique({
            where: { id: Number(id) },
            include: { books: true },
        });
        if (!author) return res.status(404).json({ success: false, message: "Author tidak ditemukan" });
        res.json({ success: true, data: author });
    } catch (err) {
        next(err);
    }
};

export const updateAuthor = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, bio } = req.body;
        const author = await prisma.author.update({
            where: { id: Number(id) },
            data: { name, bio },
        });
        res.json({ success: true, message: "Author berhasil diperbarui", data: author });
    } catch (err) {
        next(err);
    }
};

export const deleteAuthor = async (req, res, next) => {
    try {
        const { id } = req.params;
        await prisma.author.delete({ where: { id: Number(id) } });
        res.json({ success: true, message: "Author berhasil dihapus" });
    } catch (err) {
        next(err);
    }
};