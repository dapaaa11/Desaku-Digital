# Desaku Digital

Desaku Digital adalah platform berbasis web dan mobile yang dirancang untuk meningkatkan kualitas pelayanan desa melalui digitalisasi layanan, penyebaran informasi, dan penguatan ekonomi lokal.

Aplikasi ini memungkinkan warga desa untuk dengan mudah mengakses informasi terbaru, mengajukan layanan administrasi secara online, serta memanfaatkan fitur katalog UMKM untuk mendukung produk lokal. Di sisi lain, perangkat desa dapat mengelola data, mempublikasikan informasi, dan memantau permintaan layanan secara efisien melalui sistem terpusat.

Dengan pendekatan yang sederhana, ramah pengguna, dan mobile-friendly, Desaku Digital bertujuan untuk menjembatani kebutuhan masyarakat desa dengan teknologi modern guna menciptakan desa yang lebih transparan, produktif, dan terhubung.

## 🚀 Fitur Utama

- **Autentikasi & Role**: Multi-role sistem (Admin & User/Warga) dengan JWT Token.
- **Berita Desa**: Media informasi publik untuk warga.
- **Profil & Galeri Desa**: Etalase digital dokumentasi kegiatan desa.
- **Katalog UMKM**: Platform promosi untuk produk-produk lokal desa.
- **Pengajuan Surat**: Digitalisasi layanan administrasi persuratan warga, lengkap dengan status tracking.
- **Dashboard Admin (CMS)**: Pusat kendali untuk manajemen user, konten, dan status surat.

## 💻 Tech Stack

- **Backend**: NestJS, Prisma, PostgreSQL
- **Frontend CMS**: Next.js (React), Tailwind CSS
- **Mobile App**: Flutter, Provider, Dio

## 📦 Struktur Folder

- `/backend` - REST API menggunakan NestJS.
- `/frontend` - CMS Admin menggunakan Next.js.
- `/mobile` - Aplikasi Warga menggunakan Flutter.
- `/docs` - Dokumentasi teknis, schema database, dan API.

## ⚙️ Cara Menjalankan Project

### Backend
1. Masuk ke folder `backend`
2. Run `npm install`
3. Sesuaikan `.env` (isi `DATABASE_URL` dan `PORT`)
4. Run `npx prisma generate` dan `npx prisma db push`
5. Run `npm run build` lalu `npm run start:prod` (untuk production)

### Frontend CMS
1. Masuk ke folder `frontend`
2. Run `npm install`
3. Buat file `.env` dan tambahkan `NEXT_PUBLIC_API_URL=http://localhost:3000` (sesuaikan dengan URL backend production)
4. Run `npm run build` lalu `npm start` (untuk production)

### Mobile App
1. Masuk ke folder `mobile`
2. Run `flutter pub get`
3. Untuk build APK: `flutter build apk --release --dart-define=API_URL=http://your-backend-url.com`
4. Hasil APK akan tersedia di `build/app/outputs/flutter-apk/app-release.apk`

## 📄 Versi
v1.0.0 - Rilis Perdana (Production Ready)
