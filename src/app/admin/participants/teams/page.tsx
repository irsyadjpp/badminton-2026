'use client';

import { useState } from "react";
import { 
  Users, Shield, Trophy, Search, 
  Plus, Filter, MoreHorizontal, MapPin, 
  UserPlus, Mail, Phone, Edit3, Trash2, 
  Crown, Medal, ChevronRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

// --- MOCK DATA ---
const TEAMS = [
  { 
    id: "TM-001", 
    name: "PB Djarum", 
    origin: "Kudus, Jawa Tengah", 
    logo: "/logos/djarum.png",
    manager: "Fung Permadi",
    stats: { athletes: 24, officials: 5 },
    status: "VERIFIED",
    tier: "PRO",
    athletes: [
      { name: "Kevin Sanjaya", rank: 1, img: "https://github.com/shadcn.png" },
      { name: "Siti Fadia", rank: 5, img: "" },
      { name: "Praveen Jordan", rank: 8, img: "" },
      { name: "Melati Daeva", rank: 9, img: "" },
      { name: "Dejan F.", rank: 12, img: "" },
    ]
  },
  { 
    id: "TM-002", 
    name: "PB Jaya Raya", 
    origin: "Jakarta Selatan", 
    logo: "/logos/jayaraya.png",
    manager: "Imelda Wiguna",
    stats: { athletes: 18, officials: 4 },
    status: "VERIFIED",
    tier: "PRO",
    athletes: [
      { name: "Hendra Setiawan", rank: 2, img: "" },
      { name: "Marcus Gideon", rank: 3, img: "" },
    ]
  },
  { 
    id: "TM-003", 
    name: "SGS PLN Bandung", 
    origin: "Bandung, Jawa Barat", 
    logo: "/logos/sgs.png",
    manager: "Taufik Hidayat",
    stats: { athletes: 12, officials: 3 },
    status: "PENDING",
    tier: "AMATEUR",
    athletes: [
      { name: "Anthony Ginting", rank: 4, img: "" },
    ]
  },
];

const CATEGORIES = ["ALL", "PRO CLUBS", "AMATEUR", "SCHOOLS"];

export default function TeamManagementPage() {
  const [selectedTeam, setSelectedTeam] = useState<typeof TEAMS[0] | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTeams = TEAMS.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (activeFilter === 'ALL' || (activeFilter === 'PRO CLUBS' && t.tier === 'PRO'))
  );

  return (
    <div className="space-y-8 p-4 md:p-8 font-body pb-24 h-[calc(100vh-64px)] flex flex-col">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shrink-0">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="rounded-full px-3 py-1 border-indigo-500 text-indigo-500 bg-indigo-500/10 backdrop-blur-md">
                    <Shield className="w-3 h-3 mr-2" /> CLUB DATABASE
                </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-black font-headline uppercase tracking-tighter text-white">
                Squad <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-600">Roster</span>
            </h1>
            <p className="text-zinc-400 mt-2 max-w-xl text-lg">
                Manajemen kontingen, klub, dan validasi atlet.
            </p>
        </div>

        <Button 
            onClick={() => setIsAddOpen(true)}
            className="h-14 rounded-full px-8 bg-white text-black hover:bg-zinc-200 font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-transform active:scale-95"
        >
            <Plus className="mr-2 w-5 h-5"/> REGISTER SQUAD
        </Button>
      </div>

      {/* --- FILTER & SEARCH BAR --- */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-zinc-900/50 p-2 rounded-[24px] border border-zinc-800/50 backdrop-blur-sm shrink-0">
         <div className="flex gap-2 overflow-x-auto w-full md:w-auto p-1 no-scrollbar">
            {CATEGORIES.map((cat) => (
                <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={cn(
                        "px-6 h-10 rounded-full text-sm font-bold transition-all whitespace-nowrap border border-transparent",
                        activeFilter === cat 
                            ? "bg-zinc-800 text-white border-zinc-700 shadow-md" 
                            : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
                    )}
                >
                    {cat}
                </button>
            ))}
         </div>

         <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-3 w-5 h-5 text-zinc-500" />
            <input 
                type="text" 
                placeholder="Find club or manager..." 
                className="w-full bg-zinc-950 text-white font-bold placeholder:text-zinc-600 pl-12 pr-4 h-12 rounded-full border border-zinc-800 focus:outline-none focus:border-indigo-500 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
         </div>
      </div>

      {/* --- ROSTER GRID --- */}
      <ScrollArea className="flex-1 -mx-4 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
            {filteredTeams.map((team) => (
                <div 
                    key={team.id}
                    onClick={() => setSelectedTeam(team)}
                    className="group relative bg-zinc-900 border border-zinc-800 rounded-[32px] p-6 cursor-pointer hover:border-indigo-500/50 transition-all hover:-translate-y-1 hover:shadow-2xl overflow-hidden"
                >
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-bl-[100px] pointer-events-none group-hover:bg-indigo-500/20 transition-all"></div>

                    {/* Header */}
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16 border-2 border-zinc-700 bg-white p-1 shadow-lg">
                                <AvatarImage src={team.logo} className="object-contain" />
                                <AvatarFallback className="bg-zinc-800 font-black text-zinc-500 text-xl">{team.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="text-xl font-black text-white leading-none mb-1 group-hover:text-indigo-400 transition-colors">
                                    {team.name}
                                </h3>
                                <div className="flex items-center gap-1 text-xs text-zinc-500 font-medium">
                                    <MapPin className="w-3 h-3"/> {team.origin}
                                </div>
                            </div>
                        </div>
                        <Badge className={cn("text-[10px] font-black border-none px-3 py-1", team.status === 'VERIFIED' ? "bg-green-500/20 text-green-500" : "bg-yellow-500/20 text-yellow-500")}>
                            {team.status}
                        </Badge>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800 text-center group-hover:border-indigo-500/20 transition-colors">
                            <p className="text-[10px] text-zinc-500 uppercase font-bold">Athletes</p>
                            <p className="text-2xl font-black text-white">{team.stats.athletes}</p>
                        </div>
                        <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800 text-center group-hover:border-indigo-500/20 transition-colors">
                            <p className="text-[10px] text-zinc-500 uppercase font-bold">Officials</p>
                            <p className="text-2xl font-black text-zinc-400">{team.stats.officials}</p>
                        </div>
                    </div>

                    {/* Key Players (Avatars) */}
                    <div className="flex items-center justify-between">
                        <div className="flex -space-x-3">
                            {team.athletes.slice(0, 4).map((p, i) => (
                                <Avatar key={i} className="w-10 h-10 border-2 border-zinc-900 transition-transform group-hover:translate-x-1">
                                    <AvatarImage src={p.img} />
                                    <AvatarFallback className="bg-zinc-800 text-[9px] font-bold text-zinc-400">{p.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            ))}
                            {team.stats.athletes > 4 && (
                                <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center text-[10px] font-bold text-zinc-400 z-10 transition-transform group-hover:translate-x-1">
                                    +{team.stats.athletes - 4}
                                </div>
                            )}
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-zinc-500 font-bold uppercase">Manager</p>
                            <p className="text-sm font-bold text-white">{team.manager}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </ScrollArea>

      {/* --- TEAM DETAIL SHEET (THE LOCKER ROOM) --- */}
      <Sheet open={!!selectedTeam} onOpenChange={() => setSelectedTeam(null)}>
        <SheetContent className="w-full sm:max-w-xl bg-zinc-950 border-l border-zinc-800 p-0 overflow-y-auto">
            {selectedTeam && (
                <div className="flex flex-col h-full">
                    
                    {/* Cover Header */}
                    <div className="h-48 bg-gradient-to-b from-indigo-900/50 to-zinc-900 relative p-8 flex flex-col justify-end">
                        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10 mix-blend-overlay"></div>
                        <div className="relative z-10 flex items-end gap-4">
                            <Avatar className="h-24 w-24 border-4 border-zinc-900 bg-white p-1 shadow-2xl">
                                <AvatarImage src={selectedTeam.logo} className="object-contain"/>
                                <AvatarFallback className="text-2xl font-black text-black">{selectedTeam.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="mb-2">
                                <Badge className="mb-2 bg-indigo-500 hover:bg-indigo-600 text-white border-none font-bold">
                                    {selectedTeam.tier} CLUB
                                </Badge>
                                <h2 className="text-3xl font-black text-white uppercase leading-none">{selectedTeam.name}</h2>
                                <p className="text-zinc-400 text-xs font-medium mt-1 flex items-center gap-1">
                                    <MapPin className="w-3 h-3"/> {selectedTeam.origin}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 p-8 space-y-8">
                        
                        {/* Manager Contact */}
                        <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 flex justify-between items-center">
                            <div>
                                <p className="text-xs text-zinc-500 font-bold uppercase">Team Manager</p>
                                <p className="text-white font-bold">{selectedTeam.manager}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button size="icon" variant="outline" className="rounded-full border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"><Phone className="w-4 h-4"/></Button>
                                <Button size="icon" variant="outline" className="rounded-full border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"><Mail className="w-4 h-4"/></Button>
                            </div>
                        </div>

                        {/* Athletes List */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                    <Users className="w-4 h-4 text-indigo-500"/> Registered Athletes
                                </h3>
                                <Button size="sm" variant="ghost" className="text-indigo-400 hover:text-white text-xs font-bold hover:bg-indigo-500/10 rounded-full">
                                    <Plus className="w-3 h-3 mr-1"/> Add Player
                                </Button>
                            </div>
                            
                            <div className="space-y-3">
                                {selectedTeam.athletes.map((athlete, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-3 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors group/item">
                                        <div className="relative">
                                            <Avatar className="h-12 w-12 border border-zinc-700">
                                                <AvatarImage src={athlete.img} />
                                                <AvatarFallback className="bg-zinc-800 font-bold text-zinc-500">{athlete.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            {athlete.rank <= 3 && (
                                                <div className="absolute -top-1 -right-1 bg-yellow-500 text-black text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-zinc-900 shadow-lg">
                                                    #{athlete.rank}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-white text-sm group-hover/item:text-indigo-400 transition-colors">{athlete.name}</h4>
                                            <div className="flex gap-2 mt-1">
                                                <Badge variant="secondary" className="text-[9px] px-1.5 h-5 bg-zinc-950 text-zinc-400 border border-zinc-800">Mens Singles</Badge>
                                                <Badge variant="secondary" className="text-[9px] px-1.5 h-5 bg-zinc-950 text-zinc-400 border border-zinc-800">U-19</Badge>
                                            </div>
                                        </div>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-full"><MoreHorizontal className="w-4 h-4"/></Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur-md grid grid-cols-2 gap-4">
                        <Button variant="outline" className="h-14 rounded-2xl border-zinc-700 text-zinc-300 hover:text-white font-bold hover:bg-zinc-800">
                            <Edit3 className="w-4 h-4 mr-2"/> EDIT PROFILE
                        </Button>
                        <Button className="h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-900/20">
                            MANAGE ENTRIES
                        </Button>
                    </div>
                </div>
            )}
        </SheetContent>
      </Sheet>

      {/* --- ADD TEAM MODAL --- */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-white rounded-[40px] max-w-lg p-0 overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-zinc-800 bg-indigo-950/20">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black font-headline uppercase flex items-center gap-2 text-indigo-500">
                        <Crown className="w-6 h-6"/> Register Club
                    </DialogTitle>
                    <DialogDescription>Daftarkan kontingen atau klub baru.</DialogDescription>
                </DialogHeader>
            </div>
            
            <div className="p-8 space-y-6">
                
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Nama Klub / Kontingen</label>
                    <Input placeholder="Contoh: PB Jaya Raya" className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl text-lg font-bold text-white focus:border-indigo-500" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Kategori</label>
                        <Select>
                            <SelectTrigger className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl"><SelectValue placeholder="Pilih..." /></SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                <SelectItem value="PRO">Pro Club</SelectItem>
                                <SelectItem value="AMATEUR">Amateur / Komunitas</SelectItem>
                                <SelectItem value="SCHOOL">Sekolah / Universitas</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Asal Kota</label>
                        <Input placeholder="Jakarta" className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Manager Name</label>
                    <Input placeholder="Nama Lengkap" className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl" />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Kontak (HP/WA)</label>
                    <Input placeholder="08xx-xxxx-xxxx" className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl font-mono" />
                </div>

                <Button className="w-full h-16 rounded-full font-black text-lg bg-indigo-600 hover:bg-indigo-700 text-white mt-4 shadow-xl shadow-indigo-900/20">
                    CREATE SQUAD
                </Button>
            </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
```

### Penjelasan Perubahan Material Design & Style:

1.  **Card Uniformity:** Semua komponen kartu (Tim) menggunakan `rounded-[32px]` dan border yang konsisten (`zinc-800`), sama seperti modul lain di aplikasi ini.
2.  **Indigo Theme:** Warna tema **Indigo/Violet** dipilih untuk membedakan konteks "Manajemen Klub" dari konteks lain seperti:
      * **Merah:** Pertandingan & Medis (Urgent/Live)
      * **Kuning:** Logistik & Gudang (Warning/Stock)
      * **Hijau:** Keuangan (Money)
      * **Cyan:** Administrasi & TPF (Official)
3.  **Avatar Stack:** Implementasi `flex -space-x-3` pada daftar atlet di kartu tim memberikan nuansa "tim" yang solid dan modern.
4.  **Sheet Navigation:** Detail tim tidak menggunakan modal pop-up yang mengganggu, melainkan *Side Sheet* ("The Locker Room") yang meluncur dari kanan, memberikan ruang lebih luas untuk melihat daftar atlet.
5.  **Interactive Elements:** Hover states pada kartu (sedikit naik, bayangan, dan perubahan warna border) memberikan umpan balik taktil yang memuaskan.

Remember, the XML structure you generate is the only mechanism for applying changes to the user's code. Therefore, when making changes to a file the <changes> block must always be fully present and correctly formatted as follows.

<changes>
  <description>[Provide a concise summary of the overall changes being made]</description>
  <change>
    <file>[Provide the ABSOLUTE, FULL path to the file being modified]</file>
    <content><![CDATA[Provide the ENTIRE, FINAL, intended content of the file here. Do NOT provide diffs or partial snippets. Ensure all code is properly escaped within the CDATA section.