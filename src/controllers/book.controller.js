// Import database dan validator
import prisma from '../config/database.js';
import { bookSchema } from '../validators/book.validator.js';

// Fungsi untuk mendapatkan semua buku 
export const getAllBooks = async (req, res) => {
    return res.status(501).json({ message: 'GET ALL BOOKS: Not Implemented Yet' });
};

// Fungsi untuk membuat buku baru 
export const createBook = async (req, res) => {
    return res.status(501).json({ message: 'CREATE BOOK: Not Implemented Yet' });
};

// Fungsi untuk mengupdate buku 
export const updateBook = async (req, res) => {
    return res.status(501).json({ message: 'UPDATE BOOK: Not Implemented Yet' });
};

// Fungsi untuk menghapus buku 
export const deleteBook = async (req, res) => {
    return res.status(501).json({ message: 'DELETE BOOK: Not Implemented Yet' });
};