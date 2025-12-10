
'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Trophy, Users, Shield, QrCode, Activity, Calendar, 
  ArrowRight, LogOut, User, Upload, FileText, 
  AlertTriangle, Instagram, History, Info, ChevronRight, 
  Camera, MessageCircle, Download, Gavel, Clock, 
  Share2, RotateCw, AlertOctagon, Send, Paperclip, 
  MoreVertical, CheckCheck, Smile, Plus, Hash, ChevronLeft, CheckCircle2,
  Heart, Wallet, Banknote, CreditCard, Sparkles, UserRound, Footprints,
  Save
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import PlayerDashboardFull from "@/components/player/dashboard-full";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";


// --- CONSTANTS & MOCK DATA ---
const PRICES = {
  BEGINNER: 200000,
  INTERMEDIATE: 250000,
  ADVANCE: 300000
};

// --- SUB-COMPONENTS for WIZARD ---

function WizardStepAgreement({ formData, setFormData }: any) {
    const agreements = [
        { id: 'valid', text: 'Saya menyatakan data yang diisi adalah BENAR.' },
        { id: 'health', text: 'Saya dalam kondisi SEHAT jasmani & rohani.' },
        { id: 'rules', text: 'Saya menyetujui REGULASI pertandingan.' },
        { id: 'media', text: 'Saya mengizinkan PUBLIKASI foto/video.' },
    ];

    const handleAgreementClick = (id: keyof typeof formData.agreements) => {
        setFormData((prev: any) => ({
            ...prev,
            agreements: {
                ...prev.agreements,
                [id]: !prev.agreements[id]
            }
        }));
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
            <div className="bg-red-950/30 border border-red-500/30 p-5 rounded-2xl flex gap-4 text-red-200 text-sm">
                <AlertTriangle className="w-6 h-6 shrink-0 text-red-500 mt-1"/>
                <div>
                    <p className="font-bold text-red-400 mb-1">DISCLAIMER PENTING</p>
                    <p>Pemalsuan data (umur/skill) akan menyebabkan <strong>Tim Diskualifikasi</strong> dan <strong>Uang Pendaftaran Hangus</strong>.</p>
                </div>
            </div>
            <div className="space-y-4">
                {agreements.map((item) => (
                    <div 
                        key={item.id} 
                        className="flex gap-4 items-start p-4 bg-black/40 rounded-2xl border border-zinc-800/50 hover:border-zinc-700 cursor-pointer transition-colors"
                        onClick={() => handleAgreementClick(item.id as any)}
                    >
                        <Checkbox 
                            id={`chk-${item.id}`} 
                            checked={formData.agreements[item.id]}
                            className="mt-1 border-zinc-600 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                        />
                        <Label htmlFor={`chk-${item.id}`} className="text-zinc-300 cursor-pointer leading-relaxed">{item.text}</Label>
                    </div>
                ))}
            </div>
        </div>
    );
}

