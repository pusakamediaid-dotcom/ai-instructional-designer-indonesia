# Kebijakan Keamanan

## Versi yang Didukung

Saat ini hanya versi terbaru dari branch `main` yang mendapat pembaruan keamanan.

## Melaporkan Kerentanan

Bila Anda menemukan kerentanan keamanan (contoh: kebocoran API key, XSS, injection), mohon **tidak** membuat issue publik. Sebagai gantinya, laporkan secara privat via:

- **Email:** `pusaka.media.id@gmail.com` dengan subjek `[SECURITY] AI Instructional Designer Indonesia`
- **GitHub Security Advisory:** [buat advisory privat](https://github.com/pusakamediaid-dotcom/ai-instructional-designer-indonesia/security/advisories/new)

Kami akan merespons dalam tiga hari kerja. Setelah kerentanan diverifikasi dan diperbaiki, laporan Anda akan diakui di catatan rilis (bila Anda berkenan disebutkan).

## Praktik Pengguna yang Direkomendasikan

- Jangan pernah commit file `.env.local` atau kredensial ke Git
- Rotasi API key Gemini setiap tiga hingga enam bulan
- Gunakan HTTPS saja (jangan expose port HTTP ke publik)
- Jalankan aplikasi dengan user non-root (Dockerfile bawaan sudah demikian)

Terima kasih telah membantu menjaga proyek ini aman untuk semua guru Indonesia.
