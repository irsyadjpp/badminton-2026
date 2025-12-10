
'use client';

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  Trophy, Users, Shield, QrCode, Activity, Calendar, 
  ArrowRight, LogOut, User, Upload, FileText, 
  AlertTriangle, Instagram, History, Info, ChevronRight, 
  Camera, MessageCircle, Download, Gavel, Clock, 
  Share2, RotateCw, AlertOctagon, Send, Paperclip, 
  MoreVertical, CheckCheck, Smile, Plus, Hash, ChevronLeft
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { PlayerDashboardFull } from "@/components/player/dashboard-full";

// --- CONSTANTS & MOCK DATA ---
const PRICES = {
  BEGINNER: 200000,
  INTERMEDIATE: 250000,
  ADVANCE: 300000
};

// =================================================================================================
// MAIN PAGE COMPONENT (CONTROLLER)
// =================================================================================================
export default function PlayerPage() {
  // === STATE DEVELOPMENT ===
  // Logic: Default false agar selalu mulai dari Input Code saat refresh
  const [hasJoinedTeam, setHasJoinedTeam] = useState(false); 
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false); 
  
  // -- Simulasi Alur Cepat untuk Development --
  useEffect(() => {
    // Set ke `false` untuk melihat halaman "Input Kode"
    // setHasJoinedTeam(false); 
    // Set `hasJoinedTeam` true & `isRegistrationComplete` false untuk melihat "Wizard"
    setHasJoinedTeam(true); 
    setIsRegistrationComplete(false);
    // Set keduanya `true` untuk melihat "Dashboard Full"
    // setHasJoinedTeam(true); 
    // setIsRegistrationComplete(true);
  }, []);
  // ============================================

  // Wizard States
  const [joinCode, setJoinCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({ 
    agreements: { valid: false, health: false, rules: false, media: false }, 
    skillLevel: "BEGINNER" 
  });

  // HANDLERS
  const handleVerifyCode = () => {
    if (!joinCode) return;
    setIsJoining(true);
    setTimeout(() => {
      setIsJoining(false);
      // Ganti dengan logic verifikasi kode tim yang sebenarnya
      if (joinCode === "TWIN-2026") { // Contoh kode valid
        setHasJoinedTeam(true);
      } else {
        alert("Kode Salah! Coba: TWIN-2026");
      }
    }, 1000);
  };

  const handleNextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const handlePrevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  // --- RENDER VIEW 1: GATE (INPUT CODE) ---
  if (!hasJoinedTeam) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 font-body relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <Card className="w-full max-w-lg bg-zinc-900/80 backdrop-blur-xl border-zinc-800 rounded-[40px] p-8 md:p-12 border-dashed border-2 relative overflow-hidden shadow-2xl">
          <div className="text-center space-y-8 relative z-10">
            <div className="w-20 h-20 bg-gradient-to-br from-zinc-800 to-black rounded-3xl mx-auto flex items-center justify-center border border-zinc-700 shadow-inner">
                <Hash className="w-10 h-10 text-white"/>
            </div>
            
            <div>
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Team Access</h2>
                <p className="text-zinc-400 text-sm mt-3 leading-relaxed px-4">
                  Masukkan <strong>Kode Unik</strong> yang diberikan oleh Manajer Tim/Komunitas untuk membuka formulir pendaftaran.
                </p>
            </div>

            <div className="space-y-4">
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition-opacity"></div>
                    <Input 
                        placeholder="CONTOH: TWIN-2026" 
                        className="relative bg-black border-zinc-700 h-16 text-center text-2xl font-mono uppercase tracking-[0.2em] text-white rounded-2xl focus:border-cyan-500 focus:ring-0 placeholder:text-zinc-800 transition-all"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                        maxLength={9}
                    />
                </div>
                <Button 
                    onClick={handleVerifyCode} 
                    disabled={isJoining || joinCode.length < 5} 
                    className="w-full h-14 rounded-2xl bg-white hover:bg-zinc-200 text-black font-black text-lg shadow-xl transition-transform active:scale-95"
                >
                    {isJoining ? "VERIFYING..." : "ENTER TEAM SQUAD"} <ArrowRight className="ml-2 w-5 h-5"/>
                </Button>
            </div>
          </div>
        </Card>
        
        <p className="text-zinc-600 text-xs mt-8 font-mono">BCC 2026 • OFFICIAL REGISTRATION PORTAL</p>
      </div>
    );
  }

  // --- RENDER VIEW 2: WIZARD FORM ---
  if (!isRegistrationComplete) {
    return (
      <div className="min-h-screen bg-zinc-950 font-body py-8 px-4 md:py-12">
        <div className="max-w-3xl mx-auto">
            <div className="mb-10 text-center space-y-4">
                <Badge variant="outline" className="border-indigo-500 text-indigo-400 px-4 py-1 tracking-widest uppercase">Joining: PB TWINTON</Badge>
                <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">Athlete Data</h1>
                
                <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden mt-6">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-indigo-600 transition-all duration-500 ease-out" style={{ width: `${(currentStep/5)*100}%` }}></div>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-2 px-1">
                    <span>Agreement</span>
                    <span>Skill</span>
                    <span>Bio</span>
                    <span>Contact</span>
                    <span>Pay</span>
                </div>
            </div>

            <Card className="bg-zinc-900 border-zinc-800 rounded-[40px] p-8 md:p-10 min-h-[400px] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="relative z-10">
                    {currentStep === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                            <div className="bg-red-950/30 border border-red-500/30 p-5 rounded-2xl flex gap-4 text-red-200 text-sm">
                                <AlertTriangle className="w-6 h-6 shrink-0 text-red-500 mt-1"/>
                                <div>
                                    <p className="font-bold text-red-400 mb-1">DISCLAIMER PENTING</p>
                                    <p>Pemalsuan data (umur/skill) akan menyebabkan <strong>Tim Diskualifikasi</strong> dan <strong>Uang Pendaftaran Hangus</strong>.</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {['Saya menyatakan data yang diisi adalah BENAR.', 'Saya dalam kondisi SEHAT jasmani & rohani.', 'Saya menyetujui REGULASI pertandingan.', 'Saya mengizinkan PUBLIKASI foto/video.'].map((text, i) => (
                                    <div key={i} className="flex gap-4 items-start p-4 bg-black/40 rounded-2xl border border-zinc-800/50 hover:border-zinc-700 cursor-pointer transition-colors" onClick={() => setFormData(p => ({...p, agreements: {...p.agreements, valid: true}}))}>
                                        <Checkbox id={`chk-${i}`} checked={formData.agreements.valid} className="mt-1 border-zinc-600 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"/>
                                        <Label htmlFor={`chk-${i}`} className="text-zinc-300 cursor-pointer leading-relaxed">{text}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {currentStep > 1 && (
                        <div className="text-center py-16 animate-in fade-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-zinc-800 rounded-3xl mx-auto flex items-center justify-center mb-6 animate-pulse">
                                <FileText className="w-10 h-10 text-zinc-600"/>
                            </div>
                            <h3 className="text-white text-2xl font-black mb-2 uppercase">Step {currentStep}: Form Placeholder</h3>
                            <p className="text-zinc-500 text-sm max-w-sm mx-auto mb-8">
                                Di tahap ini, form lengkap (Skill, Biodata, TPF, Pembayaran) akan muncul sesuai desain sebelumnya.
                            </p>
                            {currentStep === 5 && (
                                <Button 
                                    onClick={() => setIsRegistrationComplete(true)} 
                                    className="h-16 px-10 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-black text-xl shadow-[0_0_30px_rgba(22,163,74,0.4)] transition-transform hover:scale-105"
                                >
                                    SUBMIT & FINISH <CheckCircle2 className="ml-3 w-6 h-6"/>
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </Card>

            <div className="flex justify-between mt-8 px-2">
                <Button variant="ghost" onClick={handlePrevStep} disabled={currentStep===1} className="h-14 px-8 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-900">
                    <ChevronLeft className="w-5 h-5 mr-2"/> BACK
                </Button>
                
                {currentStep < 5 && (
                    <Button onClick={handleNextStep} className="h-14 px-8 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-lg shadow-lg">
                        NEXT STEP <ChevronRight className="w-5 h-5 ml-2"/>
                    </Button>
                )}
            </div>
        </div>
      </div>
    );
  }

  // --- RENDER VIEW 3: FULL DASHBOARD ---
  return (
    <div className="min-h-screen bg-zinc-950 font-body pb-24">
        <div className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 px-4 md:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="bg-cyan-500/20 p-2 rounded-lg"><Trophy className="w-5 h-5 text-cyan-500"/></div>
                <span className="font-black text-white tracking-tighter hidden md:inline text-lg">PLAYER DASHBOARD</span>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                    <p className="text-xs font-bold text-white">{ATHLETE_MOCK.name}</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{ATHLETE_MOCK.team}</p>
                </div>
                <Avatar className="h-10 w-10 border-2 border-zinc-800 ring-2 ring-black">
                    <AvatarImage src={ATHLETE_MOCK.avatar} />
                    <AvatarFallback>PL</AvatarFallback>
                </Avatar>
                <div className="h-8 w-[1px] bg-zinc-800 mx-2"></div>
                <Link href="/" passHref>
                    <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl"><LogOut className="w-5 h-5"/></Button>
                </Link>
            </div>
        </div>
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            <PlayerDashboardFull />
        </div>
    </div>
  );
}
