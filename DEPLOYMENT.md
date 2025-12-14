Panduan Deployment ke AWS EC2
Proyek ini menggunakan Node.js, PM2, dan Nginx pada AWS EC2 Instance (Ubuntu 22.04 LTS).

1. Detail Infrastruktur
Sistem Operasi: Ubuntu Server 22.04 LTS.

Instance Type: t2.micro.

IP Publik: 100.30.52.44.

2. Proses Instalasi dan Setup (Command Line)
Berikut adalah urutan command yang dieksekusi via SSH:

Instalasi Tools: Jalankan sudo apt update dan instal tools dasar (git, nano, curl).

PM2: Instal PM2 secara global: npm install -g pm2.

Kloning Kode: Ambil kode dari repository (git clone ...).

Dependensi: npm install.

Database (Prisma): Jalankan migrasi dan seeding data: npx prisma migrate deploy diikuti npm run seed.

Build Aplikasi: npm run build.

3. Menjalankan Aplikasi dan Konfigurasi Nginx
Menjalankan Aplikasi dengan PM2
Aplikasi dijalankan di background dengan PM2, memastikan uptime tinggi.

Bash

pm2 start npm --name "library-api" -- start
pm2 save
Konfigurasi Nginx Reverse Proxy
Nginx dikonfigurasi pada Port 80 untuk meneruskan request ke aplikasi Node.js di Port 3000.

Tujuan Nginx:

Menghilangkan kebutuhan port 3000 pada URL publik.

Meneruskan header IP asli klien ke aplikasi backend.

4. Verifikasi Deployment
Status PM2: pm2 status harus menunjukkan library-api online.

Health Check: Endpoint http://100.30.52.44/health harus mengembalikan Status 200 OK dan "database": "OK".