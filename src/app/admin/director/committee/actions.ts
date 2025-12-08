
'use server';

import { INITIAL_COMMITTEE_STRUCTURE, type CommitteeDivision } from '@/lib/committee-data';

// Mock Database (In-Memory)
let CURRENT_STRUCTURE = [...INITIAL_COMMITTEE_STRUCTURE];

export async function getCommitteeStructure() {
  // Deep copy to prevent mutation issues on the client before saving
  return JSON.parse(JSON.stringify(CURRENT_STRUCTURE));
}

export async function updateCommitteeStructure(newStructure: CommitteeDivision[]) {
  await new Promise(r => setTimeout(r, 800)); // Simulasi loading
  CURRENT_STRUCTURE = newStructure;
  return { success: true, message: "Struktur Panitia berhasil diperbarui." };
}

// Mock Data Personil (Unassigned)
const UNASSIGNED_STAFF = [
  { id: "S1", name: "Budi Santoso", email: "budi@gmail.com" },
  { id: "S2", name: "Siti Aminah", email: "siti@gmail.com" },
  { id: "S3", name: "Joko Anwar", email: "joko@gmail.com" },
];

export async function getUnassignedStaff() {
  // Di real app: Fetch user where division IS NULL
  return UNASSIGNED_STAFF;
}

export async function assignStaffToDivision(userId: string, divisionId: string, role: string) {
  // Simulasi update DB
  await new Promise(r => setTimeout(r, 1000));
  
  console.log(`Assigned ${userId} to ${divisionId} as ${role}`);
  
  // revalidatePath('/admin/director/committee');
  return { success: true, message: "Staff berhasil ditambahkan ke divisi." };
}
