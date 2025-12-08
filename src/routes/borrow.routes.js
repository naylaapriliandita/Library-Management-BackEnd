// src/routes/borrow.routes.js
import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { borrowBook, returnBook } from '../controllers/borrow.controller.js';

const router = Router();

// Endpoint Peminjaman (Hanya USER yang bisa meminjam) 
// Note: Admin juga bisa meminjam, tapi fungsi ini diakses oleh USER
router.post('/borrow', authenticate, borrowBook); 

// Endpoint Pengembalian (ADMIN atau USER bisa mengembalikannya) 
// ADMIN yang memproses pengembalian untuk update status/denda
router.post('/return', authenticate, authorize(['ADMIN', 'USER']), returnBook); 

export default router;