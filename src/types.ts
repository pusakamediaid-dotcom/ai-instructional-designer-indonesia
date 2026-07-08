export interface DiscoveryData {
  kurikulum: 'CP 046' | 'KMA 1503';
  jenisSekolah: 'SD' | 'SMP' | 'SMA' | 'SMK' | 'MI' | 'MTs' | 'MA';
  naungan?: 'Kemendikbud (Sekolah)' | 'Kemenag (Madrasah)';
  sekolah?: string;
  semester?: string;
  mataPelajaran: string;
  fase: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  kelas: string;
  materi: string;
  alokasiWaktu: string;
  namaPenyusun?: string;
  dimensiProfil?: string[];
  dimensiPancaCinta?: string[];
  dimensiPPRA?: string[];
  karakteristikSiswa?: string;
  catatanTambahan?: string;
}

export interface CPAnalysis {
  kompetensi: string[];
  lingkupMateri: string[];
  kedalamanMateri: string;
  indikatorKemampuan: string[];
  hubunganFase: string;
  cpRawText: string;
}

export interface TPItem {
  id: string;
  text: string;
  selected: boolean;
}

export interface SuccessCriterion {
  id: string;
  tpId: string;
  tpText: string;
  text: string;
  selected: boolean;
}

export interface BigIdeaData {
  bigIdea: string;
  essentialQuestions: string[];
}

export interface EvidenceItem {
  id: string;
  title: string;
  description: string;
  rationale: string;
  selected: boolean;
}

export interface AssessmentData {
  method: string;
  description: string;
  rubric: string; // HTML or markdown formatted rubric table
  justification: string;
  assessmentForLearning?: string;
  assessmentAsLearning?: string;
  assessmentOfLearning?: string;
}

export interface LearningExperienceSection {
  title: string;
  duration: string;
  activities: string[];
}

export interface LearningExperience {
  kegiatanAwal: LearningExperienceSection;
  memahami: LearningExperienceSection;
  mengaplikasi: LearningExperienceSection;
  merefleksi: LearningExperienceSection;
  penutup: LearningExperienceSection;
}

export interface LearningResources {
  resources: { title: string; type: string; url?: string; description: string }[];
  justification: string;
}

export interface DigitalIntegration {
  recommendations: { tool: string; purpose: string; activityLink: string }[];
  justification: string;
}

export interface Differentiation {
  proses: string;
  produk: string;
  dukunganBelajar: string;
}

export interface LearningBlueprint {
  discovery: DiscoveryData;
  cpAnalysis: CPAnalysis;
  tps: TPItem[];
  successCriteria: SuccessCriterion[];
  bigIdea: BigIdeaData;
  evidence: EvidenceItem[];
  assessment: AssessmentData;
  modelPembelajaran: string;
  strategiPembelajaran: string;
}

export interface CompiledModule {
  id: string;
  title: string;
  createdAt: string;
  blueprint: LearningBlueprint;
  experience?: LearningExperience;
  resources?: LearningResources;
  digitalIntegration?: DigitalIntegration;
  differentiation?: Differentiation;
  htmlContent: string; // Editable standard A4 compiled lesson plan (Modul Ajar)
  lkpdHtml?: string;
  lkpdTitle?: string;
  bahanAjarHtml?: string;
  bahanAjarTitle?: string;
}