function WizardStepSkillLevel({ formData, setFormData }: any) {
  const levels = [
    { id: 'BEGINNER', label: 'Beginner', desc: 'Pemula Komunitas (Grip Panci)', icon: <Smile className="w-8 h-8"/>, color: "green" },
    { id: 'INTERMEDIATE', label: 'Intermediate', desc: 'Pemain Rutin (Teknik Dasar OK)', icon: <UserRound className="w-8 h-8"/>, color: "blue" },
    { id: 'ADVANCE', label: 'Advance', desc: 'Skill di Atas Rata-rata', icon: <Footprints className="w-8 h-8"/>, color: "purple" },
  ];
  const selectedLevel = levels.find(l => l.id === formData.skillLevel);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
      <div className="text-center">
        <h3 className="text-white text-xl font-black mb-1 uppercase tracking-widest">Pilih Level Anda</h3>
        <p className="text-zinc-500 text-sm max-w-sm mx-auto">
          Pilih level yang paling sesuai dengan kemampuan Anda saat ini. Jujur ya!
        </p>
      </div>
      <ToggleGroup 
        type="single" 
        defaultValue={formData.skillLevel} 
        onValueChange={(value) => { if(value) setFormData((prev:any) => ({ ...prev, skillLevel: value }))}}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {levels.map((level) => (
          <ToggleGroupItem 
            key={level.id} 
            value={level.id} 
            className="h-auto p-6 rounded-3xl border-2 border-zinc-800 bg-zinc-900 data-[state=on]:border-cyan-500 data-[state=on]:bg-cyan-950/20 flex flex-col gap-4 text-left items-start transition-all hover:border-zinc-700"
          >
            <div className={`w-14 h-14 rounded-2xl bg-${level.color}-500/10 text-${level.color}-500 flex items-center justify-center`}>
                {level.icon}
            </div>
            <div className="text-left">
                <p className="font-bold text-lg text-white">{level.label}</p>
                <p className="text-xs text-zinc-400 leading-snug">{level.desc}</p>
            </div>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-center">
        <p className="text-xs text-zinc-500 mb-1">Estimasi Biaya Pendaftaran per Kategori:</p>
        <p className="font-mono text-2xl font-bold text-cyan-400">
          Rp {PRICES[formData.skillLevel as keyof typeof PRICES].toLocaleString('id-ID')}
        </p>
      </div>
    </div>
  );
}

function WizardStepProfile({ formData, setFormData }: any) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev: any) => ({ ...prev, profile: { ...prev.profile, [e.target.name]: e.target.value }}));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
      <div className="text-center mb-4">
        <h3 className="text-white text-xl font-black mb-1 uppercase tracking-widest">Lengkapi Profil</h3>
        <p className="text-zinc-500 text-sm max-w-sm mx-auto">
          Data ini akan digunakan oleh TPF untuk verifikasi & panitia untuk logistik.
        </p>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input name="nik" placeholder="NIK KTP (16 Digit)" onChange={handleInputChange} className="h-12 bg-black border-zinc-800"/>
          <Input name="phone" placeholder="No. WhatsApp" onChange={handleInputChange} className="h-12 bg-black border-zinc-800"/>
        </div>
        <RadioGroup name="gender" onValueChange={(v) => setFormData((p:any) => ({...p, profile: {...p.profile, gender: v}}))} className="grid grid-cols-2 gap-4">
            <Label className="flex items-center gap-3 p-3 bg-black border border-zinc-800 rounded-xl cursor-pointer hover:border-zinc-700">
                <RadioGroupItem value="MALE"/> Putra
            </Label>
            <Label className="flex items-center gap-3 p-3 bg-black border border-zinc-800 rounded-xl cursor-pointer hover:border-zinc-700">
                <RadioGroupItem value="FEMALE"/> Putri
            </Label>
        </RadioGroup>
        <Input name="communityName" placeholder="Nama Komunitas/Klub Asal" onChange={handleInputChange} className="h-12 bg-black border-zinc-800"/>
        <Input name="instagram" placeholder="@username Instagram" onChange={handleInputChange} className="h-12 bg-black border-zinc-800"/>
        <Textarea name="history" placeholder="Sebutkan prestasi/turnamen terakhir yang diikuti..." onChange={handleInputChange} className="bg-black border-zinc-800 min-h-24"/>
      </div>
    </div>
  );
}

