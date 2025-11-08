Tentu, ini adalah draf README.md yang profesional dan terstruktur untuk proyek reservasi lapangan badminton Anda, yang disesuaikan dengan file-file yang telah Anda unggah.

---

# 🏸 Sistem Reservasi Lapangan Badminton (Frontend)

Ini adalah aplikasi _frontend_ yang dibangun dengan **Next.js (App Router)** untuk sistem pemesanan lapangan badminton. Aplikasi ini menyediakan alur pemesanan multi-langkah yang intuitif, manajemen pemesanan, dan integrasi pembayaran.

Proyek ini dirancang untuk terhubung dengan backend Go yang sesuai:
➡️ **Backend API Repo:** [https://github.com/SulthanRaghib/badminton-reservation-api](https://github.com/SulthanRaghib/badminton-reservation-api)

---

## ✨ Fitur Utama

### 1\. Alur Pemesanan Multi-Langkah

Aplikasi ini memandu pengguna melalui proses pemesanan 5 langkah yang terkelola:

- **Langkah 1: Pilih Tanggal (`components/date-step.tsx`)**

  - Menampilkan tanggal yang tersedia secara dinamis dari API (`getAvailableDates`).
  - Menggunakan _horizontal scroll_ dengan tombol navigasi untuk memilih tanggal.
  - Memberi penanda visual untuk hari _weekend_.

- **Langkah 2: Pilih Lapangan (`components/court-step.tsx`)**

  - Mengambil dan menampilkan daftar lapangan (`getAllCourts`) beserta harga per jam.
  - Status tombol berubah untuk menunjukkan lapangan yang dipilih.

- **Langkah 3: Pilih Sesi Waktu (`components/timeslot-step.tsx`)**

  - Mengambil slot waktu yang tersedia (`getTimeslots`) berdasarkan tanggal dan lapangan yang dipilih.
  - Slot yang sudah dipesan akan otomatis dinonaktifkan (ditampilkan sebagai "BOOKED").

- **Langkah 4: Isi Data Pelanggan (`components/customer-info-step.tsx`)**

  - Formulir untuk memasukkan nama, email, telepon, dan catatan opsional.
  - Validasi _real-time_ menggunakan **React Hook Form** dan **Zod** untuk memastikan data yang dimasukkan valid sebelum melanjutkan.

- **Langkah 5: Konfirmasi (`components/confirmation-step.tsx`)**

  - Menampilkan ringkasan lengkap pemesanan (tanggal, waktu, lapangan, harga, dan data pelanggan).
  - Tombol "Make Reservation" akan memanggil `createReservation` untuk finalisasi pemesanan.

### 2\. Pencarian & Detail Pemesanan

- **Cari Booking (`app/find-booking/page.tsx`)**
  - Halaman khusus bagi pengguna untuk mencari reservasi mereka menggunakan alamat email.
  - Menampilkan daftar semua pemesanan yang cocok dalam bentuk kartu (Card).
- **Detail Reservasi (`app/reservation/[id]/page.tsx`)**
  - Halaman dinamis yang menampilkan detail lengkap dari satu reservasi.
  - Menampilkan status pemesanan (e.g., Confirmed, Payment Required, Expired) menggunakan `Badge`/page.tsx\`].
  - Menyediakan tombol "Cetak" (`window.print()`).

### 3\. Integrasi Pembayaran

- Pada halaman Detail Reservasi, jika status pemesanan adalah `pending` atau `waiting_payment`, tombol "Pay Now" akan muncul/page.tsx\`].
- Menekan tombol ini akan memanggil `processPayment` dari API, yang mengembalikan URL pembayaran (misalnya, Midtrans) dan membukanya di tab baru/page.tsx\`].

### 4\. Logika Klien & API

- **Pengisian Data Cerdas (Smart Data Infill):**
  - Jika API reservasi utama tidak menyertakan data lengkap (seperti nama lapangan atau jam), halaman detail (`/reservation/[id]`) dan halaman pencarian (`/find-booking`) akan secara proaktif memanggil _endpoint_ lain (`getAllCourts`, `getTimeslots`) untuk melengkapi data yang hilang sebelum menampilkannya/page.tsx`, `sulthanraghib/badminton-reservation/badminton-reservation-35fbb714aeda9d56fb7638b20bc7d64f3d3ca621/app/find-booking/page.tsx\`].
- **API Fallback Lokal:**
  - Klien API (`lib/api.ts`) dirancang untuk pengembangan yang mudah. Ia akan mencoba terhubung ke `NEXT_PUBLIC_API_URL` terlebih dahulu. Jika gagal atau tidak disetel, ia akan **otomatis beralih (fallback)** mencoba terhubung ke `http://localhost:8088`.
- **Pemeriksaan Kesehatan API:**
  - _Footer_ aplikasi secara otomatis memanggil `checkApiHealth` saat dimuat untuk memberikan indikator visual status koneksi ke backend (API Connected / API Offline).
- **Data Cadangan (Mock Data):**
  - Jika panggilan API gagal (misalnya, backend sedang _down_), komponen akan menggunakan data _mock_ dari `lib/mock-data.ts` untuk memastikan UI tetap dapat ditampilkan dan diuji/page.tsx`, `sulthanraghib/badminton-reservation/badminton-reservation-35fbb714aeda9d56fb7638b20bc7d64f3d3ca621/components/date-step.tsx`, `sulthanraghib/badminton-reservation/badminton-reservation-35fbb714aeda9d56fb7638b20bc7d64f3d3ca621/components/court-step.tsx`, `sulthanraghib/badminton-reservation/badminton-reservation-35fbb714aeda9d56fb7638b20bc7d64f3d3ca621/components/timeslot-step.tsx\`].

---

## 💻 Teknologi yang Digunakan

- **Framework:** [Next.js](https://nextjs.org/) 16+ (App Router)
- **Bahasa:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Komponen UI:** [shadcn/ui](https://ui.shadcn.com/) (dibangun di atas [Radix UI](https://www.radix-ui.com/))
- **Formulir & Validasi:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Notifikasi (Toast):** [Sonner](https://www.google.com/search?q=https://sonner.emilkowal.ski/)
- **Ikon:** [Lucide React](https://lucide.dev/)
- **Utilitas Tanggal:** [date-fns](https://date-fns.org/)

---

## 🚀 Memulai

### Prasyarat

- [Node.js](https://nodejs.org/) (v18 atau lebih baru)
- [Go](https://go.dev/) (untuk menjalankan server backend)
- Manajer paket (npm, yarn, atau pnpm)

### Instalasi & Menjalankan

Proyek ini adalah _frontend_ murni dan **memerlukan backend** untuk berjalan.

1.  **Jalankan Backend Server (Wajib):**

    - Clone dan jalankan server backend terlebih dahulu.

      ```bash
      git clone https://github.com/SulthanRaghib/badminton-reservation-api.git

      cd badminton-reservation-api

      go run main.go
      ```

    - Server backend sekarang berjalan di `http://localhost:8088`.

2.  **Jalankan Frontend (Proyek Ini):**

    - Di terminal terpisah, clone repositori _frontend_ ini:

      ```bash
      git clone https://github.com/sulthanraghib/badminton-reservation.git

      cd badminton-reservation
      ```

    - Instal dependensi:
      ```bash
      npm install
      ```
    - Jalankan server development:
      ```bash
      npm run dev
      ```

3.  **Buka Aplikasi:**

    - Buka [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) di browser Anda.
    - Aplikasi frontend akan secara otomatis terhubung ke backend di `http://localhost:8088` berkat logika _fallback_.

---

## 📁 Struktur Proyek

```
badminton-reservation/
├── app/
│   ├── find-booking/
│   │   └── page.tsx        # Halaman "Cari Booking"
│   ├── reservation/[id]/
│   │   └── page.tsx        # Halaman detail & pembayaran/page.tsx]
│   ├── layout.tsx          # Root layout, memuat font dan Toaster
│   └── page.tsx            # Halaman utama (alur pemesanan)
│
├── components/
│   ├── ui/                 # Komponen shadcn/ui (Button, Card, Input, dll.)
│   ├── confirmation-step.tsx # Langkah 5: Ringkasan & Konfirmasi
│   ├── court-step.tsx      # Langkah 2: Pilih Lapangan
│   ├── customer-info-step.tsx # Langkah 4: Info Pelanggan
│   ├── date-step.tsx       # Langkah 1: Pilih Tanggal
│   ├── footer.tsx          # Footer dengan status API
│   ├── navbar.tsx          # Navigasi utama
│   └── timeslot-step.tsx   # Langkah 3: Pilih Sesi Waktu
│
├── hooks/
│   └── use-toast.ts        # Hook wrapper untuk notifikasi Sonner
│
├── lib/
│   ├── api.ts              # Logika inti fetch API, termasuk fallback
│   ├── mock-data.ts        # Data cadangan jika API gagal
│   └── utils.ts            # Utilitas `cn` (classnames)
│
└── package.json            # Dependensi proyek
```

---

## 📸 Contoh Alur Penggunaan

1.  **Mulai Memesan:** Pengguna membuka `localhost:3000`. `DateStep` dimuat dan mengambil tanggal dari API.
2.  **Pilih Detail:** Pengguna memilih tanggal, lalu `CourtStep` muncul. Pengguna memilih lapangan, lalu `TimeslotStep` muncul.
3.  **Isi Data:** Setelah memilih waktu, `CustomerInfoStep` muncul. Pengguna mengisi nama, email, dan telepon.
4.  **Konfirmasi:** `ConfirmationStep` menampilkan ringkasan. Pengguna mengklik "Make Reservation".
5.  **Redirect:** Panggilan `createReservation` berhasil, _toast_ sukses muncul, dan pengguna diarahkan ke `/reservation/[id]` (misalnya, `/reservation/RES-123`).
6.  **Bayar:** Di halaman detail, pengguna melihat status "Waiting for Payment" dan mengklik "Pay Now"/page.tsx\`]. Tab baru ke gerbang pembayaran terbuka.
7.  **Cari Booking:** Pengguna lain (atau pengguna yang sama) pergi ke `/find-booking`, memasukkan email mereka, dan melihat daftar reservasi yang baru saja dibuat.
