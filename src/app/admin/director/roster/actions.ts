
'use server';

import { committeeMemberSchema, type CommitteeMember } from "@/lib/schemas/committee";

// Mock Database (In-Memory)
let COMMITTEE_ROSTER: CommitteeMember[] = [
  // Pimpinan & Penasihat
  { id: "aris_i", name: "Aris Indro", phone: "081-...", email: "aris@example.com", expertise: "Penasihat Senior", role: "ADVISOR" },
  
  // Panitia Inti
  { id: "irsyad_j", name: "Irsyad Jamal Pratama Putra", phone: "081-...", email: "irsyad@example.com", expertise: "IT & Project Management", photoUrl: "https://github.com/shadcn.png", role: "DIRECTOR" },
  { id: "rizki_k", name: "Rizki Karami", phone: "081-...", email: "rizki.k@example.com", expertise: "Sekretariat & Acara", role: "STAFF" },
  { id: "annisa_s", name: "Annisa Syafira", phone: "081-...", email: "annisa@example.com", expertise: "Administrasi", role: "STAFF" },
  { id: "selvi_y", name: "Selvi Yulia", phone: "081-...", email: "selvi@example.com", expertise: "Keuangan", role: "STAFF" },

  // Bidang Pertandingan
  { id: "wicky_p", name: "Wicky (PBSI)", phone: "081-...", email: "wicky@example.com", expertise: "Match Control", role: "STAFF" },
  { id: "sarah_f", name: "Sarah Fatmawati", phone: "081-...", email: "sarah.f@example.com", expertise: "MLO", role: "STAFF" },
  { id: "anindiffa_p", name: "Anindiffa Pandu Prayuda", phone: "081-...", email: "anindiffa@example.com", expertise: "TPF", role: "STAFF" },
  { id: "aulia_f", name: "Aulia Febrianto", phone: "081-...", email: "aulia@example.com", expertise: "TPF", role: "STAFF" },
  { id: "faiz_a", name: "Faiz Azilla Syaehon", phone: "081-...", email: "faiz@example.com", expertise: "TPF", role: "STAFF" },

  // Bidang Komersial
  { id: "teri_t", name: "Teri Taufiq Mulyadi", phone: "081-...", email: "teri@example.com", expertise: "Business", role: "STAFF" },
  { id: "ali_w", name: "Ali Wardana", phone: "081-...", email: "ali@example.com", expertise: "Sponsorship", role: "STAFF" },
  { id: "risca_a", name: "Risca Amalia", phone: "081-...", email: "risca@example.com", expertise: "Tenant Relations", role: "STAFF" },

  // Bidang Acara & Kreatif
  { id: "susi_s", name: "Susi", phone: "081-...", email: "susi@example.com", expertise: "Media & Sosmed", role: "STAFF" },
  { id: "sarah_m", name: "Sarah Maulidina", phone: "081-...", email: "sarah.m@example.com", expertise: "Content Creator", role: "STAFF" },
  { id: "rizky_m", name: "Rizky Mauludin", phone: "081-...", email: "rizky.m@example.com", expertise: "Dokumentasi", role: "STAFF" },

  // Bidang Operasional
  { id: "kevin_d", name: "Kevin Deriansyah Budiman", phone: "081-...", email: "kevin@example.com", expertise: "Operasional", role: "STAFF" },
  { id: "nur_s", name: "Muhammad Nur Sidiq Buana", phone: "081-...", email: "nur.s@example.com", expertise: "Keamanan", role: "STAFF" },
  { id: "ananda_p", name: "Ananda Putri", phone: "081-...", email: "ananda.p@example.com", expertise: "Medis", role: "STAFF" },
  { id: "norma_a", name: "Norma Ayu Laras Tyas", phone: "081-...", email: "norma@example.com", expertise: "Registrasi", role: "STAFF" },
  { id: "alfin_a", name: "Alfin", phone: "081-...", email: "alfin@example.com", expertise: "Logistik", role: "STAFF" },

  // Bidang Legal
  { id: "lidya_l", name: "Lidya", phone: "081-...", email: "lidya@example.com", expertise: "Legal", role: "STAFF" },
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

export async function assignUserRole(formData: FormData) {
    const userId = formData.get('userId');
    // const role = formData.get('role');
    // const division = formData.get('division');

    console.log("Assigning role for user:", userId);
    // In a real app, update user in the database
    // MOCK_USERS_DB.find(u => u.id === userId).role = role;
    
    await new Promise(r => setTimeout(r, 1000));
    return { success: true };
}
