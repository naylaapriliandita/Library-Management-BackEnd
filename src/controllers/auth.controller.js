import prisma from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateTokens } from '../utils/jwt.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';

// Fungsi Register Pengguna Baru 
export const register = async (req, res) => {
    try {
        // 1. Validasi Input
        const { error, value } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { name, email, password } = value;

        // 2. Cek apakah email sudah terdaftar
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'Email sudah terdaftar.' });
        }

        // 3. Hash Password & Simpan User
        const hashedPassword = await hashPassword(password);
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                // Role default adalah USER, ADMIN diatur manual di seed/db
            },
            select: { id: true, name: true, email: true, role: true },
        });

        res.status(201).json({ 
            message: 'Registrasi berhasil. Silakan login.', 
            user: newUser 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Fungsi Login Pengguna 
export const login = async (req, res) => {
    try {
        // 1. Validasi Input
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { email, password } = value;

        // 2. Cari User
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Email atau password salah.' });
        }

        // 3. Bandingkan Password
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email atau password salah.' });
        }

        // 4. Generate Tokens
        const { accessToken, refreshToken } = generateTokens(user);

        res.status(200).json({
            message: 'Login berhasil!',
            accessToken,
            refreshToken,
            user: { id: user.id, name: user.name, role: user.role }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};