'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Kanban, FolderOpen, Bell, Clock, AlertCircle, CheckCircle2,
  Download, Upload, Star, PlusCircle, Loader2, Megaphone, GripVertical,
  ClipboardCheck
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getWorkspaceData, updateTaskStatus, uploadResource, createTask, createAnnouncement, type Task } from "./actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

// --- IMPORT DRAG & DROP ---
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';

// Helper sederhana untuk mendapatkan sesi
const getSession = () => {
  if (typeof window === 'undefined') return null;
  const sessionStr = sessionStorage.getItem('admin_session');
  try {
    return JSON.parse(sessionStr!);
  } catch (e) {
    return null;
  }
}

// Definisi Kolom Kanban
const KANBAN_COLUMNS: Record<string, { label: string; color: string; icon: React.ElementType; iconColor: string; }> = {
  TODO: { 
    label: 'TO DO', 
    color: 'bg-zinc-100 dark:bg-zinc-900', 
    icon: Clock, 
    iconColor: 'text-zinc-500' 
  },
  IN_PROGRESS: { 
    label: 'IN PROGRESS', 
    color: 'bg-blue-50 dark:bg-blue-950/30', 
    icon: AlertCircle, 
    iconColor: 'text-blue-500' 
  },
  IN_REVIEW: { 
    label: 'IN REVIEW', 
    color: 'bg-purple-50 dark:bg-purple-950/30', // Warna Ungu untuk Review
    icon: ClipboardCheck, 
    iconColor: 'text-purple-500' 
  },
  DONE: { 
    label: 'DONE', 
    color: 'bg-green-50 dark:bg-green-950/30', 
    icon: CheckCircle2, 
    iconColor: 'text-green-600' 
  }
};

