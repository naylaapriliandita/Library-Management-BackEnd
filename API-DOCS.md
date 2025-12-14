Dokumentasi REST API
Semua endpoint diakses melalui Base URL: http://100.30.52.44.

1. Otentikasi dan Akses
POST /auth/login: Digunakan untuk mendapatkan Access Token dan Refresh Token (Akses Publik).

POST /auth/register: Digunakan untuk mendaftarkan akun pengguna baru (Akses Publik).

POST /auth/refresh: Digunakan untuk mendapatkan Access Token baru menggunakan Refresh Token (Akses User/Admin).

2. Manajemen User dan Data Master (Akses Admin)
Admin memiliki akses CRUD penuh untuk mengelola data sistem.

User: GET, PUT, DELETE pada endpoint /users/:id.

Buku (Books): POST, PUT, DELETE pada endpoint /books.

Penulis (Authors): POST pada endpoint /authors.

Melihat Semua Buku: Endpoint /books dapat diakses dengan metode GET oleh Publik.

3. Transaksi (Akses User/Admin)
Peminjaman: POST /transactions (mencatat transaksi peminjaman buku).

Pengembalian: POST /transactions/return (mencatat transaksi pengembalian buku).

Skema Otorisasi (RBAC)
Admin: Memiliki kontrol penuh atas data master dan manajemen pengguna.

User: Terbatas pada transaksi dan data publik. Upaya akses ke endpoint Admin menghasilkan 403 Forbidden.