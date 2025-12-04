'use server';

export type EvaluationParams = {
  // Struktur (25%)
  p1: number; p2: number; p3: number; p4: number;
  // Kinerja (35%)
  p5: number; p6: number; p7: number; p8: number; p9: number;
  // Dampak (25%)
  p10: number; p11: number; p12: number;
  // Profesionalisme (15%)
  p13: number; p14: number; p15: number; p16: number;
};

export type StaffEvaluation = {
  id: string;
  name: string;
  role: string;
  division: string;
  scores: EvaluationParams;
  rawScore: number;      // Total Poin Mentah (Max 80)
  weightedScore: number; // Total Persentase (Max 100%)
  grade: string;         // A, B, C, D, E
  honorReceived: number; // Rupiah
};

// BOBOT SKOR (Konversi Nilai 1-5 ke Persentase)
// Rumus: (Nilai Input * Faktor) = Persentase
// Contoh: P1 Nilai 5 * 1.25 = 6.25%
const WEIGHTS = {
  STRUKTUR: 1.25,      // 25% / 4 item / skala 5 = 1.25
  KINERJA: 1.4,        // 35% / 5 item / skala 5 = 1.4
  DAMPAK: 1.666,       // 25% / 3 item / skala 5 = 1.666
  PROFESIONAL: 0.75    // 15% / 4 item / skala 5 = 0.75
};

// MOCK DATA AWAL
let STAFF_LIST: StaffEvaluation[] = [
  { id: "1", name: "Rizki Karami", role: "Sekretaris 1", division: "INTI", scores: createZeroScores(), rawScore: 0, weightedScore: 0, grade: "E", honorReceived: 0 },
  { id: "2", name: "Selvi Yulia", role: "Bendahara", division: "INTI", scores: createZeroScores(), rawScore: 0, weightedScore: 0, grade: "E", honorReceived: 0 },
  { id: "3", name: "Agung", role: "Koord. Pertandingan", division: "MATCH", scores: createZeroScores(), rawScore: 0, weightedScore: 0, grade: "E", honorReceived: 0 },
];

function createZeroScores(): EvaluationParams {
  return { p1:0, p2:0, p3:0, p4:0, p5:0, p6:0, p7:0, p8:0, p9:0, p10:0, p11:0, p12:0, p13:0, p14:0, p15:0, p16:0 };
}

// HITUNG SKOR & GRADE
function calculateResult(scores: EvaluationParams): { raw: number, weighted: number, grade: string } {
  // 1. Raw Score (Sum P1-P16)
  const raw = Object.values(scores).reduce((a, b) => a + b, 0);

  // 2. Weighted Score (%)
  let w = 0;
  // Struktur
  w += (scores.p1 + scores.p2 + scores.p3 + scores.p4) * WEIGHTS.STRUKTUR;
  // Kinerja
  w += (scores.p5 + scores.p6 + scores.p7 + scores.p8 + scores.p9) * WEIGHTS.KINERJA;
  // Dampak
  w += (scores.p10 + scores.p11 + scores.p12) * WEIGHTS.DAMPAK;
  // Profesionalisme
  w += (scores.p13 + scores.p14 + scores.p15 + scores.p16) * WEIGHTS.PROFESIONAL;

  // 3. Grade
  let g = "E";
  if (w >= 85) g = "A";
  else if (w >= 70) g = "B";
  else if (w >= 55) g = "C";
  else if (w >= 40) g = "D";

  return { raw, weighted: w, grade: g };
}

export async function getStaffEvaluations() {
  return STAFF_LIST;
}

export async function saveEvaluation(staffId: string, scores: EvaluationParams) {
  await new Promise(r => setTimeout(r, 500));
  
  const index = STAFF_LIST.findIndex(s => s.id === staffId);
  if (index !== -1) {
    const res = calculateResult(scores);
    STAFF_LIST[index] = { 
        ...STAFF_LIST[index], 
        scores, 
        rawScore: res.raw, 
        weightedScore: parseFloat(res.weighted.toFixed(2)), 
        grade: res.grade 
    };
  }
  return { success: true };
}
