
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

// MOCK USER DATABASE
// Di real app, ini cek ke Firebase Auth / Firestore users collection
const MOCK_USERS = [
  { email: "budi@gmail.com", password: "password123", name: "Budi Santoso", phone: "08123456789" }
];

export async function loginManager(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const validation = authSchema.safeParse({ email, password });
  if (!validation.success) {
    return { success: false, message: "Format email atau password salah." };
  }

  // Simulasi Cek DB
  await new Promise(r => setTimeout(r, 1000));

  // Disini kita bypass password check untuk kemudahan testing, 
  // atau gunakan logic: (email === 'demo@bcc.com' && password === '123456')
  
  // Set Session Cookie
  const sessionData = JSON.stringify({
    email,
    name: email.split('@')[0], // Ambil nama dari email
    role: 'manager',
    isLoggedIn: true
  });

  const cookieStore = cookies();
  cookieStore.set('bcc_manager_session', sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 1, // 1 Hari
    path: '/',
  });

  return { success: true, message: "Login berhasil!" };
}

export async function registerManager(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;

  // Simulasi Register
  await new Promise(r => setTimeout(r, 1500));

  // Auto Login setelah register
  const sessionData = JSON.stringify({
    email,
    name,
    phone,
    role: 'manager',
    isLoggedIn: true
  });

  const cookieStore = cookies();
  cookieStore.set('bcc_manager_session', sessionData, { httpOnly: true, path: '/' });

  return { success: true, message: "Registrasi berhasil!" };
}

export async function logoutManager() {
  const cookieStore = cookies();
  cookieStore.delete('bcc_manager_session');
  redirect('/manager/login');
}

// Helper untuk mengambil session di Server Component
export async function getManagerSession() {
  const cookieStore = cookies();
  const session = cookieStore.get('bcc_manager_session');
  if (!session) return null;
  try {
    return JSON.parse(session.value);
  } catch (e) {
    return null;
  }
}

export async function loginManagerGoogle() {
  // 1. Simulasi Delay Network
  await new Promise(r => setTimeout(r, 1500));

  // 2. Simulasi Data dari Google
  const mockGoogleUser = {
    email: "manager.google@gmail.com",
    name: "Budi Google (Manager)",
    picture: "https://github.com/shadcn.png", // Placeholder avatar
    role: 'manager',
    isLoggedIn: true,
    provider: 'google'
  };

  // 3. Set Session Cookie
  const cookieStore = cookies();
  cookieStore.set('bcc_manager_session', JSON.stringify(mockGoogleUser), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 Minggu
    path: '/',
  });

  return { success: true };
}
