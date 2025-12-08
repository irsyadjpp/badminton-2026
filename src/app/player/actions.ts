'use server';

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

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

export async function getPlayerSession() {
  // Ambil dari cookie
  return { email: "player@example.com", name: "Kevin", teamId: null }; 
}
