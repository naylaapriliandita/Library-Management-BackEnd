import jwt from 'jsonwebtoken';

// Mengambil variabel dari .env
const ACCESS_SECRET = process.env.JWT_SECRET;
const ACCESS_EXPIRES = process.env.JWT_EXPIRES_IN;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN;

// Membuat Access Token dan Refresh Token
export const generateTokens = (user) => {
    // Payload berisi ID dan Role
    const payload = {
        id: user.id,
        role: user.role
    };

    const accessToken = jwt.sign(payload, ACCESS_SECRET, {
        expiresIn: ACCESS_EXPIRES,
    });

    const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
        expiresIn: REFRESH_EXPIRES,
    });

    return { accessToken, refreshToken };
};

// Memverifikasi Access Token
export const verifyAccessToken = (token) => {
    return jwt.verify(token, ACCESS_SECRET);
};