import prisma from '../config/database.js';
import { updateRoleSchema } from '../validators/user.validator.js';

// Dapatkan Semua Pengguna (Read All) 
export const getAllUsers = async (req, res) => {
    try {
        // Hanya Admin yang bisa akses ini 
        const users = await prisma.user.findMany({
            // Wajib: Jangan sertakan password dalam hasil
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            }
        });
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal mengambil data pengguna.' });
    }
};

// Update Role Pengguna (Update) 
export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params; 
        const userId = parseInt(id);

        // 1. Validasi Input Role
        const { error, value } = updateRoleSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { role } = value;

        // 2. Cek apakah user yang di-update ada
        const existingUser = await prisma.user.findUnique({ where: { id: userId } });
        if (!existingUser) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
        }

        // 3. Cek: Admin tidak boleh mengubah role-nya sendiri
        // ID pengguna yang melakukan request (dari token)
        if (req.user.id === userId) {
             return res.status(403).json({ message: 'Anda tidak diizinkan mengubah role akun Anda sendiri.' });
        }

        // 4. Update Role
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role: role },
            select: { id: true, name: true, email: true, role: true }
        });

        res.status(200).json({ 
            message: `Role pengguna ${updatedUser.name} berhasil diubah menjadi ${updatedUser.role}.`, 
            user: updatedUser 
        });

    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
        }
        console.error(error);
        res.status(500).json({ message: 'Gagal memperbarui role pengguna.' });
    }
};