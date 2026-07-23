export const mockUser = {
  fullName: "Budi Santoso",
  email: "budi.santoso@example.com",
};

export const mockEPPS = {
  consistencyCheck: { consistentPairs: 12, totalPairs: 15 },
  summary: { totalAnswers: 225 },
  normaResults: { ACH: 15, DEF: 12, ORD: 16, EXH: 10, AUT: 18, AFF: 14, INT: 13, SUC: 8, DOM: 19, ABA: 7, NUR: 11, CHG: 14, END: 16, HET: 12, AGG: 10 },
  itemAnalysis: Array.from({length: 225}).map(() => Math.random() > 0.5 ? 'A' : 'B')
};

export const mockCFIT = {
  iqScore: 115,
  classification: "Di atas Rata-rata",
  score: { correct: 38, total: 50, percentage: 76 },
  breakdown: [
    { subtest: "Subtes 1 (Seri)", correct: 10, total: 13, percentage: 76.9 },
    { subtest: "Subtes 2 (Klasifikasi)", correct: 11, total: 14, percentage: 78.5 },
    { subtest: "Subtes 3 (Matriks)", correct: 9, total: 13, percentage: 69.2 },
    { subtest: "Subtes 4 (Persyaratan)", correct: 8, total: 10, percentage: 80.0 },
  ],
  itemAnalysis: Array.from({length: 50}).map(() => Math.random() > 0.24)
};

export const mockBakum = {
  total_score: 285.5,
  persoalan_results: {
    persoalan_2: { score: 35, category: "tinggi", correct: 18, total: 20 },
    persoalan_3: { score: 15, category: "sedang", correct: 8, total: 10 },
    persoalan_4: { score: 32, category: "tinggi", correct: 16, total: 20 },
    persoalan_5: { score: 12, category: "sedang", correct: 6, total: 10 },
    persoalan_6: { score: 25, category: "tinggi", correct: 12, total: 15 },
    persoalan_7: { score: 18, category: "tinggi", correct: 9, total: 10 },
    persoalan_8: { score: 14, category: "sedang", correct: 7, total: 10 },
    persoalan_9: { score: 16, category: "sedang", correct: 8, total: 10 },
    persoalan_10: { score: 65, category: "tinggi", correct: 32, total: 40 },
  },
  itemAnalysis: {
    persoalan_2: Array.from({length: 20}).map(() => Math.random() > 0.1),
    persoalan_3: Array.from({length: 10}).map(() => Math.random() > 0.2),
    persoalan_4: Array.from({length: 20}).map(() => Math.random() > 0.2),
    persoalan_5: Array.from({length: 10}).map(() => Math.random() > 0.4),
    persoalan_6: Array.from({length: 15}).map(() => Math.random() > 0.2),
    persoalan_7: Array.from({length: 10}).map(() => Math.random() > 0.1),
    persoalan_8: Array.from({length: 10}).map(() => Math.random() > 0.3),
    persoalan_9: Array.from({length: 10}).map(() => Math.random() > 0.2),
    persoalan_10: Array.from({length: 40}).map(() => Math.random() > 0.2),
  }
};

export const mockCPM = {
  totalQuestions: 36,
  correctCount: 28,
  incorrectCount: 8,
  accuracy: 0.77,
  scoreByType: { A: 10, B: 9, AB: 9 },
  totalByType: { A: 12, B: 12, AB: 12 },
  accuracyByType: { A: 0.83, B: 0.75, AB: 0.75 },
  itemAnalysis: {
    A: Array.from({length: 12}).map(() => Math.random() > 0.15),
    B: Array.from({length: 12}).map(() => Math.random() > 0.25),
    AB: Array.from({length: 12}).map(() => Math.random() > 0.25),
  }
};

const minatJabatanOptions = ['A+', 'A-', 'A0', 'B+', 'B-', 'C0', 'D+', 'E-'];
export const mockMinatJabatan = {
  totalAnswered: 120,
  bidangMinatKategori: {
    A: "Sangat Menyukai", B: "Menyukai", C: "Biasa Saja", D: "Tidak Menyukai",
    E: "Sangat Menyukai", F: "Menyukai", G: "Biasa Saja", H: "Biasa Saja",
    I: "Sangat Menyukai", J: "Menyukai", K: "Tidak Menyukai", L: "Biasa Saja",
  },
  bidangMinatScore: { A: 85, B: 65, C: 45, D: 25, E: 90, F: 70, G: 50, H: 45, I: 88, J: 68, K: 20, L: 55 },
  tipeMinatScore: { Verbal: 35, Manipulatif: 42, Komputasi: 20 },
  tipeMinatKategori: { Verbal: "Cukup Berminat", Manipulatif: "Sangat Berminat", Komputasi: "Kurang Berminat" },
  tingkatMinatScore: { Rutin: 12, Terampil: 25, Profesional: 40 },
  tingkatMinatKategori: { Rutin: "Rendah", Terampil: "Sedang", Profesional: "Tinggi" },
  itemAnalysis: Array.from({length: 120}).map(() => minatJabatanOptions[Math.floor(Math.random() * minatJabatanOptions.length)])
};

export const mockKraepelin = {
  score: { total: 200, correct: 185, wrong: 10, unanswered: 5, percentage: 92.5 },
  columns: Array.from({length: 15}).map((_, i) => ({
    colNumber: i + 1,
    pace: Math.floor(Math.random() * 10) + 20, // 20-30
    correct: Math.floor(Math.random() * 5) + 15,
    wrong: Math.floor(Math.random() * 2)
  })),
  analysis: { puncak: 29, dasar: 20, rata_rata: 24.5, stabilitas: "Cukup Stabil", ketahanan: "Baik" }
};

export const mockInteligensiUmum = {
  score: { total: 100, correct: 82, wrong: 18, unanswered: 0, percentage: 82.0 },
  breakdown: Array.from({length: 20}).map((_, i) => ({
    questionGroup: `Soal ${i * 5 + 1} - ${i * 5 + 5}`,
    correct: Math.floor(Math.random() * 2) + 3,
    wrong: Math.floor(Math.random() * 2)
  })),
  itemAnalysis: Array.from({length: 100}).map(() => Math.random() > 0.18)
};
