import { verifyAccessToken } from "../utils/jwt.js";

export const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Token tidak ditemukan",
            });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Format token salah",
            });
        }

        const decoded = verifyAccessToken(token);
        req.user = decoded;

        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Token tidak valid",
        });
    }
};
