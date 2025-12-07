
'use server';

import { revalidatePath } from "next/cache";

// Mock Data Insiden
let activeIncidents = [
  { id: 'SOS-001', type: 'MEDIS', location: 'Lapangan 3', status: 'OPEN', time: '10:45', reportedBy: 'Kevin Ops' },
  { id: 'SOS-002', type: 'SECURITY', location: 'Pintu Tribun B', status: 'ASSIGNED', time: '10:50', reportedBy: 'System', handler: 'Sarah Security' }
];

// Mock Data Staff Available
const availableUnits = [
  { id: 'STF-01', name: 'Sarah Security', status: 'BUSY', role: 'SECURITY' },
  { id: 'STF-02', name: 'Budi Medis', status: 'IDLE', role: 'MEDIS' },
  { id: 'STF-03', name: 'Joko Teknis', status: 'IDLE', role: 'TEKNIS' },
];

export async function getDispatchData() {
  return { incidents: activeIncidents, units: availableUnits };
}

export async function assignIncident(incidentId: string, unitId: string) {
  // Logic update database
  await new Promise(r => setTimeout(r, 1000));
  
  // Update mock data local (untuk demo)
  const incident = activeIncidents.find(i => i.id === incidentId);
  if (incident) {
    incident.status = 'ASSIGNED';
    // @ts-ignore
    incident.handler = unitId; // Di real app simpan nama unit
  }
  
  revalidatePath('/admin/dispatch');
  return { success: true, message: `Unit ${unitId} dispatched to ${incidentId}` };
}

export async function resolveIncident(incidentId: string, notes: string) {
  await new Promise(r => setTimeout(r, 1000));
  
  // Remove from active list or mark resolved
  activeIncidents = activeIncidents.filter(i => i.id !== incidentId);
  
  revalidatePath('/admin/dispatch');
  return { success: true, message: "Insiden diselesaikan. Good job!" };
}
