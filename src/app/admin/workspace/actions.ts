'use server';

export type Task = {
  id: string;
  title: string;
  division: string;
  pic: string;
  deadline: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
};

export type Resource = {
  id: string;
  name: string;
  category: string;
  url: string;
  uploadedBy: string;
  date: string;
};

export type Announcement = {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  isImportant: boolean;
};

// MOCK DATABASE
let TASKS: Task[] = [
  { id: "T-01", title: "Follow-up Proposal Bank BJB", division: "BUSINESS", pic: "Teri", deadline: "2025-12-10", status: "IN_PROGRESS", priority: "HIGH" },
  { id: "T-02", title: "Desain Konten IG (Phase 1)", division: "MEDIA", pic: "Susi", deadline: "2025-12-15", status: "TODO", priority: "MEDIUM" },
  { id: "T-03", title: "Siapkan Form Pendaftaran", division: "MATCH", pic: "Wicky", deadline: "2025-12-20", status: "DONE", priority: "HIGH" },
];

let RESOURCES: Resource[] = [
  { id: "F-01", name: "Logo BCC High-Res.png", category: "BRANDING", url: "#", uploadedBy: "Media", date: "2025-12-01" },
  { id: "F-02", name: "Master Proposal v3.pdf", category: "SPONSORSHIP", url: "#", uploadedBy: "Secretary", date: "2025-12-05" },
];

let ANNOUNCEMENTS: Announcement[] = [
  { id: "A-01", title: "Rapat Pleno Diundur", content: "Rapat mingguan geser ke Jumat jam 19.00 WIB via Zoom.", date: "2025-12-06", author: "Project Director", isImportant: true }
];

export async function getWorkspaceData() {
  return { tasks: TASKS, resources: RESOURCES, announcements: ANNOUNCEMENTS };
}

export async function updateTaskStatus(taskId: string, newStatus: any) {
  await new Promise(r => setTimeout(r, 500));
  const idx = TASKS.findIndex(t => t.id === taskId);
  if (idx !== -1) TASKS[idx].status = newStatus;
  return { success: true };
}

export async function uploadResource(data: FormData) {
  await new Promise(r => setTimeout(r, 1000));
  // Simulasi upload
  RESOURCES.unshift({
      id: `F-${Date.now()}`,
      name: (data.get('file') as File).name,
      category: "GENERAL",
      url: "#",
      uploadedBy: "Me",
      date: new Date().toISOString().split('T')[0]
  });
  return { success: true, message: "File berhasil diunggah ke Repository." };
}
