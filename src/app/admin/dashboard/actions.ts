
'use server';

import { revalidatePath } from "next/cache";

// --- 1. ABSENSI ---
export async function clockIn(location: string) {
  await new Promise(r => setTimeout(r, 1000));
  // Simulasi logic database
  return { 
    success: true, 
    message: "Clock-In Berhasil! Semangat bertugas 🔥",
    timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    streak: 3 // Simulasi streak hari ke-3
  };
}

// --- 2. KONSUMSI ---
export async function redeemMeal() {
  await new Promise(r => setTimeout(r, 1200));
  return {
    success: true,
    code: "MEAL-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
    menu: "Nasi Ayam Bakar + Es Teh"
  };
}

// --- 3. MISI (GAMIFICATION) ---
export async function completeMission(formData: FormData) {
  await new Promise(r => setTimeout(r, 1500)); // Simulasi upload
  
  const missionId = formData.get('missionId');
  const proofImage = formData.get('proof'); // File foto

  // Di sini nanti ada logic upload ke Storage (S3/GCS)
  console.log(`Mission ${missionId} completed with proof: ${(proofImage as File).name}`);

  // 2. Simpan status mission jadi "PENDING_REVIEW"
  // 3. XP baru masuk SETELAH di-approve Koordinator Divisi
  return { 
    success: true, 
    status: "PENDING_REVIEW", 
    message: "Bukti dikirim! Menunggu validasi Koordinator." 
  };
}

// --- 4. PANIC BUTTON ---
export async function triggerSOS(type: string, location: string) {
  // Di real app, ini akan kirim Push Notification ke tim keamanan/medis
  await new Promise(r => setTimeout(r, 500)); 
  console.log(`EMERGENCY [${type}] at [${location}]`);
  return { success: true };
}

// --- DATA INITIAL (Simulasi Load Data) ---
export async function getCommitteeData() {
  return {
    dutyRoster: {
      time: "08:00 - 12:00",
      location: "Gate Utama (Ticket Checking)",
      supervisor: "Budi Santoso (Head Security)",
      status: "CURRENT"
    },
    honorarium: {
      total: 450000,
      breakdown: [
        { date: "13 Juni", activity: "Day 1 - Setup", amount: 150000 },
        { date: "14 Juni", activity: "Day 2 - Qualification", amount: 150000 },
        { date: "20 Juni", activity: "Day 3 - Quarter Final", amount: 150000 },
      ]
    },
    missions: [
      { id: 1, title: "Datang sebelum jam 07:00", xp: 50, status: 'DONE' },
      { id: 2, title: "Input skor 10 pertandingan", xp: 100, status: 'TODO' },
      { id: 3, title: "Bantu bersihkan area VIP", xp: 75, status: 'PENDING_REVIEW' },
    ]
  };
}


export async function getMyDutyRoster() {
  return {
    currentShift: {
      time: "08:00 - 12:00",
      location: "Gate Utama (Ticket Checking)",
      supervisor: "Budi Santoso (Head Security)",
      status: "CURRENT"
    },
    nextShift: {
      time: "13:00 - 17:00",
      location: "VIP Lounge (Access Control)",
      status: "UPCOMING"
    }
  };
}
