import React from 'react';
import { Compass, ArrowRight, Check, Edit2, Clock } from 'lucide-react';
import { DiscoveryData } from '../types';
import { parseAlokasiWaktu } from '../utils/timeValidation';

interface KonteksSectionProps {
  discovery: DiscoveryData;
  setDiscovery: React.Dispatch<React.SetStateAction<DiscoveryData>>;
  isCollapsed: boolean;
  onExpand: () => void;
  onSubmit: () => void;
  loading: boolean;
}

const KEMENDIKBUD_SUBJECTS = [
  "Pendidikan Pancasila / PKn",
  "Bahasa Indonesia",
  "Matematika",
  "Ilmu Pengetahuan Alam (IPA)",
  "Ilmu Pengetahuan Sosial (IPS)",
  "Bahasa Inggris",
  "Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)",
  "Informatika",
  "Seni Rupa",
  "Seni Musik",
  "Seni Tari",
  "Seni Teater",
  "Ilmu Pengetahuan Alam dan Sosial (IPAS)",
  "Fisika",
  "Kimia",
  "Biologi",
  "Sejarah",
  "Geografi",
  "Ekonomi",
  "Sosiologi",
  "Antropologi",
  "Prakarya dan Kewirausahaan (PKWU)"
];

const KEMENAG_SUBJECTS = [
  "Al-Qur'an Hadis",
  "Akidah Akhlak",
  "Fikih",
  "Sejarah Kebudayaan Islam (SKI)",
  "Bahasa Arab"
];

const MULOK_SUBJECTS = [
  "Bahasa Jawa",
  "Bahasa Sunda",
  "Bahasa Bali",
  "Bahasa Madura",
  "Bahasa Minangkabau",
  "Pendidikan Lingkungan Hidup (PLH)",
  "Seni Budaya Daerah",
  "Tahfidz Al-Qur'an",
  "Ke-NU-an / Keaswajaan",
  "Kemuhammadiyahan"
];

const ALL_PRESET_SUBJECTS = [...KEMENDIKBUD_SUBJECTS, ...KEMENAG_SUBJECTS, ...MULOK_SUBJECTS];

