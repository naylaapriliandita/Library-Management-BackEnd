import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { getAllUsers, updateUserRole } from '../controllers/user.controller.js';

const router = Router();

// Semua endpoint di sini hanya untuk ADMIN
router.use(authenticate, authorize(['ADMIN']));

// [GET] /api/users - Mendapatkan semua user
router.get('/', getAllUsers);

// [PUT] /api/users/:id/role - Mengubah role user
router.put('/:id/role', updateUserRole);

export default router;