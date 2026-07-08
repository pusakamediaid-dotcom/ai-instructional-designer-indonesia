export function generateCPAnalysisFallback(discovery: any, cpRawText: string) {
  const d = discovery || {};
  const materi = d.materi || "Materi";
  const mapel = d.mataPelajaran || "Mata Pelajaran";
  const fase = d.fase || "D";
  const kelas = d.kelas || "VII";

  const defaultCP = cpRawText || `Pada akhir Fase ${fase}, peserta didik memiliki kemampuan untuk menganalisis, menyelidiki, dan memahami konsep-konsep kunci terkait ${materi} dalam mata pelajaran ${mapel}. Peserta didik dapat menggunakan keterampilan proses sains/akademis untuk memecahkan masalah kehidupan sehari-hari, berkolaborasi dalam tim, serta mengomunikasikan hasil penyelidikan mereka secara logis dan terstruktur.`;

  return {
    kompetensi: ["Menganalisis", "Menyelidiki", "Memahami", "Mengidentifikasi", "Mengomunikasikan"],
    lingkupMateri: [materi, `Konsep Dasar ${materi}`, `Aplikasi Praktis ${materi}`],
    kedalamanMateri: `Materi ${materi} pada Fase ${fase} Kelas ${kelas} dibahas secara mendalam melalui pendekatan inkuiri dan kontekstual. Siswa diarahkan untuk memahami struktur, fungsi, hubungan kausal, serta implikasi praktis materi ini dalam kehidupan sehari-hari melalui penyelidikan aktif, bukan sekadar hafalan faktual.`,
    indikatorKemampuan: [
      `Mampu mendeskripsikan dan menjelaskan komponen utama dari ${materi}.`,
      `Mampu merancang dan melakukan penyelidikan sederhana mengenai karakteristik ${materi}.`,
      `Mampu menganalisis hubungan sebab-akibat atau korelasi antar-elemen dalam ${materi}.`,
      `Mampu mengomunikasikan temuan ilmiah/analitis mengenai ${materi} secara lisan maupun tertulis.`
    ],
    hubunganFase: `Materi ${materi} ini berfungsi sebagai jembatan penting dari konsep dasar di fase sebelumnya ke konsep yang lebih abstrak di fase berikutnya, mematangkan keterampilan berpikir kritis dan analitis siswa.`,
    cpRawText: defaultCP,
    correctedMateri: materi
  };
}

export function generateTPsFallback(discovery: any, cpAnalysis: any) {
  const d = discovery || {};
  const materi = d.materi || "Materi";
  return [
    {
      id: "tp-1",
      text: `Mengidentifikasi dan mendeskripsikan struktur serta fungsi utama komponen-komponen penyusun ${materi} dengan benar.`
    },
    {
      id: "tp-2",
      text: `Menganalisis keterkaitan hubungan antar elemen atau proses yang terjadi di dalam ${materi} secara kritis.`
    },
    {
      id: "tp-3",
      text: `Melakukan penyelidikan atau eksperimen sederhana untuk mengamati karakteristik nyata dari ${materi}.`
    },
    {
      id: "tp-4",
      text: `Menyusun dan menyajikan laporan hasil pengamatan/analisis tentang peran penting ${materi} dalam kehidupan sehari-hari.`
    }
  ];
}

export function generateKKTPFallback(selectedTps: any[], discovery: any) {
  const sc: any[] = [];
  const tps = Array.isArray(selectedTps) ? selectedTps : [];
  tps.forEach((tp: any, index: number) => {
    if (!tp || !tp.text) return;
    sc.push({
      id: `sc-${index + 1}-1`,
      tpId: tp.id,
      tpText: tp.text,
      text: `Menjelaskan minimal 3 karakteristik utama atau fungsi spesifik terkait konsep ${tp.text.split(' ').slice(0, 4).join(' ')} secara akurat.`
    });
    sc.push({
      id: `sc-${index + 1}-2`,
      tpId: tp.id,
      tpText: tp.text,
      text: `Mengaitkan konsep teoretis dengan fenomena atau aplikasi nyata di lingkungan sekitar siswa.`
    });
    sc.push({
      id: `sc-${index + 1}-3`,
      tpId: tp.id,
      tpText: tp.text,
      text: `Menghasilkan laporan, diagram, atau karya visual yang menyajikan hasil pemikiran analitis secara rapi.`
    });
  });
  return sc;
}

export function generateBigIdeaFallback(selectedTps: any[], successCriteria: any[], discovery: any) {
  const d = discovery || {};
  const materi = d.materi || "Materi";
  return {
    bigIdea: `Setiap sistem atau fenomena dalam ${materi} terdiri dari bagian-bagian kecil yang saling berinteraksi secara harmonis untuk menjaga keseimbangan dan kelangsungan fungsi secara keseluruhan.`,
    essentialQuestions: [
      `Bagaimana komponen-komponen kecil dalam ${materi} saling bekerja sama sehingga sistem yang besar dapat berjalan dengan baik?`,
      `Apa yang akan terjadi pada kehidupan kita atau sistem sekitar jika salah satu bagian dari ${materi} mengalami kerusakan atau tidak berfungsi?`,
      `Bagaimana kita dapat menerapkan pemahaman kita tentang ${materi} untuk memecahkan masalah nyata di lingkungan kita?`
    ]
  };
}

export function generateEvidenceFallback(discovery: any, selectedTps: any[], successCriteria: any[], bigIdea: string, essentialQuestions: string[]) {
  const d = discovery || {};
  const materi = d.materi || "Materi";
  return [
    {
      id: "ev-1",
      title: `Proyek Portofolio / Poster Ilmiah ${materi}`,
      description: `Siswa bekerja dalam kelompok untuk membuat poster infografis atau model fisik yang menggambarkan hubungan fungsional dalam ${materi}, serta menyajikan solusinya atas tantangan nyata terkait topik ini.`,
      rationale: `Tugas unjuk kerja unifikasi ini mengukur pemahaman konseptual, kemampuan kolaborasi, serta keterampilan komunikasi visual dan verbal siswa secara otentik.`
    },
    {
      id: "ev-2",
      title: `Laporan Hasil Penyelidikan & Analisis ${materi}`,
      description: `Siswa menulis laporan praktikum atau analisis mandiri yang memuat rumusan masalah, data pengamatan terstruktur, pembahasan ilmiah, serta kesimpulan logis mengenai ${materi}.`,
      rationale: `Laporan tertulis mengukur keterampilan proses sains, literasi data, serta kemampuan mengevaluasi hasil eksperimen secara objektif.`
    }
  ];
}

