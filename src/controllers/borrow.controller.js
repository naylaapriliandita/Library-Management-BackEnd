import prisma from '../config/database.js'; 
import { borrowSchema } from '../validators/borrow.validator.js';

export const borrowBook = async (req, res) => {
    return res.status(501).json({ message: 'BORROW BOOK' });
};

export const returnBook = async (req, res) => {
    return res.status(501).json({ message: 'RETURN BOOK' });
};