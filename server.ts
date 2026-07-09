import express from "express";
import path from "path";
import dotenv from "dotenv";
// Note: vite di-import secara dynamic di dalam startServer() supaya
// serverless bundler (mis. Vercel) tidak wajib include vite (devDep only).
// Import statement dipindah ke function scope.
import { GoogleGenAI, Type } from "@google/genai";
import {
  generateCPAnalysisFallback,
  generateTPsFallback,
  generateKKTPFallback,
  generateBigIdeaFallback,
  generateEvidenceFallback,
  generateAssessmentFallback,
  generateExperienceFallback,
  generateCompileModuleFallback,
  generateLkpdFallback,
  generateBahanAjarFallback
} from "./fallbackGenerators";

dotenv.config();

const app = express();
app.use(express.json());
export { app };

const PORT = Number(process.env.PORT) || 3000;

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Schema Definitions
const analyzeCpSchema = {
  type: Type.OBJECT,
  properties: {
    kompetensi: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "daftar kata kerja operasional kompetensi utama yang ada di CP"
    },
    lingkupMateri: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "daftar topik/konsep kunci dalam lingkup materi CP"
    },
    kedalamanMateri: {
      type: Type.STRING,
      description: "penjelasan naratif tentang kedalaman materi yang diharapkan"
    },
    indikatorKemampuan: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "daftar indikator kemampuan nyata siswa jika mencapai CP"
    },
    hubunganFase: {
      type: Type.STRING,
      description: "penjelasan tentang bagaimana materi ini menghubungkan fase saat ini dengan fase sebelum/sesudahnya"
    },
    cpRawText: {
      type: Type.STRING,
      description: "teks Capaian Pembelajaran yang dianalisis atau draf yang telah dihasilkan"
    },
    correctedMateri: {
      type: Type.STRING,
      description: "Koreksi ejaan yang baku dan benar (EYD) untuk materi/topik utama yang dimasukkan pengguna jika ada kesalahan penulisan atau singkatan."
    }
  },
  required: ["kompetensi", "lingkupMateri", "kedalamanMateri", "indikatorKemampuan", "hubunganFase", "cpRawText", "correctedMateri"]
};

const generateTpsSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING, description: "tp-1, tp-2, dll." },
      text: { type: Type.STRING, description: "Deskripsi Tujuan Pembelajaran yang jelas dan terukur." }
    },
    required: ["id", "text"]
  }
};

const generateKktpSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING, description: "sc-1, sc-2, dll." },
      tpId: { type: Type.STRING, description: "id-tp-terkait" },
      tpText: { type: Type.STRING, description: "teks TP terkait" },
      text: { type: Type.STRING, description: "Menunjukkan indikator keberhasilan yang spesifik" }
    },
    required: ["id", "tpId", "tpText", "text"]
  }
};

const generateBigIdeaSchema = {
  type: Type.OBJECT,
  properties: {
    bigIdea: { type: Type.STRING, description: "Satu kalimat konseptual yang merangkum ide besar pembelajaran." },
    essentialQuestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Pertanyaan pemantik yang kritis dan open-ended"
    }
  },
  required: ["bigIdea", "essentialQuestions"]
};

const generateEvidenceSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING, description: "ev-1, ev-2, dll." },
      title: { type: Type.STRING, description: "Judul/Bentuk Bukti (misal: Laporan Praktikum Otentik)" },
      description: { type: Type.STRING, description: "Deskripsi rinci mengenai apa yang dilakukan dan dihasilkan siswa" },
      rationale: { type: Type.STRING, description: "Alasan pedagogis mengapa bukti ini sangat sesuai untuk mengukur TP dan Success Criteria" }
    },
    required: ["id", "title", "description", "rationale"]
  }
};

const generateAssessmentSchema = {
  type: Type.OBJECT,
  properties: {
    method: { type: Type.STRING, description: "Nama Metode Asesmen" },
    description: { type: Type.STRING, description: "Instruksi pengerjaan tugas dan asesmen bagi peserta didik." },
    rubric: { type: Type.STRING, description: "Teks HTML tabel rubrik yang bersih, rapi, menggunakan standard border-collapse, berlatar belakang header abu-abu muda. WAJIB menggunakan tanda petik tunggal (') untuk atribut HTML, BUKAN tanda petik ganda, agar tidak merusak struktur JSON." },
    justification: { type: Type.STRING, description: "Alasan pedagogis pemilihan metode asesmen ini untuk mengukur bukti belajar." },
    assessmentForLearning: { type: Type.STRING, description: "Penjabaran detil Asesmen For Learning (AfL) - Formatif selama pembelajaran." },
    assessmentAsLearning: { type: Type.STRING, description: "Penjabaran detil Asesmen As Learning (AaL) - Reflektif diri / penilaian teman." },
    assessmentOfLearning: { type: Type.STRING, description: "Penjabaran detil Asesmen Of Learning (AoL) - Sumatif di akhir pembelajaran." }
  },
  required: ["method", "description", "rubric", "justification", "assessmentForLearning", "assessmentAsLearning", "assessmentOfLearning"]
};

const generateExperienceSchema = {
  type: Type.OBJECT,
  properties: {
    experience: {
      type: Type.OBJECT,
      properties: {
        kegiatanAwal: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            duration: { type: Type.STRING },
            activities: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "duration", "activities"]
        },
        memahami: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            duration: { type: Type.STRING },
            activities: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "duration", "activities"]
        },
        mengaplikasi: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            duration: { type: Type.STRING },
            activities: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "duration", "activities"]
        },
        merefleksi: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            duration: { type: Type.STRING },
            activities: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "duration", "activities"]
        },
        penutup: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            duration: { type: Type.STRING },
            activities: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "duration", "activities"]
        }
      },
      required: ["kegiatanAwal", "memahami", "mengaplikasi", "merefleksi", "penutup"]
    },
    resources: {
      type: Type.OBJECT,
      properties: {
        resources: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              type: { type: Type.STRING },
              url: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ["title", "type", "description"]
          }
        },
        justification: { type: Type.STRING }
      },
      required: ["resources", "justification"]
    },
    digitalIntegration: {
      type: Type.OBJECT,
      properties: {
        recommendations: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              tool: { type: Type.STRING },
              purpose: { type: Type.STRING },
              activityLink: { type: Type.STRING }
            },
            required: ["tool", "purpose", "activityLink"]
          }
        },
        justification: { type: Type.STRING }
      },
      required: ["recommendations", "justification"]
    },
    differentiation: {
      type: Type.OBJECT,
      properties: {
        proses: { type: Type.STRING },
        produk: { type: Type.STRING },
        dukunganBelajar: { type: Type.STRING }
      },
      required: ["proses", "produk", "dukunganBelajar"]
    }
  },
  required: ["experience", "resources", "digitalIntegration", "differentiation"]
};

const compileModuleSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Judul Modul Ajar" },
    htmlContent: { type: Type.STRING, description: "HTML dokumen yang utuh dan siap cetak" }
  },
  required: ["title", "htmlContent"]
};

const generateLkpdSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Judul LKPD" },
    htmlContent: { type: Type.STRING, description: "HTML dokumen LKPD yang utuh, terstruktur, rapi, dan siap cetak" }
  },
  required: ["title", "htmlContent"]
};

const generateBahanAjarSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Judul Bahan Ajar" },
    htmlContent: { type: Type.STRING, description: "HTML dokumen Bahan Ajar yang utuh, terstruktur, rapi, dan siap cetak" }
  },
  required: ["title", "htmlContent"]
};

// Helper to clean and sanitize JSON strings before parsing
function cleanJsonString(rawText: string): string {
  if (!rawText) return "{}";
  
  let cleaned = rawText.trim();
  
  // Remove markdown code block wrapping if present
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  cleaned = cleaned.trim();

  // Escape literal control characters inside JSON strings (ASCII 0 to 31)
  let result = '';
  let inString = false;
  let escapeNext = false;
  
  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    
    if (escapeNext) {
      result += char;
      escapeNext = false;
      continue;
    }
    
    if (char === '\\') {
      result += char;
      escapeNext = true;
      continue;
    }
    
    if (char === '"') {
      inString = !inString;
      result += char;
      continue;
    }
    
    if (inString) {
      if (char === '\n') {
        result += '\\n';
      } else if (char === '\r') {
        result += '\\r';
      } else if (char === '\t') {
        result += '\\t';
      } else {
        const code = char.charCodeAt(0);
        if (code < 32) {
          result += '\\u' + code.toString(16).padStart(4, '0');
        } else {
          result += char;
        }
      }
    } else {
      result += char;
    }
  }
  
  return result;
}

// Helper for calling Gemini
async function callGemini(systemInstruction: string, prompt: string, schema?: any) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.2,
      }
    });
    const text = response.text || "{}";
    const cleanedText = cleanJsonString(text);
    return JSON.parse(cleanedText);
  } catch (error: any) {
    console.log("[System Info] Gemini API offline or limit reached. Running local generator engine.");
    throw new Error("API Offline");
  }
}

// 1. Analyze CP
app.post("/api/design/analyze-cp", async (req, res) => {
  const { kurikulum, jenisSekolah, mataPelajaran, fase, kelas, materi, alokasiWaktu, karakteristikSiswa, catatanTambahan, cpRawText } = req.body;

  const systemInstruction = `Anda adalah AI Instructional Designer Indonesia, pakar kurikulum dan metodologi Backward Design (UbD).
Tugas Anda adalah melakukan analisis mendalam terhadap Capaian Pembelajaran (CP) berdasarkan data yang diberikan.
Jika teks CP kosong atau belum lengkap, buatlah draf Capaian Pembelajaran yang akurat, otentik, dan sesuai dengan standar kurikulum yang dipilih (${kurikulum}), Mata Pelajaran: ${mataPelajaran}, Fase: ${fase}, Kelas: ${kelas}.

Tugas Tambahan Sangat Penting: Perbaiki ejaan topik utama/materi yang diinput oleh pengguna agar menjadi ejaan yang baku, formal, dan benar sesuai dengan Pedoman Umum Ejaan Bahasa Indonesia (EYD/PUEBI). Masukkan hasilnya ke dalam kunci "correctedMateri" (misal: "sistem peredaraan darah" menjadi "Sistem Peredaran Darah", "perkalian bil bualt" menjadi "Perkalian Bilangan Bulat", dll).

Gunakan Bahasa Indonesia yang sangat formal, profesional, akademis, dan bermakna. Hindari jargon pemasaran atau penggunaan emoji.

Keluarkan hasil analisis dalam format JSON dengan kunci berikut:
{
  "kompetensi": ["daftar kata kerja operasional kompetensi utama yang ada di CP"],
  "lingkupMateri": ["daftar topik/konsep kunci dalam lingkup materi CP"],
  "kedalamanMateri": "penjelasan naratif tentang kedalaman materi yang diharapkan",
  "indikatorKemampuan": ["daftar indikator kemampuan nyata siswa jika mencapai CP"],
  "hubunganFase": "penjelasan tentang bagaimana materi ini menghubungkan fase saat ini dengan fase sebelum/sesudahnya",
  "cpRawText": "teks Capaian Pembelajaran yang dianalisis atau draf yang telah dihasilkan",
  "correctedMateri": "topik/materi yang telah diperbaiki ejaannya menjadi baku dan benar"
}`;

  const prompt = `Lakukan analisis CP untuk data berikut:
Kurikulum: ${kurikulum}
Jenis Sekolah: ${jenisSekolah}
Mata Pelajaran: ${mataPelajaran}
Fase: ${fase}
Kelas: ${kelas}
Materi Utama: ${materi}
Alokasi Waktu: ${alokasiWaktu}
Karakteristik Siswa: ${karakteristikSiswa || "Umum/Heterogen"}
Catatan Tambahan: ${catatanTambahan || "-"}
Teks CP dari Pengguna: ${cpRawText || "KOSONG (Hasilkan draf CP resmi yang akurat untuk mata pelajaran dan fase ini)"}`;

  try {
    const result = await callGemini(systemInstruction, prompt, analyzeCpSchema);
    res.json(result);
  } catch (error: any) {
    console.log("[System Info] Menggunakan generator lokal (Fase 1 - Analisis CP).");
    res.setHeader("x-reliable-fallback", "true");
    const fallback = generateCPAnalysisFallback(req.body, cpRawText);
    res.json(fallback);
  }
});

