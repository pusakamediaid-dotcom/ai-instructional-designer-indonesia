import React, { useState } from 'react';
import { 
  Award, ArrowRight, Check, Plus, Trash2, Edit2, Lightbulb, HelpCircle, 
  ChevronRight, BookMarked, Layers, Eye, AlertTriangle, CheckCircle, Clock
} from 'lucide-react';
import { DiscoveryData, TPItem, SuccessCriterion, BigIdeaData, EvidenceItem, CPAnalysis } from '../types';
import { analyzeTimeProportionality } from '../utils/timeValidation';

interface TujuanBuktiSectionProps {
  discovery: DiscoveryData;
  setDiscovery: React.Dispatch<React.SetStateAction<DiscoveryData>>;
  cpAnalysis: CPAnalysis | null;
  tps: TPItem[];
  setTps: React.Dispatch<React.SetStateAction<TPItem[]>>;
  successCriteria: SuccessCriterion[];
  setSuccessCriteria: React.Dispatch<React.SetStateAction<SuccessCriterion[]>>;
  bigIdeaData: BigIdeaData | null;
  setBigIdeaData: React.Dispatch<React.SetStateAction<BigIdeaData | null>>;
  evidence: EvidenceItem[];
  setEvidence: React.Dispatch<React.SetStateAction<EvidenceItem[]>>;
  isCollapsed: boolean;
  onExpand: () => void;
  onSubmit: () => void;
  loading: boolean;
  disabled: boolean;
}

const PILIHAN_PANCASILA = [
  'Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia',
  'Berkebinekaan Global',
  'Gotong Royong',
  'Mandiri',
  'Bernalar Kritis',
  'Kreatif'
];

const PILIHAN_PANCA_CINTA = [
  'Cinta kepada Allah SWT dan Rasul-Nya',
  'Cinta Tanah Air / Negara Kesatuan Republik Indonesia',
  'Cinta Sesama Manusia',
  'Cinta Lingkungan Hidup / Alam Semesta',
  'Cinta Ilmu Pengetahuan dan Teknologi / Kebenaran'
];

const PILIHAN_PPRA = [
  'Berkeadaban (Ta’addub)',
  'Keteladan (Qudwah)',
  'Kewarganegaraan dan Kebangsaan (Muwatanah)',
  'Mengambil Jalan Tengah (Tawassut)',
  'Berimbang (Tawazun)',
  'Lurus dan Tegas (I’tidal)',
  'Kesetaraan (Musawah)',
  'Musyawarah (Syura)',
  'Toleransi (Tasamuh)',
  'Dinamis dan Inovatif (Tathawwur wa Ibtikar)'
];

