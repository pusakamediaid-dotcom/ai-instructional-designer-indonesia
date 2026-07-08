import React, { useState, useRef, useEffect } from 'react';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import {
  School, Sparkles, Info, Loader2, ArrowRight, ArrowLeft, RefreshCw, FileText
} from 'lucide-react';

import {
  DiscoveryData, CPAnalysis, TPItem, SuccessCriterion, BigIdeaData,
  EvidenceItem, AssessmentData, LearningExperience, LearningResources,
  DigitalIntegration, Differentiation, CompiledModule, LearningBlueprint
} from './types';

// Import our new state-of-the-art modular workspace components
import KonteksSection from './components/KonteksSection';
import TujuanBuktiSection from './components/TujuanBuktiSection';
import PaketSection from './components/PaketSection';
import HasilAkhirSection from './components/HasilAkhirSection';
import LandingHero from './components/LandingHero';
import ModeBadge from './components/ModeBadge';

const isPrintMode = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('print') === '1';

function PrintWindowHandler() {
  const [printData, setPrintData] = useState<{ title: string; html: string } | null>(null);

  useEffect(() => {
    try {
      const title = localStorage.getItem('print_title') || 'Modul Ajar';
      const html = localStorage.getItem('print_content_html') || '';
      setPrintData({ title, html });
      document.title = title;
    } catch (e) {
      console.error('Gagal memuat konten print:', e);
    }
  }, []);

  useEffect(() => {
    if (printData?.html) {
      const timer = setTimeout(() => {
        window.print();
        try {
          window.close();
        } catch (e) {
          console.error('Gagal menutup jendela cetak otomatis:', e);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [printData]);

  if (!printData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-600 font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
        <p className="text-sm">Menyiapkan dokumen cetak...</p>
      </div>
    );
  }

  return (
    <div className="prose max-w-full text-justify leading-relaxed p-0 m-0 bg-white text-black font-serif">
      <style>{`
        @page {
          size: A4 portrait;
          margin: 25mm 25mm 25mm 30mm;
        }
        body {
          margin: 0;
          padding: 0;
          background-color: #ffffff !important;
          color: #000000 !important;
          font-family: Cambria, Aptos, Calibri, 'Times New Roman', serif;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .prose {
          font-size: 11pt;
          line-height: 1.6;
          text-align: justify;
          color: #000000;
        }
        h1, h2, h3, h4 {
          page-break-after: avoid;
          color: #000000;
          margin-top: 1.2em;
          margin-bottom: 0.4em;
        }
        h1 { font-size: 18pt; font-weight: bold; text-align: center; margin-bottom: 1em; }
        h2 { font-size: 14pt; font-weight: bold; border-bottom: 1.5px solid #000000; padding-bottom: 3px; margin-top: 1.5em; }
        h3 { font-size: 12pt; font-weight: bold; }
        p { margin-top: 0; margin-bottom: 0.8em; }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.2em 0;
          font-size: 10.5pt;
          page-break-inside: auto;
        }
        tr {
          page-break-inside: avoid;
          page-break-after: auto;
        }
        th, td {
          border: 1px solid #475569;
          padding: 8px 10px;
          text-align: left;
          vertical-align: top;
        }
        th {
          background-color: #f1f5f9;
          font-weight: bold;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        ol, ul {
          margin-top: 0;
          margin-bottom: 1em;
          padding-left: 20px;
        }
        li {
          margin-bottom: 0.25em;
        }
      `}</style>
      <div dangerouslySetInnerHTML={{ __html: printData.html }} />
    </div>
  );
}

export default function App() {
  if (isPrintMode) {
    return <PrintWindowHandler />;
  }

  // 4 main sections
  const sections = [
    { title: 'KONTEKS PEMBELAJARAN', subtitle: 'Data Utama & Fokus' },
    { title: 'TUJUAN & BUKTI BELAJAR', subtitle: 'TP, KKTP, & Evidence' },
    { title: 'PAKET PEMBELAJARAN', subtitle: 'Asesmen & Aktivitas' },
    { title: 'HASIL AKHIR', subtitle: 'Pratinjau & Dokumen' }
  ];

  const [currentStep, setCurrentStep] = useState<number>(0); // active expanded section index (0, 1, 2, 3)
  const [pipelineProgress, setPipelineProgress] = useState<{ stepName: string; percent: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fallbackActive, setFallbackActive] = useState<boolean>(false);

  // Discovery State (Section 1)
  const [discovery, setDiscovery] = useState<DiscoveryData>({
    kurikulum: 'CP 046',
    jenisSekolah: 'SMP',
    naungan: 'Kemendikbud (Sekolah)',
    sekolah: 'SMP Negeri 1 Jakarta',
    semester: 'I (Ganjil)',
    mataPelajaran: 'Ilmu Pengetahuan Alam (IPA)',
    fase: 'D',
    kelas: 'VII',
    materi: 'Sel dan Organel Penyusunnya',
    alokasiWaktu: '2 JP x 40 Menit',
    namaPenyusun: 'Guru Hebat Indonesia',
    dimensiProfil: ['Bernalar Kritis', 'Kreatif'],
    dimensiPancaCinta: [],
    dimensiPPRA: [],
    karakteristikSiswa: 'Siswa aktif, heterogen, beberapa memiliki gaya belajar visual dan kinestetik.',
    catatanTambahan: 'Fokus pada pembelajaran aktif dengan praktikum sederhana.'
  });

  // Sinkronkan atribut data-mode di <html> untuk dual-palette CSS
  // (Non-destruktif — hanya set attribute, tidak mengubah state React lain)
  useEffect(() => {
    const mode = discovery.kurikulum === 'KMA 1503' ? 'kemenag' : 'kemendikbud';
    document.documentElement.dataset.mode = mode;
  }, [discovery.kurikulum]);

  // Section 2 States
  const [cpAnalysis, setCpAnalysis] = useState<CPAnalysis | null>(null);
  const [tps, setTps] = useState<TPItem[]>([]);
  const [successCriteria, setSuccessCriteria] = useState<SuccessCriterion[]>([]);
  const [bigIdeaData, setBigIdeaData] = useState<BigIdeaData | null>(null);
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);

  // Section 3 States
  const [assessment, setAssessment] = useState<AssessmentData | null>(null);
  const [experience, setExperience] = useState<LearningExperience | null>(null);
  const [resources, setResources] = useState<LearningResources | null>(null);
  const [differentiation, setDifferentiation] = useState<Differentiation | null>(null);

  // Section 4 States
  const [compiledModule, setCompiledModule] = useState<CompiledModule | null>(null);
  const [editedHtml, setEditedHtml] = useState<string>('');
  const [editedLkpdHtml, setEditedLkpdHtml] = useState<string>('');
  const [editedBahanAjarHtml, setEditedBahanAjarHtml] = useState<string>('');
  const [downloadingPdf, setDownloadingPdf] = useState<boolean>(false);

  // ----------------- PIPELINE CHAIN HANDLERS -----------------

  // Triggered when Section 1 is submitted -> Runs sequential AI generation for Section 2
  const handleSection1Submit = async () => {
    setPipelineProgress({ stepName: 'Menganalisis Capaian Pembelajaran (CP)...', percent: 15 });
    setErrorMsg(null);
    try {
      // 1. Analyze CP
      let cpRaw = '';
      if ((discovery.materi || '').toLowerCase().includes("sel") && (discovery.mataPelajaran || '').toLowerCase().includes("ipa")) {
        cpRaw = `Peserta didik memahami sel sebagai unit terkecil kehidupan serta mengidentifikasi organel penyusun sel beserta fungsinya pada makhluk hidup.`;
      }
      
      const cpResponse = await fetch('/api/design/analyze-cp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...discovery, cpRawText: cpRaw })
      });
      if (!cpResponse.ok) throw new Error('Gagal menganalisis Capaian Pembelajaran.');
      if (cpResponse.headers.get('x-reliable-fallback') === 'true') setFallbackActive(true);
      const cpData = await cpResponse.json();
      setCpAnalysis(cpData);

      // Handle corrected spelling for topic (materi)
      let activeDiscovery = { ...discovery };
      if (cpData.correctedMateri) {
        activeDiscovery.materi = cpData.correctedMateri;
        setDiscovery(prev => ({ ...prev, materi: cpData.correctedMateri }));
      }

      // 2. Generate TPs
      setPipelineProgress({ stepName: 'Merumuskan Tujuan Pembelajaran (TP) terukur...', percent: 40 });
      const tpResponse = await fetch('/api/design/generate-tps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discovery: activeDiscovery, cpAnalysis: cpData })
      });
      if (!tpResponse.ok) throw new Error('Gagal memecah Tujuan Pembelajaran.');
      if (tpResponse.headers.get('x-reliable-fallback') === 'true') setFallbackActive(true);
      const tpData = await tpResponse.json();
      const mappedTps: TPItem[] = tpData.map((item: any, index: number) => ({
        id: item.id || `tp-${index + 1}`,
        text: item.text,
        selected: true
      }));
      setTps(mappedTps);

      // 3. Generate KKTP
      setPipelineProgress({ stepName: 'Merancang Kriteria Keberhasilan (KKTP)...', percent: 65 });
      const kktpResponse = await fetch('/api/design/generate-kktp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedTps: mappedTps, discovery: activeDiscovery })
      });
      if (!kktpResponse.ok) throw new Error('Gagal merancang KKTP.');
      if (kktpResponse.headers.get('x-reliable-fallback') === 'true') setFallbackActive(true);
      const kktpData = await kktpResponse.json();
      const mappedSc: SuccessCriterion[] = kktpData.map((item: any, index: number) => ({
        id: item.id || `sc-${index + 1}`,
        tpId: item.tpId,
        tpText: item.tpText,
        text: item.text,
        selected: true
      }));
      setSuccessCriteria(mappedSc);

      // 4. Generate Big Idea
      setPipelineProgress({ stepName: 'Mengidentifikasi Ide Besar & Pertanyaan Pemantik...', percent: 80 });
      const bigIdeaResponse = await fetch('/api/design/generate-big-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedTps: mappedTps, successCriteria: mappedSc, discovery: activeDiscovery })
      });
      if (!bigIdeaResponse.ok) throw new Error('Gagal merumuskan Ide Besar.');
      if (bigIdeaResponse.headers.get('x-reliable-fallback') === 'true') setFallbackActive(true);
      const bigIdeaVal = await bigIdeaResponse.json();
      setBigIdeaData(bigIdeaVal);

      // 5. Generate Evidence
      setPipelineProgress({ stepName: 'Menggali pilihan Bukti Belajar (Evidence)...', percent: 95 });
      const evidenceResponse = await fetch('/api/design/generate-evidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          discovery: activeDiscovery,
          selectedTps: mappedTps,
          successCriteria: mappedSc,
          bigIdea: bigIdeaVal.bigIdea,
          essentialQuestions: bigIdeaVal.essentialQuestions
        })
      });
      if (!evidenceResponse.ok) throw new Error('Gagal merumuskan Bukti Belajar.');
      if (evidenceResponse.headers.get('x-reliable-fallback') === 'true') setFallbackActive(true);
      const evidenceData = await evidenceResponse.json();
      const mappedEv: EvidenceItem[] = evidenceData.map((item: any, index: number) => ({
        id: item.id || `ev-${index + 1}`,
        title: item.title,
        description: item.description,
        rationale: item.rationale,
        selected: index === 0
      }));
      setEvidence(mappedEv);

      // Complete Section 1
      setCurrentStep(1);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal dalam proses kompilasi awal AI.');
    } finally {
      setPipelineProgress(null);
    }
  };

  // Triggered when Section 2 is submitted -> Runs sequential AI generation for Section 3
  const handleSection2Submit = async () => {
    const selectedEv = evidence.filter(e => e.selected);
    if (selectedEv.length === 0) {
      setErrorMsg('Pilih minimal satu Bukti Pembelajaran (Evidence) untuk melanjutkan.');
      return;
    }
    setPipelineProgress({ stepName: 'Merancang Asesmen Diagnostik, Formatif, & Sumatif...', percent: 30 });
    setErrorMsg(null);
    try {
      // 1. Generate Assessment
      const assResponse = await fetch('/api/design/generate-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          discovery,
          selectedEvidence: selectedEv,
          successCriteria: successCriteria.filter(s => s.selected)
        })
      });
      if (!assResponse.ok) throw new Error('Gagal merancang Asesmen.');
      if (assResponse.headers.get('x-reliable-fallback') === 'true') setFallbackActive(true);
      const assData = await assResponse.json();
      setAssessment(assData);

      // 2. Generate Experience & Resources
      setPipelineProgress({ stepName: 'Menyusun Skenario Pembelajaran & Alokasi Aktivitas...', percent: 75 });
      const blueprint: LearningBlueprint = {
        discovery,
        cpAnalysis: cpAnalysis!,
        tps,
        successCriteria,
        bigIdea: bigIdeaData!,
        evidence,
        assessment: assData,
        modelPembelajaran: 'Problem Based Learning (PBL)',
        strategiPembelajaran: 'Diskusi Kelompok, Eksperimen Terbimbing, Penyelidikan Mandiri'
      };

      const expResponse = await fetch('/api/design/generate-experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blueprint })
      });
      if (!expResponse.ok) throw new Error('Gagal merancang skenario aktivitas.');
      if (expResponse.headers.get('x-reliable-fallback') === 'true') setFallbackActive(true);
      const expData = await expResponse.json();

      setExperience(expData.experience);
      setResources(expData.resources);
      setDifferentiation(expData.differentiation);

      // Complete Section 2
      setCurrentStep(2);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal dalam perumusan paket belajar AI.');
    } finally {
      setPipelineProgress(null);
    }
  };

  // Refresh Section 3 based on modifications in Section 2
  const handleSection3Refresh = () => {
    handleSection2Submit();
  };

  // Triggered when Section 3 is submitted -> Advance to Section 4
  const handleSection3Submit = () => {
    setCurrentStep(3);
  };

  // Triggered when compiling final module
  const handleCompileModule = async () => {
    if (!experience || !resources || !differentiation || !bigIdeaData || !assessment) return;
    setPipelineProgress({ stepName: 'Merakit seluruh rancangan ke dokumen akhir...', percent: 50 });
    setErrorMsg(null);
    try {
      const blueprint: LearningBlueprint = {
        discovery,
        cpAnalysis: cpAnalysis!,
        tps,
        successCriteria,
        bigIdea: bigIdeaData,
        evidence,
        assessment,
        modelPembelajaran: experience.modelPembelajaran,
        strategiPembelajaran: experience.strategiPembelajaran
      };

      const response = await fetch('/api/design/compile-module', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blueprint,
          experience,
          resources,
          differentiation,
          digitalIntegration: {
            platforms: ['Quizizz', 'Google Slides', 'PhET Interactive Simulations'],
            justification: 'Meningkatkan keterlibatan aktif siswa dalam mengeksplorasi sel secara interaktif.'
          }
        })
      });
      if (!response.ok) throw new Error('Gagal mengkompilasi dokumen Modul Ajar.');
      if (response.headers.get('x-reliable-fallback') === 'true') setFallbackActive(true);
      const data = await response.json();

      // Ensure that we apply 1.15 line-spacing globally to the html
      let adjustedHtml = data.htmlContent;
      if (!adjustedHtml.includes('line-height:')) {
        adjustedHtml = adjustedHtml.replace(
          /<div class="prose"/g, 
          '<div class="prose" style="line-height: 1.25; font-family: Cambria, Aptos, serif;"'
        );
      }

      // Generate LKPD
      setPipelineProgress({ stepName: 'Merancang Lembar Kerja Peserta Didik (LKPD) kelompok...', percent: 70 });
      let lkpdData = null;
      try {
        const lkpdRes = await fetch('/api/design/generate-lkpd', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ blueprint, experience })
        });
        if (lkpdRes.ok) {
          lkpdData = await lkpdRes.json();
        }
      } catch (lkpdErr) {
        console.error("Gagal men-generate LKPD:", lkpdErr);
      }

      // Generate Bahan Ajar
      setPipelineProgress({ stepName: 'Merancang Bahan Ajar Pendamping Mandiri...', percent: 85 });
      let bahanAjarData = null;
      try {
        const baRes = await fetch('/api/design/generate-bahan-ajar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ blueprint })
        });
        if (baRes.ok) {
          bahanAjarData = await baRes.json();
        }
      } catch (baErr) {
        console.error("Gagal men-generate Bahan Ajar:", baErr);
      }

      const newModule: CompiledModule = {
        id: `module-${Date.now()}`,
        title: data.title,
        createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        blueprint,
        experience,
        resources,
        digitalIntegration: null as any,
        differentiation,
        htmlContent: adjustedHtml,
        lkpdHtml: lkpdData?.htmlContent || '',
        lkpdTitle: lkpdData?.title || `LKPD - ${blueprint.discovery.materi}`,
        bahanAjarHtml: bahanAjarData?.htmlContent || '',
        bahanAjarTitle: bahanAjarData?.title || `Bahan Ajar - ${blueprint.discovery.materi}`
      };

      setCompiledModule(newModule);
      setEditedHtml(adjustedHtml);
      setEditedLkpdHtml(newModule.lkpdHtml || '');
      setEditedBahanAjarHtml(newModule.bahanAjarHtml || '');
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyusun modul ajar.');
    } finally {
      setPipelineProgress(null);
    }
  };

  // ----------------- OUTPUT OPERATIONS -----------------

  const handleCopyModule = (activeTab: string = 'modul') => {
    const html = activeTab === 'lkpd' ? editedLkpdHtml : activeTab === 'bahan_ajar' ? editedBahanAjarHtml : editedHtml;
    const el = document.createElement('div');
    el.innerHTML = html;
    const text = el.innerText;
    navigator.clipboard.writeText(text);
  };

  const handleDownloadHtml = (activeTab: string = 'modul') => {
    const html = activeTab === 'lkpd' ? editedLkpdHtml : activeTab === 'bahan_ajar' ? editedBahanAjarHtml : editedHtml;
    const title = activeTab === 'lkpd' 
      ? (compiledModule?.lkpdTitle || 'LKPD') 
      : activeTab === 'bahan_ajar' 
        ? (compiledModule?.bahanAjarTitle || 'Bahan-Ajar') 
        : (compiledModule?.title || 'Modul-Ajar');
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title}.html`;
    link.click();
  };

  const prepareHtmlForExport = (html: string, isWord: boolean = false) => {
    const element = document.createElement('div');
    element.innerHTML = html;

    // 1. Differentiate and style tables
    const tables = element.getElementsByTagName('table');
    for (let i = 0; i < tables.length; i++) {
      const table = tables[i];
      const tableText = table.innerText || table.textContent || '';
      const isLayoutTable = tableText.includes('Nama Penyusun') || tableText.includes('Mengetahui') || tableText.includes('NIP.');

      table.style.width = '100%';
      table.style.borderCollapse = 'collapse';
      table.style.marginTop = '12px';
      table.style.marginBottom = '12px';

      const cells = table.querySelectorAll('th, td');
      cells.forEach((cell: any) => {
        cell.style.padding = '8px 10px';
        cell.style.verticalAlign = 'top';
        cell.style.lineHeight = '1.25';
        
        if (isWord) {
          cell.style.fontSize = '10.0pt';
        } else {
          cell.style.fontSize = '9.5pt';
        }

        if (isLayoutTable) {
          // Keep layout/signature/identitas tables free from clunky grid boxes
          cell.style.border = 'none';
          if (tableText.includes('Nama Penyusun')) {
            // Retain clear horizontal dividing lines for the Identitas table
            cell.style.borderBottom = '1px solid #cbd5e1';
          }
        } else {
          // Proper data tables get complete borders
          cell.style.border = '1px solid #cbd5e1';
        }
      });

      const headers = table.querySelectorAll('th');
      headers.forEach((h: any) => {
        h.style.backgroundColor = '#f1f5f9';
        h.style.fontWeight = 'bold';
      });
    }

    // 2. Fix text alignment: remove text-justify to avoid overlapping or missing spaces in PDF renderers (html2canvas)
    const allDivs = element.querySelectorAll('div, p, td, span, ul, li');
    allDivs.forEach((el: any) => {
      if (el.style && (el.style.textAlign === 'justify' || el.classList.contains('text-justify'))) {
        el.style.textAlign = 'left';
        el.classList.remove('text-justify');
      }
    });

    const justifiedElements = element.querySelectorAll('[style*="justify"]');
    justifiedElements.forEach((el: any) => {
      el.style.textAlign = 'left';
    });

    // 3. Prevent inline tags/badges from running together in Word
    let processedHtml = element.innerHTML;
    processedHtml = processedHtml.replace(/<\/span>\s*<span/g, '</span> &nbsp;&bull;&nbsp; <span');
    
    return processedHtml;
  };

  const handleDownloadWord = (activeTab: string = 'modul') => {
    const rawHtml = activeTab === 'lkpd' ? editedLkpdHtml : activeTab === 'bahan_ajar' ? editedBahanAjarHtml : editedHtml;
    const title = activeTab === 'lkpd' 
      ? (compiledModule?.lkpdTitle || 'LKPD') 
      : activeTab === 'bahan_ajar' 
        ? (compiledModule?.bahanAjarTitle || 'Bahan-Ajar') 
        : (compiledModule?.title || 'Modul-Ajar');
    const cleanHtml = prepareHtmlForExport(rawHtml, true);
    
    // Generate beautiful clean Word Document format with custom 1.15 line spacing style
    const htmlString = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <title>${title}</title>
        <style>
          @page Section1 {
            size: 595.3pt 841.9pt; /* A4 size */
            margin: 72.0pt 72.0pt 72.0pt 81.0pt; /* Margins: top 2.54cm, left 2.85cm */
            mso-header-margin: 35.4pt;
            mso-footer-margin: 35.4pt;
            mso-paper-source: 0;
          }
          div.Section1 { page: Section1; }
          body {
            font-family: 'Cambria', 'Aptos', 'Calibri', serif;
            font-size: 11.0pt;
            line-height: 1.15; /* Request 1.15 exactly */
            text-align: left;
          }
          h1, h2, h3, h4 {
            font-family: 'Cambria', 'Aptos', 'Calibri', serif;
            font-weight: bold;
            color: #000000;
            margin-top: 12.0pt;
            margin-bottom: 6.0pt;
          }
          h1 { font-size: 18.0pt; text-align: center; margin-bottom: 18.0pt; }
          h2 { font-size: 14.0pt; border-bottom: 1px solid #334155; padding-bottom: 3px; margin-top: 18.0pt; }
          h3 { font-size: 12.0pt; }
          p { margin: 0 0 6.0pt 0; }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 12.0pt 0;
          }
          th, td {
            padding: 8px 10px;
            font-size: 10.0pt;
            text-align: left;
            vertical-align: top;
          }
          th {
            background-color: #F1F5F9;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="Section1">
          ${cleanHtml}
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + htmlString], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title}.doc`;
    link.click();
  };

  const handleDownloadPdf = (activeTab: string = 'modul') => {
    setDownloadingPdf(true);
    const rawHtml = activeTab === 'lkpd' ? editedLkpdHtml : activeTab === 'bahan_ajar' ? editedBahanAjarHtml : editedHtml;
    const title = activeTab === 'lkpd' 
      ? (compiledModule?.lkpdTitle || 'LKPD') 
      : activeTab === 'bahan_ajar' 
        ? (compiledModule?.bahanAjarTitle || 'Bahan-Ajar') 
        : (compiledModule?.title || 'Modul-Ajar');

    const element = document.createElement('div');
    element.innerHTML = prepareHtmlForExport(rawHtml, false);
    // Apply clean print aesthetics
    element.style.padding = '30px';
    element.style.background = '#ffffff';
    element.style.color = '#000000';
    element.style.fontFamily = "Cambria, Aptos, 'Times New Roman', Georgia, serif";
    element.style.lineHeight = '1.25'; // Custom clean line height

    const opt = {
      margin:       [20, 20, 20, 25], // top, left, bottom, right in mm
      filename:     `${title}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2.2, useCORS: true, logging: false },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf()
      .set(opt as any)
      .from(element)
      .save()
      .then(() => {
        setDownloadingPdf(false);
      })
      .catch((err: any) => {
        console.error('Gagal membuat PDF:', err);
        setDownloadingPdf(false);
        alert('Gagal membuat PDF secara otomatis. Silakan gunakan tombol Simpan HTML atau Salin Modul sebagai cadangan.');
      });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900">
      
      {/* Top Professional Header */}
      <header className="bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] text-white py-4.5 px-6 shadow-md shrink-0">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl border border-white/20 shadow-inner">
              <School className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight font-sans">AI Instructional Designer Indonesia</h1>
              <p className="text-xs text-indigo-100 font-medium">Asisten Perancang Perangkat Pembelajaran (Backward Design)</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
            <ModeBadge kurikulum={discovery.kurikulum} />
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/25 text-xs shadow-inner">
              <span className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></span>
              <span className="font-semibold text-white">Aktif</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mode Handal Fallback Banner */}
      {fallbackActive && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-3 text-xs md:text-sm flex items-center shrink-0">
          <div className="max-w-5xl mx-auto w-full flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0 animate-pulse" />
              <span>
                <strong>Mode Handal Aktif:</strong> Menggunakan mesin perancang lokal otomatis karena kuota API Gemini eksternal sedang penuh atau tidak tersedia. Modul Ajar tetap dirancang dengan standar kualitas tinggi secara instan.
              </span>
            </div>
            <button 
              onClick={() => setFallbackActive(false)} 
              className="bg-amber-200/50 hover:bg-amber-200 text-amber-900 font-semibold px-2.5 py-1 rounded-md text-xs cursor-pointer transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Sequential Loader Overlay */}
      {pipelineProgress && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-xl border border-slate-100 text-center space-y-4">
            <div className="relative w-16 h-16 mx-auto">
              <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-indigo-700">
                {pipelineProgress.percent}%
              </div>
            </div>
            <div className="space-y-1.5">
              <h4 className="font-bold text-slate-800 text-sm">Sedang merancang pembelajaran...</h4>
              <p className="text-xs text-slate-500 font-light leading-relaxed">{pipelineProgress.stepName}</p>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300" 
                style={{ width: `${pipelineProgress.percent}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-slate-400 font-medium italic">Sistem AI menganalisis keselarasan vertikal antara TP, KKTP, Asesmen, dan Skenario...</p>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {errorMsg && (
        <div className="max-w-5xl mx-auto mt-4 w-full px-4">
          <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-xl shadow-xs flex items-start gap-3">
            <Info className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-rose-800 text-xs uppercase tracking-wider">Terjadi Kendala</h5>
              <p className="text-xs text-rose-700 mt-1">{errorMsg}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace Layout (4 Sections) */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6 space-y-6">

        {/* Landing Hero — hanya tampil saat wizard belum dimulai */}
        {currentStep === 0 && !cpAnalysis && <LandingHero />}

        {/* Section 1: Konteks Pembelajaran */}
        <KonteksSection
          discovery={discovery}
          setDiscovery={setDiscovery}
          isCollapsed={currentStep > 0}
          onExpand={() => setCurrentStep(0)}
          onSubmit={handleSection1Submit}
          loading={pipelineProgress !== null}
        />

        {/* Section 2: Tujuan & Bukti Belajar */}
        <TujuanBuktiSection
          discovery={discovery}
          setDiscovery={setDiscovery}
          cpAnalysis={cpAnalysis}
          tps={tps}
          setTps={setTps}
          successCriteria={successCriteria}
          setSuccessCriteria={setSuccessCriteria}
          bigIdeaData={bigIdeaData}
          setBigIdeaData={setBigIdeaData}
          evidence={evidence}
          setEvidence={setEvidence}
          isCollapsed={currentStep !== 1}
          onExpand={() => setCurrentStep(1)}
          onSubmit={handleSection2Submit}
          loading={pipelineProgress !== null}
          disabled={!cpAnalysis}
        />

        {/* Section 3: Paket Pembelajaran */}
        <PaketSection
          assessment={assessment}
          setAssessment={setAssessment}
          experience={experience}
          setExperience={setExperience}
          resources={resources}
          setResources={setResources}
          differentiation={differentiation}
          setDifferentiation={setDifferentiation}
          isCollapsed={currentStep !== 2}
          onExpand={() => setCurrentStep(2)}
          onSubmit={handleSection3Submit}
          onRefreshAI={handleSection3Refresh}
          loading={pipelineProgress !== null}
          disabled={!assessment}
        />

        {/* Section 4: Hasil Akhir */}
        <HasilAkhirSection
          compiledModule={compiledModule}
          editedHtml={editedHtml}
          setEditedHtml={setEditedHtml}
          editedLkpdHtml={editedLkpdHtml}
          setEditedLkpdHtml={setEditedLkpdHtml}
          editedBahanAjarHtml={editedBahanAjarHtml}
          setEditedBahanAjarHtml={setEditedBahanAjarHtml}
          onCompile={handleCompileModule}
          onCopy={handleCopyModule}
          onDownloadHtml={handleDownloadHtml}
          onDownloadWord={handleDownloadWord}
          onDownloadPdf={handleDownloadPdf}
          downloadingPdf={downloadingPdf}
          compiling={pipelineProgress !== null}
          disabled={!experience}
        />

      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-6 border-t border-slate-800 text-center text-xs shrink-0 mt-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 AI Instructional Designer Indonesia. Hak Cipta Dilindungi Undang-Undang.</p>
          <p className="font-light text-slate-500">Mendorong Pembelajaran Bermakna & Desain Kurikulum Berkualitas Tinggi</p>
        </div>
      </footer>
    </div>
  );
}