// 2. Generate TPs
app.post("/api/design/generate-tps", async (req, res) => {
  const { discovery, cpAnalysis } = req.body;

  const systemInstruction = `Anda adalah AI Instructional Designer Indonesia.
Tugas Anda adalah memecah Capaian Pembelajaran (CP) menjadi beberapa Tujuan Pembelajaran (TP) yang logis, spesifik, terukur, dan berurutan.
Gunakan kata kerja operasional yang dapat diamati (Kognitif, Psikomotor, atau Afektif sesuai konteks).
Pastikan TP yang dihasilkan tidak terlalu luas dan tidak terlalu sempit, serta berurutan dari kemampuan dasar menuju yang lebih kompleks.

Format output wajib JSON:
[
  {
    "id": "tp-1",
    "text": "Deskripsi Tujuan Pembelajaran 1 yang jelas dan terukur."
  },
  ...
]`;

  const prompt = `Hasilkan 4 sampai 6 Tujuan Pembelajaran (TP) berdasarkan analisis berikut:
Kurikulum: ${discovery.kurikulum}
Mata Pelajaran: ${discovery.mataPelajaran}
Fase: ${discovery.fase}
Kelas: ${discovery.kelas}
Materi: ${discovery.materi}
Teks CP: ${cpAnalysis.cpRawText}
Kompetensi Utama: ${JSON.stringify(cpAnalysis.kompetensi)}
Lingkup Materi: ${JSON.stringify(cpAnalysis.lingkupMateri)}`;

  try {
    const result = await callGemini(systemInstruction, prompt, generateTpsSchema);
    res.json(result);
  } catch (error: any) {
    console.log("[System Info] Menggunakan generator lokal (Fase 2 - Perumusan TP).");
    res.setHeader("x-reliable-fallback", "true");
    const fallback = generateTPsFallback(discovery, cpAnalysis);
    res.json(fallback);
  }
});

// 3. Generate Success Criteria (KKTP)
app.post("/api/design/generate-kktp", async (req, res) => {
  const { selectedTps, discovery } = req.body;

  const systemInstruction = `Anda adalah AI Instructional Designer Indonesia.
Tugas Anda adalah merumuskan Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) atau Success Criteria untuk masing-masing Tujuan Pembelajaran (TP) yang dipilih.
KKTP menjelaskan bukti spesifik dan dapat diamati tentang bagaimana peserta didik menunjukkan keberhasilannya mencapai TP tersebut.
Gunakan kata kerja operasional konkret (contoh: menjelaskan, menyusun, membandingkan, menganalisis, mendemonstrasikan).

Format output wajib JSON berupa array:
[
  {
    "id": "sc-1",
    "tpId": "id-tp-terkait",
    "tpText": "teks TP terkait",
    "text": "Menunjukkan indikator keberhasilan 1 yang spesifik"
  },
  ...
]`;

  const prompt = `Rumuskan 2 sampai 3 Kriteria Keberhasilan (KKTP) untuk masing-masing Tujuan Pembelajaran berikut:
${JSON.stringify(selectedTps)}

Mata Pelajaran: ${discovery.mataPelajaran}
Fase/Kelas: ${discovery.fase}/${discovery.kelas}
Materi: ${discovery.materi}`;

  try {
    const result = await callGemini(systemInstruction, prompt, generateKktpSchema);
    res.json(result);
  } catch (error: any) {
    console.log("[System Info] Menggunakan generator lokal (Fase 3 - Kriteria Keberhasilan / KKTP).");
    res.setHeader("x-reliable-fallback", "true");
    const fallback = generateKKTPFallback(selectedTps, discovery);
    res.json(fallback);
  }
});

// 4. Generate Big Idea & Essential Question
app.post("/api/design/generate-big-idea", async (req, res) => {
  const { selectedTps, successCriteria, discovery } = req.body;

  const systemInstruction = `Anda adalah AI Instructional Designer Indonesia.
Berdasarkan Tujuan Pembelajaran dan Success Criteria, rumuskan satu 'Big Idea' (Ide Besar) dan beberapa 'Essential Questions' (Pertanyaan Pemantik).
- Big Idea: Singkat, konseptual, tahan lama (enduring), menghubungkan materi dengan kehidupan nyata, bukan berupa definisi faktual.
- Essential Questions: Open-ended, memancing diskusi kelas, merangsang berpikir tingkat tinggi (HOTS), tidak memiliki satu jawaban benar yang sederhana.

Format output wajib JSON:
{
  "bigIdea": "Satu kalimat konseptual yang merangkum ide besar pembelajaran.",
  "essentialQuestions": [
    "Pertanyaan pemantik 1 yang kritis dan open-ended",
    "Pertanyaan pemantik 2 yang menarik"
  ]
}`;

  const prompt = `Rumuskan Big Idea dan Pertanyaan Pemantik untuk:
Mata Pelajaran: ${discovery.mataPelajaran}
Materi: ${discovery.materi}
Tujuan Pembelajaran: ${JSON.stringify(selectedTps.map((t: any) => t.text))}
Kriteria Keberhasilan (KKTP): ${JSON.stringify(successCriteria.map((s: any) => s.text))}`;

  try {
    const result = await callGemini(systemInstruction, prompt, generateBigIdeaSchema);
    res.json(result);
  } catch (error: any) {
    console.log("[System Info] Menggunakan generator lokal (Fase 4 - Pemahaman Utama / Big Idea).");
    res.setHeader("x-reliable-fallback", "true");
    const fallback = generateBigIdeaFallback(selectedTps, successCriteria, discovery);
    res.json(fallback);
  }
});

