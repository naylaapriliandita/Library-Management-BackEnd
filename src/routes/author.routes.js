import express from "express";
import {
    createAuthor,
    getAuthors,
    getAuthorById,
    updateAuthor,
    deleteAuthor,
} from "../controllers/author.controller.js";

import { authenticate, authorizeRole } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { createAuthorSchema, updateAuthorSchema } from "../validators/author.validator.js";

const router = express.Router();

// ADMIN Only
router.post("/", authenticate, authorizeRole(["ADMIN"]), validateBody(createAuthorSchema), createAuthor);
router.put("/:id", authenticate, authorizeRole(["ADMIN"]), validateBody(updateAuthorSchema), updateAuthor);
router.delete("/:id", authenticate, authorizeRole(["ADMIN"]), deleteAuthor);

// PUBLIC
router.get("/", getAuthors);
router.get("/:id", getAuthorById);

export default router;