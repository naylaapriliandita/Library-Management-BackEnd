import prisma from "../config/prisma.js";

export const createBook = async (req, res, next) => {
    try {
        const { title, author, stock } = req.body;

        const book = await prisma.book.create({
            data: {
                title,
                author,
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
        const books = await prisma.book.findMany();

            res.json({
            success: true,
            data: books,
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