export function generateAssessmentFallback(discovery: any, selectedEvidence: any[], successCriteria: any[]) {
  const evidenceList = Array.isArray(selectedEvidence) ? selectedEvidence : [];
  const evidenceTitle = evidenceList[0]?.title || "Tugas Pembelajaran";
  const evidenceDesc = evidenceList[0]?.description || "Siswa merancang proyek analisis mandiri.";

  const rubricHTML = `
<table style="width:100%; border-collapse: collapse; margin-top: 15px; font-family: 'Cambria', serif; font-size: 12px;">
  <thead>
    <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1; text-align: left;">
      <th style="padding: 10px; border: 1px solid #cbd5e1;">Kriteria Penilaian</th>
      <th style="padding: 10px; border: 1px solid #cbd5e1;">Mahir (4)</th>
      <th style="padding: 10px; border: 1px solid #cbd5e1;">Cakap (3)</th>
      <th style="padding: 10px; border: 1px solid #cbd5e1;">Layak (2)</th>
      <th style="padding: 10px; border: 1px solid #cbd5e1;">Baru Berkembang (1)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold;">Pemahaman Konsep</td>
      <td style="padding: 10px; border: 1px solid #cbd5e1;">Menunjukkan pemahaman yang sangat mendalam, akurat, dan tanpa miskonsepsi. Mampu menjelaskan korelasi kompleks.</td>
      <td style="padding: 10px; border: 1px solid #cbd5e1;">Memahami konsep dasar dengan baik, ada sedikit ketidaktelitian kecil namun tidak mengganggu esensi materi.</td>
      <td style="padding: 10px; border: 1px solid #cbd5e1;">Memahami beberapa konsep dasar saja, masih terdapat miskonsepsi pada bagian penting.</td>
      <td style="padding: 10px; border: 1px solid #cbd5e1;">Belum memahami konsep dasar secara benar, memerlukan bimbingan intensif dari guru.</td>
    </tr>
    <tr style="background-color: #f8fafc;">
      <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold;">Kualitas Produk / Hasil Penyelidikan</td>
      <td style="padding: 10px; border: 1px solid #cbd5e1;">Produk/laporan sangat rapi, data lengkap dan terstruktur, menyajikan solusi yang kreatif dan kontekstual.</td>
      <td style="padding: 10px; border: 1px solid #cbd5e1;">Produk rapi, menyajikan data yang cukup lengkap, pembahasan sesuai panduan.</td>
      <td style="padding: 10px; border: 1px solid #cbd5e1;">Produk kurang rapi, data kurang lengkap, pembahasan sangat singkat.</td>
      <td style="padding: 10px; border: 1px solid #cbd5e1;">Produk tidak selesai, data asal-asalan, tidak ada pembahasan ilmiah.</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold;">Keterampilan Komunikasi</td>
      <td style="padding: 10px; border: 1px solid #cbd5e1;">Penyajian sangat jelas, komunikatif, percaya diri, dan mampu menjawab pertanyaan diskusi dengan argumentasi yang kuat.</td>
      <td style="padding: 10px; border: 1px solid #cbd5e1;">Penyajian cukup jelas, runtut, namun kurang percaya diri atau argumentasi kurang tajam.</td>
      <td style="padding: 10px; border: 1px solid #cbd5e1;">Penyajian terbata-bata, kurang menguasai materi yang dibawakan.</td>
      <td style="padding: 10px; border: 1px solid #cbd5e1;">Tidak mampu menyajikan hasil karya atau menghindar dari sesi komunikasi.</td>
    </tr>
  </tbody>
</table>
  `;

  return {
    method: `Rubrik Penilaian Unjuk Kerja / Proyek (${evidenceTitle})`,
    description: `Peserta didik diminta melakukan tugas: ${evidenceDesc}. Kinerja siswa akan diases menggunakan rubrik terlampir yang mencakup kriteria pemahaman konsep, kualitas produk, dan efektivitas komunikasi.`,
    rubric: rubricHTML,
    justification: `Asesmen rubrik unjuk kerja ini sangat representatif untuk mengevaluasi penguasaan kompetensi siswa secara komprehensif, mencakup aspek kognitif, psikomotorik, serta keterampilan afektif/kolaborasi.`,
    assessmentForLearning: "Observasi keaktifan siswa selama diskusi kelompok, tanya jawab interaktif di sela-sela pemaparan konsep, serta pengecekan pemahaman melalui kuis singkat di akhir kegiatan memahami.",
    assessmentAsLearning: "Lembar penilaian diri sendiri (self-assessment) tentang kontribusi individu dalam kerja kelompok, serta pengisian lembar refleksi belajar harian (reflektif).",
    assessmentOfLearning: `Penilaian sumatif hasil produk unjuk kerja kelompok berupa "${evidenceTitle}" dengan menggunakan lembar rubrik kriteria penilaian yang terperinci.`
  };
}

export function generateExperienceFallback(blueprint: any) {
  const bp = blueprint || {};
  const discovery = bp.discovery || {};
  const bigIdea = bp.bigIdea || {};
  const essentialQuestions = Array.isArray(bigIdea.essentialQuestions) ? bigIdea.essentialQuestions : [];
  const evidenceList = Array.isArray(bp.evidence) ? bp.evidence : [];

  const materi = discovery.materi || "Materi";
  const model = bp.modelPembelajaran || "Problem Based Learning";

  return {
    experience: {
      kegiatanAwal: {
        title: "Kegiatan Awal (Apersepsi & Orientasi)",
        duration: "15 Menit",
        activities: [
          `Guru menyapa siswa, mengecek kehadiran, dan mengondisikan kelas agar siap belajar.`,
          `Guru memberikan pertanyaan pemantik yang menantang: "${essentialQuestions[0] || 'Mengapa topik ini penting?'}"`,
          `Guru mengaitkan materi ${materi} dengan fenomena kontekstual sehari-hari untuk memancing rasa ingin tahu.`
        ]
      },
      memahami: {
        title: "Membangun Pemahaman (Eksplorasi Konseptual)",
        duration: "30 Menit",
        activities: [
          `Siswa mengamati video, slide presentasi, atau objek nyata yang berkaitan dengan ${materi}.`,
          `Guru memandu diskusi kelompok kecil terarah untuk menganalisis karakteristik dan konsep kunci.`,
          `Siswa mengidentifikasi masalah utama dan mengajukan hipotesis awal secara kolaboratif.`
        ]
      },
      mengaplikasi: {
        title: "Mengaplikasikan Konsep (Produksi Bukti Belajar)",
        duration: "45 Menit",
        activities: [
          `Siswa secara berkelompok merancang produk atau melakukan penyelidikan nyata untuk membuat: ${evidenceList.filter((e: any) => e?.selected)[0]?.title || 'Bukti Belajar'}.`,
          `Guru berkeliling memberikan bimbingan, melakukan observasi proses, and memberikan scaffolding bagi kelompok yang membutuhkan.`,
          `Setiap kelompok menyelesaikan rancangan, merapikan data, dan mempersiapkan presentasi singkat.`
        ]
      },
      merefleksi: {
        title: "Refleksi Pembelajaran & Evaluasi Diri",
        duration: "15 Menit",
        activities: [
          `Perwakilan kelompok mempresentasikan hasil karya atau temuan penyelidikan mereka di depan kelas.`,
          `Siswa lain memberikan umpan balik konstruktif berdasarkan kriteria rubrik yang disepakati.`,
          `Siswa mengisi lembar refleksi diri mengenai apa yang telah dipahami, tantangan yang dihadapi, serta rencana perbaikan.`
        ]
      },
      penutup: {
        title: "Penutup, Penguatan, & Tindak Lanjut",
        duration: "15 Menit",
        activities: [
          `Guru bersama siswa menyimpulkan poin-poin kunci pembelajaran hari ini.`,
          `Guru memberikan penguatan materi untuk meluruskan potensi miskonsepsi.`,
          `Guru mengumumkan rencana pertemuan berikutnya serta memberikan apresiasi atas performa positif seluruh siswa.`
        ]
      }
    },
    resources: {
      resources: [
        { title: `Buku Panduan Guru & Siswa Kurikulum Merdeka untuk ${discovery.mataPelajaran || 'Mata Pelajaran'}`, type: "Buku Teks Utama", description: "Bahan bacaan utama referensi materi teori." },
        { title: `Media Pembelajaran Interaktif / Video Penyelidikan ${materi}`, type: "Video / Animasi", description: "Membantu siswa visual memahami konsep yang abstrak secara nyata." },
        { title: `Lembar Kerja Peserta Didik (LKPD) Berbasis UbD`, type: "Dokumen Praktikum", description: "Panduan penyelidikan sistematis di kelas." }
      ],
      justification: "Kombinasi sumber belajar visual, tekstual, dan praktis memastikan seluruh kebutuhan gaya belajar siswa terfasilitasi dengan baik."
    },
    digitalIntegration: {
      recommendations: [
        { tool: "Google Slides / Canva", purpose: "Merancang infografis atau media presentasi hasil penyelidikan kelompok.", activityLink: "Kegiatan Mengaplikasikan Konsep" },
        { tool: "Jamboard / Padlet", purpose: "Menuliskan refleksi pembelajaran secara kolaboratif dan interaktif.", activityLink: "Kegiatan Refleksi Pembelajaran" }
      ],
      justification: "Penggunaan alat digital meningkatkan kolaborasi aktif, keterampilan komunikasi abad ke-21, serta kemudahan guru memonitor proses belajar secara real-time."
    },
    differentiation: {
      proses: "Siswa yang lambat mendapatkan bimbingan intensif (scaffolding) dari guru, sementara siswa yang cepat diberikan tantangan memperluas analisis pengamatan.",
      produk: "Siswa diberikan kebebasan memilih format produk akhir (bisa berupa poster digital Canva, rekaman video penjelasan, atau laporan infografis cetak).",
      dukunganBelajar: "Menyediakan glosarium istilah penting dan panduan gambar berwarna untuk memudahkan siswa dengan hambatan pemahaman membaca konsep."
    }
  };
}

