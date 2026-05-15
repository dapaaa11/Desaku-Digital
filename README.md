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
3. Sesuaikan `.env`
4. Run `npx prisma generate` dan `npx prisma db push`
5. Run `npm run start:dev`

### Frontend CMS
1. Masuk ke folder `frontend`
2. Run `npm install`
3. Sesuaikan `.env.local`
4. Run `npm run dev`

### Mobile App
1. Masuk ke folder `mobile`
2. Run `flutter pub get`
3. Sesuaikan endpoint API di `lib/services/api_config.dart`
4. Run `flutter run` atau `flutter build apk --release`

## 📄 Versi
v1.0.0 - Rilis Perdana