// 5. Generate Evidence
app.post("/api/design/generate-evidence", async (req, res) => {
  const { discovery, selectedTps, successCriteria, bigIdea, essentialQuestions } = req.body;

  const systemInstruction = `Anda adalah AI Instructional Designer Indonesia.
Tugas Anda adalah merancang Bukti Pembelajaran (Evidence of Learning) yang otentik, relevan, dan bermakna.
Bukti harus menunjukkan secara nyata bahwa peserta didik telah mencapai Kriteria Keberhasilan dan Tujuan Pembelajaran.
Hasilkan 2 sampai 3 pilihan bentuk Evidence (misal: proyek, unjuk kerja, portofolio, produk, poster ilmiah, demonstrasi, dll.) disertai deskripsi dan alasan pedagogis pemilihannya.

Format output wajib JSON:
[
  {
    "id": "ev-1",
    "title": "Judul/Bentuk Bukti (misal: Laporan Praktikum Otentik)",
    "description": "Deskripsi rinci mengenai apa yang dilakukan dan dihasilkan siswa",
    "rationale": "Alasan pedagogis mengapa bukti ini sangat sesuai untuk mengukur TP dan Success Criteria"
  },
  ...
]`;

  const prompt = `Rancang pilihan Bukti Pembelajaran (Evidence of Learning) untuk konteks berikut:
Mata Pelajaran: ${discovery.mataPelajaran}
Materi: ${discovery.materi}
Tujuan Pembelajaran: ${JSON.stringify(selectedTps.map((t: any) => t.text))}
Kriteria Keberhasilan: ${JSON.stringify(successCriteria.map((s: any) => s.text))}
Big Idea: ${bigIdea}
Pertanyaan Pemantik: ${JSON.stringify(essentialQuestions)}`;

  try {
    const result = await callGemini(systemInstruction, prompt, generateEvidenceSchema);
    res.json(result);
  } catch (error: any) {
    console.log("[System Info] Menggunakan generator lokal (Fase 5 - Bukti Belajar / Evidence).");
    res.setHeader("x-reliable-fallback", "true");
    const fallback = generateEvidenceFallback(discovery, selectedTps, successCriteria, bigIdea, essentialQuestions);
    res.json(fallback);
  }
});

// 6. Generate Assessment
app.post("/api/design/generate-assessment", async (req, res) => {
  const { discovery, selectedEvidence, successCriteria } = req.body;

  const systemInstruction = `Anda adalah AI Instructional Designer Indonesia.
Tugas Anda adalah merancang Asesmen yang mengukur Evidence of Learning yang dipilih secara akurat dan objektif (Authentic Assessment).
Asesmen harus selaras dengan KKTP. Hasilkan:
1. Metode Asesmen yang paling sesuai (rubrik, penilaian produk, tes kinerja, dll).
2. Deskripsi instruksi asesmen bagi siswa.
3. Rubrik Penilaian detail dalam format HTML yang elegan, rapi, terstruktur dengan baris kriteria (Kriteria) dan kolom tingkat pencapaian (Mahir, Cakap, Layak, Baru Berkembang).
4. Alasan pedagogis pemilihan teknik tersebut.
5. Penjabaran eksplisit ke dalam 3 jenis kategori asesmen standar kurikulum:
   - "assessmentForLearning": Asesmen Formatif (AfL) selama pembelajaran (misal: tanya jawab, kuis singkat, observasi keaktifan diskusi kelompok).
   - "assessmentAsLearning": Asesmen Reflektif (AaL) untuk melibatkan siswa (misal: lembar penilaian diri sendiri, penilaian antar-teman).
   - "assessmentOfLearning": Asesmen Sumatif (AoL) di akhir materi berupa unjuk kerja/produk/proyek atau tes akhir untuk mengukur hasil belajar secara kumulatif.

Format output wajib JSON:
{
  "method": "Nama Metode Asesmen (misal: Rubrik Penilaian Kinerja Proyek)",
  "description": "Instruksi pengerjaan tugas dan asesmen bagi peserta didik.",
  "rubric": "Teks HTML tabel rubrik yang bersih, rapi, menggunakan standard border-collapse, berlatar belakang header abu-abu muda, tanpa menyertakan stylesheet eksternal. Gunakan tag table, tr, th, td yang valid.",
  "justification": "Alasan pedagogis pemilihan metode asesmen ini untuk mengukur bukti belajar.",
  "assessmentForLearning": "Deskripsi aktivitas dan metode Asesmen For Learning (AfL) - Formatif secara operasional.",
  "assessmentAsLearning": "Deskripsi aktivitas dan instrumen Asesmen As Learning (AaL) - Reflektif secara operasional.",
  "assessmentOfLearning": "Deskripsi aktivitas dan kriteria Asesmen Of Learning (AoL) - Sumatif secara operasional."
}`;

  const prompt = `Rancang asesmen lengkap untuk:
Mata Pelajaran: ${discovery.mataPelajaran}
Materi: ${discovery.materi}
Bukti Pembelajaran yang Dipilih: ${JSON.stringify(selectedEvidence)}
Kriteria Keberhasilan (KKTP): ${JSON.stringify(successCriteria.map((s: any) => s.text))}`;

  try {
    const result = await callGemini(systemInstruction, prompt, generateAssessmentSchema);
    res.json(result);
  } catch (error: any) {
    console.log("[System Info] Menggunakan generator lokal (Fase 6 - Metode Asesmen).");
    res.setHeader("x-reliable-fallback", "true");
    const fallback = generateAssessmentFallback(discovery, selectedEvidence, successCriteria);
    res.json(fallback);
  }
});

