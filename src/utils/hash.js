import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10; 

// Hash password menggunakan bcrypt
export const hashPassword = (password) => {
    return bcrypt.hash(password, SALT_ROUNDS);
};

// Membandingkan password plaintext dengan hash
export const comparePassword = (password, hash) => {
    return bcrypt.compare(password, hash);
};