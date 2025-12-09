'use client';

import { useState, useEffect } from "react";
import { 
  Activity, Users, Clock, AlertTriangle, 
  Mic2, PauseCircle, PlayCircle, Siren, 
  Trophy, CheckCircle2, MoreHorizontal, Radio 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// --- MOCK DATA: COURTS STATUS ---
const COURTS = [
  { id: 1, status: "LIVE", pA: "Kevin / Marcus", pB: "Ahsan / Hendra", sA: 18, sB: 16, set: 3, time: "45:12", category: "MD OPEN" },
  { id: 2, status: "WARMUP", pA: "Ginting", pB: "Christie", sA: 0, sB: 0, set: 1, time: "01:30", category: "MS PRO" },
  { id: 3, status: "LIVE", pA: "Apri / Fadia", pB: "Matsuyama / Shida", sA: 21, sB: 19, set: 2, time: "22:10", category: "WD OPEN" },
  { id: 4, status: "IDLE", pA: "-", pB: "-", sA: 0, sB: 0, set: 0, time: "00:00", category: "-" },
  { id: 5, status: "LIVE", pA: "Fajar / Rian", pB: "Leo / Daniel", sA: 11, sB: 4, set: 1, time: "08:45", category: "MD OPEN" },
  { id: 6, status: "CLEANING", pA: "-", pB: "-", sA: 0, sB: 0, set: 0, time: "00:00", category: "MOP REQUEST" },
];

const LIVE_LOGS = [
  { time: "14:02", msg: "Court 2: Pertandingan dimulai.", type: "INFO" },
  { time: "14:00", msg: "Gate 1: Antrian penonton memanjang.", type: "WARN" },
  { time: "13:58", msg: "Medical: Cedera ringan di Court 3 tertangani.", type: "SUCCESS" },
  { time: "13:55", msg: "Match Control: Jadwal Court 4 delay 10 menit.", type: "ERROR" },
];

export default function LiveMonitorPage() {
  const [currentTime, setCurrentTime] = useState("");

  // Realtime Clock
  useEffect(() => {
    const timer = setInterval(() => {
        setCurrentTime(new Date().toLocaleTimeString('id-ID', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6 p-4 md:p-6 font-body pb-24 h-screen flex flex-col">
      
      {/* --- HEADER: BROADCAST STYLE --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-6 rounded-[32px] shrink-0 shadow-2xl">
        <div className="flex items-center gap-6">
            {/* LIVE INDICATOR */}
            <div className="relative">
                <div className="w-4 h-4 bg-red-600 rounded-full animate-ping absolute top-0 right-0"></div>
                <div className="bg-red-600 text-white font-black px-4 py-2 rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                    <Radio className="w-5 h-5 animate-pulse" /> ON AIR
                </div>
            </div>
            
            <div>
                <h1 className="text-3xl font-black font-headline uppercase tracking-tighter text-white">
                    Live <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Monitor</span>
                </h1>
                <div className="flex items-center gap-3 text-zinc-400 text-sm font-bold tracking-wide">
                    <span>DAY 2: ELIMINATION ROUND</span>
                    <span className="w-1 h-1 bg-zinc-600 rounded-full"></span>
                    <span className="text-white font-mono">{currentTime} WIB</span>
                </div>
            </div>
        </div>

        {/* QUICK STATS (Top Right) */}
        <div className="flex gap-4 mt-4 md:mt-0">
            <div className="text-right">
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Active Matches</p>
                <p className="text-2xl font-black text-white font-mono">4<span className="text-zinc-600">/6</span></p>
            </div>
            <div className="h-10 w-[1px] bg-zinc-800"></div>
            <div className="text-right">
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Crowd</p>
                <p className="text-2xl font-black text-green-500 font-mono">1.2k</p>
            </div>
        </div>
      </div>

      {/* --- MAIN CONTENT: COURT GRID & FEED --- */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
         
         {/* LEFT: COURTS GRID (3/4 Width) */}
         <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto pr-2 scrollbar-none">
            {COURTS.map((court) => (
                <Card key={court.id} className={cn(
                    "relative overflow-hidden rounded-[32px] border-2 transition-all group hover:-translate-y-1 hover:shadow-2xl",
                    court.status === 'LIVE' ? "bg-zinc-900 border-green-500/30" : 
                    court.status === 'WARMUP' ? "bg-zinc-900 border-yellow-500/30" : 
                    "bg-zinc-950 border-zinc-800 opacity-70"
                )}>
                    {/* Status Badge Absolute */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-zinc-700 to-transparent opacity-20"></div>
                    
                    <CardContent className="p-6">
                        {/* Court Header */}
                        <div className="flex justify-between items-center mb-6">
                            <Badge variant="outline" className="font-black text-lg border-zinc-700 text-zinc-300 bg-zinc-950 px-4 py-1 rounded-lg">
                                C-{court.id}
                            </Badge>
                            
                            <div className="flex items-center gap-2">
                                {court.status === 'LIVE' && <span className="flex h-3 w-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></span>}
                                <span className={cn(
                                    "text-xs font-black uppercase tracking-widest",
                                    court.status === 'LIVE' ? "text-green-500" : 
                                    court.status === 'WARMUP' ? "text-yellow-500" : "text-zinc-500"
                                )}>
                                    {court.status}
                                </span>
                            </div>
                        </div>

                        {/* Players & Scores */}
                        {court.status !== 'IDLE' && court.status !== 'CLEANING' ? (
                            <div className="space-y-4">
                                {/* Player A */}
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                                        <span className="font-bold text-white text-lg truncate max-w-[120px]">{court.pA}</span>
                                    </div>
                                    <span className="text-4xl font-black font-mono text-white">{court.sA}</span>
                                </div>

                                {/* Player B */}
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1 h-8 bg-red-500 rounded-full"></div>
                                        <span className="font-bold text-white text-lg truncate max-w-[120px]">{court.pB}</span>
                                    </div>
                                    <span className="text-4xl font-black font-mono text-zinc-500">{court.sB}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="h-[88px] flex flex-col items-center justify-center text-zinc-600 gap-2 border-2 border-dashed border-zinc-800 rounded-2xl bg-zinc-950/50">
                                {court.status === 'CLEANING' ? <Users className="w-6 h-6 animate-bounce"/> : <PauseCircle className="w-8 h-8"/>}
                                <span className="text-xs font-bold uppercase">{court.status === 'CLEANING' ? 'Cleaning in Progress' : 'No Match Scheduled'}</span>
                            </div>
                        )}

                        {/* Footer Info */}
                        <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-between items-center">
                            <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 bg-zinc-950 px-3 py-1.5 rounded-full">
                                <Trophy className="w-3 h-3" /> {court.category}
                            </div>
                            <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-300">
                                <Clock className="w-3 h-3 text-primary" /> {court.time}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
         </div>

         {/* RIGHT: LIVE FEED & ACTIONS (1/4 Width) */}
         <div className="flex flex-col gap-6 h-full overflow-hidden">
            
            {/* 1. INCIDENT LOG (Scrollable) */}
            <Card className="bg-zinc-900 border-zinc-800 rounded-[32px] flex-1 flex flex-col overflow-hidden">
                <CardHeader className="p-6 pb-2 bg-zinc-950/30">
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-primary" /> Incident Log
                    </CardTitle>
                </CardHeader>
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-3">
                        {LIVE_LOGS.map((log, i) => (
                            <div key={i} className="flex gap-3 items-start p-3 rounded-2xl bg-zinc-950 border border-zinc-800/50">
                                <div className="mt-1">
                                    {log.type === 'INFO' && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                                    {log.type === 'WARN' && <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>}
                                    {log.type === 'ERROR' && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>}
                                    {log.type === 'SUCCESS' && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
                                </div>
                                <div>
                                    <p className="text-xs font-mono text-zinc-500 mb-1">{log.time}</p>
                                    <p className="text-xs font-medium text-zinc-300 leading-relaxed">{log.msg}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </Card>

            {/* 2. EMERGENCY CONTROL (Sticky Bottom) */}
            <Card className="bg-red-950/20 border-red-900/30 rounded-[32px] shrink-0">
                <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-red-500/20 rounded-xl text-red-500 animate-pulse">
                            <Siren className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-black text-red-500 uppercase text-sm tracking-widest">Emergency</h3>
                            <p className="text-xs text-red-400/60">Hanya untuk kondisi darurat.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="border-red-900/50 text-red-500 hover:bg-red-950 h-12 rounded-xl text-xs font-bold">
                            <Mic2 className="w-4 h-4 mr-2"/> ANNOUNCE
                        </Button>
                        <Button className="bg-red-600 hover:bg-red-700 text-white h-12 rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(220,38,38,0.4)]">
                            PAUSE ALL
                        </Button>
                    </div>
                </CardContent>
            </Card>

         </div>

      </div>
    </div>
  );
}
    