// 7. Generate Experience, Resources, Integration, & Differentiation
app.post("/api/design/generate-experience", async (req, res) => {
  const { blueprint } = req.body;

  const systemInstruction = `Anda adalah AI Instructional Designer Indonesia.
Tugas Anda adalah merancang seluruh pengalaman belajar (Learning Experience) yang holistik dan bermakna agar siswa mampu menghasilkan Evidence belajar yang ditentukan.

SANGAT PENTING (ATURAN REALISME ALOKASI WAKTU):
Anda harus MENYESUAIKAN kedalaman, kompleksitas, dan kepadatan langkah-langkah kegiatan pembelajaran secara proporsional dengan Alokasi Waktu yang diberikan. Jangan menyusun aktivitas yang terlalu padat, rumit, atau tidak realistis jika alokasi waktunya singkat (misalnya hanya 2 JP x 35 Menit). Sebaliknya, jika alokasi waktu singkat, sederhanakan, fokuskan, dan padatkan langkah pembelajaran agar riil, logis, serta dapat diselesaikan tepat waktu di kelas nyata. Berikan durasi waktu yang masuk akal untuk masing-masing tahapan (Kegiatan Awal, Memahami, Mengaplikasi, Merefleksi, Penutup) sehingga total akumulasi menitnya selaras dengan total waktu dari alokasi waktu yang diinput.

Aktivitas harus dirancang berurutan menggunakan struktur berikut:
- Kegiatan Awal (Pendahuluan, Apersepsi, Pemantik kesiapan belajar)
- Memahami (Eksplorasi konsep, diskusi, investigasi terbimbing)
- Mengaplikasi (Siswa aktif bekerja memproduksi Evidence yang dipilih)
- Merefleksi (Refleksi kritis, evaluasi diri, umpan balik konstruktif)
- Penutup (Simpulan, penguatan konsep, tindak lanjut)

Selain itu, berikan rekomendasi:
1. Bahan Ajar & Sumber Belajar (Learning Resources) yang relevan dan variatif beserta justifikasinya.
2. Integrasi Teknologi Digital (Digital Integration) yang bermakna (GWS, Canva, GeoGebra, dll) beserta tujuannya.
3. Strategi Pembelajaran Berdiferensiasi (Differentiation) yang mencakup diferensiasi Proses, Produk, dan Dukungan Belajar.

ATURAN KONSISTENSI INTEGRASI TEKNOLOGI (SANGAT KRITIS):
Setiap platform atau alat teknologi digital yang Anda sebutkan di dalam bagian "digitalIntegration" (misalnya Canva, Google Docs, Geogebra, Padlet, dll) WAJIB dimasukkan secara eksplisit dan tertulis ke dalam deskripsi langkah-langkah aktivitas belajar di atas (terutama pada tahap "memahami" atau "mengaplikasi").
Misalnya: Jika Anda menyertakan "Canva" untuk membuat poster di tabel integrasi, maka pada langkah "mengaplikasi" harus tertulis instruksi eksplisit seperti: "...Siswa bekerja dalam kelompok menggunakan platform Canva untuk mendesain poster ilmiah..." sehingga terdapat kesinambungan yang utuh dan nyata antara integrasi digital dan skenario pembelajaran utama.

Format output wajib JSON:
{
  "experience": {
    "kegiatanAwal": {
      "title": "Kegiatan Awal",
      "duration": "Durasi waktu (misal: 15 Menit)",
      "activities": ["Langkah aktivitas 1", "Langkah aktivitas 2"]
    },
    "memahami": {
      "title": "Membangun Pemahaman",
      "duration": "Durasi waktu (misal: 30 Menit)",
      "activities": ["Langkah aktivitas 1", "Langkah aktivitas 2"]
    },
    "mengaplikasi": {
      "title": "Mengaplikasikan Konsep (Produksi Bukti Belajar)",
      "duration": "Durasi waktu (misal: 45 Menit)",
      "activities": ["Langkah aktivitas 1", "Langkah aktivitas 2"]
    },
    "merefleksi": {
      "title": "Refleksi Pembelajaran",
      "duration": "Durasi waktu (misal: 15 Menit)",
      "activities": ["Langkah aktivitas 1", "Langkah aktivitas 2"]
    },
    "penutup": {
      "title": "Penutup & Penguatan",
      "duration": "Durasi waktu (misal: 15 Menit)",
      "activities": ["Langkah aktivitas 1", "Langkah aktivitas 2"]
    }
  },
  "resources": {
    "resources": [
      { "title": "Nama/Judul Bahan Ajar", "type": "Buku / Video / Simulasi / dll", "url": "opsional URL", "description": "Kegunaan dalam pembelajaran" }
    ],
    "justification": "Alasan pedagogis pemilihan sumber belajar tersebut"
  },
  "digitalIntegration": {
    "recommendations": [
      { "tool": "Nama Platform (misal: Canva)", "purpose": "Tujuan integrasi secara konkret", "activityLink": "Digunakan pada tahap kegiatan apa" }
    ],
    "justification": "Alasan bagaimana alat digital meningkatkan keterlibatan atau pemahaman konsep siswa"
  },
  "differentiation": {
    "proses": "Bagaimana membedakan proses belajar untuk siswa dengan kecepatan belajar berbeda",
    "produk": "Variasi atau adaptasi produk/evidence untuk siswa",
    "dukunganBelajar": "Dukungan tambahan untuk siswa yang kesulitan dan tantangan untuk siswa berpencapaian tinggi"
  }
}`;

  const prompt = `Rancang skenario pembelajaran detail berdasarkan Blueprint UbD berikut:
Mata Pelajaran: ${blueprint.discovery.mataPelajaran}
Materi: ${blueprint.discovery.materi}
Model Pembelajaran: ${blueprint.modelPembelajaran}
Strategi: ${blueprint.strategiPembelajaran}
Alokasi Waktu: ${blueprint.discovery.alokasiWaktu}
Tujuan Pembelajaran: ${JSON.stringify(blueprint.tps.filter((t: any) => t.selected).map((t: any) => t.text))}
KKTP / Kriteria Keberhasilan: ${JSON.stringify(blueprint.successCriteria.filter((s: any) => s.selected).map((s: any) => s.text))}
Bukti Belajar (Evidence): ${JSON.stringify(blueprint.evidence.filter((e: any) => e.selected).map((e: any) => e.title))}
Asesmen: ${blueprint.assessment.method} - ${blueprint.assessment.description}`;

  try {
    const result = await callGemini(systemInstruction, prompt, generateExperienceSchema);
    res.json(result);
  } catch (error: any) {
    console.log("[System Info] Menggunakan generator lokal (Fase 7 - Skenario Aktivitas Pembelajaran).");
    res.setHeader("x-reliable-fallback", "true");
    const fallback = generateExperienceFallback(blueprint);
    res.json(fallback);
  }
});

