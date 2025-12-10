
'use client';

import { useState } from "react";
import { 
  QrCode, ScanLine, Search, UserCheck, 
  XCircle, CheckCircle2, ShieldAlert, History, 
  Ticket, Zap, ArrowRight, DoorOpen 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// --- MOCK DATA ---
const RECENT_ENTRIES = [
  { id: "T-8821", name: "Kevin Sanjaya", role: "ATHLETE", time: "Just now", status: "ALLOWED", gate: "G1", avatar: "https://github.com/shadcn.png" },
  { id: "T-8822", name: "Budi Santoso", role: "SPECTATOR", time: "2 min ago", status: "ALLOWED", gate: "G1", avatar: "" },
  { id: "T-8823", name: "Unknown", role: "INVALID", time: "5 min ago", status: "DENIED", gate: "G1", avatar: "" },
  { id: "T-8824", name: "Siti Aminah", role: "MEDIA", time: "10 min ago", status: "ALLOWED", gate: "G2", avatar: "" },
];

const GATE_STATS = {
  totalIn: 1240,
  capacity: 2500,
  vipCount: 45,
  athleteCount: 120
};

export default function GateCheckInPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [scanResult, setScanResult] = useState<any>(null); // State untuk hasil scan

  // Simulasi Scan
  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
        setIsScanning(false);
        
        // --- LOGIC BARU: SIMULASI HASIL ---
        const randomScenario = Math.random();
        
        let resultData;

        if (randomScenario > 0.7) {
            // SCENARIO 1: SUCCESS
            resultData = {
                valid: true,
                name: "Kevin Sanjaya",
                role: "ATHLETE",
                id: "T-8821",
                zone: "ALL ACCESS",
                message: "ACCESS GRANTED"
            };
        } else if (randomScenario > 0.4) {
             // SCENARIO 2: BLOCKED (UNPAID BILL)
             resultData = {
                valid: false,
                name: "Taufik Hidayat (Kw)",
                role: "ATHLETE",
                id: "T-1029",
                zone: "BLOCKED",
                reason: "UNPAID_BILL", // Flag khusus
                message: "LUNASI TAGIHAN DULU"
            };
        } else {
             // SCENARIO 3: INVALID
             resultData = {
                valid: false,
                name: "Unknown Ticket",
                role: "UNKNOWN",
                id: "???",
                zone: "NO ACCESS",
                message: "ACCESS DENIED"
            };
        }
        setScanResult(resultData);
    }, 1500);
  };

  return (
    <div className="space-y-6 p-4 md:p-8 font-body pb-24 h-[calc(100vh-64px)] flex flex-col">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shrink-0">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="rounded-full px-3 py-1 border-violet-500 text-violet-500 bg-violet-500/10 backdrop-blur-md animate-pulse">
                    <DoorOpen className="w-3 h-3 mr-2" /> GATE 1 ACTIVE
                </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-black font-headline uppercase tracking-tighter text-white">
                Access <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-600">Control</span>
            </h1>
            <p className="text-zinc-400 mt-2 max-w-xl text-lg">
                Validasi tiket dan kontrol akses masuk venue secara real-time.
            </p>
        </div>

        {/* CROWD METER */}
        <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 p-3 rounded-[24px]">
            <div className="text-right">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Venue Capacity</p>
                <div className="flex items-baseline gap-1 justify-end">
                    <span className="text-2xl font-black text-white">{Math.round((GATE_STATS.totalIn / GATE_STATS.capacity) * 100)}%</span>
                    <span className="text-xs text-zinc-400 font-bold">Filled</span>
                </div>
            </div>
            <div className="h-12 w-2 bg-zinc-800 rounded-full overflow-hidden flex flex-col-reverse">
                <div className="w-full bg-violet-500" style={{ height: '50%' }}></div>
            </div>
        </div>
      </div>

      {/* --- MAIN INTERFACE --- */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
         
         {/* LEFT: SCANNER CONSOLE (1/3) */}
         <Card className="lg:col-span-1 bg-zinc-900 border-zinc-800 rounded-[32px] flex flex-col overflow-hidden h-full shadow-2xl relative">
            
            {/* Visual Scanner Box */}
            <div className="flex-1 bg-black relative flex flex-col items-center justify-center p-8 group cursor-pointer" onClick={handleScan}>
                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[url('/images/grid-pattern.png')] opacity-20"></div>
                
                {/* Scan Frame */}
                <div className={cn(
                    "w-64 h-64 border-4 rounded-[32px] flex items-center justify-center relative transition-all duration-300",
                    isScanning ? "border-violet-500 shadow-[0_0_50px_rgba(139,92,246,0.5)]" : "border-zinc-700 group-hover:border-violet-500/50"
                )}>
                    {/* Scanning Laser */}
                    {isScanning && (
                        <div className="absolute top-0 left-0 right-0 h-1 bg-violet-400 shadow-[0_0_20px_#a78bfa] animate-scan"></div>
                    )}
                    
                    <div className="text-center z-10">
                        {isScanning ? (
                            <div className="flex flex-col items-center gap-2">
                                <ScanLine className="w-16 h-16 text-violet-400 animate-pulse"/>
                                <span className="text-violet-400 font-bold text-sm tracking-widest animate-pulse">VERIFYING...</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4 text-zinc-500 group-hover:text-white transition-colors">
                                <QrCode className="w-20 h-20"/>
                                <div className="space-y-1">
                                    <p className="font-black text-xl uppercase tracking-widest">Tap to Scan</p>
                                    <p className="text-xs font-medium opacity-60">Arahkan kamera ke QR Code</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white/20 rounded-tl-xl"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white/20 rounded-tr-xl"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white/20 rounded-bl-xl"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white/20 rounded-br-xl"></div>
                </div>
            </div>

            {/* Manual Input Footer */}
            <div className="p-6 bg-zinc-900 border-t border-zinc-800 space-y-4">
                <div className="relative">
                    <Search className="absolute left-4 top-4 w-5 h-5 text-zinc-500" />
                    <Input 
                        placeholder="Input Manual ID / Kode..." 
                        className="h-14 bg-zinc-950 border-zinc-800 rounded-2xl pl-12 text-white font-mono font-bold focus:ring-violet-500"
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value)}
                    />
                </div>
                <Button className="w-full h-14 rounded-2xl font-black text-lg bg-white text-black hover:bg-zinc-200 shadow-xl" onClick={handleScan}>
                    CHECK TICKET <ArrowRight className="ml-2 w-5 h-5"/>
                </Button>
            </div>
         </Card>

         {/* RIGHT: LIVE FEED & STATS (2/3) */}
         <div className="lg:col-span-2 flex flex-col gap-6 h-full overflow-hidden">
            
            {/* 1. QUICK STATS CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 shrink-0">
                <Card className="bg-zinc-900 border-zinc-800 rounded-[24px] p-5 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-green-500/10 rounded-xl text-green-500"><Ticket className="w-5 h-5"/></div>
                        <Badge variant="outline" className="border-green-900 text-green-500">Total In</Badge>
                    </div>
                    <div className="mt-2">
                        <span className="text-3xl font-black text-white">{GATE_STATS.totalIn}</span>
                        <span className="text-xs text-zinc-500 ml-1 font-bold">Pax</span>
                    </div>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800 rounded-[24px] p-5 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-violet-500/10 rounded-xl text-violet-500"><UserCheck className="w-5 h-5"/></div>
                        <Badge variant="outline" className="border-violet-900 text-violet-500">Athletes</Badge>
                    </div>
                    <div className="mt-2">
                        <span className="text-3xl font-black text-white">{GATE_STATS.athleteCount}</span>
                        <span className="text-xs text-zinc-500 ml-1 font-bold">Check-in</span>
                    </div>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800 rounded-[24px] p-5 flex flex-col justify-between md:col-span-1 col-span-2">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-yellow-500/10 rounded-xl text-yellow-500"><Zap className="w-5 h-5"/></div>
                        <Badge variant="outline" className="border-yellow-900 text-yellow-500">VIP / Media</Badge>
                    </div>
                    <div className="mt-2">
                        <span className="text-3xl font-black text-white">{GATE_STATS.vipCount}</span>
                        <span className="text-xs text-zinc-500 ml-1 font-bold">Guests</span>
                    </div>
                </Card>
            </div>

            {/* 2. RECENT ACTIVITY LOG */}
            <Card className="bg-zinc-900 border-zinc-800 rounded-[32px] flex-1 flex flex-col overflow-hidden">
                <div className="p-6 border-b border-zinc-800 bg-zinc-950/50">
                    <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                        <History className="w-4 h-4 text-violet-500"/> Recent Entry Log
                    </h3>
                </div>
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-3">
                        {RECENT_ENTRIES.map((entry, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-[24px] group hover:border-violet-500/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-12 w-12 border-2 border-zinc-800 group-hover:border-violet-500 transition-colors">
                                        <AvatarImage src={entry.avatar} />
                                        <AvatarFallback className="bg-zinc-900 font-bold text-zinc-500">{entry.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-white text-base">{entry.name}</h4>
                                            <Badge variant="secondary" className="text-[9px] h-5 bg-zinc-900 border border-zinc-700 text-zinc-400">
                                                {entry.id}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-zinc-500 font-medium mt-0.5 flex items-center gap-1.5">
                                            <span className={cn("w-2 h-2 rounded-full", entry.status === 'ALLOWED' ? "bg-green-500" : "bg-red-500")}></span>
                                            {entry.role} • {entry.time}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={cn("font-black text-sm uppercase", entry.status === 'ALLOWED' ? "text-green-500" : "text-red-500")}>
                                        {entry.status}
                                    </div>
                                    <div className="text-[10px] font-bold text-zinc-600">{entry.gate}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </Card>

         </div>

      </div>

      {/* --- RESULT MODAL (POP UP) --- */}
      <Dialog open={!!scanResult} onOpenChange={() => setScanResult(null)}>
        <DialogContent className="bg-transparent border-none shadow-none max-w-sm p-0 flex items-center justify-center">
            {scanResult && (
                <div className={cn(
                    "w-full bg-zinc-950 border-4 rounded-[40px] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300",
                    scanResult.valid ? "border-green-500 shadow-[0_0_50px_rgba(34,197,94,0.4)]" :
                    scanResult.reason === 'UNPAID_BILL' ? "border-yellow-500 shadow-[0_0_50px_rgba(234,179,8,0.4)]" : "border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.4)]"
                )}>
                    {/* Visual Status Header */}
                    <div className={cn(
                        "h-32 flex flex-col items-center justify-center relative overflow-hidden",
                        scanResult.valid ? "bg-green-600" : 
                        scanResult.reason === 'UNPAID_BILL' ? "bg-yellow-600" : "bg-red-600"
                    )}>
                        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-30 mix-blend-overlay"></div>
                        
                        {/* ICON KHUSUS TAGIHAN */}
                        {scanResult.reason === 'UNPAID_BILL' ? (
                             <ShieldAlert className="w-16 h-16 text-white mb-2 drop-shadow-md animate-pulse" />
                        ) : scanResult.valid ? (
                            <CheckCircle2 className="w-16 h-16 text-white mb-2 drop-shadow-md animate-bounce" />
                        ) : (
                            <XCircle className="w-16 h-16 text-white mb-2 drop-shadow-md animate-shake" />
                        )}

                        <h2 className="text-2xl font-black text-white uppercase tracking-widest drop-shadow-md">
                            {scanResult.message}
                        </h2>
                    </div>

                    <div className="p-8 space-y-6 bg-zinc-900 text-center">
                        {scanResult.reason === 'UNPAID_BILL' && (
                             <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl mb-4">
                                <p className="text-red-500 font-bold uppercase text-xs">Total Tagihan Tertunggak</p>
                                <p className="text-3xl font-black text-white font-mono">Rp 56.000</p>
                                <p className="text-zinc-500 text-[10px] mt-1">Shuttlecock Overlimit (Match M-04)</p>
                             </div>
                        )}

                        <div className="space-y-1">
                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Ticket Holder</p>
                            <h3 className="text-2xl font-black text-white">{scanResult.name}</h3>
                            <Badge variant="outline" className="mt-2 border-zinc-700 text-zinc-300">
                                {scanResult.id}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800">
                                <p className="text-[10px] text-zinc-500 font-bold uppercase">Role</p>
                                <p className="font-bold text-white">{scanResult.role}</p>
                            </div>
                            <div className="bg-zinc-900 p-3 rounded-2xl border border-zinc-800">
                                <p className="text-[10px] text-zinc-500 font-bold uppercase">Zone</p>
                                <p className={cn("font-bold", scanResult.valid ? "text-green-500" : "text-red-500")}>
                                    {scanResult.zone}
                                </p>
                            </div>
                        </div>

                        <Button 
                            className="w-full h-14 rounded-2xl font-black text-lg bg-white text-black hover:bg-zinc-200"
                            onClick={() => setScanResult(null)}
                        >
                            CLOSE & SCAN NEXT
                        </Button>
                    </div>
                </div>
            )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