export function generateCompileModuleFallback(blueprint: any, experience: any, resources: any, digitalIntegration: any, differentiation: any) {
  const disc = blueprint?.discovery || {};
  const cp = blueprint?.cpAnalysis || { kompetensi: [], kedalamanMateri: "", cpRawText: "" };
  
  const tpsList = Array.isArray(blueprint?.tps) ? blueprint.tps : [];
  const tpsText = tpsList.filter((t: any) => t?.selected).map((t: any) => `<li>${t.text || ''}</li>`).join('');
  
  const scList = Array.isArray(blueprint?.successCriteria) ? blueprint.successCriteria : [];
  const scText = scList.filter((s: any) => s?.selected).map((s: any) => `<li>${s.text || ''}</li>`).join('');
  
  const eqsList = Array.isArray(blueprint?.bigIdea?.essentialQuestions) ? blueprint.bigIdea.essentialQuestions : [];
  const eqsText = eqsList.map((q: string) => `<li>${q || ''}</li>`).join('');

  const getActivitiesHtml = (sect: any) => {
    if (!sect || !Array.isArray(sect.activities)) return '';
    return sect.activities.map((a: string) => `<li style="margin-bottom: 6px;">${a || ''}</li>`).join('');
  };

  const html = `
<div style="font-family: 'Cambria', 'Aptos', 'Calibri', 'Times New Roman', serif; color: #1e293b; line-height: 1.5; max-width: 800px; margin: 0 auto; padding: 10px; background-color: #ffffff;">
  
  <!-- Header Judul Sesuai Template -->
  <div style="text-align: center; margin-bottom: 25px;">
    <h1 style="font-size: 20px; font-weight: bold; margin-bottom: 8px; text-transform: uppercase; color: #000000; letter-spacing: 0.5px;">MODUL AJAR</h1>
    <div style="font-size: 13px; font-weight: bold; margin-bottom: 4px; color: #000000;">MATA PELAJARAN : ${disc.mataPelajaran?.toUpperCase() || '_________________________'}</div>
    <div style="font-size: 13px; font-weight: bold; margin-bottom: 15px; color: #000000;">BAB/TEMA : ${disc.materi?.toUpperCase() || '_________________________'}</div>
  </div>

  <!-- Table 1: Identitas Modul -->
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; border: 1px solid #cbd5e1;">
    <tr style="background-color: #bfdbfe; font-weight: bold;">
      <td colspan="3" style="padding: 8px 10px; border: 1px solid #94a3b8; text-transform: uppercase; color: #1e3a8a; font-size: 12.5px; font-weight: bold;">IDENTITAS MODUL</td>
    </tr>
    <tr>
      <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #cbd5e1; width: 30%; background-color: #f8fafc;">Nama Sekolah</td>
      <td style="padding: 8px 6px; border: 1px solid #cbd5e1; width: 3%; text-align: center; background-color: #f8fafc;">:</td>
      <td style="padding: 8px 12px; border: 1px solid #cbd5e1;">${disc.namaSekolah || '.....................................................................................'}</td>
    </tr>
    <tr>
      <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #cbd5e1; background-color: #f8fafc;">Nama Penyusun</td>
      <td style="padding: 8px 6px; border: 1px solid #cbd5e1; text-align: center; background-color: #f8fafc;">:</td>
      <td style="padding: 8px 12px; border: 1px solid #cbd5e1; font-weight: bold;">${disc.namaPenyusun || '.....................................................................................'}</td>
    </tr>
    <tr>
      <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #cbd5e1; background-color: #f8fafc;">Topik</td>
      <td style="padding: 8px 6px; border: 1px solid #cbd5e1; text-align: center; background-color: #f8fafc;">:</td>
      <td style="padding: 8px 12px; border: 1px solid #cbd5e1;">${disc.materi || '.....................................................................................'}</td>
    </tr>
    <tr>
      <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #cbd5e1; background-color: #f8fafc;">Kelas / Fase / Semester</td>
      <td style="padding: 8px 6px; border: 1px solid #cbd5e1; text-align: center; background-color: #f8fafc;">:</td>
      <td style="padding: 8px 12px; border: 1px solid #cbd5e1;">Kelas ${disc.kelas || '___'} / Fase ${disc.fase || '___'} / Semester ${disc.semester || 'Ganjil'}</td>
    </tr>
    <tr>
      <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #cbd5e1; background-color: #f8fafc;">Alokasi Waktu</td>
      <td style="padding: 8px 6px; border: 1px solid #cbd5e1; text-align: center; background-color: #f8fafc;">:</td>
      <td style="padding: 8px 12px; border: 1px solid #cbd5e1;">${disc.alokasiWaktu || '... Pertemuan (... x 40 menit)'}</td>
    </tr>
    <tr>
      <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #cbd5e1; background-color: #f8fafc;">Tahun Pelajaran</td>
      <td style="padding: 8px 6px; border: 1px solid #cbd5e1; text-align: center; background-color: #f8fafc;">:</td>
      <td style="padding: 8px 12px; border: 1px solid #cbd5e1;">2025 / 2026</td>
    </tr>
  </table>

  <!-- Table 2: Identifikasi -->
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; border: 1px solid #cbd5e1;">
    <tr>
      <td rowspan="3" style="width: 20%; padding: 12px; border: 1px solid #cbd5e1; font-weight: bold; text-align: center; vertical-align: middle; background-color: #f1f5f9; color: #1e293b; font-size: 13px;">
        Identifikasi
      </td>
      <td style="padding: 12px; border: 1px solid #cbd5e1; vertical-align: top;">
        <strong style="color: #1e3a8a; font-size: 12.5px;">Peserta Didik:</strong>
        <div style="margin-top: 6px; color: #334155; line-height: 1.4;">
          ${disc.karakteristikSiswa || 'Peserta didik memiliki tingkat kesiapan belajar yang bervariasi (heterogen). Sebagian besar memiliki pemahaman awal dasar terkait topik, menyukai metode pembelajaran aktif yang berbasis kolaborasi kelompok kecil, visualisasi media, serta pemecahan masalah kontekstual yang dekat dengan kehidupan mereka sehari-hari.'}
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #cbd5e1; vertical-align: top;">
        <strong style="color: #1e3a8a; font-size: 12.5px;">Materi Pelajaran:</strong>
        <div style="margin-top: 6px; color: #334155; line-height: 1.4;">
          <strong>Jenis Pengetahuan:</strong> ${cp.kedalamanMateri || 'Konseptual, Prosedural, dan Metakognitif.'}<br>
          <strong>Relevansi Dunia Nyata:</strong> Topik ${disc.materi || 'pembelajaran'} ini sangat erat kaitannya dengan fenomena nyata dan aplikasi langsung di lingkungan siswa, memungkinkan integrasi nilai sosial-saintifik, peningkatan rasa ingin tahu, kecakapan bernalar logis, kolaborasi tim, serta tanggung jawab etis.
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #cbd5e1; vertical-align: top;">
        <strong style="color: #1e3a8a; font-size: 12.5px;">Dimensi Profil Lulusan:</strong>
        <div style="margin-top: 8px; display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
          ${[
            'Keimanan dan Ketekwaan terhadap Tuhan YME',
            'Kewargaan',
            'Penalaran Kritis',
            'Kreativitas',
            'Kolaborasi',
            'Kemandirian',
            'Kesehatan',
            'Komunikasi'
          ].map((dim, index) => {
            const isSelected = (disc.dimensiProfil || []).some((p: string) => {
              const pLower = p.toLowerCase();
              const dimLower = dim.toLowerCase();
              if (dimLower.includes('keiman') && pLower.includes('iman')) return true;
              if (dimLower.includes('nalar') && pLower.includes('nalar')) return true;
              if (dimLower.includes('kreati') && pLower.includes('kreati')) return true;
              if (dimLower.includes('kolabo') && pLower.includes('kolabo')) return true;
              if (dimLower.includes('mandiri') && pLower.includes('mandiri')) return true;
              if (dimLower.includes('komunikasi') && pLower.includes('komunikasi')) return true;
              if (dimLower.includes('kewargaan') && pLower.includes('berkebinekaan')) return true;
              return pLower.includes(dimLower) || dimLower.includes(pLower);
            }) || (disc.dimensiPancaCinta || []).some((p: string) => {
              const pLower = p.toLowerCase();
              const dimLower = dim.toLowerCase();
              return pLower.includes(dimLower) || dimLower.includes(pLower);
            });

            return `
              <div style="display: flex; align-items: center; gap: 6px; font-weight: ${isSelected ? 'bold' : 'normal'}; color: ${isSelected ? '#1e3a8a' : '#64748b'}; font-size: 11.5px;">
                <span style="font-size: 13px;">${isSelected ? '☑' : '☐'}</span>
                <span>${index + 1}. ${dim}</span>
              </div>
            `;
          }).join('')}
        </div>
      </td>
    </tr>
  </table>

  <!-- Table 3: Desain Pembelajaran -->
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; border: 1px solid #cbd5e1;">
    <tr>
      <td rowspan="8" style="width: 20%; padding: 12px; border: 1px solid #cbd5e1; font-weight: bold; text-align: center; vertical-align: middle; background-color: #f1f5f9; color: #1e293b; font-size: 13px;">
        Desain<br>Pembelajaran
      </td>
      <td style="padding: 12px; border: 1px solid #cbd5e1; vertical-align: top;">
        <strong style="color: #1e3a8a; font-size: 12.5px;">Capaian Pembelajaran:</strong>
        <div style="margin-top: 6px; color: #334155; line-height: 1.4; font-style: italic; background-color: #f8fafc; padding: 8px; border-radius: 4px; border-left: 3px solid #cbd5e1;">
          "${cp.cpRawText || 'Capaian Pembelajaran resmi sesuai fase acuan kurikulum.'}"
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #cbd5e1; vertical-align: top;">
        <strong style="color: #1e3a8a; font-size: 12.5px;">Lintas Disiplin Ilmu:</strong>
        <div style="margin-top: 6px; color: #334155; line-height: 1.4;">
          ${blueprint?.lintasDisiplin || 'Mengintegrasikan bidang Sains (konsep teori), Matematika (pengumpulan dan pengolahan data), Literasi Bahasa (penulisan laporan ilmiah), serta Teknologi Informasi & Komunikasi (desain digital kelompok).'}
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #cbd5e1; vertical-align: top;">
        <strong style="color: #1e3a8a; font-size: 12.5px;">Tujuan Pembelajaran:</strong>
        <ul style="margin-top: 8px; margin-bottom: 8px; padding-left: 20px; color: #1e3a8a; font-weight: bold; line-height: 1.5;">
          ${tpsText}
        </ul>
        <div style="margin-top: 6px; border-top: 1px dashed #cbd5e1; padding-top: 6px; font-size: 11px; color: #475569;">
          <strong>Kriteria Ketercapaian (KKTP / Success Criteria):</strong>
          <ul style="margin-top: 4px; padding-left: 15px; font-style: italic; line-height: 1.4;">
            ${scText}
          </ul>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #cbd5e1; vertical-align: top;">
        <strong style="color: #1e3a8a; font-size: 12.5px;">Topik Pembelajaran:</strong>
        <div style="margin-top: 6px; color: #334155; font-weight: bold; line-height: 1.4;">
          "${disc.materi || 'Materi Inti'}" &bull; Berfokus pada pemahaman konsep fundamental, penganalisisan fenomena, serta penyelesaian tantangan kontekstual.
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #cbd5e1; vertical-align: top;">
        <strong style="color: #1e3a8a; font-size: 12.5px;">Praktik Pedagogis:</strong>
        <div style="margin-top: 6px; color: #334155; line-height: 1.4;">
          <strong>Model Utama:</strong> ${blueprint?.modelPembelajaran || 'Pembelajaran Berbasis Masalah (Problem Based Learning)'}<br>
          <strong>Strategi & Metode:</strong> ${blueprint?.strategiPembelajaran || 'Diskusi Kelompok, Penyelidikan Ilmiah Terstruktur, Tanya Jawab Sokratik, Refleksi, dan Presentasi Hasil Karya.'}
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #cbd5e1; vertical-align: top;">
        <strong style="color: #1e3a8a; font-size: 12.5px;">Kemitraan Pembelajaran:</strong>
        <div style="margin-top: 6px; color: #334155; line-height: 1.4;">
          Kolaborasi antar peserta didik (Peer Collaboration) dalam kelompok belajar heterogen, bimbingan fasilitatif guru mata pelajaran, serta pemanfaatan perpustakaan sekolah dan jaringan informasi internet secara bertanggung jawab.
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #cbd5e1; vertical-align: top;">
        <strong style="color: #1e3a8a; font-size: 12.5px;">Lingkungan Pembelajaran:</strong>
        <div style="margin-top: 6px; color: #334155; line-height: 1.4;">
          Ruang kelas fisik dengan penataan meja sirkuler (kelompok), pojok literasi sains/sosial, dipadukan dengan akses ruang virtual pendukung pembelajaran mandiri, serta penciptaan kultur budaya belajar yang demokratis, inklusif, saling mendukung, dan menghargai keberagaman.
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #cbd5e1; vertical-align: top;">
        <strong style="color: #1e3a8a; font-size: 12.5px;">Pemanfaatan Digital:</strong>
        <div style="margin-top: 6px; color: #334155; line-height: 1.4;">
          ${digitalIntegration?.justification || 'Pencarian referensi informasi multimedia, penggunaan platform desain kolaboratif (seperti Canva atau Google Slides) untuk penyusunan karya presentasi kelompok, serta pelaksanaan penilaian dan refleksi digital interaktif.'}
        </div>
      </td>
    </tr>
  </table>

  <!-- Table 4: Pengalaman Belajar -->
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; border: 1px solid #cbd5e1;">
    <tr style="background-color: #bfdbfe; font-weight: bold; text-align: center;">
      <td colspan="2" style="padding: 8px 10px; border: 1px solid #94a3b8; text-transform: uppercase; color: #1e3a8a; font-size: 12.5px;">
        Langkah-Langkah Pembelajaran
      </td>
    </tr>
    <tr>
      <td rowspan="3" style="width: 20%; padding: 12px; border: 1px solid #cbd5e1; font-weight: bold; text-align: center; vertical-align: middle; background-color: #f1f5f9; color: #1e293b; font-size: 13px;">
        Pengalaman<br>Belajar
      </td>
      <td style="padding: 12px; border: 1px solid #cbd5e1; vertical-align: top;">
        <strong style="color: #1e3a8a; font-size: 12.5px;">AWAL</strong>
        <ul style="padding-left: 20px; margin: 8px 0 0 0; color: #334155; line-height: 1.5;">
          ${getActivitiesHtml(experience?.kegiatanAwal)}
        </ul>
      </td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #cbd5e1; vertical-align: top;">
        <strong style="color: #1e3a8a; font-size: 12.5px;">INTI</strong>
        
        <div style="margin-top: 10px; margin-bottom: 12px; padding: 10px 14px; border-left: 3px solid #1e3a8a; background-color: #f8fafc; border-radius: 0 6px 6px 0;">
          <strong style="color: #1e3a8a; font-size: 12px;">Memahami</strong>
          <ul style="padding-left: 20px; margin: 6px 0 0 0; color: #334155; line-height: 1.5;">
            ${getActivitiesHtml(experience?.memahami)}
          </ul>
        </div>

        <div style="margin-top: 10px; margin-bottom: 12px; padding: 10px 14px; border-left: 3px solid #0d9488; background-color: #f0fdfa; border-radius: 0 6px 6px 0;">
          <strong style="color: #0d9488; font-size: 12px;">Mengaplikasi</strong>
          <ul style="padding-left: 20px; margin: 6px 0 0 0; color: #334155; line-height: 1.5;">
            ${getActivitiesHtml(experience?.mengaplikasi)}
          </ul>
        </div>

        <div style="margin-top: 10px; padding: 10px 14px; border-left: 3px solid #b45309; background-color: #fffbeb; border-radius: 0 6px 6px 0;">
          <strong style="color: #b45309; font-size: 12px;">Merefleksi</strong>
          <ul style="padding-left: 20px; margin: 6px 0 0 0; color: #334155; line-height: 1.5;">
            ${getActivitiesHtml(experience?.merefleksi)}
          </ul>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #cbd5e1; vertical-align: top;">
        <strong style="color: #1e3a8a; font-size: 12.5px;">PENUTUP</strong>
        <ul style="padding-left: 20px; margin: 8px 0 0 0; color: #334155; line-height: 1.5;">
          ${getActivitiesHtml(experience?.penutup)}
        </ul>
      </td>
    </tr>
  </table>

  <!-- Table 5: Asesmen Pembelajaran -->
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; border: 1px solid #cbd5e1;">
    <tr>
      <td rowspan="3" style="width: 20%; padding: 12px; border: 1px solid #cbd5e1; font-weight: bold; text-align: center; vertical-align: middle; background-color: #f1f5f9; color: #1e293b; font-size: 13px;">
        Asesmen<br>Pembelajaran
      </td>
      <td style="padding: 12px; border: 1px solid #cbd5e1; vertical-align: top;">
        <strong style="color: #1e3a8a; font-size: 12px;">Asesmen pada Awal Pembelajaran (Apersepsi/Diagnostik):</strong>
        <div style="margin-top: 6px; color: #334155; line-height: 1.4;">
          ${blueprint?.assessment?.diagnosticAssessment || 'Guru melangsungkan pertanyaan pemantik pemahaman awal secara lisan, curah pendapat kelompok (brainstorming), serta pre-kuis cepat berbasis interaksi langsung untuk memetakan kesiapan peserta didik.'}
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #cbd5e1; vertical-align: top;">
        <strong style="color: #1e3a8a; font-size: 12px;">Asesmen pada Proses Pembelajaran (Formatif):</strong>
        <div style="margin-top: 6px; color: #334155; line-height: 1.4;">
          <div style="margin-bottom: 8px;">
            <strong style="color: #047857; font-size: 11.5px;">1. Asesmen For Learning (AfL):</strong>
            <p style="margin: 3px 0 0 12px; color: #334155;">${blueprint?.assessment?.assessmentForLearning || 'Observasi guru terhadap kinerja, interaksi, dan keaktifan diskusi kelompok siswa menggunakan lembar observasi partisipasi serta bimbingan terarah.'}</p>
          </div>
          <div>
            <strong style="color: #b45309; font-size: 11.5px;">2. Asesmen As Learning (AaL):</strong>
            <p style="margin: 3px 0 0 12px; color: #334155;">${blueprint?.assessment?.assessmentAsLearning || 'Lembar penilaian diri sendiri (self-assessment) dan refleksi tertulis harian siswa untuk mengevaluasi pemahaman pribadi terhadap tantangan konsep.'}</p>
          </div>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #cbd5e1; vertical-align: top;">
        <strong style="color: #1e3a8a; font-size: 12px;">Asesmen pada Akhir Pembelajaran (Sumatif):</strong>
        <div style="margin-top: 6px; color: #334155; line-height: 1.4;">
          <strong style="color: #be123c; font-size: 11.5px;">Asesmen Of Learning (AoL):</strong>
          <p style="margin: 3px 0 10px 12px; color: #334155;">${blueprint?.assessment?.assessmentOfLearning || 'Penilaian produk akhir yang diproduksi (seperti poster, laporan proyek, atau model fisik) kelompok menggunakan rubrik penilaian unjuk kerja.'}</p>
          
          <div style="margin-top: 12px; border-top: 1px dashed #cbd5e1; padding-top: 10px;">
            <strong style="color: #000000; font-size: 12px;">Rubrik Penilaian Detail:</strong>
            <div style="margin-top: 8px; overflow-x: auto;">
              ${blueprint?.assessment?.rubric || '<p style="font-style: italic; color: #64748b;">(Tabel rubrik penilaian detail otomatis dilampirkan setelah pengisian asesmen)</p>'}
            </div>
          </div>
        </div>
      </td>
    </tr>
  </table>

  <!-- Table 6: Sumber Belajar & Diferensiasi -->
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 12px; border: 1px solid #cbd5e1;">
    <tr>
      <td rowspan="2" style="width: 20%; padding: 12px; border: 1px solid #cbd5e1; font-weight: bold; text-align: center; vertical-align: middle; background-color: #f1f5f9; color: #1e293b; font-size: 13px;">
        Media &amp;<br>Sumber Belajar
      </td>
      <td style="padding: 12px; border: 1px solid #cbd5e1; vertical-align: top;">
        <strong style="color: #1e3a8a; font-size: 12.5px;">Bahan &amp; Sumber Belajar:</strong>
        <ul style="padding-left: 20px; margin: 6px 0 0 0; color: #334155; line-height: 1.5;">
          ${(Array.isArray(resources?.resources) ? resources.resources : []).map((r: any) => `
            <li style="margin-bottom: 4px;"><strong>${r.title || ''}</strong> (${r.type || ''}) - ${r.description || ''}</li>
          `).join('')}
        </ul>
      </td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #cbd5e1; vertical-align: top;">
        <strong style="color: #1e3a8a; font-size: 12.5px;">Strategi Diferensiasi:</strong>
        <div style="margin-top: 6px; color: #334155; line-height: 1.4;">
          <strong>Proses:</strong> ${differentiation?.proses || 'Menyediakan scaffolding/bimbingan bagi siswa yang lambat belajar, serta tantangan analisis mendalam bagi siswa yang cepat belajar.'}<br>
          <strong>Produk:</strong> ${differentiation?.produk || 'Siswa bebas mempublikasikan atau menyajikan produk akhir dalam berbagai pilihan format media kelompok.'}<br>
          <strong>Dukungan:</strong> ${differentiation?.dukunganBelajar || 'Menyediakan glosarium kosakata kunci, panduan langkah kerja bergambar, serta pemantauan partisipasi afektif.'}
        </div>
      </td>
    </tr>
  </table>

  <!-- Tanda Tangan Formal -->
  <table style="width: 100%; margin-top: 40px; font-size: 12.5px; border-collapse: collapse;">
    <tr>
      <td style="width: 50%; text-align: center; border: none; padding: 10px;">
        Mengetahui,<br>
        Kepala Sekolah<br><br><br><br><br>
        ___________________________<br>
        NIP. .....................................
      </td>
      <td style="width: 50%; text-align: center; border: none; padding: 10px;">
        Jakarta, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br>
        Guru Mata Pelajaran<br><br><br><br><br>
        <strong>${disc.namaPenyusun || 'Guru Hebat Indonesia'}</strong><br>
        NIP. .....................................
      </td>
    </tr>
  </table>
</div>
  `;

  return {
    title: `Modul Ajar ${disc.mataPelajaran || ''} Fase ${disc.fase || ''} - ${disc.materi || ''}`,
    htmlContent: html
  };
}