// 8. Compile Modul Ajar
app.post("/api/design/compile-module", async (req, res) => {
  const { blueprint, experience, resources, digitalIntegration, differentiation } = req.body;

  const systemInstruction = `Anda adalah AI Instructional Designer Indonesia, pakar penyusun dokumen Modul Ajar kurikulum nasional resmi dan profesional.
Tugas Anda adalah merangkai seluruh rancangan pembelajaran (Blueprint UbD, Pengalaman Belajar, Asesmen, dll) menjadi satu kesatuan dokumen "Modul Ajar" yang lengkap, formal, akademis, dan siap pakai.

SANGAT PENTING DAN MUTLAK (STRICTLY FORBIDDEN):
Anda DILARANG KERAS mencantumkan kalimat-kalimat petunjuk pengisian, teks penjelasan template, instruksi/keterangan pembantu, atau catatan panduan dari template kosong (seperti "Identifikasi kesiapan peserta didik sebelum belajar...", "Tuliskan analisis materi pelajaran...", "Pilihlah dimensi profil lulusan...", "Merupakan pernyataan yang merumuskan kompetensi...", "tuliskan prinsip pembelajaran...", "Pembuka dari proses pembelajaran...", "Pada tahap ini, siswa aktif terlibat...", "Tahap akhir dalam proses pembelajaran...", "Asesmen dalam pembelajaran mendalam disesuaikan...", dll).
Dokumen hasil jadi harus berisi MURNI data isi pembelajaran konkret saja, tanpa ada teks instruksi/penjelasan panduan template di dalam sel-sel tabel atau di bawah label.

PENTING: Dokumen Anda harus mengikuti struktur tata letak (layout) dan komponen tabel yang presisi sesuai template resmi berikut secara konsisten:

1. JUDUL / HEADER:
   - Judul terpusat (center): "MODUL AJAR"
   - Di bawah judul, tampilkan label: "MATA PELAJARAN : [Mata Pelajaran]"
   - Di bawah mata pelajaran, tampilkan label: "BAB/TEMA : [Bab / Lingkup Materi]"

2. TABEL 1: "IDENTITAS MODUL" (Tabel 3 kolom: Label, tanda titik dua ":", dan Nilai):
   - Kolom 1: Nama Sekolah, Nama Penyusun, Topik, Kelas / Fase / Semester, Alokasi Waktu, Tahun Pelajaran (2025 / 2026).
   - Seluruh baris memiliki garis pembatas (border) tipis. Header tabel berwarna latar biru muda (misal #bfdbfe) bertuliskan "IDENTITAS MODUL".

3. TABEL 2: "IDENTIFIKASI" (Tabel dengan kolom kiri rowspan="3" bertuliskan "Identifikasi" di tengah):
   - Baris 1: "Peserta Didik" berisi MURNI deskripsi karakteristik, minat, dan kesiapan peserta didik (TANPA kalimat penjelasan template).
   - Baris 2: "Materi Pelajaran" berisi MURNI analisis materi, jenis pengetahuan, tingkat kesulitan, relevansi dunia nyata, dan integrasi nilai karakter (TANPA kalimat penjelasan template).
   - Baris 3: "Dimensi Profil Lulusan" menampilkan daftar 8 dimensi berikut dengan format kotak centang ☑ (jika dipilih) atau ☐ (jika tidak dipilih) secara teratur dalam 2 kolom:
     1. Keimanan dan Ketekwaan terhadap Tuhan YME
     2. Kewargaan
     3. Penalaran Kritis
     4. Kreativitas
     5. Kolaborasi
     6. Kemandirian
     7. Kesehatan
     8. Komunikasi

4. TABEL 3: "DESAIN PEMBELAJARAN" (Tabel dengan kolom kiri rowspan="8" bertuliskan "Desain Pembelajaran" di tengah):
   - Baris 1: "Capaian Pembelajaran" berisi teks lengkap CP (TANPA kalimat penjelasan template).
   - Baris 2: "Lintas Disiplin Ilmu" berisi bidang ilmu yang diintegrasikan (TANPA kalimat penjelasan template).
   - Baris 3: "Tujuan Pembelajaran" merumuskan kompetensi, subjek, kondisi, dan indikator, dilampirkan pula daftar Kriteria Ketercapaian (KKTP / Success Criteria) (TANPA kalimat penjelasan template).
   - Baris 4: "Topik Pembelajaran" berisi topik yang relevan (TANPA kalimat penjelasan template).
   - Baris 5: "Praktik Pedagogis" berisi Model, Strategi, dan Metode Pembelajaran (misal PBL, PjBL, dll) (TANPA kalimat penjelasan template).
   - Baris 6: "Kemitraan Pembelajaran" berisi mitra kolaborasi siswa (guru lain, orang tua, teman sejawat, dll) (TANPA kalimat penjelasan template).
   - Baris 7: "Lingkungan Pembelajaran" menguraikan ruang fisik, virtual, dan budaya belajar (TANPA kalimat penjelasan template).
   - Baris 8: "Pemanfaatan Digital" menguraikan pemanfaatan teknologi digital interaktif (TANPA kalimat penjelasan template).

5. TABEL 4: "PENGALAMAN BELAJAR" (Tabel dengan Header "Langkah-Langkah Pembelajaran" berlatar belakang biru muda, serta kolom kiri rowspan="3" bertuliskan "Pengalaman Belajar" di tengah):
   - Baris 1: "AWAL" berisi detail kegiatan pendahuluan, orientasi, apersepsi, dan motivasi (TANPA kalimat penjelasan template).
   - Baris 2: "INTI" berisi 3 sub-tahap eksplisit terstruktur berikut beserta kegiatan detail siswa (TANPA kalimat penjelasan template):
     - "Memahami"
     - "Mengaplikasi"
     - "Merefleksi"
   - Baris 3: "PENUTUP" berisi kesimpulan, penguatan, umpan balik konstruktif, dan refleksi akhir (TANPA kalimat penjelasan template).

6. TABEL 5: "ASESMEN PEMBELAJARAN" (Tabel dengan kolom kiri rowspan="3" bertuliskan "Asesmen Pembelajaran" di tengah):
   - Baris 1: "Asesmen pada Awal Pembelajaran" (Apersepsi / Diagnostik awal) (TANPA kalimat penjelasan template).
   - Baris 2: "Asesmen pada Proses Pembelajaran" (Formatif: Assessment for Learning dan Assessment as Learning) (TANPA kalimat penjelasan template).
   - Baris 3: "Asesmen pada Akhir Pembelajaran" (Sumatif: Assessment of Learning, disertai penyajian tabel Rubrik Penilaian detail yang rapi dan elegan) (TANPA kalimat penjelasan template).

7. TABEL 6: "MEDIA & SUMBER BELAJAR" (Tabel dengan kolom kiri rowspan="2" bertuliskan "Media & Sumber Belajar"):
   - Baris 1: "Bahan & Sumber Belajar" mendaftar seluruh buku teks, video, artikel, atau LKPD pendukung (TANPA kalimat penjelasan template).
   - Baris 2: "Strategi Diferensiasi" memuat diferensiasi Proses, Produk, dan Dukungan Belajar secara komprehensif (TANPA kalimat penjelasan template).

8. TANDA TANGAN (SIGNATURES):
   - Letakkan di bagian bawah berupa tabel 2 kolom tanpa border: "Mengetahui, Kepala Sekolah" di kiri, dan "Jakarta, [Tanggal], Guru Mata Pelajaran" di kanan, dengan nama Guru yang diinput ditulis tebal (bold).

Keluarannya harus berupa JSON berisi judul modul dan HTML lengkap (tanpa markdown wrapper \`\`\`html) dengan gaya yang sangat profesional:
- Gunakan styling internal (<style>) yang rapi dan elegan seperti Cambria, Aptos, Calibri, atau Times New Roman.
- Pastikan tabel memiliki border-collapse, garis border tipis warna #cbd5e1, dan padding sel yang nyaman (padding: 10px atau 12px).
- JANGAN gunakan "text-align: justify" atau "text-justify" pada elemen HTML karena merusak spasi kata dan menyebabkan tumpang-tindih pada render PDF (gunakan default "text-align: left" atau perataan kiri biasa).
- Hilangkan teks referensi AI seperti "Generated by AI" atau nama platform. Dokumen harus murni hasil desain instruksional guru yang profesional.

Format output wajib JSON:
{
  "title": "Judul Modul Ajar (misal: Modul Ajar IPA Fase D - Sel dan Fungsinya)",
  "htmlContent": "HTML dokumen yang utuh dan siap cetak"
}`;

  const prompt = `Susunlah dokumen Modul Ajar utuh berdasarkan seluruh blueprint dan data berikut:
Data Discovery & CP: ${JSON.stringify(blueprint.discovery)} | ${JSON.stringify(blueprint.cpAnalysis)}
Tujuan Pembelajaran (Selected): ${JSON.stringify(blueprint.tps.filter((t: any) => t.selected))}
Kriteria Keberhasilan (Selected): ${JSON.stringify(blueprint.successCriteria.filter((s: any) => s.selected))}
Ide Besar & Pemantik: ${JSON.stringify(blueprint.bigIdea)}
Evidence (Selected): ${JSON.stringify(blueprint.evidence.filter((e: any) => e.selected))}
Asesmen & Rubrik: ${JSON.stringify(blueprint.assessment)}
Langkah Pengalaman Belajar: ${JSON.stringify(experience)}
Sumber Belajar: ${JSON.stringify(resources)}
Integrasi Digital: ${JSON.stringify(digitalIntegration)}
Diferensiasi: ${JSON.stringify(differentiation)}
Model & Strategi: ${blueprint.modelPembelajaran} | ${blueprint.strategiPembelajaran}`;

  try {
    const result = await callGemini(systemInstruction, prompt, compileModuleSchema);
    res.json(result);
  } catch (error: any) {
    console.log("[System Info] Menggunakan compiler lokal (Fase 8 - Dokumen Modul Ajar Utuh).");
    res.setHeader("x-reliable-fallback", "true");
    const fallback = generateCompileModuleFallback(blueprint, experience, resources, digitalIntegration, differentiation);
    res.json(fallback);
  }
});

