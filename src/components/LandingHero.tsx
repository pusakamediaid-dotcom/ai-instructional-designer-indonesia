import React from 'react';
import { Sparkles, Target, GitBranch, ShieldCheck, ArrowRight } from 'lucide-react';

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
      className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-teal-50 shadow-sm p-6 md:p-8 mb-2"
      aria-label="Selamat datang di AI Instructional Designer Indonesia"
    >
      {/* Ornamen dekoratif */}
      <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-indigo-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-teal-200/30 blur-3xl" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 backdrop-blur px-3 py-1 text-[11px] font-semibold text-indigo-700 border border-indigo-200">
            <Sparkles className="w-3.5 h-3.5" />
            🎓 Gratis untuk Guru Indonesia
          </span>
        </div>

        <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Rancang perangkat pembelajaran{' '}
          <span className="bg-gradient-to-r from-indigo-600 to-teal-600 bg-clip-text text-transparent">
            berkualitas dalam hitungan menit
          </span>
        </h2>
        <p className="mt-2 text-sm md:text-base text-slate-600 max-w-2xl leading-relaxed">
          Asisten AI untuk guru Indonesia menyusun <strong>Modul Ajar, LKPD,</strong> dan{' '}
          <strong>Bahan Ajar</strong> dengan metode <em>Backward Design</em> (Understanding
          by Design) — mendukung dua jalur regulasi <strong>Kemendikbud</strong> dan{' '}
          <strong>Kemenag</strong>.
        </p>

        {/* 3 kartu highlight */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
          <FeatureCard
            icon={<Target className="w-5 h-5" />}
            title="Backward Design (UbD)"
            desc="Bukti belajar dirancang lebih dulu, sebelum kegiatan — bukan sebaliknya."
            tone="indigo"
          />
          <FeatureCard
            icon={<GitBranch className="w-5 h-5" />}
            title="Dual Jalur Regulasi"
            desc="Kemendikbud (CP 046) & Kemenag (KMA 1503 + KBC 6077) dalam satu aplikasi."
            tone="teal"
          />
          <FeatureCard
            icon={<ShieldCheck className="w-5 h-5" />}
            title="Fallback Andal"
            desc="Aplikasi tetap jalan meski API Gemini penuh — mesin lokal siaga otomatis."
            tone="emerald"
          />
        </div>

        {onStart && (
          <div className="mt-6">
            <button
              type="button"
              onClick={onStart}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 shadow-md transition-colors cursor-pointer"
            >
              Mulai Rancang Modul Ajar
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Statistik singkat sebagai social proof */}
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-medium text-slate-600">
          <span className="inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <strong className="text-slate-800">160+</strong> CP Fase A siap pakai
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            <strong className="text-slate-800">2</strong> jalur regulasi (Kemendikbud &amp; Kemenag)
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <strong className="text-slate-800">&lt;5 menit</strong> per Modul Ajar
          </span>
        </div>

        <p className="mt-4 text-[11px] text-slate-500">
          Isi form konteks di bawah ini untuk memulai. Data Anda hanya diproses sementara —
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
  tone: 'indigo' | 'teal' | 'emerald';
}

const toneMap: Record<FeatureCardProps['tone'], { bg: string; text: string; ring: string }> = {
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-700', ring: 'ring-indigo-200' },
  teal: { bg: 'bg-teal-100', text: 'text-teal-700', ring: 'ring-teal-200' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700', ring: 'ring-emerald-200' },
};

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, desc, tone }) => {
  const t = toneMap[tone];
  return (
    <div className="rounded-xl bg-white/80 backdrop-blur border border-slate-100 p-4 shadow-xs">
      <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${t.bg} ${t.text} ring-1 ${t.ring} mb-2`}>
        {icon}
      </div>
      <h3 className="text-sm font-bold text-slate-800">{title}</h3>
      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{desc}</p>
    </div>
  );
};

export default LandingHero;
