# Portfolio Rendi Erlangga (React + Vite + Tailwind + Supabase)

## 1. Siapkan database (Supabase)
1. Buka Supabase > **SQL Editor** > **New query**.
2. Salin seluruh isi `schema.sql`, tempel, lalu **Run**. Ini membuat tabel, keamanan (RLS), tempat foto, data awal, dan menjadikan `rendierlangga2508@gmail.com` sebagai admin.
3. Pastikan akun itu sudah ada di **Authentication > Users** (sudah ada) dan pendaftaran umum sudah dimatikan.
SQL hanya dijalankan sekali. Kalau muncul error "already exists", berarti sudah pernah dijalankan.

## 2. Upload ke GitHub
Buat repo baru, lalu tarik SEMUA isi folder ini (termasuk folder `src`) ke GitHub. Jangan upload `node_modules` atau `dist`.

## 3. Deploy di Vercel
1. Add New > Project > pilih repo > Import.
2. Buka **Environment Variables**, tambahkan dua variabel (nilainya ada di `.env.example`):
   `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`
3. Klik **Deploy**.

## 4. Mengubah isi website
Buka `alamat-kamu.vercel.app/admin/login`, masuk, lalu edit lewat menu di kiri. Perubahan langsung tampil di website.

## Menjalankan di komputer (opsional)
Salin `.env.example` menjadi `.env`, lalu `npm install` dan `npm run dev`.
