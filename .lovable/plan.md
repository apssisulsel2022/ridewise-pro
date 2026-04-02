

# Fitur Advanced — ShuttleKu Management System

Karena ini masih tahap UI mockup (tanpa backend/Supabase), semua fitur akan diimplementasikan sebagai UI dengan data dummy dan simulasi. Payment gateway dan Firebase notification akan disiapkan sebagai UI/settings page, siap diintegrasikan saat backend ditambahkan.

## 1. GPS Tracking Driver (Leaflet Map)

**File baru:** `src/pages/driver/DriverTracking.tsx`, `src/pages/admin/AdminTracking.tsx`

- Install `leaflet` + `react-leaflet` + `@types/leaflet`
- **Driver side**: Peta Leaflet menampilkan rute aktif dengan marker posisi driver (simulasi bergerak antar titik penjemputan). Tombol "Mulai Tracking" / "Berhenti"
- **Admin side**: Halaman monitoring peta dengan semua driver aktif ditampilkan sebagai marker. Klik marker untuk lihat info driver + rute
- **Customer side**: Di `CustomerBookingDetail`, tambah peta kecil menunjukkan posisi driver (simulasi)
- Tambah data dummy koordinat lat/lng ke setiap `RoutePoint`
- Update `AdminLayout` sidebar: tambah menu "Tracking"

## 2. Payment Gateway UI (Settings-based)

**File baru:** `src/pages/admin/AdminPaymentSettings.tsx`, `src/components/PaymentModal.tsx`

- **Admin Settings page**: Form konfigurasi payment gateway — pilih provider (Midtrans/Xendit), input Server Key, Client Key, environment (Sandbox/Production). Data disimpan di context
- **Customer booking flow**: Setelah pilih kursi, muncul modal pembayaran dengan pilihan metode (Transfer Bank, E-Wallet, QRIS). Tampilkan simulasi halaman pembayaran dengan countdown timer
- Tambah field `paymentStatus` dan `paymentMethod` ke type `Booking`
- Status pembayaran: pending → paid → expired/failed
- Update `AdminLayout` sidebar: tambah menu "Payment Settings"

## 3. Notifikasi (UI Notification Center)

**File baru:** `src/components/NotificationCenter.tsx`, `src/contexts/NotificationContext.tsx`

- Context untuk menyimpan notifikasi in-app (bell icon dengan badge counter)
- Auto-generate notifikasi saat: booking berhasil, pembayaran dikonfirmasi, perjalanan dimulai, perjalanan selesai
- Notification dropdown di header semua layout (Customer, Driver, Admin)
- Setiap notifikasi: icon, judul, pesan, timestamp, read/unread
- Catatan: Firebase push notification memerlukan backend — saat ini simulasi in-app saja

## 4. Dashboard Analytics (Recharts)

**File baru:** `src/pages/admin/AdminAnalytics.tsx`

- Install `recharts`
- Upgrade `AdminReports` atau buat halaman baru `AdminAnalytics`:
  - **Bar chart**: Pendapatan per rute
  - **Line chart**: Trend booking harian (data dummy 7 hari)
  - **Pie chart**: Distribusi booking per rayon (A/B/C/D)
  - **Area chart**: Occupancy rate per jadwal
- KPI cards: Total revenue, avg occupancy %, booking growth, top route
- Filter: rentang tanggal, rayon
- Update sidebar: tambah menu "Analytics"

## 5. E-Ticket / QR Code

**File baru:** `src/components/ETicket.tsx`

- Install `qrcode.react`
- **E-Ticket component**: Card bergaya tiket pesawat dengan:
  - Header: logo + nama perusahaan
  - Info: rute, tanggal, waktu, kursi, titik jemput, harga
  - QR Code berisi data booking (JSON encoded: bookingId, scheduleId, seatNumber)
  - Barcode-style ID di bawah
- Ditampilkan di `CustomerBookingDetail` dan `CustomerTickets`
- Tombol "Download Tiket" (generate as image via html2canvas atau print-friendly CSS)
- **Driver side**: Di `DriverTripDetail`, tambah tombol "Scan QR" (simulasi — buka modal, input booking ID manual, validasi terhadap data booking)

## Technical Details

**Dependencies baru:**
- `leaflet`, `react-leaflet`, `@types/leaflet` — peta GPS
- `recharts` — chart analytics
- `qrcode.react` — QR code generation

**Type updates (`shuttle.ts`):**
- `RoutePoint`: tambah `lat`, `lng`
- `Booking`: tambah `paymentStatus`, `paymentMethod`, `qrCode`
- Baru: `Notification`, `PaymentConfig` interfaces

**Context updates:**
- `ShuttleContext`: tambah payment config state
- Baru: `NotificationContext` untuk notifikasi in-app

**Route updates (`App.tsx`):**
- `/admin/analytics` — Dashboard Analytics
- `/admin/tracking` — GPS Monitoring
- `/admin/payment-settings` — Payment Settings
- `/driver/tracking` — Driver GPS view

**Estimated file changes:** ~12 file baru, ~8 file edit