export default function KonteksSection({
  discovery,
  setDiscovery,
  isCollapsed,
  onExpand,
  onSubmit,
  loading
}: KonteksSectionProps) {

  const handleFieldChange = (field: keyof DiscoveryData, value: any) => {
    setDiscovery((prev) => ({
      ...prev,
      [field]: value
    }));
  };

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
                📖 Section 1: Konteks Pembelajaran
                <span className="text-xs font-normal text-emerald-600">(Selesai - Klik untuk mengubah)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {discovery.naungan || 'Kemendikbud (Sekolah)'} • {discovery.jenisSekolah} • {discovery.mataPelajaran} • {discovery.kelas} • {discovery.materi || 'Materi Belum Diisi'}
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

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
      <div className="border-b border-slate-100 bg-slate-50/50 p-6">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Compass className="w-5 h-5 text-indigo-600" />
          Section 1: Konteks Pembelajaran
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Tentukan identitas dan fokus pembelajaran utama Anda. Informasi ini menjadi acuan utama AI untuk merumuskan tujuan, bukti, dan paket aktivitas belajar.
        </p>
      </div>

      <div className="p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Naungan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Naungan Lembaga</label>
            <select
              value={discovery.naungan || 'Kemendikbud (Sekolah)'}
              onChange={(e) => {
                const val = e.target.value as any;
                const isKemenag = val === 'Kemenag (Madrasah)';
                setDiscovery(prev => ({
                  ...prev,
                  naungan: val,
                  kurikulum: isKemenag ? 'KMA 1503' : 'CP 046',
                  jenisSekolah: isKemenag ? 'MTs' : 'SMP'
                }));
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm"
            >
              <option value="Kemendikbud (Sekolah)">Kemendikbudristek (Sekolah Umum)</option>
              <option value="Kemenag (Madrasah)">Kementerian Agama (Madrasah)</option>
            </select>
          </div>

          {/* Kurikulum Acuan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Kurikulum Acuan</label>
            <select
              value={discovery.kurikulum}
              onChange={(e) => {
                const val = e.target.value as any;
                const pancaCinta = val === 'KMA 1503' 
                  ? ['Cinta kepada Allah SWT dan Rasul-Nya', 'Cinta Ilmu Pengetahuan dan Teknologi / Kebenaran'] 
                  : [];
                setDiscovery(prev => ({ 
                  ...prev, 
                  kurikulum: val,
                  dimensiPancaCinta: pancaCinta
                }));
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm"
            >
              <option value="CP 046">Kurikulum Merdeka (CP 046 / Kemendikbud)</option>
              <option value="KMA 1503">Kurikulum Madrasah (KMA 1503 / Kemenag)</option>
            </select>
          </div>

          {/* Jenjang / Jenis Sekolah */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Jenjang / Jenis Sekolah</label>
            <select
              value={discovery.jenisSekolah}
              onChange={(e) => handleFieldChange('jenisSekolah', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm"
            >
              {discovery.naungan === 'Kemenag (Madrasah)' ? (
                <>
                  <option value="MI">Madrasah Ibtidaiyah (MI)</option>
                  <option value="MTs">Madrasah Tsanawiyah (MTs)</option>
                  <option value="MA">Madrasah Aliyah (MA)</option>
                </>
              ) : (
                <>
                  <option value="SD">Sekolah Dasar (SD)</option>
                  <option value="SMP">Sekolah Menengah Pertama (SMP)</option>
                  <option value="SMA">Sekolah Menengah Atas (SMA)</option>
                  <option value="SMK">Sekolah Menengah Kejuruan (SMK)</option>
                </>
              )}
            </select>
          </div>

          {/* Nama Sekolah */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Nama Sekolah / Madrasah</label>
            <input
              type="text"
              value={discovery.sekolah || ''}
              onChange={(e) => handleFieldChange('sekolah', e.target.value)}
              placeholder="Misal: SMP Negeri 1 Jakarta / MTsN 2 Kota"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm"
            />
          </div>

          {/* Mata Pelajaran */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Mata Pelajaran</label>
            {(() => {
              const isCustomSubject = discovery.mataPelajaran && !ALL_PRESET_SUBJECTS.some(s => s.toLowerCase() === (discovery.mataPelajaran || '').toLowerCase());
              const currentPresetValue = isCustomSubject 
                ? 'Lainnya' 
                : (ALL_PRESET_SUBJECTS.find(s => s.toLowerCase() === (discovery.mataPelajaran || '').toLowerCase()) || '');

              return (
                <div className="space-y-1.5">
                  <select
                    value={currentPresetValue}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'Lainnya') {
                        handleFieldChange('mataPelajaran', '');
                      } else {
                        handleFieldChange('mataPelajaran', val);
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:bg-white"
                  >
                    <option value="">-- Pilih Mata Pelajaran --</option>
                    <optgroup label={discovery.naungan === 'Kemenag (Madrasah)' ? "Mata Pelajaran Madrasah (Kemenag)" : "Mata Pelajaran Umum (Kemendikbud)"}>
                      {(discovery.naungan === 'Kemenag (Madrasah)' ? KEMENAG_SUBJECTS : KEMENDIKBUD_SUBJECTS).map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </optgroup>
                    <optgroup label={discovery.naungan === 'Kemenag (Madrasah)' ? "Mata Pelajaran Umum (Kemendikbud)" : "Mata Pelajaran Madrasah (Kemenag)"}>
                      {(discovery.naungan === 'Kemenag (Madrasah)' ? KEMENDIKBUD_SUBJECTS : KEMENAG_SUBJECTS).map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Muatan Lokal & Lainnya">
                      {MULOK_SUBJECTS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </optgroup>
                    <option value="Lainnya">Lainnya / Tulis Manual...</option>
                  </select>

                  {(isCustomSubject || currentPresetValue === 'Lainnya' || discovery.mataPelajaran === '') && (
                    <input
                      type="text"
                      value={discovery.mataPelajaran}
                      onChange={(e) => handleFieldChange('mataPelajaran', e.target.value)}
                      placeholder="Tulis mata pelajaran / muatan lokal kustom..."
                      className="w-full bg-slate-50 border border-indigo-200 focus:border-indigo-500 rounded-xl p-2.5 text-sm focus:bg-white placeholder:text-slate-400 mt-1"
                    />
                  )}
                </div>
              );
            })()}
          </div>

          {/* Fase */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Fase Perkembangan</label>
            <select
              value={discovery.fase}
              onChange={(e) => handleFieldChange('fase', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm"
            >
              <option value="A">Fase A (Kelas I - II)</option>
              <option value="B">Fase B (Kelas III - IV)</option>
              <option value="C">Fase C (Kelas V - VI)</option>
              <option value="D">Fase D (Kelas VII - IX)</option>
              <option value="E">Fase E (Kelas X)</option>
              <option value="F">Fase F (Kelas XI - XII)</option>
            </select>
          </div>

          {/* Kelas */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Kelas</label>
            <input
              type="text"
              value={discovery.kelas}
              onChange={(e) => handleFieldChange('kelas', e.target.value)}
              placeholder="Misal: VII, VIII, IX"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm"
            />
          </div>

          {/* Semester */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Semester</label>
            <select
              value={discovery.semester || 'I (Ganjil)'}
              onChange={(e) => handleFieldChange('semester', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm"
            >
              <option value="I (Ganjil)">I (Ganjil)</option>
              <option value="II (Genap)">II (Genap)</option>
            </select>
          </div>

          {/* Alokasi Waktu */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Alokasi Waktu</label>
            <input
              type="text"
              value={discovery.alokasiWaktu}
              onChange={(e) => handleFieldChange('alokasiWaktu', e.target.value)}
              placeholder="Misal: 2 JP x 40 Menit"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm"
            />
            {(() => {
              const stdMin = ['SD', 'MI'].includes(discovery.jenisSekolah) ? 35 : ['SMA', 'SMK', 'MA'].includes(discovery.jenisSekolah) ? 45 : 40;
              const parsed = parseAlokasiWaktu(discovery.alokasiWaktu || '', discovery.jenisSekolah);
              const isDifferent = parsed.menitPerJp !== stdMin && discovery.alokasiWaktu;
              
              return (
                <div className="mt-1.5 space-y-1">
                  <div className="flex items-center gap-1 text-[11px] text-indigo-600 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Terbaca: {parsed.jp} JP x {parsed.menitPerJp} Menit ({parsed.totalMenit} Menit)</span>
                  </div>
                  {isDifferent && (
                    <div className="text-[10px] text-amber-600 bg-amber-50 border border-amber-100/50 p-1.5 rounded-lg flex flex-col gap-1">
                      <span>💡 <strong>Saran Standar:</strong> Di jenjang {discovery.jenisSekolah}, 1 JP biasanya berdurasi {stdMin} Menit.</span>
                      <button
                        type="button"
                        onClick={() => handleFieldChange('alokasiWaktu', `${parsed.jp} JP x ${stdMin} Menit`)}
                        className="text-[9px] font-bold text-amber-700 hover:underline text-left"
                      >
                        Terapkan: {parsed.jp} JP x {stdMin} Menit
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Nama Penyusun */}
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Nama Penyusun / Guru Pengampu</label>
            <input
              type="text"
              value={discovery.namaPenyusun || ''}
              onChange={(e) => handleFieldChange('namaPenyusun', e.target.value)}
              placeholder="Misal: Ibu Cantika Dewi, S.Pd. atau Guru Hebat Indonesia"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm"
            />
          </div>
        </div>

        {/* Ruang Lingkup Materi */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Ruang Lingkup Pembelajaran (Topik)</label>
          <input
            type="text"
            value={discovery.materi}
            onChange={(e) => handleFieldChange('materi', e.target.value)}
            placeholder="Misal: Sel dan Organel Penyusunnya / Penjumlahan Bilangan Bulat"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm"
          />
          <p className="text-[10px] text-slate-500 mt-1">
            💡 <strong>Koreksi Ejaan Otomatis:</strong> AI akan mendeteksi dan mengoreksi ejaan topik Anda agar sesuai dengan ejaan baku bahasa Indonesia yang benar (EYD) secara otomatis setelah Anda mengklik tombol di bawah ini.
          </p>
        </div>

        {/* Fokus Pembelajaran & Karakteristik Siswa */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Fokus Pembelajaran / Catatan Khusus</label>
            <textarea
              value={discovery.catatanTambahan || ''}
              onChange={(e) => handleFieldChange('catatanTambahan', e.target.value)}
              rows={3}
              placeholder="Misal: Pembelajaran aktif berbasis praktikum sederhana / integrasi literasi numerasi..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Karakteristik Siswa (Opsional)</label>
            <textarea
              value={discovery.karakteristikSiswa || ''}
              onChange={(e) => handleFieldChange('karakteristikSiswa', e.target.value)}
              rows={3}
              placeholder="Misal: Siswa aktif, heterogen, sebagian menyukai metode visual dan kinestetik..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm resize-none"
            />
          </div>
        </div>

        {/* Submit button */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onSubmit}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-3 rounded-xl inline-flex items-center gap-2 cursor-pointer shadow-sm disabled:bg-indigo-400"
          >
            {loading ? 'Sedang Memproses...' : 'Simpan & Rumuskan Tujuan Pembelajaran'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
