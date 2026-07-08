# 🔒 Kebijakan Keamanan

## Versi yang Didukung

Saat ini hanya versi terbaru (`main` branch, tag `v0.1.x`) yang mendapat pembaruan keamanan.

| Versi | Didukung |
|---|---|
| 0.1.x | ✅ |
| < 0.1 | ❌ |

## Melaporkan Kerentanan

Jika Anda menemukan kerentanan keamanan (contoh: kebocoran API key, XSS, injection), **mohon TIDAK membuat issue publik**. Sebagai gantinya, laporkan secara privat via:

- **Email:** `pusaka.media.id@gmail.com` dengan subjek `[SECURITY] AI Instructional Designer Indonesia`
- **GitHub Security Advisory:** [Buat advisory privat](https://github.com/pusakamediaid-dotcom/ai-instructional-designer-indonesia/security/advisories/new)

Kami akan merespons dalam **3 hari kerja**. Setelah kerentanan diverifikasi & diperbaiki, laporan Anda akan diakui di catatan rilis (jika Anda berkenan disebutkan).

## Praktik Pengguna yang Direkomendasikan

- Jangan pernah commit file `.env.local` atau kredensial ke Git
- Rotasi API key Gemini Anda setiap 3–6 bulan
- Gunakan HTTPS saja (jangan expose port HTTP ke publik)
- Jalankan aplikasi dengan user non-root (Dockerfile bawaan sudah demikian)

Terima kasih telah membantu menjaga proyek ini aman untuk semua guru Indonesia. 🙏
