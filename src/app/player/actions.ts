
'use server';

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// MOCK DB
let PLAYERS_DB: any[] = [];
// Tim dengan Kode Unik
const TEAMS_DB = [
  { id: "TEAM-01", name: "PB Djarum", code: "BCC-8821", manager: "Budi" },
  { id: "TEAM-02", name: "PB Jaya Raya", code: "BCC-9912", manager: "Susi" }
];

export async function registerPlayer(data: any) {
  // 1. Cek NIK Duplikat (Wajib)
  if (PLAYERS_DB.find(p => p.nik === data.nik)) {
    return { success: false, message: "NIK sudah terdaftar!" };
  }

  const newPlayer = {
    id: `P-${Date.now()}`,
    ...data,
    teamId: null, // Belum punya tim
    status: 'ACTIVE'
  };
  
  PLAYERS_DB.push(newPlayer);
  return { success: true };
}

export async function joinTeam(playerEmail: string, teamCode: string) {
  // 1. Cari Tim berdasarkan Kode
  const team = TEAMS_DB.find(t => t.code === teamCode);
  if (!team) {
    return { success: false, message: "Kode Tim tidak valid/tidak ditemukan." };
  }

  // 2. Cari Pemain (Mock: anggap email valid)
  // Di real app, update kolom teamId di table Player
  
  // Simulasi sukses
  return { success: true, teamName: team.name };
}

// --- TAMBAHAN BARU: LOGIN GOOGLE BYPASS ---
export async function loginPlayerGoogle() {
  // Simulasi delay jaringan sebentar
  await new Promise(r => setTimeout(r, 800));

  // Buat Sesi Dummy (Development Mode)
  const devSession = {
    id: `P-DEV-${Date.now()}`,
    email: "atlet.dev@gmail.com",
    name: "Atlet Development", // Nama default
    role: "PLAYER",
    teamId: null, // Anggap belum punya tim
    isLoggedIn: true,
    provider: "GOOGLE_DEV"
  };

  // Set Cookie
  cookies().set('bcc_player_session', JSON.stringify(devSession), {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24, // 1 Hari
  });

  return { success: true };
}

// Update Helper Session
export async function getPlayerSession() {
  const session = cookies().get('bcc_player_session');
  if (!session) return null;
  try {
      return JSON.parse(session.value);
  } catch (e) {
      return null;
  }
}
