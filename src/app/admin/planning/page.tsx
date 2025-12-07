
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ClipboardList, CheckCircle2, XCircle, AlertCircle, 
  DollarSign, Calendar, Send, Edit3 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getPrograms, submitProgram, reviewProgram, type ProgramProposal } from "./actions";

// Simulasi Session (Nanti ambil dari real session)
const USER_ROLE = 'DIRECTOR'; // Coba ganti jadi 'MEDIA' untuk mode pengaju

export default function PlanningPage() {
  const { toast } = useToast();
  const [programs, setPrograms] = useState<ProgramProposal[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State (Pengajuan)
  const [newProg, setNewProg] = useState({
    title: "", objective: "", deadline: "", costEstimate: "", priority: "MUST" as 'MUST' | 'SHOULD' | 'COULD' | 'WONT'
  });

  // Review State
  const [reviewNote, setReviewNote] = useState("");

  useEffect(() => {
    getPrograms().then(setPrograms);
  }, []);

  // --- LOGIC PENGAJUAN (BOTTOM-UP) ---
  const handleSubmit = async () => {
    if (!newProg.title || !newProg.costEstimate) return alert("Lengkapi data!");
    
    setIsSubmitting(true);
    await submitProgram({
        ...newProg,
        division: USER_ROLE === 'DIRECTOR' ? 'SC' : USER_ROLE, // Otomatis deteksi divisi
        costEstimate: Number(newProg.costEstimate)
    });
    setIsSubmitting(false);
    toast({ title: "Terkirim", description: "Menunggu review Steering Committee." });
    getPrograms().then(setPrograms);
    setNewProg({ title: "", objective: "", deadline: "", costEstimate: "", priority: "MUST" }); // Reset
  };

  // --- LOGIC REVIEW (TOP-DOWN) ---
  const handleReview = async (id: string, decision: 'APPROVED' | 'REVISION' | 'REJECTED') => {
    await reviewProgram(id, decision, reviewNote);
    toast({ 
        title: decision === 'APPROVED' ? "Program Disetujui" : "Status Diperbarui", 
        description: decision === 'APPROVED' ? "Budget otomatis dikunci & Masuk Kalender." : "Notifikasi dikirim ke pengaju.",
        className: decision === 'APPROVED' ? "bg-green-600 text-white" : ""
    });
    setReviewNote("");
    getPrograms().then(setPrograms);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold font-headline text-primary">RKA & Program Kerja</h2>
            <p className="text-muted-foreground">Perencanaan Terpusat & Kontrol Anggaran.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KOLOM KIRI: FORM PENGAJUAN (RKA) */}
        <Card className="lg:col-span-1 h-fit">
            <CardHeader>
                <CardTitle>Ajukan Program Baru</CardTitle>
                <CardDescription>Isi detail aktivitas dan kebutuhan biaya.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-bold">Nama Program</label>
                    <Input placeholder="Cth: Produksi Video Teaser" value={newProg.title} onChange={e => setNewProg({...newProg, title: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold">Tujuan & Output</label>
                    <Textarea placeholder="Kenapa ini penting?" value={newProg.objective} onChange={e => setNewProg({...newProg, objective: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold">Deadline</label>
                        <Input type="date" value={newProg.deadline} onChange={e => setNewProg({...newProg, deadline: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold">Estimasi Biaya</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-500 text-sm">Rp</span>
                            <Input type="number" className="pl-10" placeholder="0" value={newProg.costEstimate} onChange={e => setNewProg({...newProg, costEstimate: e.target.value})} />
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold">Prioritas (MoSCoW)</label>
                    <Select onValueChange={(v : any) => setNewProg({...newProg, priority: v})} defaultValue="MUST">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="MUST">Must Have (Wajib)</SelectItem>
                            <SelectItem value="SHOULD">Should Have (Penting)</SelectItem>
                            <SelectItem value="COULD">Could Have (Opsional)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full bg-primary">
                    <Send className="w-4 h-4 mr-2" /> Ajukan Rencana
                </Button>
            </CardContent>
        </Card>

        {/* KOLOM KANAN: LIST & REVIEW */}
        <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="pending" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="pending">Menunggu Review ({programs.filter(p => p.status === 'SUBMITTED').length})</TabsTrigger>
                    <TabsTrigger value="approved">Disetujui ({programs.filter(p => p.status === 'APPROVED').length})</TabsTrigger>
                    <TabsTrigger value="rejected">Revisi / Tolak</TabsTrigger>
                </TabsList>

                {/* TAB PENDING (AREA KERJA SC) */}
                <TabsContent value="pending" className="space-y-4 mt-4">
                    {programs.filter(p => p.status === 'SUBMITTED').map((prog) => (
                        <Card key={prog.id} className="border-l-4 border-l-yellow-500 shadow-sm">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <Badge variant="outline" className="mb-2">{prog.division}</Badge>
                                    <Badge className={prog.priority === 'MUST' ? 'bg-red-600' : 'bg-blue-600'}>{prog.priority}</Badge>
                                </div>
                                <CardTitle className="text-lg">{prog.title}</CardTitle>
                                <CardDescription>Deadline: {prog.deadline}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="bg-secondary/20 p-3 rounded text-sm">
                                    <strong>Output:</strong> {prog.objective}
                                </div>
                                <div className="font-mono font-bold text-lg text-primary">
                                    Rp {prog.costEstimate.toLocaleString('id-ID')}
                                </div>
                                
                                {/* AREA KHUSUS DIRECTOR/FINANCE */}
                                {['DIRECTOR', 'FINANCE'].includes(USER_ROLE) && (
                                    <div className="pt-4 border-t space-y-3">
                                        <Textarea 
                                            placeholder="Catatan SC (Wajib diisi jika Revisi/Tolak)..." 
                                            className="text-sm h-16"
                                            onChange={e => setReviewNote(e.target.value)}
                                        />
                                        <div className="flex gap-2 justify-end">
                                            <Button size="sm" variant="destructive" onClick={() => handleReview(prog.id, 'REJECTED')}>
                                                <XCircle className="w-4 h-4 mr-1" /> Tolak
                                            </Button>
                                            <Button size="sm" variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50" onClick={() => handleReview(prog.id, 'REVISION')}>
                                                <Edit3 className="w-4 h-4 mr-1" /> Revisi
                                            </Button>
                                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleReview(prog.id, 'APPROVED')}>
                                                <CheckCircle2 className="w-4 h-4 mr-1" /> SETUJUI (ACC)
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                    {programs.filter(p => p.status === 'SUBMITTED').length === 0 && (
                        <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
                            Tidak ada pengajuan baru.
                        </div>
                    )}
                </TabsContent>

                {/* TAB APPROVED (MONITORING) */}
                <TabsContent value="approved" className="space-y-4 mt-4">
                    {programs.filter(p => p.status === 'APPROVED').map((prog) => (
                        <div key={prog.id} className="flex items-center justify-between p-4 bg-card border rounded-lg shadow-sm">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Badge className="bg-green-600">ACC</Badge>
                                    <span className="font-bold text-lg">{prog.title}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">Rp {prog.costEstimate.toLocaleString('id-ID')} • {prog.division}</p>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {prog.deadline}</span>
                            </div>
                        </div>
                    ))}
                </TabsContent>

                {/* TAB REJECTED */}
                <TabsContent value="rejected" className="space-y-4 mt-4">
                     {programs.filter(p => ['REJECTED', 'REVISION'].includes(p.status)).map((prog) => (
                        <div key={prog.id} className="p-4 bg-gray-50 dark:bg-card border rounded-lg opacity-70 hover:opacity-100 transition-opacity">
                            <div className="flex justify-between mb-2">
                                <span className="font-bold line-through">{prog.title}</span>
                                <Badge variant="outline">{prog.status}</Badge>
                            </div>
                            <p className="text-sm text-red-600 italic">" {prog.scNotes || "Tidak ada catatan"} "</p>
                        </div>
                    ))}
                </TabsContent>
            </Tabs>
        </div>

      </div>
    </div>
  );
}
