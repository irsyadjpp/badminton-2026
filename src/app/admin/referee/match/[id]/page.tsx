'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Minus, Plus, RefreshCw, MonitorPlay, 
  ArrowLeftRight, AlertTriangle, MapPin, Gavel, Coins
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

type MatchMode = 'GROUP' | 'KNOCKOUT';
type MatchStatus = 'PRE_MATCH' | 'IN_PROGRESS' | 'FINISHED';

export default function MatchControlPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const matchId = params.id;

  // --- MOCK DATA ---
  const matchData = {
    id: matchId,
    category: "MD Intermediate",
    teamA: "PB Djarum",
    playersA: "Kevin Sanjaya / Marcus Gideon",
    teamB: "PB Jaya Raya",
    playersB: "Hendra Setiawan / M. Ahsan",
  };

  // --- CONFIGURATION ---
  const [mode, setMode] = useState<MatchMode>('GROUP');
  const [status, setStatus] = useState<MatchStatus>('PRE_MATCH'); // Status Global Pertandingan
  
  // --- GAME STATE ---
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [setA, setSetA] = useState(0);
  const [setB, setSetB] = useState(0);
  const [gameSet, setGameSet] = useState(1);
  const [server, setServer] = useState<'A' | 'B' | null>(null); // Null saat Pre-Match
  
  // Posisi Pemain [Kanan, Kiri]
  const [posA, setPosA] = useState([0, 1]); 
  const [posB, setPosB] = useState([0, 1]);

  // --- COIN TOSS STATE ---
  const [tossWinner, setTossWinner] = useState<'A' | 'B'>('A');
  const [tossChoice, setTossChoice] = useState<'SERVE' | 'RECEIVE' | 'SIDE'>('SERVE');

  // --- HISTORY & CARDS ---
  const [history, setHistory] = useState<any[]>([]);
  const [cards, setCards] = useState<{team: string, type: string, score: string}[]>([]);
  
  // --- UTILS ---
  const [shuttles, setShuttles] = useState(0);
  const [time, setTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isTimerRunning) interval = setInterval(() => setTime((prev) => prev + 1), 1000);
    else clearInterval(interval);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- LOGIC 1: COIN TOSS (BWF STYLE) ---
  const handleStartMatch = () => {
    // Terapkan hasil Toss
    if (tossChoice === 'SERVE') {
        setServer(tossWinner);
    } else if (tossChoice === 'RECEIVE') {
        setServer(tossWinner === 'A' ? 'B' : 'A');
    } else {
        // Jika pilih SIDE (Lapangan), server ditentukan acak atau manual nanti. 
        // Untuk simplifikasi sistem, kita defaultkan pemenang tos jadi server jika pilih side, atau tambah logic.
        setServer(tossWinner); 
        toast({ title: "Pindah Tempat", description: `Tim ${tossWinner === 'A' ? 'A' : 'B'} memilih sisi lapangan.` });
    }
    
    setStatus('IN_PROGRESS');
    setIsTimerRunning(true);
    toast({ title: "Pertandingan Dimulai!", className: "bg-green-600 text-white" });
  };

  // --- LOGIC 2: SCORING RULES (GROUP vs KNOCKOUT) ---
  const checkGameStatus = (newA: number, newB: number) => {
    let msg = "";
    
    if (mode === 'GROUP') {
        // ATURAN PENYISIHAN (1 x 30 Poin)
        // Pindah tempat saat salah satu mencapai 15
        if ((newA === 15 && newB < 15) || (newB === 15 && newA < 15)) {
             msg = "INTERVAL: PINDAH TEMPAT (SKOR 15)";
             setIsTimerRunning(false);
        }
        // Sudden Death di 29-29 (Max 30)
        if (newA === 29 && newB === 29) msg = "SUDDEN DEATH: Poin Selanjutnya Menang!";
        else if (newA >= 30 || newB >= 30) return handleGameWin(newA > newB ? 'A' : 'B');
    } 
    else {
        // ATURAN GUGUR (3 x 15 Poin, Setting Max 20)
        const maxScore = 20;
        const winPoint = 15;
        
        // Interval Rubber Game (Set 3) di Poin 8
        if (gameSet === 3) {
             if ((newA === 8 && newB < 8) || (newB === 8 && newA < 8)) {
                 msg = "INTERVAL RUBBER: PINDAH TEMPAT (SKOR 8)";
                 setIsTimerRunning(false);
             }
        }

        const isDeuce = newA >= (winPoint - 1) && newB >= (winPoint - 1);
        if (isDeuce) {
            if (Math.abs(newA - newB) >= 2) return handleSetWin(newA > newB ? 'A' : 'B');
            if (newA === maxScore || newB === maxScore) return handleSetWin(newA === maxScore ? 'A' : 'B');
            msg = "SETTING / JUS";
        } else {
            if (newA >= winPoint) return handleSetWin('A');
            if (newB >= winPoint) return handleSetWin('B');
            if (newA === winPoint - 1 || newB === winPoint - 1) msg = "GAME POINT";
        }
    }
    return msg;
  };

  const handleSetWin = (winner: 'A' | 'B') => {
      setIsTimerRunning(false);
      if (winner === 'A') {
          const newSet = setA + 1;
          setSetA(newSet);
          if (newSet === 2) return handleMatchEnd('A');
      } else {
          const newSet = setB + 1;
          setSetB(newSet);
          if (newSet === 2) return handleMatchEnd('B');
      }

      setTimeout(() => {
          if (confirm(`Set ${gameSet} Selesai. Pemenang: Tim ${winner}. Lanjut Set Berikutnya?`)) {
              setGameSet(g => g + 1);
              setScoreA(0); setScoreB(0); 
              setTime(0); setIsTimerRunning(true);
          }
      }, 500);
      return `SET ${gameSet} WON BY ${winner}`;
  };

  const handleGameWin = (winner: 'A' | 'B') => {
      // Khusus Group Stage (1 Game langsung selesai)
      setSetA(winner === 'A' ? 1 : 0);
      setSetB(winner === 'B' ? 1 : 0);
      return handleMatchEnd(winner);
  }

  const handleMatchEnd = (winner: 'A' | 'B') => {
      setStatus('FINISHED');
      setIsTimerRunning(false);
      return `PERTANDINGAN SELESAI. PEMENANG: TIM ${winner}`;
  }

  // --- LOGIC 3: KARTU & SANKSI ---
  const handleCard = (team: 'A' | 'B', type: 'YELLOW' | 'RED' | 'BLACK') => {
      const teamName = team === 'A' ? matchData.teamA : matchData.teamB;
      const currentScore = `${scoreA}-${scoreB}`;
      
      // Catat Log
      setCards(prev => [...prev, { team: teamName, type, score: currentScore }]);
      
      if (type === 'YELLOW') {
          toast({ title: "PERINGATAN (Kartu Kuning)", description: `Diberikan kepada ${teamName}`, className: "bg-yellow-500 text-black" });
      } 
      else if (type === 'RED') {
          toast({ title: "FAULT (Kartu Merah)", description: `Poin untuk lawan.`, className: "bg-red-600 text-white" });
          // Kartu Merah = Poin buat lawan
          handlePoint(team === 'A' ? 'B' : 'A', 'ADD'); 
      } 
      else if (type === 'BLACK') {
          if (confirm(`Yakin memberikan KARTU HITAM (Diskualifikasi) kepada ${teamName}?`)) {
              setStatus('FINISHED');
              setIsTimerRunning(false);
              toast({ title: "DISKUALIFIKASI", description: `${teamName} didiskualifikasi.`, variant: "destructive" });
          }
      }
  };

  // --- LOGIC POINT (Sama seperti sebelumnya dengan tambahan validasi) ---
  const handlePoint = (team: 'A' | 'B', type: 'ADD' | 'MIN') => {
    if (status !== 'IN_PROGRESS') return;

    if (type === 'ADD') {
        setHistory([...history, { scoreA, scoreB, server, posA: [...posA], posB: [...posB] }]);
        
        // Rotasi Pemain
        if (team === server) {
             if (team === 'A') setPosA(prev => [prev[1], prev[0]]);
             else setPosB(prev => [prev[1], prev[0]]);
        } else {
            setServer(team);
        }

        const newA = team === 'A' ? scoreA + 1 : scoreA;
        const newB = team === 'B' ? scoreB + 1 : scoreB;
        setScoreA(newA); setScoreB(newB);

        const msg = checkGameStatus(newA, newB);
        if (msg) toast({ title: msg, className: "bg-blue-600 text-white" });

    } else {
        // UNDO
        if (history.length > 0) {
            const last = history[history.length - 1];
            setScoreA(last.scoreA); setScoreB(last.scoreB); 
            setServer(last.server); setPosA(last.posA); setPosB(last.posB);
            setHistory(history.slice(0, -1));
        }
    }
  };

  // --- RENDER: COIN TOSS SCREEN ---
  if (status === 'PRE_MATCH') {
      return (
          <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
              <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-white space-y-6 shadow-2xl">
                  <div className="text-center border-b border-zinc-800 pb-4">
                      <Coins className="w-12 h-12 text-yellow-500 mx-auto mb-2 animate-bounce" />
                      <h1 className="text-2xl font-black font-headline">COIN TOSS</h1>
                      <p className="text-zinc-400 text-sm">Persiapan Pertandingan</p>
                  </div>

                  <div className="space-y-4">
                      <div>
                          <Label className="text-zinc-400 mb-2 block">Mode Pertandingan</Label>
                          <Select value={mode} onValueChange={(v: MatchMode) => setMode(v)}>
                              <SelectTrigger className="w-full bg-zinc-800 border-zinc-700"><SelectValue/></SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="GROUP">PENYISIHAN (1x30)</SelectItem>
                                  <SelectItem value="KNOCKOUT">PEREMPAT FINAL+ (3x15)</SelectItem>
                              </SelectContent>
                          </Select>
                      </div>

                      <div className="space-y-3">
                          <Label className="text-zinc-400">Pemenang Undian (Tos)</Label>
                          <RadioGroup value={tossWinner} onValueChange={(v: 'A'|'B') => setTossWinner(v)} className="grid grid-cols-2 gap-4">
                              <div className={`border rounded-lg p-3 cursor-pointer flex items-center justify-center gap-2 ${tossWinner === 'A' ? 'bg-primary/20 border-primary' : 'border-zinc-700'}`}>
                                  <RadioGroupItem value="A" id="winnerA" />
                                  <Label htmlFor="winnerA" className="font-bold cursor-pointer">TIM A</Label>
                              </div>
                              <div className={`border rounded-lg p-3 cursor-pointer flex items-center justify-center gap-2 ${tossWinner === 'B' ? 'bg-primary/20 border-primary' : 'border-zinc-700'}`}>
                                  <RadioGroupItem value="B" id="winnerB" />
                                  <Label htmlFor="winnerB" className="font-bold cursor-pointer">TIM B</Label>
                              </div>
                          </RadioGroup>
                      </div>

                      <div className="space-y-3">
                          <Label className="text-zinc-400">Pemenang Memilih</Label>
                          <RadioGroup value={tossChoice} onValueChange={(v: any) => setTossChoice(v)} className="grid grid-cols-3 gap-2">
                              {['SERVE', 'RECEIVE', 'SIDE'].map((choice) => (
                                  <div key={choice} className={`border rounded-lg p-2 cursor-pointer flex flex-col items-center justify-center text-center ${tossChoice === choice ? 'bg-green-900/30 border-green-600' : 'border-zinc-700'}`}>
                                      <RadioGroupItem value={choice} id={choice} className="sr-only" />
                                      <Label htmlFor={choice} className="font-bold text-xs cursor-pointer">{choice}</Label>
                                  </div>
                              ))}
                          </RadioGroup>
                      </div>
                  </div>

                  <Button className="w-full h-12 text-lg font-bold bg-green-600 hover:bg-green-500" onClick={handleStartMatch}>
                      MULAI PERTANDINGAN
                  </Button>
              </div>
          </div>
      );
  }

  // --- RENDER: MAIN SCOREBOARD ---
  return (
    <div className="min-h-screen bg-black text-white p-2 md:p-4 flex flex-col font-sans">
      {/* HEADER SAMA SEPERTI SEBELUMNYA */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 bg-zinc-900 p-3 rounded-lg gap-4 border border-zinc-800">
         <div className="text-left w-full md:w-auto">
             <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-[10px] border-zinc-600 text-zinc-400">MATCH #{matchId}</Badge>
                <Badge className="bg-blue-900 text-blue-200 text-[10px]">{mode === 'GROUP' ? 'PENYISIHAN' : 'KNOCKOUT'}</Badge>
             </div>
             <div className="font-bold text-lg text-white">Partai ke-1 (Ganda Putra)</div>
         </div>
         
         {/* TIMER & SERVER INDICATOR */}
         <div className="flex items-center gap-2">
            <div className="bg-yellow-900/30 border border-yellow-600/50 px-4 py-1 rounded flex flex-col items-center min-w-[100px]">
                <span className="text-[8px] text-yellow-500 uppercase font-bold">SERVICE</span>
                <span className="text-sm font-black text-white truncate max-w-[120px]">
                    {server === 'A' ? matchData.teamA : matchData.teamB}
                </span>
            </div>
            <div className="bg-zinc-950 px-3 py-1 rounded border border-zinc-800 text-center cursor-pointer" onClick={() => setIsTimerRunning(!isTimerRunning)}>
                <div className="text-[8px] text-zinc-500 uppercase">TIME</div>
                <div className={`font-mono font-bold text-xl leading-none ${isTimerRunning ? 'text-green-400' : 'text-red-400'}`}>
                    {formatTime(time)}
                </div>
            </div>
         </div>
      </div>

      {/* SCOREBOARD AREA */}
      <div className="flex-grow grid grid-cols-2 gap-2">
        {/* TIM A */}
        <TeamPanel 
            teamName={matchData.teamA} 
            players={matchData.playersA} 
            score={scoreA} 
            setScore={setA}
            isServing={server === 'A'}
            pos={posA}
            onPointAdd={() => handlePoint('A', 'ADD')}
            onPointMin={() => handlePoint('A', 'MIN')}
            side="LEFT" // Logika visual: A di Kiri
            scoreEven={scoreA % 2 === 0}
            mode={mode}
            disabled={status === 'FINISHED'}
        />

        {/* TIM B */}
        <TeamPanel 
            teamName={matchData.teamB} 
            players={matchData.playersB} 
            score={scoreB} 
            setScore={setB}
            isServing={server === 'B'}
            pos={posB}
            onPointAdd={() => handlePoint('B', 'ADD')}
            onPointMin={() => handlePoint('B', 'MIN')}
            side="RIGHT"
            scoreEven={scoreB % 2 === 0}
            mode={mode}
            disabled={status === 'FINISHED'}
        />
      </div>

      {/* FOOTER ACTIONS */}
      <div className="mt-3 grid grid-cols-4 gap-2">
         {/* TOMBOL SANKSI */}
         <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary" className="h-12 bg-zinc-800 border border-zinc-700 text-zinc-400 flex flex-col gap-0">
                    <Gavel className="w-4 h-4 text-red-500" />
                    <span className="text-[9px] font-bold uppercase">Sanksi</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                <DialogHeader><DialogTitle>Pilih Tim & Kartu</DialogTitle></DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <p className="text-xs text-center text-zinc-400">TIM A</p>
                        <Button onClick={() => handleCard('A', 'YELLOW')} className="w-full bg-yellow-500 text-black hover:bg-yellow-400">Kuning</Button>
                        <Button onClick={() => handleCard('A', 'RED')} className="w-full bg-red-600 hover:bg-red-500">Merah (+1 Lawan)</Button>
                        <Button onClick={() => handleCard('A', 'BLACK')} className="w-full bg-black border border-zinc-600">Hitam (WO)</Button>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs text-center text-zinc-400">TIM B</p>
                        <Button onClick={() => handleCard('B', 'YELLOW')} className="w-full bg-yellow-500 text-black hover:bg-yellow-400">Kuning</Button>
                        <Button onClick={() => handleCard('B', 'RED')} className="w-full bg-red-600 hover:bg-red-500">Merah (+1 Lawan)</Button>
                        <Button onClick={() => handleCard('B', 'BLACK')} className="w-full bg-black border border-zinc-600">Hitam (WO)</Button>
                    </div>
                </div>
            </DialogContent>
         </Dialog>

         <Button variant="secondary" className="h-12 bg-zinc-800 border border-zinc-700 text-zinc-400 flex flex-col gap-0" onClick={() => setServer(server === 'A' ? 'B' : 'A')}>
            <ArrowLeftRight className="w-4 h-4" />
            <span className="text-[9px] font-bold uppercase">Service Over</span>
         </Button>

         <div className="h-12 bg-zinc-950 border border-zinc-800 rounded flex flex-col items-center justify-center">
             <span className="text-[8px] text-zinc-500 uppercase">SHUTTLE</span>
             <div className="flex items-center gap-2">
                 <span className="font-mono font-bold text-lg">{shuttles}</span>
                 <button onClick={() => setShuttles(s=>s+1)} className="text-green-500 text-xs bg-zinc-900 px-1 rounded">+</button>
             </div>
         </div>

         {status === 'FINISHED' ? (
             <Button className="h-12 bg-green-600 hover:bg-green-500" onClick={() => window.location.href='/admin/referee'}>
                 <MonitorPlay className="w-4 h-4 mr-1" /> SELESAI
             </Button>
         ) : (
             <div className="h-12 flex items-center justify-center bg-black border border-zinc-800 rounded">
                 <span className="text-green-500 font-bold text-xs animate-pulse">● LIVE</span>
             </div>
         )}
      </div>
    </div>
  );
}

