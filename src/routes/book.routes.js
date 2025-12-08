import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { getAllBooks, createBook, updateBook, deleteBook } from '../controllers/book.controller.js';

const router = Router();

// Endpoint Publik (Semua orang bisa melihat daftar buku)
router.get('/', getAllBooks);

// Endpoint Terproteksi (Hanya Admin)
// Middleware: authenticate (cek token) -> authorize (cek role 'ADMIN') -> controller
router.post('/', authenticate, authorize(['ADMIN']), createBook);
router.put('/:id', authenticate, authorize(['ADMIN']), updateBook);
router.delete('/:id', authenticate, authorize(['ADMIN']), deleteBook);

export default router;