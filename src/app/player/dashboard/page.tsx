
'use client';

import { useState } from "react";
import Link from "next/link";
import { 
  Trophy, Users, Shield, QrCode, Activity, Calendar, 
  ArrowRight, LogOut, User, Upload, FileText, 
  AlertTriangle, Instagram, History, Info, ChevronRight, 
  Camera, MessageCircle, Download, Gavel, Clock, 
  Share2, RotateCw, AlertOctagon, Send, Hash,
  ChevronLeft, Wallet, CheckCircle2, MapPin
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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// --- MOCK DATA ---
const ATHLETE = {
  id: "ATL-8821",
  name: "Jonathan Christie",
  team: "PB Twinton",
  rank: "PRO",
  points: 8500,
  winRate: 78,
  avatar: "https://github.com/shadcn.png",
};

const PRICES = {
  BEGINNER: 200000,
  INTERMEDIATE: 250000,
  ADVANCE: 300000
};

// --- COMPONENT: FULL DASHBOARD (VIEW 3 - FINAL) ---
function PlayerDashboardFull() {
  const [isIdCardFlipped, setIsIdCardFlipped] = useState(false);
  const [isProtestOpen, setIsProtestOpen] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-zinc-900 border-zinc-800 p-4 flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400"><Trophy className="w-5 h-5"/></div>
                <div><p className="text-[10px] text-zinc-500 uppercase font-bold">Rank</p><p className="text-lg font-black text-white">PRO</p></div>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800 p-4 flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg text-green-400"><Activity className="w-5 h-5"/></div>
                <div><p className="text-[10px] text-zinc-500 uppercase font-bold">Win Rate</p><p className="text-lg font-black text-white">78%</p></div>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800 p-4 flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400"><Users className="w-5 h-5"/></div>
                <div><p className="text-[10px] text-zinc-500 uppercase font-bold">Team</p><p className="text-lg font-black text-white truncate w-20">Twinton</p></div>
            </Card>
            <Card className="bg-red-950/30 border-red-900/50 p-4 flex items-center gap-3 cursor-pointer hover:bg-red-900/50 transition-colors group">
                <div className="p-2 bg-red-500/20 rounded-lg text-red-500 group-hover:animate-pulse"><AlertOctagon className="w-5 h-5"/></div>
                <div><p className="text-[10px] text-red-400 uppercase font-bold">Integritas</p><p className="text-sm font-black text-white">Lapor/Sanggah</p></div>
            </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                {/* ID CARD */}
                <div className="perspective-1000 group cursor-pointer h-[420px] w-full" onClick={() => setIsIdCardFlipped(!isIdCardFlipped)}>
                    <div className={cn("relative w-full h-full transition-all duration-700 transform-style-3d", isIdCardFlipped ? "rotate-y-180" : "")}>
                        <Card className="absolute inset-0 bg-gradient-to-b from-zinc-800 to-black border-2 border-zinc-700 rounded-[32px] overflow-hidden backface-hidden shadow-2xl flex flex-col">
                            <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-20 mix-blend-overlay"></div>
                            <CardContent className="p-6 flex flex-col items-center h-full relative z-10">
                                <div className="flex justify-between w-full mb-6">
                                    <Trophy className="w-6 h-6 text-yellow-500"/>
                                    <span className="font-black text-white tracking-widest text-xs">BCC 2026 OFFICIAL</span>
                                </div>
                                <Avatar className="w-32 h-32 border-4 border-zinc-900 shadow-xl mb-4">
                                    <AvatarImage src={ATHLETE.avatar} className="object-cover"/>
                                    <AvatarFallback>AT</AvatarFallback>
                                </Avatar>
                                <h2 className="text-2xl font-black text-white text-center uppercase leading-none mb-2">{ATHLETE.name}</h2>
                                <Badge className="bg-indigo-600 hover:bg-indigo-700 mb-2">{ATHLETE.team}</Badge>
                                <div className="mt-auto w-full pt-4 border-t border-zinc-800 flex justify-between items-center text-xs text-zinc-400">
                                    <span className="font-mono">{ATHLETE.id}</span>
                                    <span className="flex items-center gap-1 text-cyan-400 font-bold animate-pulse"><RotateCw className="w-3 h-3"/> Flip Card</span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="absolute inset-0 bg-white border-2 border-zinc-200 rounded-[32px] overflow-hidden backface-hidden rotate-y-180 shadow-2xl">
                            <CardContent className="p-8 flex flex-col items-center justify-center h-full text-center space-y-6">
                                <div><h3 className="text-black font-black text-2xl uppercase">Access Pass</h3><p className="text-zinc-500 text-xs">Show to Gate / Umpire</p></div>
                                <div className="p-2 border-4 border-black rounded-xl"><QrCode className="w-40 h-40 text-black"/></div>
                                <span className="flex items-center gap-1 text-cyan-600 font-bold text-xs mt-4"><RotateCw className="w-3 h-3"/> Flip Back</span>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-2">
                <Card className="bg-zinc-900 border-zinc-800 rounded-[32px] p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
                    <Calendar className="w-16 h-16 text-zinc-700 mb-4"/>
                    <h3 className="text-2xl font-bold text-white">Verification in Progress</h3>
                    <p className="text-zinc-500 text-sm max-w-md mt-2">
                        Data pendaftaran Anda sedang diverifikasi oleh Tim Pencari Fakta. Jadwal drawing akan diumumkan H-3 pertandingan.
                    </p>
                </Card>
            </div>
        </div>
    </div>
  );
}

