

# Shuttle / Rental Mobil Management System

Sistem manajemen shuttle dengan 3 role: Customer (mobile PWA), Driver (mobile PWA), dan Admin (web dashboard). Tahap awal menggunakan data dummy.

## Design System
- **Warna utama**: Biru (#2563EB) dan Hijau (#10B981) — transport theme
- **Layout**: Card-based, modern, clean
- **Font**: Inter (sudah ada di project)

## Halaman & Fitur

### 1. Landing Page / Role Selector
- Pilih role: Customer, Driver, atau Admin
- Navigasi ke login masing-masing

### 2. Customer (Mobile-First PWA)
- **Login/Register** — form sederhana dengan dummy auth
- **Home** — pilih rute (Rayon A/B/C/D), lihat jadwal tersedia
- **Pilih Rute** — daftar rute dengan titik penjemputan (J1, J2, J3)
- **Pilih Jadwal** — list jam keberangkatan, sisa kursi ditampilkan
- **Seat Selection** — visual grid kursi (hijau=kosong, merah=terisi), pilih kursi
- **Konfirmasi Booking** — ringkasan: rute, jadwal, kursi, harga (berdasarkan jarak)
- **Booking Berhasil** — notifikasi toast + detail tiket
- **Riwayat Perjalanan** — list booking sebelumnya dengan status
- **Detail Perjalanan** — info lengkap per booking

### 3. Driver (Mobile-First PWA)
- **Login Driver** — form login
- **Dashboard** — daftar perjalanan hari ini
- **Detail Perjalanan** — daftar penumpang, status kursi (kosong/terisi)
- **Update Status** — tombol mulai & selesai perjalanan

### 4. Admin (Web Dashboard dengan Sidebar)
- **Login Admin**
- **Dashboard Overview** — statistik booking, perjalanan aktif
- **CRUD Rute** — kelola Rayon A, B, C, D
- **CRUD Titik Penjemputan** — kelola J1, J2, dst per rute
- **CRUD Jadwal** — kelola jam keberangkatan
- **CRUD Driver** — kelola data driver
- **CRUD Kendaraan** — kelola data kendaraan + kapasitas kursi
- **Assign Driver** — assign driver ke rute/jadwal
- **Monitoring Booking** — tabel semua booking real-time
- **Laporan Perjalanan** — ringkasan & filter per tanggal

### 5. Data Dummy
- 4 Rayon (A-D) dengan rute masing-masing
- Titik penjemputan per rute (J1-J5)
- Jadwal keberangkatan (pagi, siang, sore)
- Kendaraan dengan 8-12 kursi
- Beberapa booking contoh
- Harga berdasarkan jarak (Rp/meter)

### 6. State Management
- React Context untuk auth state dan data management
- Shared types untuk konsistensi data antar role

### 7. Navigasi
- Customer & Driver: bottom navigation bar (mobile style)
- Admin: sidebar navigation (desktop)
- Routing terpisah per role: `/customer/*`, `/driver/*`, `/admin/*`

