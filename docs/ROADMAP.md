# 📅 Roadmap — Menuju versi lengkap sesuai Blueprint GPP-AI

> 🙏 **Roadmap ini disusun bersama guru MI Fase C** sebagai kasus penggunaan utama. Kalau Anda punya use case berbeda (SMA, SLB, PAUD, mapel yang belum terwakili), silakan [buka issue diskusi](https://github.com/pusakamediaid-dotcom/ai-instructional-designer-indonesia/issues/new?template=feature_request.yml) — kami senang dengar konteks Anda.

Dokumen ini adalah ringkasan **9-bagian Blueprint GPP-AI** (Generator Perangkat Pembelajaran berbasis AI) yang menjadi visi jangka panjang aplikasi. Versi saat ini (v0.1.0) adalah **MVP** — banyak poin di bawah belum diimplementasikan.

> **Format effort estimate:** S = &lt;1 hari · M = 1–3 hari · L = 1 minggu · XL = 2+ minggu

**Cara pakai roadmap ini:**
- Gunakan `- [x]` untuk selesai, `- [ ]` untuk belum
- Update progress publik di [Roadmap Tracker Issue #1](https://github.com/pusakamediaid-dotcom/ai-instructional-designer-indonesia/issues/1)
- Kontribusi PR sangat diterima — pilih 1 checkbox, buka issue, diskusikan pendekatan, buka PR

---

## 1. Ringkasan Konsep

Satu aplikasi yang menghasilkan **perangkat ajar lengkap** — dari CP sampai lampiran — untuk **dua jalur regulasi** (Kemendikbud &amp; Kemenag), **semua jenjang** (PAUD/RA – SMA/MA/SMK/MAK), **semua mata pelajaran** (umum, agama, mulok), dengan metode **Backward Design** yang benar.

**Perbedaan mendasar dua jalur** (dikodekan sebagai cabang logika, bukan sekadar label):

| Aspek | Kemendikbud | Kemenag |
|---|---|---|
| Payung kurikulum | Kurikulum Merdeka (Permendikbudristek 12/2024) | Kurikulum Merdeka + KMA 1503/2025 |
| Pendekatan | Pembelajaran Mendalam (Deep Learning) | Pembelajaran Mendalam + Kurikulum Berbasis Cinta (KBC 6077/2025) |
| Nilai tambahan | Dimensi Profil Lulusan | 5 Panca Cinta + Disiplin Positif |
| Dokumen rujukan | CP per fase, ATP, Modul Ajar | CP + integrasi nilai KBC di **setiap** tahap |

---

## 2. Arsitektur Pipeline 6 Tahap

Pipeline yang ideal (target v0.2–v1.0):

```
[UI: Wizard Input]
      ↓
[Curriculum Engine] → pilih ruleset (Kemendikbud/Kemenag) + DB CP
      ↓
[Backward Design Pipeline — 6 tahap berurutan]
   1. CP  → diambil dari database, bukan digenerate bebas
   2. TP  → generate, divalidasi terhadap CP
   3. ATP → generate, urutan logis TP
   4. Asesmen & Evidence  → generate DULU sebelum kegiatan (kunci UbD)
   5. Kegiatan Pembelajaran → generate terakhir, diturunkan dari asesmen
   6. Kelengkapan → Modul Ajar utuh + LKPD + Bahan Ajar + Lampiran
      ↓
[Review & Edit Panel] → guru bisa edit tiap tahap sebelum lanjut
      ↓
[Export] → Google Docs / Word / PDF, siap cetak
```

**Kenapa 6 pemanggilan terpisah?** Inti Backward Design adalah urutan sebab-akibat: asesmen lahir dari TP/ATP, kegiatan lahir dari asesmen. Kalau digenerate sekaligus, Gemini cenderung menulis kegiatan dulu lalu menambal asesmen di akhir.

### Progress

| Effort | Item |
|---|---|
| ✅ | Pipeline sederhana (Gemini + fallback) — MVP |
| ✅ | Wizard 4 seksi UI — MVP |
| **XL** | - [ ] Pipeline dipecah menjadi 6 pemanggilan terpisah dengan review antar tahap |
| **M**  | - [ ] Structured output (JSON mode) di tiap tahap |
| **M**  | - [ ] "Regenerate per tahap" tanpa harus ulangi dari awal |

---

## 3. Struktur Data CP (RAG Anti-Halusinasi)

CP **tidak boleh** dikarang model — harus diambil dari database. Skema:

```json
{
  "jalur": "kemendikbud | kemenag",
  "jenjang": "SD/MI | SMP/MTs | SMA/MA | SMK/MAK",
  "fase": "A | B | C | D | E | F",
  "kelas": [5],
  "mapel": "Bahasa Indonesia",
  "kategori_mapel": "umum | agama | mulok",
  "elemen_cp": [
    { "nama": "Menyimak", "deskripsi": "..." },
    { "nama": "Membaca", "deskripsi": "..." }
  ],
  "nilai_tambahan": {
    "kemendikbud": "dimensi_profil_lulusan: [bernalar kritis, ...]",
    "kemenag": "panca_cinta: [cinta ilmu, cinta sesama, ...]"
  }
}
```

### Progress

| Effort | Item |
|---|---|
| ✅ | Seed data JSON Fase A — 160 CP dari 17 mapel (belum di-wire ke UI) |
| **L**  | - [ ] Seed data Fase B, C, D, E, F |
| **M**  | - [ ] Seed data mapel PAI, Bahasa Arab (Kemenag) |
| **M**  | - [ ] Seed data mapel Mulok |
| **XL** | - [ ] Integrasi RAG (knowledge file / vector DB) |
| **M**  | - [ ] Validator TP terhadap elemen CP |

---

## 4. System Instruction per Tahap

**Satu system instruction inti** yang membawa identitas jalur (Kemendikbud/Kemenag), plus prompt tahap yang spesifik. Aturan wajib:

1. Gunakan **hanya CP dari context**, jangan mengarang CP baru
2. Jalur Kemenag: setiap TP/ATP/asesmen/kegiatan **wajib** mengintegrasikan minimal 1 dari 5 Panca Cinta **secara organik** + prinsip *mindful-meaningful-joyful* + Disiplin Positif
3. Jalur Kemendikbud: pendekatan Pembelajaran Mendalam + kaitkan Dimensi Profil Lulusan
4. Ikuti urutan Backward Design: **asesmen lahir sebelum kegiatan**
5. Output terstruktur (heading, bukan paragraf panjang)

### Progress

| Effort | Item |
|---|---|
| ✅ | Instruksi Backward Design di prompt Gemini existing |
| **M**  | - [ ] Cabang system instruction eksplisit per jalur (Kemendikbud vs Kemenag) |
| **L**  | - [ ] Validator otomatis integrasi Panca Cinta (Kemenag) |

---

## 5. Struktur Output Dokumen (target v1)

```
📁 Perangkat Pembelajaran [Mapel] Kelas [X] Fase [Y]
 ├── 1. Modul Ajar (CP → TP → ATP → Asesmen → Kegiatan)
 ├── 2. LKPD
 ├── 3. Bahan Ajar
 └── 4. Lampiran
      ├── Rubrik Penilaian
      ├── Kisi-kisi Soal
      ├── Instrumen Sikap/Karakter
      └── (Kemenag) Instrumen Panca Cinta
```

### Progress

| Effort | Item |
|---|---|
| ✅ | Modul Ajar (basic) |
| ✅ | LKPD (basic) |
| ✅ | Bahan Ajar (basic) |
| **S** | - [ ] Rubrik penilaian terpisah (format tabel) |
| **M** | - [ ] Kisi-kisi soal |
| **M** | - [ ] Instrumen sikap/karakter terpisah |
| **M** | - [ ] Instrumen Panca Cinta (khusus Kemenag) |

---

## 6. Desain UI/UX Dual-Mode

**Prinsip:**
- Wizard step-by-step (bukan form panjang sekaligus)
- Setiap tahap = 1 layar, hasil bisa diedit langsung sebelum lanjut
- Preview dokumen final mirip Word/Google Docs

**Gaya visual:**
- Palet: biru-hijau tenang
- Aksen mode: **Kemendikbud = biru/indigo**, **Kemenag = teal/hijau tosca**
- Indikator jalur aktif selalu terlihat (badge "Mode: Kemenag – KBC" di header)

### Progress

| Effort | Item |
|---|---|
| ✅ | Wizard 4 seksi dengan progress stepper |
| ✅ | Landing Hero |
| ✅ | Badge Mode di header (Kemendikbud/Kemenag) |
| ✅ | CSS variables dual-palette (`--mode-primary` reactive via `data-mode`) |
| **XL** | - [ ] Wizard 6 tahap penuh (bukan 4) |
| **L**  | - [ ] Preview WYSIWYG mirip Word |
| **XL** | - [ ] Riwayat/Library modul yang pernah dibuat |

---

## 7. Rekomendasi Teknis

- **Model**: Gemini untuk generate teks panjang terstruktur; aktifkan **structured output (JSON mode)**
- **Knowledge base CP**: upload sebagai file referensi / system context per jalur-jenjang-mapel
- **State management**: simpan hasil tiap tahap di state (guru bisa mundur-edit-maju tanpa generate ulang)

### Progress

| Effort | Item |
|---|---|
| ✅ | Gemini terintegrasi via `@google/genai` v2.4 |
| ✅ | Fallback generator lokal |
| ✅ | State management React |
| **M**  | - [ ] JSON mode / structured output di semua tahap |
| **XL** | - [ ] Knowledge base CP upload / RAG |

---

## 8. Roadmap Bertahap

| Fase | Cakupan | Target | Effort Total |
|---|---|---|---|
| **MVP (v0.1)** ✅ | Wizard 4 seksi, dual jalur switch, fallback, dual-palette | Validasi alur backward design | Selesai |
| **v0.2** | Pipeline dipecah 6 tahap, structured output, JSON mode | Kualitas output lebih konsisten | XL (~2 minggu) |
| **v1.0** | Semua mapel Fase C, kedua jalur, RAG CP, ekspor Google Docs | Siap dipakai guru kelas 5 se-sekolah/gugus | XL (~4 minggu) |
| **v2.0** | Ekspansi semua fase A–F, mapel PAI/Bahasa Arab/Mulok | Siap dipakai lintas jenjang | XL (~6 minggu) |
| **v3.0** | Kolaborasi antar guru, share/duplikasi, analitik, akun user | Siap disebarluaskan ke banyak sekolah | XL+ (~8 minggu) |

---

## 9. Risiko &amp; Mitigasi

| Risiko | Mitigasi |
|---|---|
| **Halusinasi CP/regulasi** | CP sebagai data tetap (RAG), model hanya menjabarkan bukan menciptakan |
| **KBC jadi "tempelan"** bukan terintegrasi | Aturan eksplisit di system instruction + validasi manual pada contoh awal |
| Cakupan **"semua jenjang semua mapel"** terlalu besar | Roadmap bertahap: mulai Fase C sebelum ekspansi |
| **Format output tidak konsisten** antar generate | Structured output (JSON) tiap tahap, render ke template terpisah |
| **Load 6 tahap terasa lama** | Progress per tahap visual, izinkan edit tahap 1 sambil tahap 2 diproses |

---

## 10. Cara Sponsor / Sokong Proyek

Proyek ini **gratis &amp; open source** — dibuat sebagai kontribusi untuk pendidikan Indonesia. Namun pengembangan berkelanjutan butuh dukungan. Kalau proyek ini bermanfaat untuk Anda / sekolah Anda:

- ⭐ **Star repo ini** di GitHub — bantu naikkan visibilitas gratis
- 🐛 **Report bug / usulkan fitur** — kontribusi terbaik adalah feedback
- 💻 **Kontribusi kode** — lihat [`CONTRIBUTING.md`](../CONTRIBUTING.md), pilih 1 poin roadmap
- 📢 **Bagikan ke sesama guru** — dari mulut ke mulut lebih efektif dari iklan
- ☕ **Sponsor finansial** (opsional):
  - Trakteer: `<URL_TRAKTEER_DIISI_SETELAH_DAFTAR>`
  - Saweria: `<URL_SAWERIA_DIISI_SETELAH_DAFTAR>`
  - Bank transfer / DANA / OVO: kontak email `pusaka.media.id@gmail.com`
- 🏢 **Sponsorship perusahaan / sekolah** — kalau institusi Anda ingin sponsor development, kontak kami untuk kesepakatan mutual benefit (logo di README, prioritas fitur, dsb).

Setiap donasi (berapa pun) akan diakui di [README](../README.md#-ucapan-terima-kasih) &amp; catatan rilis. 🙏

---

## Cara Ikut Berkontribusi

1. Pilih satu checkbox `- [ ]` di atas yang menarik untuk Anda
2. Buka **Issue baru** dengan judul "Roadmap: [poin yang dipilih]"
3. Diskusikan pendekatan dengan maintainer
4. Buka Pull Request

Detail di [`CONTRIBUTING.md`](../CONTRIBUTING.md).

---

**Sumber:** Blueprint GPP-AI oleh klien (Google Docs, Juli 2026).
