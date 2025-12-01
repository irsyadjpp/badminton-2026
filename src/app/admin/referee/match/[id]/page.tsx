'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Minus, Plus, RefreshCw, Save, Timer, 
  ArrowLeftRight, Trophy, AlertTriangle, Volume2 
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function MatchControlPage({ params }: { params: { id: string } }) {
  // State Score
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [setA, setSetA] = useState(0);
  const [setB, setSetB] = useState(0);
  
  // State Game
  const [server, setServer] = useState<'A' | 'B'>('A'); // Siapa yang servis
  const [gameSet, setGameSet] = useState(1); // Set ke-1, 2, atau 3
  const [shuttles, setShuttles] = useState(1); // Hitung kok
  
  // Timer Logic
  const [time, setTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => setTime((prev) => prev + 1), 1000);
    } else if (!isTimerRunning) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePoint = (team: 'A' | 'B', type: 'ADD' | 'MIN') => {
    if (type === 'ADD') {
        if (team === 'A') {
            setScoreA(s => s + 1);
            setServer('A');
        } else {
            setScoreB(s => s + 1);
            setServer('B');
        }
    } else {
        // Koreksi Skor (Undo)
        if (team === 'A' && scoreA > 0) setScoreA(s => s - 1);
        if (team === 'B' && scoreB > 0) setScoreB(s => s - 1);
    }
  };

  const finishSet = () => {
    if (scoreA > scoreB) setSetA(s => s + 1);
    else setSetB(s => s + 1);
    
    setGameSet(s => s + 1);
    setScoreA(0);
    setScoreB(0);
    setIsTimerRunning(false);
    setTime(0); // Reset timer untuk interval
    alert("Set Selesai! Waktu Interval 60 Detik dimulai.");
    setIsTimerRunning(true); // Auto start timer interval
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col">
      
      {/* HEADER INFO */}
      <div className="flex justify-between items-center mb-4 bg-zinc-900 p-3 rounded-lg">
        <div className="flex items-center gap-4">
             <div className="text-left">
                <div className="text-xs text-zinc-400">Pertandingan #{params.id}</div>
                <div className="font-bold text-lg">MD Intermediate</div>
             </div>
        </div>
        
        {/* TIMER & KOK */}
        <div className="flex items-center gap-3">
             <div className="bg-zinc-800 px-3 py-1 rounded flex items-center gap-2 border border-zinc-700">
                <span className="text-xs text-zinc-400">Kok:</span>
                <span className="font-mono font-bold">{shuttles}</span>
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setShuttles(s => s + 1)}><Plus className="w-3 h-3" /></Button>
             </div>
             <div 
                className={`font-mono text-2xl font-bold px-4 py-1 rounded cursor-pointer ${isTimerRunning ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}
                onClick={() => setIsTimerRunning(!isTimerRunning)}
             >
                {formatTime(time)}
             </div>
        </div>
      </div>

      {/* SCOREBOARD AREA */}
      <div className="flex-grow grid grid-cols-2 gap-4">
        
        {/* TIM A (KIRI) */}
        <div className={`relative rounded-2xl p-4 flex flex-col justify-between border-4 ${server === 'A' ? 'border-yellow-500 bg-zinc-800' : 'border-transparent bg-zinc-900'}`}>
            {server === 'A' && <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-0.5 text-xs font-bold rounded animate-pulse">SERVICE</div>}
            
            <div className="text-center mt-4">
                <h2 className="text-2xl md:text-3xl font-bold truncate text-zinc-300">PB Djarum KW</h2>
                <div className="text-yellow-500 font-black text-6xl mt-2">{setA}</div>
            </div>

            <div className="flex-grow flex items-center justify-center py-8">
                <div className="text-[150px] leading-none font-black font-mono select-none">
                    {scoreA}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                 <Button 
                    className="h-20 bg-zinc-700 hover:bg-zinc-600 text-zinc-400" 
                    onClick={() => handlePoint('A', 'MIN')}
                 >
                    <Minus className="w-8 h-8" />
                 </Button>
                 <Button 
                    className="h-20 bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.5)]" 
                    onClick={() => handlePoint('A', 'ADD')}
                 >
                    <Plus className="w-10 h-10" />
                 </Button>
            </div>
        </div>

        {/* TIM B (KANAN) */}
        <div className={`relative rounded-2xl p-4 flex flex-col justify-between border-4 ${server === 'B' ? 'border-yellow-500 bg-zinc-800' : 'border-transparent bg-zinc-900'}`}>
            {server === 'B' && <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-0.5 text-xs font-bold rounded animate-pulse">SERVICE</div>}
            
            <div className="text-center mt-4">
                <h2 className="text-2xl md:text-3xl font-bold truncate text-zinc-300">PB Jaya Raya</h2>
                <div className="text-yellow-500 font-black text-6xl mt-2">{setB}</div>
            </div>

            <div className="flex-grow flex items-center justify-center py-8">
                <div className="text-[150px] leading-none font-black font-mono select-none">
                    {scoreB}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                 <Button 
                    className="h-20 bg-zinc-700 hover:bg-zinc-600 text-zinc-400" 
                    onClick={() => handlePoint('B', 'MIN')}
                 >
                    <Minus className="w-8 h-8" />
                 </Button>
                 <Button 
                    className="h-20 bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)]" 
                    onClick={() => handlePoint('B', 'ADD')}
                 >
                    <Plus className="w-10 h-10" />
                 </Button>
            </div>
        </div>
      </div>

      {/* CONTROL BAR (BAWAH) */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary" className="h-14 flex flex-col gap-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    <span className="text-xs">Hukuman/WO</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Kartu & Sanksi</DialogTitle></DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                    <Button className="bg-yellow-400 text-black hover:bg-yellow-500 h-16">Kartu Kuning (Peringatan)</Button>
                    <Button className="bg-red-600 hover:bg-red-700 h-16">Kartu Merah (Fault)</Button>
                    <Button className="bg-black text-white border border-zinc-700 h-16 col-span-2">Kartu Hitam (Diskualifikasi)</Button>
                </div>
            </DialogContent>
        </Dialog>

        <Button variant="secondary" className="h-14 flex flex-col gap-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700" onClick={() => {
             setServer(server === 'A' ? 'B' : 'A');
        }}>
            <ArrowLeftRight className="w-5 h-5" />
            <span className="text-xs">Pindah Service</span>
        </Button>
        
        <Button variant="secondary" className="h-14 flex flex-col gap-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700" onClick={() => {
             // Fitur tukar posisi lapangan (Swap UI Team A & B)
             alert("Tukar Tempat (Interval)");
        }}>
            <RefreshCw className="w-5 h-5" />
            <span className="text-xs">Pindah Tempat</span>
        </Button>

        <Button className="h-14 flex flex-col gap-1 bg-green-600 hover:bg-green-500" onClick={finishSet}>
            <Trophy className="w-5 h-5" />
            <span className="text-xs">Selesai Set {gameSet}</span>
        </Button>
      </div>

    </div>
  );
}
