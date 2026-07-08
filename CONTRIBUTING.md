# Panduan Kontribusi

Terima kasih tertarik ikut mengembangkan AI Instructional Designer Indonesia. Proyek ini terbuka untuk kontribusi dari siapa pun — guru, pengembang, akademisi, atau siapa saja yang peduli pendidikan Indonesia.

## Cara Berkontribusi

1. **Fork** repositori ini ke akun Anda
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
   - `fix: perbaiki bug pada wizard tahap dua`
   - `docs: perbaiki tipo di README`
   - `refactor: rapikan struktur folder komponen`

6. **Push** ke branch Anda dan buka **Pull Request** ke `main`

## Standar Kode

- **Bahasa:** kode dan variable dalam English, komentar dan UI dalam Bahasa Indonesia
- **Formatting:** ikuti gaya yang sudah ada di repositori (indentasi dua spasi, single quote)
- **TypeScript:** hindari `any` bila memungkinkan
- **Komponen React:** satu file adalah satu komponen utama dengan export default

## Melaporkan Bug atau Meminta Fitur

Buka [Issue baru](https://github.com/pusakamediaid-dotcom/ai-instructional-designer-indonesia/issues/new/choose) dengan:

- Judul singkat dan jelas
- Langkah reproduksi (untuk bug)
- Screenshot bila memungkinkan
- Versi Node.js dan sistem operasi

## Kode Etik

Bersikap ramah, saling menghormati, dan fokus pada masalah bukan pada orang. Kritik teknis diterima, serangan personal tidak.

---

Untuk pertanyaan lain, buka [Diskusi](https://github.com/pusakamediaid-dotcom/ai-instructional-designer-indonesia/discussions) atau hubungi pemilik proyek via email.
