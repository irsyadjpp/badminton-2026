
'use server';

export type MedicalLog = {
  id: string;
  timestamp: string;
  patientName: string;
  role: 'ATLET' | 'PANITIA' | 'PENONTON';
  court: string;
  injuryType: string; // Kram, Sprain, Luka Terbuka, Pingsan
  actionTaken: string; // Ethyl Chloride, Tapping, Rujuk RS
  status: 'RECOVERED' | 'REFERRED_TO_HOSPITAL' | 'RETIRED'; // Sembuh / Rujuk / Tidak Bisa Lanjut
  medicInCharge: string;
};

let MOCK_MEDICAL_LOGS: MedicalLog[] = [
  {
    id: "MED-001",
    timestamp: "10:15",
    patientName: "Kevin (PB Djarum)",
    role: "ATLET",
    court: "1",
    injuryType: "Muscle Cramp (Betis Kanan)",
    actionTaken: "Pain killer spray + Stretching",
    status: "RECOVERED",
    medicInCharge: "Nanda"
  },
  {
    id: "MED-002",
    timestamp: "14:30",
    patientName: "Penonton A",
    role: "PENONTON",
    court: "Tribun",
    injuryType: "Pingsan (Dehidrasi)",
    actionTaken: "Evakuasi ke Ruang Medis + Oksigen",
    status: "RECOVERED",
    medicInCharge: "Tim PMI"
  }
];

export async function getMedicalLogs() {
  return MOCK_MEDICAL_LOGS;
}

export async function submitMedicalLog(data: any) {
  await new Promise(r => setTimeout(r, 1000));
  
  const newLog: MedicalLog = {
    id: `MED-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}),
    ...data
  };
  
  MOCK_MEDICAL_LOGS.unshift(newLog);
  return { success: true, message: "Laporan medis berhasil dicatat." };
}
