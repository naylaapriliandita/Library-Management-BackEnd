import express from "express";
import { register, login, getMe, refresh } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
// Import middleware dan skema validasi
import { validateBody } from "../middleware/validate.middleware.js"; 
import { registerSchema, loginSchema, refreshSchema } from "../validators/auth.validator.js";

const router = express.Router();

// Register 
router.post("/register", validateBody(registerSchema), register);
// Login 
router.post("/login", validateBody(loginSchema), login);
// Get Profile
router.get("/me", authenticate, getMe);

// Refresh Token 
router.post("/refresh", validateBody(refreshSchema), refresh);

export default router;