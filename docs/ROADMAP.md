# 🗺️ Roadmap — Menuju versi lengkap sesuai Blueprint GPP-AI

> Dokumen ini adalah ringkasan **9-bagian Blueprint GPP-AI** (Generator Perangkat Pembelajaran berbasis AI) yang menjadi visi jangka panjang aplikasi. Versi saat ini (v0.1.0) adalah **MVP** — banyak dari poin di bawah belum diimplementasikan. Kontribusi & pull request dipersilakan.
>
> Format: gunakan `- [x]` untuk selesai, `- [ ]` untuk belum. Klien / kontributor bisa membuka issue "Roadmap Tracker" di repo untuk memberi update publik.

---

## 1. Ringkasan Konsep

Satu aplikasi yang menghasilkan **perangkat ajar lengkap** — dari CP sampai lampiran — untuk **dua jalur regulasi** (Kemendikbud & Kemenag), **semua jenjang** (PAUD/RA – SMA/MA/SMK/MAK), **semua mata pelajaran** (umum, agama, mulok), dengan metode **Backward Design** yang benar (bukan sekadar "isi form lalu generate").

**Perbedaan mendasar dua jalur** (dikodekan sebagai cabang logika, bukan sekadar label):

| Aspek | Kemendikbud | Kemenag |
|---|---|---|
| Payung kurikulum | Kurikulum Merdeka (Permendikbudristek 12/2024) | Kurikulum Merdeka + KMA 1503/2025 |
| Pendekatan | Pembelajaran Mendalam (Deep Learning) | Pembelajaran Mendalam + Kurikulum Berbasis Cinta (KBC 6077/2025) |
| Nilai tambahan | Dimensi Profil Lulusan | 5 Panca Cinta + Disiplin Positif |
| Dokumen rujukan | CP per fase, ATP, Modul Ajar | CP + integrasi nilai KBC di **setiap** tahap |

---

## 2. Arsitektur Pipeline 6 Tahap

Pipeline yang ideal (target v2):

```
[UI: Wizard Input]
      ↓
[Curriculum Engine] → pilih ruleset (Kemendikbud/Kemenag) + DB CP per jenjang-mapel
      ↓
[Backward Design Pipeline — 6 tahap berurutan, tiap tahap = 1 pemanggilan Gemini]
   1. CP (Capaian Pembelajaran)      → diambil dari database, bukan digenerate bebas
   2. TP (Tujuan Pembelajaran)       → generate, divalidasi terhadap CP
   3. ATP (Alur Tujuan Pembelajaran) → generate, urutan logis TP
   4. Asesmen & Evidence              → generate DULU sebelum kegiatan (kunci UbD)
   5. Kegiatan Pembelajaran           → generate terakhir, diturunkan dari asesmen
   6. Kelengkapan                     → Modul Ajar utuh + LKPD + Bahan Ajar + Lampiran
      ↓
[Review & Edit Panel] → guru bisa edit tiap tahap sebelum lanjut
      ↓
[Export] → Google Docs / Word / PDF, siap cetak
```

**Kenapa 6 pemanggilan terpisah, bukan 1 prompt raksasa?** Karena inti Backward Design adalah urutan sebab-akibat: asesmen lahir dari TP/ATP, kegiatan lahir dari asesmen. Kalau digenerate sekaligus, Gemini cenderung menulis kegiatan dulu lalu menambal asesmen di akhir — pola paling umum di internet.

### Progress

- [x] Pipeline sederhana (single-shot fallback + Gemini) — **sudah di MVP**
- [x] Wizard 4 seksi UI (Konteks → Tujuan & Bukti → Paket → Hasil) — **sudah di MVP**
- [ ] Pipeline dipecah menjadi 6 pemanggilan terpisah dengan review antar tahap
- [ ] Structured output (JSON mode) di tiap tahap untuk mencegah drift format
- [ ] "Regenerate per tahap" tanpa harus ulangi dari awal

---

## 3. Struktur Data CP (RAG Anti-Halusinasi)

CP **tidak boleh** dikarang model — harus diambil dari database. Skema yang diusulkan:

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

- [ ] Seed data JSON Fase A (dari `d11f3684-*.xlsx`) — *sudah tersedia sebagai file, belum di-wire*
- [ ] Seed data Fase B, C, D, E, F
- [ ] Seed data mapel PAI, Bahasa Arab (Kemenag)
- [ ] Seed data mapel Mulok
- [ ] Integrasi RAG (upload sebagai knowledge file di AI Studio / vector DB terpisah)
- [ ] Validator: TP yang digenerate harus mengandung minimal 1 kata kunci dari elemen CP

---

## 4. System Instruction per Tahap

Ide inti: **satu system instruction inti** yang membawa identitas jalur (Kemendikbud/Kemenag), plus prompt tahap yang spesifik. Aturan wajib:

1. Gunakan **hanya CP dari context**, jangan mengarang CP baru
2. Jalur Kemenag: setiap TP/ATP/asesmen/kegiatan **wajib** mengintegrasikan minimal 1 dari 5 Panca Cinta **secara organik** (bukan tempelan penutup) + prinsip *mindful-meaningful-joyful* + Disiplin Positif
3. Jalur Kemendikbud: pendekatan Pembelajaran Mendalam + kaitkan Dimensi Profil Lulusan
4. Ikuti urutan Backward Design: **asesmen lahir sebelum kegiatan**
5. Output terstruktur (heading, bukan paragraf panjang)

### Progress

- [x] Instruksi Backward Design di prompt Gemini existing
- [ ] Cabang system instruction eksplisit per jalur (Kemendikbud vs Kemenag)
- [ ] Validator otomatis: apakah output Kemenag benar-benar mengintegrasikan Panca Cinta?

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

- [x] Modul Ajar (basic) — sudah di MVP
- [x] LKPD (basic) — sudah di MVP
- [x] Bahan Ajar (basic) — sudah di MVP
- [ ] Rubrik penilaian terpisah dengan format tabel
- [ ] Kisi-kisi soal
- [ ] Instrumen sikap/karakter terpisah
- [ ] Instrumen Panca Cinta (khusus Kemenag)

---

## 6. Desain UI/UX Dual-Mode

**Prinsip:**
- Wizard step-by-step (bukan form panjang sekaligus)
- Setiap tahap = 1 layar, hasil bisa diedit langsung sebelum lanjut
- Preview dokumen final mirip Word/Google Docs

**Gaya visual:**
- Palet: biru-hijau tenang (pendidikan & kepercayaan)
- Aksen mode: **Kemendikbud = biru/indigo**, **Kemenag = teal/hijau tosca** — bantu guru sadar konteks aktif
- Indikator jalur aktif selalu terlihat (**badge "Mode: Kemenag – KBC"** di header)

### Progress

- [x] Wizard 4 seksi dengan progress stepper
- [x] Landing Hero dengan pilihan jalur di seksi Konteks
- [x] **Badge Mode** di header (Kemendikbud/Kemenag) — **v0.1.0**
- [x] CSS variables dual-palette (`--mode-primary` reactive) — **v0.1.0**
- [ ] Wizard 6 tahap penuh (bukan 4)
- [ ] Preview WYSIWYG mirip Word
- [ ] Riwayat/Library modul yang pernah dibuat

---

## 7. Rekomendasi Teknis

- **Model**: Gemini untuk generate teks panjang terstruktur; aktifkan **structured output (JSON mode)** agar tiap tahap bisa diparse rapi
- **Knowledge base CP**: upload sebagai file referensi / system context per jalur-jenjang-mapel (paling menentukan validitas)
- **State management**: simpan hasil tiap tahap di state (bukan hilang saat pindah layar) → guru bisa mundur-edit-maju tanpa generate ulang

### Progress

- [x] Gemini terintegrasi via `@google/genai` v2.4
- [x] Fallback generator lokal (aplikasi tetap jalan tanpa Gemini)
- [x] State management React (edit tanpa hilang)
- [ ] JSON mode / structured output di semua tahap
- [ ] Knowledge base CP upload

---

## 8. Roadmap Bertahap

| Fase | Cakupan | Target |
|---|---|---|
| **MVP (v0.1)** ✅ | Wizard 4 seksi, dual jalur switch, fallback | Validasi alur backward design & UX dasar |
| **v0.2** | Pipeline dipecah 6 tahap, structured output | Kualitas output lebih konsisten |
| **v1.0** | Semua mapel Fase C, kedua jalur, RAG CP | Siap dipakai guru kelas 5 se-sekolah/gugus |
| **v2.0** | Ekspansi semua fase A–F | Siap dipakai lintas jenjang |
| **v3.0** | Kolaborasi antar guru, share/duplikasi, analitik | Siap disebarluaskan ke banyak sekolah |

---

## 9. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| **Halusinasi CP/regulasi** | CP sebagai data tetap (RAG), model hanya menjabarkan bukan menciptakan |
| **KBC jadi "tempelan"** bukan terintegrasi | Aturan eksplisit di system instruction + validasi manual pada contoh awal |
| Cakupan **"semua jenjang semua mapel"** terlalu besar | Roadmap bertahap: mulai Fase C sebelum ekspansi |
| **Format output tidak konsisten** antar generate | Structured output (JSON) tiap tahap, render ke template terpisah |
| **Load 6 tahap terasa lama** | Progress per tahap visual (bukan satu loading besar), izinkan edit tahap 1 sambil tahap 2 diproses |

---

## Cara Ikut Berkontribusi

1. Pilih satu checkbox `- [ ]` di atas yang menarik untuk Anda
2. Buka **Issue baru** dengan judul "Roadmap: [poin yang dipilih]"
3. Diskusikan pendekatan dengan maintainer
4. Buka Pull Request

Lihat [`CONTRIBUTING.md`](../CONTRIBUTING.md) untuk detail.

---

**Sumber**: Blueprint GPP-AI oleh klien (Google Docs, Juli 2026).
