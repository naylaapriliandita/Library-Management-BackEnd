import express from "express";
import {
    createBook,
    getBooks,
    getBookById,
} from "../controllers/book.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

// ADMIN
router.post("/", authenticate, authorize("ADMIN"), createBook);

// PUBLIC
router.get("/", getBooks);
router.get("/:id", getBookById);

export default router;