
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// SIMULASI DATABASE USER
// Di production, ini diganti database query (Prisma/Supabase)
const MOCK_DB_USERS = [
  { 
    email: process.env.DIRECTOR_EMAIL || "director@bcc.com", 
    name: "Project Director", 
    role: "DIRECTOR", 
    isProfileCompleted: true 
  }
];

export async function loginAdminGoogle() {
  // 1. Simulasi data dari Google Auth
  const googleUser = {
    email: "new.staff@gmail.com",
    name: "Panitia Baru",
    avatar: "https://github.com/shadcn.png"
  };

  const userPayload = {
      ...googleUser,
      role: "DIRECTOR", // Langsung assign role
      isProfileCompleted: true, // Anggap profil sudah lengkap
      isOnboarded: true, // Anggap sudah melewati pakta integritas
  };

  // 2. Buat Session dengan role Director tanpa validasi
  const sessionData = JSON.stringify({
    ...userPayload,
    isLoggedIn: true,
  });

  cookies().set('bcc_admin_session', sessionData, { httpOnly: true, path: '/' });

  // 3. Langsung Redirect ke Dashboard
  return { success: true, redirectUrl: '/admin/dashboard', user: userPayload };
}

// 2. Logic Login PIN (Alternatif untuk di Lapangan)
export async function loginAdminByCode(prevState: any, formData: FormData) {
  const code = formData.get('code') as string;

  // Cari user di DB yang punya PIN ini
  const dbUser = MOCK_DB_USERS.find(u => (u as any).pin === code);

  if (!dbUser) {
    return { success: false, message: "Kode PIN tidak valid atau belum di-assign." };
  }

  const sessionData = JSON.stringify({
    name: dbUser.name,
    email: dbUser.email,
    role: dbUser.role,
    isLoggedIn: true,
    method: 'PIN',
    isOnboarded: false, // NEW: Force onboarding check
  });

  cookies().set('bcc_admin_session', sessionData, { httpOnly: true, path: '/' });
  return { success: true, message: "Login berhasil!" };
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
