Panduan Deployment ke AWS EC2
Dokumen ini merinci langkah-langkah implementasi REST API Library Management System ke lingkungan produksi menggunakan AWS EC2, Nginx, dan PM2.

1. Detail Infrastruktur
Proyek di-deploy pada server virtual AWS EC2.

Sistem Operasi: Ubuntu Server 22.04 LTS.

Instance Type: t2.micro.

IP Publik: 100.30.52.44.

Port Dibuka (Security Group): TCP 80 (HTTP) dan TCP 22 (SSH).

2. Proses Instalasi dan Setup (Command Line Berurutan)
Berikut adalah urutan command lengkap yang dieksekusi via SSH untuk menyiapkan lingkungan dan menjalankan aplikasi:

Persiapan OS: Jalankan update OS dan instal tools dasar: sudo apt update && sudo apt install git nano curl -y.

PM2 Global: Instal Process Manager secara global: npm install -g pm2.

Kloning Kode: Ambil kode dari repository: git clone https://github.com/naylaapriliandita/Library-Management-BackEnd.

Instalasi Dependensi: Masuk ke direktori dan instal dependency: cd Library-Management-BackEnd diikuti npm install.

Migrasi Database: Sinkronisasi skema database dengan Prisma ORM: npx prisma migrate deploy.

Seeding Data: Menjalankan seeding data awal (termasuk akun admin): npm run seed.

Build Aplikasi: Membuat build produksi aplikasi: npm run build.

3. Menjalankan Aplikasi dan Konfigurasi Nginx
Menjalankan Aplikasi dengan PM2
Aplikasi dijalankan di background menggunakan PM2, memastikan aplikasi tetap aktif meskipun server di-reboot.

Bash

# Menjalankan aplikasi Node.js di background
pm2 start npm --name "library-api" -- start
# Menyimpan konfigurasi PM2 agar otomatis restart
pm2 save
Konfigurasi Nginx Reverse Proxy
Nginx dikonfigurasi sebagai Reverse Proxy untuk mengarahkan traffic HTTP dari Port 80 ke aplikasi Node.js yang berjalan pada Port 3000.

Tujuan Nginx:

Menghilangkan kebutuhan port 3000 pada URL publik.

Meneruskan header IP asli klien ke aplikasi backend.

Snippet Konfigurasi Kunci (Nginx Server Block):

Nginx

location / {
    proxy_pass http://localhost:3000;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $host;
    proxy_http_version 1.1;
    proxy_set_header Connection 'upgrade';
}
4. Verifikasi Deployment
Verifikasi dilakukan untuk memastikan aplikasi berfungsi stabil dan dapat diakses.

Status Nginx: sudo systemctl status nginx harus menunjukkan status 'active (running)'.

Status PM2: pm2 status harus menunjukkan proses library-api dalam status 'online'.

Health Check: Mengakses endpoint http://100.30.52.44/health harus mengembalikan Status 200 OK dan response JSON mencantumkan "database": "OK".