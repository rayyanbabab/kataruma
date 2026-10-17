# 🇮🇩 Kataruma RW 10 — Platform Dokumentasi & Portal Informasi Warga

[![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.1.12-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Integrated-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-amber?style=for-the-badge)](LICENSE)

> *"Bersama Berkarya, Bersatu Membangun Lingkungan"*

**Kataruma RW 10** adalah portal web modern dan platform dokumentasi digital resmi untuk kegiatan kepemudaan dan kemasyarakatan **Karang Taruna RW 10** (Kelurahan Kalibata, Kecamatan Pancoran, Jakarta Selatan). 

Aplikasi ini dirancang sebagai pusat arsip digital yang interaktif dan transparan—mulai dari dokumentasi perayaan HUT Kemerdekaan RI, pentas seni, kerja bakti, agenda kegiatan warga, laporan pertanggungjawaban (LPJ) keuangan, daftar donatur, hingga wadah aspirasi dan komentar warga sekitar.

---

## ✨ Fitur-Fitur Utama

### 🌐 Sisi Publik (Warga & Pengunjung)
- **🎯 Hero Section & Countdown Dinamis**: Sambutan beranda interaktif dengan hitung mundur waktu nyata (*real-time countdown*) ke agenda besar warga terdekat (seperti HUT RI atau acara RW berikutnya).
- **📖 Tentang Kami (Profile & Value)**: Profil Karang Taruna RW 10, visi, misi, serta pilar nilai kebersamaan dan aksi kepemudaan di lingkungan.
- **📁 Dokumentasi & Album Kegiatan**: Katalog album kegiatan terorganisir per momentum acara. Setiap album memiliki halaman detail lengkap (`/album/:id`) disertai tautan arsip resolusi penuh (misal Google Drive).
- **📸 Galeri Foto Masonry & Lightbox**: Galeri foto responsif dengan filter tag kategori dan penampil gambar pop-up (*lightbox preview*) yang halus.
- **🎥 Galeri Video Multi-Sumber**: Mendukung embed video dari YouTube, Instagram Reels, TikTok, Google Drive, hingga video MP4 lokal/direct link.
- **📅 Kalender & Agenda Interaktif**: Kalender agenda kegiatan RW yang terintegrasi secara otomatis dengan hari libur nasional dan penanggalan Islam (Hijriah).
- **📊 Transparansi Laporan Keuangan & LPJ**: Keterbukaan informasi publik berupa berkas laporan pertanggungjawaban per tahun dengan pratinjau dan unduhan langsung (format PDF, Excel/XLSX, Word/DOCX).
- **🤝 Apresiasi Donatur**: Daftar apresiasi para warga dan donatur dermawan yang telah berpartisipasi dan berkontribusi mendukung kesuksesan kegiatan lingkungan.
- **💬 Pojok Aspirasi & Komentar Warga**: Formulir interaktif untuk warga menyampaikan pesan kesan, apresiasi, doa, dan masukan secara langsung.
- **📢 Poster & Pop-up Pengumuman**: Bagian poster kegiatan dan fitur pop-up banner otomatis saat pertama kali situs diakses untuk menyiarkan informasi mendesak.
- **🔍 Quick Search Overlay**: Modal pencarian instan (shortcut search) di navbar untuk mencari album, foto, video, agenda, maupun laporan dalam hitungan detik.
- **📱 Desain Modern & Responsif**: Tampilan mobile-friendly, palet warna elegan *Maritime Navy & Crimson Merah Putih*, tipografi *Plus Jakarta Sans* & *Inter*, serta animasi transisi yang mulus.

---

### 🛡️ Sisi Admin (Dashboard CMS Terpadu - `/adminrt02`)
- **🔐 Autentikasi Admin Terproteksi**: Sistem login admin aman dengan proteksi route dan sesi terenkripsi.
- **📈 Dashboard Analytics**: Ringkasan statistik cepat (total pengunjung, jumlah album aktif, arsip foto, video, dan grafik interaktif menggunakan Recharts).
- **🗂️ Manajemen Album (CRUD)**: Tambah, sunting, arsipkan, kelola cover, ubah status *Publish/Draft*, dan integrasikan link arsip Google Drive.
- **🖼️ Manajemen Foto & Video**: Unggah foto (dengan fitur auto-kompresi gambar), atur judul, tagar, album penampung, serta durasi & sumber tautan video.
- **📆 Manajemen Agenda Acara**: Atur jadwal kegiatan kustom RW, pilih acara yang ingin ditampilkan pada *countdown* beranda.
- **📄 Pengelolaan Dokumen LPJ & Keuangan**: Manajemen unggah dan hapus file laporan pertanggungjawaban kegiatan.
- **📣 Manajemen Poster Promosi & Pengumuman**: Unggah poster kegiatan dan tentukan poster mana yang menjadi *modal pop-up* beranda.
- **💬 Moderasi Komentar**: Filter dan tinjau ucapan atau aspirasi warga yang masuk.
- **👥 Manajemen Donatur**: Tambah, ubah urutan, dan kelola catatan nama-nama donatur kegiatan.
- **⚙️ Pengaturan Website & Profil**: Ubah nama organisasi, slogan, kontak WhatsApp, email, alamat sekretariat, sosial media, serta toggle opsi SEO & download publik.

---

## 🛠️ Tech Stack & Arsitektur

