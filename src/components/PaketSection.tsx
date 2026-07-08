import React, { useState, useRef } from 'react';
import { 
  Puzzle, ArrowRight, Check, RefreshCw, Edit2, 
  Trash2, Plus, Users, BookOpen, Clock, Lightbulb
} from 'lucide-react';
import { AssessmentData, LearningExperience, LearningResources, Differentiation } from '../types';

interface PaketSectionProps {
  assessment: AssessmentData | null;
  setAssessment: React.Dispatch<React.SetStateAction<AssessmentData | null>>;
  experience: LearningExperience | null;
  setExperience: React.Dispatch<React.SetStateAction<LearningExperience | null>>;
  resources: LearningResources | null;
  setResources: React.Dispatch<React.SetStateAction<LearningResources | null>>;
  differentiation: Differentiation | null;
  setDifferentiation: React.Dispatch<React.SetStateAction<Differentiation | null>>;
  isCollapsed: boolean;
  onExpand: () => void;
  onSubmit: () => void;
  onRefreshAI: () => void;
  loading: boolean;
  disabled: boolean;
}

export default function PaketSection({
  assessment,
  setAssessment,
  experience,
  setExperience,
  resources,
  setResources,
  differentiation,
  setDifferentiation,
  isCollapsed,
  onExpand,
  onSubmit,
  onRefreshAI,
  loading,
  disabled
}: PaketSectionProps) {

  const [newResource, setNewResource] = useState({ title: '', type: 'Digital', url: '', description: '' });
  const [rubricMode, setRubricMode] = useState<'visual' | 'code'>('visual');
  const rubricEditorRef = useRef<HTMLDivElement>(null);

  const handleVisualRubricBlur = () => {
    if (rubricEditorRef.current && assessment) {
      const htmlValue = rubricEditorRef.current.innerHTML;
      if (htmlValue !== assessment.rubric) {
        setAssessment({
          ...assessment,
          rubric: htmlValue
        });
      }
    }
  };

  const switchRubricMode = (mode: 'visual' | 'code') => {
    if (rubricMode === 'visual' && rubricEditorRef.current && assessment) {
      const htmlValue = rubricEditorRef.current.innerHTML;
      setAssessment({
        ...assessment,
        rubric: htmlValue
      });
    }
    setRubricMode(mode);
  };

  if (disabled) {
    return (
      <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-6 opacity-60 cursor-not-allowed">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold">
            3
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-400">Section 3: Paket Pembelajaran</h3>
            <p className="text-xs text-slate-400 mt-0.5">Menunggu pengisian Tujuan & Bukti Belajar selesai...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isCollapsed) {
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
                🧩 Section 3: Paket Pembelajaran
                <span className="text-xs font-normal text-emerald-600">(Selesai - Klik untuk mengubah)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Metode Asesmen: {assessment?.method || 'Penilaian Otentik'} • Sumber Belajar: {resources?.resources?.length || 0} rekomendasi • Skenario Pembelajaran Siap.
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

  // Skenario Activity Edit Helpers
  const handleUpdateActivityItem = (sectionKey: keyof LearningExperience, actIndex: number, newValue: string) => {
    if (!experience) return;
    const section = experience[sectionKey];
    const updatedActivities = [...section.activities];
    updatedActivities[actIndex] = newValue;
    setExperience({
      ...experience,
      [sectionKey]: {
        ...section,
        activities: updatedActivities
      }
    });
  };

  const handleAddActivityItem = (sectionKey: keyof LearningExperience) => {
    if (!experience) return;
    const section = experience[sectionKey];
    setExperience({
      ...experience,
      [sectionKey]: {
        ...section,
        activities: [...section.activities, 'Aktivitas baru...']
      }
    });
  };

  const handleDeleteActivityItem = (sectionKey: keyof LearningExperience, actIndex: number) => {
    if (!experience) return;
    const section = experience[sectionKey];
    setExperience({
      ...experience,
      [sectionKey]: {
        ...section,
        activities: section.activities.filter((_, i) => i !== actIndex)
      }
    });
  };

  const handleUpdateDuration = (sectionKey: keyof LearningExperience, duration: string) => {
    if (!experience) return;
    const section = experience[sectionKey];
    setExperience({
      ...experience,
      [sectionKey]: {
        ...section,
        duration
      }
    });
  };

  // Resource Management
  const handleAddResource = () => {
    if (!resources || !newResource.title) return;
    setResources({
      ...resources,
      resources: [
        ...resources.resources,
        {
          title: newResource.title,
          type: newResource.type,
          url: newResource.url || undefined,
          description: newResource.description
        }
      ]
    });
    setNewResource({ title: '', type: 'Digital', url: '', description: '' });
  };

  const handleDeleteResource = (index: number) => {
    if (!resources) return;
    setResources({
      ...resources,
      resources: resources.resources.filter((_, i) => i !== index)
    });
  };

  const experienceSections: { key: keyof LearningExperience; label: string; bg: string }[] = [
    { key: 'kegiatanAwal', label: '1. Kegiatan Pendahuluan (Apersepsi & Motivasi)', bg: 'bg-indigo-50/20 border-indigo-100' },
    { key: 'memahami', label: '2. Membangun Pemahaman (Eksplorasi Konseptual)', bg: 'bg-emerald-50/20 border-emerald-100' },
    { key: 'mengaplikasi', label: '3. Mengaplikasikan Konsep (Kerja Mandiri/Kolaboratif)', bg: 'bg-amber-50/20 border-amber-100' },
    { key: 'merefleksi', label: '4. Refleksi Pembelajaran (Asesmen Formatif & Umpan Balik)', bg: 'bg-rose-50/20 border-rose-100' },
    { key: 'penutup', label: '5. Kegiatan Penutup (Rangkuman & Tindak Lanjut)', bg: 'bg-slate-50 border-slate-200/80' }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
      <div className="border-b border-slate-100 bg-slate-50/50 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Puzzle className="w-5 h-5 text-indigo-600" />
            Section 3: Paket Pembelajaran Detail
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Konfigurasi model, strategi, asesmen otentik, skenario pembelajaran interaktif, diferensiasi siswa, serta penyeimbangan sumber belajar.
          </p>
        </div>
        <button
          onClick={onRefreshAI}
          disabled={loading}
          className="shrink-0 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 text-indigo-700 font-bold text-xs px-4 py-2.5 rounded-xl inline-flex items-center gap-1.5 cursor-pointer shadow-xs border border-indigo-100"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Segarkan Rekomendasi AI
        </button>
      </div>

      <div className="p-6 space-y-8">
        
        {/* 1. ALUR ASESMEN & RUBRIK */}
        {assessment && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
              Rancangan Penilaian (Assessment)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50/50 border border-slate-200 p-4 rounded-xl space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Metode Penilaian Utama</label>
                <input
                  type="text"
                  value={assessment.method}
                  onChange={(e) => setAssessment({ ...assessment, method: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
                />
              </div>

              <div className="bg-slate-50/50 border border-slate-200 p-4 rounded-xl space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Deskripsi Teknis Penilaian</label>
                <textarea
                  value={assessment.description}
                  onChange={(e) => setAssessment({ ...assessment, description: e.target.value })}
                  rows={3}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white"
                />
              </div>
            </div>

            {/* Tiga Kategori Asesmen Resmi (AfL, AaL, AoL) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-emerald-50/25 border border-emerald-100 p-4 rounded-xl space-y-2">
                <label className="text-xs font-bold text-emerald-800 uppercase tracking-wider block flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Asesmen For Learning (AfL) - Formatif
                </label>
                <textarea
                  value={assessment.assessmentForLearning || ''}
                  onChange={(e) => setAssessment({ ...assessment, assessmentForLearning: e.target.value })}
                  rows={4}
                  className="w-full bg-white border border-emerald-100 rounded-xl p-2.5 text-xs focus:bg-white leading-relaxed"
                  placeholder="Misal: Observasi keaktifan siswa saat diskusi, kuis lisan interaktif, tanya jawab selama proses belajar."
                />
              </div>

              <div className="bg-amber-50/25 border border-amber-100 p-4 rounded-xl space-y-2">
                <label className="text-xs font-bold text-amber-800 uppercase tracking-wider block flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Asesmen As Learning (AaL) - Reflektif
                </label>
                <textarea
                  value={assessment.assessmentAsLearning || ''}
                  onChange={(e) => setAssessment({ ...assessment, assessmentAsLearning: e.target.value })}
                  rows={4}
                  className="w-full bg-white border border-amber-100 rounded-xl p-2.5 text-xs focus:bg-white leading-relaxed"
                  placeholder="Misal: Lembar refleksi diri siswa (self-assessment) setelah aktivitas kelompok atau penilaian antar-teman (peer-assessment)."
                />
              </div>

              <div className="bg-rose-50/25 border border-rose-100 p-4 rounded-xl space-y-2">
                <label className="text-xs font-bold text-rose-800 uppercase tracking-wider block flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Asesmen Of Learning (AoL) - Sumatif
                </label>
                <textarea
                  value={assessment.assessmentOfLearning || ''}
                  onChange={(e) => setAssessment({ ...assessment, assessmentOfLearning: e.target.value })}
                  rows={4}
                  className="w-full bg-white border border-rose-100 rounded-xl p-2.5 text-xs focus:bg-white leading-relaxed"
                  placeholder="Misal: Tugas unjuk kerja akhir pembuatan produk/proyek (poster/laporan) beserta penilaian rubrik sumatif."
                />
              </div>
            </div>

            {/* Rubric View */}
            <div className="bg-slate-50/50 border border-slate-200 p-4 rounded-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Rubrik Kriteria Penilaian</label>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {rubricMode === 'visual' 
                      ? 'Silakan klik langsung pada kata/kalimat di dalam tabel untuk mengubah atau mengedit teks secara aman.' 
                      : 'Hati-hati saat mengedit kode HTML langsung agar tidak merusak format tabel.'}
                  </p>
                </div>
                
                {/* Tab Switcher */}
                <div className="inline-flex rounded-lg bg-slate-100 p-1 shrink-0 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => switchRubricMode('visual')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      rubricMode === 'visual'
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    📝 Mode Teks (Aman)
                  </button>
                  <button
                    type="button"
                    onClick={() => switchRubricMode('code')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      rubricMode === 'code'
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    💻 Kode HTML (Lanjut)
                  </button>
                </div>
              </div>

              {rubricMode === 'visual' ? (
                <div className="bg-white border border-slate-200 rounded-xl p-4 overflow-x-auto min-h-[180px]">
                  <div
                    ref={rubricEditorRef}
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleVisualRubricBlur}
                    className="prose prose-slate max-w-full text-xs font-sans focus:outline-hidden rubric-visual-editor"
                    dangerouslySetInnerHTML={{ __html: assessment.rubric || '<p className="text-slate-400 font-light italic">Belum ada rubrik penilaian.</p>' }}
                  />
                  <p className="text-[10px] text-slate-400 mt-2 text-right">
                    💡 Perubahan teks disimpan secara otomatis saat Anda mengklik di luar area tabel.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-800 flex items-start gap-2">
                    <span className="shrink-0 mt-0.5">⚠️</span>
                    <p className="leading-relaxed">
                      <strong>Perhatian:</strong> Mengubah tag HTML seperti <code className="bg-amber-100/60 px-1 py-0.2 rounded font-mono text-[10px]">&lt;table&gt;</code>, <code className="bg-amber-100/60 px-1 py-0.2 rounded font-mono text-[10px]">&lt;tr&gt;</code>, atau <code className="bg-amber-100/60 px-1 py-0.2 rounded font-mono text-[10px]">&lt;td&gt;</code> dapat merusak format modul. Gunakan <strong>Mode Teks (Aman)</strong> untuk mengedit tulisan secara aman.
                    </p>
                  </div>
                  <textarea
                    value={assessment.rubric}
                    onChange={(e) => setAssessment({ ...assessment, rubric: e.target.value })}
                    rows={6}
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-mono leading-relaxed focus:bg-white"
                    placeholder="Rincian rubrik penilaian..."
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. SKENARIO AKTIVITAS DETAIL (5 TAHAPAN UBD) */}
        {experience && (
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
              Skenario Langkah Pembelajaran Detail
            </h4>

            <div className="space-y-4">
              {experienceSections.map(({ key, label, bg }) => {
                const section = experience[key];
                if (!section) return null;
                return (
                  <div key={key} className={`border rounded-2xl p-4 md:p-5 space-y-3 ${bg}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/50 pb-2">
                      <span className="text-xs font-bold text-slate-900">{label}</span>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <input
                          type="text"
                          value={section.duration || '10 Menit'}
                          onChange={(e) => handleUpdateDuration(key, e.target.value)}
                          className="bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-xs w-24 text-center"
                          placeholder="Durasi..."
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      {section.activities.map((act, actIndex) => (
                        <div key={actIndex} className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-white border border-slate-200 text-slate-500 text-[10px] flex items-center justify-center shrink-0 mt-1 font-medium">
                            {actIndex + 1}
                          </span>
                          <textarea
                            value={act}
                            onChange={(e) => handleUpdateActivityItem(key, actIndex, e.target.value)}
                            rows={2}
                            className="flex-1 bg-white border border-slate-200 rounded-xl p-2.5 text-xs leading-relaxed"
                          />
                          <button
                            onClick={() => handleDeleteActivityItem(key, actIndex)}
                            className="text-slate-400 hover:text-red-500 p-1 rounded-md mt-1 shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => handleAddActivityItem(key)}
                        className="text-[10px] font-bold text-indigo-700 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg cursor-pointer"
                      >
                        + Tambah Langkah Aktivitas
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. MEDIA & SUMBER BELAJAR */}
        {resources && (
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
              Media & Sumber Belajar
            </h4>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Existing list */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-slate-700 block">Rekomendasi Terintegrasi</span>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {resources.resources.map((res, idx) => (
                    <div key={idx} className="bg-slate-50/50 border border-slate-200/80 p-3 rounded-xl flex justify-between items-start gap-2 text-xs">
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-900">{res.title} <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded-md uppercase font-bold">{res.type}</span></p>
                        <p className="text-slate-500 text-[11px] font-light">{res.description}</p>
                        {res.url && <a href={res.url} target="_blank" rel="noreferrer" className="text-[10px] text-indigo-600 font-semibold break-all hover:underline block">{res.url}</a>}
                      </div>
                      <button
                        onClick={() => handleDeleteResource(idx)}
                        className="text-slate-400 hover:text-red-500 p-1 rounded-md shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form to add */}
              <div className="bg-slate-50/50 border border-slate-200/80 p-4 rounded-xl space-y-3">
                <span className="text-xs font-bold text-slate-800 block flex items-center gap-1">
                  <Plus className="w-4 h-4 text-indigo-600" />
                  Tambah Sumber Belajar Kustom
                </span>
                <div className="grid grid-cols-1 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Judul Sumber Belajar</label>
                    <input
                      type="text"
                      placeholder="Misal: PhET Colorado Simulation Sel..."
                      value={newResource.title}
                      onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Tipe</label>
                      <select
                        value={newResource.type}
                        onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs"
                      >
                        <option value="Digital">Digital (Website/Simulasi)</option>
                        <option value="Cetak">Cetak (Buku/Modul)</option>
                        <option value="Alat">Alat Peraga / Bahan</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">URL (Opsional)</label>
                      <input
                        type="text"
                        placeholder="https://..."
                        value={newResource.url}
                        onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Deskripsi Singkat Penggunaan</label>
                    <textarea
                      placeholder="Deskripsi..."
                      value={newResource.description}
                      onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                      rows={2}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleAddResource}
                    disabled={!newResource.title}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
                  >
                    Tambah Rekomendasi
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. DIFERENSIASI BELAJAR */}
        {differentiation && (
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
              Strategi Diferensiasi Belajar
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50/50 border border-slate-200 p-4 rounded-xl space-y-1">
                <span className="text-xs font-bold text-slate-700 block flex items-center gap-1">
                  <Users className="w-4 h-4 text-indigo-500" />
                  Diferensiasi Konten / Proses
                </span>
                <textarea
                  value={differentiation.proses}
                  onChange={(e) => setDifferentiation({ ...differentiation, proses: e.target.value })}
                  rows={4}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs leading-relaxed focus:bg-white"
                />
              </div>

              <div className="bg-slate-50/50 border border-slate-200 p-4 rounded-xl space-y-1">
                <span className="text-xs font-bold text-slate-700 block flex items-center gap-1">
                  <Users className="w-4 h-4 text-indigo-500" />
                  Diferensiasi Produk / Hasil
                </span>
                <textarea
                  value={differentiation.produk}
                  onChange={(e) => setDifferentiation({ ...differentiation, produk: e.target.value })}
                  rows={4}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs leading-relaxed focus:bg-white"
                />
              </div>

              <div className="bg-slate-50/50 border border-slate-200 p-4 rounded-xl space-y-1">
                <span className="text-xs font-bold text-slate-700 block flex items-center gap-1">
                  <Users className="w-4 h-4 text-indigo-500" />
                  Dukungan Belajar Siswa
                </span>
                <textarea
                  value={differentiation.dukunganBelajar}
                  onChange={(e) => setDifferentiation({ ...differentiation, dukunganBelajar: e.target.value })}
                  rows={4}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs leading-relaxed focus:bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Submit button */}
        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <button
            onClick={onSubmit}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-3 rounded-xl inline-flex items-center gap-2 cursor-pointer shadow-sm disabled:bg-indigo-400"
          >
            {loading ? 'Menyusun Perangkat...' : 'Simpan & Lanjutkan ke Hasil Akhir'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
