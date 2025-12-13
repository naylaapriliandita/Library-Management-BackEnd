import prisma from "../config/prisma.js";
import { hashPassword } from "../utils/hash.js"; // <-- Tambahkan import ini

export const getUsers = async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
};

export const createUser = async (req, res, next) => { // <-- Tambahkan 'next' untuk error handling
    try {
        // Ambil role dari body, karena route ini sekarang hanya bisa diakses ADMIN
        const { email, name, password, role } = req.body; 

        // Hash password sebelum disimpan
        const hashed = await hashPassword(password); 

        const user = await prisma.user.create({
            data: { email, name, password: hashed, role },
        });

        // Status 201 Created
        res.status(201).json({ success: true, data: user });
    } catch (err) {
        next(err); // Lewatkan error ke global error handler
    }
};