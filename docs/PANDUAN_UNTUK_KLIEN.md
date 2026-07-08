# 📖 Panduan Lengkap untuk Guru (Pengguna Awam GitHub)

Panduan ini ditulis khusus untuk **guru yang belum pernah menggunakan GitHub / terminal**. Ikuti bagian per bagian secara berurutan. Jika sudah familiar, silakan lompat ke bagian yang relevan.

**Daftar Isi**
- [A. Membuat Akun GitHub](#a-membuat-akun-github)
- [B. Install Git & Node.js](#b-install-git--nodejs)
- [C. Clone Repo & Jalankan di Komputer](#c-clone-repo--jalankan-di-komputer)
- [D. Mengambil API Key Gemini (Gratis)](#d-mengambil-api-key-gemini-gratis)
- [E. Deploy ke Vercel (5 Menit)](#e-deploy-ke-vercel-5-menit)
- [F. Troubleshooting — 5 Error Umum](#f-troubleshooting--5-error-umum)
- [G. Transfer Kepemilikan Repo ke Akun Anda](#g-transfer-kepemilikan-repo-ke-akun-anda)
- [Deploy ke Google Cloud Run](#deploy-ke-google-cloud-run)

---

## A. Membuat Akun GitHub

1. Buka **https://github.com/signup**
2. Isi email → password → pilih username (contoh: `guruhebatindonesia`)
3. Verifikasi email lewat kode yang dikirim
4. Pilih paket **Free** — sudah lebih dari cukup
5. Selesai. Simpan username & password di tempat aman (misal Google Password Manager)

> 📸 *Screenshot: [`docs/screenshots/github-signup.png`](screenshots/github-signup.png) — placeholder, akan ditambahkan pada rilis berikutnya.*

---

## B. Install Git & Node.js

### 🪟 Windows

**Node.js:**
1. Buka https://nodejs.org/en/download
2. Klik tombol **Windows Installer (.msi)** versi **LTS 20.x**
3. Jalankan installer, klik *Next* terus sampai selesai (semua opsi default OK)

**Git:**
1. Buka https://git-scm.com/download/win
2. Download **64-bit Git for Windows Setup**
3. Jalankan installer, terus *Next* (opsi default OK — nanti Git akan otomatis pasang "Git Bash" yang akan Anda pakai sebagai terminal)

**Cek instalasi:**
- Buka **Git Bash** (cari di Start Menu)
- Ketik `node -v` → harus muncul `v20.x.x`
- Ketik `git --version` → harus muncul `git version 2.x.x`

### 🍎 macOS

1. Buka aplikasi **Terminal** (cari di Spotlight: ⌘ + Space → ketik "Terminal")
2. Install Homebrew (kalau belum ada) — jalankan:
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
3. Install Node.js & Git:
   ```bash
   brew install node@20 git
   ```
4. Cek: `node -v` dan `git --version`

---

## C. Clone Repo & Jalankan di Komputer

Buka **Git Bash** (Windows) atau **Terminal** (macOS), lalu jalankan **satu per satu**:

```bash
# 1. Pindah ke folder Documents (atau folder favorit Anda)
cd ~/Documents

# 2. Clone (download) repo
git clone https://github.com/pusakamediaid-dotcom/ai-instructional-designer-indonesia.git

# 3. Masuk ke folder repo
cd ai-instructional-designer-indonesia

# 4. Install semua dependencies (butuh 2-5 menit, tergantung internet)
npm install

# 5. Salin file environment contoh menjadi file environment nyata
cp .env.example .env.local
```

**Sekarang edit `.env.local`** — buka dengan Notepad (Windows) atau TextEdit (macOS), lalu ganti baris:

```
GEMINI_API_KEY="MY_GEMINI_API_KEY"
```

menjadi (contoh, ganti dengan API key Anda dari bagian D):

```
GEMINI_API_KEY="AIzaSyABC123defGHI456jklMNO789pqrSTU"
```

Simpan file. Lalu jalankan:

```bash
npm run dev
```

Buka peramban → ketik **http://localhost:3000** → aplikasi siap dipakai! 🎉

Untuk menghentikan aplikasi: tekan **Ctrl+C** di terminal.

---

## D. Mengambil API Key Gemini (Gratis)

1. Buka **https://aistudio.google.com/apikey**
2. Login dengan akun Google
3. Klik tombol biru **"Create API Key"**
4. Pilih **"Create API key in new project"** (atau pilih project yang sudah ada)
5. Copy API key yang muncul (format: `AIzaSy...`) — simpan aman!

> ⚠️ **PENTING:** Jangan pernah share API key ini ke siapa pun / commit ke GitHub. Kalau bocor, langsung revoke lewat halaman yang sama.

**Kuota gratis** cukup untuk pemakaian normal 50–100 modul ajar/bulan (per akun Google). Kalau habis, aplikasi otomatis fallback ke mesin lokal.

---

## E. Deploy ke Vercel (5 Menit)

Deploy = pasang aplikasi Anda di internet, biar bisa diakses dari HP/laptop mana saja tanpa perlu jalankan `npm run dev`.

1. Buka **https://vercel.com/signup** → klik **Continue with GitHub**
2. Setujui izin — Vercel akan connect ke akun GitHub Anda
3. Di dashboard Vercel, klik **Add New → Project**
4. Cari `ai-instructional-designer-indonesia` → klik **Import**
5. Di halaman konfigurasi:
   - Framework Preset: **Vite** (otomatis terdeteksi)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `dist` (default)
6. Klik **Environment Variables**, tambahkan:
   - Key: `GEMINI_API_KEY`
   - Value: `<API key Anda dari bagian D>`
7. Klik **Deploy** — tunggu 2-3 menit
8. Selesai! URL aplikasi Anda: `https://ai-instructional-designer-indonesia-xxxx.vercel.app`

> 💡 Setiap kali Anda push perubahan ke GitHub, Vercel otomatis deploy ulang. Tidak perlu apa-apa lagi.

---

## F. Troubleshooting — 5 Error Umum

### 1. `command not found: npm` atau `git`

Berarti Node.js / Git belum ter-install. Ulangi bagian **B**.

### 2. `npm install` error: `EACCES` (Permission denied)

**macOS/Linux:** jangan pakai `sudo`. Ganti pemilik folder npm:
```bash
sudo chown -R $(whoami) ~/.npm
```

### 3. `npm run dev` error: `Error: GEMINI_API_KEY is not defined`

File `.env.local` belum ada / salah nama / API key belum diisi. Cek langkah **C** poin 5 dan pastikan file bernama persis `.env.local` (bukan `env.local` atau `.env.local.txt`).

### 4. Aplikasi jalan tapi tombol "Generate" error / kuota habis

Aplikasi akan otomatis pindah ke **Mode Handal (fallback)**. Ini fitur, bukan bug — modul ajar tetap terbentuk dengan template lokal berkualitas tinggi.

### 5. Di browser muncul `This site can't be reached` saat buka localhost:3000

- Cek terminal — pastikan `npm run dev` masih berjalan
- Coba port lain: kalau di terminal tertulis `Local: http://localhost:5173`, buka URL itu

### 6. Bonus: cara update repo ke versi terbaru

```bash
cd ~/Documents/ai-instructional-designer-indonesia
git pull
npm install   # kalau ada dependency baru
```

---

## G. Transfer Kepemilikan Repo ke Akun Anda

Kalau repo ini dibuatkan oleh pihak lain (misal freelancer) dan Anda ingin memindahkannya ke akun GitHub milik Anda sendiri:

1. Buka repo di GitHub: `https://github.com/pusakamediaid-dotcom/ai-instructional-designer-indonesia`
2. Klik tab **Settings** (paling kanan)
3. Scroll paling bawah → seksi **Danger Zone** → klik **Transfer**
4. Isi:
   - **New owner's GitHub username**: username Anda
   - **Repository name confirmation**: ketik ulang `ai-instructional-designer-indonesia`
5. Klik **I understand, transfer this repository**
6. GitHub akan kirim email konfirmasi ke Anda (sebagai penerima) — klik link konfirmasi dalam 24 jam
7. Selesai. Repo sekarang milik Anda 100%.

> 💡 Setelah transfer, ingat update URL di semua tempat (Vercel, dokumentasi internal, dll).

---

## Deploy ke Google Cloud Run

Opsi ini cocok kalau Anda sudah pakai Google Workspace dan ingin infra tetap di ekosistem Google.

**Prasyarat:**
- Akun Google Cloud (bisa daftar gratis, dapat kredit $300)
- Google Cloud CLI (`gcloud`) ter-install

**Langkah singkat:**

```bash
# Login
gcloud auth login
gcloud config set project <PROJECT_ID>

# Enable service
gcloud services enable run.googleapis.com cloudbuild.googleapis.com

# Deploy dari source code (Cloud Run auto-build)
gcloud run deploy ai-instructional-designer \
  --source . \
  --region asia-southeast2 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=<API_KEY_ANDA>
```

Tunggu 3-5 menit → URL aplikasi akan muncul di terminal.

Untuk panduan visual lengkap, lihat dokumentasi resmi: https://cloud.google.com/run/docs/quickstarts/deploy-container

---

**Butuh bantuan?** Buka [Issue di GitHub](https://github.com/pusakamediaid-dotcom/ai-instructional-designer-indonesia/issues/new) atau hubungi maintainer.