// 9. Generate Lembar Kerja Peserta Didik (LKPD)
app.post("/api/design/generate-lkpd", async (req, res) => {
  const { blueprint, experience } = req.body;

  const systemInstruction = `Anda adalah AI Instructional Designer Indonesia, pakar penyusun Lembar Kerja Peserta Didik (LKPD) yang menarik, interaktif, dan terstruktur sesuai kurikulum nasional resmi.
Tugas Anda adalah menyusun LKPD yang berpusat pada siswa, memicu kolaborasi kelompok, dan memandu siswa melakukan penyelidikan berdasarkan Blueprint Modul Ajar yang diberikan.

Dokumen LKPD harus memiliki bagian-bagian berikut:
1. IDENTITAS KELOMPOK: Berupa tabel rapi berisi kolom Nama Kelompok, Anggota Kelompok (1, 2, 3, 4), Kelas, Mata Pelajaran, Topik, Alokasi Waktu.
2. TUJUAN PEMBELAJARAN (LKPD): Jabarkan kompetensi utama yang ingin dicapai melalui aktivitas ini.
3. PETUNJUK PENGERJAAN: Langkah panduan operasional bagi siswa saat mengerjakan LKPD ini.
4. PENGANTAR KONSEP / LANDASAN TEORI: Narasi pengantar yang bermakna dan memotivasi siswa (menghubungkan dengan Ide Besar).
5. LANGKAH PENYELIDIKAN KELOMPOK: Panduan pengerjaan kelompok terstruktur (misal berfokus pada evidence unjuk kerja terpilih).
6. LEMBAR JAWABAN & PERTANYAAN DISKUSI: Minimal 3 pertanyaan HOTS (analitis, kritis, dan solutif) lengkap dengan kotak / kolom kosong (<div style="border: 1px solid #cbd5e1; border-radius: 4px; height: 100px; margin-top: 6px;">) sebagai tempat siswa menuliskan jawaban mereka secara langsung.
7. KESIMPULAN BELAJAR: Ruang bagi siswa menarik kesimpulan akhir mereka sendiri.
8. REFLEKSI DIRI MANDIRI: Daftar ceklis atau isian pendek reflektif diri.

Keluarannya harus berupa JSON berisi judul LKPD dan HTML lengkap (tanpa markdown wrapper \`\`\`html) dengan gaya yang profesional:
- Gunakan styling internal (<style>) yang meniru halaman dokumen A4 dengan batas margin yang jelas (misal: padding halaman, font Serif/Sans yang elegan seperti Cambria atau Aptos).
- Terapkan layout tabel yang sangat rapi untuk identitas kelompok (menggunakan border tipis, warna latar header abu-abu muda, padding sel yang nyaman).
- JANGAN gunakan "text-align: justify" atau "text-justify" pada elemen HTML atau dalam CSS karena merusak spasi kata dan menyebabkan tumpang-tindih pada render PDF (gunakan default "text-align: left" atau perataan kiri biasa).
- Hilangkan teks referensi AI seperti "Generated by AI" atau nama platform. Dokumen harus murni hasil desain instruksional guru yang profesional.

Format output wajib JSON:
{
  "title": "Judul LKPD (misal: LKPD Struktur dan Fungsi Sel - Kelas VII)",
  "htmlContent": "HTML dokumen LKPD yang utuh dan siap cetak"
}`;

  const prompt = `Susunlah LKPD berdasarkan data rancangan pembelajaran ini:
Data Discovery & CP: ${JSON.stringify(blueprint?.discovery)}
Tujuan Pembelajaran: ${JSON.stringify(blueprint?.tps?.filter((t: any) => t.selected))}
Kriteria Keberhasilan: ${JSON.stringify(blueprint?.successCriteria?.filter((s: any) => s.selected))}
Ide Besar: ${blueprint?.bigIdea?.bigIdea}
Aktivitas Terkait: ${JSON.stringify(experience?.mengaplikasi)}`;

  try {
    const result = await callGemini(systemInstruction, prompt, generateLkpdSchema);
    res.json(result);
  } catch (error: any) {
    console.log("[System Info] Menggunakan generator LKPD lokal.");
    res.setHeader("x-reliable-fallback", "true");
    const fallback = generateLkpdFallback(blueprint, experience);
    res.json(fallback);
  }
});

