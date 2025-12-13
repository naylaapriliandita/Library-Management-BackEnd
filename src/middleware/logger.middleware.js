export const logger = (req, res, next) => {
    const start = Date.now();
    
    // Log request details (timestamp, method, URL, IP)
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - IP: ${req.ip}`);

    // Listener untuk mencatat saat respons selesai
    res.on('finish', () => {
        const duration = Date.now() - start;
        // Log status code dan durasi
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - Duration: ${duration}ms`);
    });

    next();
};