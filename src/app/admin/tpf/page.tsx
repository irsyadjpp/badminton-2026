'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  PlayCircle, Search, Eye, AlertTriangle, CheckCircle2, 
  FileText, Siren, PlusCircle 
} from "lucide-react";
import { TpfAssessmentModal } from "@/components/admin/tpf-assessment-modal";
import { getVerificationQueue, getSpotChecks, submitSpotCheck, type PlayerVerification, type SpotCheckLog } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

export default function TpfDashboard() {
  const { toast } = useToast();
  
  // Data State
  const [verifications, setVerifications] = useState<PlayerVerification[]>([]);
  const [spotChecks, setSpotChecks] = useState<SpotCheckLog[]>([]);
  
  // Modal State
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerVerification | null>(null);
  const [isAssessModalOpen, setIsAssessModalOpen] = useState(false);
  const [isSpotCheckModalOpen, setIsSpotCheckModalOpen] = useState(false);

  // Form State (Spot Check)
  const [newSpotCheck, setNewSpotCheck] = useState({
      court: "", player: "", team: "", issue: "", evidence: "", recommendation: ""
  });

  // Load Data
  useEffect(() => {
      getVerificationQueue().then(setVerifications);
      getSpotChecks().then(setSpotChecks);
  }, []);

  const handleAssess = (player: PlayerVerification) => {
    setSelectedPlayer(player);
    setIsAssessModalOpen(true);
  };

  const handleSubmitSpotCheck = async () => {
      if (!newSpotCheck.player || !newSpotCheck.issue) return alert("Lengkapi data!");
      
      const res = await submitSpotCheck(newSpotCheck);
      if (res.success) {
          toast({ title: "Laporan Terkirim", description: res.message });
          setIsSpotCheckModalOpen(false);
          // Refresh list
          getSpotChecks().then(setSpotChecks);
          // Reset form
          setNewSpotCheck({ court: "", player: "", team: "", issue: "", evidence: "", recommendation: "" });
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-3xl font-bold font-headline text-primary">TPF Command Center</h2>
            <p className="text-muted-foreground">Verifikasi Integritas & Pengawasan Lapangan.</p>
        </div>
        <div className="flex gap-2">
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                Pending Video: {verifications.filter(v => v.status === 'PENDING').length}
            </Badge>
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                Kasus Lapangan: {spotChecks.length}
            </Badge>
        </div>
      </div>

      <Tabs defaultValue="verification" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="verification">1. Audit Video (Pre-Event)</TabsTrigger>
            <TabsTrigger value="spotcheck">2. Spot Check (On-Event)</TabsTrigger>
        </TabsList>

        {/* --- TAB 1: VERIFIKASI VIDEO --- */}
        <TabsContent value="verification" className="space-y-4">
            <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Cari nama pemain / tim..." className="pl-8" />
                </div>
                <Select defaultValue="ALL">
                    <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter Status" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Semua Status</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="APPROVED">Lolos</SelectItem>
                        <SelectItem value="REJECTED">Ditolak</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama Pemain</TableHead>
                            <TableHead>Tim</TableHead>
                            <TableHead>Kategori</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {verifications.map((player) => (
                            <TableRow key={player.id}>
                                <TableCell className="font-medium">{player.name}</TableCell>
                                <TableCell>{player.team}</TableCell>
                                <TableCell><Badge variant="outline">{player.category}</Badge></TableCell>
                                <TableCell>
                                    {player.status === 'PENDING' && <Badge className="bg-yellow-500">Menunggu Audit</Badge>}
                                    {player.status === 'APPROVED' && <Badge className="bg-green-500">Lolos</Badge>}
                                    {player.status === 'UPGRADE_REQUIRED' && <Badge className="bg-blue-500">Naik Level</Badge>}
                                    {player.status === 'REJECTED' && <Badge variant="destructive">Ditolak</Badge>}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" onClick={() => handleAssess(player)} className={player.status === 'PENDING' ? 'bg-primary' : 'bg-secondary text-foreground'}>
                                        <PlayCircle className="w-4 h-4 mr-2" />
                                        {player.status === 'PENDING' ? 'Audit Sekarang' : 'Lihat Hasil'}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </TabsContent>

        {/* --- TAB 2: SPOT CHECK LAPANGAN --- */}
        <TabsContent value="spotcheck" className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-red-50 border border-red-100 rounded-lg mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-red-100 p-2 rounded-full"><Siren className="w-6 h-6 text-red-600" /></div>
                    <div>
                        <h3 className="font-bold text-red-900">Mode Pengawasan Aktif</h3>
                        <p className="text-sm text-red-700">Gunakan fitur ini untuk mencatat temuan Joki/Sandbagging di lapangan secara real-time.</p>
                    </div>
                </div>
                <Dialog open={isSpotCheckModalOpen} onOpenChange={setIsSpotCheckModalOpen}>
                    <DialogTrigger asChild>
                        <Button variant="destructive" className="font-bold">
                            <PlusCircle className="w-4 h-4 mr-2" /> Buat Laporan Baru
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Laporan Insiden Lapangan</DialogTitle>
                            <DialogDescription>Catat temuan Anda untuk ditindaklanjuti oleh Referee.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2"><Label>No. Lapangan</Label><Input placeholder="Cth: 1" onChange={e => setNewSpotCheck({...newSpotCheck, court: e.target.value})} /></div>
                                <div className="space-y-2"><Label>Jam</Label><Input type="time" defaultValue="now" disabled /></div>
                            </div>
                            <div className="space-y-2"><Label>Nama Pemain (Terduga)</Label><Input placeholder="Nama..." onChange={e => setNewSpotCheck({...newSpotCheck, player: e.target.value})} /></div>
                            <div className="space-y-2"><Label>Tim</Label><Input placeholder="Nama Tim..." onChange={e => setNewSpotCheck({...newSpotCheck, team: e.target.value})} /></div>
                            <div className="space-y-2"><Label>Jenis Isu</Label>
                                <Select onValueChange={(v: any) => setNewSpotCheck({...newSpotCheck, issue: v})}>
                                    <SelectTrigger><SelectValue placeholder="Pilih Pelanggaran" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="SANDBAGGING">Sandbagging (Skill jauh diatas level)</SelectItem>
                                        <SelectItem value="JOKI">Joki (Wajah beda dengan data)</SelectItem>
                                        <SelectItem value="ADMINISTRASI">Administrasi (Main rangkap ilegal)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2"><Label>Bukti / Observasi</Label><Textarea placeholder="Cth: Melakukan backhand smash tajam berkali-kali..." onChange={e => setNewSpotCheck({...newSpotCheck, evidence: e.target.value})} /></div>
                            <div className="space-y-2"><Label>Rekomendasi TPF</Label>
                                <Select onValueChange={(v: any) => setNewSpotCheck({...newSpotCheck, recommendation: v})}>
                                    <SelectTrigger><SelectValue placeholder="Pilih Rekomendasi" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="WARNING">Peringatan Lisan</SelectItem>
                                        <SelectItem value="DISQUALIFY">Diskualifikasi (Kartu Hitam)</SelectItem>
                                        <SelectItem value="CLEAR">Tidak Terbukti (Clear)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleSubmitSpotCheck} className="bg-red-600 hover:bg-red-700">Kirim Laporan ke Referee</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {spotChecks.map((log) => (
                    <Card key={log.id} className="border-l-4 border-l-red-500 shadow-sm">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">{log.issue}</Badge>
                                <span className="text-xs font-mono text-muted-foreground">{log.time} • Court {log.court}</span>
                            </div>
                            <CardTitle className="text-lg mt-2">{log.player}</CardTitle>
                            <CardDescription>{log.team}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-secondary/30 p-3 rounded-md text-sm italic text-muted-foreground mb-3">
                                "{log.evidence}"
                            </div>
                            <div className="flex items-center gap-2 font-bold text-sm">
                                <AlertTriangle className="w-4 h-4 text-orange-500" />
                                Rekomendasi: <span className={log.recommendation === 'DISQUALIFY' ? 'text-red-600' : 'text-yellow-600'}>{log.recommendation}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </TabsContent>
      </Tabs>

      {/* MODAL PENILAIAN VIDEO (EXISTING COMPONENT) */}
      {selectedPlayer && (
        <TpfAssessmentModal 
            isOpen={isAssessModalOpen} 
            onClose={() => setIsAssessModalOpen(false)} 
            player={selectedPlayer} 
        />
      )}
    </div>
  );
}
