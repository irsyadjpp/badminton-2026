'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileCheck, Plus, Search, ShieldCheck, Eye, Trash2 } from "lucide-react";
import { ROLE_DEFINITIONS } from "@/lib/data/role-definitions"; 
import { useToast } from "@/hooks/use-toast";

// Mock Data Personil (Unassigned)
const STAFF_LIST = [
  { id: "S1", name: "Faiz Azilla Syaehon", role: "Koordinator TPF" },
  { id: "S2", name: "Anindiffa Pandu Prayuda", role: "Anggota TPF" },
  { id: "S3", name: "Aulia Febrianto", role: "Anggota TPF" },
  { id: "S4", name: "Dr. Nanda", role: "Koordinator Medis" },
  { id: "S5", name: "Sidiq", role: "Koordinator Keamanan" },
];

// Mock Data Mandat Aktif
const ACTIVE_MANDATES = [
  { id: "SPT-001", no: "001/SPT-UMPIRE/BCC/XII/2025", type: "MATCH_CONTROL", issuedTo: 12, date: "08 Des 2025", status: "ACTIVE" }
];

export default function DigitalMandatePage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'LIST' | 'CREATE'>('LIST');
  
  // State Form
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof ROLE_DEFINITIONS>("TPF");
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [letterNumber, setLetterNumber] = useState("002/SPT-TPF/BCC/XII/2025");

  const template = ROLE_DEFINITIONS[selectedCategory];

  const handleToggleStaff = (name: string) => {
    if (selectedStaff.includes(name)) {
      setSelectedStaff(selectedStaff.filter(s => s !== name));
    } else {
      setSelectedStaff([...selectedStaff, name]);
    }
  };

  const handlePublish = () => {
    toast({ 
        title: "Mandat Diterbitkan!", 
        description: `${selectedStaff.length} personil kini memiliki wewenang digital resmi.`,
        className: "bg-green-600 text-white"
    });
    setActiveTab('LIST');
    // Logic simpan ke DB...
  };

  return (
    <div className="space-y-8 p-4 md:p-8 font-body pb-24">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="rounded-full px-3 py-1 border-primary text-primary bg-primary/10 backdrop-blur-md">
                    <ShieldCheck className="w-3 h-3 mr-2" /> SEKRETARIAT
                </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-headline uppercase tracking-tighter text-white">
                E-Mandate <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">System</span>
            </h1>
            <p className="text-zinc-400 mt-2 max-w-xl text-lg">
                Penerbitan surat tugas & wewenang panitia secara digital (Paperless).
            </p>
        </div>

        {activeTab === 'LIST' && (
            <Button onClick={() => setActiveTab('CREATE')} className="h-14 rounded-full px-8 bg-white text-black hover:bg-zinc-200 font-bold text-lg shadow-xl">
                <Plus className="mr-2 h-6 w-6" /> BUAT SURAT TUGAS
            </Button>
        )}
      </div>

      {/* --- MODE: LIST MANDAT AKTIF --- */}
      {activeTab === 'LIST' && (
        <Card className="bg-zinc-900 border-zinc-800 rounded-[32px] overflow-hidden">
            <CardHeader className="p-8 border-b border-zinc-800">
                <CardTitle className="text-2xl font-black uppercase">Daftar Mandat Aktif</CardTitle>
                <CardDescription>Surat tugas yang sedang berlaku untuk operasional.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-zinc-950/50 hover:bg-zinc-950/50 border-b border-zinc-800">
                            <TableHead className="pl-8 h-16 text-white font-bold">NOMOR SURAT</TableHead>
                            <TableHead className="text-white font-bold">DIVISI / BIDANG</TableHead>
                            <TableHead className="text-center text-white font-bold">PERSONIL</TableHead>
                            <TableHead className="text-white font-bold">TGL TERBIT</TableHead>
                            <TableHead className="text-right pr-8 text-white font-bold">STATUS</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ACTIVE_MANDATES.map((m) => (
                            <TableRow key={m.id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                                <TableCell className="pl-8 font-mono text-zinc-400">{m.no}</TableCell>
                                <TableCell className="font-bold text-white">{m.type}</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="secondary" className="bg-zinc-800 text-white">{m.issuedTo} Orang</Badge>
                                </TableCell>
                                <TableCell className="text-zinc-400">{m.date}</TableCell>
                                <TableCell className="text-right pr-8">
                                    <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30 border-none uppercase">
                                        {m.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      )}

      {/* --- MODE: BUAT MANDAT BARU --- */}
      {activeTab === 'CREATE' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* KOLOM KIRI: FORM DATA */}
            <div className="lg:col-span-2 space-y-6">
                <Card className="bg-zinc-900 border-zinc-800 rounded-[32px]">
                    <CardHeader className="p-8 pb-4">
                        <CardTitle className="text-xl font-bold uppercase">1. Detail Penugasan</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Divisi (Template SOP)</label>
                                <Select value={selectedCategory} onValueChange={(v:any) => { setSelectedCategory(v); setSelectedStaff([]); }}>
                                    <SelectTrigger className="h-12 bg-black border-zinc-700 rounded-xl"><SelectValue/></SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                        {Object.keys(ROLE_DEFINITIONS).map((key) => (
                                            <SelectItem key={key} value={key}>{ROLE_DEFINITIONS[key as keyof typeof ROLE_DEFINITIONS].title}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Nomor Surat</label>
                                <Input value={letterNumber} onChange={(e) => setLetterNumber(e.target.value)} className="h-12 bg-black border-zinc-700 rounded-xl font-mono" />
                            </div>
                        </div>

                        {/* PREVIEW SOP (READ ONLY) */}
                        <div className="bg-black/30 p-6 rounded-2xl border border-zinc-800/50 space-y-4">
                            <div>
                                <h4 className="text-xs font-bold text-primary uppercase mb-2">A. Uraian Tugas (Job Desc)</h4>
                                <ul className="list-disc ml-4 text-sm text-zinc-400 space-y-1">
                                    {template.jobDescriptions.map((jd, i) => <li key={i}>{jd}</li>)}
                                </ul>
                            </div>
                            <div className="h-[1px] bg-zinc-800 w-full"></div>
                            <div>
                                <h4 className="text-xs font-bold text-primary uppercase mb-2">B. Protokol & SOP</h4>
                                <ul className="list-disc ml-4 text-sm text-zinc-400 space-y-1">
                                    {template.sops.map((sop, i) => <li key={i}>{sop}</li>)}
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800 rounded-[32px]">
                    <CardHeader className="p-8 pb-4 flex flex-row justify-between items-center">
                        <CardTitle className="text-xl font-bold uppercase">2. Pilih Personil</CardTitle>
                        <Badge variant="outline" className="border-primary text-primary">{selectedStaff.length} Dipilih</Badge>
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                        <div className="bg-black border border-zinc-800 rounded-xl overflow-hidden max-h-[300px] overflow-y-auto">
                            {STAFF_LIST.map((staff) => (
                                <div key={staff.id} className="flex items-center gap-4 p-4 border-b border-zinc-800 last:border-0 hover:bg-zinc-900 cursor-pointer" onClick={() => handleToggleStaff(staff.name)}>
                                    <Checkbox checked={selectedStaff.includes(staff.name)} className="border-zinc-600 data-[state=checked]:bg-primary data-[state=checked]:text-black w-6 h-6 rounded-md" />
                                    <div className="flex-1">
                                        <div className="font-bold text-white">{staff.name}</div>
                                        <div className="text-xs text-zinc-500">{staff.role}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* KOLOM KANAN: SUMMARY & ACTION */}
            <div className="space-y-6">
                <Card className="bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700 rounded-[32px] shadow-2xl sticky top-24">
                    <CardHeader className="p-8 pb-4">
                        <CardTitle className="text-xl font-black uppercase text-white">Konfirmasi Penerbitan</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-400">Total Personil</span>
                                <span className="font-bold text-white">{selectedStaff.length} Orang</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-400">Tipe Mandat</span>
                                <span className="font-bold text-white">Digital (App)</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-400">Otorisasi</span>
                                <span className="font-bold text-primary">Project Director</span>
                            </div>
                        </div>

                        <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl text-xs text-yellow-500 leading-relaxed">
                            <strong>Perhatian:</strong> Dengan menerbitkan mandat ini, personil terkait akan mendapatkan akses digital ke fitur panitia sesuai divisinya.
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button onClick={handlePublish} disabled={selectedStaff.length === 0} className="h-14 rounded-full font-black text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                                TERBITKAN MANDAT <FileCheck className="ml-2 w-5 h-5"/>
                            </Button>
                            <Button variant="ghost" onClick={() => setActiveTab('LIST')} className="h-12 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800">
                                Batal
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

        </div>
      )}

    </div>
  );
}
