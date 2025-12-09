
'use client';

import { useState } from "react";
import Link from "next/link";
import { 
  Trophy, Users, Shield, QrCode, 
  Activity, Calendar, Hash, ArrowRight, 
  CheckCircle2, LogOut, User, Upload, 
  FileText, Wallet, AlertTriangle, Instagram, 
  History, Info, ChevronRight, ChevronLeft,
  Medal, MapPin
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";


// --- MOCK DATA: TEAM TWINTON ---
const MOCK_TEAM_DATA = {
  id: "TM-8821",
  name: "PB Twinton",
  category: "Beregu Putra (Team Event)",
  logo: "/logos/twinton.png",
  manager: "Budi Santoso",
  slots: {
    BEGINNER: { total: 4, filled: 2 },
    INTERMEDIATE: { total: 4, filled: 3 },
    ADVANCE: { total: 2, filled: 0 }
  }
};

const ATHLETE_INITIAL = {
  name: "Guest Athlete",
  email: "guest@mail.com",
  avatar: ""
};

export default function PlayerDashboard() {
  // --- STATE MANAGEMENT ---
  const [viewState, setViewState] = useState<"JOIN" | "FORM" | "DASHBOARD">("JOIN");
  const [athlete, setAthlete] = useState(ATHLETE_INITIAL);
  const [joinCode, setJoinCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [teamData, setTeamData] = useState<typeof MOCK_TEAM_DATA | null>(null);

  // FORM WIZARD STATE
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Agreements
    agreements: { valid: false, health: false, rules: false, media: false },
    // Step 2: Category
    matchType: "DOUBLE", 
    skillLevel: "BEGINNER", 
    // Step 3: Players
    players: [
      { name: "", nik: "", dob: "", gender: "M", wa: "", size: "M", club: "", ig: "", pbsi: "", history: "" }, // Player A
      { name: "", nik: "", dob: "", gender: "M", wa: "", size: "M", club: "", ig: "", pbsi: "", history: "" }  // Player B
    ],
    // Step 4: Manager
    manager: { name: "", wa: "", email: "" },
    // Step 5: Payment
    paymentProof: null
  });

  // --- HANDLERS ---

  // 1. Validate Team Code
  const handleVerifyCode = () => {
    if (!joinCode) return;
    setIsJoining(true);
    setTimeout(() => {
      setIsJoining(false);
      // Simulasi kode valid: DJA-8821
      if (joinCode === "TWIN-2026") {
        setTeamData(MOCK_TEAM_DATA);
        setViewState("FORM"); // Pindah ke pengisian data
      } else {
        alert("Kode Tim Tidak Ditemukan! Coba: TWIN-2026");
      }
    }, 1000);
  };

  // 2. Navigation
  const handleNextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const handlePrevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  // 3. Final Submit
  const handleSubmit = () => {
    // Simulasi Save Data
    setAthlete({
      ...athlete,
      name: formData.personal.name || "Atlet Baru",
      // @ts-ignore
      team: teamData
    });
    setViewState("DASHBOARD");
  };

  const updateAgreement = (key: keyof typeof formData.agreements) => {
    setFormData(prev => ({ ...prev, agreements: { ...prev.agreements, [key]: !prev.agreements[key] } }));
  };

  const updatePlayer = (index: number, field: string, value: string) => {
    const newPlayers = [...formData.players];
    // @ts-ignore
    newPlayers[index][field] = value;
    setFormData(prev => ({ ...prev, players: newPlayers }));
  };

  const totalPrice = PRICES[formData.skillLevel as keyof typeof PRICES];

  // --- RENDER COMPONENTS ---

  // VIEW 1: INPUT CODE (GATEKEEPER)
  const renderJoinGate = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <Card className="w-full max-w-lg bg-zinc-900 border-zinc-800 rounded-[32px] p-8 md:p-12 border-dashed border-2 relative overflow-hidden">
        {/* Background Blob */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-[50px] pointer-events-none"></div>
        
        <div className="text-center space-y-6 relative z-10">
          <div className="w-16 h-16 bg-zinc-800 rounded-2xl mx-auto flex items-center justify-center border border-zinc-700">
            <Hash className="w-8 h-8 text-white"/>
          </div>
          
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Team Access</h2>
            <p className="text-zinc-400 text-sm mt-2">
              Masukkan <strong>Kode Unik</strong> yang diberikan oleh Manajer Tim/Komunitas Anda untuk mengisi biodata.
            </p>
          </div>

          <div className="space-y-4">
            <Input 
              placeholder="CONTOH: TWIN-2026" 
              className="bg-black border-zinc-700 h-16 text-center text-2xl font-mono uppercase tracking-[0.2em] text-white focus:ring-cyan-500 focus:border-cyan-500 rounded-2xl"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              maxLength={9}
            />
            <Button 
              onClick={handleVerifyCode} 
              disabled={isJoining || joinCode.length < 5} 
              className="w-full h-14 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-black text-lg shadow-[0_0_20px_rgba(8,145,178,0.4)]"
            >
              {isJoining ? "VERIFYING..." : "ENTER TEAM SQUAD"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  // VIEW 2: FORM WIZARD
  const renderFormWizard = () => (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
      
      {/* Team Header Info */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[24px] flex items-center gap-6">
        <Avatar className="w-16 h-16 border-2 border-zinc-700">
            <AvatarImage src={teamData?.logo} />
            <AvatarFallback>TM</AvatarFallback>
        </Avatar>
        <div>
            <Badge variant="outline" className="border-cyan-500 text-cyan-500 mb-1">You are joining</Badge>
            <h2 className="text-2xl font-black text-white">{teamData?.name}</h2>
            <p className="text-zinc-400 text-sm flex items-center gap-2">
                <Trophy className="w-4 h-4"/> {teamData?.category} 
                <span className="text-zinc-600">•</span>
                <User className="w-4 h-4"/> Manager: {teamData?.manager}
            </p>
        </div>
      </div>

      {/* Steps Indicator */}
      <div className="flex justify-between items-center px-2">
        {['Disclaimer', 'Pilih Skill', 'Biodata & TPF'].map((label, idx) => (
            <div key={idx} className="flex items-center gap-2">
                <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                    currentStep > idx + 1 ? "bg-green-500 text-black" : 
                    currentStep === idx + 1 ? "bg-cyan-500 text-black" : "bg-zinc-800 text-zinc-500"
                )}>
                    {currentStep > idx + 1 ? <CheckCircle2 className="w-4 h-4"/> : idx + 1}
                </div>
                <span className={cn("text-xs font-bold uppercase hidden md:block", currentStep === idx + 1 ? "text-white" : "text-zinc-600")}>{label}</span>
                {idx < 2 && <div className="w-12 h-[2px] bg-zinc-800 mx-2 hidden md:block"></div>}
            </div>
        ))}
      </div>

      {/* --- STEP 1: DISCLAIMER --- */}
      {currentStep === 1 && (
        <Card className="bg-zinc-900 border-zinc-800 rounded-[32px] p-8">
            <div className="space-y-6">
                <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-xl flex gap-3 text-red-200 text-sm">
                    <AlertTriangle className="w-5 h-5 shrink-0 text-red-500"/>
                    <p>Harap baca dengan teliti. Pelanggaran data (pencurian umur/manipulasi level) akan menyebabkan <strong>Tim Diskualifikasi</strong>.</p>
                </div>
                <div className="space-y-4">
                    {['valid', 'health', 'rules', 'media'].map((key) => (
                        <div key={key} className="flex items-start space-x-3 p-3 hover:bg-zinc-800/50 rounded-xl transition-colors cursor-pointer" onClick={() => setFormData(prev => ({...prev, agreements: {...prev.agreements, [key]: !prev.agreements[key as keyof typeof prev.agreements]}}))}>
                            <Checkbox checked={formData.agreements[key as keyof typeof formData.agreements]} className="mt-1 border-zinc-600 data-[state=checked]:bg-cyan-600"/>
                            <div>
                                <Label className="font-bold text-white cursor-pointer">
                                    {key === 'valid' && "Validitas Data (Anti Joki/Sandbagging)"}
                                    {key === 'health' && "Kondisi Kesehatan Fisik"}
                                    {key === 'rules' && "Regulasi & Keputusan Wasit"}
                                    {key === 'media' && "Hak Publikasi Dokumentasi"}
                                </Label>
                                <p className="text-xs text-zinc-400 mt-1">
                                    {key === 'valid' && "Saya menyatakan data benar. Siap didiskualifikasi jika palsu."}
                                    {key === 'health' && "Sehat jasmani rohani. Panitia tidak bertanggung jawab atas cedera berat."}
                                    {key === 'rules' && "Mematuhi segala peraturan pertandingan BCC 2026."}
                                    {key === 'media' && "Mengizinkan foto/video saya digunakan untuk keperluan event."}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
      )}

      {/* --- STEP 2: SKILL SLOT --- */}
      {currentStep === 2 && (
        <Card className="bg-zinc-900 border-zinc-800 rounded-[32px] p-8">
            <div className="text-center mb-8">
                <h3 className="text-xl font-black text-white uppercase">Pilih Slot Kemampuan</h3>
                <p className="text-zinc-400 text-sm">Tim {teamData?.name} membutuhkan komposisi pemain berikut. Pilih sesuai kemampuan Anda.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(teamData?.slots || {}).map(([level, data]) => {
                    const isFull = data.filled >= data.total;
                    const isSelected = formData.selectedSkill === level;
                    
                    return (
                        <div 
                            key={level}
                            onClick={() => !isFull && setFormData({...formData, selectedSkill: level})}
                            className={cn(
                                "p-6 rounded-2xl border-2 transition-all relative overflow-hidden",
                                isFull ? "opacity-50 cursor-not-allowed border-zinc-800 bg-zinc-900" : 
                                isSelected ? "border-cyan-500 bg-cyan-900/20 cursor-pointer" : "border-zinc-800 bg-zinc-900 hover:border-zinc-600 cursor-pointer"
                            )}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-black text-white">{level}</h4>
                                {isFull ? <Badge variant="destructive" className="text-[10px]">FULL</Badge> : <Badge className="bg-zinc-800 text-[10px]">{data.filled}/{data.total}</Badge>}
                            </div>
                            <p className="text-xs text-zinc-400">
                                {level === 'BEGINNER' && "Pemula / Hobi"}
                                {level === 'INTERMEDIATE' && "Rutin / Kompetitif"}
                                {level === 'ADVANCE' && "Eks Atlet / Semi-Pro"}
                            </p>
                            {isSelected && <div className="absolute top-2 right-2"><CheckCircle2 className="w-5 h-5 text-cyan-500"/></div>}
                        </div>
                    )
                })}
            </div>
        </Card>
      )}

      {/* --- STEP 3: BIODATA --- */}
      {currentStep === 3 && (
        <div className="space-y-6">
            <Card className="bg-zinc-900 border-zinc-800 rounded-[32px] p-8">
                <div className="space-y-4">
                    <h3 className="text-lg font-black text-white border-b border-zinc-800 pb-2">Identitas Diri</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs text-zinc-500 font-bold uppercase">Nama Lengkap (Sesuai KTP)</Label>
                            <Input className="bg-black border-zinc-800" value={formData.personal.name} onChange={(e) => setFormData({...formData, personal: {...formData.personal, name: e.target.value}})} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-zinc-500 font-bold uppercase">NIK (16 Digit)</Label>
                            <Input maxLength={16} placeholder="Validasi Usia" className="bg-black border-zinc-800" value={formData.personal.nik} onChange={(e) => setFormData({...formData, personal: {...formData.personal, nik: e.target.value}})} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-zinc-500 font-bold uppercase">No. WhatsApp</Label>
                            <Input type="tel" className="bg-black border-zinc-800" value={formData.personal.wa} onChange={(e) => setFormData({...formData, personal: {...formData.personal, wa: e.target.value}})} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-zinc-500 font-bold uppercase">Ukuran Jersey</Label>
                            <Select onValueChange={(val) => setFormData({...formData, personal: {...formData.personal, size: val}})}>
                                <SelectTrigger className="bg-black border-zinc-800"><SelectValue placeholder="Pilih" /></SelectTrigger>
                                <SelectContent>
                                    {['S','M','L','XL','XXL'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800 rounded-[32px] p-8">
                <div className="space-y-4">
                    <h3 className="text-lg font-black text-white border-b border-zinc-800 pb-2 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-cyan-500"/> Validasi TPF
                    </h3>
                    <div className="bg-cyan-900/10 border border-cyan-500/20 p-3 rounded-xl text-xs text-cyan-200">
                        Isi dengan jujur. TPF akan mengecek jejak digital Anda. Kebohongan level = Blacklist.
                    </div>
                    
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs text-zinc-500 font-bold uppercase">Username Instagram (@)</Label>
                            <div className="relative">
                                <Instagram className="absolute left-3 top-3 w-4 h-4 text-zinc-500"/>
                                <Input className="bg-black border-zinc-800 pl-9" placeholder="Wajib (Public Account)" value={formData.tpf.ig} onChange={(e) => setFormData({...formData, tpf: {...formData.tpf, ig: e.target.value}})} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-zinc-500 font-bold uppercase">Riwayat Turnamen / Prestasi</Label>
                            <Textarea 
                                className="bg-black border-zinc-800 min-h-[100px]" 
                                placeholder="Contoh: Kejurkot 2024 (Juara 2), Open Bandung (8 Besar)..." 
                                value={formData.tpf.history} 
                                onChange={(e) => setFormData({...formData, tpf: {...formData.tpf, history: e.target.value}})}
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="space-y-2">
                                <Label className="text-xs text-zinc-500 font-bold">Foto KTP</Label>
                                <div className="h-24 bg-black border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center text-zinc-600 hover:text-cyan-500 cursor-pointer transition-colors">
                                    <Upload className="w-5 h-5 mb-1"/> <span className="text-[10px] font-bold">Foto KTP</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-zinc-500 font-bold">Foto Diri (Resmi)</Label>
                                <div className="h-24 bg-black border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center text-zinc-600 hover:text-cyan-500 cursor-pointer transition-colors">
                                    <Upload className="w-5 h-5 mb-1"/> <span className="text-[10px] font-bold">Foto Diri (ID Card)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
      )}

      {/* --- WIZARD NAVIGATION --- */}
      <div className="flex justify-between pt-4 pb-8">
        <Button 
            variant="outline" 
            onClick={handlePrevStep} 
            disabled={currentStep === 1}
            className="h-14 px-8 rounded-xl border-zinc-700 text-zinc-300 hover:text-white font-bold"
        >
            <ChevronLeft className="w-5 h-5 mr-2"/> BACK
        </Button>
        
        {currentStep === 3 ? (
            <Button 
                onClick={handleSubmit}
                className="h-14 px-10 rounded-xl bg-green-600 hover:bg-green-700 text-white font-black text-lg shadow-[0_0_20px_rgba(22,163,74,0.4)]"
            >
                FINISH & JOIN <CheckCircle2 className="ml-2 w-6 h-6"/>
            </Button>
        ) : (
            <Button 
                onClick={handleNextStep}
                disabled={
                    (currentStep === 1 && !Object.values(formData.agreements).every(Boolean)) || // Wajib centang semua di Step 1
                    (currentStep === 2 && !formData.selectedSkill) // Step 2 Validasi
                }
                className="h-14 px-8 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-lg"
            >
                NEXT STEP <ChevronRight className="w-5 h-5 ml-2"/>
            </Button>
        )}
      </div>

    </div>
  );

  // VIEW 3: DASHBOARD (FINAL STATE)
  const renderDashboard = () => (
    <div className="space-y-8 p-4 md:p-8 font-body pb-24 max-w-5xl mx-auto animate-in fade-in duration-500">
        
        {/* Dashboard Header */}
        <div className="flex justify-between items-end">
            <div>
                <Badge variant="outline" className="border-cyan-500 text-cyan-500 mb-2">PLAYER DASHBOARD</Badge>
                <h1 className="text-3xl font-black text-white">Hi, {athlete.name}</h1>
            </div>
            <Link href="/" passHref>
                <Button variant="outline" className="rounded-full"><LogOut className="w-4 h-4 mr-2"/> Logout</Button>
            </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Profile Card */}
            <Card className="bg-zinc-900 border-zinc-800 rounded-[24px] col-span-1 overflow-hidden relative">
                <div className="absolute top-0 w-full h-2 bg-indigo-600"></div>
                <CardContent className="p-6 text-center">
                    <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-zinc-800">
                        <AvatarImage src={athlete.avatar || "https://github.com/shadcn.png"} />
                        <AvatarFallback>AT</AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-bold text-white">{athlete.name}</h2>
                    <Badge className="bg-indigo-600 mt-2">{teamData?.name || "PB Twinton"}</Badge>
                    <div className="mt-6 p-4 bg-black rounded-xl border border-zinc-800">
                        <p className="text-xs text-zinc-500 font-bold uppercase mb-1">Verification Status</p>
                        <p className="text-yellow-500 font-bold flex items-center justify-center gap-2"><Activity className="w-4 h-4 animate-pulse"/> PENDING</p>
                    </div>
                </CardContent>
            </Card>

            {/* Status & Schedule */}
            <div className="col-span-2 space-y-6">
                <Card className="bg-zinc-900 border-zinc-800 rounded-[24px] p-8 text-center flex flex-col items-center justify-center min-h-[200px]">
                    <Calendar className="w-12 h-12 text-zinc-700 mb-4"/>
                    <h3 className="text-lg font-bold text-white">Jadwal Belum Tersedia</h3>
                    <p className="text-zinc-500 text-sm max-w-md mt-2">
                        Data pendaftaran Anda sedang diverifikasi oleh Tim Pencari Fakta. Jadwal drawing akan diumumkan H-3 pertandingan.
                    </p>
                </Card>
            </div>
        </div>
    </div>
  );

  return viewState === "JOIN" ? renderJoinGate() 
       : viewState === "FORM" ? renderFormWizard() 
       : renderDashboard();
}

    