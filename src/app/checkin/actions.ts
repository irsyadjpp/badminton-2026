'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';

// --- SCHEMA & HELPER ---
const formSchema = z.object({
  name: z.string().min(2, "Nama wajib diisi"),
  whatsapp: z.string().min(10, "Nomor WA tidak valid"),
});

function generateVoucherCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'BCC-';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// --- MOCK DATABASE (Simulasi Data Server) ---
// Anggap ini adalah data yang ada di Firebase Anda
const MOCK_DATABASE = [
  { whatsapp: "08123456789", voucher: "BCC-LAMA", visitorId: "visitor-1" },
  { whatsapp: "08111111111", voucher: "BCC-TEST", visitorId: "visitor-2" },
];

// --- ACTION 1: CHECK-IN ---
export async function submitCheckin(prevState: any, formData: FormData) {
  const cookieStore = cookies();
  const existingSession = cookieStore.get('bcc_event_session');

  // LAPIS 1: Cek Cookie (Device Fingerprint)
  if (existingSession) {
    try {
      const sessionData = JSON.parse(existingSession.value);
      return {
        success: true,
        voucherCode: sessionData.voucherCode,
        visitorId: sessionData.visitorId,
        isExisting: true, 
        message: "Device ini sudah terdaftar!"
      };
    } catch (e) {}
  }

  // Validasi Input
  const name = formData.get('name') as string;
  const whatsapp = formData.get('whatsapp') as string;
  
  const validation = formSchema.safeParse({ name, whatsapp });
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulasi Delay

  if (!validation.success) {
    return { success: false, message: "Data tidak valid." };
  }

  // LAPIS 2: Cek Mock Database (Nomor WA Unik)
  const existingUser = MOCK_DATABASE.find(user => user.whatsapp === whatsapp);

  if (existingUser) {
    // Jika nomor sudah ada, kembalikan voucher lama & set cookie lagi
    const sessionData = JSON.stringify({
        voucherCode: existingUser.voucher,
        visitorId: existingUser.visitorId,
        timestamp: Date.now()
    });
    
    cookieStore.set('bcc_event_session', sessionData, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
    });

    return {
      success: true,
      voucherCode: existingUser.voucher,
      visitorId: existingUser.visitorId,
      isExisting: true,
      message: "Nomor ini sudah terdaftar sebelumnya!"
    };
  }

  // LOLOS SEMUA CEK -> USER BARU
  const newVoucher = generateVoucherCode();
  const visitorId = `visitor-${Date.now()}`;
  
  // Simpan session baru
  const sessionData = JSON.stringify({
    voucherCode: newVoucher,
    visitorId: visitorId,
    timestamp: Date.now()
  });

  cookieStore.set('bcc_event_session', sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
  
  return { 
    success: true, 
    voucherCode: newVoucher,
    visitorId: visitorId,
    isExisting: false, // Confetti akan meledak
    message: "Check-in Berhasil!" 
  };
}

// --- ACTION 2: VOTING TIM ---
export async function submitVote(visitorId: string, teamName: string) {
  const cookieStore = cookies();
  if (!cookieStore.has('bcc_event_session')) {
     return { success: false, message: "Silakan check-in terlebih dahulu" };
  }
  await new Promise((resolve) => setTimeout(resolve, 800));
  console.log(`[MOCK DB] Visitor ${visitorId} voted for ${teamName}`);
  return { success: true };
}

// --- ACTION 3: KUNJUNGAN BOOTH ---
const SPONSORS = [
  { id: 'bjb', name: 'Bank BJB' },
  { id: 'yonex', name: 'Yonex' },
  { id: 'pocari', name: 'Pocari Sweat' },
  { id: 'kopi', name: 'Kopi Kenangan' },
];

export async function visitBooth(visitorId: string, boothId: string) {
  const cookieStore = cookies();
  if (!cookieStore.has('bcc_event_session')) {
     return { success: false, message: "Scan Invalid" };
  }

  await new Promise((resolve) => setTimeout(resolve, 500)); 

  const sponsor = SPONSORS.find(s => s.id === boothId);
  if (!sponsor) return { success: false, message: "Booth tidak valid" };

  return { 
    success: true, 
    sponsorName: sponsor.name,
    message: `Stamp ${sponsor.name} Berhasil!`,
    totalStamps: 1 
  };
}

// --- ACTION 4: LEADERBOARD ---
export async function getLeaderboard() {
  // Simulasi data real-time
  return [
    { team: "PB Djarum", votes: 1250, percent: 45 },
    { team: "Jaya Raya", votes: 980, percent: 35 },
    { team: "SGS PLN", votes: 560, percent: 20 },
  ];
}
