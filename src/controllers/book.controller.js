// Import database dan validator
import prisma from '../config/database.js';
import { bookSchema } from '../validators/book.validator.js';

// Fungsi untuk mendapatkan semua buku 
export const getAllBooks = async (req, res) => {
    try {
        const books = await prisma.book.findMany({
            // Mengambil nama penulis dalam relasi
            include: { author: { select: { name: true } } } 
        });
        res.status(200).json(books);
    } catch (error) {
        // Log error untuk debugging internal
        console.error(error); 
        res.status(500).json({ message: 'Gagal mengambil data buku.' });
    }
};

// Fungsi untuk membuat buku baru 
export const createBook = async (req, res) => {
    try {
        const { error, value } = bookSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { title, isbn, stock, authorName } = value;

        // 1. Cek atau Buat Penulis (Author) menggunakan upsert
        const author = await prisma.author.upsert({
            where: { name: authorName },
            update: {},
            create: { name: authorName },
        });

        // 2. Buat Buku
        const newBook = await prisma.book.create({
            data: {
                title,
                isbn,
                stock,
                authorId: author.id,
                isAvailable: stock > 0
            },
            include: { author: { select: { name: true } } }
        });

        res.status(201).json({ message: 'Buku berhasil ditambahkan.', book: newBook });

    } catch (error) {
        if (error.code === 'P2002') { // Error jika ISBN duplikat
            return res.status(409).json({ message: 'ISBN sudah terdaftar.' });
        }
        res.status(500).json({ message: 'Gagal membuat buku baru.' });
    }
};

// Fungsi untuk mengupdate buku 
export const updateBook = async (req, res) => {
    return res.status(501).json({ message: 'UPDATE BOOK: Not Implemented Yet' });
};

// Fungsi untuk menghapus buku 
export const deleteBook = async (req, res) => {
    return res.status(501).json({ message: 'DELETE BOOK: Not Implemented Yet' });
};