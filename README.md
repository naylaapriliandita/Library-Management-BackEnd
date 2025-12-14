REST API Library Management System
API ini dikembangkan untuk mengelola data master (Buku, Penulis) dan transaksi peminjaman/pengembalian dalam sistem perpustakaan. Proyek ini di-deploy sebagai layanan Production-Ready pada AWS EC2.

Tujuan Proyek
Proyek ini bertujuan untuk membangun backend yang stabil, aman, dan efisien, mampu menangani operasi dasar CRUD (Create, Read, Update, Delete) serta fitur otentikasi dan otorisasi.

Fitur Kunci
Manajemen Data Master: Admin memiliki akses CRUD penuh atas Buku dan Penulis.

Otentikasi & Otorisasi: Menggunakan JSON Web Tokens (JWT) dan Role-Based Access Control (RBAC).

Transaksi: Pengelolaan peminjaman dan pengembalian buku.

Stack Teknologi
Backend: Node.js dan Express.js.

Database Layer: Prisma ORM (mendukung SQLite/PostgreSQL).

Deployment: AWS EC2, Nginx, dan PM2.

Informasi Akses
Repository GitHub: https://github.com/naylaapriliandita/Library-Management-BackEnd.

Base URL (Produksi): http://100.30.52.44.

Health Check URL: http://100.30.52.44/health.

Test Credentials
Admin: Email: admin@mail.com / Password: admin123.

User: Email: user1@mail.com / Password: user123.