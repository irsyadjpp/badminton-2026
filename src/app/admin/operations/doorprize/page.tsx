'use client';

import { useState, useEffect } from "react";
import { 
  Gift, Sparkles, Trophy, Shuffle, 
  RotateCcw, Monitor, PartyPopper, 
  Ticket, User, Check, X 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti"; // Pastikan install: npm install canvas-confetti @types/canvas-confetti

// --- MOCK DATA ---
const PRIZE_POOL = [
  { id: "PZ-01", name: "Raket Yonex Astrox 99", tier: "LEGENDARY", stock: 1, image: "/prizes/racket.png", color: "text-yellow-400 border-yellow-500 bg-yellow-500/10" },
  { id: "PZ-02", name: "Jersey Limited Edition", tier: "EPIC", stock: 5, image: "/prizes/jersey.png", color: "text-purple-400 border-purple-500 bg-purple-500/10" },
  { id: "PZ-03", name: "Smartwatch Sport", tier: "EPIC", stock: 3, image: "/prizes/watch.png", color: "text-purple-400 border-purple-500 bg-purple-500/10" },
  { id: "PZ-04", name: "Voucher Belanja 500k", tier: "RARE", stock: 10, image: "/prizes/voucher.png", color: "text-blue-400 border-blue-500 bg-blue-500/10" },
  { id: "PZ-05", name: "Goodie Bag Sponsor", tier: "COMMON", stock: 50, image: "/prizes/bag.png", color: "text-zinc-400 border-zinc-500 bg-zinc-500/10" },
];

// Mock Participants (Database)
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

  // Animation Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSpinning) {
      interval = setInterval(() => {
        const randomName = PARTICIPANTS[Math.floor(Math.random() * PARTICIPANTS.length)];
        setDisplayCandidate(randomName);
      }, 50); // Speed of text change
    }
    return () => clearInterval(interval);
  }, [isSpinning]);

  const handleSpin = () => {
    if (!selectedPrize) return;
    
    setIsSpinning(true);
    setWinner(null);

    // Stop after 3 seconds
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

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  // Get active prize details
  const activePrizeObj = PRIZE_POOL.find(p => p.id === selectedPrize);

  return (
    <div className="space-y-8 p-4 md:p-8 font-body pb-24 h-[calc(100vh-64px)] flex flex-col">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shrink-0">
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

        <Button variant="outline" className="h-14 rounded-full border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 font-bold">
            <Monitor className="mr-2 w-5 h-5"/> BIG SCREEN MODE
        </Button>
      </div>

      {/* --- MAIN STAGE --- */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
         
         {/* LEFT: PRIZE POOL (3 Columns) */}
         <div className="lg:col-span-3 flex flex-col gap-6 h-full overflow-hidden">
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-[24px]">
                <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Gift className="w-4 h-4 text-pink-500"/> Loot Pool
                </h3>
                <ScrollArea className="h-[calc(100vh-280px)] pr-2">
                    <div className="space-y-3">
                        {PRIZE_POOL.map((prize) => (
                            <div 
                                key={prize.id}
                                onClick={() => setSelectedPrize(prize.id)}
                                className={cn(
                                    "p-4 rounded-[20px] border-2 cursor-pointer transition-all hover:scale-105",
                                    selectedPrize === prize.id 
                                        ? "bg-zinc-800 border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.3)]" 
                                        : "bg-zinc-950 border-zinc-800 hover:border-zinc-600"
                                )}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="outline" className={cn("text-[9px] font-black border-none", prize.color)}>
                                        {prize.tier}
                                    </Badge>
                                    <span className="text-xs font-bold text-zinc-500">x{prize.stock}</span>
                                </div>
                                <h4 className="font-bold text-white leading-tight">{prize.name}</h4>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
         </div>

         {/* CENTER: THE SPINNER (6 Columns) */}
         <div className="lg:col-span-6 flex flex-col justify-center h-full">
            <Card className="bg-zinc-950 border-zinc-800 rounded-[40px] overflow-hidden relative shadow-2xl h-full flex flex-col">
                
                {/* Background FX */}
                <div className="absolute inset-0 bg-[url('/images/grid-pattern.png')] opacity-10 pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600/20 rounded-full blur-[100px] pointer-events-none"></div>

                <CardContent className="flex-1 flex flex-col items-center justify-center p-8 relative z-10 text-center space-y-8">
                    
                    {/* Selected Prize Display */}
                    <div className="space-y-2">
                        <p className="text-sm font-bold text-zinc-500 uppercase tracking-[0.2em]">Current Prize</p>
                        {activePrizeObj ? (
                            <div className="animate-in fade-in zoom-in duration-300">
                                <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">{activePrizeObj.name}</h2>
                                <Badge className={cn("mt-2 text-xs font-black", activePrizeObj.color)}>
                                    {activePrizeObj.tier} TIER
                                </Badge>
                            </div>
                        ) : (
                            <h2 className="text-2xl font-bold text-zinc-700 uppercase">Select a Prize to Start</h2>
                        )}
                    </div>

                    {/* The ROLLING TEXT */}
                    <div className="w-full h-40 bg-zinc-900/80 border border-zinc-700 rounded-[32px] flex items-center justify-center overflow-hidden relative shadow-inner">
                        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 pointer-events-none"></div>
                        <h1 className={cn(
                            "text-4xl md:text-6xl font-black uppercase transition-all",
                            isSpinning ? "text-zinc-400 blur-[1px]" : "text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-400 scale-110"
                        )}>
                            {displayCandidate}
                        </h1>
                    </div>

                    {/* SPIN BUTTON */}
                    <Button 
                        disabled={!selectedPrize || isSpinning}
                        onClick={handleSpin}
                        className={cn(
                            "w-64 h-20 rounded-full font-black text-2xl tracking-widest shadow-[0_0_40px_rgba(236,72,153,0.4)] transition-all",
                            isSpinning 
                                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
                                : "bg-gradient-to-r from-pink-600 to-purple-600 hover:scale-105 hover:shadow-[0_0_60px_rgba(236,72,153,0.6)] text-white"
                        )}
                    >
                        {isSpinning ? "ROLLING..." : "SPIN NOW"}
                    </Button>

                </CardContent>
            </Card>
         </div>

         {/* RIGHT: HISTORY (3 Columns) */}
         <div className="lg:col-span-3 flex flex-col gap-6 h-full overflow-hidden">
            <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-[24px] flex flex-col overflow-hidden">
                <div className="p-6 border-b border-zinc-800 bg-zinc-950/50">
                    <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-yellow-500"/> Hall of Fame
                    </h3>
                </div>
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                        {WINNERS_HISTORY.map((hist) => (
                            <div key={hist.id} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                                <div className="mt-1">
                                    {hist.status === 'CLAIMED' 
                                        ? <Check className="w-5 h-5 text-green-500 bg-green-500/10 rounded-full p-1"/>
                                        : <X className="w-5 h-5 text-red-500 bg-red-500/10 rounded-full p-1"/>
                                    }
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">{hist.name}</p>
                                    <p className="text-xs text-zinc-400 line-clamp-1">{hist.prize}</p>
                                    <p className="text-[10px] text-zinc-600 font-mono mt-1">{hist.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <div className="p-4 border-t border-zinc-800">
                    <Button variant="ghost" className="w-full text-zinc-500 text-xs uppercase font-bold hover:text-white">
                        View All History
                    </Button>
                </div>
            </div>
         </div>

      </div>

      {/* --- WINNER REVEAL MODAL --- */}
      <Dialog open={isWinnerModalOpen} onOpenChange={setIsWinnerModalOpen}>
        <DialogContent className="bg-zinc-950 border-4 border-pink-500 text-white rounded-[40px] max-w-lg p-0 overflow-hidden shadow-[0_0_100px_rgba(236,72,153,0.5)]">
            <DialogHeader className="hidden">
              <DialogTitle>Winner Announcement</DialogTitle>
            </DialogHeader>
            <div className="h-48 bg-gradient-to-b from-pink-600 to-purple-900 relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-30 mix-blend-overlay"></div>
                {/* Glow Effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/20 rounded-full blur-[60px] animate-pulse"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                    <Sparkles className="w-16 h-16 text-yellow-300 animate-bounce mb-2 drop-shadow-lg"/>
                    <h2 className="text-4xl font-black text-white uppercase tracking-tight drop-shadow-md">CONGRATULATIONS!</h2>
                </div>
            </div>

            <div className="p-10 text-center space-y-6 bg-zinc-900">
                <div className="space-y-2">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">The Winner Is</p>
                    <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
                        {winner}
                    </h1>
                    <Badge variant="outline" className="border-pink-500 text-pink-500 mt-2">
                        ID: TICKET-8821
                    </Badge>
                </div>

                <div className="bg-black/40 p-4 rounded-2xl border border-zinc-800">
                    <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Prize Won</p>
                    <p className="text-xl font-bold text-yellow-400">{activePrizeObj?.name}</p>
                </div>

                <div className="flex gap-4 pt-4">
                    <Button 
                        variant="outline" 
                        className="flex-1 h-14 rounded-2xl border-zinc-700 text-zinc-400 hover:text-white"
                        onClick={() => setIsWinnerModalOpen(false)}
                    >
                        Redraw
                    </Button>
                    <Button 
                        className="flex-1 h-14 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg"
                        onClick={() => setIsWinnerModalOpen(false)}
                    >
                        <Check className="mr-2 w-5 h-5"/> CONFIRM CLAIM
                    </Button>
                </div>
            </div>

        </DialogContent>
      </Dialog>

    </div>
  );
}
