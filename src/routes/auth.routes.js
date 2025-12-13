import express from "express";
import { register, login, getMe } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// Register
router.post("/register", register);
// Login
router.post("/login", login);
// Get Profile
router.get("/me", authenticate, getMe);

export default router;