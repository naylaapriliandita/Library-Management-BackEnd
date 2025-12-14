import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { borrowBook, returnBook, getTransactions } from "../controllers/transaction.controller.js";
import { borrowSchema } from "../validators/transaction.validator.js";
import { validateBody } from "../middleware/validate.middleware.js";

const router = express.Router();

// Semua route harus login dulu
router.use(authenticate);

// Pinjam buku
router.post("/", borrowBook);

// Kembalikan buku
router.put("/:id/return", returnBook);

// Lihat transaksi user sendiri
router.get("/", getTransactions);

export default router;