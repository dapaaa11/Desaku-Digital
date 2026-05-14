# Desaku Digital

## Tech Stack
Backend: NestJS + Prisma
Frontend CMS: NextJS/React
Frontend End User: Flutter/React Native

## Arsitektur
Frontend CMS
↓
NestJS API
↓
PostgreSQL + Prisma

## Fitur Selesai
- JWT Authentication
- Role ADMIN / USER
- CRUD Berita
- Upload + Preview Gambar
- Dashboard Admin
- Kelola User
- Ubah Role User
- Hapus User
- Sidebar reusable
- Statistik realtime
- Search berita
- Toast notification
- Modal konfirmasi
- Loading state
- Pagination
- Grafik dashboard
- Backend Profil Desa
- Halaman Profil Desa CMS
- Validasi form Profil Desa
- Upload foto desa
- Optimasi UX halaman Profil Desa (Konsistensi UI, Loading State, Dynamic Button)
- Fitur Galeri Desa CMS (Multiple upload, CRUD, Preview gambar, Sidebar integration)
- Galeri CMS: Full CRUD termasuk update judul dan gambar via form (bukan modal Swal)
- Galeri CMS: Memory management URL.createObjectURL (revoke on change/unmount)
- Galeri CMS: Auth guard redirect jika tidak ada token
- Galeri CMS: Lazy loading gambar galeri
- Galeri CMS: Mode Edit dengan preview gambar saat ini + tombol Batal
- Fitur UMKM Desa CMS (Full CRUD, Upload Foto, Sidebar Integration, JWT Protected)
- Fitur Pengajuan Surat CMS (CRUD dengan fokus admin mengubah status)
- Dokumentasi API dan Database terpusat (API_DOCUMENTATION.md & DATABASE_SCHEMA.md)
- Inisialisasi Mobile App Flutter Warga (Provider, Dio, Base API)
- Mobile App: Fitur Pengajuan Surat (Riwayat, Form Input Validasi, Status Tracking)
- Mobile App: Fitur Autentikasi Warga (Login, Register, Logout, Auto-login JWT)
- Stabilisasi & Integrasi End-to-End (Bug fix status case, deprecations, analyzer clean)

## Progress Log
- [14 May 2026] Menyelesaikan pembuatan Halaman Profil Desa CMS, integrasi backend dengan FileInterceptor, validasi form, dan upload foto desa.
- [14 May 2026] Menyelesaikan optimasi UX Halaman Profil Desa, menambah loading state, dynamic button, dan konsistensi UI dengan dashboard.
- [14 May 2026] Menyelesaikan fitur Galeri Desa CMS dengan kapabilitas bulk upload, preview gambar, aksi CRUD (edit judul, hapus), dan penambahan menu di sidebar.
- [15 May 2026] Refinement Galeri CMS: Align UX edit dengan Dashboard (gunakan form utama bukan Swal input), tambah update gambar saat edit, proper URL.createObjectURL cleanup, auth guard redirect, lazy loading, indikator loading animasi, dan tombol Batal saat mode edit.
- [15 May 2026] Menyelesaikan fitur UMKM Desa CMS: Pembuatan model Prisma `Umkm`, NestJS REST API, full CRUD dengan AuthGuard JWT, upload dan edit foto UMKM, integrasi dengan menu Sidebar, dan konsistensi UX.
- [15 May 2026] Menyelesaikan fitur Pengajuan Surat CMS: Pembuatan model Prisma `Surat`, NestJS REST API, halaman frontend admin untuk memperbarui status (Diproses/Selesai/Ditolak), dan integrasi Sidebar. Field request utama diset read-only untuk admin menjaga integritas data.
- [15 May 2026] Melengkapi dokumentasi teknis project dengan membuat `docs/API_DOCUMENTATION.md` dan `docs/DATABASE_SCHEMA.md` untuk mempermudah pengembangan lanjutan.
- [15 May 2026] Setup kerangka awal aplikasi Mobile App Flutter menggunakan `Provider` (State Management) dan `Dio` (HTTP Client). Pembuatan kerangka halaman: Splash Screen, Home, Berita, Profil, Galeri, dan UMKM Desa yang telah diintegrasikan dengan Base API Backend (NestJS).
- [15 May 2026] Menyelesaikan fitur Pengajuan Surat di Mobile App: Menerapkan UI Riwayat Surat (Pull-to-refresh), Form Input (Validasi nama, NIK 16 digit, dropdown jenis surat), dan Detail Status Surat. Terintegrasi ke REST API backend menggunakan arsitektur Provider-Service.
- [15 May 2026] Menyelesaikan fitur Autentikasi (Auth) di Mobile App: Login, Register, integrasi SharedPreferences untuk auto-login, manajemen JWT token dinamis via Dio Interceptor, dan perbaikan alur navigasi dari Splash Screen.
- [15 May 2026] Finalisasi & Stabilisasi: Memperbaiki bug kritis inkonsistensi status surat (DIPROSES vs Diproses) di schema Prisma dan mobile app. Menerapkan perbandingan status case-insensitive di seluruh screen. Menampilkan nama pengguna di HomeScreen. Memperbaiki seluruh deprecation warning (withOpacity, value Dropdown). Dart analyze: No issues found.