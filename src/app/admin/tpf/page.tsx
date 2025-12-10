
'use client';

import { useState } from "react";
import { useRouter } from 'next/navigation'; // Import useRouter
import { 
  ShieldCheck, AlertOctagon, Eye, PlayCircle, 
  CheckCircle2, XCircle, Search, ScanLine, 
  History, Scale, User, FileWarning, ArrowRight,
  Shield, Users, Mail, Phone, MoreHorizontal, Briefcase, Gavel, MonitorPlay, ClipboardCheck, QrCode, Stethoscope, Package, Box, Database, Utensils, Gift, Upload, Layers, Timer, Navigation, BarChart3, Megaphone, FileSignature, Award, Tags, UserCog, Handshake, Newspaper, Settings, LogOut, CheckSquare, ListChecks, StickyNote, PieChart, Wallet, Coins, Receipt, CalendarRange, Target, CalendarDays, FileText, Plus, Filter, MapPin, Gauge, Radio, CarFront, Fuel, LifeBuoy, MessageSquare, PenTool, Send
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
      
      {/* HEADER (Sama seperti sebelumnya) */}
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
      
      {/* --- CONTENT --- */}
      <Tabs defaultValue="CASES" className="flex-1 flex flex-col min-h-0">
        
        <div className="px-1 mb-4">
            <TabsList className="bg-zinc-900 border border-zinc-800 p-1 rounded-full">
                <TabsTrigger value="CASES" className="rounded-full px-6 data-[state=active]:bg-zinc-800">Protest Cases</TabsTrigger>
                <TabsTrigger value="VERIFICATION" className="rounded-full px-6 data-[state=active]:bg-cyan-600 data-[state=active]:text-white">Mass Verification (Pre-Event)</TabsTrigger>
            </TabsList>
        </div>

        {/* TAB 1: EXISTING FEATURE (Yang sudah Anda buat) */}
        <TabsContent value="CASES" className="flex-1 flex flex-col min-h-0 mt-0">
           <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
               {/* --- LEFT: QUEUE LIST (1/3) --- */}
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
                 <div className="lg:col-span-2 h-full">
                    {/* ... (Kode Card Right / Inspection Console lama) ... */}
                </div>
           </div>
        </TabsContent>

        {/* TAB 2: FITUR BARU - MASS VERIFICATION */}
        <TabsContent value="VERIFICATION" className="flex-1 mt-0">
            <Card className="bg-zinc-950 border-zinc-800 h-full flex flex-col">
                <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                    <h3 className="font-bold text-zinc-400 uppercase tracking-widest text-sm">Participant Database (1,920 Total)</h3>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-zinc-700">Filter: Unverified</Button>
                        <Button size="sm" variant="outline" className="border-zinc-700">Filter: High Risk</Button>
                    </div>
                </div>
                <ScrollArea className="flex-1">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-zinc-900 text-zinc-500 uppercase font-bold text-[10px] sticky top-0 z-10">
                            <tr>
                                <th className="p-4">Player Name</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Digital Footprint</th>
                                <th className="p-4">Risk Score</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {/* MOCK ROWS */}
                            {[1,2,3,4,5].map((i) => (
                                <tr key={i} className="hover:bg-zinc-900/50 transition-colors">
                                    <td className="p-4 font-bold text-white">
                                        Atlet Simulasi {i}
                                        <div className="text-[10px] text-zinc-500 font-normal">PB Djarum • ID: P-10{i}</div>
                                    </td>
                                    <td className="p-4 text-zinc-300">Ganda Dewasa Pemula</td>
                                    <td className="p-4 flex gap-2">
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-pink-500 bg-pink-500/10 hover:bg-pink-500 hover:text-white rounded-lg">
                                            <span className="sr-only">IG</span>📷
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white rounded-lg">
                                            <span className="sr-only">YT</span>▶️
                                        </Button>
                                    </td>
                                    <td className="p-4">
                                        <Badge className={i === 1 ? "bg-red-500/20 text-red-500" : "bg-green-500/20 text-green-500"}>
                                            {i === 1 ? "95% (HIGH)" : "12% (LOW)"}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <Button size="sm" variant="destructive" className="h-8">Reject</Button>
                                        <Button size="sm" className="h-8 bg-green-600 hover:bg-green-700 text-white">Verify</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </ScrollArea>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

