import React from 'react';
import { BookOpen, Layers, Shield, ArrowRight } from 'lucide-react';

interface LandingHeroProps {
  onStart?: () => void;
}

/**
 * LandingHero
 * Hero banner yang tampil di atas KonteksSection saat wizard belum dimulai
 * (currentStep === 0 && !cpAnalysis). Bersifat pasif: tidak mengubah state
 * apa pun kecuali user klik tombol CTA (opsional handler).
 */
const LandingHero: React.FC<LandingHeroProps> = ({ onStart }) => {
  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm p-8 md:p-12 mb-2"
      aria-label="Selamat datang di Asisten Perancang Perangkat Pembelajaran"
    >
      <div className="relative max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">
          Gratis untuk Guru Indonesia
        </p>

        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
          Rancang perangkat pembelajaran
          <span className="block mt-1 text-slate-700 font-medium">
            berkualitas dalam hitungan menit.
          </span>
        </h2>

        <p className="mt-5 text-base md:text-lg text-slate-600 max-w-2xl leading-relaxed">
          Asisten perancang untuk guru Indonesia menyusun{' '}
          <strong className="text-slate-900">Modul Ajar</strong>,{' '}
          <strong className="text-slate-900">LKPD</strong>, dan{' '}
          <strong className="text-slate-900">Bahan Ajar</strong> dengan metode{' '}
          <em>Backward Design</em> — mendukung dua jalur regulasi Kemendikbud dan Kemenag.
        </p>

        {/* 3 kartu highlight — minimalist */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <FeatureCard
            icon={<BookOpen className="w-5 h-5" strokeWidth={1.75} />}
            title="Backward Design"
            desc="Bukti belajar dirancang lebih dulu, sebelum kegiatan disusun."
          />
          <FeatureCard
            icon={<Layers className="w-5 h-5" strokeWidth={1.75} />}
            title="Dua Jalur Regulasi"
            desc="Kemendikbud dan Kemenag dalam satu aplikasi terintegrasi."
          />
          <FeatureCard
            icon={<Shield className="w-5 h-5" strokeWidth={1.75} />}
            title="Andal Sepanjang Waktu"
            desc="Tetap berfungsi meski koneksi API terganggu, berkat mesin cadangan."
          />
        </div>

        {onStart && (
          <div className="mt-8">
            <button
              type="button"
              onClick={onStart}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-6 py-3 transition-colors cursor-pointer"
            >
              Mulai Rancang Modul Ajar
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        )}

        <p className="mt-8 text-xs text-slate-500 leading-relaxed">
          Isi form konteks di bawah ini untuk memulai. Data hanya diproses sementara,
          tidak disimpan di server.
        </p>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, desc }) => {
  return (
    <div className="rounded-xl bg-slate-50 border border-slate-100 p-5 transition-colors hover:bg-white hover:border-slate-200">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-700 mb-3">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{desc}</p>
    </div>
  );
};

export default LandingHero;
