import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import bookRoutes from "./routes/book.routes.js";
import authorRoutes from "./routes/author.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
// Import prisma untuk health check
import prisma from "./config/prisma.js"; 
// Import middlewares baru
import { logger } from "./middleware/logger.middleware.js";
import { errorMiddleware } from "./middleware/error.middleware.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. LOGGER MIDDLEWARE 
app.use(logger);

// HEALTH CHECK ENDPOINT 
app.get("/health", async (req, res) => {
    const uptime = process.uptime();
    // Test koneksi database
    const dbStatus = await prisma.$queryRaw`SELECT 1;`
        .then(() => "OK")
        .catch(() => "DOWN");

    res.json({
        success: true,
        message: "Server berjalan normal",
        data: {
            status: "OK",
            environment: process.env.NODE_ENV || "development",
            database: dbStatus,
            uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`,
            timestamp: new Date().toISOString(),
        }
    });
});

// ROUTE DEFINITIONS
app.use("/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/books", bookRoutes);
app.use("/authors", authorRoutes);
app.use("/transactions", transactionRoutes);

// GLOBAL ERROR HANDLER (Harus diletakkan paling akhir)
app.use(errorMiddleware);

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running at http://localhost:${process.env.PORT || 3000}`);
});