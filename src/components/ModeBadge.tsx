import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

interface ModeBadgeProps {
  kurikulum: 'CP 046' | 'KMA 1503';
  compact?: boolean;
}

/**
 * ModeBadge
 * Badge kecil yang menampilkan jalur regulasi aktif (Kemendikbud / Kemenag).
 * Warna & label reactive terhadap prop `kurikulum` sesuai blueprint §6.3.
 */
const ModeBadge: React.FC<ModeBadgeProps> = ({ kurikulum, compact = false }) => {
  const isKemendikbud = kurikulum === 'CP 046';

  const cls = isKemendikbud
    ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
    : 'bg-teal-100 text-teal-800 border-teal-200';

  const label = isKemendikbud ? 'Mode: Kemendikbud' : 'Mode: Kemenag – KBC';
  const sublabel = isKemendikbud ? 'CP 046/H/KR/2025' : 'KMA 1503 + KBC 6077';
  const Icon = isKemendikbud ? BookOpen : Sparkles;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold shadow-inner transition-colors duration-500 ${cls}`}
      title={sublabel}
      aria-label={`${label} (${sublabel})`}
    >
      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
      <span>{label}</span>
      {!compact && (
        <span className="opacity-70 font-medium hidden md:inline">· {sublabel}</span>
      )}
    </span>
  );
};

export default ModeBadge;
