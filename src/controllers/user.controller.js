import prisma from '../config/database.js';
import { updateRoleSchema } from '../validators/user.validator.js';

// Fungsi untuk mendapatkan semua pengguna 
export const getAllUsers = async (req, res) => {
    return res.status(501).json({ message: 'GET ALL USERS: Not Implemented Yet' });
};

// Fungsi untuk mengupdate role pengguna 
export const updateUserRole = async (req, res) => {
    return res.status(501).json({ message: 'UPDATE USER ROLE: Not Implemented Yet' });
};