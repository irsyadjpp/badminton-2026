'use server';

import { revalidatePath } from "next/cache";

export type Match = {
  id: string;
  category: string; // MD, WD, XD
  playerA: string;
  playerB: string;
  court: string;
  time: string;
  status: 'SCHEDULED' | 'LIVE' | 'COMPLETED';
};

// MOCK DB
let matchesDB: Match[] = [
  { id: "M01", category: "MD Open", playerA: "Kevin/Marcus", playerB: "Ahsan/Hendra", court: "1", time: "09:00", status: "SCHEDULED" }
];

export async function getMatches() {
  return matchesDB;
}

export async function createMatch(data: FormData) {
  await new Promise(r => setTimeout(r, 800));
  const newMatch: Match = {
    id: `M${Date.now().toString().slice(-4)}`,
    category: data.get('category') as string,
    playerA: data.get('playerA') as string,
    playerB: data.get('playerB') as string,
    court: data.get('court') as string || '-',
    time: data.get('time') as string || '00:00',
    status: 'SCHEDULED'
  };
  matchesDB.push(newMatch);
  revalidatePath('/admin/matches');
  return { success: true };
}

export async function deleteMatch(id: string) {
  matchesDB = matchesDB.filter(m => m.id !== id);
  revalidatePath('/admin/matches');
  return { success: true };
}
