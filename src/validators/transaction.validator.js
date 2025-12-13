import Joi from "joi";

// Validator untuk pinjam buku
export const borrowSchema = Joi.object({
    bookId: Joi.number().integer().required().messages({
        "any.required": "BookId wajib diisi",
        "number.base": "BookId harus berupa angka",
        "number.integer": "BookId harus berupa bilangan bulat",
    }),
});

// Validator untuk kembalikan buku (PUT)
export const returnSchema = Joi.object({
  // optional, karena id sudah di URL
});