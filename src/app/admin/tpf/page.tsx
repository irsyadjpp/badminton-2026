
'use client';

import { useState } from "react";
import { useRouter } from 'next/navigation'; // Import useRouter
import { 
  ShieldCheck, AlertOctagon, Eye, PlayCircle, 
  CheckCircle2, XCircle, Search, ScanLine, 
  History, Scale, User, FileWarning, ArrowRight 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// --- MOCK DATA ---
const VERIFICATION_QUEUE = [
  { 
    id: "P-1092", 
    name: "Aditya Pratama", 
    club: "PB Jaya Raya (Ex)", 
    registeredLevel: "BEGINNER", 
    detectedLevel: "INTERMEDIATE",
    riskScore: 85, // High probability sandbagging
    videoUrl: "/videos/mock-play.mp4",
    history: "Juara 2 Kejurkot 2019",
    status: "FLAGGED", 
    avatar: "https://github.com/shadcn.png"
  },
  { 
    id: "P-1093", 
    name: "Siti Nurhaliza", 
    club: "PB Djarum", 
    registeredLevel: "ADVANCE", 
    detectedLevel: "ADVANCE",
    riskScore: 10, 
    videoUrl: "",
    history: "Terdaftar SI PBSI ID: 001239",
    status: "PENDING", 
    avatar: ""
  },
  { 
    id: "P-1094", 
    name: "Budi Santoso", 
    club: "Komunitas RW", 
    registeredLevel: "BEGINNER", 
    detectedLevel: "BEGINNER",
    riskScore: 5, 
    videoUrl: "",
    history: "Tidak ada rekam jejak turnamen resmi.",
    status: "PENDING", 
    avatar: ""
  },
];

export default function TPFVerificationPage() {
  const router = useRouter(); // Initialize router
  const [selectedPlayer, setSelectedPlayer] = useState<typeof VERIFICATION_QUEUE[0] | null>(null);
  
  // Helper for Risk Visual
  const getRiskColor = (score: number) => {
    if (score >= 70) return "text-red-500 bg-red-500/10 border-red-500/20";
    if (score >= 40) return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
    return "text-green-500 bg-green-500/10 border-green-500/20";
  };

  return (
    <div className="space-y-8 p-4 md:p-8 font-body pb-24 h-[calc(100vh-64px)] flex flex-col">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shrink-0">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="rounded-full px-3 py-1 border-cyan-500 text-cyan-500 bg-cyan-500/10 backdrop-blur-md animate-pulse">
                    <ScanLine className="w-3 h-3 mr-2" /> INTEGRITY SCANNER
                </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-black font-headline uppercase tracking-tighter text-white">
                Player <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Verification</span>
            </h1>
            <p className="text-zinc-400 mt-2 max-w-xl text-lg">
                Audit skill, cek rekam jejak, dan cegah manipulasi level (Sandbagging).
            </p>
        </div>

        <div className="flex gap-4">
            <div className="bg-zinc-900 px-6 py-3 rounded-[24px] border border-zinc-800 flex flex-col items-center">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Pending</span>
                <span className="text-2xl font-black text-white">45</span>
            </div>
            <div className="bg-zinc-900 px-6 py-3 rounded-[24px] border border-zinc-800 flex flex-col items-center">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Flagged</span>
                <span className="text-2xl font-black text-red-500">3</span>
            </div>
        </div>
      </div>

      {/* --- MAIN WORKSPACE --- */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
         
         {/* LEFT: QUEUE LIST (1/3) */}
         <Card className="lg:col-span-1 bg-zinc-900 border-zinc-800 rounded-[32px] flex flex-col overflow-hidden h-full shadow-2xl">
            <div className="p-6 pb-4 bg-zinc-950/50 border-b border-zinc-800">
                <div className="relative">
                    <Search className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
                    <input 
                        type="text" 
                        placeholder="Cari nama / ID..." 
                        className="w-full bg-zinc-900 text-white font-bold placeholder:text-zinc-600 pl-10 pr-4 h-12 rounded-xl border border-zinc-800 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                </div>
            </div>
            
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                    {VERIFICATION_QUEUE.map((player) => (
                        <div 
                            key={player.id} 
                            onClick={() => setSelectedPlayer(player)}
                            className={cn(
                                "group relative p-4 rounded-[24px] border-2 transition-all cursor-pointer hover:bg-zinc-800",
                                selectedPlayer?.id === player.id ? "bg-zinc-800 border-cyan-500/50" : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                            )}
                        >
                            {player.riskScore >= 70 && (
                                <div className="absolute top-4 right-4 animate-pulse">
                                    <AlertOctagon className="w-5 h-5 text-red-500" />
                                </div>
                            )}

                            <div className="flex items-center gap-4">
                                <Avatar className="h-14 w-14 border-2 border-zinc-700">
                                    <AvatarImage src={player.avatar} />
                                    <AvatarFallback className="bg-zinc-900 font-black text-zinc-500">{player.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h4 className="font-bold text-white text-base group-hover:text-cyan-400 transition-colors">{player.name}</h4>
                                    <p className="text-xs text-zinc-500 font-medium mb-2">{player.club}</p>
                                    <Badge variant="secondary" className="bg-zinc-900 text-zinc-300 border-zinc-700 text-[10px]">
                                        REQ: {player.registeredLevel}
                                    </Badge>
                                </div>
                            </div>
                            
                            {/* Risk Meter Mini */}
                            <div className="mt-4 flex items-center gap-2">
                                <div className="h-1.5 flex-1 bg-zinc-900 rounded-full overflow-hidden">
                                    <div 
                                        className={cn("h-full rounded-full", player.riskScore >= 70 ? "bg-red-500" : "bg-cyan-500")} 
                                        style={{ width: `${player.riskScore}%` }}
                                    ></div>
                                </div>
                                <span className={cn("text-[10px] font-black", player.riskScore >= 70 ? "text-red-500" : "text-cyan-500")}>
                                    {player.riskScore}% Risk
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
         </Card>

         {/* RIGHT: INSPECTION CONSOLE (2/3) */}
         <div className="lg:col-span-2 h-full">
            {selectedPlayer ? (
                <Card className="bg-zinc-950 border-zinc-800 rounded-[32px] h-full flex flex-col overflow-hidden shadow-2xl relative">
                    
                    {/* Background Grid */}
                    <div className="absolute inset-0 bg-[url('/images/grid-pattern.png')] opacity-5 pointer-events-none"></div>

                    {/* Console Header */}
                    <div className="p-8 border-b border-zinc-800 flex justify-between items-start bg-zinc-900/30">
                        <div className="flex items-center gap-6">
                            <Avatar className="h-24 w-24 border-4 border-zinc-800 shadow-xl">
                                <AvatarImage src={selectedPlayer.avatar} />
                                <AvatarFallback className="bg-zinc-900 text-2xl font-black text-zinc-600">{selectedPlayer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h2 className="text-3xl font-black text-white uppercase tracking-tight">{selectedPlayer.name}</h2>
                                    <Badge className={cn("text-[10px] font-bold px-2 py-0.5", getRiskColor(selectedPlayer.riskScore))}>
                                        RISK LEVEL: {selectedPlayer.riskScore >= 70 ? "HIGH" : "LOW"}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-zinc-400 font-medium">
                                    <span className="flex items-center gap-1"><User className="w-4 h-4"/> ID: {selectedPlayer.id}</span>
                                    <span className="w-1 h-1 bg-zinc-600 rounded-full"></span>
                                    <span>{selectedPlayer.club}</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Comparison Badge */}
                        <div className="text-right bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
                            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Level Gap</p>
                            <div className="flex items-center gap-3">
                                <span className="text-lg font-bold text-zinc-400 line-through decoration-red-500">{selectedPlayer.registeredLevel}</span>
                                <ArrowRight className="w-4 h-4 text-zinc-600"/>
                                <span className="text-xl font-black text-cyan-400">{selectedPlayer.detectedLevel}</span>
                            </div>
                        </div>
                    </div>

                    <ScrollArea className="flex-1">
                        <div className="p-8 space-y-8">
                            
                            {/* 1. VIDEO EVIDENCE */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                    <PlayCircle className="w-4 h-4 text-cyan-500"/> Video Gameplay Analysis
                                </h3>
                                <div className="aspect-video bg-black rounded-[24px] border border-zinc-800 flex items-center justify-center relative group overflow-hidden">
                                    {/* Mock Video Player UI */}
                                    <div className="absolute inset-0 bg-[url('/images/court-bg.jpg')] bg-cover opacity-30"></div>
                                    <Button className="h-16 w-16 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 relative z-10 text-white transition-transform group-hover:scale-110">
                                        <PlayCircle className="w-8 h-8"/>
                                    </Button>
                                    <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur rounded-xl p-3 flex justify-between items-center text-xs font-mono text-cyan-400 border border-cyan-500/20">
                                        <span>Frame: 1042/Stroke</span>
                                        <span>Footwork Speed: 24km/h (Adv)</span>
                                    </div>
                                </div>
                            </div>

                            {/* 2. HISTORY & FINDINGS */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                        <History className="w-4 h-4 text-cyan-500"/> Historical Data
                                    </h3>
                                    <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 text-sm text-zinc-300 leading-relaxed">
                                        "{selectedPlayer.history}"
                                        <br/><br/>
                                        <span className="text-xs text-zinc-500 italic">*Data disinkronisasi dari SI PBSI & Turnamen Komunitas Bandung.</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                        <Scale className="w-4 h-4 text-cyan-500"/> TPF Finding
                                    </h3>
                                    <div className="p-4 bg-red-950/10 rounded-2xl border border-red-900/20">
                                        <ul className="space-y-2">
                                            <li className="flex gap-2 text-sm text-red-200">
                                                <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5"/>
                                                Teknik smash & backhand clear menunjukkan level Advanced.
                                            </li>
                                            <li className="flex gap-2 text-sm text-red-200">
                                                <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5"/>
                                                Terdeteksi bermain di Final Djarum Sirnas 2020.
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </ScrollArea>

                    {/* FOOTER ACTIONS (Sticky) */}
                    <div className="p-6 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur-md flex justify-end gap-4">
                        <Button variant="outline" className="h-14 rounded-full border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 px-8 font-bold">
                            Request More Info
                        </Button>
                        <Button className="h-14 rounded-full bg-red-600 hover:bg-red-700 text-white px-8 font-bold shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                            <FileWarning className="w-5 h-5 mr-2"/> FLAG AS FRAUD (DOWNGRADE)
                        </Button>
                        <Button className="h-14 rounded-full bg-green-600 hover:bg-green-700 text-white px-8 font-bold shadow-[0_0_20px_rgba(22,163,74,0.4)]">
                            <CheckCircle2 className="w-5 h-5 mr-2"/> APPROVE LEVEL
                        </Button>
                    </div>

                </Card>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-zinc-600 bg-zinc-900/50 rounded-[32px] border border-zinc-800 border-dashed">
                    <ScanLine className="w-20 h-20 mb-4 opacity-20 animate-pulse"/>
                    <p className="font-bold uppercase tracking-widest text-lg">Select Player to Analyze</p>
                </div>
            )}
         </div>

      </div>
    </div>
  );
}
