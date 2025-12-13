import { Router } from "express";
import { getUsers, createUser } from "../controllers/user.controller.js";
import { authenticate, authorizeRole } from "../middleware/auth.middleware.js";
import { createUserSchema } from "../validators/user.validator.js";
import { validateBody } from "../middleware/validate.middleware.js"; 

const router = Router();

// GET all users - ADMIN Only
router.get(
    "/",
    authenticate,
    authorizeRole(["ADMIN"]),
    getUsers
);

// POST create user - ADMIN Only
router.post(
    "/", 
    authenticate, 
    authorizeRole(["ADMIN"]), 
    validateBody(createUserSchema), 
    createUser
);

export default router;