function WizardStepDocuments({ formData, setFormData }: any) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prev: any) => ({
        ...prev,
        documents: { ...prev.documents, [name]: files[0] }
      }));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
      <div className="text-center mb-4">
        <h3 className="text-white text-xl font-black mb-1 uppercase tracking-widest">Upload Dokumen</h3>
        <p className="text-zinc-500 text-sm max-w-sm mx-auto">
          Dokumen ini bersifat rahasia dan hanya digunakan untuk verifikasi.
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="font-bold">1. Foto KTP</Label>
          <div className="flex items-center gap-3 bg-black/40 border border-zinc-800 p-3 rounded-2xl">
            <div className="p-3 bg-zinc-800 rounded-lg text-zinc-400"><FileText className="w-5 h-5" /></div>
            <Input name="ktp" type="file" accept="image/jpeg,image/png" onChange={handleFileChange} className="text-xs file:text-cyan-400 file:font-bold file:mr-4"/>
          </div>
        </div>
        <div className="space-y-2">
          <Label className="font-bold">2. Foto Selfie</Label>
          <div className="flex items-center gap-3 bg-black/40 border border-zinc-800 p-3 rounded-2xl">
            <div className="p-3 bg-zinc-800 rounded-lg text-zinc-400"><Camera className="w-5 h-5" /></div>
            <Input name="selfie" type="file" accept="image/jpeg,image/png" onChange={handleFileChange} className="text-xs file:text-cyan-400 file:font-bold file:mr-4"/>
          </div>
        </div>
        <div className="space-y-2">
          <Label className="font-bold">3. Screenshot Bukti Follow <a href="https://instagram.com/bccbandung.id" target="_blank" className="text-cyan-400 underline">@bccbandung.id</a></Label>
          <div className="flex items-center gap-3 bg-black/40 border border-zinc-800 p-3 rounded-2xl">
            <div className="p-3 bg-zinc-800 rounded-lg text-zinc-400"><Instagram className="w-5 h-5" /></div>
            <Input name="followProof" type="file" accept="image/jpeg,image/png" onChange={handleFileChange} className="text-xs file:text-cyan-400 file:font-bold file:mr-4"/>
          </div>
        </div>
      </div>
    </div>
  );
}