export default function WorkspacePage() {
  const { toast } = useToast();
  const [session, setSession] = useState<any>(null);
  const [data, setData] = useState<any>({ tasks: [], resources: [], announcements: [] });
  const [filterDiv, setFilterDiv] = useState("ALL");

  // Modal States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isAnnounceModalOpen, setIsAnnounceModalOpen] = useState(false);
  
  // Submission States
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);
  const [isSubmittingAnnounce, setIsSubmittingAnnounce] = useState(false);

  // Form states
  const [newTask, setNewTask] = useState<Omit<Task, 'id' | 'status'>>({
    title: "", division: "", pic: "", deadline: "", priority: "MEDIUM"
  });
  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", content: "" });

  useEffect(() => {
    loadData();
    const adminSession = getSession();
    if(adminSession) {
      setSession(adminSession);
    }
  }, []);

  const loadData = async () => {
    const res = await getWorkspaceData();
    setData(res);
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      await uploadResource(formData);
      toast({ title: "File Terupload", description: "Tersimpan di arsip digital." });
      loadData();
  };

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.pic) {
        toast({ title: "Error", description: "Judul dan PIC wajib diisi.", variant: "destructive" });
        return;
    }
    setIsSubmittingTask(true);
    const result = await createTask(newTask);
    setIsSubmittingTask(false);

    if (result.success) {
        toast({ title: "Tugas Ditambahkan", description: `Tugas "${newTask.title}" telah dibuat.` });
        setIsTaskModalOpen(false);
        setNewTask({ title: "", division: "", pic: "", deadline: "", priority: "MEDIUM" });
        loadData();
    }
  };

  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
        toast({ title: "Error", description: "Judul dan isi pengumuman wajib diisi.", variant: "destructive" });
        return;
    }
    setIsSubmittingAnnounce(true);
    const result = await createAnnouncement({
        ...newAnnouncement,
        author: session?.name || "Project Director",
    });
    setIsSubmittingAnnounce(false);

    if (result.success) {
        toast({ title: "Pengumuman Diterbitkan", description: "Pengumuman baru akan tampil di paling atas.", className: "bg-green-600 text-white" });
        setIsAnnounceModalOpen(false);
        setNewAnnouncement({ title: "", content: "" });
        loadData();
    }
  };
  
    // --- LOGIC DRAG AND DROP ---
  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // 1. Jika didrop di luar area atau di tempat yang sama
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // 2. Update Optimistik di Client Side
    const newStatus = destination.droppableId as Task['status'];
    
    // Copy array task
    const newTasks = Array.from(data.tasks);
    const taskIndex = newTasks.findIndex((t:any) => t.id === draggableId);
    
    if (taskIndex !== -1) {
        // Update status task lokal
        // @ts-ignore
        newTasks[taskIndex].status = newStatus;
        setData({ ...data, tasks: newTasks });

        // 3. Panggil Server Action
        await updateTaskStatus(draggableId, newStatus);
        toast({ title: "Status Updated", description: `Task dipindah ke ${newStatus.replace('_', ' ')}` });
    }
  };


  const isDirector = session?.role === 'DIRECTOR';

  // Helper untuk filter task sebelum dirender
  const getTasksByStatus = (status: string) => {
    return data.tasks.filter((t: Task) => 
      t.status === status && (filterDiv === 'ALL' || t.division === filterDiv)
    );
  };

  return (
    <>
      <div className="space-y-6 h-full flex flex-col">
        <div className="flex justify-between items-center shrink-0">
          <div>
              <h2 className="text-3xl font-bold font-headline text-primary">Workspace Panitia</h2>
              <p className="text-muted-foreground">Pusat kolaborasi, tugas, dan arsip dokumen.</p>
          </div>
          {isDirector && (
              <Button onClick={() => setIsAnnounceModalOpen(true)} className="bg-yellow-500 hover:bg-yellow-600 text-yellow-950">
                  <Megaphone className="w-4 h-4 mr-2"/> Buat Pengumuman
              </Button>
          )}
        </div>

        {/* 1. PENGUMUMAN (NOTICE BOARD) */}
        {data.announcements.length > 0 && (
            <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 rounded-r-lg shadow-sm shrink-0">
                <div className="flex items-start gap-3">
                    <Bell className="w-5 h-5 text-yellow-600 mt-1 animate-bounce" />
                    <div>
                        <h4 className="font-bold text-yellow-300 text-lg">{data.announcements[0].title}</h4>
                        <p className="text-yellow-400">{data.announcements[0].content}</p>
                        <p className="text-xs text-yellow-500 mt-1 font-mono">Posted by: {data.announcements[0].author} • {data.announcements[0].date}</p>
                    </div>
                </div>
            </div>
        )}

        <Tabs defaultValue="tasks" className="w-full flex-grow flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mb-6 shrink-0">
              <TabsTrigger value="tasks"><Kanban className="w-4 h-4 mr-2" /> Task Board (Trello)</TabsTrigger>
              <TabsTrigger value="files"><FolderOpen className="w-4 h-4 mr-2" /> File Repository</TabsTrigger>
              <TabsTrigger value="performance"><Star className="w-4 h-4 mr-2" /> Rapor Kinerja</TabsTrigger>
          </TabsList>

          {/* --- TAB 1: KANBAN BOARD (TRELLO STYLE) --- */}
          <TabsContent value="tasks" className="flex-grow flex flex-col space-y-4">
              {/* Filter Bar */}
              <div className="flex justify-between items-center shrink-0">
                  <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                      {['ALL', 'MEDIA', 'MATCH', 'BUSINESS', 'OPS', 'IT', 'LEGAL', 'INTI'].map(div => (
                          <Badge 
                              key={div} 
                              variant={filterDiv === div ? 'default' : 'outline'}
                              className="cursor-pointer whitespace-nowrap hover:bg-primary/20"
                              onClick={() => setFilterDiv(div)}
                          >
                              {div}
                          </Badge>
                      ))}
                  </div>
                   <Button size="sm" onClick={() => setIsTaskModalOpen(true)} className="shrink-0">
                      <PlusCircle className="w-4 h-4 mr-2"/> Tambah Tugas
                   </Button>
              </div>

              {/* KANBAN AREA */}
              <DragDropContext onDragEnd={onDragEnd}>
                  <div className="flex gap-4 h-full overflow-x-auto pb-4 items-start">
                      {Object.entries(KANBAN_COLUMNS).map(([statusKey, config]) => (
                          <div key={statusKey} className={`flex-shrink-0 w-80 rounded-xl flex flex-col max-h-full ${config.color} border border-transparent`}>
                              {/* Column Header */}
                              <div className="p-4 flex items-center justify-between shrink-0">
                                  <h3 className="font-bold text-sm flex items-center gap-2 text-foreground/80">
                                      <config.icon className={`w-4 h-4 ${config.iconColor}`} /> 
                                      {config.label}
                                  </h3>
                                  <Badge variant="secondary" className="bg-background/50">{getTasksByStatus(statusKey).length}</Badge>
                              </div>

                              {/* Droppable Area */}
                              <Droppable droppableId={statusKey}>
                                  {(provided, snapshot) => (
                                      <div
                                          {...provided.droppableProps}
                                          ref={provided.innerRef}
                                          className={`flex-grow p-3 space-y-3 overflow-y-auto min-h-[150px] transition-colors rounded-b-xl ${snapshot.isDraggingOver ? 'bg-primary/5' : ''}`}
                                      >
                                          {getTasksByStatus(statusKey).map((task: Task, index: number) => (
                                              <Draggable key={task.id} draggableId={task.id} index={index}>
                                                  {(provided, snapshot) => (
                                                      <div
                                                          ref={provided.innerRef}
                                                          {...provided.draggableProps}
                                                          {...provided.dragHandleProps}
                                                          className={`group relative bg-card p-3 rounded-lg border shadow-sm hover:shadow-md transition-all ${snapshot.isDragging ? 'rotate-2 scale-105 shadow-xl ring-2 ring-primary z-50' : ''}`}
                                                          style={provided.draggableProps.style}
                                                      >
                                                          {/* Drag Handle Icon (Muncul saat hover) */}
                                                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-muted-foreground cursor-grab active:cursor-grabbing">
                                                              <GripVertical className="w-4 h-4" />
                                                          </div>

                                                          {/* Card Content */}
                                                          <div className="flex justify-between items-start mb-2 pr-6">
                                                              <Badge variant="outline" className={`text-[10px] font-bold ${getPriorityColor(task.priority)}`}>
                                                                  {task.division}
                                                              </Badge>
                                                          </div>
                                                          <h4 className="font-bold text-sm mb-2 text-foreground leading-snug">{task.title}</h4>
                                                          
                                                          <div className="flex justify-between items-center pt-2 border-t border-border/50">
                                                              <div className={`flex items-center gap-1 text-xs ${getDeadlineColor(task.deadline)}`}>
                                                                  <Clock className="w-3 h-3"/> 
                                                                  <span>{formatDate(task.deadline)}</span>
                                                              </div>
                                                              <div className="flex items-center gap-2">
                                                                  {/* Avatar Placeholder */}
                                                                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold border border-primary/20" title={`PIC: ${task.pic}`}>
                                                                      {task.pic.charAt(0)}
                                                                  </div>
                                                              </div>
                                                          </div>
                                                      </div>
                                                  )}
                                              </Draggable>
                                          ))}
                                          {provided.placeholder}
                                      </div>
                                  )}
                              </Droppable>
                          </div>
                      ))}
                  </div>
              </DragDropContext>
          </TabsContent>

          {/* --- TAB 2: FILE REPOSITORY --- */}
          <TabsContent value="files">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="md:col-span-2">
                      <CardHeader><CardTitle>Arsip Digital</CardTitle></CardHeader>
                      <CardContent>
                          <div className="space-y-2">
                              {data.resources.map((file: any) => (
                                  <div key={file.id} className="flex items-center justify-between p-3 border rounded hover:bg-secondary/10 group">
                                      <div className="flex items-center gap-3">
                                          <div className="p-2 bg-blue-100 text-blue-600 rounded"><FolderOpen className="w-5 h-5" /></div>
                                          <div>
                                              <p className="font-medium text-sm">{file.name}</p>
                                              <p className="text-[10px] text-muted-foreground">{file.category} • Uploaded by {file.uploadedBy}</p>
                                          </div>
                                      </div>
                                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                          <Download className="w-4 h-4" />
                                      </Button>
                                  </div>
                              ))}
                          </div>
                      </CardContent>
                  </Card>
                  <Card>
                      <CardHeader><CardTitle>Upload Dokumen</CardTitle></CardHeader>
                      <CardContent>
                          <form onSubmit={handleUpload} className="space-y-4">
                              <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-accent/50 transition-colors">
                                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                                  <p className="text-xs text-muted-foreground mb-4">Drag file atau klik untuk upload</p>
                                  <Input type="file" name="file" required className="w-full text-xs cursor-pointer" />
                              </div>
                              <Button type="submit" className="w-full">Upload ke Arsip</Button>
                          </form>
                      </CardContent>
                  </Card>
              </div>
          </TabsContent>

          {/* --- TAB 3: RAPOR KINERJA --- */}
          <TabsContent value="performance">
              <Card className="bg-gradient-to-r from-purple-900/10 to-background border-purple-800">
                  <CardContent className="p-8 text-center space-y-4">
                      <div className="mx-auto bg-purple-500/10 p-4 rounded-full w-fit">
                          <Star className="w-10 h-10 text-purple-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-purple-200">Penilaian Kinerja Bulanan</h3>
                      <p className="text-purple-300 max-w-lg mx-auto">
                          Penilaian ini terintegrasi langsung dengan <strong>Skema Honorarium</strong>. 
                          Pastikan Anda mengisi log aktivitas dan menyelesaikan tugas tepat waktu untuk mendapatkan poin maksimal.
                      </p>
                      <Button onClick={() => window.location.href='/admin/finance/honorarium'} className="bg-purple-600 hover:bg-purple-700 font-bold">
                          Buka Halaman Evaluasi Honor
                      </Button>
                  </CardContent>
              </Card>
          </TabsContent>

        </Tabs>
      </div>

       {/* MODAL TAMBAH TUGAS */}
        <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tugas Baru</DialogTitle>
                    <DialogDescription>
                        Buat dan delegasikan pekerjaan untuk divisi.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Judul Tugas</Label>
                        <Input placeholder="Cth: Buat Desain Banner Utama" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Divisi</Label>
                            <Select onValueChange={(v) => setNewTask({...newTask, division: v})}>
                                <SelectTrigger><SelectValue placeholder="Pilih..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MEDIA">MEDIA</SelectItem>
                                    <SelectItem value="BUSINESS">BUSINESS</SelectItem>
                                    <SelectItem value="OPS">OPS</SelectItem>
                                    <SelectItem value="MATCH">MATCH</SelectItem>
                                    <SelectItem value="IT">IT</SelectItem>
                                    <SelectItem value="LEGAL">LEGAL</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>PIC</Label>
                            <Input placeholder="Nama Panitia" value={newTask.pic} onChange={e => setNewTask({...newTask, pic: e.target.value})} />
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Deadline</Label>
                            <Input type="date" value={newTask.deadline} onChange={e => setNewTask({...newTask, deadline: e.target.value})}/>
                        </div>
                        <div className="space-y-2">
                            <Label>Prioritas</Label>
                             <Select onValueChange={(v: Task['priority']) => setNewTask({...newTask, priority: v})} defaultValue="MEDIUM">
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="HIGH">Tinggi</SelectItem>
                                    <SelectItem value="MEDIUM">Sedang</SelectItem>
                                    <SelectItem value="LOW">Rendah</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleCreateTask} disabled={isSubmittingTask}>
                        {isSubmittingTask ? <Loader2 className="animate-spin mr-2" /> : <PlusCircle className="mr-2" />}
                        Buat Tugas
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* MODAL BUAT PENGUMUMAN */}
        <Dialog open={isAnnounceModalOpen} onOpenChange={setIsAnnounceModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Buat Pengumuman Baru</DialogTitle>
                    <DialogDescription>
                        Pengumuman ini akan tampil di bagian atas workspace untuk semua panitia.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Judul Pengumuman</Label>
                        <Input placeholder="Cth: Rapat Penting Minggu Ini" value={newAnnouncement.title} onChange={e => setNewAnnouncement({...newAnnouncement, title: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <Label>Isi Pengumuman</Label>
                        <Textarea placeholder="Detail pengumuman..." value={newAnnouncement.content} onChange={e => setNewAnnouncement({...newAnnouncement, content: e.target.value})} />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleCreateAnnouncement} disabled={isSubmittingAnnounce} className="bg-yellow-500 hover:bg-yellow-600 text-yellow-950">
                        {isSubmittingAnnounce ? <Loader2 className="animate-spin mr-2" /> : <Megaphone className="mr-2" />}
                        Terbitkan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
  );
}

// --- HELPER FUNCTIONS FOR STYLING ---

function getPriorityColor(priority: string) {
    switch (priority) {
        case 'HIGH': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700';
        case 'MEDIUM': return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700';
        case 'LOW': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
}

function getDeadlineColor(deadline: string) {
    if (!deadline) return 'text-muted-foreground';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(deadline);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    if (diffDays < 0) return 'text-red-500 font-bold'; // Overdue
    if (diffDays <= 2) return 'text-orange-500 font-medium'; // Near
    return 'text-muted-foreground';
}

function formatDate(dateStr: string) {
    if(!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}
