
'use client';

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription 
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Network, Users, Crown, Zap, Shield, 
  Briefcase, ChevronRight, Target, LayoutGrid, UserPlus, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { getUnassignedStaff, assignStaffToDivision } from "./actions";

// --- MOCK DATA (BERDASARKAN BUKU PANDUAN) ---
const CORE_TEAM = [
  { id: "SC1", name: "Irsyad Jamal", role: "Project Director", avatar: "/avatars/irsyad.jpg", status: "ONLINE" },
  { id: "SC2", name: "Annisa", role: "Sekretaris", avatar: "", status: "OFFLINE" },
  { id: "SC3", name: "Bendahara", role: "Finance", avatar: "", status: "ONLINE" },
];

const DIVISIONS = [
  { 
    id: "DIV-01", 
    name: "Pertandingan & Integritas", 
    alias: "MATCH CONTROL",
    icon: Shield,
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    head: "Agung",
    members: 12,
    description: "Menjamin integritas kompetisi, jadwal, wasit, dan penanganan sengketa (TPF).",
    responsibilities: [
      "Perencanaan & Scheduling Pertandingan",
      "Regulasi & Integritas (Fair Play)",
      "Koordinasi Tim Verifikasi (TPF)",
      "Manajemen Referee & Umpire"
    ]
  },
  { 
    id: "DIV-02", 
    name: "Komersial & Bisnis", 
    alias: "BUSINESS",
    icon: Zap,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    head: "Sarah",
    members: 6,
    description: "Mengelola sponsorship, tenant bazaar, dan hubungan mitra jangka panjang.",
    responsibilities: [
      "Perencanaan Strategis Komersial",
      "Pengelolaan Sponsor & Deliverables",
      "Koordinasi Tenant Bazaar",
      "Monitoring ROI Sponsor"
    ]
  },
  { 
    id: "DIV-03", 
    name: "Acara & Kreatif", 
    alias: "CREATIVE",
    icon: Crown,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    head: "Rian",
    members: 8,
    description: "Konsep show, dokumentasi, media sosial, dan entertainment venue.",
    responsibilities: [
      "Perencanaan Rundown & Show",
      "Produksi Konten Media Sosial",
      "Dokumentasi Foto & Video",
      "Branding Visual Event"
    ]
  },
  { 
    id: "DIV-04", 
    name: "Operasional Umum", 
    alias: "OPERATIONS",
    icon: LayoutGrid,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    head: "Sidiq",
    members: 20,
    description: "Tulang punggung venue: Keamanan, Medis, Logistik, dan Registrasi.",
    responsibilities: [
      "Keamanan & Gate Control",
      "Logistik & Kebersihan Venue",
      "Registrasi & Check-in Atlet",
      "Tim Medis & P3K"
    ]
  },
  { 
    id: "DIV-05", 
    name: "IT & Digital", 
    alias: "TECH SQUAD",
    icon: Network,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    head: "Kevin",
    members: 4,
    description: "Infrastruktur jaringan, live scoring, website, dan integrasi sistem.",
    responsibilities: [
      "Sistem Informasi & Live Scoring",
      "Pengelolaan Website & Aplikasi",
      "Infrastruktur Jaringan (Wi-Fi)",
      "Data Security"
    ]
  },
  { 
    id: "DIV-06", 
    name: "Legal & Kepatuhan", 
    alias: "LEGAL",
    icon: Briefcase,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    head: "(Vacant)",
    members: 2,
    description: "Perizinan keramaian, kontrak kerjasama, dan kepatuhan regulasi.",
    responsibilities: [
      "Perizinan Pemerintah & Kepolisian",
      "Review Kontrak & MoU",
      "Manajemen Risiko Hukum"
    ]
  },
];