// --- MAIN PAGE ---
export default function PlayerPage() {
  const [hasJoinedTeam, setHasJoinedTeam] = useState(false); 
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false); 

  // Wizard States
  const [joinCode, setJoinCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    agreements: { valid: false, health: false, rules: false, media: false },
    skillLevel: "BEGINNER",
    personal: { name: "", nik: "", dob: "", gender: "M", wa: "", address: "" },
    tpf: { ig: "", history: "" },
    manager: { name: "Budi Santoso", wa: "0812345678" } // Pre-filled from Team
  });

  const totalPrice = PRICES[formData.skillLevel as keyof typeof PRICES];

  // --- HANDLERS ---
  const handleVerifyCode = () => {
    if (!joinCode) return;
    setIsJoining(true);
    setTimeout(() => {
      setIsJoining(false);
      if (joinCode === "TWIN-2026") {
        setHasJoinedTeam(true);
      } else {
        alert("Kode Salah! Coba: TWIN-2026");
      }
    }, 1000);
  };

  const updateAgreement = (key: keyof typeof formData.agreements) => {
    setFormData(prev => ({ ...prev, agreements: { ...prev.agreements, [key]: !prev.agreements[key as keyof typeof prev.agreements] } }));
  };

  const renderWizardContent = () => {
    switch (currentStep) {
        // STEP 1: DISCLAIMER
        case 1:
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                    <div className="bg-red-900/20 border border-red-500/30 p-6 rounded-3xl flex gap-4 items-start">
                        <Shield className="w-8 h-8 text-red-500 shrink-0 mt-1"/>
                        <div className="space-y-1">
                            <h3 className="font-black text-red-100 text-lg uppercase">Perjanjian Atlet</h3>
                            <p className="text-red-200/80 text-xs">Pelanggaran poin ini menyebabkan diskualifikasi permanen.</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {[
                            { id: 'valid', label: 'Validitas Data', desc: 'Data yang saya isi BENAR. Siap didiskualifikasi jika ditemukan pemalsuan.' },
                            { id: 'health', label: 'Kesehatan Fisik', desc: 'Sehat jasmani rohani. Panitia tidak bertanggung jawab atas cedera berat.' },
                            { id: 'rules', label: 'Regulasi', desc: 'Menyetujui aturan main dan keputusan mutlak Wasit/TPF.' },
                            { id: 'media', label: 'Publikasi', desc: 'Mengizinkan dokumentasi foto/video untuk kepentingan acara.' }
                        ].map((item) => (
                            <div key={item.id} className="flex gap-4 items-start p-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 cursor-pointer transition-colors" onClick={() => updateAgreement(item.id as keyof typeof formData.agreements)}>
                                <Checkbox checked={formData.agreements[item.id as keyof typeof formData.agreements]} className="mt-1 border-zinc-600 data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"/>
                                <div>
                                    <Label className="font-bold text-white cursor-pointer text-sm uppercase">{item.label}</Label>
                                    <p className="text-xs text-zinc-400 mt-0.5">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        
        // STEP 2: SKILL LEVEL
        case 2:
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                    <div className="text-center mb-6">
                        <h3 className="text-xl font-black text-white uppercase">Pilih Slot Tim</h3>
                        <p className="text-zinc-400 text-sm">Tim <strong>PB Twinton</strong> membuka slot berikut:</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Object.entries(PRICES).map(([level, price]) => (
                            <div 
                                key={level}
                                onClick={() => setFormData({...formData, skillLevel: level})}
                                className={cn(
                                    "p-6 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden group",
                                    formData.skillLevel === level ? "border-cyan-500 bg-cyan-900/20" : "border-zinc-800 bg-zinc-900 hover:border-zinc-600"
                                )}
                            >
                                <div className="flex justify-between items-start mb-2 relative z-10">
                                    <h4 className="font-black text-white text-lg">{level}</h4>
                                    {formData.skillLevel === level && <CheckCircle2 className="w-6 h-6 text-cyan-500"/>}
                                </div>
                                <p className="text-xs text-zinc-400 mb-4 relative z-10">
                                    {level === 'BEGINNER' ? "Pemula / Hobi" : level === 'INTERMEDIATE' ? "Rutin / Kompetitif" : "Semi-Pro / Eks Atlet"}
                                </p>
                                <Badge className="bg-zinc-950 border border-zinc-700 text-white font-mono">Rp {price.toLocaleString()}</Badge>
                            </div>
                        ))}
                    </div>
                </div>
            );

        // STEP 3: BIODATA & TPF
        case 3:
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                    <div className="grid grid-cols-1 gap-6">
                        <Card className="bg-zinc-900 border-zinc-800 rounded-[32px]">
                            <CardHeader className="border-b border-zinc-800 pb-4"><CardTitle className="text-sm font-black text-white uppercase flex items-center gap-2"><User className="w-4 h-4 text-cyan-500"/> Data Diri Atlet</CardTitle></CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2 col-span-2">
                                        <Label className="text-xs text-zinc-500 font-bold uppercase">Nama Lengkap (KTP)</Label>
                                        <Input className="bg-black border-zinc-800 h-12 rounded-xl" value={formData.personal.name} onChange={(e) => setFormData({...formData, personal: {...formData.personal, name: e.target.value}})} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-zinc-500 font-bold uppercase">NIK (16 Digit)</Label>
                                        <Input className="bg-black border-zinc-800 h-12 rounded-xl" maxLength={16} value={formData.personal.nik} onChange={(e) => setFormData({...formData, personal: {...formData.personal, nik: e.target.value}})} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-zinc-500 font-bold uppercase">Tgl Lahir</Label>
                                        <Input type="date" className="bg-black border-zinc-800 h-12 rounded-xl" value={formData.personal.dob} onChange={(e) => setFormData({...formData, personal: {...formData.personal, dob: e.target.value}})} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-zinc-900 border-zinc-800 rounded-[32px]">
                            <CardHeader className="border-b border-zinc-800 pb-4"><CardTitle className="text-sm font-black text-white uppercase flex items-center gap-2"><Activity className="w-4 h-4 text-red-500"/> Validasi TPF (Wajib)</CardTitle></CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs text-zinc-500 font-bold uppercase">Instagram (Public)</Label>
                                    <div className="relative">
                                        <Instagram className="absolute left-3 top-3.5 w-4 h-4 text-zinc-500"/>
                                        <Input className="bg-black border-zinc-800 pl-10 h-12 rounded-xl" placeholder="@username" value={formData.tpf.ig} onChange={(e) => setFormData({...formData, tpf: {...formData.tpf, ig: e.target.value}})} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-zinc-500 font-bold uppercase">Riwayat Prestasi</Label>
                                    <Textarea className="bg-black border-zinc-800 min-h-[80px] rounded-xl" placeholder="Sebutkan turnamen terakhir..." value={formData.tpf.history} onChange={(e) => setFormData({...formData, tpf: {...formData.tpf, history: e.target.value}})} />
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <div className="h-20 bg-black border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center text-zinc-600 hover:text-white cursor-pointer"><Upload className="w-4 h-4 mb-1"/><span className="text-[9px] font-bold uppercase">Foto KTP</span></div>
                                    <div className="h-20 bg-black border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center text-zinc-600 hover:text-white cursor-pointer"><Upload className="w-4 h-4 mb-1"/><span className="text-[9px] font-bold uppercase">Foto Diri</span></div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            );

        // STEP 4: MANAGER
        case 4:
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300 max-w-xl mx-auto">
                    <Card className="bg-zinc-900 border-zinc-800 rounded-[32px] p-8 text-center">
                        <div className="w-16 h-16 bg-zinc-800 rounded-full mx-auto flex items-center justify-center mb-4"><Users className="w-8 h-8 text-white"/></div>
                        <h3 className="text-xl font-black text-white mb-2">Kontak Manajer</h3>
                        <p className="text-zinc-400 text-sm mb-6">Data ini diambil dari database tim. Pastikan ini adalah orang yang benar.</p>
                        <div className="bg-black p-4 rounded-2xl border border-zinc-800 text-left space-y-3">
                            <div>
                                <p className="text-[10px] text-zinc-500 uppercase font-bold">Nama Manajer</p>
                                <p className="text-white font-bold">{formData.manager.name}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-zinc-500 uppercase font-bold">No. WhatsApp</p>
                                <p className="text-white font-mono">{formData.manager.wa}</p>
                            </div>
                        </div>
                    </Card>
                </div>
            );

        // STEP 5: PAYMENT
        case 5:
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300 max-w-xl mx-auto">
                    <Card className="bg-gradient-to-br from-zinc-900 to-black border-zinc-800 rounded-[32px] p-8">
                        <div className="text-center mb-8">
                            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-2">Total Tagihan</p>
                            <h2 className="text-5xl font-black text-white">Rp {totalPrice.toLocaleString()}</h2>
                            <Badge variant="outline" className="mt-4 border-cyan-500 text-cyan-400">{formData.skillLevel} CLASS</Badge>
                        </div>
                        <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 space-y-4 mb-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3"><Wallet className="w-5 h-5 text-white"/><span className="text-sm font-bold text-zinc-300">Bank BJB</span></div>
                                <span className="font-mono text-white font-bold">0012-3456-7890</span>
                            </div>
                            <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
                                <div className="flex items-center gap-3"><QrCode className="w-5 h-5 text-white"/><span className="text-sm font-bold text-zinc-300">QRIS</span></div>
                                <span className="text-xs text-zinc-500">Panitia BCC 2026</span>
                            </div>
                        </div>
                        <div className="h-28 bg-zinc-900 border-2 border-dashed border-zinc-700 rounded-2xl flex flex-col items-center justify-center text-zinc-500 hover:text-white hover:border-cyan-500 cursor-pointer transition-all">
                            <Upload className="w-6 h-6 mb-2"/>
                            <span className="text-xs font-bold uppercase">Upload Bukti Transfer</span>
                        </div>
                    </Card>
                </div>
            );
        default: return null;
    }
  };

  // --- RENDER VIEW 1: GATE ---
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
                  Masukkan <strong>Kode Unik</strong> yang diberikan oleh Manajer Tim/Komunitas untuk membuka formulir.
                </p>
            </div>

            <div className="space-y-4">
                <Input 
                    placeholder="CONTOH: TWIN-2026" 
                    className="bg-black border-zinc-700 h-16 text-center text-2xl font-mono uppercase tracking-[0.2em] text-white rounded-2xl focus:border-cyan-500 focus:ring-0 placeholder:text-zinc-800"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    maxLength={9}
                />
                <Button 
                    onClick={handleVerifyCode} 
                    disabled={isJoining || joinCode.length < 5} 
                    className="w-full h-14 rounded-2xl bg-white hover:bg-zinc-200 text-black font-black text-lg shadow-xl"
                >
                    {isJoining ? "VERIFYING..." : "ENTER SQUAD"} <ArrowRight className="ml-2 w-5 h-5"/>
                </Button>
            </div>
        </div>
      </Card>
      <p className="text-zinc-600 text-xs mt-8 font-mono relative z-10">BCC 2026 • OFFICIAL REGISTRATION PORTAL</p>
    </div>
    );
  }

  // --- RENDER VIEW 2: WIZARD FORM ---
  if (!isRegistrationComplete) {
    return (
      <div className="min-h-screen bg-zinc-950 font-body py-8 px-4 md:py-12">
        <div className="max-w-4xl mx-auto">
            <div className="mb-10 text-center space-y-4">
                <Badge variant="outline" className="border-indigo-500 text-indigo-400 px-4 py-1 tracking-widest uppercase">Joining: PB TWINTON</Badge>
                <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">Athlete Data</h1>
                <div className="flex items-center justify-center gap-2 mt-4">
                    {[1,2,3,4,5].map(step => (
                        <div key={step} className={cn("h-1.5 rounded-full transition-all duration-300", currentStep >= step ? "bg-cyan-500 w-8" : "bg-zinc-800 w-4")}></div>
                    ))}
                </div>
            </div>

            {renderWizardContent()}

            <div className="flex justify-between mt-12 pt-6 border-t border-zinc-800">
                <Button variant="ghost" onClick={() => setCurrentStep(p => Math.max(1, p-1))} disabled={currentStep===1} className="h-14 px-8 rounded-2xl text-zinc-500 hover:text-white hover:bg-zinc-900 font-bold"><ChevronLeft className="w-5 h-5 mr-2"/> BACK</Button>
                
                {currentStep === 5 ? (
                    <Button onClick={() => setIsRegistrationComplete(true)} className="h-14 px-10 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-black text-lg shadow-lg shadow-green-900/20">
                        SUBMIT REGISTRATION <CheckCircle2 className="ml-3 w-5 h-5"/>
                    </Button>
                ) : (
                    <Button onClick={handleNextStep} disabled={currentStep === 1 && !Object.values(formData.agreements).every(Boolean)} className="h-14 px-10 rounded-2xl bg-white text-black hover:bg-zinc-200 font-bold text-lg">
                        NEXT STEP <ChevronRight className="w-5 h-5 ml-2"/>
                    </Button>
                )}
            </div>
        </div>
      </div>
    );
  }

  // --- RENDER VIEW 3: DASHBOARD ---
  return (
    <div className="min-h-screen bg-zinc-950 font-body pb-24">
        {/* Universal Navbar */}
        <div className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 px-4 md:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2"><Trophy className="w-6 h-6 text-cyan-500"/><span className="font-black text-white tracking-tighter hidden md:inline text-lg">PLAYER DASHBOARD</span></div>
            <div className="flex items-center gap-4">
                <div className="text-right hidden md:block"><p className="text-xs font-bold text-white">Guest Athlete</p><p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">PB Twinton</p></div>
                <Avatar className="h-10 w-10 border-2 border-zinc-800 ring-2 ring-black"><AvatarFallback>GA</AvatarFallback></Avatar>
                <div className="h-8 w-[1px] bg-zinc-800 mx-2"></div>
                <Link href="/" passHref><Button variant="ghost" size="icon" className="text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl"><LogOut className="w-5 h-5"/></Button></Link>
            </div>
        </div>
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            <PlayerDashboardFull />
        </div>
    </div>
  );
}
```