| Komponen | Teknologi |
|---|---|
| **Framework** | [React 18](https://react.dev/) + [Vite 6](https://vitejs.dev/) |
| **Bahasa Pemrograman** | [TypeScript](https://www.typescriptlang.org/) |
| **Routing** | [React Router v7](https://reactrouter.com/) (dengan Lazy Loading & Code Splitting) |
| **Styling & UI Tokens** | [Tailwind CSS v4](https://tailwindcss.com/) + CSS Design Tokens |
| **Komponen UI Primitif** | [@radix-ui](https://www.radix-ui.com/) |
| **Tipografi** | [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) & [Inter](https://fonts.google.com/specimen/Inter) |
| **Ikon** | [Lucide React](https://lucide.dev/) |
| **Animasi & Interaksi** | [Motion](https://motion.dev/) (Framer Motion v12) & [Canvas Confetti](https://github.com/catdad/canvas-confetti) |
| **Notifikasi** | [Sonner](https://sonner.emilkowal.ski/) |
| **Data Visualization** | [Recharts](https://recharts.org/) |
| **Penyimpanan & Backend** | [Supabase](https://supabase.com/) (Edge Functions & REST API) / Firebase Storage |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 📁 Struktur Direktori

```text
kataruma-rw-10/
├── public/                 # Aset statis publik (logo, favicon, gambar)
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── site/       # Komponen frontend publik
│   │   │       ├── Hero.tsx
│   │   │       ├── About.tsx
│   │   │       ├── Documentation.tsx
│   │   │       ├── AlbumCard.tsx
│   │   │       ├── PhotoGallery.tsx
│   │   │       ├── VideoGallery.tsx
│   │   │       ├── Kalender.tsx
│   │   │       ├── Countdown.tsx
│   │   │       ├── FinancialReports.tsx
│   │   │       ├── Donors.tsx
│   │   │       ├── Comments.tsx
│   │   │       ├── Poster.tsx
│   │   │       ├── Lightbox.tsx
│   │   │       ├── SearchOverlay.tsx
│   │   │       ├── Navbar.tsx
│   │   │       └── Footer.tsx
│   │   ├── data/
│   │   │   └── store.tsx   # Centralized store (State, Supabase API, CRUD handlers)
│   │   ├── pages/
│   │   │   ├── HomePage.tsx            # Halaman utama beranda publik
│   │   │   ├── AlbumDetailPage.tsx     # Halaman rincian album & dokumentasi
│   │   │   ├── DonorsPage.tsx          # Halaman daftar lengkap donatur
│   │   │   └── admin/                  # Panel CMS Admin (/adminrt02)
│   │   │       ├── LoginPage.tsx
│   │   │       ├── DashboardPage.tsx
│   │   │       ├── AlbumsPage.tsx
│   │   │       ├── PhotosPage.tsx
│   │   │       ├── VideosPage.tsx
│   │   │       ├── EventsPage.tsx
│   │   │       ├── ReportsPage.tsx
│   │   │       ├── PostersPage.tsx
│   │   │       ├── CommentsPage.tsx
│   │   │       ├── SettingsPage.tsx
│   │   │       └── ProfilePage.tsx
│   │   └── App.tsx         # Konfigurasi routing & Code-splitting
│   ├── styles/
│   │   ├── fonts.css       # Definisi webfont Plus Jakarta Sans & Inter
│   │   └── theme.css       # Token warna palet dan sistem tema
│   └── main.tsx            # Entry point aplikasi React
├── utils/
│   └── supabase/           # Konfigurasi kredensial koneksi Supabase
├── index.html              # HTML template & SEO meta tags
├── package.json            # Daftar dependensi & npm scripts
├── vite.config.ts          # Konfigurasi build Vite
└── vercel.json             # Konfigurasi rewrite SPA Vercel
```

---

## 🚀 Panduan Memulai (Instalasi Lokal)

### 1. Prasyarat
Pastikan Anda telah menginstal perangkat lunak berikut di komputer Anda:
- [Node.js](https://nodejs.org/) (versi 18.x atau lebih baru)
- Git

### 2. Clone Repositori
```bash
git clone https://github.com/rayyanbabab/kataruma.git
cd kataruma
```

### 3. Instalasi Dependensi
```bash
npm install
```

### 4. Konfigurasi Lingkungan (Opsional)
Pastikan berkas `.env` atau `.env.local` telah disiapkan bila ingin menghubungkan ke instance Supabase Anda sendiri:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka browser dan akses alamat lokal: `http://localhost:5173/` (atau port yang tertera di terminal).

### 6. Build Produksi
Untuk menguji hasil kompilasi produksi:
```bash
npm run build
npm run preview
```

---

## 🌐 Akses Panel Admin
Panel manajemen konten dapat diakses melalui rute:
- **URL**: `/adminrt02/login` (atau otomatis diarahkan dari `/login`)
- Silakan gunakan kredensial akun administrator yang telah didaftarkan untuk mengelola konten dan pengaturan situs.

---

## 🚀 Panduan Deployment (Vercel)

Proyek ini telah dikonfigurasi dengan `vercel.json` untuk menangani routing SPA (*Single Page Application*):
1. Import repositori GitHub `kataruma` ke dashboard **[Vercel](https://vercel.com/)**.
2. Vercel akan otomatis mendeteksi konfigurasi Vite:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Masukkan *Environment Variables* jika diperlukan, lalu klik **Deploy**.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah lisensi [MIT License](LICENSE). Bebas digunakan dan dikembangkan untuk kepentingan komunitas dan organisasi pemuda.

---

<p align="center">
  Dikelola dengan ❤️ dan semangat gotong royong oleh <b>Kataruma RW 10</b><br/>
  <i>Kelurahan Kalibata, Kecamatan Pancoran, Jakarta Selatan</i>
</p>
