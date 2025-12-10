
'use client';

import { useState } from "react";
import { 
  Heart, Users, Star, Award, 
  Search, Filter, Plus, Phone, 
  Shirt, CalendarCheck, MoreHorizontal, 
  UserPlus, Mail, Shield, Zap 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

// --- MOCK DATA ---
const VOLUNTEERS = [
  { 
    id: "VOL-001", 
    name: "Jessica Mila", 
    role: "Liaison Officer (LO)", 
    division: "MATCH_CONTROL", 
    status: "ON_DUTY", 
    rating: 4.8, 
    xp: 85, // Gamification
    shifts: 12,
    size: "M",
    phone: "0812-xxxx-xxxx",
    avatar: "https://github.com/shadcn.png"
  },
  { 
    id: "VOL-002", 
    name: "Dimas Anggara", 
    role: "Ball Crew", 
    division: "FIELD_OPS", 
    status: "IDLE", 
    rating: 4.5, 
    xp: 60,
    shifts: 8,
    size: "L",
    phone: "0813-xxxx-xxxx",
    avatar: ""
  },
  { 
    id: "VOL-003", 
    name: "Sarah Sechan", 
    role: "Usher / Ticketing", 
    division: "GATE", 
    status: "OFFLINE", 
    rating: 5.0, 
    xp: 95,
    shifts: 15,
    size: "S",
    phone: "0811-xxxx-xxxx",
    avatar: ""
  },
  { 
    id: "VOL-004", 
    name: "Riko Simanjuntak", 
    role: "Logistics Helper", 
    division: "LOGISTICS", 
    status: "ON_DUTY", 
    rating: 4.2, 
    xp: 40,
    shifts: 5,
    size: "XL",
    phone: "0857-xxxx-xxxx",
    avatar: ""
  },
];

const STATS = {
  total: 45,
  active: 28,
  avgRating: 4.7,
  recruitment: "OPEN"
};

export default function VolunteerPage() {
  const [selectedVol, setSelectedVol] = useState<typeof VOLUNTEERS[0] | null>(null);
  const [isRecruitOpen, setIsRecruitOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Helper Styles
  const getStatusColor = (s: string) => {
    switch(s) {
        case 'ON_DUTY': return "text-green-500 bg-green-500/10 border-green-500/20 animate-pulse";
        case 'IDLE': return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
        default: return "text-zinc-500 bg-zinc-500/10 border-zinc-500/20";
    }
  };

  const getDivisionBadge = (div: string) => {
    switch(div) {
        case 'MATCH_CONTROL': return "bg-red-500/20 text-red-400 border-red-500/30";
        case 'FIELD_OPS': return "bg-orange-500/20 text-orange-400 border-orange-500/30";
        case 'GATE': return "bg-violet-500/20 text-violet-400 border-violet-500/30";
        default: return "bg-zinc-800 text-zinc-400 border-zinc-700";
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-8 font-body pb-24 h-[calc(100vh-64px)] flex flex-col">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shrink-0">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="rounded-full px-3 py-1 border-rose-500 text-rose-500 bg-rose-500/10 backdrop-blur-md">
                    <Heart className="w-3 h-3 mr-2 fill-rose-500" /> HUMAN RESOURCES
                </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-black font-headline uppercase tracking-tighter text-white">
                Volunteer <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-600">Squad</span>
            </h1>
            <p className="text-zinc-400 mt-2 max-w-xl text-lg">
                Manajemen relawan, penugasan shift, dan performa tim.
            </p>
        </div>

        <Button 
            onClick={() => setIsRecruitOpen(true)}
            className="h-14 rounded-full px-8 bg-rose-600 hover:bg-rose-700 text-white font-black text-lg shadow-[0_0_20px_rgba(225,29,72,0.4)] transition-transform active:scale-95"
        >
            <UserPlus className="mr-2 w-5 h-5"/> RECRUIT NEW
        </Button>
      </div>

      {/* --- SQUAD STATS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
         <Card className="bg-zinc-900 border-zinc-800 rounded-[28px] p-1 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-[40px] group-hover:bg-rose-500/20 transition-all"></div>
            <CardContent className="p-5 flex items-center gap-4 relative z-10">
                <div className="h-12 w-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-400">
                    <Users className="w-6 h-6"/>
                </div>
                <div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Crew</p>
                    <p className="text-3xl font-black text-white">{STATS.total}</p>
                </div>
            </CardContent>
         </Card>
         <Card className="bg-zinc-900 border-zinc-800 rounded-[28px] p-1 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-[40px] group-hover:bg-green-500/20 transition-all"></div>
            <CardContent className="p-5 flex items-center gap-4 relative z-10">
                <div className="h-12 w-12 rounded-2xl bg-green-900/20 flex items-center justify-center text-green-500">
                    <Zap className="w-6 h-6"/>
                </div>
                <div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active Now</p>
                    <p className="text-3xl font-black text-white">{STATS.active}</p>
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
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Avg Rating</p>
                    <p className="text-3xl font-black text-white">{STATS.avgRating}</p>
                </div>
            </CardContent>
         </Card>
      </div>

      {/* --- ROSTER GRID --- */}
      <div className="flex-1 bg-zinc-900/50 border border-zinc-800/50 rounded-[40px] p-2 backdrop-blur-sm flex flex-col min-h-0">
        <Tabs defaultValue="roster" className="w-full h-full flex flex-col">
            
            <div className="flex flex-col md:flex-row items-center justify-between px-4 py-4 gap-4 shrink-0">
                <TabsList className="bg-zinc-950 p-1 rounded-full h-14 border border-zinc-800 w-full md:w-auto">
                    <TabsTrigger value="roster" className="rounded-full h-12 px-8 font-bold text-sm data-[state=active]:bg-rose-600 data-[state=active]:text-white">
                        ALL SQUAD
                    </TabsTrigger>
                    <TabsTrigger value="schedule" className="rounded-full h-12 px-8 font-bold text-sm data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
                        SHIFT SCHEDULE
                    </TabsTrigger>
                </TabsList>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
                    <Input 
                        placeholder="Cari nama crew..." 
                        className="h-12 bg-zinc-950 border-zinc-800 rounded-full pl-10 text-white focus:ring-rose-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <TabsContent value="roster" className="flex-1 overflow-hidden mt-0">
                <ScrollArea className="h-full px-4 pb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {VOLUNTEERS.map((vol) => (
                            <div 
                                key={vol.id} 
                                onClick={() => setSelectedVol(vol)}
                                className="group bg-zinc-900 border border-zinc-800 rounded-[32px] p-6 hover:border-rose-500/50 transition-all cursor-pointer relative overflow-hidden"
                            >
                                {/* Gamification Level Bar */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-800">
                                    <div className="h-full bg-gradient-to-r from-rose-500 to-purple-500" style={{ width: `${vol.xp}%` }}></div>
                                </div>

                                <div className="flex justify-between items-start mb-4 mt-2">
                                    <Badge variant="outline" className={cn("text-[9px] font-black uppercase border", getStatusColor(vol.status))}>
                                        {vol.status.replace('_', ' ')}
                                    </Badge>
                                    <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold">
                                        <Star className="w-3 h-3 fill-yellow-500"/> {vol.rating}
                                    </div>
                                </div>

                                <div className="text-center mb-6">
                                    <Avatar className="w-20 h-20 mx-auto border-4 border-zinc-800 group-hover:border-rose-500 transition-colors shadow-xl">
                                        <AvatarImage src={vol.avatar} />
                                        <AvatarFallback className="bg-zinc-800 text-xl font-bold text-zinc-500">{vol.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <h3 className="mt-3 text-lg font-black text-white leading-tight">{vol.name}</h3>
                                    <p className="text-xs text-zinc-500 font-bold mt-1">{vol.role}</p>
                                </div>

                                <div className="flex justify-center gap-2">
                                    <Badge variant="outline" className={cn("text-[10px] font-bold border", getDivisionBadge(vol.division))}>
                                        {vol.division.replace('_', ' ')}
                                    </Badge>
                                    <Badge variant="outline" className="text-[10px] font-bold border-zinc-700 text-zinc-400">
                                        {vol.shifts} Shifts
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </TabsContent>

            <TabsContent value="schedule" className="flex-1 flex items-center justify-center text-zinc-500">
                <div className="text-center">
                    <CalendarCheck className="w-16 h-16 mx-auto mb-4 opacity-20"/>
                    <p className="font-bold uppercase tracking-widest text-sm">Schedule View Coming Soon</p>
                </div>
            </TabsContent>
        </Tabs>
      </div>

      {/* --- DETAIL SHEET (PLAYER CARD) --- */}
      <Sheet open={!!selectedVol} onOpenChange={() => setSelectedVol(null)}>
        <SheetContent className="w-full sm:max-w-md bg-zinc-950 border-l border-zinc-800 p-0 overflow-y-auto">
            {selectedVol && (
                <div className="flex flex-col h-full">
                    
                    {/* Header: Cover Image */}
                    <div className="h-48 bg-gradient-to-b from-rose-900/50 to-zinc-900 relative">
                        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-20 mix-blend-overlay"></div>
                        <div className="absolute -bottom-12 left-8">
                            <Avatar className="w-24 h-24 border-4 border-zinc-900 shadow-2xl">
                                <AvatarImage src={selectedVol.avatar} />
                                <AvatarFallback className="bg-zinc-800 text-2xl font-black text-zinc-500">{selectedVol.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="absolute bottom-4 right-8">
                            <Badge className="bg-white text-black font-black hover:bg-zinc-200">ID: {selectedVol.id}</Badge>
                        </div>
                    </div>

                    <div className="pt-16 px-8 pb-8 space-y-8 flex-1">
                        
                        <div>
                            <h2 className="text-3xl font-black text-white uppercase leading-none mb-1">{selectedVol.name}</h2>
                            <p className="text-rose-500 font-bold text-sm tracking-widest uppercase">{selectedVol.role}</p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-zinc-900 p-3 rounded-2xl border border-zinc-800 text-center">
                                <p className="text-[10px] text-zinc-500 uppercase font-bold">Rating</p>
                                <p className="text-xl font-black text-yellow-500 flex items-center justify-center gap-1">
                                    {selectedVol.rating} <Star className="w-3 h-3 fill-yellow-500"/>
                                </p>
                            </div>
                            <div className="bg-zinc-900 p-3 rounded-2xl border border-zinc-800 text-center">
                                <p className="text-[10px] text-zinc-500 uppercase font-bold">Shifts</p>
                                <p className="text-xl font-black text-white">{selectedVol.shifts}</p>
                            </div>
                            <div className="bg-zinc-900 p-3 rounded-2xl border border-zinc-800 text-center">
                                <p className="text-[10px] text-zinc-500 uppercase font-bold">Size</p>
                                <div className="flex items-center justify-center gap-1">
                                    <Shirt className="w-4 h-4 text-zinc-400"/>
                                    <p className="text-xl font-black text-white">{selectedVol.size}</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <Shield className="w-4 h-4 text-rose-500"/> Personal Data
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-zinc-400"/>
                                        <span className="font-mono text-sm text-white">{selectedVol.phone}</span>
                                    </div>
                                    <Button size="sm" variant="ghost" className="h-8 rounded-full text-rose-500 hover:text-rose-400">Call</Button>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-zinc-400"/>
                                        <span className="font-mono text-sm text-white">email@volunteer.com</span>
                                    </div>
                                    <Button size="sm" variant="ghost" className="h-8 rounded-full text-rose-500 hover:text-rose-400">Email</Button>
                                </div>
                            </div>
                        </div>

                        {/* Performance Bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold text-zinc-500 uppercase">
                                <span>Experience Level</span>
                                <span>{selectedVol.xp}% to Next Rank</span>
                            </div>
                            <Progress value={selectedVol.xp} className="h-3 bg-zinc-900" indicatorClassName="bg-gradient-to-r from-rose-500 to-purple-600" />
                        </div>

                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur-md grid grid-cols-2 gap-4">
                        <Button variant="outline" className="h-14 rounded-2xl border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 font-bold">
                            EDIT PROFILE
                        </Button>
                        <Button className="h-14 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-lg shadow-rose-900/20">
                            ASSIGN SHIFT
                        </Button>
                    </div>
                </div>
            )}
        </SheetContent>
      </Sheet>

      {/* --- RECRUIT MODAL --- */}
      <Dialog open={isRecruitOpen} onOpenChange={setIsRecruitOpen}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-white rounded-[40px] max-w-lg p-0 overflow-hidden shadow-2xl">
            <DialogHeader className="p-8 border-b border-zinc-800 bg-rose-950/20">
                <DialogTitle className="text-2xl font-black font-headline uppercase flex items-center gap-2 text-rose-500">
                    <UserPlus className="w-6 h-6"/> Recruit Crew
                </DialogTitle>
                <DialogDescription>Tambahkan volunteer baru ke database.</DialogDescription>
            </DialogHeader>
            
            <div className="p-8 space-y-6">
                
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Nama Lengkap</label>
                    <Input placeholder="Sesuai KTP" className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl text-lg font-bold" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Divisi Pilihan</label>
                        <Select>
                            <SelectTrigger className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl"><SelectValue placeholder="Pilih..." /></SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                <SelectItem value="MATCH">Match Control</SelectItem>
                                <SelectItem value="LOGISTICS">Logistics</SelectItem>
                                <SelectItem value="GATE">Gate / Security</SelectItem>
                                <SelectItem value="LO">Liaison Officer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Ukuran Kaos</label>
                        <Select>
                            <SelectTrigger className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl"><SelectValue placeholder="Size" /></SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                <SelectItem value="S">S</SelectItem>
                                <SelectItem value="M">M</SelectItem>
                                <SelectItem value="L">L</SelectItem>
                                <SelectItem value="XL">XL</SelectItem>
                                <SelectItem value="XXL">XXL</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Nomor WhatsApp</label>
                    <Input placeholder="08xx-xxxx-xxxx" className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl font-mono" />
                </div>

                <Button className="w-full h-16 rounded-full font-black text-lg bg-rose-600 hover:bg-rose-700 text-white mt-4 shadow-xl shadow-rose-900/20">
                    ADD TO SQUAD
                </Button>
            </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
