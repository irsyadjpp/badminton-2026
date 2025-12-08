
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Printer, Download, FileSignature, CheckCircle2, UserPlus, X } from "lucide-react";
import { SOP_TEMPLATES } from "@/lib/data/sop-templates"; // Import data SOP tadi
import Image from "next/image";

// Mock Data Personil (Dari Master Roster)
const STAFF_LIST = [
  { id: "S1", name: "Faiz Azilla Syaehon", role: "Koordinator TPF" },
  { id: "S2", name: "Anindiffa Pandu Prayuda", role: "Anggota TPF" },
  { id: "S3", name: "Aulia Febrianto", role: "Anggota TPF" },
  { id: "S4", name: "Dr. Nanda", role: "Koordinator Medis" },
  { id: "S5", name: "Sidiq", role: "Koordinator Keamanan" },
];

export default function AssignmentLetterPage() {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof SOP_TEMPLATES>("TPF");
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [letterNumber, setLetterNumber] = useState("002/SPT-TPF/BCC/XII/2025");

  const template = SOP_TEMPLATES[selectedCategory];

  const handleToggleStaff = (name: string) => {
    if (selectedStaff.includes(name)) {
      setSelectedStaff(selectedStaff.filter(s => s !== name));
    } else {
      setSelectedStaff([...selectedStaff, name]);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-zinc-950 text-white overflow-hidden">
      
      {/* --- SIDEBAR KIRI: KONTROL --- */}
      <div className="w-full lg:w-[400px] bg-zinc-900 border-r border-zinc-800 flex flex-col h-full z-20 shadow-2xl">
        <div className="p-6 border-b border-zinc-800">
          <h1 className="text-2xl font-black font-headline uppercase tracking-tight flex items-center gap-2">
            <FileSignature className="w-6 h-6 text-primary"/> E-Mandate
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Generator Surat Perintah Tugas (SPT).</p>
        </div>

        <ScrollArea className="flex-1 p-6 space-y-6">
          
          {/* 1. Pilih Divisi (Template) */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase text-zinc-500">1. Divisi / Bidang</label>
            <Select value={selectedCategory} onValueChange={(v:any) => {
                setSelectedCategory(v); 
                setSelectedStaff([]); // Reset staff saat ganti divisi
            }}>
              <SelectTrigger className="h-12 bg-black border-zinc-700 rounded-xl"><SelectValue/></SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                <SelectItem value="TPF">Tim Pencari Fakta (TPF)</SelectItem>
                <SelectItem value="MEDIS">Tim Medis</SelectItem>
                <SelectItem value="KEAMANAN">Keamanan (Security)</SelectItem>
                <SelectItem value="UMPIRE">Wasit & Perangkat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 2. Nomor Surat */}
          <div className="space-y-3 mt-6">
            <label className="text-xs font-bold uppercase text-zinc-500">2. Nomor Surat</label>
            <Input 
                value={letterNumber} 
                onChange={(e) => setLetterNumber(e.target.value)}
                className="h-12 bg-black border-zinc-700 rounded-xl font-mono text-sm" 
            />
          </div>

          {/* 3. Pilih Personil */}
          <div className="space-y-3 mt-6">
            <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase text-zinc-500">3. Personil Ditugaskan</label>
                <Badge variant="secondary">{selectedStaff.length} Terpilih</Badge>
            </div>
            
            <div className="bg-black border border-zinc-800 rounded-xl overflow-hidden">
                {STAFF_LIST.map((staff) => (
                    <div key={staff.id} className="flex items-center gap-3 p-3 border-b border-zinc-800 last:border-0 hover:bg-zinc-800/50 cursor-pointer" onClick={() => handleToggleStaff(staff.name)}>
                        <Checkbox checked={selectedStaff.includes(staff.name)} className="border-zinc-600 data-[state=checked]:bg-primary data-[state=checked]:text-black" />
                        <div className="flex-1">
                            <div className="text-sm font-bold">{staff.name}</div>
                            <div className="text-xs text-zinc-500">{staff.role}</div>
                        </div>
                    </div>
                ))}
            </div>
          </div>

        </ScrollArea>

        <div className="p-6 border-t border-zinc-800 bg-zinc-900">
            <Button className="w-full h-14 rounded-full font-bold text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                <Download className="w-5 h-5 mr-2"/> TERBITKAN SURAT (PDF)
            </Button>
        </div>
      </div>

      {/* --- AREA KANAN: LIVE PREVIEW SURAT --- */}
      <div className="flex-1 bg-zinc-950 relative flex items-center justify-center p-8 overflow-hidden">
        
        {/* Background Texture */}
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.png')] opacity-10 pointer-events-none"></div>

        {/* PAPER CONTAINER (A4 Aspect Ratio) */}
        <div className="bg-white text-black w-full max-w-[210mm] h-full max-h-[297mm] shadow-2xl rounded-sm overflow-y-auto p-[20mm] relative font-serif text-sm leading-relaxed scale-95 origin-center">
            
            {/* KOP SURAT */}
            <div className="flex items-center gap-4 border-b-4 border-double border-black pb-4 mb-6">
                <div className="w-20 h-20 relative">
                    {/* Ganti dengan Logo Real */}
                    <div className="w-full h-full bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                       <Image src="/images/logo.png" width={80} height={80} alt="Logo" />
                    </div>
                </div>
                <div className="flex-1 text-center uppercase">
                    <h2 className="text-lg font-bold tracking-wider">Panitia Pelaksana</h2>
                    <h1 className="text-2xl font-black font-sans tracking-tight mb-1">Bandung Community Championship (BCC) 2026</h1>
                    <p className="text-xs font-normal normal-case">Sekretariat: GOR KONI Bandung, Jl. Jakarta No. 12 • Email: admin@bcc.com</p>
                </div>
            </div>

            {/* JUDUL SURAT */}
            <div className="text-center mb-8">
                <h3 className="text-xl font-bold underline decoration-2 underline-offset-4">SURAT PERINTAH TUGAS</h3>
                <p className="text-sm mt-1">Nomor: {letterNumber}</p>
            </div>

            {/* DASAR & MENIMBANG */}
            <div className="space-y-4 mb-6">
                <div className="flex gap-2">
                    <span className="font-bold w-24 shrink-0">DASAR</span>
                    <span>: Surat Keputusan Project Director Nomor 001/SK/BCC/XII/2025 tanggal 8 Desember 2025 tentang Pembentukan Panitia Pelaksana.</span>
                </div>
                <div className="flex gap-2">
                    <span className="font-bold w-24 shrink-0">MENIMBANG</span>
                    <span className="text-justify">: {template.menimbang}</span>
                </div>
            </div>

            {/* MEMBERI TUGAS */}
            <div className="text-center font-bold my-6">MEMBERI TUGAS KEPADA:</div>

            {/* TABEL PERSONIL */}
            <div className="mb-8">
                <table className="w-full border-collapse border border-black text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-black p-2 text-center w-10">NO</th>
                            <th className="border border-black p-2 text-left">NAMA</th>
                            <th className="border border-black p-2 text-left">JABATAN</th>
                            <th className="border border-black p-2 text-left">KETERANGAN</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedStaff.length === 0 && (
                            <tr><td colSpan={4} className="border border-black p-4 text-center italic text-gray-500">Belum ada personil dipilih...</td></tr>
                        )}
                        {selectedStaff.map((name, idx) => (
                            <tr key={idx}>
                                <td className="border border-black p-2 text-center">{idx + 1}.</td>
                                <td className="border border-black p-2 font-bold">{name}</td>
                                <td className="border border-black p-2">Anggota {template.roleName}</td>
                                <td className="border border-black p-2">-</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* UNTUK (LIST TUGAS) */}
            <div className="mb-8">
                <div className="font-bold mb-2">UNTUK:</div>
                <ol className="list-decimal ml-5 space-y-1 text-justify">
                    {template.tugas.map((task, i) => (
                        <li key={i}>{task}</li>
                    ))}
                    <li>Melaksanakan perintah ini dengan penuh tanggung jawab dan melaporkan hasilnya kepada Project Director.</li>
                </ol>
            </div>

            {/* PENUTUP */}
            <div className="text-justify mb-8">
                Surat tugas ini berlaku terhitung mulai tanggal ditetapkan hingga berakhirnya kegiatan BCC 2026. Demikian Surat Perintah Tugas ini dibuat untuk dilaksanakan sebagaimana mestinya.
            </div>

            {/* TANDA TANGAN */}
            <div className="flex justify-end mt-12">
                <div className="text-center w-64">
                    <p>Ditetapkan di: Bandung</p>
                    <p className="mb-4">Pada Tanggal: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p className="font-bold uppercase text-xs mb-20">Project Director,</p>
                    
                    {/* TTD DIGITAL */}
                    <div className="relative inline-block">
                        {/* Simulasi Cap/Stempel */}
                        <div className="absolute -top-12 -left-8 w-24 h-24 border-4 border-red-600/50 rounded-full flex items-center justify-center rotate-[-15deg] pointer-events-none">
                            <span className="text-[10px] font-bold text-red-600/50 uppercase text-center leading-tight">Panitia<br/>BCC 2026<br/>OFFICIAL</span>
                        </div>
                        <p className="font-bold underline text-sm uppercase">Irsyad Jamal Pratama Putra</p>
                    </div>
                </div>
            </div>

        </div>
      </div>

    </div>
  );
}
