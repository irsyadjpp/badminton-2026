'use server';

import { revalidatePath } from "next/cache";

// Tipe Data Volunteer
export type Volunteer = {
  id: string;
  name: string;
  wa: string;
  role: string;
  status: 'PENDING' | 'INTERVIEW' | 'ACCEPTED' | 'REJECTED';
};

// MOCK DATABASE (Nanti ganti dengan Prisma/SQL)
let volunteersDB: Volunteer[] = [
  { id: "V001", name: "Asep Sunandar", role: "LOGISTIK", status: "ACCEPTED", wa: "08123456789" },
  { id: "V002", name: "Lilis Suryani", role: "PENDING", status: "INTERVIEW", wa: "08567890123" },
];

export async function getVolunteers() {
  await new Promise(r => setTimeout(r, 500)); // Simulasi delay
  return volunteersDB;
}

export async function addVolunteer(data: FormData) {
  await new Promise(r => setTimeout(r, 800));
  
  const newVol: Volunteer = {
    id: `V${Date.now()}`,
    name: data.get('name') as string,
    wa: data.get('wa') as string,
    role: data.get('role') as string || 'PENDING',
    status: 'PENDING'
  };

  volunteersDB.unshift(newVol); // Tambah ke paling atas
  revalidatePath('/admin/hr/volunteers');
  return { success: true, message: "Volunteer berhasil ditambahkan manually." };
}

export async function updateVolunteer(id: string, updates: Partial<Volunteer>) {
  await new Promise(r => setTimeout(r, 500));
  volunteersDB = volunteersDB.map(v => v.id === id ? { ...v, ...updates } : v);
  revalidatePath('/admin/hr/volunteers');
  return { success: true, message: "Data volunteer diperbarui." };
}

export async function deleteVolunteer(id: string) {
  await new Promise(r => setTimeout(r, 800));
  volunteersDB = volunteersDB.filter(v => v.id !== id);
  revalidatePath('/admin/hr/volunteers');
  return { success: true, message: "Volunteer dihapus dari database." };
}
