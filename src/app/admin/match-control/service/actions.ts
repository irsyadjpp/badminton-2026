
'use server';

import { revalidatePath } from "next/cache";

export type ServiceRequest = {
  id: string;
  court: string;
  type: 'MOP' | 'SHUTTLE' | 'MEDIC' | 'NET_REPAIR';
  status: 'PENDING' | 'ON_THE_WAY' | 'DONE';
  time: string;
};

// MOCK DB
let REQUESTS: ServiceRequest[] = [];

export async function requestService(court: string, type: ServiceRequest['type']) {
  const newReq: ServiceRequest = {
    id: `REQ-${Date.now()}`,
    court,
    type,
    status: 'PENDING',
    time: new Date().toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})
  };
  REQUESTS.unshift(newReq);
  revalidatePath('/admin/match-control/service'); // Dashboard Runner
  revalidatePath('/admin/referee/match/[id]'); // Refresh umpire view
  return { success: true };
}

export async function getActiveRequests() {
  return REQUESTS.filter(r => r.status !== 'DONE');
}

export async function updateRequestStatus(id: string, status: ServiceRequest['status']) {
  const req = REQUESTS.find(r => r.id === id);
  if (req) req.status = status;
  revalidatePath('/admin/match-control/service');
  return { success: true };
}
