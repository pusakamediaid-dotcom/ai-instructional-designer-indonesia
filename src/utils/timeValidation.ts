import { DiscoveryData, TPItem, SuccessCriterion } from '../types';

export interface TimeAnalysisResult {
  jp: number;
  menitPerJp: number;
  totalMenit: number;
  selectedTpsCount: number;
  selectedScsCount: number;
  isProportional: boolean;
  status: 'SESUAI' | 'TERLALU_PADAT' | 'TERLALU_LONGGAR';
  recommendedJp: number;
  recommendedAlokasiWaktu: string;
  explanation: string;
}

/**
 * Parses time allocation strings like "2 JP x 40 Menit", "4x45 menit", "3 JP", etc.
 * Returns information about Jam Pelajaran (JP), minutes per JP, and total minutes.
 */
export function parseAlokasiWaktu(text: string, jenisSekolah: string): { jp: number; menitPerJp: number; totalMenit: number } {
  const norm = text.toLowerCase().replace(/\s+/g, '');
  
  // Set default minutes based on school level
  let defaultMenit = 40; // Default SMP
  if (['SD', 'MI'].includes(jenisSekolah)) {
    defaultMenit = 35;
  } else if (['SMA', 'SMK', 'MA'].includes(jenisSekolah)) {
    defaultMenit = 45;
  }

  let jp = 2;
  let menitPerJp = defaultMenit;

  // Try to find multiplier first, like "2x40" or "2*40" or "2x 40"
  const multMatch = norm.match(/(\d+)(?:x|\*)(\d+)/);
  if (multMatch) {
    const v1 = parseInt(multMatch[1], 10);
    const v2 = parseInt(multMatch[2], 10);
    // Usually JP is the smaller one, or the first one if both are reasonable
    if (v1 <= 10 && v2 > 10) {
      jp = v1;
      menitPerJp = v2;
    } else if (v2 <= 10 && v1 > 10) {
      jp = v2;
      menitPerJp = v1;
    } else {
      jp = v1;
      menitPerJp = v2;
    }
  } else {
    // Look for JP/Jam
    const jpMatch = norm.match(/(\d+)(?:jp|jam|pertemuan|materi)/);
    if (jpMatch) {
      jp = parseInt(jpMatch[1], 10);
    } else {
      // Just find first number
      const firstNumMatch = norm.match(/^(\d+)/);
      if (firstNumMatch) {
        jp = parseInt(firstNumMatch[1], 10);
      }
    }

    // Look for minutes if no multiplier was found
    const mMatch = norm.match(/(\d+)(?:menit|m)/);
    if (mMatch) {
      const totalM = parseInt(mMatch[1], 10);
      if (totalM > 10 && !text.includes('x')) {
        // If it's just "80 menit", calculate JP based on default
        jp = Math.ceil(totalM / defaultMenit);
        menitPerJp = defaultMenit;
        return { jp, menitPerJp, totalMenit: totalM };
      }
    }
  }

  // Sanity checks
  if (isNaN(jp) || jp <= 0) jp = 2;
  if (isNaN(menitPerJp) || menitPerJp <= 0) menitPerJp = defaultMenit;

  return { jp, menitPerJp, totalMenit: jp * menitPerJp };
}

/**
 * Analyzes whether the inputted time allocation is proportional to the learning design
 */
export function analyzeTimeProportionality(
  discovery: DiscoveryData,
  tps: TPItem[],
  successCriteria: SuccessCriterion[]
): TimeAnalysisResult {
  const selectedTps = tps.filter(t => t.selected);
  const selectedScs = successCriteria.filter(sc => {
    const relatedTp = tps.find(t => t.id === sc.tpId);
    return sc.selected && (!relatedTp || relatedTp.selected);
  });

  const { jp, menitPerJp, totalMenit } = parseAlokasiWaktu(discovery.alokasiWaktu || '2 JP', discovery.jenisSekolah);
  const selectedTpsCount = selectedTps.length;
  const selectedScsCount = selectedScs.length;

  // Let's establish a strict but realistic mapping for deep learning (UbD)
  // Deep learning requires time for Understanding (Memahami), Applying (Mengaplikasi), and Reflecting (Merefleksi)
  // For each TP, we ideally need at least:
  // - 1 TP: 2 JP (70-90 minutes)
  // - 2 TPs: 4 JP (140-180 minutes)
  // - 3 TPs: 6 JP (210-270 minutes)
  // - 4+ TPs: 8 JP+ (280+ minutes)
  
  // Rule of thumb: We need about 2 JP per selected TP for a deep, non-rushed learning experience
  const idealJp = Math.max(2, selectedTpsCount * 2);
  let status: 'SESUAI' | 'TERLALU_PADAT' | 'TERLALU_LONGGAR' = 'SESUAI';
  let isProportional = true;

  if (selectedTpsCount > 0) {
    if (jp < selectedTpsCount) {
      // E.g., 2 JP for 3 TPs is definitely too rushed!
      status = 'TERLALU_PADAT';
      isProportional = false;
    } else if (jp > selectedTpsCount * 4) {
      // E.g., 10 JP for 1 TP might be too loose unless it's a huge project
      status = 'TERLALU_LONGGAR';
      isProportional = false;
    }
  }

  // Generate explanation and recommendation
  let recommendedJp = idealJp;
  let recommendedAlokasiWaktu = `${recommendedJp} JP x ${menitPerJp} Menit`;

  let explanation = '';
  if (status === 'TERLALU_PADAT') {
    explanation = `Alokasi waktu Anda (${discovery.alokasiWaktu || '2 JP'}) terlalu singkat untuk mencapai ${selectedTpsCount} Tujuan Pembelajaran (TP) dan ${selectedScsCount} Kriteria Ketercapaian (KKTP). Agar pembelajaran mendalam (Deep Learning) berjalan riil, interaktif, dan berkesan bagi siswa, disarankan untuk menambah alokasi waktu atau membatasi jumlah TP yang diajarkan pada pertemuan ini.`;
  } else if (status === 'TERLALU_LONGGAR') {
    explanation = `Alokasi waktu Anda (${discovery.alokasiWaktu || '2 JP'}) cukup longgar untuk ${selectedTpsCount} TP yang terpilih. Anda dapat menyisipkan lebih banyak kegiatan praktikum mendalam, diskusi kritis, atau bahkan menambah Tujuan Pembelajaran (TP) lain yang relevan.`;
  } else {
    explanation = `Alokasi waktu Anda (${discovery.alokasiWaktu || '2 JP'}) sudah sesuai dan proporsional untuk mengupas ${selectedTpsCount} TP dan ${selectedScsCount} KKTP secara mendalam dan realistis.`;
  }

  return {
    jp,
    menitPerJp,
    totalMenit,
    selectedTpsCount,
    selectedScsCount,
    isProportional,
    status,
    recommendedJp,
    recommendedAlokasiWaktu,
    explanation
  };
}
