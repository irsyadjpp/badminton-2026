
'use client';

import { useState } from "react";
import { 
  Mail, Send, FileText, PenTool, 
  Search, Paperclip, CheckCircle2, AlertCircle, 
  Archive, MoreHorizontal, FileSignature, ArrowRight, 
  Inbox, Printer, Download
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// --- MOCK DATA ---
const EMAILS = [
  { 
    id: "SURAT-001", 
    type: "INBOX", 
    sender: "Polrestabes Bandung", 
    subject: "Balasan Izin Keramaian Event BCC 2026", 
    preview: "Berdasarkan surat permohonan nomor 005/EXT/BCC... izin prinsip disetujui dengan syarat...",
    date: "10:30 AM", 
    status: "URGENT", 
    read: false,
    attachment: "SK_Izin_Polisi.pdf"
  },
  { 
    id: "SURAT-002", 
    type: "OUTBOX", 
    recipient: "Bank BJB (Pusat)", 
    subject: "Proposal Sponsorship Termin 1", 
    preview: "Mengirimkan invoice dan dokumen pendukung pencairan termin pertama sebesar...",
    date: "Yesterday", 
    status: "SENT", 
    read: true,
    attachment: "Invoice_BJB_01.pdf"
  },
  { 
    id: "SURAT-003", 
    type: "DRAFT", 
    recipient: "PBSI Pengprov Jabar", 
    subject: "Permohonan Referee Nasional", 
    preview: "Kami memohon penugasan 2 orang Referee berlisensi Nasional untuk memimpin...",
    date: "Drafted 2h ago", 
    status: "WAITING_SIGN", 
    read: true,
    attachment: null
  },
  { 
    id: "SURAT-004", 
    type: "INBOX", 
    sender: "PB Djarum", 
    subject: "Konfirmasi Keikutsertaan Tim", 
    preview: "Kami mengonfirmasi akan mengirimkan 15 atlet untuk kategori U-17 dan Dewasa...",
    date: "2 days ago", 
    status: "NORMAL", 
    read: true,
    attachment: "Entry_Form_Djarum.xlsx"
  },
];

const TEMPLATES = [
  { id: "SK", label: "Surat Keputusan (SK)" },
  { id: "INV", label: "Surat Undangan Resmi" },
  { id: "PERMIT", label: "Surat Izin / Peminjaman" },
  { id: "MOU", label: "MoU Kerjasama" },
];

export default function CorrespondencePage() {
  const [activeTab, setActiveTab] = useState("INBOX");
  const [selectedMail, setSelectedMail] = useState<typeof EMAILS[0] | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  const filteredMails = EMAILS.filter(m => activeTab === 'ALL' || m.type === activeTab);

  const getStatusColor = (s: string) => {
    switch(s) {
        case 'URGENT': return "bg-red-500/10 text-red-500 border-red-500/20 animate-pulse";
        case 'WAITING_SIGN': return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
        case 'SENT': return "bg-blue-500/10 text-blue-500 border-blue-500/20";
        default: return "bg-zinc-800 text-zinc-400 border-zinc-700";
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-8 font-body pb-24 h-[calc(100vh-64px)] flex flex-col">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shrink-0">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="rounded-full px-3 py-1 border-cyan-500 text-cyan-500 bg-cyan-500/10 backdrop-blur-md">
                    <FileSignature className="w-3 h-3 mr-2" /> E-OFFICE SYSTEM
                </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-black font-headline uppercase tracking-tighter text-white">
                Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Correspondence</span>
            </h1>
            <p className="text-zinc-400 mt-2 max-w-xl text-lg">
                Sentralisasi surat masuk, keluar, dan disposisi digital.
            </p>
        </div>

        <Button 
            onClick={() => setIsComposeOpen(true)}
            className="h-14 rounded-full px-8 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-lg shadow-[0_0_25px_rgba(8,145,178,0.4)] transition-all hover:scale-105"
        >
            <PenTool className="mr-2 w-5 h-5"/> COMPOSE NEW
        </Button>
      </div>

      {/* --- MAIN WORKSPACE --- */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
         
         {/* LEFT: NAVIGATION (2 Cols) */}
         <Card className="lg:col-span-2 bg-zinc-900 border-zinc-800 rounded-[32px] p-4 hidden lg:flex flex-col gap-2">
            <Button 
                variant={activeTab === 'INBOX' ? "default" : "ghost"} 
                onClick={() => setActiveTab('INBOX')}
                className={cn("justify-start h-12 rounded-xl font-bold", activeTab === 'INBOX' ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white")}
            >
                <Inbox className="w-5 h-5 mr-3"/> Inbox
                <Badge className="ml-auto bg-cyan-600 text-white">2</Badge>
            </Button>
            <Button 
                variant={activeTab === 'OUTBOX' ? "default" : "ghost"} 
                onClick={() => setActiveTab('OUTBOX')}
                className={cn("justify-start h-12 rounded-xl font-bold", activeTab === 'OUTBOX' ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white")}
            >
                <Send className="w-5 h-5 mr-3"/> Sent
            </Button>
            <Button 
                variant={activeTab === 'DRAFT' ? "default" : "ghost"} 
                onClick={() => setActiveTab('DRAFT')}
                className={cn("justify-start h-12 rounded-xl font-bold", activeTab === 'DRAFT' ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white")}
            >
                <FileText className="w-5 h-5 mr-3"/> Drafts
                <Badge variant="outline" className="ml-auto border-zinc-700 text-zinc-500">1</Badge>
            </Button>
            <Button variant="ghost" className="justify-start h-12 rounded-xl font-bold text-zinc-400 hover:text-white mt-auto">
                <Archive className="w-5 h-5 mr-3"/> Archives
            </Button>
         </Card>

         {/* CENTER: MAIL LIST (4 Cols) */}
         <Card className="lg:col-span-4 bg-zinc-900/50 border border-zinc-800/50 rounded-[32px] flex flex-col overflow-hidden backdrop-blur-sm">
            <div className="p-4 border-b border-zinc-800">
                <div className="relative">
                    <Search className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
                    <Input placeholder="Search subject or ID..." className="h-12 bg-zinc-900 border-zinc-800 rounded-xl pl-10 text-white focus:ring-cyan-500" />
                </div>
            </div>
            <ScrollArea className="flex-1 p-3">
                <div className="space-y-2">
                    {filteredMails.map((mail) => (
                        <div 
                            key={mail.id} 
                            onClick={() => setSelectedMail(mail)}
                            className={cn(
                                "group relative p-4 rounded-[20px] border cursor-pointer transition-all hover:scale-[1.02]",
                                selectedMail?.id === mail.id 
                                    ? "bg-zinc-800 border-cyan-500/50 shadow-lg" 
                                    : "bg-zinc-950 border-zinc-800 hover:border-zinc-700",
                                !mail.read && "border-l-4 border-l-cyan-500"
                            )}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <Avatar className="w-6 h-6 border border-zinc-700">
                                        <AvatarFallback className="text-[9px] bg-zinc-900 text-zinc-400">
                                            {(mail.sender || mail.recipient)?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs font-bold text-white truncate max-w-[120px]">
                                        {mail.sender || `To: ${mail.recipient}`}
                                    </span>
                                </div>
                                <span className="text-[10px] text-zinc-500 font-mono">{mail.date}</span>
                            </div>
                            
                            <h4 className={cn("text-sm mb-1 line-clamp-1 group-hover:text-cyan-400 transition-colors", !mail.read ? "font-black text-white" : "font-medium text-zinc-300")}>
                                {mail.subject}
                            </h4>
                            <p className="text-xs text-zinc-500 line-clamp-2 mb-3">
                                {mail.preview}
                            </p>

                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className={cn("text-[9px] h-5 px-1.5 border font-bold", getStatusColor(mail.status))}>
                                    {mail.status.replace('_', ' ')}
                                </Badge>
                                {mail.attachment && (
                                    <Badge variant="secondary" className="text-[9px] h-5 px-1.5 bg-zinc-900 text-zinc-400 border-zinc-800">
                                        <Paperclip className="w-3 h-3 mr-1"/> PDF
                                    </Badge>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
         </Card>

         {/* RIGHT: READING PANE (6 Cols) */}
         <div className="lg:col-span-6 h-full">
            {selectedMail ? (
                <Card className="bg-zinc-950 border-zinc-800 rounded-[32px] h-full flex flex-col overflow-hidden shadow-2xl relative">
                    
                    {/* Mail Header */}
                    <div className="p-8 border-b border-zinc-800 bg-zinc-900/30">
                        <div className="flex justify-between items-start mb-4">
                            <Badge variant="outline" className="border-zinc-700 text-zinc-400 font-mono">
                                REF: {selectedMail.id}
                            </Badge>
                            <div className="flex gap-2">
                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-zinc-400 hover:text-white"><Printer className="w-4 h-4"/></Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-zinc-400 hover:text-white"><MoreHorizontal className="w-4 h-4"/></Button>
                            </div>
                        </div>
                        <h2 className="text-2xl font-black text-white leading-tight mb-4">
                            {selectedMail.subject}
                        </h2>
                        <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10 border border-zinc-700">
                                <AvatarFallback className="bg-cyan-900 text-cyan-200 font-bold">
                                    {(selectedMail.sender || selectedMail.recipient)?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-bold text-white">
                                    {selectedMail.sender || `To: ${selectedMail.recipient}`}
                                </p>
                                <p className="text-xs text-zinc-500">{selectedMail.date}</p>
                            </div>
                        </div>
                    </div>

                    {/* Mail Body */}
                    <ScrollArea className="flex-1 bg-zinc-950/50">
                        <div className="p-8 text-sm text-zinc-300 leading-relaxed space-y-4 font-serif">
                            <p>Yth. Project Director,</p>
                            <p>{selectedMail.preview}</p>
                            <p>Demikian surat ini kami sampaikan. Atas perhatian dan kerjasamanya kami ucapkan terima kasih.</p>
                            <br/>
                            <div className="border-l-2 border-zinc-800 pl-4 py-2 my-4">
                                <p className="text-xs font-bold text-zinc-500 uppercase mb-2">Lampiran Dokumen</p>
                                {selectedMail.attachment ? (
                                    <div className="flex items-center gap-3 bg-zinc-900 p-3 rounded-xl border border-zinc-800 w-fit cursor-pointer hover:border-cyan-500/50 transition-colors">
                                        <div className="p-2 bg-red-500/10 rounded-lg text-red-500"><FileText className="w-5 h-5"/></div>
                                        <div>
                                            <p className="text-xs font-bold text-white">{selectedMail.attachment}</p>
                                            <p className="text-[10px] text-zinc-500">2.4 MB • PDF</p>
                                        </div>
                                        <Download className="w-4 h-4 text-zinc-500 ml-2"/>
                                    </div>
                                ) : (
                                    <p className="text-xs text-zinc-600 italic">Tidak ada lampiran.</p>
                                )}
                            </div>
                        </div>
                    </ScrollArea>

                    {/* Action Bar (Sticky) */}
                    <div className="p-6 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur-md">
                        {selectedMail.type === 'DRAFT' ? (
                            <div className="flex gap-4">
                                <Button className="flex-1 h-12 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold shadow-lg shadow-cyan-900/20">
                                    <FileSignature className="w-4 h-4 mr-2"/> DIGITAL SIGN & SEND
                                </Button>
                                <Button variant="outline" className="h-12 rounded-xl border-zinc-700 text-zinc-300 hover:text-white">
                                    Edit Draft
                                </Button>
                            </div>
                        ) : (
                            <div className="flex gap-4">
                                <Button className="flex-1 h-12 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold">
                                    <ArrowRight className="w-4 h-4 mr-2"/> REPLY
                                </Button>
                                <Button variant="outline" className="h-12 rounded-xl border-zinc-700 text-zinc-300 hover:text-white">
                                    Forward
                                </Button>
                            </div>
                        )}
                    </div>

                </Card>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-zinc-600 bg-zinc-900/50 rounded-[32px] border border-zinc-800 border-dashed">
                    <Mail className="w-20 h-20 mb-4 opacity-20 animate-pulse"/>
                    <p className="font-bold uppercase tracking-widest text-lg">Select Message</p>
                </div>
            )}
         </div>

      </div>

      {/* --- COMPOSE MODAL --- */}
      <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-white rounded-[40px] max-w-2xl p-0 overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-zinc-800 bg-cyan-950/20">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black font-headline uppercase flex items-center gap-2 text-cyan-500">
                        <PenTool className="w-6 h-6"/> Compose Letter
                    </DialogTitle>
                    <DialogDescription>Buat surat resmi baru menggunakan template.</DialogDescription>
                </DialogHeader>
            </div>
            
            <div className="p-8 space-y-6">
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Jenis Surat (Template)</label>
                        <Select>
                            <SelectTrigger className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl"><SelectValue placeholder="Pilih..." /></SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                {TEMPLATES.map(t => <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Nomor Surat (Auto)</label>
                        <Input value="006/BCC/EXT/VI/2026" disabled className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl font-mono text-zinc-400" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Kepada (Penerima)</label>
                    <Input placeholder="Instansi / Nama..." className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl" />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Perihal</label>
                    <Input placeholder="Judul Surat..." className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl font-bold" />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Isi Surat</label>
                    <Textarea placeholder="Ketik isi surat di sini..." className="bg-zinc-900 border-zinc-800 rounded-2xl min-h-[150px] font-serif p-4" />
                </div>

                <Button className="w-full h-16 rounded-full font-black text-lg bg-cyan-600 hover:bg-cyan-700 text-white mt-4 shadow-xl shadow-cyan-900/20">
                    SAVE DRAFT & PREVIEW
                </Button>
            </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
