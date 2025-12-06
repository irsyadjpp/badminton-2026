
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
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UmpireControls } from '@/components/admin/umpire-controls';

type MatchMode = 'GROUP' | 'KNOCKOUT';
type MatchStatus = 'PRE_MATCH' | 'IN_PROGRESS' | 'FINISHED';
type TeamSide = 'LEFT' | 'RIGHT';

function TeamPanel({ teamName, players, score, setScore, isServing, pos, onPointAdd, onPointMin, side, scoreEven, mode, disabled }: any) {
    const playerNames = players.split(" / ");
    
    return (
        <Card className={`relative p-4 flex flex-col justify-between border-2 transition-all duration-300 ${isServing ? 'border-yellow-500 bg-yellow-500/5' : ''}`}>
            {isServing && (
                <div className="absolute top-0 right-0 bg-yellow-500 text-black px-2 py-0.5 text-[10px] font-black rounded-bl-lg rounded-tr-md">
                    SERVICE
                </div>
            )}
            
            <div className="mt-2 text-center">
                <h2 className="text-lg md:text-2xl font-black text-foreground truncate leading-none mb-1">{teamName}</h2>
                {mode === 'KNOCKOUT' && <div className="text-yellow-600 font-bold text-xl">SET {setScore}</div>}
            </div>

            <div className="flex-grow flex flex-col items-center justify-center py-2">
                <div className="text-[90px] md:text-[160px] leading-none font-black font-mono text-foreground select-none">
                    {score}
                </div>

                <div className="grid grid-cols-2 gap-1 w-full mt-2">
                    <div className={`p-1 text-center rounded-md border ${!scoreEven ? 'border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-500' : 'text-muted-foreground'}`}>
                        <div className="text-[8px] uppercase">KIRI (Ganjil)</div>
                        <div className="text-xs font-bold truncate">{playerNames[pos[1]]}</div>
                    </div>
                    <div className={`p-1 text-center rounded-md border ${scoreEven ? 'border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-500' : 'text-muted-foreground'}`}>
                        <div className="text-[8px] uppercase">KANAN (Genap)</div>
                        <div className="text-xs font-bold truncate">{playerNames[pos[0]]}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
                 <Button className="h-16" variant="outline" onClick={onPointMin} disabled={disabled}>
                    <Minus className="w-8 h-8" />
                 </Button>
                 <Button className="h-16" onClick={onPointAdd} disabled={disabled}>
                    <Plus className="w-10 h-10" />
                 </Button>
            </div>
        </Card>
    )
}

