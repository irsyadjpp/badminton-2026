
'use server';

import { protestFormSchema, type ProtestFormValues } from '@/lib/schemas/protest';

// MOCK Database Protes
const MOCK_PROTESTS: any[] = [];
let protestCounter = 0;

function generateProtestId() {
  protestCounter++;
  const number = String(protestCounter).padStart(3, '0');
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear().toString().slice(-2);
  return `PRT/${number}/${month}/${year}`;
}

export async function submitProtest(formData: ProtestFormValues) {
  const validation = protestFormSchema.safeParse(formData);
  if (!validation.success) { 
    console.error(validation.error.errors);
    return { success: false, message: "Data tidak valid. Periksa kembali isian Anda." } 
  }

  const protestId = generateProtestId();
  const newProtest = {
    id: protestId,
    ...formData,
    status: 'PENDING_DEPOSIT', // STATUS AWAL
    submissionDate: new Date().toISOString(),
  };

  MOCK_PROTESTS.push(newProtest);

  await new Promise(r => setTimeout(r, 1500)); // Simulasi Delay

  return { 
    success: true, 
    protestId, 
    teamName: newProtest.teamName,
    message: "Protes telah dicatat di sistem. Silakan lanjutkan ke pembayaran deposit."
  };
}

export async function getProtests() {
    await new Promise(r => setTimeout(r, 500));
    return MOCK_PROTESTS;
}

export async function confirmDeposit(protestId: string) {
    const protest = MOCK_PROTESTS.find(p => p.id === protestId);
    if (protest) {
        protest.status = 'PENDING_REVIEW';
    }
    await new Promise(r => setTimeout(r, 800));
    return { success: true, message: `Deposit untuk ${protestId} telah dikonfirmasi.` };
}

export async function resolveProtest(id: string, decision: 'ACCEPTED' | 'REJECTED', verdict: string) {
    const protest = MOCK_PROTESTS.find(p => p.id === id);
    if (protest) {
        protest.status = decision === 'ACCEPTED' ? 'ACCEPTED' : 'REJECTED';
        protest.verdict = verdict;
    }
    await new Promise(r => setTimeout(r, 1000));
    return { success: true, message: `Keputusan untuk ${id} telah disimpan.` };
}
