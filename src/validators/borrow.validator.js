import Joi from 'joi';

// Skema untuk Peminjaman Buku
export const borrowSchema = Joi.object({
  bookId: Joi.number().integer().required(),
  // userId akan diambil dari token (req.user)
  userId: Joi.number().integer(), 
});

// Skema untuk Pengembalian Buku
export const returnSchema = Joi.object({
    recordId: Joi.number().integer().required(), // ID BorrowRecord yang akan diupdate
});