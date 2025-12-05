
'use server';

import { z } from "zod";

// Skema data untuk satu anggota panitia
export const committeeMemberSchema = z.object({
  id: z.string().optional(), // ID akan digenerate
  name: z.string().min(2, "Nama wajib diisi."),
  phone: z.string().min(10, "Nomor telepon tidak valid.").optional().or(z.literal('')),
  email: z.string().email("Email tidak valid.").optional().or(z.literal('')),
  expertise: z.string().optional(), // Keahlian utama
  photoUrl: z.string().url().optional().or(z.literal('')), // URL foto profil
});

export type CommitteeMember = z.infer<typeof committeeMemberSchema>;

// Mock Database (In-Memory)
let COMMITTEE_ROSTER: CommitteeMember[] = [
  { id: "irsyad_j", name: "Irsyad Jamal Pratama Putra", phone: "0811...", email: "irsyad@example.com", expertise: "IT & Project Management", photoUrl: "https://placehold.co/100x100?text=IJ" },
  { id: "rizki_k", name: "Rizki Karami", phone: "0812...", email: "rizki@example.com", expertise: "Sekretariat & Acara" },
  { id: "selvi_y", name: "Selvi Yulia", phone: "0813...", email: "selvi@example.com", expertise: "Keuangan" },
  { id: "annisa_s", name: "Annisa Syafira", phone: "0814...", email: "annisa@example.com", expertise: "Administrasi" },
];

export async function getCommitteeRoster() {
  await new Promise(r => setTimeout(r, 200)); // Simulasi network delay
  return JSON.parse(JSON.stringify(COMMITTEE_ROSTER));
}

export async function addCommitteeMember(data: CommitteeMember) {
  const validation = committeeMemberSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: "Data tidak valid." };
  }
  
  await new Promise(r => setTimeout(r, 800));

  const newMember = {
    ...validation.data,
    id: validation.data.name.toLowerCase().replace(/\s/g, '_').slice(0, 10) + Date.now().toString().slice(-4)
  };
  
  COMMITTEE_ROSTER.push(newMember);
  return { success: true, message: `Anggota "${newMember.name}" berhasil ditambahkan.` };
}


export async function updateCommitteeMember(id: string, data: CommitteeMember) {
    const validation = committeeMemberSchema.safeParse(data);
    if (!validation.success) {
      return { success: false, message: "Data tidak valid." };
    }
    
    await new Promise(r => setTimeout(r, 800));
  
    const index = COMMITTEE_ROSTER.findIndex(m => m.id === id);
    if (index === -1) {
      return { success: false, message: "Anggota tidak ditemukan." };
    }
  
    COMMITTEE_ROSTER[index] = { ...COMMITTEE_ROSTER[index], ...validation.data };
    return { success: true, message: `Data "${validation.data.name}" berhasil diperbarui.` };
}

export async function deleteCommitteeMember(id: string) {
    await new Promise(r => setTimeout(r, 500));
    
    const index = COMMITTEE_ROSTER.findIndex(m => m.id === id);
    if (index === -1) {
      return { success: false, message: "Anggota tidak ditemukan." };
    }

    const deletedName = COMMITTEE_ROSTER[index].name;
    COMMITTEE_ROSTER.splice(index, 1);
    return { success: true, message: `Anggota "${deletedName}" telah dihapus.` };
}
