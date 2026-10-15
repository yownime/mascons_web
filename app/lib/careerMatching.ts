export interface CareerMatchResult {
  topRankings: { rank: number; field: string; score: number }[];
  recommendedCareers: string[];
  recommendedMajors: string[];
}

const CAREER_RULES: { [key: string]: { careers: string[]; majors: string[] } } = {
  'Mekanik': {
    careers: ['Teknisi Mesin / Otomotif', 'Engineer Mekatronika', 'Spesialis Maintenance & Alat Berat'],
    majors: ['Teknik Mesin', 'Teknik Otomotif', 'Teknik Elektro / Instrumentasi'],
  },
  'Sains': {
    careers: ['Data Scientist / AI Engineer', 'Analis Riset Laboratorium', 'Software Developer'],
    majors: ['Teknik Informatika', 'Ilmu Komputer', 'Farmasi / Bioteknologi', 'Statistika Terapan'],
  },
  'Bisnis': {
    careers: ['Business Development', 'Akuntan / Auditor Keuangan', 'Manajer Pemasaran & Operasional'],
    majors: ['Manajemen Bisnis', 'Akuntansi', 'Ilmu Komunikasi Pemasaran'],
  },
  'Seni': {
    careers: ['UI/UX Designer', 'Creative Director / Animator', 'Desainer Grafis & Arsitek'],
    majors: ['Desain Komunikasi Visual (DKV)', 'Arsitektur', 'Desain Interior / Produk'],
  },
  'Pribadi Sosial': {
    careers: ['Konselor / Guru BK', 'Human Resources (HRD)', 'Spesialis Pelayanan Sosial & Komunitas'],
    majors: ['Psikologi', 'Bimbingan Konseling', 'Hubungan Internasional', 'Ilmu Hukum'],
  },
  'Natural': {
    careers: ['Spesialis Konservasi Lingkungan', 'Ahli Agroteknologi / Perkebunan', 'Surveyor Kelautan'],
    majors: ['Agroteknologi / Pertanian', 'Teknik Lingkungan', 'Kehutanan & Biologi'],
  },
};

export function matchCareerAndMajors(bidangScores: { [key: string]: number }): CareerMatchResult {
  // Sort descending by score
  const sorted = Object.entries(bidangScores)
    .sort((a, b) => b[1] - a[1])
    .map(([field, score], index) => ({
      rank: index + 1,
      field,
      score,
    }));

  const top1 = sorted[0]?.field;
  const top2 = sorted[1]?.field;

  const careersSet = new Set<string>();
  const majorsSet = new Set<string>();

  if (top1 && CAREER_RULES[top1]) {
    CAREER_RULES[top1].careers.slice(0, 2).forEach((c) => careersSet.add(c));
    CAREER_RULES[top1].majors.slice(0, 2).forEach((m) => majorsSet.add(m));
  }

  if (top2 && CAREER_RULES[top2]) {
    CAREER_RULES[top2].careers.slice(0, 2).forEach((c) => careersSet.add(c));
    CAREER_RULES[top2].majors.slice(0, 2).forEach((m) => majorsSet.add(m));
  }

  return {
    topRankings: sorted,
    recommendedCareers: Array.from(careersSet),
    recommendedMajors: Array.from(majorsSet),
  };
}
