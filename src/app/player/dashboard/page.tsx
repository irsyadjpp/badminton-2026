
'use client';

import { useState, useEffect } from "react";
import { 
  Trophy, Users, Shield, QrCode, 
  Activity, Calendar, MapPin, Hash, 
  ArrowRight, CheckCircle2, LogOut,
  User, Mail, Phone, Home, Crown, RefreshCcw, FileText
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// --- MOCK DATA ---
const ATHLETE_INITIAL_DATA = {
  id: "ATL-2026-007",
  name: "Jonathan Christie",
  rank: "PRO",
  points: 8500,
  winRate: 78,
  avatar: "https://github.com/shadcn.png",
  verificationStatus: "VERIFIED" as "PENDING" | "VERIFIED" | "ISSUE", // SIMULASI VERIFIED
  team: { 
    name: "PB Djarum Official", 
    logo: "/logos/djarum.png", 
    role: "Athlete" 
  } as { name: string; logo: string; role: string } | null 
};

const UPCOMING_MATCH = {
  event: "Babak Penyisihan - MS Open",
  opponent: "Anthony Ginting",
  court: "Court 1 (TV)",
  time: "Besok, 10:00 WIB"
};

// STATE SIMULASI UNTUK DEVELOPMENT:
const DEV_MODE_ENABLED = process.env.NODE_ENV === 'development';


export default function AthleteDashboard() {
  const [athlete, setAthlete] = useState(ATHLETE_INITIAL_DATA);
  const [joinCode, setJoinCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Set initial state to false to ensure server and client match
  const [hasJoinedTeam, setHasJoinedTeam] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  // For development, use useEffect to change state after initial render
  useEffect(() => {
    if (DEV_MODE_ENABLED) {
      setHasJoinedTeam(true);
      setIsProfileComplete(true);
    }
  }, []);

  // Simulasi Join Team (Tetap ada, tapi tidak dipanggil di awal)
  const handleJoinTeam = () => {
    if (!joinCode) return;
    setIsJoining(true);

    setTimeout(() => {
      setIsJoining(false);
      setAthlete(prev => ({
        ...prev,
        team: {
          name: "PB Djarum Official",
          logo: "/logos/djarum.png",
          role: "Athlete"
        }
      }));
      setHasJoinedTeam(true); // Pindah ke Step 2
      setShowSuccessModal(true);
    }, 1500);
  };
  
  // Simulasi Submit Data Diri (Tetap ada)
  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileComplete(true); // Pindah ke Step 3 (Full Dashboard)
  }

  // --- RENDER FUNCTIONS ---
  
  const renderJoinTeam = () => (
    <Card className="bg-zinc-900 border-zinc-800 rounded-[32px] overflow-hidden relative border-dashed border-2 p-12 max-w-xl mx-auto">
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4 text-center mx-auto max-w-md">
            <h3 className="text-3xl font-black text-white">Squad Synchronization</h3>
        </div>
        <p className="text-zinc-400 text-sm text-center">
            Minta <strong>Kode Unik Komunitas</strong> dari manajer/kapten tim Anda untuk mendaftar ke kompetisi.
        </p>
        <div className="w-full bg-black p-6 rounded-3xl border border-zinc-800 flex flex-col gap-4">
            <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Input Team Token</label>
                <div className="relative">
                    <Hash className="absolute left-4 top-4 w-5 h-5 text-zinc-500"/>
                    <Input 
                        placeholder="XXX-0000" 
                        className="h-14 pl-12 rounded-2xl bg-zinc-900 border-zinc-700 text-white font-mono text-lg uppercase tracking-widest focus:ring-cyan-500 focus:border-cyan-500"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                        maxLength={8}
                    />
                </div>
            </div>
            <Button 
                onClick={handleJoinTeam}
                disabled={!joinCode || isJoining}
                className="h-14 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-black text-lg shadow-lg shadow-cyan-900/20"
            >
                {isJoining ? "SYNCING..." : "JOIN SQUAD"}
            </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderCompleteProfile = () => (
    <Card className="bg-zinc-900 border-zinc-800 rounded-[32px] p-8 max-w-4xl mx-auto space-y-8">
        <header className="text-center space-y-2">
            <RefreshCcw className="w-10 h-10 text-indigo-500 mx-auto animate-spin-slow"/>
            <h3 className="text-3xl font-black text-white">Final Step: Complete Profile</h3>
            <p className="text-zinc-400">Data ini dibutuhkan untuk verifikasi dokumen dan pengelompokan kategori.</p>
            <div className="flex items-center justify-center gap-2 pt-2">
                <Badge className="bg-indigo-600 text-white border-none">Squad: {athlete.team?.name}</Badge>
            </div>
        </header>

        <form onSubmit={handleSubmitProfile} className="space-y-6 pt-4">
            {/* Row 1: Core Identity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Nama Lengkap (Sesuai KTP)</label>
                    <Input placeholder="Nama Anda" className="bg-black border-zinc-800 h-12 rounded-xl text-white" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Tanggal Lahir</label>
                    <Input type="date" className="bg-black border-zinc-800 h-12 rounded-xl text-white" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500 ml-1">No. HP / WhatsApp</label>
                    <Input placeholder="08xx-xxxx-xxxx" className="bg-black border-zinc-800 h-12 rounded-xl text-white" />
                </div>
            </div>
            
            {/* Row 2: Category & Documents */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Kategori Diikuti</label>
                    <Select>
                        <SelectTrigger className="bg-black border-zinc-800 h-12 rounded-xl text-white"><SelectValue placeholder="Pilih Kelas Pertandingan" /></SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                            <SelectItem value="MS">MS Open</SelectItem>
                            <SelectItem value="WD">WD U-19</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Alamat Domisili</label>
                    <Input placeholder="Kota/Kabupaten" className="bg-black border-zinc-800 h-12 rounded-xl text-white" />
                </div>
            </div>

            {/* Row 3: Document Upload */}
            <div className="space-y-4 pt-4 border-t border-zinc-800">
                <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase text-zinc-500 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-cyan-500"/> Document Upload (Max 2MB)
                    </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="aspect-video bg-black border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center text-zinc-600 hover:text-cyan-500 cursor-pointer">
                        <Upload className="w-6 h-6"/> <span className="text-xs">KTP / ID Card</span>
                    </div>
                    <div className="aspect-video bg-black border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center text-zinc-600 hover:text-cyan-500 cursor-pointer">
                        <Upload className="w-6 h-6"/> <span className="text-xs">Akte Kelahiran</span>
                    </div>
                    <div className="aspect-video bg-black border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center text-zinc-600 hover:text-cyan-500 cursor-pointer">
                        <Upload className="w-6 h-6"/> <span className="text-xs">Foto Profil</span>
                    </div>
                </div>
            </div>

            <Button type="submit" className="w-full h-14 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg shadow-lg shadow-indigo-900/20 mt-6">
                SUBMIT & START VERIFICATION
            </Button>
        </form>
    </Card>
  );

  const renderFullDashboard = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
        {/* LEFT: PLAYER CARD (1/3) */}
        <div className="lg:col-span-1 space-y-6">
            <Card className="bg-gradient-to-b from-zinc-900 to-black border-zinc-800 rounded-[32px] overflow-hidden relative shadow-2xl">
                <CardContent className="p-8 text-center relative z-10">
                    <div className="relative inline-block">
                        <Avatar className="w-32 h-32 border-4 border-zinc-900 shadow-xl mb-4">
                            <AvatarImage src={athlete.avatar} />
                            <AvatarFallback className="bg-zinc-800 text-2xl font-black text-zinc-500">{athlete.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-500 text-black font-black border-4 border-zinc-900">
                            {athlete.rank}
                        </Badge>
                    </div>
                    
                    <h2 className="text-2xl font-black text-white uppercase leading-tight mb-1">{athlete.name}</h2>
                    <p className="text-zinc-500 text-sm font-bold mb-6">Mens Singles Specialist</p>

                    <div className="grid grid-cols-2 gap-4 border-t border-zinc-800 pt-6">
                        <div>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase">Points</p>
                            <p className="text-xl font-black text-white">{athlete.points}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase">Win Rate</p>
                            <p className="text-xl font-black text-green-500">{athlete.winRate}%</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className={cn(
                "bg-zinc-900 border rounded-[32px] p-6",
                athlete.verificationStatus === 'VERIFIED' ? "border-green-500/50" : "border-yellow-500/50"
            )}>
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-cyan-500"/> Verification Status
                </h3>
                <div className="flex justify-between items-center">
                    <div className="space-y-1">
                        <p className={cn("text-xl font-black", athlete.verificationStatus === 'VERIFIED' ? "text-green-500" : "text-yellow-500 animate-pulse")}>
                            {athlete.verificationStatus === 'VERIFIED' ? "VERIFIED" : "PENDING"}
                        </p>
                        <p className="text-zinc-400 text-sm">Status dokumen oleh Sekretariat.</p>
                    </div>
                    <Button size="icon" className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400">
                        <FileText className="w-5 h-5"/>
                    </Button>
                </div>
            </Card>
        </div>

        {/* RIGHT: TEAM & HISTORY (2/3) */}
        <div className="lg:col-span-2 space-y-6">
            
            <Card className="bg-indigo-950/20 border-indigo-500/30 rounded-[32px] overflow-hidden relative">
                <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-6">
                        <div className="h-20 w-20 bg-white p-2 rounded-2xl shadow-lg transform -rotate-3">
                            <img src={athlete.team?.logo} alt="Team Logo" className="w-full h-full object-contain"/>
                        </div>
                        <div>
                            <Badge className="bg-indigo-500 hover:bg-indigo-600 text-white mb-2">MY SQUAD</Badge>
                            <h3 className="text-3xl font-black text-white">{athlete.team?.name}</h3>
                            <p className="text-indigo-300 text-sm font-bold flex items-center gap-2">
                                <Shield className="w-4 h-4"/> Registered as {athlete.team?.role}
                            </p>
                        </div>
                    </div>
                    <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 h-12 rounded-xl">
                        <User className="w-4 h-4 mr-2"/> MANAGE PROFILE
                    </Button>
                </CardContent>
            </Card>
            
            <Card className="bg-zinc-900 border-zinc-800 rounded-[32px] p-6 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500"></div>
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-red-500"/> Next Match
                </h3>
                <div className="space-y-1">
                    <p className="text-lg font-bold text-white">{UPCOMING_MATCH.opponent}</p>
                    <p className="text-xs text-zinc-400">{UPCOMING_MATCH.event}</p>
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-zinc-800/50">
                        <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-300">{UPCOMING_MATCH.court}</Badge>
                        <span className="text-[10px] text-red-400 font-bold animate-pulse">{UPCOMING_MATCH.time}</span>
                    </div>
                </div>
            </Card>

            <Card className="bg-zinc-900/50 border border-zinc-800/50 rounded-[32px] flex-1">
                <div className="p-6 border-b border-zinc-800">
                    <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest">Performance History</h3>
                </div>
                <ScrollArea className="h-64">
                    <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-[20px] hover:bg-zinc-800 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-12 rounded-full bg-green-500"></div>
                                <div>
                                    <p className="text-sm font-bold text-white">vs. Gideon/Sukamuljo</p>
                                    <p className="text-xs text-zinc-500">MD Open • Round of 16</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-black font-mono text-green-500">W 21-19</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-[20px] hover:bg-zinc-800 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-12 rounded-full bg-red-500"></div>
                                <div>
                                    <p className="text-sm font-bold text-white">vs. Lee Chong Wei</p>
                                    <p className="text-xs text-zinc-500">MS Open • Quarter Final</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-black font-mono text-red-500">L 15-21</p>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </Card>

         </div>
    </div>
  );

  // --- MAIN RENDER LOGIC ---
  let mainContent;
  if (!hasJoinedTeam) {
    mainContent = renderJoinTeam();
  } else if (!isProfileComplete) {
    mainContent = renderCompleteProfile();
  } else {
    mainContent = renderFullDashboard();
  }

  return (
    <div className="space-y-8 p-4 md:p-8 font-body pb-24 max-w-5xl mx-auto">
      
      {/* Dynamic Header */}
      <div className="flex justify-between items-start md:items-end gap-6 shrink-0">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="rounded-full px-3 py-1 border-cyan-500 text-cyan-500 bg-cyan-500/10 backdrop-blur-md">
                    <Activity className="w-3 h-3 mr-2" /> ATHLETE PORTAL
                </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-black font-headline uppercase tracking-tighter text-white">
                Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">{athlete.name.split(' ')[0]}</span>
            </h1>
        </div>
        {/* Tombol Logout ada di semua state */}
        <Button variant="outline" className="h-12 rounded-full border-zinc-700 text-zinc-300 hover:bg-zinc-800">
            <LogOut className="w-4 h-4 mr-2"/> Logout
        </Button>
      </div>

      {mainContent}

      {/* --- SUCCESS MODAL (for Joining Team) --- */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-white rounded-[40px] max-w-sm p-0 overflow-hidden text-center">
            <div className="p-8 flex flex-col items-center">
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <CheckCircle2 className="w-12 h-12 text-green-500"/>
                </div>
                <h2 className="text-2xl font-black uppercase mb-2">Squad Sync Successful!</h2>
                <p className="text-zinc-400 text-sm mb-6">
                    Anda berhasil bergabung dengan:
                    <br/><strong className="text-white text-lg">{athlete.team?.name}</strong>
                </p>
                <Button 
                    className="w-full h-14 rounded-2xl bg-white text-black font-bold hover:bg-zinc-200"
                    onClick={() => setShowSuccessModal(false)}
                >
                    LANJUTKAN PENGISIAN DATA
                </Button>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

    