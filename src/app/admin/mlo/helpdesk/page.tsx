
'use client';

import { useState } from "react";
import { 
  LifeBuoy, MessageSquare, Search, Plus, 
  CheckCircle2, AlertTriangle, HelpCircle, 
  MoreHorizontal, Send, User, ChevronRight, 
  Briefcase, Gavel, Package
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// --- MOCK DATA ---
const TICKETS = [
  { 
    id: "T-204", 
    requester: "Manajer PB Djarum", 
    category: "DISPUTE", 
    subject: "Protes Keputusan Hakim Garis (Court 2)", 
    desc: "Pada set ke-3 poin 19-19, shuttlecock jelas keluar tapi dinyatakan masuk.",
    status: "OPEN", 
    time: "2 min ago",
    priority: "HIGH"
  },
  { 
    id: "T-203", 
    requester: "Agus (Peserta MD)", 
    category: "INFO", 
    subject: "Jadwal Main Berubah?", 
    desc: "Apakah jadwal saya diundur? Di aplikasi jam 14:00 tapi belum dipanggil.",
    status: "OPEN", 
    time: "15 min ago",
    priority: "MEDIUM"
  },
  { 
    id: "T-202", 
    requester: "Siti (Penonton)", 
    category: "LOST_FOUND", 
    subject: "Kehilangan Kunci Motor", 
    desc: "Kunci motor Honda dengan gantungan boneka hilang di tribun barat.",
    status: "RESOLVED", 
    time: "1 hour ago",
    priority: "LOW"
  },
];

const CATEGORIES = [
  { id: "DISPUTE", label: "Protes / Sengketa", icon: Gavel, color: "text-red-500", bg: "bg-red-500/10" },
  { id: "INFO", label: "Informasi Umum", icon: HelpCircle, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "LOST_FOUND", label: "Lost & Found", icon: Package, color: "text-orange-500", bg: "bg-orange-500/10" },
  { id: "MEDICAL", label: "Laporan Medis", icon: LifeBuoy, color: "text-green-500", bg: "bg-green-500/10" },
];

export default function MLOHelpdeskPage() {
  const [selectedTicket, setSelectedTicket] = useState<typeof TICKETS[0] | null>(null);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const getCategoryStyle = (id: string) => {
    return CATEGORIES.find(c => c.id === id) || { icon: HelpCircle, color: "text-zinc-500", bg: "bg-zinc-500/10" };
  };

  return (
    <div className="space-y-6 p-4 md:p-6 font-body pb-24 h-[calc(100vh-64px)] flex flex-col">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shrink-0">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="rounded-full px-3 py-1 border-cyan-500 text-cyan-500 bg-cyan-500/10 backdrop-blur-md">
                    <LifeBuoy className="w-3 h-3 mr-2" /> PARTICIPANT SUPPORT
                </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-black font-headline uppercase tracking-tighter text-white">
                Help <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Center</span>
            </h1>
            <p className="text-zinc-400 mt-2 max-w-xl text-lg">
                Pusat bantuan, informasi, dan penanganan keluhan peserta.
            </p>
        </div>

        <Button 
            onClick={() => setIsNewTicketOpen(true)}
            className="h-14 rounded-full px-8 bg-white text-black hover:bg-zinc-200 font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-transform active:scale-95"
        >
            <Plus className="mr-2 w-5 h-5"/> BUAT TIKET
        </Button>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
         
         {/* LEFT: TICKET LIST (1/3) */}
         <Card className="lg:col-span-1 bg-zinc-900 border-zinc-800 rounded-[32px] flex flex-col overflow-hidden h-full shadow-2xl">
            
            {/* Search & Filter */}
            <div className="p-6 pb-2 space-y-4 bg-zinc-950/50 border-b border-zinc-800">
                <div className="relative">
                    <Search className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
                    <Input 
                        placeholder="Cari tiket..." 
                        className="h-12 bg-zinc-900 border-zinc-800 rounded-xl pl-10 text-white focus:ring-cyan-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-500 hover:bg-cyan-500/30 cursor-pointer h-8 px-4 rounded-lg whitespace-nowrap">Open (2)</Badge>
                    <Badge variant="outline" className="border-zinc-700 text-zinc-400 hover:text-white cursor-pointer h-8 px-4 rounded-lg whitespace-nowrap">Resolved</Badge>
                    <Badge variant="outline" className="border-zinc-700 text-zinc-400 hover:text-white cursor-pointer h-8 px-4 rounded-lg whitespace-nowrap">High Priority</Badge>
                </div>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                    {TICKETS.map((ticket) => {
                        const style = getCategoryStyle(ticket.category);
                        const Icon = style.icon;
                        return (
                            <div 
                                key={ticket.id} 
                                onClick={() => setSelectedTicket(ticket)}
                                className={cn(
                                    "group relative p-5 rounded-[24px] border-2 transition-all cursor-pointer hover:bg-zinc-800",
                                    selectedTicket?.id === ticket.id ? "bg-zinc-800 border-cyan-500/50 shadow-lg" : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                                )}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className={cn("flex items-center gap-2 text-[10px] font-black uppercase px-2 py-1 rounded-lg", style.bg, style.color)}>
                                        <Icon className="w-3 h-3" /> {style.label}
                                    </div>
                                    <span className="text-[10px] font-bold text-zinc-500">{ticket.time}</span>
                                </div>
                                
                                <h4 className="font-bold text-white text-base line-clamp-1 mb-1 group-hover:text-cyan-400 transition-colors">
                                    {ticket.subject}
                                </h4>
                                <p className="text-xs text-zinc-400 line-clamp-2 mb-3">
                                    {ticket.desc}
                                </p>

                                <div className="flex items-center justify-between border-t border-zinc-800/50 pt-3">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="w-6 h-6 border border-zinc-700">
                                            <AvatarFallback className="bg-zinc-900 text-[8px] text-zinc-400">{ticket.requester.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-xs text-zinc-500 font-medium truncate max-w-[100px]">{ticket.requester}</span>
                                    </div>
                                    {ticket.status === 'OPEN' ? (
                                        <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
                                    ) : (
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>
         </Card>

         {/* RIGHT: TICKET DETAIL (2/3) */}
         <div className="lg:col-span-2 h-full">
            {selectedTicket ? (
                <Card className="bg-zinc-950 border-zinc-800 rounded-[32px] h-full flex flex-col overflow-hidden shadow-2xl relative">
                    
                    {/* Header Detail */}
                    <div className="p-8 border-b border-zinc-800 bg-zinc-900/30">
                        <div className="flex justify-between items-start mb-4">
                            <Badge variant="outline" className="border-zinc-700 text-zinc-400 font-mono">
                                TICKET #{selectedTicket.id}
                            </Badge>
                            <div className={cn("px-3 py-1 rounded-full text-xs font-black uppercase", selectedTicket.priority === 'HIGH' ? "bg-red-500 text-white animate-pulse" : "bg-zinc-800 text-zinc-400")}>
                                {selectedTicket.priority} PRIORITY
                            </div>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2">
                            {selectedTicket.subject}
                        </h2>
                        <div className="flex items-center gap-2 text-zinc-400 text-sm">
                            <span>Dari: <strong className="text-white">{selectedTicket.requester}</strong></span>
                            <span>•</span>
                            <span>{selectedTicket.time}</span>
                        </div>
                    </div>

                    {/* Chat / Content Area */}
                    <ScrollArea className="flex-1 bg-zinc-950/50">
                        <div className="p-8 space-y-6">
                            {/* Original Issue */}
                            <div className="flex gap-4">
                                <Avatar className="w-10 h-10 border border-zinc-700 shrink-0">
                                    <AvatarFallback className="bg-zinc-800 text-zinc-400 font-bold">{selectedTicket.requester.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1 max-w-[80%]">
                                    <div className="text-xs text-zinc-500 font-bold mb-1">{selectedTicket.requester}</div>
                                    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl rounded-tl-none text-zinc-200 text-sm leading-relaxed">
                                        {selectedTicket.desc}
                                    </div>
                                </div>
                            </div>

                            {/* Staff Reply (Mock) */}
                            <div className="flex gap-4 flex-row-reverse">
                                <Avatar className="w-10 h-10 border-2 border-cyan-600 shrink-0">
                                    <AvatarImage src="/avatars/staff.jpg" />
                                    <AvatarFallback className="bg-cyan-900 text-cyan-200 font-bold">MLO</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1 max-w-[80%] text-right">
                                    <div className="text-xs text-zinc-500 font-bold mb-1">Helpdesk Staff</div>
                                    <div className="bg-cyan-900/20 border border-cyan-500/30 p-4 rounded-2xl rounded-tr-none text-cyan-100 text-sm leading-relaxed text-left">
                                        Baik, laporan sudah kami terima. Kami akan segera konfirmasi ke Referee yang bertugas di Court 2. Mohon tunggu sebentar.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>

                    {/* Action Bar (Sticky) */}
                    <div className="p-6 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur-md">
                        {selectedTicket.status === 'OPEN' ? (
                            <div className="space-y-4">
                                <div className="relative">
                                    <Input placeholder="Ketik balasan atau catatan..." className="bg-black border-zinc-800 h-14 rounded-2xl pr-14 text-white focus:ring-cyan-500" />
                                    <Button size="icon" className="absolute right-2 top-2 h-10 w-10 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white">
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="flex justify-between items-center gap-4">
                                    <div className="flex gap-2">
                                        <Button variant="outline" className="h-12 rounded-xl border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 font-bold">
                                            <AlertTriangle className="w-4 h-4 mr-2"/> Escalate to Referee
                                        </Button>
                                    </div>
                                    <Button className="h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg shadow-green-900/20 px-6">
                                        <CheckCircle2 className="w-5 h-5 mr-2"/> MARK RESOLVED
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-500 font-bold gap-2">
                                <CheckCircle2 className="w-5 h-5"/> Ticket Resolved
                            </div>
                        )}
                    </div>

                </Card>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-zinc-600 bg-zinc-900/50 rounded-[32px] border border-zinc-800 border-dashed">
                    <MessageSquare className="w-20 h-20 mb-4 opacity-20 animate-pulse"/>
                    <p className="font-bold uppercase tracking-widest text-lg">Select a Ticket</p>
                </div>
            )}
         </div>

      </div>

      {/* --- NEW TICKET MODAL --- */}
      <Dialog open={isNewTicketOpen} onOpenChange={setIsNewTicketOpen}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-white rounded-[40px] max-w-md p-0 overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-zinc-800 bg-zinc-900/50">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black font-headline uppercase flex items-center gap-2">
                        <Plus className="w-6 h-6 text-cyan-500"/> New Ticket
                    </DialogTitle>
                    <DialogDescription>Catat laporan atau keluhan baru.</DialogDescription>
                </DialogHeader>
            </div>
            
            <div className="p-8 space-y-6">
                
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Pelapor</label>
                    <Input placeholder="Nama Peserta / Official" className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Kategori</label>
                        <Select>
                            <SelectTrigger className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl"><SelectValue placeholder="Pilih..." /></SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                {CATEGORIES.map(c => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Prioritas</label>
                        <Select>
                            <SelectTrigger className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl"><SelectValue placeholder="Level" /></SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                <SelectItem value="HIGH">High</SelectItem>
                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                <SelectItem value="LOW">Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Subjek Masalah</label>
                    <Input placeholder="Judul singkat..." className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl" />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Deskripsi Detail</label>
                    <Textarea placeholder="Ceritakan kronologi atau detail masalah..." className="bg-zinc-900 border-zinc-800 rounded-2xl min-h-[100px] resize-none p-4" />
                </div>

                <Button className="w-full h-16 rounded-full font-black text-lg bg-cyan-600 hover:bg-cyan-700 text-white mt-2 shadow-xl shadow-cyan-900/20">
                    CREATE TICKET
                </Button>
            </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