export function generateLkpdFallback(blueprint: any, experience: any) {
  const d = blueprint?.discovery || {};
  const tpsList = (blueprint?.tps || []).filter((t: any) => t.selected).map((t: any) => `<li style="margin-bottom: 4px;">${t.text}</li>`).join('');
  const evidence = (blueprint?.evidence || []).filter((e: any) => e.selected)[0] || { title: "Tugas Unjuk Kerja", description: "Selesaikan tantangan pembelajaran secara berkolompok." };
  
  const logoHeader = d.naungan?.toLowerCase().includes("kemenag") || d.naungan?.toLowerCase().includes("madrasah")
    ? `
    <div style="text-align: center; margin-bottom: 20px; border-bottom: 3px double #047857; padding-bottom: 15px;">
      <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #047857;">Madrasah Hebat Bermartabat</div>
      <h1 style="font-size: 20px; font-weight: bold; margin: 5px 0 0 0; color: #047857;">LEMBAR KERJA PESERTA DIDIK (LKPD)</h1>
      <div style="font-size: 13px; color: #475569; margin-top: 5px; font-family: sans-serif;">${d.sekolah || 'Madrasah Aliyah'} | Kelas/Semester: ${d.kelas || 'X'} - ${d.semester || 'I'}</div>
    </div>
    `
    : `
    <div style="text-align: center; margin-bottom: 20px; border-bottom: 3px double #1e3a8a; padding-bottom: 15px;">
      <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #1e3a8a;">Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi</div>
      <h1 style="font-size: 20px; font-weight: bold; margin: 5px 0 0 0; color: #1e3a8a;">LEMBAR KERJA PESERTA DIDIK (LKPD)</h1>
      <div style="font-size: 13px; color: #475569; margin-top: 5px; font-family: sans-serif;">${d.sekolah || 'SMP Negeri 1 Jakarta'} | Kelas/Semester: ${d.kelas || 'VII'} - ${d.semester || 'I'}</div>
    </div>
    `;

  const html = `
<div style="font-family: Cambria, Aptos, 'Times New Roman', serif; color: #0f172a; line-height: 1.5; padding: 10px;">
  ${logoHeader}

  <!-- Identitas Kelompok -->
  <table style="width: 100%; border: 1px solid #cbd5e1; border-collapse: collapse; margin-bottom: 25px; font-size: 13px;">
    <tr style="background-color: #f8fafc; border-bottom: 1px solid #cbd5e1;">
      <td style="padding: 10px; font-weight: bold; width: 25%;">Mata Pelajaran</td>
      <td style="padding: 10px; width: 25%;">${d.mataPelajaran || 'IPA'}</td>
      <td style="padding: 10px; font-weight: bold; width: 25%;">Nama Kelompok</td>
      <td style="padding: 10px; width: 25%;">_________________</td>
    </tr>
    <tr style="border-bottom: 1px solid #cbd5e1;">
      <td style="padding: 10px; font-weight: bold;">Materi / Topik</td>
      <td style="padding: 10px;">${d.materi || 'Materi Pembelajaran'}</td>
      <td style="padding: 10px; font-weight: bold; rowspan: 2; vertical-align: top;">Anggota Kelompok</td>
      <td style="padding: 10px; rowspan: 2; vertical-align: top; line-height: 1.8;">
        1. ___________________<br>
        2. ___________________<br>
        3. ___________________<br>
        4. ___________________
      </td>
    </tr>
    <tr>
      <td style="padding: 10px; font-weight: bold;">Alokasi Waktu</td>
      <td style="padding: 10px;">${d.alokasiWaktu || '2 JP'}</td>
    </tr>
  </table>

  <!-- A. TUJUAN PEMBELAJARAN -->
  <h2 style="font-size: 15px; border-left: 4px solid #1e3a8a; padding-left: 8px; margin-top: 20px; margin-bottom: 10px; color: #1e3a8a; font-weight: bold; text-transform: uppercase;">A. TUJUAN PEMBELAJARAN</h2>
  <div style="font-size: 13px; margin-bottom: 20px;">
    Setelah menyelesaikan aktivitas di LKPD ini, peserta didik diharapkan mampu:
    <ol style="margin-top: 5px; padding-left: 20px;">
      ${tpsList || '<li>Memahami kompetensi utama pembelajaran hari ini.</li>'}
    </ol>
  </div>

  <!-- B. PETUNJUK UMUM -->
  <h2 style="font-size: 15px; border-left: 4px solid #1e3a8a; padding-left: 8px; margin-top: 20px; margin-bottom: 10px; color: #1e3a8a; font-weight: bold; text-transform: uppercase;">B. PETUNJUK PENGERJAAN</h2>
  <div style="font-size: 13px; margin-bottom: 20px; line-height: 1.6;">
    <ol style="padding-left: 20px; margin-top: 5px;">
      <li style="margin-bottom: 4px;">Bacalah setiap instruksi dan materi pengantar dengan seksama sebelum memulai aktivitas.</li>
      <li style="margin-bottom: 4px;">Diskusikan setiap pertanyaan bersama rekan satu kelompok Anda secara aktif dan kolaboratif.</li>
      <li style="margin-bottom: 4px;">Gunakan sumber belajar yang tersedia (Bahan Ajar, Buku Siswa, atau media digital yang direkomendasikan).</li>
      <li style="margin-bottom: 4px;">Tuliskan jawaban Anda secara rinci, logis, dan rapi pada kolom yang telah disediakan.</li>
      <li style="margin-bottom: 4px;">Kumpulkan hasil pengerjaan LKPD ini kepada guru tepat waktu setelah selesai.</li>
    </ol>
  </div>

  <!-- C. LANDASAN TEORI SINGKAT / PENGANTAR -->
  <h2 style="font-size: 15px; border-left: 4px solid #1e3a8a; padding-left: 8px; margin-top: 20px; margin-bottom: 10px; color: #1e3a8a; font-weight: bold; text-transform: uppercase;">C. PENGANTAR KONSEP</h2>
  <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 6px; font-size: 13px; margin-bottom: 20px; line-height: 1.6;">
    <strong>Tahukah Kamu?</strong><br>
    "${blueprint?.bigIdea?.bigIdea || 'Setiap bagian dari materi ini saling melengkapi untuk membentuk suatu sistem terintegrasi dalam kehidupan sehari-hari.'}"<br>
    <p style="margin-top: 6px; margin-bottom: 0;">Mari kita selidiki bersama lewat aktivitas kelompok hari ini!</p>
  </div>

  <!-- D. INSTRUKSI UTAMA & PEMANTIK -->
  <h2 style="font-size: 15px; border-left: 4px solid #1e3a8a; padding-left: 8px; margin-top: 20px; margin-bottom: 10px; color: #1e3a8a; font-weight: bold; text-transform: uppercase;">D. AKTIVITAS PENYELIDIKAN KELOMPOK</h2>
  <div style="font-size: 13px; margin-bottom: 20px; line-height: 1.6;">
    <strong>Tugas Utama / Tantangan:</strong> ${evidence.title}<br>
    <p style="margin-top: 4px; color: #475569;">${evidence.description}</p>
    
    <div style="margin-top: 15px; font-weight: bold; color: #0f172a;">Langkah-langkah Penyelidikan:</div>
    <ol style="padding-left: 20px; margin-top: 5px;">
      <li style="margin-bottom: 6px;"><strong>Tahap Observasi:</strong> Amatilah fenomena di lingkungan atau media pembelajaran digital yang disediakan oleh guru Anda.</li>
      <li style="margin-bottom: 6px;"><strong>Tahap Perumusan Masalah:</strong> Diskusikan dan rumuskan satu pertanyaan besar kelompok Anda mengenai konsep tersebut.</li>
      <li style="margin-bottom: 6px;"><strong>Tahap Penyelidikan Mandiri:</strong> Cari dan kumpulkan data informasi pendukung melalui kajian pustaka ataupun eksperimen simulasi terpandu.</li>
      <li style="margin-bottom: 6px;"><strong>Tahap Kolaborasi Produk:</strong> Susunlah hasil karya unjuk kerja kelompok sesuai kesepakatan rubrik penilaian.</li>
    </ol>
  </div>

  <!-- E. LEMBAR JAWABAN & DISKUSI -->
  <h2 style="font-size: 15px; border-left: 4px solid #1e3a8a; padding-left: 8px; margin-top: 25px; margin-bottom: 10px; color: #1e3a8a; font-weight: bold; text-transform: uppercase;">E. PERTANYAAN ANALISIS & RUANG DISKUSI</h2>
  
  <div style="font-size: 13px; margin-bottom: 20px;">
    <div style="margin-bottom: 15px;">
      <strong>Pertanyaan 1 (Pemahaman):</strong> Jelaskan bagaimana keterkaitan komponen-komponen utama dalam materi ${d.materi || 'ini'} berinteraksi sesuai hasil penyelidikan Anda!
      <div style="border: 1px solid #cbd5e1; border-radius: 4px; height: 100px; margin-top: 6px; padding: 10px; color: #94a3b8; font-style: italic;">
        Tuliskan analisis kelompok di sini...
      </div>
    </div>

    <div style="margin-bottom: 15px;">
      <strong>Pertanyaan 2 (Berpikir Kritis):</strong> Apa yang akan terjadi jika salah satu komponen atau proses utama tidak berjalan semestinya? Berikan penjelasan berbasis bukti/logika!
      <div style="border: 1px solid #cbd5e1; border-radius: 4px; height: 100px; margin-top: 6px; padding: 10px; color: #94a3b8; font-style: italic;">
        Tuliskan argumentasi ilmiah kelompok di sini...
      </div>
    </div>

    <div style="margin-bottom: 15px;">
      <strong>Pertanyaan 3 (Penerapan):</strong> Rancanglah sebuah solusi praktis atau kesimpulan awal kelompok untuk mengatasi permasalahan kontekstual di atas!
      <div style="border: 1px solid #cbd5e1; border-radius: 4px; height: 120px; margin-top: 6px; padding: 10px; color: #94a3b8; font-style: italic;">
        Tuliskan draf solusi kreatif / produk di sini...
      </div>
    </div>
  </div>

  <!-- F. KESIMPULAN BELAJAR -->
  <h2 style="font-size: 15px; border-left: 4px solid #1e3a8a; padding-left: 8px; margin-top: 25px; margin-bottom: 10px; color: #1e3a8a; font-weight: bold; text-transform: uppercase;">F. KESIMPULAN AKHIR KELOMPOK</h2>
  <div style="font-size: 13px; margin-bottom: 30px;">
    Tuliskan kesimpulan menyeluruh mengenai apa yang kelompok Anda pelajari hari ini:
    <div style="border: 1px solid #cbd5e1; border-radius: 4px; height: 80px; margin-top: 6px; padding: 10px; color: #94a3b8; font-style: italic;">
      Tuliskan kesimpulan utama di sini...
    </div>
  </div>

  <!-- G. REFLEKSI MANDIRI -->
  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; font-size: 12px; margin-bottom: 30px;">
    <strong>Lembar Refleksi Diri (Isi Mandiri):</strong><br>
    <ul style="margin: 6px 0 0 0; padding-left: 15px;">
      <li style="margin-bottom: 4px;">Hal baru yang saya pelajari hari ini: __________________________________________________</li>
      <li style="margin-bottom: 4px;">Bagian yang paling menantang dan saya sukai: _________________________________________</li>
      <li style="margin-bottom: 4px;">Usaha saya untuk berkontribusi dalam kelompok: [ ] Sangat Baik [ ] Cukup [ ] Perlu Ditingkatkan</li>
    </ul>
  </div>
</div>
  `;

  return {
    title: `LKPD ${d.mataPelajaran || ''} - ${d.materi || ''}`,
    htmlContent: html
  };
}

