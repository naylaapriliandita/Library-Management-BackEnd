import prisma from "../config/prisma.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";

export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email sudah terdaftar",
            });
        }

        const hashed = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashed,
                role: "USER",
            },
        });

        res.status(201).json({
            success: true,
            message: "Registrasi berhasil",
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Email atau password salah",
            });
        }

        const isValid = await comparePassword(password, user.password);
        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: "Email atau password salah",
            });
        }

        const payload = { userId: user.id, role: user.role };

        res.json({
            success: true,
            message: "Login berhasil",
            data: {
                accessToken: generateAccessToken(payload),
                refreshToken: generateRefreshToken(payload),
            },
        });
    } catch (err) {
        next(err);
    }
};

export const getMe = async (req, res) => {
    res.json({
        success: true,
        data: req.user,
    });
};

// Fungsi baru untuk memperbarui token (POST /api/auth/refresh)
export const refresh = async (req, res, next) => {
    try {
        // Ambil refreshToken dari body
        const { refreshToken } = req.body;
        
        let decoded;
        try {
            // Verifikasi Refresh Token (akan gagal jika expired atau tidak valid)
            decoded = verifyRefreshToken(refreshToken);
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Refresh Token tidak valid atau sudah kadaluarsa",
            });
        }

        // Cek user di database untuk memastikan user masih ada
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Pengguna tidak ditemukan",
            });
        }

        // Buat payload baru
        const payload = { userId: user.id, role: user.role };
        
        // Kirimkan Access Token dan Refresh Token baru (Token Rotation)
        res.json({
            success: true,
            message: "Token berhasil diperbarui",
            data: {
                accessToken: generateAccessToken(payload),
                refreshToken: generateRefreshToken(payload), 
            },
        });
    } catch (err) {
        next(err);
    }
};