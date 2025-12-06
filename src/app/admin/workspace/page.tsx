'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Kanban, FolderOpen, Bell, CheckCircle2, 
  Clock, AlertCircle, Download, Upload, Star 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getWorkspaceData, updateTaskStatus, uploadResource, type Task } from "./actions";

export default function WorkspacePage() {
  const { toast } = useToast();
  const [data, setData] = useState<any>({ tasks: [], resources: [], announcements: [] });
  const [filterDiv, setFilterDiv] = useState("ALL");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await getWorkspaceData();
    setData(res);
  };

  const handleStatusClick = async (task: Task) => {
      const nextStatus = task.status === 'TODO' ? 'IN_PROGRESS' : task.status === 'IN_PROGRESS' ? 'DONE' : 'TODO';
      await updateTaskStatus(task.id, nextStatus);
      loadData();
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      await uploadResource(formData);
      toast({ title: "File Terupload", description: "Tersimpan di arsip digital." });
      loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold font-headline text-primary">Workspace Panitia</h2>
            <p className="text-muted-foreground">Pusat kolaborasi, tugas, dan arsip dokumen.</p>
        </div>
      </div>

      {/* 1. PENGUMUMAN (NOTICE BOARD) */}
      {data.announcements.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg shadow-sm mb-6">
              <div className="flex items-start gap-3">
                  <Bell className="w-5 h-5 text-yellow-600 mt-1 animate-bounce" />
                  <div>
                      <h4 className="font-bold text-yellow-800 text-lg">{data.announcements[0].title}</h4>
                      <p className="text-yellow-700">{data.announcements[0].content}</p>
                      <p className="text-xs text-yellow-600 mt-1 font-mono">Posted by: {data.announcements[0].author} • {data.announcements[0].date}</p>
                  </div>
              </div>
          </div>
      )}

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="tasks">
                <Kanban className="w-4 h-4 mr-2" /> Task Tracker
            </TabsTrigger>
            <TabsTrigger value="files">
                <FolderOpen className="w-4 h-4 mr-2" /> File Repository
            </TabsTrigger>
            <TabsTrigger value="performance">
                <Star className="w-4 h-4 mr-2" /> Rapor Kinerja
            </TabsTrigger>
        </TabsList>

        {/* --- TAB 1: TASK TRACKER (PENGGANTI EXCEL) --- */}
        <TabsContent value="tasks" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                    {['ALL', 'MEDIA', 'MATCH', 'INTI'].map(div => (
                        <Badge 
                            key={div} 
                            variant={filterDiv === div ? 'default' : 'outline'}
                            className="cursor-pointer"
                            onClick={() => setFilterDiv(div)}
                        >
                            {div}
                        </Badge>
                    ))}
                </div>
                <Button size="sm"><Kanban className="w-4 h-4 mr-2"/> Tambah Tugas</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* KOLOM TODO */}
                <div className="bg-gray-100 p-4 rounded-lg min-h-[300px]">
                    <h3 className="font-bold text-gray-500 mb-4 flex items-center gap-2"><Clock className="w-4 h-4"/> TO DO</h3>
                    <div className="space-y-3">
                        {data.tasks.filter((t: Task) => t.status === 'TODO').map((t: Task) => (
                            <TaskCard key={t.id} task={t} onNext={() => handleStatusClick(t)} />
                        ))}
                    </div>
                </div>
                {/* KOLOM IN PROGRESS */}
                <div className="bg-blue-50 p-4 rounded-lg min-h-[300px]">
                    <h3 className="font-bold text-blue-500 mb-4 flex items-center gap-2"><AlertCircle className="w-4 h-4"/> IN PROGRESS</h3>
                    <div className="space-y-3">
                        {data.tasks.filter((t: Task) => t.status === 'IN_PROGRESS').map((t: Task) => (
                            <TaskCard key={t.id} task={t} onNext={() => handleStatusClick(t)} />
                        ))}
                    </div>
                </div>
                {/* KOLOM DONE */}
                <div className="bg-green-50 p-4 rounded-lg min-h-[300px]">
                    <h3 className="font-bold text-green-600 mb-4 flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> DONE</h3>
                    <div className="space-y-3">
                        {data.tasks.filter((t: Task) => t.status === 'DONE').map((t: Task) => (
                            <TaskCard key={t.id} task={t} onNext={() => {}} />
                        ))}
                    </div>
                </div>
            </div>
        </TabsContent>

        {/* --- TAB 2: FILE REPOSITORY (PENGGANTI DRIVE) --- */}
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
                            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
                                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                                <p className="text-xs text-muted-foreground mb-4">Drag file atau klik untuk upload</p>
                                <Input type="file" name="file" required className="w-full text-xs" />
                            </div>
                            <Button type="submit" className="w-full">Upload ke Arsip</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>

        {/* --- TAB 3: RAPOR KINERJA (LINK KE SKEMA HONOR) --- */}
        <TabsContent value="performance">
            <Card className="bg-gradient-to-r from-purple-50 to-white border-purple-200">
                <CardContent className="p-8 text-center space-y-4">
                    <div className="mx-auto bg-purple-100 p-4 rounded-full w-fit">
                        <Star className="w-10 h-10 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-purple-900">Penilaian Kinerja Bulanan</h3>
                    <p className="text-purple-700 max-w-lg mx-auto">
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
  );
}

// Sub-component untuk Kartu Tugas
function TaskCard({ task, onNext }: { task: Task, onNext: () => void }) {
    return (
        <div className="bg-white p-3 rounded border shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={onNext}>
            <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="text-[10px]">{task.division}</Badge>
                {task.priority === 'HIGH' && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" title="High Priority"></span>}
            </div>
            <h4 className="font-bold text-sm mb-1">{task.title}</h4>
            <div className="flex justify-between items-center text-xs text-muted-foreground mt-3">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {task.deadline}</span>
                <span className="font-bold">{task.pic}</span>
            </div>
        </div>
    )
}
