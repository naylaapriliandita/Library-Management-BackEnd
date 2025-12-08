import { verifyAccessToken } from '../utils/jwt.js';

// 1. Middleware untuk Autentikasi (Memverifikasi JWT)
export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan atau format salah.' });
    }

    const token = authHeader.split(' ')[1]; // Ambil token dari 'Bearer <token>'

    try {
        // Verifikasi token dan simpan data user ke req.user
        const decoded = verifyAccessToken(token);
        req.user = decoded; // { id: 1, role: 'ADMIN' }
        next();
    } catch (error) {
        // Token tidak valid atau kedaluwarsa
        return res.status(403).json({ message: 'Token tidak valid atau kedaluwarsa.' });
    }
};

// 2. Closure Middleware untuk Otorisasi (Memeriksa Role)
export const authorize = (requiredRoles) => (req, res, next) => {
    // Pastikan authenticate() sudah berjalan dan req.user tersedia
    if (!req.user || !requiredRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Akses tidak diizinkan untuk role ini.' });
    }
    next();
};