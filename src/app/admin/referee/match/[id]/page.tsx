'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Minus, Plus, RefreshCw, MonitorPlay, 
  ArrowLeftRight, AlertTriangle, MapPin
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

type MatchMode = 'GROUP' | 'KNOCKOUT';

export default function MatchControlPage() {
  const params = useParams();
  const { toast } = useToast();

  // --- CONFIGURATION ---
  const [mode, setMode] = useState<MatchMode>('GROUP');
  
  // --- GAME STATE ---
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [setA, setSetA] = useState(0);
  const [setB, setSetB] = useState(0);
  const [gameSet, setGameSet] = useState(1);
  const [server, setServer] = useState<'A' | 'B'>('A'); 
  const [isFinished, setIsFinished] = useState(false);
  
  // --- HISTORY & LOGISTICS ---
  const [history, setHistory] = useState<{a: number, b: number, server: 'A'|'B'}[]>([]);
  const [shuttles, setShuttles] = useState(1);
  
  // --- TIMER ---
  const [time, setTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => setTime((prev) => prev + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- LOGIKA POSISI SERVIS (Genap=Kanan, Ganjil=Kiri) ---
  const getServicePosition = (score: number) => {
      return score % 2 === 0 ? "KANAN (Genap)" : "KIRI (Ganjil)";
  };

  // --- CORE SCORING LOGIC ---
  const checkGameStatus = (newA: number, newB: number) => {
    let message = "";
    
    if (mode === 'GROUP') {
        if (newA === 15 && newB < 15) message = "INTERVAL: PINDAH TEMPAT (SKOR 15)";
        else if (newB === 15 && newA < 15) message = "INTERVAL: PINDAH TEMPAT (SKOR 15)";
        
        if (newA === 29 && newB === 29) message = "SUDDEN DEATH: Next Point Wins!";
        else if (newA === 29 && newB < 29) message = "MATCH POINT TIM A";
        else if (newB === 29 && newA < 29) message = "MATCH POINT TIM B";

        if (newA === 30 || newB === 30) {
            setIsFinished(true);
            setIsTimerRunning(false);
            return `GAME SELESAI! Pemenang: ${newA === 30 ? 'TIM A' : 'TIM B'}`;
        }
    } 
    else if (mode === 'KNOCKOUT') {
        const maxScore = 20;
        const winPoint = 15;
        
        if (gameSet === 3) {
            if ((newA === 8 && newB < 8) || (newB === 8 && newA < 8)) {
                message = "INTERVAL RUBBER GAME: PINDAH TEMPAT (SKOR 8)";
                setIsTimerRunning(false);
            }
        }

        const isDeuce = newA >= 14 && newB >= 14;
        
        if (isDeuce) {
            if (Math.abs(newA - newB) >= 2) return handleSetWin(newA > newB ? 'A' : 'B');
            if (newA === maxScore || newB === maxScore) return handleSetWin(newA === maxScore ? 'A' : 'B');
            message = "SETTING / JUS";
        } else {
            if (newA >= winPoint) return handleSetWin('A');
            if (newB >= winPoint) return handleSetWin('B');
            if (newA === winPoint - 1) message = "GAME POINT A";
            if (newB === winPoint - 1) message = "GAME POINT B";
        }
    }
    return message;
  };

  const handleSetWin = (winner: 'A' | 'B') => {
      if (winner === 'A') {
          const newSetScore = setA + 1;
          setSetA(newSetScore);
          if (newSetScore === 2) { setIsFinished(true); setIsTimerRunning(false); return "MATCH WON BY TIM A!"; }
      } else {
          const newSetScore = setB + 1;
          setSetB(newSetScore);
          if (newSetScore === 2) { setIsFinished(true); setIsTimerRunning(false); return "MATCH WON BY TIM B!"; }
      }

      setTimeout(() => {
          if (confirm(`Set ${gameSet} Selesai. Pemenang: Tim ${winner}. Lanjut Set ${gameSet + 1}?`)) {
              setGameSet(g => g + 1);
              setScoreA(0); setScoreB(0); setHistory([]); setTime(0); setIsTimerRunning(true);
          }
      }, 500);
      
      return `SET ${gameSet} WON BY ${winner}`;
  };

  const handlePoint = (team: 'A' | 'B', type: 'ADD' | 'MIN') => {
    if (isFinished) return;

    if (type === 'ADD') {
        setHistory([...history, { a: scoreA, b: scoreB, server }]);
        const newA = team === 'A' ? scoreA + 1 : scoreA;
        const newB = team === 'B' ? scoreB + 1 : scoreB;

        setScoreA(newA);
        setScoreB(newB);
        setServer(team); // Pemenang reli menjadi server

        const statusMsg = checkGameStatus(newA, newB);
        if (statusMsg) {
            toast({
                title: "Status Pertandingan",
                description: statusMsg,
                className: statusMsg.includes("WON") || statusMsg.includes("SELESAI") ? "bg-green-600 text-white" : "bg-yellow-500 text-black",
                duration: 3000
            });
        }
    } else {
        if (history.length > 0) {
            const lastState = history[history.length - 1];
            setScoreA(lastState.a);
            setScoreB(lastState.b);
            setServer(lastState.server);
            setHistory(history.slice(0, -1));
        }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-2 md:p-4 flex flex-col font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 bg-zinc-900 p-3 rounded-lg gap-4 border border-zinc-800">
        <div className="text-left w-full md:w-auto">
            <div className="text-xs text-zinc-500 font-mono">MATCH ID: {params.id}</div>
            <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-primary">MD Intermediate</span>
                <Badge variant="outline" className="border-zinc-600 text-zinc-300 text-[10px]">
                    {mode === 'GROUP' ? '1x30' : '3x15'}
                </Badge>
            </div>
        </div>

        <div className="flex items-center gap-2">
             {scoreA === 0 && scoreB === 0 && gameSet === 1 && (
                 <Select value={mode} onValueChange={(val: MatchMode) => setMode(val)}>
                    <SelectTrigger className="w-[100px] bg-zinc-800 border-zinc-700 h-9 text-xs">
                        <SelectValue placeholder="Mode" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="GROUP">Grup</SelectItem>
                        <SelectItem value="KNOCKOUT">Gugur</SelectItem>
                    </SelectContent>
                 </Select>
             )}
             
             <div className="flex items-center gap-3 bg-zinc-950 px-3 py-1.5 rounded-md border border-zinc-800">
                <div className="text-center">
                    <div className="text-[10px] text-zinc-500 uppercase">Kok</div>
                    <div className="font-mono font-bold text-sm flex items-center gap-1">
                        {shuttles}
                        <button onClick={() => setShuttles(s => s+1)} className="text-green-500 hover:text-green-400 ml-1">+</button>
                    </div>
                </div>
                <div className="w-px h-6 bg-zinc-800"></div>
                <div className="text-center cursor-pointer" onClick={() => setIsTimerRunning(!isTimerRunning)}>
                    <div className="text-[10px] text-zinc-500 uppercase">Waktu</div>
                    <div className={`font-mono font-bold text-lg leading-none ${isTimerRunning ? 'text-green-400' : 'text-red-400'}`}>
                        {formatTime(time)}
                    </div>
                </div>
             </div>
        </div>
      </div>

      {/* SCOREBOARD */}
      <div className="flex-grow grid grid-cols-2 gap-2 md:gap-6">
        
        {/* TIM A (KIRI) */}
        <div className={`relative rounded-2xl p-3 md:p-6 flex flex-col justify-between border-4 transition-all duration-300 ${server === 'A' ? 'border-yellow-500 bg-zinc-800 shadow-[0_0_30px_rgba(234,179,8,0.15)]' : 'border-transparent bg-zinc-900 opacity-80'}`}>
            
            {/* INDIKATOR SERVIS */}
            {server === 'A' && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-6 py-1 text-sm font-black rounded-full shadow-lg animate-pulse z-10 whitespace-nowrap flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    SERVIS: {getServicePosition(scoreA)}
                </div>
            )}
            
            <div className="mt-4 text-center md:text-left">
                <h2 className="text-xl md:text-4xl font-black truncate text-white leading-tight">PB Djarum</h2>
                {mode === 'KNOCKOUT' && <div className="text-yellow-500 font-black text-2xl md:text-5xl mt-2">SET {setA}</div>}
            </div>

            <div className="flex-grow flex flex-col items-center justify-center py-4">
                <div className="text-[100px] md:text-[220px] leading-none font-black font-mono select-none tracking-tighter text-white">
                    {scoreA}
                </div>
                {/* Posisi Visual */}
                <div className="flex gap-8 mt-4 text-zinc-600 font-mono text-sm md:text-lg">
                    <span className={scoreA % 2 !== 0 ? "text-white font-bold" : ""}>KIRI</span>
                    <span className={scoreA % 2 === 0 ? "text-white font-bold" : ""}>KANAN</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-auto">
                 <Button className="h-16 md:h-24 bg-zinc-800 hover:bg-zinc-700 border-2 border-zinc-700 rounded-xl" onClick={() => handlePoint('A', 'MIN')} disabled={isFinished}>
                    <Minus className="w-8 h-8 text-zinc-500" />
                 </Button>
                 <Button className="h-16 md:h-24 bg-blue-600 hover:bg-blue-500 text-white shadow-[0_5px_0_rgb(29,78,216)] active:translate-y-1 active:shadow-none rounded-xl" onClick={() => handlePoint('A', 'ADD')} disabled={isFinished}>
                    <Plus className="w-12 h-12" />
                 </Button>
            </div>
        </div>

        {/* TIM B (KANAN) */}
        <div className={`relative rounded-2xl p-3 md:p-6 flex flex-col justify-between border-4 transition-all duration-300 ${server === 'B' ? 'border-yellow-500 bg-zinc-800 shadow-[0_0_30px_rgba(234,179,8,0.15)]' : 'border-transparent bg-zinc-900 opacity-80'}`}>
            
            {/* INDIKATOR SERVIS */}
            {server === 'B' && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-6 py-1 text-sm font-black rounded-full shadow-lg animate-pulse z-10 whitespace-nowrap flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    SERVIS: {getServicePosition(scoreB)}
                </div>
            )}
            
            <div className="mt-4 text-center md:text-right">
                <h2 className="text-xl md:text-4xl font-black truncate text-white leading-tight">PB Jaya</h2>
                {mode === 'KNOCKOUT' && <div className="text-yellow-500 font-black text-2xl md:text-5xl mt-2">SET {setB}</div>}
            </div>

            <div className="flex-grow flex flex-col items-center justify-center py-4">
                <div className="text-[100px] md:text-[220px] leading-none font-black font-mono select-none tracking-tighter text-white">
                    {scoreB}
                </div>
                {/* Posisi Visual */}
                <div className="flex gap-8 mt-4 text-zinc-600 font-mono text-sm md:text-lg">
                    <span className={scoreB % 2 !== 0 ? "text-white font-bold" : ""}>KIRI</span>
                    <span className={scoreB % 2 === 0 ? "text-white font-bold" : ""}>KANAN</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-auto">
                 <Button className="h-16 md:h-24 bg-zinc-800 hover:bg-zinc-700 border-2 border-zinc-700 rounded-xl" onClick={() => handlePoint('B', 'MIN')} disabled={isFinished}>
                    <Minus className="w-8 h-8 text-zinc-500" />
                 </Button>
                 <Button className="h-16 md:h-24 bg-red-600 hover:bg-red-500 text-white shadow-[0_5px_0_rgb(185,28,28)] active:translate-y-1 active:shadow-none rounded-xl" onClick={() => handlePoint('B', 'ADD')} disabled={isFinished}>
                    <Plus className="w-12 h-12" />
                 </Button>
            </div>
        </div>
      </div>

      {/* CONTROL BAR */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary" className="h-14 flex flex-col gap-1 bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase">Sanksi</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                <DialogHeader><DialogTitle>Kartu & Hukuman</DialogTitle></DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                    <Button className="bg-yellow-500 text-black hover:bg-yellow-400 h-16 font-bold">KARTU KUNING</Button>
                    <Button className="bg-red-600 text-white hover:bg-red-500 h-16 font-bold">KARTU MERAH (+1)</Button>
                    <Button className="bg-black border border-zinc-600 h-14 col-span-2 font-bold">KARTU HITAM (WO)</Button>
                </div>
            </DialogContent>
        </Dialog>

        <Button variant="secondary" className="h-14 flex flex-col gap-1 bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white" onClick={() => setServer(server === 'A' ? 'B' : 'A')}>
            <ArrowLeftRight className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase">Pindah Bola</span>
        </Button>
        
        <Button variant="secondary" className="h-14 flex flex-col gap-1 bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white" onClick={() => {
             const tempScore = scoreA; setScoreA(scoreB); setScoreB(tempScore);
             const tempSet = setA; setSetA(setB); setSetB(tempSet);
             setServer(server === 'A' ? 'B' : 'A');
             toast({ title: "Posisi Ditukar", description: "Skor dan posisi lapangan telah ditukar." });
        }}>
            <RefreshCw className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase">Pindah Tempat</span>
        </Button>

        {isFinished ? (
             <Button className="h-14 flex flex-col gap-1 bg-green-600 hover:bg-green-500" onClick={() => window.location.href = '/admin/referee'}>
                <MonitorPlay className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase">Selesai</span>
             </Button>
        ) : (
             <div className="h-14 flex flex-col items-center justify-center bg-zinc-950 rounded border border-zinc-800 text-zinc-500 text-[10px] font-bold uppercase">
                 <span>SET {gameSet}</span>
                 <span className="text-green-500 animate-pulse">LIVE</span>
             </div>
        )}
      </div>

    </div>
  );
}