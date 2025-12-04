'use server';

export type PlayerVerification = {
  id: string;
  name: string;
  team: string;
  category: string; // Beginner/Intermediate/Advance
  videoUrl: string;
  status: 'PENDING' | 'APPROVED' | 'UPGRADE_REQUIRED' | 'REJECTED';
  tpfScore?: number;
  notes?: string;
};

export type SpotCheckLog = {
  id: string;
  time: string;
  court: string;
  player: string;
  team: string;
  issue: 'SANDBAGGING' | 'JOKI' | 'ADMINISTRASI';
  evidence: string;
  recommendation: 'WARNING' | 'DISQUALIFY' | 'CLEAR';
};

// MOCK DATA VERIFIKASI VIDEO (Pre-Event)
const MOCK_VERIFICATIONS: PlayerVerification[] = [
  { id: "P001", name: "Andi Smash", team: "PB Djarum KW", category: "Intermediate", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", status: "PENDING" },
  { id: "P002", name: "Budi Lob", team: "PB Jaya", category: "Beginner", videoUrl: "https://www.youtube.com/embed/xyz", status: "APPROVED" },
  { id: "P003", name: "Siti Netting", team: "PB Exist", category: "Advance", videoUrl: "https://www.youtube.com/embed/abc", status: "PENDING" },
];

// MOCK DATA SPOT CHECK (On-Event)
let MOCK_SPOT_CHECKS: SpotCheckLog[] = [
  { id: "SC001", time: "10:30", court: "1", player: "Kevin KW", team: "PB Djarum KW", issue: "SANDBAGGING", evidence: "Smash terlalu tajam untuk Beginner", recommendation: "DISQUALIFY" }
];

export async function getVerificationQueue() {
  return MOCK_VERIFICATIONS;
}

export async function getSpotChecks() {
  return MOCK_SPOT_CHECKS;
}

export async function submitSpotCheck(data: any) {
  await new Promise(r => setTimeout(r, 1000));
  const newLog = {
    id: `SC${Date.now()}`,
    time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    ...data
  };
  MOCK_SPOT_CHECKS.unshift(newLog); // Add to top
  return { success: true, message: "Laporan Spot Check berhasil dicatat." };
}

export async function submitVerificationResult(playerId: string, result: any) {
    // Di real app: Update database
    await new Promise(r => setTimeout(r, 1000));
    return { success: true, message: `Status pemain ${playerId} diperbarui.` };
}
