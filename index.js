import 'dotenv/config'; 
import express from 'express';
import authRoutes from './src/routes/auth.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware wajib
app.use(express.json()); // Mengizinkan Express membaca body JSON

// Routing 
// Endpoint Auth (Register & Login)
app.use('/api/auth', authRoutes);

// Endpoint utama (Contoh)
app.get('/', (req, res) => {
    res.status(200).json({ 
        message: 'Welcome to Library System REST API!',
        docs: 'Akses /api-docs untuk dokumentasi.'
    });
});

// Jalankan Server 
app.listen(PORT, () => {
    console.log('Server berjalan di http://localhost:${PORT}');
    console.log('Environment: ${process.env.NODE_ENV}');
});