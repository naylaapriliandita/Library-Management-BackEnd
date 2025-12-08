import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';

const router = Router();

// Endpoint untuk Registrasi User Baru
router.post('/register', register);

// Endpoint untuk Login dan Mendapatkan Token
router.post('/login', login);

export default router;