export default function TujuanBuktiSection({
  discovery,
  setDiscovery,
  cpAnalysis,
  tps,
  setTps,
  successCriteria,
  setSuccessCriteria,
  bigIdeaData,
  setBigIdeaData,
  evidence,
  setEvidence,
  isCollapsed,
  onExpand,
  onSubmit,
  loading,
  disabled
}: TujuanBuktiSectionProps) {

  const [newTp, setNewTp] = useState('');
  const [newSc, setNewSc] = useState('');
  const [newScTpId, setNewScTpId] = useState('');
  const [newEq, setNewEq] = useState('');
  const [newEvTitle, setNewEvTitle] = useState('');
  const [newEvDesc, setNewEvDesc] = useState('');
  const [newEvRationale, setNewEvRationale] = useState('');
  const [showAiDetail, setShowAiDetail] = useState(false);

  if (disabled) {
    return (
      <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-6 opacity-60 cursor-not-allowed">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold">
            2
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-400">Section 2: Tujuan & Bukti Belajar</h3>
            <p className="text-xs text-slate-400 mt-0.5">Menunggu pengisian Konteks Pembelajaran selesai...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isCollapsed) {
    const selectedTps = tps.filter(t => t.selected).length;
    const selectedScs = successCriteria.filter(s => s.selected).length;
    const selectedEv = evidence.filter(e => e.selected)[0];

    return (
      <div 
        onClick={onExpand}
        className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                🎯 Section 2: Tujuan & Bukti Belajar
                <span className="text-xs font-normal text-emerald-600">(Selesai - Klik untuk mengubah)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedTps} Tujuan Pembelajaran • {selectedScs} KKTP Indikator • Bukti: {selectedEv ? selectedEv.title : 'Belum Terpilih'}
              </p>
            </div>
          </div>
          <button className="text-indigo-600 hover:text-indigo-700 text-xs font-semibold inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Edit2 className="w-3 h-3" />
            Ubah
          </button>
        </div>
      </div>
    );
  }

  // Add custom elements
  const handleAddTp = () => {
    if (!newTp.trim()) return;
    setTps(prev => [
      ...prev,
      { id: `tp-custom-${Date.now()}`, text: newTp.trim(), selected: true }
    ]);
    setNewTp('');
  };

  const handleDeleteTp = (id: string) => {
    setTps(prev => prev.filter(t => t.id !== id));
    setSuccessCriteria(prev => prev.filter(s => s.tpId !== id));
  };

  const handleToggleTp = (id: string) => {
    setTps(prev => prev.map(t => t.id === id ? { ...t, selected: !t.selected } : t));
  };

  const handleAddSc = () => {
    if (!newSc.trim() || !newScTpId) return;
    const relatedTp = tps.find(t => t.id === newScTpId);
    setSuccessCriteria(prev => [
      ...prev,
      { 
        id: `sc-custom-${Date.now()}`, 
        tpId: newScTpId, 
        tpText: relatedTp ? relatedTp.text : '', 
        text: newSc.trim(), 
        selected: true 
      }
    ]);
    setNewSc('');
  };

  const handleDeleteSc = (id: string) => {
    setSuccessCriteria(prev => prev.filter(s => s.id !== id));
  };

  const handleToggleSc = (id: string) => {
    setSuccessCriteria(prev => prev.map(s => s.id === id ? { ...s, selected: !s.selected } : s));
  };

  const handleAddEq = () => {
    if (!newEq.trim() || !bigIdeaData) return;
    setBigIdeaData({
      ...bigIdeaData,
      essentialQuestions: [...bigIdeaData.essentialQuestions, newEq.trim()]
    });
    setNewEq('');
  };

  const handleDeleteEq = (index: number) => {
    if (!bigIdeaData) return;
    setBigIdeaData({
      ...bigIdeaData,
      essentialQuestions: bigIdeaData.essentialQuestions.filter((_, i) => i !== index)
    });
  };

  const handleAddEvidence = () => {
    if (!newEvTitle.trim() || !newEvDesc.trim()) return;
    setEvidence(prev => [
      ...prev,
      {
        id: `ev-custom-${Date.now()}`,
        title: newEvTitle.trim(),
        description: newEvDesc.trim(),
        rationale: newEvRationale.trim() || 'Ditambahkan secara manual oleh guru.',
        selected: true
      }
    ]);
    setNewEvTitle('');
    setNewEvDesc('');
    setNewEvRationale('');
  };

  const handleToggleEvidence = (id: string) => {
    setEvidence(prev => prev.map(e => e.id === id ? { ...e, selected: !e.selected } : e));
  };

  const handleTogglePancasila = (item: string) => {
    const current = discovery.dimensiProfil || [];
    const next = current.includes(item) ? current.filter(x => x !== item) : [...current, item];
    setDiscovery(prev => ({ ...prev, dimensiProfil: next }));
  };

  const handleTogglePancaCinta = (item: string) => {
    const current = discovery.dimensiPancaCinta || [];
    const next = current.includes(item) ? current.filter(x => x !== item) : [...current, item];
    setDiscovery(prev => ({ ...prev, dimensiPancaCinta: next }));
  };

  const handleTogglePPRA = (item: string) => {
    const current = discovery.dimensiPPRA || [];
    const next = current.includes(item) ? current.filter(x => x !== item) : [...current, item];
    setDiscovery(prev => ({ ...prev, dimensiPPRA: next }));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
      <div className="border-b border-slate-100 bg-slate-50/50 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            Section 2: Tujuan & Bukti Belajar (Review & Edit)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            AI telah menganalisis kompetensi, mengidentifikasi materi esensial, merumuskan tujuan, indikator keberhasilan, ide besar, serta bukti belajar terbaik secara otomatis.
          </p>
        </div>
        <button
          onClick={() => setShowAiDetail(!showAiDetail)}
          className="shrink-0 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3 py-2 rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          {showAiDetail ? 'Sembunyikan Analisis CP' : 'Lihat Analisis Akademis CP'}
        </button>
      </div>

      {showAiDetail && cpAnalysis && (
        <div className="p-6 bg-indigo-50/30 border-b border-slate-100 space-y-4">
          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Hasil Analisis Akademis Capaian Pembelajaran (CP)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-100 p-4 rounded-xl">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Kompetensi Inti</span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {cpAnalysis.kompetensi.map((komp, idx) => (
                  <span key={idx} className="bg-indigo-50 text-indigo-700 border border-indigo-100/50 px-2 py-0.5 rounded-md text-[11px] font-medium">
                    {komp}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-white border border-slate-100 p-4 rounded-xl">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Lingkup Materi Inti</span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {cpAnalysis.lingkupMateri.map((mat, idx) => (
                  <span key={idx} className="bg-emerald-50 text-emerald-700 border border-emerald-100/50 px-2 py-0.5 rounded-md text-[11px] font-medium">
                    {mat}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-white border border-slate-100 p-4 rounded-xl text-xs text-slate-600 leading-relaxed">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Kedalaman & Tingkat Ekspektasi Pembelajaran</span>
            {cpAnalysis.kedalamanMateri}
          </div>
        </div>
      )}

      <div className="p-6 space-y-8">
        
        {/* ANALISIS ALOKASI WAKTU DAN BEBAN BELAJAR */}
        {(() => {
          const analysis = analyzeTimeProportionality(discovery, tps, successCriteria);
          if (analysis.selectedTpsCount === 0) return null;
          
          return (
            <div className={`p-4 rounded-2xl border transition-all duration-200 ${
              analysis.status === 'TERLALU_PADAT'
                ? 'bg-amber-50/40 border-amber-200 text-slate-800'
                : analysis.status === 'TERLALU_LONGGAR'
                  ? 'bg-blue-50/40 border-blue-200 text-slate-800'
                  : 'bg-emerald-50/30 border-emerald-200 text-slate-800'
            }`}>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {analysis.status === 'TERLALU_PADAT' ? (
                    <AlertTriangle className="w-5 h-5 text-amber-600 animate-pulse" />
                  ) : analysis.status === 'TERLALU_LONGGAR' ? (
                    <Clock className="w-5 h-5 text-blue-600" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  )}
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wide flex items-center gap-1 text-slate-800">
                      🔍 Evaluasi Alokasi Waktu & Beban Belajar:
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-sans ${
                        analysis.status === 'TERLALU_PADAT'
                          ? 'bg-amber-100 text-amber-800'
                          : analysis.status === 'TERLALU_LONGGAR'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {analysis.status === 'TERLALU_PADAT' ? '⚠️ Terlalu Padat' : analysis.status === 'TERLALU_LONGGAR' ? 'ℹ️ Terlalu Longgar' : '✓ Proporsional & Riil'}
                      </span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Aktif: {analysis.selectedTpsCount} TP • {analysis.selectedScsCount} KKTP
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">
                    {analysis.explanation}
                  </p>
                  {analysis.status === 'TERLALU_PADAT' && (
                    <div className="pt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setDiscovery(prev => ({ ...prev, alokasiWaktu: analysis.recommendedAlokasiWaktu }))}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[11px] px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-3xs"
                      >
                        Sesuaikan Alokasi Waktu Jadi {analysis.recommendedAlokasiWaktu}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          // Uncheck extra TPs, keep only the first 1
                          setTps(prev => prev.map((tp, idx) => idx > 0 ? { ...tp, selected: false } : tp));
                        }}
                        className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium text-[11px] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        Batasi Hanya Diajarkan 1 TP (Sederhanakan Pembelajaran)
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* 1. TUJUAN PEMBELAJARAN */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
              Tujuan Pembelajaran (TP)
            </h4>
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Automated & Editable</span>
          </div>
          
          <div className="space-y-2">
            {tps.map((tp) => (
              <div 
                key={tp.id} 
                className={`flex items-start justify-between gap-3 p-3 rounded-xl border text-xs transition-all ${
                  tp.selected ? 'bg-indigo-50/20 border-indigo-100' : 'bg-slate-50/50 border-slate-200/60 opacity-60'
                }`}
              >
                <div className="flex items-start gap-2.5 flex-1">
                  <input
                    type="checkbox"
                    checked={tp.selected}
                    onChange={() => handleToggleTp(tp.id)}
                    className="mt-0.5 shrink-0 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className={`leading-relaxed ${tp.selected ? 'font-medium text-slate-900' : 'text-slate-500'}`}>{tp.text}</span>
                </div>
                <button 
                  onClick={() => handleDeleteTp(tp.id)}
                  className="text-slate-400 hover:text-red-500 p-1 rounded-md transition-colors"
                  title="Hapus TP"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-3 pt-2">
            <input
              type="text"
              value={newTp}
              onChange={(e) => setNewTp(e.target.value)}
              placeholder="Tambahkan Tujuan Pembelajaran custom di sini..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white"
            />
            <button
              onClick={handleAddTp}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah
            </button>
          </div>
        </div>

        {/* 2. KKTP / SUCCESS CRITERIA */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
              Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)
            </h4>
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-mono">Success Criteria</span>
          </div>

          <div className="space-y-2">
            {successCriteria.map((sc) => {
              const tp = tps.find(t => t.id === sc.tpId);
              if (tp && !tp.selected) return null; // Hide KKTP of unselected TPs
              return (
                <div 
                  key={sc.id} 
                  className={`flex items-start justify-between gap-3 p-3 rounded-xl border text-xs transition-all ${
                    sc.selected ? 'bg-indigo-50/20 border-indigo-100' : 'bg-slate-50/50 border-slate-200/60 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-2.5 flex-1">
                    <input
                      type="checkbox"
                      checked={sc.selected}
                      onChange={() => handleToggleSc(sc.id)}
                      className="mt-0.5 shrink-0 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="block text-[9px] font-bold text-indigo-600 uppercase tracking-wider mb-0.5">TP Terkait: {sc.tpText || (tp ? tp.text : 'Kustom')}</span>
                      <span className={`leading-relaxed ${sc.selected ? 'font-medium text-slate-900' : 'text-slate-500'}`}>{sc.text}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteSc(sc.id)}
                    className="text-slate-400 hover:text-red-500 p-1 rounded-md transition-colors"
                    title="Hapus KKTP"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 pt-2">
            <select
              value={newScTpId}
              onChange={(e) => setNewScTpId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
            >
              <option value="">Pilih Tujuan Terkait...</option>
              {tps.filter(t => t.selected).map(t => (
                <option key={t.id} value={t.id}>{t.text.substring(0, 50)}...</option>
              ))}
            </select>
            <input
              type="text"
              value={newSc}
              onChange={(e) => setNewSc(e.target.value)}
              placeholder="Ketik kriteria pencapaian / success criteria..."
              className="sm:col-span-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-hidden focus:bg-white"
            />
          </div>
          <div className="flex justify-end mt-1">
            <button
              onClick={handleAddSc}
              disabled={!newScTpId}
              className="bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 text-indigo-700 px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Kriteria
            </button>
          </div>
        </div>

        {/* 3. BIG IDEA & ESSENTIAL QUESTIONS */}
        {bigIdeaData && (
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
              Ide Besar & Pertanyaan Pemantik
            </h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="bg-slate-50/50 border border-slate-150 p-4 rounded-xl space-y-2">
                <label className="text-xs font-bold text-indigo-800 uppercase tracking-wider block flex items-center gap-1">
                  <Lightbulb className="w-4 h-4 text-indigo-500" />
                  Big Idea (Pemahaman Bermakna)
                </label>
                <textarea
                  value={bigIdeaData.bigIdea}
                  onChange={(e) => setBigIdeaData({ ...bigIdeaData, bigIdea: e.target.value })}
                  rows={4}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs leading-relaxed"
                />
              </div>

              <div className="bg-slate-50/50 border border-slate-150 p-4 rounded-xl space-y-3">
                <label className="text-xs font-bold text-indigo-800 uppercase tracking-wider block flex items-center gap-1">
                  <HelpCircle className="w-4 h-4 text-indigo-500" />
                  Pertanyaan Pemantik (Essential Questions)
                </label>
                <div className="space-y-2">
                  {bigIdeaData.essentialQuestions.map((eq, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 p-2.5 rounded-xl text-xs flex justify-between gap-2 items-center">
                      <span className="leading-relaxed text-slate-700 font-medium">❓ {eq}</span>
                      <button 
                        onClick={() => handleDeleteEq(idx)}
                        className="text-slate-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newEq}
                    onChange={(e) => setNewEq(e.target.value)}
                    placeholder="Tulis pertanyaan pemantik tambahan..."
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs outline-hidden"
                  />
                  <button
                    onClick={handleAddEq}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Tambah
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. BUKTI BELAJAR (EVIDENCE) */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
              Bukti Belajar (Evidence of Learning)
            </h4>
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md uppercase tracking-wider">Penting</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evidence.map((ev) => (
              <div 
                key={ev.id} 
                className={`relative flex flex-col justify-between border rounded-2xl p-4 cursor-pointer transition-all ${
                  ev.selected 
                    ? 'bg-emerald-50/15 border-emerald-500 ring-2 ring-emerald-500/10' 
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => handleToggleEvidence(ev.id)}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${ev.selected ? 'bg-emerald-600' : 'bg-slate-300'}`}></span>
                      {ev.title}
                    </span>
                    <input
                      type="checkbox"
                      checked={ev.selected}
                      onChange={() => {}} // Swallowed, handled by parent div click
                      className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 shrink-0"
                    />
                  </div>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">{ev.description}</p>
                </div>
                {ev.rationale && (
                  <div className="mt-3 pt-3 border-t border-slate-100/60 text-[10px] text-indigo-700 bg-indigo-50/40 p-2 rounded-lg leading-relaxed">
                    <strong>Alasan Pedagogis:</strong> {ev.rationale}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl space-y-3">
            <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Plus className="w-4 h-4 text-indigo-600" />
              Buat Bukti Belajar Mandiri (Kustom)
            </h5>

            {/* Quick Suggestions Row */}
            {(() => {
              const materiDefault = discovery?.materi || 'Materi';
              const SUGGESTIONS = [
                {
                  label: '🖼️ Poster Ilmiah',
                  title: `Poster Ilmiah: Visualisasi Konsep ${materiDefault}`,
                  description: `Siswa merancang poster infografis secara berkelompok yang menjelaskan struktur, fungsi, dan keterkaitan komponen dalam ${materiDefault} secara mendalam disertai rekomendasi solusi kontekstual.`,
                  rationale: `Mengukur keterampilan komunikasi visual, kreativitas penyajian, serta pemahaman komprehensif terhadap konsep ${materiDefault}.`
                },
                {
                  label: '📝 Laporan Eksperimen',
                  title: `Laporan Hasil Penyelidikan & Analisis ${materiDefault}`,
                  description: `Siswa melakukan penyelidikan ilmiah/observasi terstruktur mengenai karakteristik ${materiDefault}, mengolah data temuan, dan merumuskan laporan ilmiah berkelompok.`,
                  rationale: `Mengukur keterampilan proses sains (observasi, hipotesis, pengumpulan data) dan cara penulisan kesimpulan berbasis bukti.`
                },
                {
                  label: '🎤 Presentasi Kelompok',
                  title: `Presentasi Multimodal: Fenomena ${materiDefault}`,
                  description: `Siswa mempresentasikan hasil diskusi kelompok mengenai dampak positif, negatif, atau tantangan aktual terkait ${materiDefault} menggunakan slide digital.`,
                  rationale: `Mengembangkan rasa percaya diri berbicara di depan umum (public speaking), kerja sama tim, dan argumen berbasis logika.`
                },
                {
                  label: '📊 Infografis Digital',
                  title: `Infografis Edukatif ${materiDefault}`,
                  description: `Siswa mendesain infografis digital yang merangkum alur proses, perbandingan konsep, atau poin-pointer esensial materi ${materiDefault} menggunakan Canva.`,
                  rationale: `Melatih literasi digital (penggunaan Canva) serta kemahiran merangkum pengetahuan padat menjadi media ramah pembaca.`
                },
                {
                  label: '🛠️ Model Fisik 3D',
                  title: `Model Alat Peraga Fisik ${materiDefault}`,
                  description: `Siswa menciptakan model 3D sederhana atau alat peraga dari bahan daur ulang untuk mendemonstrasikan cara kerja atau struktur fisik ${materiDefault}.`,
                  rationale: `Memfasilitasi kecerdasan kinestetik, kreativitas visual-spasial, serta pembuktian konsep teoretis abstrak ke bentuk konkret.`
                },
                {
                  label: '🧠 Peta Pikiran',
                  title: `Mind Map Struktur Konsep ${materiDefault}`,
                  description: `Siswa menggambar peta konsep/peta pikiran besar yang menggambarkan klasifikasi, keterkaitan kausal, dan contoh nyata dari materi ${materiDefault}.`,
                  rationale: `Mendorong keterampilan berpikir kritis, pengelompokan sistematis konsep-konsep, dan pemahaman relasional materi secara luas.`
                },
                {
                  label: '📹 Video Edukasi',
                  title: `Video Penjelasan Singkat ${materiDefault}`,
                  description: `Siswa berkelompok membuat video vlog edukatif (2-3 menit) yang menyajikan studi kasus atau penjelasan visual praktis tentang manfaat ${materiDefault}.`,
                  rationale: `Melatih keterampilan komunikasi multimedia digital, kemampuan berargumentasi lisan, serta pengeditan video inovatif.`
                }
              ];

              return (
                <div className="bg-indigo-50/40 p-3 rounded-xl border border-indigo-100/50 space-y-2">
                  <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5 text-indigo-500" />
                    💡 Saran Bukti Belajar Otomatis (Klik untuk mengisi):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTIONS.map((sug, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setNewEvTitle(sug.title);
                          setNewEvDesc(sug.description);
                          setNewEvRationale(sug.rationale);
                        }}
                        className="bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 text-[10px] font-medium px-2 py-1.5 rounded-lg transition-all shadow-3xs cursor-pointer inline-flex items-center gap-1"
                      >
                        {sug.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })()}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={newEvTitle}
                onChange={(e) => setNewEvTitle(e.target.value)}
                placeholder="Judul Bukti (misal: Poster Eksperimen Sel)..."
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
              />
              <input
                type="text"
                value={newEvRationale}
                onChange={(e) => setNewEvRationale(e.target.value)}
                placeholder="Justifikasi Pedagogis (Alasan pemilihan)..."
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
              />
              <textarea
                value={newEvDesc}
                onChange={(e) => setNewEvDesc(e.target.value)}
                rows={2}
                placeholder="Deskripsi detail apa yang akan diproduksi atau dikerjakan oleh siswa..."
                className="sm:col-span-2 bg-white border border-slate-200 rounded-xl p-3 text-xs"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleAddEvidence}
                disabled={!newEvTitle.trim() || !newEvDesc.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer shadow-xs transition-colors"
              >
                Tambahkan Bukti Baru
              </button>
            </div>
          </div>
        </div>

        {/* 5. PROFIL LULUSAN & KARAKTER UTAMA */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div>
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
              Profil Lulusan & Karakter Utama
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Sesuaikan Profil Pelajar Pancasila (nasional), Karakter Panca Cinta (khas madrasah), dan dimensi Rahmatan Lil Alamin (PPRA).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Profil Pelajar Pancasila */}
            <div className="bg-slate-50/50 border border-slate-200/80 rounded-xl p-4 space-y-3">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                Profil Pelajar Pancasila (Nasional)
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {PILIHAN_PANCASILA.map((item) => {
                  const selected = (discovery.dimensiProfil || []).includes(item);
                  return (
                    <label
                      key={item}
                      className={`flex items-start gap-2 p-2 rounded-lg border text-[11px] cursor-pointer transition-all select-none ${
                        selected ? 'bg-indigo-50/30 border-indigo-200 text-indigo-950 font-medium' : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => handleTogglePancasila(item)}
                        className="mt-0.5 shrink-0 h-3.5 w-3.5 rounded border-slate-300 text-indigo-600"
                      />
                      <span>{item}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Karakter Panca Cinta (Kemenag) */}
            <div className={`bg-slate-50/50 border border-slate-200/80 rounded-xl p-4 space-y-3 transition-opacity ${discovery.kurikulum === 'KMA 1503' ? 'opacity-100' : 'opacity-65 hover:opacity-100'}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${discovery.kurikulum === 'KMA 1503' ? 'bg-emerald-600' : 'bg-slate-400'}`}></span>
                  Panca Cinta (KBC Kemenag)
                </span>
                {discovery.kurikulum === 'KMA 1503' && (
                  <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md uppercase">Rekomendasi</span>
                )}
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {PILIHAN_PANCA_CINTA.map((item) => {
                  const selected = (discovery.dimensiPancaCinta || []).includes(item);
                  return (
                    <label
                      key={item}
                      className={`flex items-start gap-2 p-2 rounded-lg border text-[11px] cursor-pointer transition-all select-none ${
                        selected ? 'bg-emerald-50/30 border-emerald-200 text-emerald-950 font-medium' : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => handleTogglePancaCinta(item)}
                        className="mt-0.5 shrink-0 h-3.5 w-3.5 rounded border-slate-300 text-emerald-600"
                      />
                      <span>{item}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* PPRA Kemenag */}
            <div className={`bg-slate-50/50 border border-slate-200/80 rounded-xl p-4 space-y-3 transition-opacity ${discovery.kurikulum === 'KMA 1503' ? 'opacity-100' : 'opacity-65 hover:opacity-100'}`}>
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${discovery.kurikulum === 'KMA 1503' ? 'bg-amber-600' : 'bg-slate-400'}`}></span>
                Karakter Rahmatan Lil Alamin (PPRA)
              </span>
              <div className="grid grid-cols-1 gap-1.5 max-h-[250px] overflow-y-auto pr-1">
                {PILIHAN_PPRA.map((item) => {
                  const selected = (discovery.dimensiPPRA || []).includes(item);
                  return (
                    <label
                      key={item}
                      className={`flex items-start gap-2 p-2 rounded-lg border text-[11px] cursor-pointer transition-all select-none ${
                        selected ? 'bg-amber-50/30 border-amber-200 text-amber-950 font-medium' : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => handleTogglePPRA(item)}
                        className="mt-0.5 shrink-0 h-3.5 w-3.5 rounded border-slate-300 text-amber-600"
                      />
                      <span>{item}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <button
            onClick={onSubmit}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-3 rounded-xl inline-flex items-center gap-2 cursor-pointer shadow-sm disabled:bg-indigo-400"
          >
            {loading ? 'Sedang Menyusun Paket...' : 'Simpan & Rancang Paket Pembelajaran'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
