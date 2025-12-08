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
    try {
        const { id } = req.params; 
        const bookId = parseInt(id);

        const { error, value } = bookSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { title, isbn, stock, authorName } = value;
        
        // 1. Cek apakah buku yang akan diupdate ada
        const existingBook = await prisma.book.findUnique({ where: { id: bookId } });
        if (!existingBook) {
            return res.status(404).json({ message: 'Buku tidak ditemukan.' });
        }

        // 2. Cek atau Buat Penulis (Author) - Upsert
        const author = await prisma.author.upsert({
            where: { name: authorName },
            update: {},
            create: { name: authorName },
        });

        // 3. Update Buku
        const updatedBook = await prisma.book.update({
            where: { id: bookId },
            data: {
                title,
                isbn,
                stock,
                authorId: author.id,
                isAvailable: stock > 0,
            },
            include: { author: { select: { name: true } } }
        });

        res.status(200).json({ 
            message: 'Buku berhasil diperbarui.', 
            book: updatedBook 
        });

    } catch (error) {
        if (error.code === 'P2002') { // Error jika ISBN duplikat
            return res.status(409).json({ message: 'ISBN sudah digunakan oleh buku lain.' });
        }
        console.error(error);
        res.status(500).json({ message: 'Gagal memperbarui buku.' });
    }
};

// Fungsi untuk menghapus buku 
export const deleteBook = async (req, res) => {
    try {
        const { id } = req.params; 
        const bookId = parseInt(id);

        // 1. Cek apakah buku ini sedang dipinjam (masih berstatus 'BORROWED')
        const isBorrowed = await prisma.borrowRecord.findFirst({
            where: {
                bookId: bookId,
                status: 'BORROWED' 
            }
        });

        if (isBorrowed) {
            return res.status(409).json({ 
                message: 'Buku tidak bisa dihapus karena sedang dipinjam.' 
            });
        }
        
        // 2. Hapus Buku
        const deletedBook = await prisma.book.delete({
            where: { id: bookId }
        });

        res.status(200).json({ 
            message: 'Buku berhasil dihapus.', 
            book: deletedBook
        });

    } catch (error) {
        if (error.code === 'P2025') { // Error: Record tidak ditemukan
            return res.status(404).json({ message: 'Buku tidak ditemukan.' });
        }
        console.error(error);
        res.status(500).json({ message: 'Gagal menghapus buku.' });
    }
};