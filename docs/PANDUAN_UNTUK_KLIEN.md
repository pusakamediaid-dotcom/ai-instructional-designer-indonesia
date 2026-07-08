# Panduan Lengkap untuk Guru

> Panduan ini ditulis khusus untuk guru yang belum pernah menggunakan Git atau terminal. Ikuti tiap bagian secara berurutan. Bila sudah familiar, silakan langsung ke bagian yang relevan.

---

## 0. Ringkasan Satu Halaman

**Bila hanya punya lima menit, cukup baca bagian ini.**

**Apa aplikasi ini?**
Asisten perancang yang membantu menyusun Modul Ajar, LKPD, dan Bahan Ajar dalam hitungan menit — mendukung dua jalur regulasi (Kemendikbud dan Kemenag), berbasis metode Backward Design.

**Apa yang bisa dilakukan?**

- Isi form konteks (mapel, fase, kelas, materi), aplikasi menghasilkan perangkat pembelajaran lengkap
- Cetak PDF siap dilampirkan ke administrasi sekolah
- Salin ke Word atau Google Docs untuk diedit lebih lanjut
- Gratis dipakai berapa pun jumlah guru di satu sekolah

**Tiga langkah tercepat mulai pakai:**

1. Siapkan akun untuk hosting aplikasi (Google Cloud atau Railway), keduanya gratis untuk pemakaian awal
2. Deploy ke Google Cloud Run — panduan lengkap di [Bagian E](#e-deploy-ke-google-cloud-run) (sekitar lima menit)
3. Buka URL aplikasi yang muncul di terminal, aplikasi siap dipakai

Ingin coba dulu di komputer sendiri sebelum deploy? Ikuti [Bagian C](#c-clone-repo-dan-jalankan-di-komputer).

---

## Daftar Isi

- [A. Membuat Akun untuk Kolaborasi Kode](#a-membuat-akun-untuk-kolaborasi-kode)
- [B. Instal Git dan Node.js](#b-instal-git-dan-nodejs)
- [C. Clone Repo dan Jalankan di Komputer](#c-clone-repo-dan-jalankan-di-komputer)
- [D. Mengambil API Key Gemini secara Gratis](#d-mengambil-api-key-gemini-secara-gratis)
- [E. Deploy ke Google Cloud Run](#e-deploy-ke-google-cloud-run)
- [F. Troubleshooting Kesalahan Umum](#f-troubleshooting-kesalahan-umum)
- [G. Transfer Kepemilikan Repo](#g-transfer-kepemilikan-repo)
- [H. Cara Update ke Versi Terbaru](#h-cara-update-ke-versi-terbaru)
- [I. Tanya-Jawab — Sepuluh Pertanyaan Tersering](#i-tanya-jawab--sepuluh-pertanyaan-tersering)

---

## A. Membuat Akun untuk Kolaborasi Kode

Aplikasi ini disimpan di sistem pengelola kode yang membutuhkan akun. Bila belum punya:

1. Buka halaman pendaftaran akun repositori yang disediakan pemilik
2. Isi email, kata sandi, dan pilih nama pengguna
3. Verifikasi email lewat kode yang dikirim
4. Pilih paket gratis, sudah lebih dari cukup
5. Simpan nama pengguna dan kata sandi di tempat aman, misalnya pengelola kata sandi peramban

---

## B. Instal Git dan Node.js

### Windows

**Node.js:**

1. Buka https://nodejs.org/en/download
2. Klik Windows Installer versi LTS 20
3. Jalankan installer, klik Next hingga selesai (opsi default sudah tepat)

**Git:**

1. Buka https://git-scm.com/download/win
2. Unduh 64-bit Git for Windows Setup
3. Jalankan installer, Next semua (Git akan otomatis memasang Git Bash sebagai terminal)

**Uji instalasi.** Buka Git Bash dari menu Start, ketik:

- `node -v` — harus muncul `v20.x.x`
- `git --version` — harus muncul `git version 2.x.x`

### macOS

1. Buka aplikasi Terminal (tekan Command+Space, ketik Terminal)
2. Instal Homebrew bila belum ada:

   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

3. Instal Node.js dan Git:

   ```bash
   brew install node@20 git
   ```

4. Uji: `node -v` dan `git --version`

---

## C. Clone Repo dan Jalankan di Komputer

Buka Git Bash (Windows) atau Terminal (macOS), jalankan perintah satu per satu:

```bash
# 1. Pindah ke folder Documents
cd ~/Documents

# 2. Clone (unduh) repo
git clone https://github.com/pusakamediaid-dotcom/ai-instructional-designer-indonesia.git

# 3. Masuk ke folder repo
cd ai-instructional-designer-indonesia

# 4. Instal dependencies (dua hingga lima menit)
npm install

# 5. Salin file environment contoh
cp .env.example .env.local
```

**Edit `.env.local`** dengan Notepad atau TextEdit. Ganti baris:

```
GEMINI_API_KEY="MY_GEMINI_API_KEY"
```

menjadi (contoh):

```
GEMINI_API_KEY="AIzaSyABC123defGHI456jklMNO789pqrSTU"
```

Simpan, lalu jalankan:

```bash
npm run dev
```

Buka http://localhost:3000 di peramban. Aplikasi siap dipakai.

Untuk menghentikan aplikasi, tekan Ctrl+C di terminal.

---

## D. Mengambil API Key Gemini secara Gratis

1. Buka https://aistudio.google.com/apikey
2. Login dengan akun Google
3. Klik "Create API Key"
4. Pilih "Create API key in new project"
5. Salin API key yang muncul (format `AIzaSy...`), simpan aman

> **Penting.** Jangan pernah membagi API key ini atau memasukkannya ke repositori kode. Bila bocor, segera revoke di halaman yang sama.

### Batas Kuota — Gratis dan Berbayar

| Model | Kuota Gratis | Kecukupan |
|---|---|---|
| Gemini 1.5 Flash (default) | 15 permintaan per menit, 1.500 per hari | Sekitar 50 modul ajar per hari |
| Gemini 1.5 Pro | 2 permintaan per menit, 50 per hari | Untuk uji kualitas |
| Gemini 2.0 Flash | 15 permintaan per menit, 1.500 per hari | Sekitar 50 modul ajar per hari |

Kuota gratis Gemini 1.5 Flash cukup untuk satu guru menggunakan penuh setiap hari. Bila habis, aplikasi otomatis beralih ke mesin cadangan lokal — modul tetap dihasilkan.

Untuk kebutuhan sekolah dengan lebih dari sepuluh guru pakai bersamaan, upgrade ke berbayar (sekitar 0,075 USD per satu juta token input, biasanya di bawah 5 USD per bulan per sekolah).

---

## E. Deploy ke Google Cloud Run

Deploy berarti memasang aplikasi di internet agar dapat diakses dari perangkat mana saja tanpa perlu `npm run dev`. Google Cloud Run dipilih karena:

- Mendukung Node.js server secara native
- Diskalakan otomatis ke nol saat tidak dipakai (hemat biaya)
- Tersedia kredit gratis untuk akun baru
- Domain HTTPS otomatis

### Langkah

1. Buat akun Google Cloud di https://cloud.google.com dan klaim kredit gratis
2. Instal `gcloud` CLI — petunjuk di https://cloud.google.com/sdk/docs/install
3. Login dan setup:

   ```bash
   gcloud auth login
   gcloud config set project <PROJECT_ID>
   gcloud services enable run.googleapis.com cloudbuild.googleapis.com
   ```

4. Deploy langsung dari folder repositori:

   ```bash
   cd ai-instructional-designer-indonesia
   gcloud run deploy ai-instructional-designer \
     --source . \
     --region asia-southeast2 \
     --allow-unauthenticated \
     --set-env-vars GEMINI_API_KEY=<API_KEY_ANDA>
   ```

5. Tunggu tiga hingga lima menit. URL aplikasi akan muncul di terminal, contoh:

   ```
   https://ai-instructional-designer-xxxxx-as.a.run.app
   ```

6. Selesai. Bagikan URL tersebut ke rekan guru.

### Alternatif: Railway (Tanpa CLI)

1. Buka https://railway.app/new, login dengan akun repositori
2. Klik Deploy from GitHub repo, pilih repositori aplikasi
3. Railway auto-detect `Dockerfile` dan deploy
4. Tambahkan env var `GEMINI_API_KEY` di dashboard
5. Klik Generate Domain, dapat URL publik

### Alternatif: Render

Mirip Railway, gratis untuk tier hobi (dengan cold start sekitar satu menit setelah idle). Buka https://render.com/deploy.

---

## F. Troubleshooting Kesalahan Umum

### 1. `command not found: npm` atau `git`

Node.js atau Git belum terinstal. Ulangi [Bagian B](#b-instal-git-dan-nodejs).

### 2. `npm install` error: `EACCES` (Permission denied)

Pada macOS atau Linux, jangan pakai `sudo`. Ganti pemilik folder npm:

```bash
sudo chown -R $(whoami) ~/.npm
```

### 3. `npm run dev` error: `Error: GEMINI_API_KEY is not defined`

File `.env.local` belum ada, salah nama, atau API key belum diisi. Cek [Bagian C](#c-clone-repo-dan-jalankan-di-komputer) poin lima. Pastikan file bernama persis `.env.local` (bukan `env.local` atau `.env.local.txt`).

### 4. Tombol "Generate" error atau kuota habis

Aplikasi otomatis beralih ke Mode Cadangan. Ini fitur, bukan bug. Modul ajar tetap terbentuk dengan template lokal. Untuk kembali memakai Gemini, tunggu reset kuota (jam 15.00 WIB besok, mengikuti zona waktu Google) atau upgrade billing.

### 5. Peramban: `This site can't be reached` saat buka localhost:3000

- Cek terminal, pastikan `npm run dev` masih berjalan
- Coba port lain: bila terminal menulis `Local: http://localhost:5173`, buka URL tersebut

### 6. `Module not found: motion` atau error Tailwind

Bug versi Tailwind v4 kadang muncul. Solusi:

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### 7. `Error: listen EADDRINUSE: address already in use :::3000`

Port 3000 sudah dipakai aplikasi lain. Matikan proses tersebut:

- macOS atau Linux: `lsof -ti:3000 | xargs kill -9`
- Windows (PowerShell): `Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force`

Atau pakai port lain: `PORT=3001 npm run dev`

### 8. Peramban: `CORS error` atau `blocked by CORS policy`

Jarang terjadi di setup default. Biasanya karena mengakses backend dari domain berbeda. Pastikan membuka `http://localhost:3000` (bukan `127.0.0.1:3000`), atau restart `npm run dev`.

---

## G. Transfer Kepemilikan Repo

Bila repositori ini dibuatkan oleh pihak lain dan Anda ingin memindahkan ke akun Anda sendiri:

1. Buka repositori: `https://github.com/pusakamediaid-dotcom/ai-instructional-designer-indonesia`
2. Klik tab Settings (paling kanan)
3. Scroll paling bawah, ke Danger Zone, klik Transfer
4. Isi:
   - New owner's username: nama pengguna Anda
   - Repository name confirmation: ketik ulang `ai-instructional-designer-indonesia`
5. Klik "I understand, transfer this repository"
6. Sistem akan mengirim email konfirmasi ke Anda sebagai penerima, klik link dalam 24 jam
7. Selesai. Repositori sekarang milik Anda sepenuhnya.

Setelah transfer, perbarui URL di Vercel, Cloud Run, dan dokumentasi internal.

---

## H. Cara Update ke Versi Terbaru

Bila pengembang merilis versi baru, update dengan:

```bash
cd ~/Documents/ai-instructional-designer-indonesia
git pull
npm install
npm run build
# Bila deploy di Cloud Run, deploy ulang:
gcloud run deploy ai-instructional-designer --source . --region asia-southeast2
```

Untuk deployment yang terhubung ke repositori (Railway, Render), update terjadi otomatis setiap ada perubahan di branch `main`.

Untuk mengetahui ada versi baru, aktifkan Watch, pilih Releases only di halaman repositori. Anda akan menerima email saat ada rilis baru.

---

## I. Tanya-Jawab — Sepuluh Pertanyaan Tersering

### 1. Apakah data siswa saya disimpan Google?

Tidak. Aplikasi hanya mengirim konteks pembelajaran (mapel, materi, karakteristik kelas) ke API Gemini untuk diproses, tanpa nama siswa spesifik. Google Gemini API tidak menggunakan data untuk melatih model (sesuai [kebijakan mereka](https://ai.google.dev/gemini-api/terms)). Data tidak disimpan di server aplikasi ini, hanya di peramban Anda sementara.

### 2. Berapa biaya operasional per bulan?

Bisa nol rupiah untuk pemakaian normal:

- Gemini API: gratis dalam batas 1.500 permintaan per hari
- Google Cloud Run: gratis dalam batas dua juta permintaan per bulan
- Hosting repositori: gratis untuk repositori publik

Untuk sekolah dengan lebih dari dua puluh guru pakai bersamaan, estimasi Rp 50.000 hingga Rp 200.000 per bulan (Gemini paid tier).

### 3. Bolehkah dipakai untuk banyak guru di satu sekolah?

Sangat boleh. Aplikasi ini berlisensi MIT, bebas dipakai berapa pun jumlah guru tanpa royalti. Cukup satu deploy Cloud Run, semua guru memakai URL yang sama.

### 4. Apakah bisa offline?

Sebagian. Setelah `npm install`, aplikasi bisa berjalan `npm run dev` tanpa internet, namun fitur AI (Gemini) membutuhkan internet. Bila internet mati, aplikasi otomatis memakai Mode Cadangan yang berjalan sepenuhnya lokal (kualitas template, tidak dinamis).

### 5. Bagaimana bila Gemini menghasilkan output yang salah?

Semua output AI perlu direview oleh Anda sebagai guru profesional sebelum dipakai. Aplikasi ini adalah alat bantu, bukan pengganti keahlian Anda. Bila menemukan ketidaksesuaian (misal CP yang tidak ada di regulasi resmi), edit langsung di aplikasi sebelum cetak. Rencana pengembangan berikutnya akan menambah validasi otomatis CP terhadap basis data resmi untuk mengurangi masalah ini.

### 6. Bisakah menambah mapel Mulok custom?

Belum di rilis saat ini. Sudah masuk [Roadmap](../docs/ROADMAP.md). Sementara ini, workaround: pilih mapel terdekat, lalu edit "Nama Penyusun" dan "Materi" untuk menyesuaikan dengan konteks Mulok Anda.

### 7. Apakah kompatibel dengan e-Kinerja atau e-Raport?

Aplikasi ini menghasilkan Modul Ajar, LKPD, dan Bahan Ajar dalam format administratif standar. Output bisa disalin ke sistem apa pun (e-Kinerja, e-Raport, Merdeka Mengajar). Tidak ada integrasi langsung untuk saat ini, namun format sudah sesuai template resmi Kemendikbud dan Kemenag.

### 8. Apakah bisa ekspor ke Google Docs langsung?

Belum di rilis saat ini. Sementara ini pakai fitur "Salin ke Word atau Docs" — salin hasil, tempel ke Google Docs baru. Fitur ekspor langsung ke Google Drive ada di [Roadmap](../docs/ROADMAP.md).

### 9. Bagaimana cara backup modul yang saya buat?

Aplikasi tidak menyimpan riwayat (privacy-first). Untuk backup, klik "Cetak PDF" setiap selesai — simpan PDF di Google Drive atau komputer Anda. Fitur pustaka modul ada di rencana pengembangan lanjut.

### 10. Aplikasi terus error, saya harus hubungi siapa?

Beberapa opsi:

- Buka issue di repositori: [tautan cepat](https://github.com/pusakamediaid-dotcom/ai-instructional-designer-indonesia/issues/new/choose)
- Baca [Troubleshooting](#f-troubleshooting-kesalahan-umum), delapan kesalahan umum sudah ada solusinya
- Email pemilik proyek untuk pertanyaan lebih lanjut
- Coba `git pull` dan `npm install` — mungkin sudah ada perbaikan di versi baru

---

Butuh bantuan lain? Buka [Issue baru](https://github.com/pusakamediaid-dotcom/ai-instructional-designer-indonesia/issues/new/choose) atau hubungi pemilik proyek.
