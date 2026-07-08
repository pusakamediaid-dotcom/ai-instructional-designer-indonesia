import React from 'react';
import { BookOpen, Bookmark } from 'lucide-react';

interface ModeBadgeProps {
  kurikulum: 'CP 046' | 'KMA 1503';
  compact?: boolean;
}

/**
 * ModeBadge
 * Badge kecil yang menampilkan jalur regulasi aktif (Kemendikbud / Kemenag).
 * Warna & label reactive terhadap prop `kurikulum`.
 */
const ModeBadge: React.FC<ModeBadgeProps> = ({ kurikulum, compact = false }) => {
  const isKemendikbud = kurikulum === 'CP 046';

  const cls = isKemendikbud
    ? 'bg-white text-indigo-800 border-indigo-200'
    : 'bg-white text-teal-800 border-teal-200';

  const label = isKemendikbud ? 'Kemendikbud' : 'Kemenag';
  const sublabel = isKemendikbud ? 'CP 046/H/KR/2025' : 'KMA 1503 + KBC 6077';
  const Icon = isKemendikbud ? BookOpen : Bookmark;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium shadow-sm transition-colors duration-500 ${cls}`}
      title={sublabel}
      aria-label={`${label} (${sublabel})`}
    >
      <Icon className="w-3.5 h-3.5" strokeWidth={1.75} aria-hidden="true" />
      <span className="font-semibold">{label}</span>
      {!compact && (
        <span className="opacity-70 hidden md:inline">· {sublabel}</span>
      )}
    </span>
  );
};

export default ModeBadge;