function WizardStepPayment({ formData }: any) {
  const finalPrice = PRICES[formData.skillLevel as keyof typeof PRICES];
  return (
    <div className="text-center py-8 animate-in fade-in zoom-in duration-300">
        <div className="w-24 h-24 bg-green-950/50 rounded-full mx-auto flex items-center justify-center mb-6 border-4 border-green-500/20">
            <Wallet className="w-12 h-12 text-green-500" />
        </div>
        <h3 className="text-white text-2xl font-black mb-2 uppercase">Step 5: Pembayaran</h3>
        <p className="text-zinc-500 text-sm max-w-sm mx-auto mb-8">
            Pilih metode pembayaran untuk biaya registrasi sebesar:
        </p>
        <div className="bg-black/40 p-5 rounded-3xl border border-zinc-800 inline-block mb-8 shadow-inner">
            <p className="font-mono text-5xl font-bold text-green-400">Rp {finalPrice.toLocaleString('id-ID')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
             <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="h-16 rounded-2xl text-lg font-bold bg-zinc-900 border-zinc-800 hover:bg-zinc-800">
                        <QrCode className="w-6 h-6 mr-3"/> Bayar via QRIS
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-white text-black rounded-3xl max-w-xs">
                    <DialogHeader className="text-center">
                        <DialogTitle className="font-headline text-xl">Scan QRIS untuk Pembayaran</DialogTitle>
                        <DialogDescription>Gunakan aplikasi Bank atau E-Wallet Anda.</DialogDescription>
                    </DialogHeader>
                    <div className="p-4 bg-zinc-100 rounded-2xl">
                        <div className="bg-white p-2 rounded-lg aspect-square flex items-center justify-center">
                           <QrCode className="w-full h-full text-black"/>
                        </div>
                    </div>
                     <div className="text-center space-y-1">
                        <p className="text-xs text-zinc-500">Total Pembayaran</p>
                        <p className="text-2xl font-bold font-mono">Rp {finalPrice.toLocaleString('id-ID')}</p>
                     </div>
                </DialogContent>
            </Dialog>
            <Button variant="outline" className="h-16 rounded-2xl text-lg font-bold bg-zinc-900 border-zinc-800 hover:bg-zinc-800">
                <Banknote className="w-6 h-6 mr-3"/> Transfer Bank
            </Button>
        </div>
    </div>
  );
}

export function PlayerDashboardController() {
  const [isMounted, setIsMounted] = useState(false);
  const [hasJoinedTeam, setHasJoinedTeam] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  // Wizard States
  const [joinCode, setJoinCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    agreements: { valid: false, health: false, rules: false, media: false },
    skillLevel: "BEGINNER",
    profile: {},
    documents: {},
  });
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // HANDLERS
  const handleVerifyCode = () => {
    if (!joinCode) return;
    setIsJoining(true);
    setTimeout(() => {
      setIsJoining(false);
      if (joinCode.toUpperCase() === "TWIN-2026") {
        setHasJoinedTeam(true);
      } else {
        alert("Kode Salah! Coba: TWIN-2026");
      }
    }, 1000);
  };

  const handleNextStep = () => setCurrentStep(prev => Math.min(prev + 1, 6));
  const handlePrevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  
  const allAgreed = Object.values(formData.agreements).every(Boolean);
  
  if (!isMounted) {
    return (
        <div className="fixed inset-0 bg-zinc-950 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-zinc-800 border-t-zinc-400 rounded-full animate-spin"></div>
        </div>
    );
  }

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
  if (!isProfileComplete) {
    return (
      <div className="min-h-screen bg-zinc-950 font-body py-8 px-4 md:py-12">
        <div className="max-w-3xl mx-auto">
            <div className="mb-10 text-center space-y-4">
                <Badge variant="outline" className="border-indigo-500 text-indigo-400 px-4 py-1 tracking-widest uppercase">Joining: PB TWINTON</Badge>
                <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">Athlete Data</h1>
                
                <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden mt-6">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-indigo-600 transition-all duration-500 ease-out" style={{ width: `${(currentStep/6)*100}%` }}></div>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-2 px-1">
                    <span>Agreement</span>
                    <span>Skill</span>
                    <span>Bio</span>
                    <span>Docs</span>
                    <span>Pay</span>
                    <span>Submit</span>
                </div>
            </div>

            <Card className="bg-zinc-900 border-zinc-800 rounded-[40px] p-8 md:p-10 min-h-[400px] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="relative z-10">
                    {currentStep === 1 && <WizardStepAgreement formData={formData} setFormData={setFormData} />}
                    {currentStep === 2 && <WizardStepSkillLevel formData={formData} setFormData={setFormData} />}
                    {currentStep === 3 && <WizardStepProfile formData={formData} setFormData={setFormData} />}
                    {currentStep === 4 && <WizardStepDocuments formData={formData} setFormData={setFormData} />}
                    {currentStep === 5 && <WizardStepPayment formData={formData} />}
                    {currentStep === 6 && (
                        <div className="text-center py-16 animate-in fade-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-zinc-800 rounded-3xl mx-auto flex items-center justify-center mb-6 animate-pulse">
                                <FileText className="w-10 h-10 text-zinc-600" />
                            </div>
                            <h3 className="text-white text-2xl font-black mb-2 uppercase">Final Step: Submit</h3>
                            <p className="text-zinc-500 text-sm max-w-sm mx-auto mb-8">
                                Pastikan semua data sudah benar sebelum mengirimkan formulir pendaftaran.
                            </p>
                            <Button 
                                onClick={() => setIsProfileComplete(true)} 
                                className="h-16 px-10 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-black text-xl shadow-[0_0_30px_rgba(22,163,74,0.4)] transition-transform hover:scale-105"
                            >
                                SUBMIT & FINISH <CheckCircle2 className="ml-3 w-6 h-6"/>
                            </Button>
                        </div>
                    )}
                </div>
            </Card>

            <div className="flex justify-between items-center mt-8 px-2">
                <Button variant="ghost" onClick={handlePrevStep} disabled={currentStep===1} className="h-14 px-6 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-900">
                    <ChevronLeft className="w-5 h-5 mr-2"/> BACK
                </Button>

                <Button variant="outline" className="h-14 rounded-xl font-bold bg-zinc-800 border-zinc-700 hover:bg-zinc-700">
                    <Save className="w-4 h-4 mr-2"/> SAVE DRAFT
                </Button>
                
                {currentStep < 6 && (
                    <Button onClick={handleNextStep} disabled={!allAgreed && currentStep === 1} className="h-14 px-6 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-lg shadow-lg disabled:bg-zinc-800 disabled:text-zinc-500">
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