// --- SUB-COMPONENT UNTUK PANEL TIM ---
function TeamPanel({ teamName, players, score, setScore, isServing, pos, onPointAdd, onPointMin, side, scoreEven, mode, disabled }: any) {
    const playerNames = players.split(" / ");
    
    // Logika Posisi: 
    // Jika skor GENAP (scoreEven=true), server di KANAN.
    // Jika skor GANJIL (scoreEven=false), server di KIRI.
    
    return (
        <div className={`relative rounded-xl p-2 flex flex-col justify-between border-2 transition-all duration-300 ${isServing ? 'border-yellow-500 bg-zinc-900' : 'border-transparent bg-zinc-950 opacity-80'}`}>
            {isServing && (
                <div className="absolute top-0 right-0 bg-yellow-500 text-black px-2 py-0.5 text-[10px] font-black rounded-bl-lg">
                    SERVICE
                </div>
            )}
            
            <div className="mt-2 text-center">
                <h2 className="text-lg md:text-2xl font-black text-white truncate leading-none mb-1">{teamName}</h2>
                {mode === 'KNOCKOUT' && <div className="text-yellow-500 font-bold text-xl">SET {setScore}</div>}
            </div>

            <div className="flex-grow flex flex-col items-center justify-center py-2">
                <div className="text-[90px] md:text-[160px] leading-none font-black font-mono text-white select-none">
                    {score}
                </div>

                {/* POSISI PEMAIN */}
                <div className="grid grid-cols-2 gap-1 w-full mt-2">
                    <div className={`p-1 text-center rounded border ${!scoreEven ? 'border-yellow-600 bg-yellow-900/20 text-yellow-500' : 'border-zinc-800 text-zinc-600'}`}>
                        <div className="text-[8px] uppercase">KIRI (Ganjil)</div>
                        <div className="text-xs font-bold truncate">{playerNames[pos[1]]}</div>
                    </div>
                    <div className={`p-1 text-center rounded border ${scoreEven ? 'border-yellow-600 bg-yellow-900/20 text-yellow-500' : 'border-zinc-800 text-zinc-600'}`}>
                        <div className="text-[8px] uppercase">KANAN (Genap)</div>
                        <div className="text-xs font-bold truncate">{playerNames[pos[0]]}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
                 <Button className="h-14 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700" onClick={onPointMin} disabled={disabled}>
                    <Minus className="w-6 h-6 text-zinc-500" />
                 </Button>
                 <Button className="h-14 bg-blue-600 hover:bg-blue-500 text-white" onClick={onPointAdd} disabled={disabled}>
                    <Plus className="w-8 h-8" />
                 </Button>
            </div>
        </div>
    )
}
