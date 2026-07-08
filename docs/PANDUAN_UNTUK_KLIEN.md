# 📖 Panduan Lengkap untuk Guru

> Panduan ini ditulis khusus untuk **guru yang belum pernah menggunakan GitHub / terminal**. Ikuti bagian per bagian secara berurutan. Sudah familiar? Silakan lompat ke bagian yang relevan.

---

## 0. Ringkasan 1 Halaman

> **Kalau Anda cuma punya 5 menit, baca bagian ini saja.**

**Apa aplikasi ini?**
Asisten AI yang membantu Anda menyusun **Modul Ajar, LKPD, dan Bahan Ajar** dalam hitungan menit — mendukung dua jalur regulasi (Kemendikbud &amp; Kemenag), berbasis metode **Backward Design**.

**Apa yang bisa dilakukan?**
- Isi form konteks (mapel, fase, kelas, materi) → aplikasi generate seluruh perangkat pembelajaran
- Cetak PDF siap dilampirkan ke administrasi sekolah
- Copy-paste ke Word / Google Docs untuk diedit lebih lanjut
- Gratis dipakai untuk berapa pun jumlah guru di satu sekolah

**3 langkah tercepat mulai pakai:**

1. **Buat akun GitHub** di [github.com/signup](https://github.com/signup) (5 menit)
2. **Deploy ke Google Cloud Run** — tutorial lengkap di [Bagian E](#e-deploy-ke-google-cloud-run) (5 menit)
3. **Buka URL aplikasi** yang muncul di terminal — selesai, aplikasi live!

**Ingin coba dulu di komputer sendiri sebelum deploy?** Ikuti [Bagian C](#c-clone-repo--jalankan-di-komputer).

---

## Daftar Isi

- [A. Membuat Akun GitHub](#a-membuat-akun-github)
- [B. Install Git &amp; Node.js](#b-install-git--nodejs)
- [C. Clone Repo &amp; Jalankan di Komputer](#c-clone-repo--jalankan-di-komputer)
- [D. Mengambil API Key Gemini (Gratis)](#d-mengambil-api-key-gemini-gratis)
- [E. Deploy ke Google Cloud Run](#e-deploy-ke-google-cloud-run)
- [F. Troubleshooting — Error Umum](#f-troubleshooting--error-umum)
- [G. Transfer Kepemilikan Repo ke Akun Anda](#g-transfer-kepemilikan-repo-ke-akun-anda)
- [H. Cara Update ke Versi Terbaru](#h-cara-update-ke-versi-terbaru)
- [I. FAQ — 10 Pertanyaan Tersering](#i-faq--10-pertanyaan-tersering)

---

## A. Membuat Akun GitHub

1. Buka **https://github.com/signup**
2. Isi email → password → pilih username (contoh: `guruhebatindonesia`)
3. Verifikasi email lewat kode yang dikirim
4. Pilih paket **Free** — sudah lebih dari cukup
5. Selesai. Simpan username &amp; password di tempat aman (misal Google Password Manager)

---

## B. Install Git &amp; Node.js

### 🪟 Windows

**Node.js:**
1. Buka https://nodejs.org/en/download
2. Klik **Windows Installer (.msi)** versi **LTS 20.x**
3. Jalankan installer → klik *Next* terus (default OK)

**Git:**
1. Buka https://git-scm.com/download/win
2. Download **64-bit Git for Windows Setup**
3. Jalankan installer → *Next* semua (default OK — Git otomatis pasang "Git Bash" yang akan Anda pakai)

**Cek instalasi:** buka **Git Bash** (di Start Menu), ketik:
- `node -v` → harus muncul `v20.x.x`
- `git --version` → harus muncul `git version 2.x.x`

### 🍎 macOS

1. Buka **Terminal** (⌘ + Space → ketik "Terminal")
2. Install Homebrew (kalau belum ada):
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
3. Install Node.js &amp; Git:
   ```bash
   brew install node@20 git
   ```
4. Cek: `node -v` &amp; `git --version`

---

## C. Clone Repo &amp; Jalankan di Komputer

Buka **Git Bash** (Windows) atau **Terminal** (macOS), jalankan **satu per satu**:

```bash
# 1. Pindah ke folder Documents
cd ~/Documents

# 2. Clone (download) repo
git clone https://github.com/pusakamediaid-dotcom/ai-instructional-designer-indonesia.git

# 3. Masuk ke folder repo
cd ai-instructional-designer-indonesia

# 4. Install dependencies (2-5 menit)
npm install

# 5. Salin file environment
cp .env.example .env.local
```

**Edit `.env.local`** — buka dengan Notepad/TextEdit, ganti:

```
GEMINI_API_KEY="MY_GEMINI_API_KEY"
```

menjadi (contoh):

```
GEMINI_API_KEY="AIzaSyABC123defGHI456jklMNO789pqrSTU"
```

Simpan, lalu:

```bash
npm run dev
```

Buka **http://localhost:3000** di peramban → aplikasi siap dipakai! 🎉

Untuk menghentikan: tekan **Ctrl+C** di terminal.

---

## D. Mengambil API Key Gemini (Gratis)

1. Buka **https://aistudio.google.com/apikey**
2. Login dengan akun Google
3. Klik **"Create API Key"**
4. Pilih **"Create API key in new project"**
5. Copy API key (format: `AIzaSy...`) — simpan aman!

> ⚠️ **PENTING:** Jangan pernah share API key ini / commit ke GitHub. Kalau bocor, langsung revoke di halaman yang sama.

### Batas Kuota — Gratis vs Berbayar

| Model | Kuota Gratis | Cukup untuk |
|---|---|---|
| **Gemini 1.5 Flash** (default) | 15 request/menit · 1.500 request/hari | ~50 modul ajar/hari |
| **Gemini 1.5 Pro** | 2 request/menit · 50 request/hari | Testing kualitas |
| **Gemini 2.0 Flash** | 15 request/menit · 1.500 request/hari | ~50 modul ajar/hari |

**Kesimpulan:** Kuota gratis Gemini 1.5 Flash **cukup untuk 1 guru menggunakan penuh setiap hari**. Kalau habis, aplikasi otomatis pindah ke mesin lokal (fallback) — modul tetap terbentuk.

Untuk kebutuhan sekolah (10+ guru pakai bersamaan), upgrade ke berbayar (~$0.075 per 1M input token — sangat murah, biasanya di bawah $5/bulan/sekolah).

---

## E. Deploy ke Google Cloud Run

Deploy = pasang aplikasi Anda di internet, biar bisa diakses dari HP/laptop mana saja tanpa perlu `npm run dev`. **Google Cloud Run** dipilih karena:

- ✅ Native support Node.js server
- ✅ Auto-scale ke nol saat tidak dipakai (hemat biaya)
- ✅ Ada kredit gratis **$300 untuk akun baru** (cukup untuk bertahun-tahun pemakaian normal)
- ✅ Domain HTTPS otomatis

### Langkah

1. **Buat akun Google Cloud** di [cloud.google.com](https://cloud.google.com) — klaim kredit $300 gratis
2. **Install `gcloud` CLI** — [petunjuk di sini](https://cloud.google.com/sdk/docs/install)
3. **Login &amp; setup:**
   ```bash
   gcloud auth login
   gcloud config set project <PROJECT_ID>
   gcloud services enable run.googleapis.com cloudbuild.googleapis.com
   ```
4. **Deploy langsung dari folder repo:**
   ```bash
   cd ai-instructional-designer-indonesia
   gcloud run deploy ai-instructional-designer \
     --source . \
     --region asia-southeast2 \
     --allow-unauthenticated \
     --set-env-vars GEMINI_API_KEY=<API_KEY_ANDA>
   ```
5. Tunggu 3–5 menit → URL aplikasi Anda muncul di terminal, contoh:
   ```
   https://ai-instructional-designer-xxxxx-as.a.run.app
   ```
6. **Selesai!** Bagikan URL itu ke rekan guru.

### Alternatif: Railway (Lebih Mudah, Tanpa CLI)

1. Buka [railway.app/new](https://railway.app/new) → login dengan GitHub
2. Klik **Deploy from GitHub repo** → pilih `ai-instructional-designer-indonesia`
3. Railway auto-detect `Dockerfile` &amp; deploy
4. Tambah env var `GEMINI_API_KEY` di dashboard
5. Klik **Generate Domain** → dapat URL publik

### Alternatif: Render

Mirip Railway, gratis untuk hobby tier (dengan cold start ~1 menit setelah idle). Kunjungi [render.com/deploy](https://render.com/deploy).

---

## F. Troubleshooting — Error Umum

### 1. `command not found: npm` atau `git`

Node.js / Git belum ter-install. Ulangi [Bagian B](#b-install-git--nodejs).

### 2. `npm install` error: `EACCES` (Permission denied)

macOS/Linux, jangan pakai `sudo`. Ganti pemilik folder npm:
```bash
sudo chown -R $(whoami) ~/.npm
```

### 3. `npm run dev` error: `Error: GEMINI_API_KEY is not defined`

File `.env.local` belum ada / salah nama / API key belum diisi. Cek [Bagian C](#c-clone-repo--jalankan-di-komputer) poin 5. Pastikan file bernama **persis** `.env.local` (bukan `env.local` atau `.env.local.txt`).

### 4. Tombol "Generate" error / kuota habis

Aplikasi otomatis pindah ke **Mode Handal (fallback)**. Ini fitur, bukan bug — modul ajar tetap terbentuk dengan template lokal berkualitas tinggi. Kalau ingin balik pakai Gemini, tunggu reset kuota (jam 15:00 WIB besok — waktu Google) atau upgrade billing.

### 5. Browser: `This site can't be reached` saat buka localhost:3000

- Cek terminal — pastikan `npm run dev` masih berjalan
- Coba port lain: kalau terminal tertulis `Local: http://localhost:5173`, buka URL itu

### 6. `Module not found: motion` atau error Tailwind

Bug versi Tailwind v4 kadang. Solusi:
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### 7. `Error: listen EADDRINUSE: address already in use :::3000`

Port 3000 sudah dipakai aplikasi lain. Cari &amp; matikan:
- **macOS/Linux:** `lsof -ti:3000 | xargs kill -9`
- **Windows (PowerShell):** `Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force`

Atau pakai port lain: `PORT=3001 npm run dev`

### 8. Peramban: `CORS error` / `blocked by CORS policy`

Jarang terjadi di setup default. Biasanya karena Anda mengakses backend dari domain berbeda. Pastikan Anda buka `http://localhost:3000` (bukan `127.0.0.1:3000`) — atau restart `npm run dev`.

---

## G. Transfer Kepemilikan Repo ke Akun Anda

Kalau repo ini dibuatkan oleh pihak lain dan Anda ingin memindahkannya ke akun GitHub milik Anda:

1. Buka repo di GitHub: `https://github.com/pusakamediaid-dotcom/ai-instructional-designer-indonesia`
2. Klik tab **Settings** (paling kanan)
3. Scroll paling bawah → **Danger Zone** → klik **Transfer**
4. Isi:
   - **New owner's GitHub username**: username Anda
   - **Repository name confirmation**: ketik ulang `ai-instructional-designer-indonesia`
5. Klik **I understand, transfer this repository**
6. GitHub kirim email konfirmasi ke Anda (sebagai penerima) — klik link dalam 24 jam
7. Selesai. Repo sekarang milik Anda 100%.

> 💡 Setelah transfer, update URL di Vercel/Cloud Run/dokumentasi internal.

---

## H. Cara Update ke Versi Terbaru

Kalau developer merilis versi baru (v0.2, v1.0, dst), update dengan:

```bash
cd ~/Documents/ai-instructional-designer-indonesia
git pull
npm install
npm run build
# Kalau deploy di Cloud Run, deploy ulang:
gcloud run deploy ai-instructional-designer --source . --region asia-southeast2
```

Untuk deployment yang connect ke GitHub (Railway, Render, Vercel), update otomatis terjadi tiap push ke branch `main`.

**Cara tahu ada versi baru?** Klik **Watch** → **Releases only** di halaman repo GitHub — Anda akan dapat email tiap ada release baru.

---

## I. FAQ — 10 Pertanyaan Tersering

### 1. Apakah data siswa saya disimpan Google?

**Tidak.** Aplikasi hanya mengirim konteks pembelajaran (mapel, materi, karakteristik kelas) ke API Gemini untuk diproses, tanpa nama siswa spesifik. Google Gemini API tidak menggunakan data Anda untuk melatih model (sesuai [kebijakan mereka](https://ai.google.dev/gemini-api/terms)). Data tidak disimpan di server aplikasi ini — hanya di browser Anda sementara.

### 2. Berapa biaya operasional per bulan?

**Bisa 0 rupiah** untuk pemakaian normal:
- Gemini API: gratis dalam batas 1.500 request/hari
- Google Cloud Run: gratis dalam batas 2 juta request/bulan
- GitHub: gratis untuk repo public

Untuk sekolah dengan 20+ guru pakai bersamaan, estimasi ~Rp 50.000–200.000/bulan (Gemini paid tier).

### 3. Bolehkah dipakai untuk banyak guru di satu sekolah?

**Sangat boleh.** Aplikasi ini lisensi MIT — bebas dipakai berapa pun jumlah guru, tanpa royalti. Cukup 1 deploy Cloud Run, semua guru pakai URL yang sama.

### 4. Apakah bisa offline?

**Sebagian.** Setelah `npm install`, aplikasi bisa jalan `npm run dev` tanpa internet — tapi fitur AI (Gemini) butuh internet. Kalau internet mati, aplikasi otomatis pakai **Mode Handal (fallback)** yang jalan sepenuhnya lokal (kualitas template, tidak dinamis).

### 5. Bagaimana kalau Gemini salah / halusinasi?

Semua output AI perlu Anda **review sebagai guru profesional** sebelum dipakai. Aplikasi ini alat bantu, bukan pengganti keahlian Anda. Kalau menemukan halusinasi (misal CP yang tidak ada di regulasi resmi), edit langsung di aplikasi sebelum cetak. Roadmap v1.0 akan tambah RAG (validasi otomatis CP terhadap database resmi) untuk mengurangi masalah ini.

### 6. Bisakah menambah mapel Mulok custom?

**Belum di v0.1.** Sudah masuk [Roadmap](../docs/ROADMAP.md) untuk v1.0. Sementara ini, workaround: pilih mapel terdekat, lalu edit "Nama Penyusun" &amp; "Materi" untuk sesuaikan dengan konteks Mulok Anda.

### 7. Apakah kompatibel dengan e-Kinerja / e-Raport?

Aplikasi ini generate **Modul Ajar / LKPD / Bahan Ajar** — dokumen administratif standar. Output bisa Anda copy-paste ke sistem apa pun (e-Kinerja, e-Raport, Merdeka Mengajar). Tidak ada integrasi langsung (belum), tapi format sudah sesuai template resmi Kemendikbud/Kemenag.

### 8. Apakah bisa export ke Google Docs langsung?

**Belum di v0.1.** Sementara ini pakai "Salin ke Word/Docs" — copy hasil, paste ke Google Docs baru. Fitur ekspor langsung ke Google Drive ada di [Roadmap](../docs/ROADMAP.md) v0.2–v1.0.

### 9. Bagaimana cara backup modul yang saya buat?

Aplikasi ini **tidak simpan riwayat** (privacy-first). Untuk backup, klik **Cetak PDF** setiap selesai — simpan PDF di Google Drive / komputer Anda. Fitur "Library modul" ada di Roadmap v3.0.

### 10. Aplikasi error terus, saya harus hubungi siapa?

Beberapa opsi:
- **Buka issue di GitHub** — [tautan cepat](https://github.com/pusakamediaid-dotcom/ai-instructional-designer-indonesia/issues/new/choose)
- **Baca [Troubleshooting](#f-troubleshooting--error-umum)** — 8 error umum sudah ada solusinya
- **Email:** `pusaka.media.id@gmail.com`
- **Coba `git pull` &amp; `npm install`** — mungkin sudah ada perbaikan di versi baru

---

**Butuh bantuan lain?** Buka [Issue di GitHub](https://github.com/pusakamediaid-dotcom/ai-instructional-designer-indonesia/issues/new/choose) atau hubungi maintainer.
