# API Documentation

Dokumentasi REST API backend **Desaku Digital** (berjalan di `http://localhost:3000`). Sebagian besar endpoint memerlukan Autentikasi JWT dan Role Access Control.

## Global Headers
Endpoint yang dilindungi membutuhkan header berikut:
```http
Authorization: Bearer <JWT_TOKEN>
```

---

## 1. Authentication (`/auth`)

### Login
- **URL**: `/auth/login`
- **Method**: `POST`
- **Body**: (JSON)
  ```json
  {
    "email": "admin@desa.com",
    "password": "password123"
  }
  ```
- **Response** (201):
  ```json
  {
    "access_token": "eyJhbGci...",
    "name": "Admin Desa",
    "role": "ADMIN"
  }
  ```

---

## 2. Manajemen Pengguna (`/users`)
*Hanya dapat diakses oleh role ADMIN.*

### Get All Users
- **URL**: `/users`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <TOKEN>`

### Ubah Role User / Update User
- **URL**: `/users/:id`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer <TOKEN>`
- **Body**: (JSON) `{"role": "ADMIN"}`

### Hapus User
- **URL**: `/users/:id`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer <TOKEN>`

---

## 3. Berita Desa (`/news`)

### Get All News
- **URL**: `/news`
- **Method**: `GET`

### Create News
- **URL**: `/news`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <TOKEN>`
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `title` (string)
  - `content` (string)
  - `image` (file)

### Update & Delete News
- **PUT** `/news/:id` (Requires Admin, form-data optional image)
- **DELETE** `/news/:id` (Requires Admin)

---

## 4. Profil Desa (`/village-profile`)

### Get Village Profile
- **URL**: `/village-profile`
- **Method**: `GET`

### Create / Update Profile
- **URL**: `/village-profile` / `/village-profile/:id`
- **Method**: `POST` / `PUT`
- **Headers**: `Authorization: Bearer <TOKEN>`
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `name`, `about`, `vision`, `mission`, `address` (string)
  - `image` (file)

---

## 5. Galeri Desa (`/gallery`)

### Get All Photos
- **URL**: `/gallery`
- **Method**: `GET`

### Upload Photo
- **URL**: `/gallery`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <TOKEN>`
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `title` (string, optional)
  - `image` (file)

### Update / Delete Photo
- **PUT** `/gallery/:id` (Requires Admin, form-data title & image)
- **DELETE** `/gallery/:id` (Requires Admin)

---

## 6. UMKM Desa (`/umkm`)

### Get All UMKM
- **URL**: `/umkm`
- **Method**: `GET`

### Create UMKM
- **URL**: `/umkm`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <TOKEN>`
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `name` (string)
  - `description` (string)
  - `whatsapp` (string)
  - `address` (string)
  - `image` (file)

### Update / Delete UMKM
- **PUT** `/umkm/:id` (Requires Admin, form-data)
- **DELETE** `/umkm/:id` (Requires Admin)

---

## 7. Pengajuan Surat (`/surat`)

### Create Request
- **URL**: `/surat`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <TOKEN>` (Dapat diakses user biasa)
- **Content-Type**: `application/json`
- **Body**:
  ```json
  {
    "nama": "Budi Santoso",
    "nik": "350123456789",
    "jenis": "Surat Domisili",
    "keperluan": "Melamar pekerjaan"
  }
  ```

### Update Status (Admin Only)
- **URL**: `/surat/:id`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer <TOKEN>`
- **Body**:
  ```json
  {
    "status": "Selesai" // Diproses | Selesai | Ditolak
  }
  ```

### Get All / Delete Request (Admin Focus)
- **GET** `/surat`
- **DELETE** `/surat/:id` (Requires Admin)
