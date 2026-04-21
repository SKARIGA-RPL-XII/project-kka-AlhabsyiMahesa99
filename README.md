# Recyloop

Recyloop adalah aplikasi pengelolaan setoran sampah berbasis web yang membantu proses setor sampah menjadi lebih terstruktur, mulai dari pengajuan pickup oleh user, pengambilan oleh kurir, hingga validasi dan pemberian poin oleh admin.

## Tujuan Proyek
Proyek ini dibuat untuk mempermudah proses pengelolaan sampah terpilah dan meningkatkan transparansi pada alur penjemputan, penimbangan, serta penukaran poin reward.

## Role Pengguna

### User
- Registrasi dan login
- Mengajukan penjemputan sampah
- Memilih kategori sampah
- Mengisi estimasi berat, alamat, dan catatan
- Melihat riwayat setoran
- Menukarkan poin dengan reward

### Kurir
- Melihat daftar pickup yang tersedia
- Mengambil tugas pickup
- Melihat detail alamat user
- Menginput berat final hasil penimbangan
- Mengunggah foto bukti timbang

### Admin
- Melihat dashboard operasional
- Mengelola kategori sampah
- Memvalidasi setoran
- Menambahkan poin ke user berdasarkan berat final
- Mengelola akun user dan kurir
- Mengelola reward
- Melihat laporan data setoran dan redeem

## Alur Sistem
1. User melakukan registrasi atau login.
2. User memilih kategori sampah dan mengajukan penjemputan.
3. User mengunggah foto sampah, mengisi estimasi berat, alamat pickup, dan catatan tambahan.
4. Data pickup masuk ke sistem dengan status `pending`.
5. Kurir melihat daftar pickup yang tersedia lalu mengambil salah satu tugas.
6. Status pickup berubah menjadi `scheduled`.
7. Setelah sampai di lokasi, kurir menimbang sampah dan mengunggah foto bukti timbang.
8. Status pickup berubah menjadi `picked_up`.
9. Admin memvalidasi berat final sampah.
10. Sistem menghitung poin berdasarkan berat final dan kategori sampah.
11. Poin ditambahkan ke akun user, lalu status pickup berubah menjadi `completed`.
12. User dapat melihat riwayat setoran dan menukar poin dengan reward.

## Fitur Utama
- Autentikasi multi-role
- Pengajuan pickup sampah
- Validasi pickup oleh kurir dan admin
- Sistem poin otomatis
- Penukaran reward
- Manajemen data master kategori sampah
- Manajemen user dan kurir
- Dashboard dan laporan admin

## Teknologi
- Next.js
- React
- TypeScript
- Supabase
- TanStack Query
- Tailwind CSS

## Struktur Folder
- `src/app/(auth)` : halaman login dan register
- `src/app/user` : fitur untuk user
- `src/app/kurir` : fitur untuk kurir
- `src/app/admin` : fitur untuk admin
- `src/lib/supabase.ts` : konfigurasi Supabase

## Cara Menjalankan
```bash
cd web-recyloop
npm install
npm run dev
