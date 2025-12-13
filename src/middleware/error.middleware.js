import { Prisma } from "@prisma/client";

export const errorMiddleware = (err, req, res, next) => {
    // Log error secara internal untuk debugging
    console.error(`[ERROR] ${new Date().toISOString()}:`, err.message);
    // console.error(err.stack); // Uncomment ini saat development

    let statusCode = 500;
    let message = "Terjadi kesalahan pada server.";
    let errors = [];

    // --- Penanganan Error Prisma ---

    // P2002: Unique constraint failed (Data duplikat)
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        statusCode = 409; // Conflict
        const target = err.meta.target ? err.meta.target.join(', ') : 'field';
        message = `Data duplikat: Field '${target}' sudah digunakan.`;
    } 
    // P2025: Record not found (Resource tidak ditemukan untuk operasi update/delete)
    else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        statusCode = 404; // Not Found
        message = err.meta.cause || "Resource tidak ditemukan.";
    } 
    // P2003: Foreign key constraint failed
    else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2003') {
        statusCode = 400; // Bad Request
        message = "Gagal memproses data karena melanggar relasi (Foreign Key Constraint).";
    }

    // Penanganan Error Umum 
    // Jika error memiliki status code yang sudah ditentukan (misalnya dari middleware/controller)
    if (err.statusCode) {
        statusCode = err.statusCode;
        message = err.message;
    }
    
    // KRITIS: Di Production, jangan ekspos pesan error sensitif 500
    if (process.env.NODE_ENV === 'production' && statusCode === 500) {
        message = "Terjadi kesalahan internal server.";
    }

    res.status(statusCode).json({
        success: false,
        message: message,
        errors: errors.length > 0 ? errors : undefined,
    });
};