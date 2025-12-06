'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const ADMIN_CODES: Record<string, { name: string; role: string }> = {
  // 1. PIMPINAN INTI (STEERING COMMITTEE)
  "001": { name: "Irsyad Jamal (Project Director)", role: "DIRECTOR" },
  "101": { name: "Rizki/Annisa (Sekretaris)", role: "SECRETARY" },
  "102": { name: "Selvi Yulia (Bendahara)", role: "FINANCE" },

  // 2. BIDANG PERTANDINGAN (MATCH CONTROL)
  "201": { name: "Agung (Koord. Pertandingan)", role: "MATCH_COORD" },
  "202": { name: "Sarah Fatmawati (MLO)", role: "MLO" },
  "203": { name: "Tim Verifikasi (TPF)", role: "TPF" }, // Anindiffa, Aulia, Faiz
  "204": { name: "Referee Utama", role: "REFEREE" }, // Jabatan Fungsional Khusus

  // 3. BIDANG KOMERSIAL (BUSINESS)
  "301": { name: "Teri Taufiq (Koord. Bisnis)", role: "BUSINESS_LEAD" },
  "302": { name: "Ali/Risca (Sponsorship/Tenant)", role: "BUSINESS" },
  "445": { name: "Hera (Tenant)", role: "TENANT_RELATIONS" },


  // 4. BIDANG ACARA & KREATIF (SHOW & MEDIA)
  "401": { name: "Rizki Karami (Show Director)", role: "SHOW_DIR" },
  "402": { name: "Susi/Sarah/Rizky (Media)", role: "MEDIA" },

  // 5. BIDANG OPERASIONAL UMUM (OPERATIONS)
  "501": { name: "Kevin Deriansyah (Koord. Ops)", role: "OPS_LEAD" },
  "502": { name: "M. Nur Sidiq (Keamanan/Gate)", role: "GATE" },
  "503": { name: "Ananda Putri (Medis)", role: "MEDIC" },
  "504": { name: "Norma/Alfin (Reg/Logistik)", role: "LOGISTICS" },

  // 6. BIDANG IT & DIGITAL
  "601": { name: "Tim IT Support", role: "IT_ADMIN" } 
};


// Login dengan PIN (Existing)
export async function loginAdminByCode(prevState: any, formData: FormData) {
  const code = formData.get('code') as string;
  // @ts-ignore
  const adminInfo = ADMIN_CODES[code];

  if (!adminInfo) {
    return { success: false, message: "Kode PIN tidak valid." };
  }

  await new Promise(r => setTimeout(r, 800));

  const sessionData = JSON.stringify({
    name: adminInfo.name,
    role: adminInfo.role,
    isLoggedIn: true,
    method: 'PIN',
    isOnboarded: false, // NEW: Force onboarding check
  });

  cookies().set('bcc_admin_session', sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 12, 
    path: '/',
  });

  return { success: true, message: "Login berhasil!" };
}

// BARU: Login dengan Google (Simulasi)
export async function loginAdminGoogle() {
  await new Promise(r => setTimeout(r, 1500)); // Simulasi Network Delay

  // Dalam aplikasi nyata, di sini kita akan cek email Google di database
  // Untuk simulasi, kita anggap yang login Google adalah Project Director (Super Admin)
  const sessionData = JSON.stringify({
    name: "Irsyad Jamal (Google)",
    role: "DIRECTOR", // Default Role untuk Google Login simulasi
    isLoggedIn: true,
    method: 'GOOGLE',
    isOnboarded: false, // NEW: Force onboarding check
  });

  cookies().set('bcc_admin_session', sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // Login Google tahan 1 minggu
    path: '/',
  });

  return { success: true };
}

export async function logoutAdmin() {
  cookies().delete('bcc_admin_session');
  redirect('/');
}

export async function getAdminSession() {
  const session = cookies().get('bcc_admin_session');
  if (!session) return null;
  try {
    return JSON.parse(session.value);
  } catch (e) {
    return null;
  }
}

// NEW: Action to sign integrity pact
export async function signIntegrityPact() {
  const session = await getAdminSession();
  if (!session) return { success: false };

  const updatedSession = { ...session, isOnboarded: true };

  cookies().set('bcc_admin_session', JSON.stringify(updatedSession), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return { success: true };
}
