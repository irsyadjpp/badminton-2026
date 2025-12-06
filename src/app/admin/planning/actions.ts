'use server';

export type ProgramProposal = {
  id: string;
  division: string; // 'MATCH', 'MEDIA', 'BUSINESS', etc.
  title: string;
  objective: string; // Tujuan & Output
  deadline: string;
  costEstimate: number;
  priority: 'MUST' | 'SHOULD' | 'COULD' | 'WONT'; // MoSCoW Method
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REVISION' | 'REJECTED';
  scNotes?: string; // Catatan dari Director
};

// MOCK DATABASE
let PROGRAMS: ProgramProposal[] = [
  {
    id: "PROG-001",
    division: "MEDIA",
    title: "Video Teaser Instagram",
    objective: "Hype pendaftaran. Output: Video 60s.",
    deadline: "2026-01-15",
    costEstimate: 500000,
    priority: "MUST",
    status: "SUBMITTED"
  },
  {
    id: "PROG-002",
    division: "OPS",
    title: "Sewa Misty Fan (Kipas Embun)",
    objective: "Pendingin GOR. Output: 4 Unit.",
    deadline: "2026-06-10",
    costEstimate: 2500000,
    priority: "SHOULD",
    status: "DRAFT"
  }
];

export async function getPrograms() {
  return PROGRAMS;
}

export async function submitProgram(data: any) {
  await new Promise(r => setTimeout(r, 800));
  const newProg = {
    ...data,
    id: `PROG-${Date.now()}`,
    status: 'SUBMITTED'
  };
  PROGRAMS.unshift(newProg);
  return { success: true, message: "Rencana kerja berhasil diajukan ke SC." };
}

export async function reviewProgram(id: string, decision: 'APPROVED' | 'REVISION' | 'REJECTED', notes: string) {
  await new Promise(r => setTimeout(r, 800));
  const idx = PROGRAMS.findIndex(p => p.id === id);
  if (idx !== -1) {
    PROGRAMS[idx].status = decision;
    PROGRAMS[idx].scNotes = notes;
  }
  
  // Jika APPROVED, di real app di sini kita akan update tabel 'Budget' dan 'Calendar'
  
  return { success: true, message: `Status program diperbarui menjadi ${decision}` };
}