export function generateBahanAjarFallback(blueprint: any) {
  const d = blueprint?.discovery || {};
  const bigIdea = blueprint?.bigIdea?.bigIdea || "Konsep terpadu yang mendasari materi.";
  const tpsList = (blueprint?.tps || []).filter((t: any) => t.selected).map((t: any) => `<li style="margin-bottom: 4px;">${t.text}</li>`).join('');
  
  const logoHeader = d.naungan?.toLowerCase().includes("kemenag") || d.naungan?.toLowerCase().includes("madrasah")
    ? `
    <div style="text-align: center; margin-bottom: 25px; border-bottom: 3px double #047857; padding-bottom: 15px;">
      <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #047857;">Materi Pendamping Belajar Siswa</div>
      <h1 style="font-size: 20px; font-weight: bold; margin: 5px 0 0 0; color: #047857;">BAHAN AJAR MANDIRI SISWA</h1>
      <div style="font-size: 13px; color: #475569; margin-top: 5px;">${d.sekolah || 'Madrasah Aliyah'} | Kelas/Semester: ${d.kelas || 'X'} - ${d.semester || 'I'}</div>
    </div>
    `
    : `
    <div style="text-align: center; margin-bottom: 25px; border-bottom: 3px double #1e3a8a; padding-bottom: 15px;">
      <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #1e3a8a;">Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi</div>
      <h1 style="font-size: 20px; font-weight: bold; margin: 5px 0 0 0; color: #1e3a8a;">BAHAN AJAR MANDIRI SISWA</h1>
      <div style="font-size: 13px; color: #475569; margin-top: 5px;">${d.sekolah || 'SMP Negeri 1 Jakarta'} | Kelas/Semester: ${d.kelas || 'VII'} - ${d.semester || 'I'}</div>
    </div>
    `;

  const html = `
<div style="font-family: Cambria, Aptos, 'Times New Roman', serif; color: #0f172a; line-height: 1.6; padding: 10px; text-align: justify;">
  ${logoHeader}

  <!-- Identitas Buku -->
  <table style="width: 100%; border: 1px solid #cbd5e1; border-collapse: collapse; margin-bottom: 25px; font-size: 13px; text-align: left;">
    <tr style="background-color: #f8fafc; border-bottom: 1px solid #cbd5e1;">
      <td style="padding: 8px 12px; font-weight: bold; width: 30%;">Mata Pelajaran</td>
      <td style="padding: 8px 12px;">${d.mataPelajaran || 'IPA'}</td>
    </tr>
    <tr style="border-bottom: 1px solid #cbd5e1;">
      <td style="padding: 8px 12px; font-weight: bold;">Topik Utama</td>
      <td style="padding: 8px 12px; font-weight: bold; color: #1e3a8a;">${d.materi || 'Materi Pokok'}</td>
    </tr>
    <tr style="border-bottom: 1px solid #cbd5e1;">
      <td style="padding: 8px 12px; font-weight: bold;">Fase / Kelas</td>
      <td style="padding: 8px 12px;">Fase ${d.fase || 'D'} / Kelas ${d.kelas || 'VII'}</td>
    </tr>
    <tr>
      <td style="padding: 8px 12px; font-weight: bold;">Penyusun / Guru</td>
      <td style="padding: 8px 12px;">${d.namaPenyusun || 'Guru Hebat Indonesia'}</td>
    </tr>
  </table>

  <!-- PENGANTAR -->
  <h2 style="font-size: 15px; border-left: 4px solid #1e3a8a; padding-left: 8px; margin-top: 20px; margin-bottom: 10px; color: #1e3a8a; font-weight: bold; text-transform: uppercase;">A. PENDAHULUAN</h2>
  <div style="font-size: 13px; margin-bottom: 20px;">
    Selamat belajar! Bahan ajar ini dirancang secara khusus untuk mendampingi Anda memahami materi <strong>${d.materi || 'ini'}</strong> secara bermakna. 
    Melalui lembar bahan ajar ini, Anda tidak hanya belajar menghafal fakta, melainkan mengeksplorasi hubungan antar konsep secara holistik dalam kehidupan nyata sehari-hari.
    <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 12px; margin-top: 10px; font-style: italic; color: #1e40af;">
      <strong>Ide Besar Pembelajaran:</strong><br>
      "${bigIdea}"
    </div>
  </div>

  <!-- TUJUAN PEMBELAJARAN -->
  <h2 style="font-size: 15px; border-left: 4px solid #1e3a8a; padding-left: 8px; margin-top: 20px; margin-bottom: 10px; color: #1e3a8a; font-weight: bold; text-transform: uppercase;">B. TARGET KOMPETENSI</h2>
  <div style="font-size: 13px; margin-bottom: 20px;">
    Tujuan pembelajaran yang akan dicapai oleh siswa melalui bahan ajar ini adalah:
    <ul style="margin-top: 5px; padding-left: 20px;">
      ${tpsList || '<li>Siswa dapat menguasai konsep dan materi secara komprehensif.</li>'}
    </ul>
  </div>

  <!-- URAIAN MATERI -->
  <h2 style="font-size: 15px; border-left: 4px solid #1e3a8a; padding-left: 8px; margin-top: 20px; margin-bottom: 12px; color: #1e3a8a; font-weight: bold; text-transform: uppercase;">C. URAIAN MATERI INTI</h2>
  <div style="font-size: 13px; margin-bottom: 20px; line-height: 1.7;">
    <p style="margin-bottom: 12px;"><strong>1. Konsep Dasar ${d.materi || 'Materi'}</strong></p>
    <p style="margin-bottom: 12px; text-indent: 30px;">
      Setiap bagian di alam semesta bekerja berdasarkan struktur dan organisasi tertentu. Begitu pula halnya dengan topik <strong>${d.materi || 'ini'}</strong>. 
      Jika kita mengamati lebih dalam, setiap struktur tersebut memiliki peran dan kontribusi masing-masing yang sangat spesifik namun terintegrasi erat dengan bagian yang lain.
    </p>
    
    <p style="margin-bottom: 12px;"><strong>2. Struktur dan Fungsi Terpadu</strong></p>
    <p style="margin-bottom: 12px; text-indent: 30px;">
      Komponen-komponen penyusun di dalam materi ini dapat kita analogikan sebagai sistem organ ataupun kesatuan kota yang dinamis. 
      Ada bagian yang berfungsi sebagai pusat kendali (koordinasi), bagian yang berfungsi sebagai penyedia energi (produksi), bagian yang mengelola sirkulasi materi/data, 
      serta pelindung luar yang menjamin integritas internal sistem tersebut. Kerusakan atau malfungsi pada salah satu elemen saja akan berdampak langsung 
      terhadap efisiensi sistem secara kumulatif.
    </p>

    <p style="margin-bottom: 12px;"><strong>3. Hubungan Nyata dengan Kehidupan Sehari-hari</strong></p>
    <p style="margin-bottom: 12px; text-indent: 30px;">
      Pemahaman kita terhadap konsep ${d.materi || 'ini'} memberikan landasan yang kokoh bagi sains dan teknologi modern untuk memecahkan berbagai kasus krusial, 
      seperti kesehatan, efisiensi energi, kelestarian ekosistem, maupun desain rekayasa sistem yang kompleks di sekeliling kita.
    </p>
  </div>

  <!-- RANGKUMAN -->
  <h2 style="font-size: 15px; border-left: 4px solid #1e3a8a; padding-left: 8px; margin-top: 25px; margin-bottom: 10px; color: #1e3a8a; font-weight: bold; text-transform: uppercase;">D. RANGKUMAN MATERI</h2>
  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; font-size: 13px; margin-bottom: 25px; line-height: 1.6;">
    <ul style="margin: 0; padding-left: 15px;">
      <li style="margin-bottom: 6px;">Komponen sistem ${d.materi || 'ini'} bekerja sama secara terpadu demi kelangsungan fungsi yang stabil.</li>
      <li style="margin-bottom: 6px;">Masing-masing struktur memiliki korelasi fungsional spesifik dengan tugas kuncinya.</li>
      <li style="margin-bottom: 6px;">Kehidupan nyata di sekitar kita dapat dipahami secara mendalam melalui analogi sistem dinamis terintegrasi ini.</li>
    </ul>
  </div>

  <!-- UJI PEMAHAMAN MANDIRI -->
  <h2 style="font-size: 15px; border-left: 4px solid #1e3a8a; padding-left: 8px; margin-top: 25px; margin-bottom: 10px; color: #1e3a8a; font-weight: bold; text-transform: uppercase;">E. TANTANGAN MANDIRI (CEK PEMAHAMAN)</h2>
  <div style="font-size: 13px; margin-bottom: 30px; line-height: 1.6;">
    Coba jawablah pertanyaan tantangan singkat berikut untuk mengevaluasi pemahaman Anda:
    <ol style="padding-left: 20px; margin-top: 5px;">
      <li style="margin-bottom: 8px;">Gambarkan analogi sederhana yang paling mewakili sistem <strong>${d.materi || 'ini'}</strong> dalam dunia nyata menurut kreativitas Anda sendiri!</li>
      <li style="margin-bottom: 8px;">Jelaskan konsekuensi terberat apa yang dihadapi sistem jika salah satu komponen pendukung mengalami hambatan fungsi!</li>
    </ol>
  </div>

  <!-- GLOSARIUM & PUSTAKA -->
  <h2 style="font-size: 15px; border-left: 4px solid #1e3a8a; padding-left: 8px; margin-top: 25px; margin-bottom: 10px; color: #1e3a8a; font-weight: bold; text-transform: uppercase;">F. GLOSARIUM & RUJUKAN</h2>
  <div style="font-size: 12px; color: #475569; line-height: 1.5; margin-bottom: 20px;">
    <strong>Glosarium:</strong><br>
    <ul style="padding-left: 15px; margin-top: 4px;">
      <li><strong>Sistem Terpadu:</strong> Kesatuan komponen yang saling berhubungan erat untuk mencapai keselarasan kerja.</li>
      <li><strong>Malfungsi:</strong> Kegagalan berfungsinya suatu bagian/proses secara normal.</li>
    </ul>
    <div style="margin-top: 8px;">
      <strong>Rujukan Pustaka:</strong><br>
      Kementerian Pendidikan dan Kebudayaan. (2021). <em>Buku Panduan Guru & Buku Siswa</em>. Jakarta: Pusat Kurikulum dan Perbukuan.
    </div>
  </div>
</div>
  `;

  return {
    title: `Bahan Ajar Mandiri - ${d.materi || ''}`,
    htmlContent: html
  };
}

