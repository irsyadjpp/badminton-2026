
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Stethoscope, Ambulance, Activity, Plus, 
  FileText, AlertCircle, CheckCircle2, XCircle 
} from "lucide-react";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter 
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { getMedicalLogs, submitMedicalLog, type MedicalLog } from "./actions";

export default function MedicalDashboard() {
  const { toast } = useToast();
  const [logs, setLogs] = useState<MedicalLog[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    patientName: "",
    role: "ATLET",
    court: "",
    injuryType: "",
    actionTaken: "",
    status: "RECOVERED",
    medicInCharge: "Nanda" // Auto-filled dari session login
  });

  useEffect(() => {
    getMedicalLogs().then(setLogs);
  }, []);

  const handleSubmit = async () => {
    if (!formData.patientName || !formData.injuryType) {
        return toast({ title: "Error", description: "Nama Pasien dan Jenis Cedera wajib diisi.", variant: "destructive" });
    }

    setIsSubmitting(true);
    const res = await submitMedicalLog(formData);
    setIsSubmitting(false);
    
    if (res.success) {
        toast({ title: "Tercatat", description: "Insiden medis telah didokumentasikan.", className: "bg-green-600 text-white" });
        setIsFormOpen(false);
        getMedicalLogs().then(setLogs); // Refresh data
        // Reset form partial
        setFormData({ ...formData, patientName: "", injuryType: "", actionTaken: "" });
    }
  };

  // Statistik Cepat
  const totalCases = logs.length;
  const referredCases = logs.filter(l => l.status === 'REFERRED_TO_HOSPITAL').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-3xl font-bold font-headline text-primary flex items-center gap-2">
                <Stethoscope className="w-8 h-8" /> Medical Log
            </h2>
            <p className="text-muted-foreground">Dokumentasi penanganan cedera dan insiden kesehatan.</p>
        </div>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
                <Button size="lg" className="bg-red-600 hover:bg-red-700 font-bold shadow-lg shadow-red-200">
                    <Plus className="w-5 h-5 mr-2" /> Catat Insiden Baru
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg bg-background">
                <DialogHeader>
                    <DialogTitle>Laporan Penanganan Medis</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Kategori Pasien</Label>
                            <Select onValueChange={(v) => setFormData({...formData, role: v})} defaultValue="ATLET">
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ATLET">Atlet / Pemain</SelectItem>
                                    <SelectItem value="PANITIA">Panitia</SelectItem>
                                    <SelectItem value="PENONTON">Penonton</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                             <Label>Lokasi / Court</Label>
                             <Input placeholder="Cth: Lapangan 2" onChange={(e) => setFormData({...formData, court: e.target.value})} />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label>Nama Pasien</Label>
                        <Input placeholder="Nama Lengkap" onChange={(e) => setFormData({...formData, patientName: e.target.value})} />
                    </div>

                    <div className="space-y-2">
                        <Label>Jenis Cedera / Keluhan</Label>
                        <Input placeholder="Cth: Kram Betis, Luka Lecet, Pingsan" onChange={(e) => setFormData({...formData, injuryType: e.target.value})} />
                    </div>

                    <div className="space-y-2">
                        <Label>Tindakan yang Dilakukan (First Aid)</Label>
                        <Textarea placeholder="Cth: Semprot chlor ethyl, bebat tekan, pemberian oksigen..." onChange={(e) => setFormData({...formData, actionTaken: e.target.value})} />
                    </div>

                    <div className="space-y-2">
                        <Label>Status Akhir</Label>
                        <Select onValueChange={(v:any) => setFormData({...formData, status: v})} defaultValue="RECOVERED">
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="RECOVERED">Dapat Melanjutkan (Recovered)</SelectItem>
                                <SelectItem value="RETIRED">Tidak Bisa Lanjut (Retired)</SelectItem>
                                <SelectItem value="REFERRED_TO_HOSPITAL">Rujuk ke Rumah Sakit (Serious)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full bg-red-600 hover:bg-red-700">
                        {isSubmitting ? "Menyimpan..." : "Simpan Laporan"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-red-50 border-red-200 dark:bg-red-500/10 dark:border-red-500/20">
              <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 bg-red-100 dark:bg-red-500/20 rounded-full text-red-600 dark:text-red-400"><Activity className="w-6 h-6"/></div>
                  <div><div className="text-2xl font-bold">{totalCases}</div><div className="text-xs text-red-800 dark:text-red-300">Total Kasus</div></div>
              </CardContent>
          </Card>
           <Card>
              <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 bg-gray-100 dark:bg-gray-500/20 rounded-full text-gray-600 dark:text-gray-400"><Ambulance className="w-6 h-6"/></div>
                  <div><div className="text-2xl font-bold">{referredCases}</div><div className="text-xs text-gray-600 dark:text-gray-400">Rujuk RS</div></div>
              </CardContent>
          </Card>
      </div>

      {/* TABEL DATA */}
      <Card>
        <CardHeader><CardTitle>Riwayat Penanganan</CardTitle></CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Waktu</TableHead>
                        <TableHead>Nama Pasien</TableHead>
                        <TableHead>Lokasi</TableHead>
                        <TableHead>Cedera</TableHead>
                        <TableHead>Tindakan</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {logs.map((log) => (
                        <TableRow key={log.id}>
                            <TableCell className="font-mono text-xs text-muted-foreground">{log.timestamp}</TableCell>
                            <TableCell>
                                <div className="font-bold">{log.patientName}</div>
                                <Badge variant="outline" className="text-[10px]">{log.role}</Badge>
                            </TableCell>
                            <TableCell>{log.court}</TableCell>
                            <TableCell className="text-red-600 font-medium">{log.injuryType}</TableCell>
                            <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate" title={log.actionTaken}>{log.actionTaken}</TableCell>
                            <TableCell>
                                {log.status === 'RECOVERED' && <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle2 className="w-3 h-3 mr-1"/> Lanjut</Badge>}
                                {log.status === 'RETIRED' && <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100"><XCircle className="w-3 h-3 mr-1"/> Retired</Badge>}
                                {log.status === 'REFERRED_TO_HOSPITAL' && <Badge className="bg-red-600 text-white hover:bg-red-700"><Ambulance className="w-3 h-3 mr-1"/> RS</Badge>}
                            </TableCell>
                        </TableRow>
                    ))}
                    {logs.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Belum ada insiden tercatat.</TableCell></TableRow>}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );

    