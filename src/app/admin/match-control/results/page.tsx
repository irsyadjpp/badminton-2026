
'use client';

import { useState } from "react";
import { 
  FileCheck, FileWarning, CheckCircle2, XCircle, 
  Search, Filter, Eye, Gavel, UserCheck, 
  Calendar, Clock, ShieldAlert, Award,
  Minus, Plus, Receipt 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// --- MOCK DATA ---
const RESULTS = [
  { 
    id: "RES-101", 
    matchId: "M-MD-04", 
    category: "MD OPEN",
    court: "Court 1",
    time: "10:30 WIB",
    umpire: "Budi Santoso (INA)",
    winner: "A",
    pA: "Kevin / Marcus",
    pB: "Ahsan / Hendra",
    scores: [
      { set: 1, sA: 21, sB: 19 },
      { set: 2, sA: 18, sB: 21 },
      { set: 3, sA: 21, sB: 15 },
    ],
    duration: "58m",
    status: "PENDING", // PENDING, VERIFIED, DISPUTE
    notes: "-"
  },
  { 
    id: "RES-102", 
    matchId: "M-MS-12", 
    category: "MS PRO",
    court: "Court 3",
    time: "11:15 WIB",
    umpire: "Siti Aminah (INA)",
    winner: "B",
    pA: "Ginting",
    pB: "Christie",
    scores: [
      { set: 1, sA: 15, sB: 21 },
      { set: 2, sA: 12, sB: 21 },
    ],
    duration: "40m",
    status: "VERIFIED",
    notes: "Pertandingan berjalan lancar."
  },
  { 
    id: "RES-103", 
    matchId: "M-XD-08", 
    category: "XD OPEN",
    court: "Court 2",
    time: "09:00 WIB",
    umpire: "Agus (INA)",
    winner: "A",
    pA: "Rehan / Lisa",
    pB: "Rinov / Pitha",
    scores: [
      { set: 1, sA: 21, sB: 10 },
      { set: 2, sA: 21, sB: 11 },
    ],
    duration: "30m",
    status: "DISPUTE",
    notes: "Protes manajer Tim B terkait keputusan hakim garis di poin kritis."
  },
];

export default function ResultVerificationPage() {
  const [selectedResult, setSelectedResult] = useState<typeof RESULTS[0] | null>(null);
  const [activeTab, setActiveTab] = useState("PENDING");
  const [shuttlecockCount, setShuttlecockCount] = useState(3); // Default 3 (misal)
  
  // LOGIC HITUNG BIAYA (Simulation)
  const calculateCost = (category: string, count: number) => {
    const isBeginner = category.includes("BEGINNER") || category.includes("PEMULA");
    const quota = isBeginner ? 1 : 3;
    const pricePerPcs = 28000;
    
    if (count <= quota) return 0;
    return (count - quota) * pricePerPcs;
  };

  const currentFine = selectedResult ? calculateCost(selectedResult.category, shuttlecockCount) : 0;


  const filteredResults = activeTab === 'ALL' 
    ? RESULTS 
    : RESULTS.filter(r => r.status === activeTab);

  return (
    <div className="space-y-8 p-4 md:p-8 font-body pb-24">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="rounded-full px-3 py-1 border-blue-500 text-blue-500 bg-blue-500/10 backdrop-blur-md">
                    <FileCheck className="w-3 h-3 mr-2" /> OFFICIAL SCORE SHEET
                </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-headline uppercase tracking-tighter text-white">
                Result <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">Verification</span>
            </h1>
            <p className="text-zinc-400 mt-2 max-w-xl text-lg">
                Validasi Berita Acara (Score Sheet) dari wasit sebelum publikasi resmi.
            </p>
        </div>

        {/* SUMMARY STATS */}
        <div className="flex gap-4">
            <Card className="bg-zinc-900 border-zinc-800 rounded-[24px] p-4 flex items-center gap-4">
                <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500">
                    <Clock className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase">Pending</p>
                    <p className="text-2xl font-black text-white">12</p>
                </div>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800 rounded-[24px] p-4 flex items-center gap-4">
                <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                    <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase">Dispute</p>
                    <p className="text-2xl font-black text-white">2</p>
                </div>
            </Card>
        </div>
      </div>

      {/* --- FILTER & LIST --- */}
      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-[40px] p-2 backdrop-blur-sm">
        <Tabs defaultValue="PENDING" className="w-full" onValueChange={setActiveTab}>
            
            <div className="flex flex-col md:flex-row items-center justify-between px-4 py-4 gap-4">
                <TabsList className="bg-zinc-950 p-1 rounded-full h-14 border border-zinc-800 w-full md:w-auto">
                    <TabsTrigger value="PENDING" className="rounded-full h-12 px-6 font-bold text-xs data-[state=active]:bg-yellow-600 data-[state=active]:text-white">PENDING</TabsTrigger>
                    <TabsTrigger value="VERIFIED" className="rounded-full h-12 px-6 font-bold text-xs data-[state=active]:bg-green-600 data-[state=active]:text-white">VERIFIED</TabsTrigger>
                    <TabsTrigger value="DISPUTE" className="rounded-full h-12 px-6 font-bold text-xs data-[state=active]:bg-red-600 data-[state=active]:text-white">DISPUTE</TabsTrigger>
                    <TabsTrigger value="ALL" className="rounded-full h-12 px-6 font-bold text-xs data-[state=active]:bg-zinc-800 data-[state=active]:text-white">ALL</TabsTrigger>
                </TabsList>

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
                    <Input placeholder="Match ID / Player..." className="h-12 bg-zinc-950 border-zinc-800 rounded-full pl-10 text-white focus-visible:ring-1 focus-visible:ring-blue-500" />
                </div>
            </div>

            <div className="px-2 pb-2">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
                    {filteredResults.map((res) => (
                        <div 
                            key={res.id} 
                            onClick={() => setSelectedResult(res)}
                            className="group relative bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-[32px] p-6 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-2xl overflow-hidden"
                        >
                            {/* Match Header */}
                            <div className="flex justify-between items-center mb-6">
                                <Badge variant="outline" className="border-zinc-700 text-zinc-400 font-mono bg-zinc-950">
                                    {res.matchId}
                                </Badge>
                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider bg-zinc-950 px-2 py-1 rounded">
                                    {res.category}
                                </span>
                            </div>

                            {/* Score Display */}
                            <div className="flex items-center justify-between gap-4">
                                {/* Player A */}
                                <div className={cn("flex-1 p-3 rounded-2xl border transition-colors", res.winner === 'A' ? "bg-blue-500/10 border-blue-500/30" : "bg-zinc-950 border-zinc-800")}>
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="font-bold text-white text-sm truncate">{res.pA}</p>
                                        {res.winner === 'A' && <Award className="w-4 h-4 text-blue-500 fill-blue-500" />}
                                    </div>
                                    <div className="flex gap-1 justify-end">
                                        {res.scores.map((s, i) => (
                                            <span key={i} className={cn("font-mono text-lg font-black w-8 text-center", s.sA > s.sB ? "text-white" : "text-zinc-600")}>
                                                {s.sA}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="text-xs font-black text-zinc-600">VS</div>

                                {/* Player B */}
                                <div className={cn("flex-1 p-3 rounded-2xl border transition-colors", res.winner === 'B' ? "bg-blue-500/10 border-blue-500/30" : "bg-zinc-950 border-zinc-800")}>
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="font-bold text-white text-sm truncate">{res.pB}</p>
                                        {res.winner === 'B' && <Award className="w-4 h-4 text-blue-500 fill-blue-500" />}
                                    </div>
                                    <div className="flex gap-1 justify-end">
                                        {res.scores.map((s, i) => (
                                            <span key={i} className={cn("font-mono text-lg font-black w-8 text-center", s.sB > s.sA ? "text-white" : "text-zinc-600")}>
                                                {s.sB}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Avatar className="w-6 h-6 border border-zinc-700">
                                        <AvatarFallback className="text-[9px] bg-zinc-800 text-zinc-400">UM</AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs text-zinc-500 font-medium">{res.umpire}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {res.status === 'PENDING' && <span className="flex h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></span>}
                                    <span className={cn("text-[10px] font-black uppercase tracking-wider", 
                                        res.status === 'VERIFIED' ? "text-green-500" : 
                                        res.status === 'DISPUTE' ? "text-red-500" : "text-yellow-500"
                                    )}>
                                        {res.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Tabs>
      </div>

      {/* --- DETAIL SHEET (VERDICT CHAMBER) --- */}
      <Sheet open={!!selectedResult} onOpenChange={() => setSelectedResult(null)}>
        <SheetContent className="w-full sm:max-w-lg bg-zinc-950 border-l border-zinc-800 p-0 overflow-y-auto">
            {selectedResult && (
                <div className="flex flex-col h-full">
                    
                    {/* Header: Result Summary */}
                    <div className="bg-zinc-900 border-b border-zinc-800 p-8 pb-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]"></div>
                        <div className="relative z-10 text-center">
                            <Badge className="mb-4 bg-zinc-800 text-zinc-400 hover:bg-zinc-800 font-mono">
                                MATCH ID: {selectedResult.matchId}
                            </Badge>
                            <h2 className="text-4xl font-black text-white uppercase tracking-tight mb-2">
                                Winner: {selectedResult.winner === 'A' ? selectedResult.pA : selectedResult.pB}
                            </h2>
                            <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest">
                                Duration: {selectedResult.duration}
                            </p>
                        </div>
                    </div>

                    <div className="flex-1 p-8 space-y-8">
                        
                        {/* SCORECARD TABLE */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-black text-zinc-500 uppercase font-bold text-[10px]">
                                    <tr>
                                        <th className="px-4 py-3">Player / Team</th>
                                        <th className="px-4 py-3 text-center">Set 1</th>
                                        <th className="px-4 py-3 text-center">Set 2</th>
                                        <th className="px-4 py-3 text-center">Set 3</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800 text-white font-mono">
                                    <tr className={selectedResult.winner === 'A' ? "bg-blue-500/5" : ""}>
                                        <td className="px-4 py-4 font-sans font-bold flex items-center gap-2">
                                            {selectedResult.winner === 'A' && <CheckCircle2 className="w-4 h-4 text-blue-500"/>}
                                            {selectedResult.pA}
                                        </td>
                                        {selectedResult.scores.map((s, i) => (
                                            <td key={i} className="px-4 py-4 text-center font-bold text-lg">
                                                {s.sA}
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className={selectedResult.winner === 'B' ? "bg-blue-500/5" : ""}>
                                        <td className="px-4 py-4 font-sans font-bold flex items-center gap-2">
                                            {selectedResult.winner === 'B' && <CheckCircle2 className="w-4 h-4 text-blue-500"/>}
                                            {selectedResult.pB}
                                        </td>
                                        {selectedResult.scores.map((s, i) => (
                                            <td key={i} className="px-4 py-4 text-center font-bold text-lg">
                                                {s.sB}
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* SIGNATURE & META */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
                                <p className="text-[10px] text-zinc-500 uppercase font-bold mb-2">Umpire Sign</p>
                                <div className="h-12 flex items-center gap-2">
                                    <UserCheck className="w-5 h-5 text-green-500"/>
                                    <span className="font-script text-xl text-white ml-2 italic opacity-80">Signed</span>
                                </div>
                                <p className="text-xs font-bold text-white mt-1">{selectedResult.umpire}</p>
                            </div>
                            <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
                                <p className="text-[10px] text-zinc-500 uppercase font-bold mb-2">Referee Sign</p>
                                <div className="h-12 flex items-center text-zinc-600 text-xs italic border-b border-dashed border-zinc-700">
                                    Pending Approval...
                                </div>
                            </div>
                        </div>

                        {/* NOTES */}
                        {selectedResult.status === 'DISPUTE' && (
                            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl">
                                <h4 className="text-red-500 text-xs font-black uppercase flex items-center gap-2 mb-2">
                                    <Gavel className="w-4 h-4"/> Dispute Notes
                                </h4>
                                <p className="text-red-200 text-sm leading-relaxed">
                                    {selectedResult.notes}
                                </p>
                            </div>
                        )}

                    </div>

                    {/* --- MODIFIKASI: BAGIAN LOGISTIK & APPROVAL --- */}
                    {selectedResult.status === 'PENDING' && (
                        <div className="border-t border-zinc-800 bg-zinc-900/80 backdrop-blur-md sticky bottom-0">
                            
                            {/* 1. INPUT SHUTTLECOCK */}
                            <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/50">
                                <div>
                                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Shuttlecock Used</p>
                                    <p className="text-[10px] text-zinc-600">Quota: {selectedResult.category.includes('PEMULA') ? '1 (Beginner)' : '3 (Pro)'}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center bg-zinc-900 rounded-lg border border-zinc-800">
                                        <Button 
                                            variant="ghost" size="icon" className="h-10 w-10 text-zinc-400 hover:text-white"
                                            onClick={() => setShuttlecockCount(Math.max(1, shuttlecockCount - 1))}
                                        >
                                            <Minus className="w-4 h-4"/>
                                        </Button>
                                        <span className="w-8 text-center font-mono font-bold text-white">{shuttlecockCount}</span>
                                        <Button 
                                            variant="ghost" size="icon" className="h-10 w-10 text-zinc-400 hover:text-white"
                                            onClick={() => setShuttlecockCount(shuttlecockCount + 1)}
                                        >
                                            <Plus className="w-4 h-4"/>
                                        </Button>
                                    </div>
                                    
                                    {/* Indikator Biaya Tambahan */}
                                    {currentFine > 0 && (
                                        <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 rounded-lg border border-red-500/20 text-red-500 animate-pulse">
                                            <Receipt className="w-4 h-4"/>
                                            <div className="text-right">
                                                <p className="text-[9px] font-bold uppercase">Overlimit Charge</p>
                                                <p className="font-mono font-black text-sm">Rp {currentFine.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 2. TOMBOL AKSI */}
                            <div className="p-6 grid grid-cols-2 gap-4">
                                <Button variant="outline" className="h-14 rounded-2xl border-red-900/50 text-red-500 hover:bg-red-950 font-bold hover:text-white">
                                    RAISE DISPUTE
                                </Button>
                                <Button 
                                    className="h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-900/20 text-lg"
                                    onClick={() => {
                                        // Panggil Server Action submitScore disini dengan data shuttlecockCount
                                        alert(`Score Verified! Tagihan Kok: Rp ${currentFine}`);
                                    }}
                                >
                                    VERIFY & BILL <CheckCircle2 className="ml-2 w-5 h-5"/>
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </SheetContent>
      </Sheet>

    </div>
  );
}