export default function MatchControlPage() {
  const { toast } = useToast();
  const params = useParams();
  const matchId = params.id as string;

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

  // --- STATE BARU: Posisi Tim di Layar ---
  const [teamSides, setTeamSides] = useState<{ teamA: TeamSide, teamB: TeamSide }>({ teamA: 'LEFT', teamB: 'RIGHT' });
  const [intervalTriggeredInSet, setIntervalTriggeredInSet] = useState(false);


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

  const switchSides = () => {
    setTeamSides(prev => ({
      teamA: prev.teamA === 'LEFT' ? 'RIGHT' : 'LEFT',
      teamB: prev.teamB === 'LEFT' ? 'RIGHT' : 'LEFT',
    }));
  };

  // --- LOGIC 1: COIN TOSS (BWF STYLE) ---
  const handleStartMatch = () => {
    // Terapkan hasil Toss
    if (tossChoice === 'SERVE') {
        setServer(tossWinner);
    } else if (tossChoice === 'RECEIVE') {
        setServer(tossWinner === 'A' ? 'B' : 'A');
    } else {
        // Jika pilih sisi, tim lain yang service pertama
        if(tossWinner === 'A') {
          // A pilih sisi, B service
          setTeamSides({ teamA: 'RIGHT', teamB: 'LEFT'}); // Contoh A pilih sisi kanan
          setServer('B');
        } else {
          // B pilih sisi, A service
          setTeamSides({ teamA: 'LEFT', teamB: 'RIGHT'});
          setServer('A');
        }
        toast({ title: "Pilih Tempat", description: `Tim ${tossWinner === 'A' ? matchData.teamA : matchData.teamB} memilih sisi lapangan.` });
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
        if (!intervalTriggeredInSet && ((newA === 15 && newB < 15) || (newB === 15 && newA < 15))) {
             msg = "INTERVAL: PINDAH TEMPAT (SKOR 15)";
             setIsTimerRunning(false);
             switchSides();
             setIntervalTriggeredInSet(true);
        }
        if (newA === 29 && newB === 29) msg = "SUDDEN DEATH: Poin Selanjutnya Menang!";
        else if (newA >= 30 || newB >= 30) return handleGameWin(newA > newB ? 'A' : 'B');
    } 
    else {
        // ATURAN GUGUR (3 x 15 Poin, Setting Max 20)
        const maxScore = 20;
        const winPoint = 15;
        
        if (!intervalTriggeredInSet && gameSet === 3) {
             if ((newA === 8 && newB < 8) || (newB === 8 && newA < 8)) {
                 msg = "INTERVAL RUBBER: PINDAH TEMPAT (SKOR 8)";
                 setIsTimerRunning(false);
                 switchSides();
                 setIntervalTriggeredInSet(true);
             }
        }

        const isDeuce = newA >= (winPoint - 1) && newB >= (winPoint - 1);
        if (isDeuce) {
            if (newA === (winPoint - 1) && newB === (winPoint - 1)) {
              msg = "SETTING / JUS";
            }
            if (Math.abs(newA - newB) >= 2) return handleSetWin(newA > newB ? 'A' : 'B');
            if (newA === maxScore || newB === maxScore) return handleSetWin(newA === maxScore ? 'A' : 'B');
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

      const newSetA = winner === 'A' ? setA + 1 : setA;
      const newSetB = winner === 'B' ? setB + 1 : setB;
      setSetA(newSetA);
      setSetB(newSetB);

      if (newSetA === 2 || newSetB === 2) {
        return handleMatchEnd(winner);
      }
      
      toast({title: `Set ${gameSet} Dimenangkan Tim ${winner}`, description: "Skor akan direset untuk set berikutnya."})

      setTimeout(() => {
        if (confirm(`Set ${gameSet} Selesai. Pemenang: Tim ${winner}. Lanjut Set Berikutnya?`)) {
            setGameSet(g => g + 1);
            setScoreA(0); setScoreB(0); 
            setIsTimerRunning(true);
            switchSides(); // Pindah sisi di awal set baru
            setIntervalTriggeredInSet(false); // Reset interval trigger for new set
        }
      }, 500);

      return `SET ${gameSet} WON BY ${winner}`;
  };

  const handleGameWin = (winner: 'A' | 'B') => {
      setSetA(winner === 'A' ? 1 : 0);
      setSetB(winner === 'B' ? 1 : 0);
      return handleMatchEnd(winner);
  }

  const handleMatchEnd = (winner: 'A' | 'B') => {
      setStatus('FINISHED');
      setIsTimerRunning(false);
      toast({title: `PERTANDINGAN SELESAI`, description: `Pemenang: Tim ${winner}`, className: "bg-green-600 text-white"});
      return `MATCH WON BY ${winner}`;
  }

  // --- LOGIC 3: KARTU & SANKSI ---
  const handleCard = (team: 'A' | 'B', type: 'YELLOW' | 'RED' | 'BLACK') => {
      const teamName = team === 'A' ? matchData.teamA : matchData.teamB;
      const currentScore = `${scoreA}-${scoreB}`;
      
      setCards(prev => [...prev, { team: teamName, type, score: currentScore }]);
      
      if (type === 'YELLOW') {
          toast({ title: "PERINGATAN (Kartu Kuning)", description: `Diberikan kepada ${teamName}`, className: "bg-yellow-500 text-black" });
      } 
      else if (type === 'RED') {
          toast({ title: "FAULT (Kartu Merah)", description: `Poin untuk lawan.`, className: "bg-red-600 text-white" });
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

  const handlePoint = (team: 'A' | 'B', type: 'ADD' | 'MIN') => {
    if (status !== 'IN_PROGRESS') return;

    if (type === 'ADD') {
        setHistory([...history, { scoreA, scoreB, server, posA: [...posA], posB: [...posB] }]);
        
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
        if (msg && !msg.startsWith('SET') && !msg.startsWith('MATCH')) {
          toast({ title: msg, className: "bg-primary" });
        }

    } else {
        if (history.length > 0) {
            const last = history[history.length - 1];
            setScoreA(last.scoreA); setScoreB(last.scoreB); 
            setServer(last.server); setPosA(last.posA); setPosB(last.posB);
            setHistory(history.slice(0, -1));
        }
    }
  };

  const handleOverrule = () => {
    // This is a simple logic. A real overrule might need to know which point to correct.
    // For now, let's just swap the last point.
    if (history.length > 0) {
        const lastState = history[history.length-1];
        
        // Find out who scored last by comparing with current score
        const teamAScoredLast = scoreA > lastState.scoreA;
        
        // Undo the last point
        handlePoint('A', 'MIN'); // this will restore to lastState
        
        // Add point to the other team
        if(teamAScoredLast) {
            handlePoint('B', 'ADD');
        } else {
            handlePoint('A', 'ADD');
        }
    }
  };


  if (status === 'PRE_MATCH') {
      return (
          <div className="flex items-center justify-center min-h-full p-4">
              <Card className="max-w-md w-full">
                <CardHeader className="text-center pb-4">
                    <Coins className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                    <CardTitle className="text-2xl font-black font-headline">COIN TOSS</CardTitle>
                    <p className="text-muted-foreground text-sm">Persiapan Pertandingan</p>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="space-y-4">
                      <div>
                          <Label className="mb-2 block">Mode Pertandingan</Label>
                          <Select value={mode} onValueChange={(v: MatchMode) => setMode(v)}>
                              <SelectTrigger className="w-full"><SelectValue/></SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="GROUP">PENYISIHAN (1x30)</SelectItem>
                                  <SelectItem value="KNOCKOUT">PEREMPAT FINAL+ (3x15)</SelectItem>
                              </SelectContent>
                          </Select>
                      </div>

                      <div className="space-y-3">
                          <Label>Pemenang Undian (Tos)</Label>
                          <RadioGroup value={tossWinner} onValueChange={(v: 'A'|'B') => setTossWinner(v)} className="grid grid-cols-2 gap-4">
                              <Label htmlFor="winnerA" className={`border rounded-lg p-3 cursor-pointer flex items-center justify-center gap-2 ${tossWinner === 'A' ? 'bg-primary/20 border-primary' : ''}`}>
                                  <RadioGroupItem value="A" id="winnerA" />
                                  <span className="font-bold">TIM A</span>
                              </Label>
                              <Label htmlFor="winnerB" className={`border rounded-lg p-3 cursor-pointer flex items-center justify-center gap-2 ${tossWinner === 'B' ? 'bg-primary/20 border-primary' : ''}`}>
                                  <RadioGroupItem value="B" id="winnerB" />
                                  <span className="font-bold">TIM B</span>
                              </Label>
                          </RadioGroup>
                      </div>

                      <div className="space-y-3">
                          <Label>Pemenang Memilih</Label>
                          <RadioGroup value={tossChoice} onValueChange={(v: any) => setTossChoice(v)} className="grid grid-cols-3 gap-2">
                              {['SERVE', 'RECEIVE', 'SIDE'].map((choice) => (
                                  <Label key={choice} htmlFor={choice} className={`border rounded-lg p-2 cursor-pointer flex flex-col items-center justify-center text-center ${tossChoice === choice ? 'bg-green-100 dark:bg-green-900/30 border-green-600' : ''}`}>
                                      <RadioGroupItem value={choice} id={choice} className="sr-only" />
                                      <span className="font-bold text-xs">{choice}</span>
                                  </Label>
                              ))}
                          </RadioGroup>
                      </div>
                  </div>

                  <Button className="w-full h-12 text-lg font-bold bg-green-600 hover:bg-green-500" onClick={handleStartMatch}>
                      MULAI PERTANDINGAN
                  </Button>
                </CardContent>
              </Card>
          </div>
      );
  }

  const teamAPanel = (
    <TeamPanel 
        teamName={matchData.teamA} 
        players={matchData.playersA} 
        score={scoreA} 
        setScore={setA}
        isServing={server === 'A'}
        pos={posA}
        onPointAdd={() => handlePoint('A', 'ADD')}
        onPointMin={() => handlePoint('A', 'MIN')}
        side="LEFT"
        scoreEven={scoreA % 2 === 0}
        mode={mode}
        disabled={status === 'FINISHED'}
    />
  );
  
  const teamBPanel = (
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
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center bg-card p-3 rounded-lg gap-4">
         <div className="text-left w-full md:w-auto">
             <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-[10px]">MATCH #{matchId}</Badge>
                <Badge variant="secondary" className="text-[10px]">{mode === 'GROUP' ? 'PENYISIHAN' : 'KNOCKOUT'}</Badge>
             </div>
             <div className="font-bold text-lg text-foreground">{matchData.category}</div>
         </div>
         
         <div className="flex items-center gap-2">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 px-4 py-1 rounded-md flex flex-col items-center min-w-[100px]">
                <span className="text-[8px] text-yellow-600 dark:text-yellow-500 uppercase font-bold">SERVICE</span>
                <span className="text-sm font-black text-foreground truncate max-w-[120px]">
                    {server === 'A' ? matchData.teamA : matchData.teamB}
                </span>
            </div>
            <div className="px-3 py-1 rounded-md text-center cursor-pointer" onClick={() => setIsTimerRunning(!isTimerRunning)}>
                <div className="text-[8px] text-muted-foreground uppercase">TIME</div>
                <div className={`font-mono font-bold text-xl leading-none ${isTimerRunning ? 'text-green-500' : 'text-red-500'}`}>
                    {formatTime(time)}
                </div>
            </div>
         </div>
      </div>

      <div className="flex-grow grid grid-cols-2 gap-4">
        {teamSides.teamA === 'LEFT' ? teamAPanel : teamBPanel}
        {teamSides.teamB === 'RIGHT' ? teamBPanel : teamAPanel}
      </div>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
         {/* Kontrol Umpire */}
         <UmpireControls 
             onFault={() => {
                 // Memberi poin ke lawan dari server saat ini
                 const opponent = server === 'A' ? 'B' : 'A';
                 handlePoint(opponent, 'ADD');
             }}
             onOverrule={handleOverrule}
         />

         <div className="grid grid-cols-2 gap-2">
            <div className="h-full rounded-md flex flex-col items-center justify-center p-2 bg-secondary">
                <span className="text-[8px] text-muted-foreground uppercase">SHUTTLE</span>
                <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-lg">{shuttles}</span>
                    <button onClick={() => setShuttles(s=>s+1)} disabled={status === 'FINISHED'} className="text-green-500 text-xs bg-background px-1 rounded disabled:opacity-50 disabled:cursor-not-allowed">+</button>
                </div>
            </div>
            <Button variant="secondary" className="h-full flex flex-col gap-0" onClick={() => setServer(server === 'A' ? 'B' : 'A')} disabled={status === 'FINISHED'}>
               <ArrowLeftRight className="w-5 h-5" />
               <span className="text-[9px] font-bold uppercase">Service Over</span>
            </Button>
         </div>
      </div>
      
      {status === 'FINISHED' && (
             <Button className="w-full h-14 bg-green-600 hover:bg-green-500 mt-4" onClick={() => window.location.href='/admin/referee'}>
                 <MonitorPlay className="w-4 h-4 mr-1" /> SELESAI & KIRIM HASIL
             </Button>
      )}

    </div>
  );
}

    