
'use client';

import { useState } from "react";
import { 
  Users, Shield, Trophy, Search, 
  Plus, MapPin, Mail, Phone, Edit3, 
  Crown, Star, UserPlus, Briefcase, 
  MoreHorizontal
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// --- MOCK DATA ---
const TEAMS = [
  { 
    id: "TM-001", 
    name: "PB Djarum", 
    origin: "Kudus", 
    logo: "/logos/djarum.png",
    manager: "Fung Permadi",
    status: "VERIFIED", 
    tier: "PRO", 
    performance: 95, // Progress Bar
    athletes: 24,
    officials: 5,
    rank: 1,
    contact: "0811-xxxx-xxxx"
  },
  { 
    id: "TM-002", 
    name: "PB Jaya Raya", 
    origin: "Jakarta", 
    logo: "/logos/jayaraya.png",
    manager: "Imelda Wiguna",
    status: "VERIFIED", 
    tier: "PRO", 
    performance: 92,
    athletes: 18,
    officials: 4,
    rank: 2,
    contact: "0812-xxxx-xxxx"
  },
  { 
    id: "TM-003", 
    name: "SGS PLN", 
    origin: "Bandung", 
    logo: "/logos/sgs.png",
    manager: "Taufik Hidayat",
    status: "PENDING", 
    tier: "AMATEUR", 
    performance: 75,
    athletes: 12,
    officials: 3,
    rank: 5,
    contact: "0857-xxxx-xxxx"
  },
  { 
    id: "TM-004", 
    name: "Exist Jakarta", 
    origin: "Jakarta", 
    logo: "/logos/exist.png",
    manager: "Alvent Yulianto",
    status: "VERIFIED", 
    tier: "PRO", 
    performance: 88,
    athletes: 15,
    officials: 4,
    rank: 3,
    contact: "0813-xxxx-xxxx"
  },
];

const STATS = {
  totalTeams: 24,
  totalAthletes: 156,
  avgPerformance: "88%"
};

export default function TeamManagementPage() {
  const [selectedTeam, setSelectedTeam] = useState<typeof TEAMS[0] | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Helper Styles (Indigo Theme)
  const getStatusColor = (s: string) => {
    switch(s) {
        case 'VERIFIED': return "text-green-500 bg-green-500/10 border-green-500/20";
        case 'PENDING': return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20 animate-pulse";
        default: return "text-zinc-500 bg-zinc-500/10 border-zinc-500/20";
    }
  };

  const getTierBadge = (tier: string) => {
    switch(tier) {
        case 'PRO': return "bg-indigo-500/20 text-indigo-400 border-indigo-500/30";
        case 'AMATEUR': return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
        default: return "bg-zinc-800 text-zinc-400 border-zinc-700";
    }
  };

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
                Manajemen klub, kontingen, dan validasi atlet.
            </p>
        </div>

        <Button 
            onClick={() => setIsAddOpen(true)}
            className="h-14 rounded-full px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-transform active:scale-95"
        >
            <UserPlus className="mr-2 w-5 h-5"/> REGISTER TEAM
        </Button>
      </div>

      {/* --- STATS CARDS (BENTO STYLE) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
         <Card className="bg-zinc-900 border-zinc-800 rounded-[28px] p-1 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-[40px] group-hover:bg-indigo-500/20 transition-all"></div>
            <CardContent className="p-5 flex items-center gap-4 relative z-10">
                <div className="h-12 w-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-400">
                    <Shield className="w-6 h-6"/>
                </div>
                <div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Clubs</p>
                    <p className="text-3xl font-black text-white">{STATS.totalTeams}</p>
                </div>
            </CardContent>
         </Card>
         <Card className="bg-zinc-900 border-zinc-800 rounded-[28px] p-1 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-[40px] group-hover:bg-cyan-500/20 transition-all"></div>
            <CardContent className="p-5 flex items-center gap-4 relative z-10">
                <div className="h-12 w-12 rounded-2xl bg-cyan-900/20 flex items-center justify-center text-cyan-500">
                    <Users className="w-6 h-6"/>
                </div>
                <div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Athletes</p>
                    <p className="text-3xl font-black text-white">{STATS.totalAthletes}</p>
                </div>
            </CardContent>
         </Card>
         <Card className="bg-zinc-900 border-zinc-800 rounded-[28px] p-1 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full blur-[40px] group-hover:bg-yellow-500/20 transition-all"></div>
            <CardContent className="p-5 flex items-center gap-4 relative z-10">
                <div className="h-12 w-12 rounded-2xl bg-yellow-900/20 flex items-center justify-center text-yellow-500">
                    <Star className="w-6 h-6 fill-yellow-500"/>
                </div>
                <div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Avg Performance</p>
                    <p className="text-3xl font-black text-white">{STATS.avgPerformance}</p>
                </div>
            </CardContent>
         </Card>
      </div>

      {/* --- ROSTER GRID (IDENTICAL LAYOUT TO VOLUNTEER) --- */}
      <div className="flex-1 bg-zinc-900/50 border border-zinc-800/50 rounded-[40px] p-2 backdrop-blur-sm flex flex-col min-h-0">
        <Tabs defaultValue="all" className="w-full h-full flex flex-col">
            
            <div className="flex flex-col md:flex-row items-center justify-between px-4 py-4 gap-4 shrink-0">
                <TabsList className="bg-zinc-950 p-1 rounded-full h-14 border border-zinc-800 w-full md:w-auto">
                    <TabsTrigger value="all" className="rounded-full h-12 px-8 font-bold text-sm data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                        ALL CLUBS
                    </TabsTrigger>
                    <TabsTrigger value="pro" className="rounded-full h-12 px-8 font-bold text-sm data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
                        PRO TIER
                    </TabsTrigger>
                </TabsList>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
                    <Input 
                        placeholder="Search club..." 
                        className="h-12 bg-zinc-950 border-zinc-800 rounded-full pl-10 text-white focus:ring-indigo-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <TabsContent value="all" className="flex-1 overflow-hidden mt-0">
                <ScrollArea className="h-full px-4 pb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {TEAMS.map((team) => (
                            <div 
                                key={team.id} 
                                onClick={() => setSelectedTeam(team)}
                                className="group bg-zinc-900 border border-zinc-800 rounded-[32px] p-6 hover:border-indigo-500/50 transition-all cursor-pointer relative overflow-hidden"
                            >
                                {/* Performance Bar (Pengganti XP Bar) */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-800">
                                    <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500" style={{ width: `${team.performance}%` }}></div>
                                </div>

                                {/* Status & Rank */}
                                <div className="flex justify-between items-start mb-4 mt-2">
                                    <Badge variant="outline" className={cn("text-[9px] font-black uppercase border", getStatusColor(team.status))}>
                                        {team.status}
                                    </Badge>
                                    <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold">
                                        <Crown className="w-3 h-3 fill-yellow-500"/> #{team.rank}
                                    </div>
                                </div>

                                {/* Main Avatar (Center Portrait) */}
                                <div className="text-center mb-6">
                                    <Avatar className="w-20 h-20 mx-auto border-4 border-zinc-800 group-hover:border-indigo-500 transition-colors shadow-xl bg-white p-1">
                                        <AvatarImage src={team.logo} className="object-contain"/>
                                        <AvatarFallback className="bg-zinc-800 text-xl font-bold text-zinc-500">{team.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <h3 className="mt-3 text-lg font-black text-white leading-tight">{team.name}</h3>
                                    <p className="text-xs text-zinc-500 font-bold mt-1 flex items-center justify-center gap-1">
                                        <MapPin className="w-3 h-3"/> {team.origin}
                                    </p>
                                </div>

                                {/* Footer Badges */}
                                <div className="flex justify-center gap-2">
                                    <Badge variant="outline" className={cn("text-[10px] font-bold border", getTierBadge(team.tier))}>
                                        {team.tier} CLUB
                                    </Badge>
                                    <Badge variant="outline" className="text-[10px] font-bold border-zinc-700 text-zinc-400">
                                        {team.athletes} Athletes
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </TabsContent>
        </Tabs>
      </div>

      {/* --- DETAIL SHEET (LOCKER ROOM STYLE) --- */}
      <Sheet open={!!selectedTeam} onOpenChange={() => setSelectedTeam(null)}>
        <SheetContent className="w-full sm:max-w-md bg-zinc-950 border-l border-zinc-800 p-0 overflow-y-auto">
            {selectedTeam && (
                <div className="flex flex-col h-full">
                    
                    {/* Header: Cover Image */}
                    <div className="h-48 bg-gradient-to-b from-indigo-900/50 to-zinc-900 relative">
                        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-20 mix-blend-overlay"></div>
                        <div className="absolute -bottom-12 left-8">
                            <Avatar className="w-24 h-24 border-4 border-zinc-900 shadow-2xl bg-white p-1">
                                <AvatarImage src={selectedTeam.logo} className="object-contain" />
                                <AvatarFallback className="bg-zinc-800 text-2xl font-black text-zinc-500">{selectedTeam.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="absolute bottom-4 right-8">
                            <Badge className="bg-white text-black font-black hover:bg-zinc-200">{selectedTeam.id}</Badge>
                        </div>
                    </div>

                    <div className="pt-16 px-8 pb-8 space-y-8 flex-1">
                        
                        <div>
                            <h2 className="text-3xl font-black text-white uppercase leading-none mb-1">{selectedTeam.name}</h2>
                            <p className="text-indigo-500 font-bold text-sm tracking-widest uppercase">{selectedTeam.tier} CLUB</p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-zinc-900 p-3 rounded-2xl border border-zinc-800 text-center">
                                <p className="text-[10px] text-zinc-500 uppercase font-bold">Rank</p>
                                <p className="text-xl font-black text-yellow-500 flex items-center justify-center gap-1">
                                    #{selectedTeam.rank}
                                </p>
                            </div>
                            <div className="bg-zinc-900 p-3 rounded-2xl border border-zinc-800 text-center">
                                <p className="text-[10px] text-zinc-500 uppercase font-bold">Athletes</p>
                                <p className="text-xl font-black text-white">{selectedTeam.athletes}</p>
                            </div>
                            <div className="bg-zinc-900 p-3 rounded-2xl border border-zinc-800 text-center">
                                <p className="text-[10px] text-zinc-500 uppercase font-bold">Official</p>
                                <p className="text-xl font-black text-white">{selectedTeam.officials}</p>
                            </div>
                        </div>

                        {/* Manager & Contact */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-indigo-500"/> Management
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
                                    <div>
                                        <p className="text-xs text-zinc-500 font-bold uppercase mb-1">Team Manager</p>
                                        <p className="font-bold text-white text-sm">{selectedTeam.manager}</p>
                                    </div>
                                    <Button size="sm" variant="ghost" className="h-8 rounded-full text-indigo-500 hover:text-indigo-400 hover:bg-indigo-500/10">Contact</Button>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-zinc-400"/>
                                        <span className="font-mono text-sm text-white">{selectedTeam.contact}</span>
                                    </div>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-zinc-400 hover:text-white"><MoreHorizontal className="w-4 h-4"/></Button>
                                </div>
                            </div>
                        </div>

                        {/* Performance Bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold text-zinc-500 uppercase">
                                <span>Club Performance</span>
                                <span>{selectedTeam.performance}% Win Rate</span>
                            </div>
                            <Progress value={selectedTeam.performance} className="h-3 bg-zinc-900" indicatorClassName="bg-gradient-to-r from-indigo-500 to-cyan-600" />
                        </div>

                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur-md grid grid-cols-2 gap-4">
                        <Button variant="outline" className="h-14 rounded-2xl border-zinc-700 text-zinc-300 hover:text-white font-bold hover:bg-zinc-800">
                            <Edit3 className="w-4 h-4 mr-2"/> EDIT PROFILE
                        </Button>
                        <Button className="h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-900/20">
                            MANAGE SQUAD
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
                    <Input placeholder="Contoh: PB Jaya Raya" className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl text-lg font-bold" />
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

                <Button className="w-full h-16 rounded-full font-black text-lg bg-indigo-600 hover:bg-indigo-700 text-white mt-4 shadow-xl shadow-indigo-900/20">
                    CREATE SQUAD
                </Button>
            </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}

    