// 10. Generate Bahan Ajar
app.post("/api/design/generate-bahan-ajar", async (req, res) => {
  const { blueprint } = req.body;

  const systemInstruction = `Anda adalah AI Instructional Designer Indonesia, pakar penyusun Bahan Ajar (Buku Pendamping / Handout Belajar) mandiri siswa yang komprehensif, bermakna, dan mudah dipahami sesuai kurikulum nasional resmi.
Tugas Anda adalah merancang bahan bacaan/materi ajar untuk membekali siswa dengan konsep dasar teoretis, keterkaitan dunia nyata, serta rangkuman esensial berdasarkan Blueprint Modul Ajar yang diberikan.

Bahan Ajar harus memiliki bagian-bagian berikut:
1. IDENTITAS BAHAN AJAR: Berupa tabel rapi berisi Mata Pelajaran, Topik Utama, Fase/Kelas, Penyusun.
2. PENDAHULUAN: Kalimat motivasi relevan dengan kehidupan sehari-hari (menghubungkan dengan Ide Besar / Big Idea).
3. TARGET KOMPETENSI: Tujuan pembelajaran yang ingin dicapai setelah membaca bahan ajar ini.
4. URAIAN MATERI INTI: Penjelasan konsep yang mendalam, sistematis, ramah anak, serta kaya dengan analogi kehidupan nyata, dibagi menjadi beberapa sub-topik terstruktur.
5. RANGKUMAN MATERI: Rangkuman poin-poin penting dalam bentuk bullet list yang mudah dihafal.
6. CEK PEMAHAMAN MANDIRI: Pertanyaan tantangan singkat/kuis untuk menguji pemahaman siswa setelah membaca materi secara mandiri.
7. GLOSARIUM & DAFTAR PUSTAKA: Glosarium kata-kata ilmiah/sulit dan sumber rujukan resmi.

Keluarannya harus berupa JSON berisi judul Bahan Ajar dan HTML lengkap (tanpa markdown wrapper \`\`\`html) dengan gaya yang profesional:
- Gunakan styling internal (<style>) yang meniru halaman dokumen A4 dengan batas margin yang jelas (misal: padding halaman, font Serif/Sans yang elegan seperti Cambria atau Aptos).
- Terapkan layout tabel yang sangat rapi (menggunakan border tipis, warna latar header abu-abu muda, padding sel yang nyaman).
- JANGAN gunakan "text-align: justify" atau "text-justify" pada elemen HTML atau dalam CSS karena merusak spasi kata dan menyebabkan tumpang-tindih pada render PDF (gunakan default "text-align: left" atau perataan kiri biasa).
- Hilangkan teks referensi AI seperti "Generated by AI" atau nama platform. Dokumen harus murni hasil desain instruksional guru yang profesional.

Format output wajib JSON:
{
  "title": "Judul Bahan Ajar (misal: Bahan Ajar Mandiri Sel dan Kehidupan - Kelas VII)",
  "htmlContent": "HTML dokumen Bahan Ajar yang utuh dan siap cetak"
}`;

  const prompt = `Susunlah Bahan Ajar Mandiri berdasarkan data rancangan pembelajaran ini:
Data Discovery & CP: ${JSON.stringify(blueprint?.discovery)}
Tujuan Pembelajaran: ${JSON.stringify(blueprint?.tps?.filter((t: any) => t.selected))}
Kriteria Keberhasilan: ${JSON.stringify(blueprint?.successCriteria?.filter((s: any) => s.selected))}
Ide Besar: ${blueprint?.bigIdea?.bigIdea}`;

  try {
    const result = await callGemini(systemInstruction, prompt, generateBahanAjarSchema);
    res.json(result);
  } catch (error: any) {
    console.log("[System Info] Menggunakan generator Bahan Ajar lokal.");
    res.setHeader("x-reliable-fallback", "true");
    const fallback = generateBahanAjarFallback(blueprint);
    res.json(fallback);
  }
});

// Vite & Static file serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}
