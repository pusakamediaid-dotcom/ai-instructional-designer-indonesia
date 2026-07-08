# 🤝 Panduan Kontribusi

Terima kasih tertarik ikut mengembangkan **AI Instructional Designer Indonesia**! Proyek ini terbuka untuk kontribusi dari siapa pun — guru, pengembang, akademisi, atau siapa saja yang peduli pendidikan Indonesia.

## Cara Berkontribusi

1. **Fork** repositori ini ke akun GitHub Anda
2. **Clone** hasil fork ke komputer lokal:
   ```bash
   git clone https://github.com/<username-anda>/ai-instructional-designer-indonesia.git
   ```
3. **Buat branch baru** untuk perubahan Anda:
   ```bash
   git checkout -b fix/nama-perbaikan
   ```
4. **Lakukan perubahan**, pastikan `npm run lint` dan `npm run build` sukses
5. **Commit** dengan pesan yang mengikuti [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat: tambah fitur ekspor Google Docs`
   - `fix: perbaiki bug pada wizard tahap 2`
   - `docs: perbaiki tipo di README`
   - `refactor: rapikan struktur folder komponen`
6. **Push** ke branch Anda dan buka **Pull Request** ke `main`

## Standar Kode

- **Bahasa**: kode & variable = English; komentar & UI = Bahasa Indonesia
- **Formatting**: ikuti gaya yang sudah ada di repo (2 spasi indent, single quote)
- **TypeScript**: hindari `any` kalau memungkinkan
- **Komponen React**: satu file = satu komponen utama, export default

## Melaporkan Bug / Meminta Fitur

Buka [Issue baru](https://github.com/pusakamediaid-dotcom/ai-instructional-designer-indonesia/issues/new) dengan:

- Judul singkat & jelas
- Langkah reproduksi (untuk bug)
- Screenshot bila memungkinkan
- Versi Node.js & sistem operasi

## Kode Etik

Bersikap ramah, saling menghormati, dan fokus pada masalah — bukan pada orang. Kritik teknis boleh, serangan personal tidak.

---

Untuk pertanyaan lain, buka [Diskusi](https://github.com/pusakamediaid-dotcom/ai-instructional-designer-indonesia/discussions) atau hubungi maintainer via email.
