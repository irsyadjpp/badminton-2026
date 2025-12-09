
'use client';

import { useState, useEffect } from "react";
import { 
  Gift, Sparkles, Trophy, Monitor, PartyPopper, 
  Check, X, Crown, Box, AlertCircle, Maximize, Minimize 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti"; 

// --- MOCK DATA ---
const PRIZE_POOL = [
  { id: "PZ-01", name: "Raket Yonex Astrox 99", tier: "LEGENDARY", stock: 1, color: "text-yellow-400 border-yellow-500 bg-yellow-500/10" },
  { id: "PZ-02", name: "Jersey Limited Edition", tier: "EPIC", stock: 5, color: "text-purple-400 border-purple-500 bg-purple-500/10" },
  { id: "PZ-03", name: "Smartwatch Sport", tier: "EPIC", stock: 3, color: "text-purple-400 border-purple-500 bg-purple-500/10" },
  { id: "PZ-04", name: "Voucher Belanja 500k", tier: "RARE", stock: 10, color: "text-blue-400 border-blue-500 bg-blue-500/10" },
  { id: "PZ-05", name: "Goodie Bag Sponsor", tier: "COMMON", stock: 50, color: "text-zinc-400 border-zinc-500 bg-zinc-500/10" },
];

const PARTICIPANTS = [
  "Kevin Sanjaya", "Marcus Gideon", "Apriyani Rahayu", "Siti Fadia", 
  "Anthony Ginting", "Jonatan Christie", "Fajar Alfian", "Rian Ardianto",
  "Hendra Setiawan", "Mohammad Ahsan", "Gregoria Mariska", "Chico Aura"
];

const WINNERS_HISTORY = [
  { id: 1, name: "Budi Santoso", prize: "Voucher Belanja 500k", time: "10:30", status: "CLAIMED" },
  { id: 2, name: "Siti Aminah", prize: "Jersey Limited Edition", time: "11:15", status: "UNCLAIMED" },
];

export default function DoorprizePage() {
  const [selectedPrize, setSelectedPrize] = useState<string>("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayCandidate, setDisplayCandidate] = useState("READY TO ROLL");
  const [winner, setWinner] = useState<string | null>(null);
  const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);
  
  // State untuk Big Screen
  const [isBigScreen, setIsBigScreen] = useState(false);

  // Auto-select prize pertama
  useEffect(() => {
    if (PRIZE_POOL.length > 0) {
        setSelectedPrize(PRIZE_POOL[0].id);
    }
  }, []);

  // Animation Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSpinning) {
      interval = setInterval(() => {
        const randomName = PARTICIPANTS[Math.floor(Math.random() * PARTICIPANTS.length)];
        setDisplayCandidate(randomName);
      }, 50); 
    }
    return () => clearInterval(interval);
  }, [isSpinning]);

  // Listener untuk tombol ESC agar keluar dari fullscreen
  useEffect(() => {
    const handleEsc = () => {
      if (!document.fullscreenElement) {
        setIsBigScreen(false);
      }
    };
    document.addEventListener('fullscreenchange', handleEsc);
    return () => document.removeEventListener('fullscreenchange', handleEsc);
  }, []);

  const handleSpin = () => {
    if (!selectedPrize) return;
    
    setIsSpinning(true);
    setWinner(null);

    setTimeout(() => {
      setIsSpinning(false);
      const finalWinner = PARTICIPANTS[Math.floor(Math.random() * PARTICIPANTS.length)];
      setWinner(finalWinner);
      setDisplayCandidate(finalWinner);
      setIsWinnerModalOpen(true);
      triggerConfetti();
    }, 3000);
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
      setIsBigScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsBigScreen(false);
    }
  };

  const activePrizeObj = PRIZE_POOL.find(p => p.id === selectedPrize);

  return (
    <div className="space-y-8 p-4 md:p-8 font-body pb-24 h-[calc(100vh-64px)] flex flex-col">
      
      {/* --- HEADER --- */}
      <div className={cn("flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shrink-0 transition-all", isBigScreen ? "hidden" : "flex")}>
        <div>
            <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="rounded-full px-3 py-1 border-pink-500 text-pink-500 bg-pink-500/10 backdrop-blur-md animate-pulse">
                    <PartyPopper className="w-3 h-3 mr-2" /> LUCKY DRAW EVENT
                </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-black font-headline uppercase tracking-tighter text-white">
                The <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">Loot Drop</span>
            </h1>
            <p className="text-zinc-400 mt-2 max-w-xl text-lg">
                Sistem pengundian doorprize transparan untuk peserta & penonton.
            </p>
        </div>

        {/* TOMBOL BIG SCREEN */}
        <Button 
            variant="outline" 
            onClick={toggleFullScreen}
            className="h-14 rounded-full border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 font-bold"
        >
            <Monitor className="mr-2 w-5 h-5"/> BIG SCREEN MODE
        </Button>
      </div>

      {/* --- MAIN STAGE --- */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
         
         {/* LEFT: PRIZE POOL (Hidden on Big Screen) */}
         <div className={cn("flex flex-col gap-6 h-full overflow-hidden transition-all duration-500", isBigScreen ? "hidden" : "lg:col-span-3")}>
            <Card className="flex-1 bg-zinc-900 border border-zinc-800 rounded-[24px] overflow-hidden flex flex-col">
                <div className="p-6 pb-2 border-b border-zinc-800 bg-zinc-950/50">
                    <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <Gift className="w-4 h-4 text-pink-500"/> Loot Pool
                    </h3>
                </div>
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-3">
                        {PRIZE_POOL.map((prize) => (
                            <div 
                                key={prize.id}
                                onClick={() => setSelectedPrize(prize.id)}
                                className={cn(
                                    "p-4 rounded-[20px] border-2 cursor-pointer transition-all hover:scale-105 active:scale-95 relative overflow-hidden group",
                                    selectedPrize === prize.id 
                                        ? "bg-zinc-800 border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.3)]" 
                                        : "bg-zinc-950 border-zinc-800 hover:border-zinc-600"
                                )}
                            >
                                {selectedPrize === prize.id && (
                                    <div className="absolute top-0 right-0 p-1.5 bg-pink-500 rounded-bl-xl text-black">
                                        <Check className="w-3 h-3 stroke-[4px]" />
                                    </div>
                                )}
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="outline" className={cn("text-[9px] font-black border-none", prize.color)}>
                                        {prize.tier}
                                    </Badge>
                                    <span className="text-xs font-bold text-zinc-500">Stock: {prize.stock}</span>
                                </div>
                                <h4 className="font-bold text-white leading-tight pr-4">{prize.name}</h4>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </Card>
         </div>

         {/* CENTER: THE SPINNER (Expands on Big Screen) */}
         <div className={cn("flex flex-col justify-center h-full transition-all duration-500", isBigScreen ? "lg:col-span-12" : "lg:col-span-6")}>
            <Card className="bg-zinc-950 border-zinc-800 rounded-[40px] overflow-hidden relative shadow-2xl h-full flex flex-col">
                
                {/* Background FX */}
                <div className="absolute inset-0 bg-[url('/images/grid-pattern.png')] opacity-10 pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600/20 rounded-full blur-[100px] pointer-events-none"></div>

                {/* EXIT BUTTON (Only Visible on Big Screen) */}
                {isBigScreen && (
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={toggleFullScreen}
                        className="absolute top-6 right-6 z-50 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-full"
                    >
                        <Minimize className="w-8 h-8" />
                    </Button>
                )}

                <CardContent className="flex-1 flex flex-col items-center justify-center p-8 relative z-10 text-center space-y-10">
                    
                    {/* Active Prize Info */}
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 shadow-sm">
                            <Box className="w-4 h-4 text-zinc-500" />
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Selected Prize</span>
                        </div>
                        
                        {activePrizeObj ? (
                            <div className="animate-in fade-in zoom-in duration-300 space-y-2">
                                <h2 className={cn("font-black text-white uppercase tracking-tight leading-none drop-shadow-xl transition-all", isBigScreen ? "text-6xl md:text-8xl" : "text-3xl md:text-5xl")}>
                                    {activePrizeObj.name}
                                </h2>
                                <Badge className={cn("text-xs font-black px-3 py-1", activePrizeObj.color)}>
                                    {activePrizeObj.tier} TIER
                                </Badge>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-zinc-600 animate-pulse">
                                <AlertCircle className="w-12 h-12"/>
                                <h2 className="text-xl font-bold uppercase">Pilih Hadiah di Kiri</h2>
                            </div>
                        )}
                    </div>

                    {/* THE ROLLING DISPLAY */}
                    <div className={cn(
                        "bg-black/80 border-4 border-zinc-800 rounded-[32px] flex items-center justify-center overflow-hidden relative shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] group transition-all",
                        isBigScreen ? "w-3/4 h-64 border-pink-500/30" : "w-full h-48"
                    )}>
                        {/* Scanlines Effect */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[length:100%_2px,3px_100%]"></div>
                        
                        <h1 className={cn(
                            "font-black uppercase transition-all z-20 text-center px-4",
                            isBigScreen ? "text-7xl md:text-9xl" : "text-4xl md:text-6xl",
                            isSpinning 
                                ? "text-zinc-500 blur-[2px] scale-95" 
                                : "text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-400 scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                        )}>
                            {displayCandidate}
                        </h1>
                    </div>

                    {/* SPIN ACTION */}
                    <Button 
                        disabled={!selectedPrize || isSpinning}
                        onClick={handleSpin}
                        className={cn(
                            "rounded-full font-black tracking-widest shadow-[0_0_40px_rgba(236,72,153,0.4)] transition-all transform active:scale-95",
                            isBigScreen ? "w-96 h-32 text-4xl" : "w-72 h-24 text-3xl",
                            isSpinning 
                                ? "bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-700" 
                                : "bg-gradient-to-r from-pink-600 to-purple-600 hover:scale-105 hover:shadow-[0_0_80px_rgba(236,72,153,0.6)] text-white border-4 border-pink-400/20"
                        )}
                    >
                        {isSpinning ? "ROLLING..." : "SPIN NOW"}
                    </Button>

                </CardContent>
            </Card>
         </div>

         {/* RIGHT: HISTORY (Hidden on Big Screen) */}
         <div className={cn("flex flex-col gap-6 h-full overflow-hidden transition-all duration-500", isBigScreen ? "hidden" : "lg:col-span-3")}>
            <Card className="flex-1 bg-zinc-900 border border-zinc-800 rounded-[24px] flex flex-col overflow-hidden">
                <div className="p-6 border-b border-zinc-800 bg-zinc-950/50">
                    <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-yellow-500"/> Hall of Fame
                    </h3>
                </div>
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-3">
                        {WINNERS_HISTORY.map((hist) => (
                            <div key={hist.id} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                                <div className="mt-1">
                                    {hist.status === 'CLAIMED' 
                                        ? <div className="p-1 bg-green-500/10 rounded-full"><Check className="w-4 h-4 text-green-500"/></div>
                                        : <div className="p-1 bg-red-500/10 rounded-full"><X className="w-4 h-4 text-red-500"/></div>
                                    }
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white line-clamp-1">{hist.name}</p>
                                    <p className="text-[10px] text-zinc-400 line-clamp-1">{hist.prize}</p>
                                    <p className="text-[10px] text-zinc-600 font-mono mt-1">{hist.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </Card>
         </div>

      </div>

      {/* --- WINNER REVEAL MODAL --- */}
      <Dialog open={isWinnerModalOpen} onOpenChange={setIsWinnerModalOpen}>
        <DialogContent className={cn(
            "bg-zinc-950 border-4 border-pink-500 text-white rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(236,72,153,0.5)] transition-all",
            isBigScreen ? "max-w-4xl p-0 scale-125" : "max-w-lg p-0"
        )}>
            
            <DialogHeader className="sr-only">
                <DialogTitle>Winner Announcement</DialogTitle>
                <DialogDescription>The winner is {winner}</DialogDescription>
            </DialogHeader>

            <div className={cn("bg-gradient-to-b from-pink-600 to-purple-900 relative flex items-center justify-center overflow-hidden", isBigScreen ? "h-96" : "h-56")}>
                <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-30 mix-blend-overlay"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-white/10 rounded-full blur-[80px] animate-pulse"></div>
                
                <div className="relative z-10 flex flex-col items-center animate-in zoom-in slide-in-from-bottom-10 duration-500">
                    <Crown className={cn("text-yellow-400 mb-2 drop-shadow-[0_0_20px_rgba(250,204,21,0.8)] animate-bounce", isBigScreen ? "w-32 h-32" : "w-20 h-20")}/>
                    <Sparkles className="absolute top-0 right-10 w-10 h-10 text-white animate-spin-slow"/>
                    <h2 className={cn("font-black text-white uppercase tracking-tighter drop-shadow-md mt-2", isBigScreen ? "text-6xl" : "text-4xl")}>WINNER!</h2>
                </div>
            </div>

            <div className={cn("text-center bg-zinc-900", isBigScreen ? "p-16 space-y-12" : "p-10 space-y-8")}>
                <div className="space-y-3">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-[0.3em]">Congratulations To</p>
                    <h1 className={cn("font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 leading-tight", isBigScreen ? "text-7xl" : "text-4xl md:text-5xl")}>
                        {winner}
                    </h1>
                    <Badge variant="outline" className="border-pink-500 text-pink-500 mt-2 px-4 py-1">
                        ID: TICKET-LUCKY-88
                    </Badge>
                </div>

                <div className="bg-black/60 p-6 rounded-3xl border border-zinc-800 shadow-inner">
                    <p className="text-[10px] text-zinc-500 uppercase font-bold mb-2 tracking-widest">Prize Unlocked</p>
                    <p className={cn("font-bold text-yellow-400", isBigScreen ? "text-4xl" : "text-2xl")}>{activePrizeObj?.name}</p>
                </div>

                <div className="flex gap-4 pt-4">
                    <Button 
                        variant="outline" 
                        className="flex-1 h-14 rounded-2xl border-zinc-700 text-zinc-400 hover:text-white font-bold bg-transparent"
                        onClick={() => setIsWinnerModalOpen(false)}
                    >
                        Close
                    </Button>
                    <Button 
                        className="flex-1 h-14 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-black text-lg shadow-lg shadow-green-900/20"
                        onClick={() => setIsWinnerModalOpen(false)}
                    >
                        <Check className="mr-2 w-5 h-5"/> CLAIM PRIZE
                    </Button>
                </div>
            </div>

        </DialogContent>
      </Dialog>

    </div>
  );
}
