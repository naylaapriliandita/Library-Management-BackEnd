import express from "express";
import {
    createBook,
    getBooks,
    getBookById, 
    updateBook, 
    deleteBook,
} from "../controllers/book.controller.js";
import { authenticate, authorizeRole } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

// ADMIN
router.post("/", authenticate, authorize("ADMIN"), createBook);
// UPDATE book
router.put("/:id", authenticate, authorizeRole(["ADMIN"]), updateBook);
// DELETE book
router.delete("/:id", authenticate, authorizeRole(["ADMIN"]), deleteBook);

// PUBLIC
router.get("/", getBooks);
router.get("/:id", getBookById);

export default router;