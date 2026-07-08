# Roadmap — Menuju Versi Lengkap sesuai Blueprint

> Roadmap ini disusun bersama guru madrasah ibtidaiyah Fase C sebagai kasus penggunaan utama. Bila Anda memiliki kebutuhan berbeda (SMA, SLB, PAUD, mata pelajaran yang belum terwakili), silakan [buka issue diskusi](https://github.com/pusakamediaid-dotcom/ai-instructional-designer-indonesia/issues/new?template=feature_request.yml) — konteks Anda akan sangat membantu.

Dokumen ini adalah ringkasan sembilan bagian Blueprint GPP-AI (Generator Perangkat Pembelajaran berbasis AI) yang menjadi visi jangka panjang aplikasi. Rilis saat ini masih dalam tahap awal, banyak poin di bawah belum diimplementasikan.

> **Format estimasi effort:** S (kurang dari satu hari), M (1 hingga 3 hari), L (satu minggu), XL (dua minggu atau lebih)

**Cara pakai roadmap ini:**

- Gunakan `- [x]` untuk yang sudah selesai, `- [ ]` untuk yang belum
- Update progres publik di [Roadmap Tracker Issue #1](https://github.com/pusakamediaid-dotcom/ai-instructional-designer-indonesia/issues/1)
- Kontribusi Pull Request sangat diterima — pilih satu checkbox, buka issue, diskusikan pendekatan, buka PR

---

## 1. Ringkasan Konsep

Satu aplikasi yang menghasilkan perangkat ajar lengkap — dari Capaian Pembelajaran (CP) sampai lampiran — untuk dua jalur regulasi (Kemendikbud dan Kemenag), semua jenjang (PAUD/RA sampai SMA/MA/SMK/MAK), semua mata pelajaran (umum, agama, mulok), dengan metode Backward Design yang benar.

Perbedaan mendasar dua jalur (dikodekan sebagai cabang logika, bukan sekadar label):

| Aspek | Kemendikbud | Kemenag |
|---|---|---|
| Payung kurikulum | Kurikulum Merdeka (Permendikbudristek 12/2024) | Kurikulum Merdeka + KMA 1503/2025 |
| Pendekatan | Pembelajaran Mendalam (Deep Learning) | Pembelajaran Mendalam + Kurikulum Berbasis Cinta (KBC 6077/2025) |
| Nilai tambahan | Dimensi Profil Lulusan | Lima Panca Cinta dan Disiplin Positif |
| Dokumen rujukan | CP per fase, ATP, Modul Ajar | CP dengan integrasi nilai KBC di setiap tahap |

---

## 2. Arsitektur Pipeline Enam Tahap

Pipeline yang ideal (target rilis berikutnya):

```
[UI: Wizard Input]
      ↓
[Curriculum Engine] → pilih ruleset (Kemendikbud/Kemenag) + basis data CP
      ↓
[Backward Design Pipeline — enam tahap berurutan]
   1. CP  → diambil dari basis data, bukan digenerasi bebas
   2. TP  → digenerasi, divalidasi terhadap CP
   3. ATP → digenerasi, urutan logis Tujuan Pembelajaran
   4. Asesmen dan Evidence → digenerasi sebelum kegiatan (kunci UbD)
   5. Kegiatan Pembelajaran → digenerasi terakhir, diturunkan dari asesmen
   6. Kelengkapan → Modul Ajar utuh, LKPD, Bahan Ajar, Lampiran
      ↓
[Panel Review dan Edit] → guru bisa mengedit tiap tahap sebelum lanjut
      ↓
[Ekspor] → Google Docs, Word, PDF, siap cetak
```

Mengapa enam pemanggilan terpisah, bukan satu prompt raksasa? Karena inti Backward Design adalah urutan sebab-akibat: asesmen lahir dari TP dan ATP, kegiatan lahir dari asesmen. Bila digenerasi sekaligus, model cenderung menulis kegiatan dulu lalu menambal asesmen di akhir.

### Progress

| Effort | Item |
|---|---|
| Selesai | Pipeline sederhana (Gemini dengan mesin cadangan) |
| Selesai | Wizard empat seksi UI |
| XL | - [ ] Pipeline dipecah menjadi enam pemanggilan terpisah dengan review antar tahap |
| M | - [ ] Structured output (JSON mode) di tiap tahap |
| M | - [ ] Regenerate per tahap tanpa mengulangi dari awal |

---

## 3. Struktur Data CP (RAG Anti-Halusinasi)

CP tidak boleh dikarang oleh model, harus diambil dari basis data. Skema yang diusulkan:

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
| Selesai | Basis data JSON Fase A — 160 CP dari 17 mapel (belum terhubung ke UI) |
| L | - [ ] Basis data Fase B, C, D, E, F |
| M | - [ ] Basis data mapel PAI dan Bahasa Arab (Kemenag) |
| M | - [ ] Basis data mapel Mulok |
| XL | - [ ] Integrasi RAG (knowledge file atau vector database) |
| M | - [ ] Validator TP terhadap elemen CP |

---

## 4. System Instruction per Tahap

Satu system instruction inti yang membawa identitas jalur (Kemendikbud/Kemenag), plus prompt tahap yang spesifik. Aturan wajib:

1. Gunakan hanya CP dari context, jangan mengarang CP baru
2. Jalur Kemenag: setiap TP, ATP, asesmen, dan kegiatan wajib mengintegrasikan minimal satu dari Lima Panca Cinta secara organik, ditambah prinsip mindful-meaningful-joyful dan Disiplin Positif
3. Jalur Kemendikbud: pendekatan Pembelajaran Mendalam, kaitkan dengan Dimensi Profil Lulusan
4. Ikuti urutan Backward Design: asesmen lahir sebelum kegiatan
5. Output terstruktur (heading, bukan paragraf panjang)

### Progress

| Effort | Item |
|---|---|
| Selesai | Instruksi Backward Design di prompt Gemini existing |
| M | - [ ] Cabang system instruction eksplisit per jalur (Kemendikbud vs Kemenag) |
| L | - [ ] Validator otomatis integrasi Panca Cinta (Kemenag) |

---

## 5. Struktur Output Dokumen (target rilis lengkap)

```
Perangkat Pembelajaran [Mapel] Kelas [X] Fase [Y]
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
| Selesai | Modul Ajar (dasar) |
| Selesai | LKPD (dasar) |
| Selesai | Bahan Ajar (dasar) |
| S | - [ ] Rubrik penilaian terpisah (format tabel) |
| M | - [ ] Kisi-kisi soal |
| M | - [ ] Instrumen sikap dan karakter terpisah |
| M | - [ ] Instrumen Panca Cinta (khusus Kemenag) |

---

## 6. Desain UI/UX Dua Jalur

**Prinsip:**

- Wizard step-by-step (bukan form panjang sekaligus)
- Setiap tahap adalah satu layar, hasil bisa diedit langsung sebelum lanjut
- Preview dokumen final mirip Word atau Google Docs

**Gaya visual:**

- Palet: biru-hijau tenang
- Aksen mode: Kemendikbud biru/indigo, Kemenag teal/hijau tosca
- Indikator jalur aktif selalu terlihat (badge di header)

### Progress

| Effort | Item |
|---|---|
| Selesai | Wizard empat seksi dengan progress stepper |
| Selesai | Landing Hero |
| Selesai | Badge Mode di header (Kemendikbud/Kemenag) |
| Selesai | CSS variables dua palet (reactive via `html[data-mode]`) |
| XL | - [ ] Wizard enam tahap penuh |
| L | - [ ] Preview WYSIWYG mirip Word |
| XL | - [ ] Riwayat dan pustaka modul yang pernah dibuat |

---

## 7. Rekomendasi Teknis

- **Model:** Gemini untuk generasi teks panjang terstruktur, aktifkan structured output (JSON mode)
- **Basis pengetahuan CP:** upload sebagai file referensi atau system context per jalur-jenjang-mapel
- **State management:** simpan hasil tiap tahap di state, guru bisa mundur-maju tanpa generate ulang

### Progress

| Effort | Item |
|---|---|
| Selesai | Gemini terintegrasi via `@google/genai` v2.4 |
| Selesai | Mesin cadangan lokal |
| Selesai | State management React |
| M | - [ ] JSON mode di semua tahap |
| XL | - [ ] Basis pengetahuan CP dengan RAG |

---

## 8. Roadmap Bertahap

| Tahap | Cakupan | Target |
|---|---|---|
| Rilis Awal | Wizard empat seksi, dua jalur, mesin cadangan, dua palet | Validasi alur backward design |
| Rilis Berikutnya | Pipeline enam tahap, structured output | Kualitas output lebih konsisten |
| Ekspansi Skala Sekolah | Semua mapel Fase C, kedua jalur, RAG CP, ekspor Google Docs | Siap dipakai guru kelas 5 se-sekolah |
| Ekspansi Lintas Jenjang | Semua fase A sampai F, mapel PAI/Bahasa Arab/Mulok | Siap dipakai lintas jenjang |
| Kolaborasi Antar Sekolah | Kolaborasi guru, share/duplikasi, analitik, akun user | Siap disebarluaskan ke banyak sekolah |

---

## 9. Risiko dan Mitigasi

| Risiko | Mitigasi |
|---|---|
| Halusinasi CP atau regulasi | CP sebagai data tetap (RAG), model hanya menjabarkan bukan menciptakan |
| KBC menjadi tempelan bukan terintegrasi | Aturan eksplisit di system instruction plus validasi manual pada contoh awal |
| Cakupan "semua jenjang semua mapel" terlalu besar | Roadmap bertahap, mulai Fase C sebelum ekspansi |
| Format output tidak konsisten antar generate | Structured output (JSON) tiap tahap, render ke template terpisah |
| Load enam tahap terasa lama | Progress per tahap visual, izinkan edit tahap satu sambil tahap dua diproses |

---

## 10. Cara Sokong Proyek

Proyek ini gratis dan terbuka. Namun pengembangan berkelanjutan membutuhkan dukungan. Bila proyek ini bermanfaat untuk Anda atau sekolah Anda:

- Beri bintang di repositori — membantu naikkan visibilitas
- Laporkan bug atau usulkan fitur — kontribusi terbaik adalah umpan balik
- Kontribusi kode — lihat [`CONTRIBUTING.md`](../CONTRIBUTING.md), pilih satu poin roadmap
- Bagikan ke sesama guru — dari mulut ke mulut lebih efektif daripada iklan
- Sponsor finansial (opsional): kontak pemilik proyek untuk detail
- Sponsorship perusahaan atau sekolah — kontak untuk kesepakatan mutual benefit

Setiap dukungan (berapa pun) akan diakui di [README](../README.md#ucapan-terima-kasih) dan catatan rilis.

---

## Cara Ikut Berkontribusi

1. Pilih satu checkbox `- [ ]` di atas yang menarik untuk Anda
2. Buka issue baru dengan judul "Roadmap: [poin yang dipilih]"
3. Diskusikan pendekatan dengan pemilik proyek
4. Buka Pull Request

Detail di [`CONTRIBUTING.md`](../CONTRIBUTING.md).