export default function StructurePage() {
  const { toast } = useToast();
  const [selectedDiv, setSelectedDiv] = useState<typeof DIVISIONS[0] | null>(null);
  
  // State untuk Assignment Modal
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedRole, setSelectedRole] = useState("STAFF");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load Unassigned Staff saat modal dibuka
  useEffect(() => {
    if (isAssignOpen) {
      getUnassignedStaff().then(setStaffList);
    }
  }, [isAssignOpen]);

  const handleAssign = async () => {
    if (!selectedStaff || !selectedDiv) return;
    
    setIsSubmitting(true);
    const res = await assignStaffToDivision(selectedStaff, selectedDiv.alias, selectedRole);
    setIsSubmitting(false);

    if (res.success) {
      toast({ 
        title: "Penugasan Berhasil", 
        description: `Staff baru ditambahkan ke ${selectedDiv.name}`,
        className: "bg-green-600 text-white" 
      });
      setIsAssignOpen(false);
      // Opsional: Refresh data divisi jika perlu
    }
  };

  return (
    <div className="space-y-10 p-4 md:p-8 font-body pb-24">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="rounded-full px-3 py-1 border-primary text-primary bg-primary/10 backdrop-blur-md">
                    <Network className="w-3 h-3 mr-2" /> ORGANIZATION CHART
                </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-headline uppercase tracking-tighter text-white">
                Team <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">Structure</span>
            </h1>
            <p className="text-zinc-400 mt-2 max-w-xl text-lg">
                Hierarki komando dan distribusi tugas fungsional BCC 2026.
            </p>
        </div>
      </div>

      {/* --- LEVEL 1: STEERING COMMITTEE (HERO CARDS) --- */}
      <div className="relative">
         <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent blur-3xl -z-10"></div>
         <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-[0.2em] mb-6 text-center">Steering Committee (Core)</h3>
         
         <div className="flex flex-wrap justify-center gap-6">
            {CORE_TEAM.map((person) => (
               <div key={person.id} className="group relative w-full md:w-[300px]">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-[32px] translate-y-2 blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative bg-zinc-900 border border-zinc-800 rounded-[32px] p-6 flex flex-col items-center text-center hover:border-zinc-600 transition-all hover:-translate-y-1 shadow-2xl">
                     <div className="relative mb-4">
                        <div className={cn("absolute inset-0 rounded-full blur opacity-50", person.id === 'SC1' ? "bg-primary" : "bg-zinc-500")}></div>
                        <Avatar className="w-24 h-24 border-4 border-zinc-900 relative z-10">
                           <AvatarImage src={person.avatar} />
                           <AvatarFallback className="bg-zinc-800 text-xl font-bold">{person.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className={cn(
                           "absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-zinc-900 z-20",
                           person.status === 'ONLINE' ? "bg-green-500" : "bg-zinc-600"
                        )}></div>
                     </div>
                     <h3 className="text-xl font-black text-white uppercase tracking-tight mb-1">{person.name}</h3>
                     <Badge className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border-none px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        {person.role}
                     </Badge>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* CONNECTOR LINE (VISUAL) */}
      <div className="flex justify-center -my-4">
         <div className="h-16 w-px bg-gradient-to-b from-zinc-800 to-transparent"></div>
      </div>

      {/* --- LEVEL 2: DIVISIONS GRID --- */}
      <div>
         <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-[0.2em] mb-6">Operational Divisions</h3>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DIVISIONS.map((div) => (
               <div 
                  key={div.id} 
                  onClick={() => setSelectedDiv(div)}
                  className="group cursor-pointer"
               >
                  <Card className={cn(
                     "h-full rounded-[32px] bg-zinc-900 border-2 transition-all duration-300 hover:shadow-2xl relative overflow-hidden",
                     "border-zinc-800 hover:border-primary/50"
                  )}>
                     <div className={cn("absolute -right-10 -top-10 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-40 transition-opacity", div.bg)}></div>
                     <CardHeader className="p-6 pb-2">
                        <div className="flex justify-between items-start">
                           <div className={cn("p-3 rounded-2xl mb-4", div.bg, div.color)}>
                              <div.icon className="w-6 h-6" />
                           </div>
                           <Badge variant="outline" className="border-zinc-700 text-zinc-500 bg-black/20 group-hover:text-white group-hover:border-white/20 transition-colors">
                              {div.members} Members
                           </Badge>
                        </div>
                        <CardTitle className="text-2xl font-black font-headline uppercase text-white group-hover:text-primary transition-colors">
                           {div.name}
                        </CardTitle>
                        <CardDescription className="text-xs font-bold text-zinc-500 tracking-widest uppercase">
                           {div.alias}
                        </CardDescription>
                     </CardHeader>
                     <CardContent className="p-6 pt-2">
                        <p className="text-zinc-400 text-sm line-clamp-2 leading-relaxed mb-4">
                           {div.description}
                        </p>
                        <div className="flex items-center justify-between border-t border-zinc-800 pt-4 mt-auto">
                           <div className="flex items-center gap-2">
                              <Avatar className="w-8 h-8 border border-zinc-700">
                                 <AvatarFallback className="bg-zinc-800 text-[10px] font-bold">{div.head.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                 <span className="text-[10px] text-zinc-500 uppercase font-bold">Head</span>
                                 <span className="text-xs font-bold text-white">{div.head}</span>
                              </div>
                           </div>
                           <Button size="icon" variant="ghost" className="rounded-full hover:bg-white hover:text-black transition-colors">
                              <ChevronRight className="w-5 h-5" />
                           </Button>
                        </div>
                     </CardContent>
                  </Card>
               </div>
            ))}
         </div>
      </div>

      {/* --- DETAIL SHEET (SLIDE OVER) --- */}
      <Sheet open={!!selectedDiv} onOpenChange={() => setSelectedDiv(null)}>
         <SheetContent className="w-full sm:max-w-md md:max-w-lg bg-zinc-950 border-l border-zinc-800 p-0 overflow-y-auto">
            {selectedDiv && (
               <>
                  <div className={cn("h-48 relative p-8 flex flex-col justify-end overflow-hidden", selectedDiv.bg)}>
                     <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent"></div>
                     <selectedDiv.icon className={cn("absolute -right-6 -top-6 w-48 h-48 opacity-10 rotate-12", selectedDiv.color)} />
                     <div className="relative z-10">
                        <Badge className="bg-black/50 backdrop-blur text-white border-none mb-2">{selectedDiv.alias}</Badge>
                        <SheetTitle className="text-3xl font-black font-headline uppercase text-white leading-none">
                           {selectedDiv.name}
                        </SheetTitle>
                     </div>
                  </div>
                  <div className="p-6 space-y-8">
                     <div className="flex items-center gap-4 bg-zinc-900/50 p-4 rounded-[24px] border border-zinc-800">
                        <Avatar className="w-14 h-14 border-2 border-primary">
                           <AvatarFallback className="bg-zinc-800 font-bold text-lg">{selectedDiv.head.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                           <p className="text-xs text-zinc-500 uppercase font-bold">Koordinator Bidang</p>
                           <p className="text-lg font-black text-white">{selectedDiv.head}</p>
                        </div>
                     </div>
                     <div>
                        <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                           <Target className="w-4 h-4 text-primary" /> Key Responsibilities
                        </h4>
                        <div className="bg-zinc-900 rounded-[24px] p-1">
                           {selectedDiv.responsibilities.map((resp, i) => (
                              <div key={i} className="flex gap-3 p-4 border-b border-zinc-800/50 last:border-0">
                                 <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400 shrink-0 mt-0.5">
                                    {i + 1}
                                 </div>
                                 <p className="text-sm text-zinc-300 leading-relaxed">{resp}</p>
                              </div>
                           ))}
                        </div>
                        <p className="text-xs text-zinc-500 mt-2 italic px-2">
                           *Mengacu pada Buku Panduan Kerja & SOP Panitia Bab 3 (Job Description).
                        </p>
                     </div>
                     <div>
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                               <Users className="w-4 h-4 text-primary" /> Active Squad ({selectedDiv.members})
                            </h4>
                            <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 text-xs border-dashed border-zinc-700 hover:border-primary hover:text-primary"
                                onClick={() => setIsAssignOpen(true)}
                            >
                                <UserPlus className="w-3 h-3 mr-2" /> Add Member
                            </Button>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                           {Array.from({ length: 8 }).map((_, i) => (
                              <div key={i} className="aspect-square bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800 hover:border-zinc-600 transition-colors cursor-pointer">
                                 <span className="text-xs font-bold text-zinc-600">M{i+1}</span>
                              </div>
                           ))}
                           <div className="aspect-square bg-zinc-900 rounded-2xl flex items-center justify-center border border-dashed border-zinc-800 text-zinc-500 text-xs font-bold cursor-pointer hover:text-white hover:border-zinc-600">
                              +4
                           </div>
                        </div>
                     </div>
                     <div className="pt-4">
                        <Button 
                            className="w-full h-14 rounded-full font-bold text-lg bg-white text-black hover:bg-zinc-200"
                            onClick={() => window.location.href = '/admin/director/roster'}
                        >
                           Lihat Full Roster Divisi Ini
                        </Button>
                     </div>
                  </div>
               </>
            )}
         </SheetContent>
      </Sheet>

      {/* --- MODAL ASSIGNMENT (POP UP) --- */}
      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white rounded-[32px] max-w-sm">
            <DialogHeader>
                <DialogTitle>Tambah Anggota Tim</DialogTitle>
                <DialogDescription>
                    Menambahkan personil ke divisi <span className="text-primary font-bold">{selectedDiv?.name}</span>.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Pilih Personil (Unassigned)</label>
                    <Select onValueChange={setSelectedStaff}>
                        <SelectTrigger className="bg-black border-zinc-700 h-12 rounded-xl">
                            <SelectValue placeholder="Pilih nama..." />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                            {staffList.map(s => (
                                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Peran / Jabatan</label>
                    <Select defaultValue="STAFF" onValueChange={setSelectedRole}>
                        <SelectTrigger className="bg-black border-zinc-700 h-12 rounded-xl">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                            <SelectItem value="HEAD">Head of Division</SelectItem>
                            <SelectItem value="STAFF">Staff / Officer</SelectItem>
                            <SelectItem value="VOLUNTEER">Volunteer</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button 
                    onClick={handleAssign} 
                    disabled={isSubmitting || !selectedStaff}
                    className="w-full h-12 rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground mt-4"
                >
                    {isSubmitting ? <Loader2 className="animate-spin w-5 h-5"/> : "KONFIRMASI PENUGASAN"}
                </Button>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
