import Joi from 'joi';

// Skema untuk membuat atau mengupdate Buku
export const bookSchema = Joi.object({
  title: Joi.string().trim().required(),
  isbn: Joi.string().trim().length(13).required(), // ISBN 13 digit
  stock: Joi.number().integer().min(0).required(),
  authorName: Joi.string().trim().required(), // Nama penulis, bukan ID
});