
'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Trophy, Users, Shield, QrCode, Activity, Calendar, 
  ArrowRight, LogOut, User, Upload, FileText, 
  AlertTriangle, Youtube, History, Info, ChevronRight, 
  Camera, MessageCircle, Download, Gavel, Clock, 
  Share2, RotateCw, AlertOctagon, Send, Hash,
  ChevronLeft, Wallet, CheckCircle2, Instagram, Phone, Mail,
  Check
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
const ATHLETE_MOCK = {
  id: "ATL-8821",
  name: "Jonathan Christie",
  team: "PB Djarum Official",
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

// --- COMPONENT: FULL DASHBOARD (VIEW 3) ---
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
                                    <AvatarImage src={ATHLETE_MOCK.avatar} className="object-cover"/>
                                    <AvatarFallback>AT</AvatarFallback>
                                </Avatar>
                                <h2 className="text-2xl font-black text-white text-center uppercase leading-none mb-2">{ATHLETE_MOCK.name}</h2>
                                <Badge className="bg-indigo-600 hover:bg-indigo-700 mb-2">{ATHLETE_MOCK.team}</Badge>
                                <div className="mt-auto w-full pt-4 border-t border-zinc-800 flex justify-between items-center text-xs text-zinc-400">
                                    <span className="font-mono">{ATHLETE_MOCK.id}</span>
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
  // STATE
  const [hasJoinedTeam, setHasJoinedTeam] = useState(false); 
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false); 
  const [joinCode, setJoinCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [teamName, setTeamName] = useState("");

  const [formData, setFormData] = useState({
    agreements: { valid: false, health: false, rules: false, media: false },
    category: "GANDA", // GANDA or BEREGU
    skillLevel: "BEGINNER",
    player: {
      fullName: "",
      nickname: "",
      jerseyName: "",
      nik: "",
      dob: "",
      gender: "Laki-laki",
      wa: "",
      club: "",
      youtube: "",
    },
    manager: { name: "", wa: "", email: "" },
    paymentFile: null as string | null // Simulasi file
  });

  const totalPrice = PRICES[formData.skillLevel as keyof typeof PRICES];

  // HANDLERS
  const handleVerifyCode = () => {
    if (!joinCode) return;
    setIsJoining(true);
    setTimeout(() => {
      setIsJoining(false);
      if (joinCode === "TWIN-2026") {
        setTeamName("PB TWINTON");
        // Auto fill manager & club based on code
        setFormData(p => ({
            ...p, 
            player: { ...p.player, club: "PB TWINTON" },
            manager: { name: "Budi Santoso", wa: "0812345678", email: "manager@twinton.com" }
        }));
        setHasJoinedTeam(true);
      } else {
        alert("Kode Salah! Coba: TWIN-2026");
      }
    }, 1000);
  };

  const updateAgreement = (key: keyof typeof formData.agreements) => {
    setFormData(prev => ({ ...prev, agreements: { ...prev.agreements, [key]: !prev.agreements[key as keyof typeof prev.agreements] } }));
  };

  const updatePlayer = (field: string, value: string) => {
    // Basic validation
    if ((field === 'nik' || field === 'wa') && !/^\d*$/.test(value)) return; 
    setFormData(prev => ({ ...prev, player: { ...prev.player, [field]: value } }));
  };
  
  const handleNextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const handlePrevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  // --- WIZARD RENDERER ---
  const renderWizardContent = () => {
    switch (currentStep) {
        // STEP 1: DISCLAIMER (MANDATORY CHECKBOXES)
        case 1:
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                    <div className="bg-red-950/30 border border-red-500/30 p-5 rounded-2xl flex gap-4 items-start">
                        <Shield className="w-8 h-8 text-red-500 shrink-0 mt-1"/>
                        <div className="space-y-1">
                            <h3 className="font-black text-red-100 text-lg uppercase">Ketentuan Umum (Disclaimer)</h3>
                            <p className="text-red-200/80 text-xs">Centang semua poin di bawah untuk melanjutkan.</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {[
                            { id: 'valid', label: 'Validitas Data', desc: 'Data BENAR. Siap diskualifikasi & deposit hangus jika ditemukan pemalsuan.' },
                            { id: 'health', label: 'Kesehatan', desc: 'Sehat jasmani rohani. Panitia tidak bertanggung jawab atas cedera bawaan/jantung.' },
                            { id: 'rules', label: 'Regulasi', desc: 'Menyetujui aturan Shuttlecock dan keputusan Mutlak Wasit/TPF.' },
                            { id: 'media', label: 'Publikasi', desc: 'Mengizinkan dokumentasi foto/video untuk kepentingan sponsor.' }
                        ].map((item) => (
                            <div 
                                key={item.id} 
                                className={cn(
                                    "flex gap-4 items-start p-4 border rounded-2xl cursor-pointer transition-colors",
                                    formData.agreements[item.id as keyof typeof formData.agreements] 
                                        ? "bg-cyan-950/20 border-cyan-500/50" 
                                        : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                                )}
                                onClick={() => updateAgreement(item.id as keyof typeof formData.agreements)}
                            >
                                <div className={cn(
                                    "mt-1 w-5 h-5 rounded-md border flex items-center justify-center transition-all",
                                    formData.agreements[item.id as keyof typeof formData.agreements] 
                                        ? "bg-cyan-600 border-cyan-600" 
                                        : "border-zinc-600"
                                )}>
                                    {formData.agreements[item.id as keyof typeof formData.agreements] && <Check className="w-3.5 h-3.5 text-white" />}
                                </div>
                                <div>
                                    <Label className="font-bold text-white cursor-pointer text-sm uppercase">{item.label}</Label>
                                    <p className="text-xs text-zinc-400 mt-0.5 leading-snug">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        
        // STEP 2: CATEGORY & SKILL (VISUAL SELECTION)
        case 2:
            return (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-300">
                    <div className="space-y-4">
                        <Label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Jenis Pertandingan</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <div onClick={() => setFormData({...formData, category: "GANDA"})} className={cn("p-4 rounded-2xl border-2 cursor-pointer transition-all bg-zinc-900 flex flex-col items-center justify-center text-center gap-2", formData.category === "GANDA" ? "border-cyan-500 bg-cyan-950/20" : "border-zinc-800")}>
                                <Users className={cn("w-8 h-8", formData.category === "GANDA" ? "text-cyan-500" : "text-zinc-500")}/>
                                <span className={cn("text-sm font-bold", formData.category === "GANDA" ? "text-white" : "text-zinc-400")}>Ganda Perorangan</span>
                            </div>
                            <div onClick={() => setFormData({...formData, category: "BEREGU"})} className={cn("p-4 rounded-2xl border-2 cursor-pointer transition-all bg-zinc-900 flex flex-col items-center justify-center text-center gap-2", formData.category === "BEREGU" ? "border-cyan-500 bg-cyan-950/20" : "border-zinc-800")}>
                                <Shield className={cn("w-8 h-8", formData.category === "BEREGU" ? "text-cyan-500" : "text-zinc-500")}/>
                                <span className={cn("text-sm font-bold", formData.category === "BEREGU" ? "text-white" : "text-zinc-400")}>Beregu / Tim</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Kelas Kemampuan (Skill Level)</Label>
                        <div className="grid grid-cols-1 gap-3">
                            {Object.entries(PRICES).map(([level, price]) => (
                                <div 
                                    key={level}
                                    onClick={() => setFormData({...formData, skillLevel: level})}
                                    className={cn(
                                        "p-4 rounded-2xl border-2 cursor-pointer flex justify-between items-center transition-all",
                                        formData.skillLevel === level ? "border-indigo-500 bg-indigo-900/20" : "border-zinc-800 bg-zinc-900 hover:border-zinc-600"
                                    )}
                                >
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-black text-white text-sm">{level}</h4>
                                            {formData.skillLevel === level && <CheckCircle2 className="w-4 h-4 text-indigo-500"/>}
                                        </div>
                                        <p className="text-[10px] text-zinc-400 mt-1">
                                            {level === 'BEGINNER' ? "Pemula / Hobi (Fun Game)" : level === 'INTERMEDIATE' ? "Rutin / Kompetitif" : "Semi-Pro / Eks Atlet"}
                                        </p>
                                    </div>
                                    <Badge className="bg-zinc-950 border border-zinc-700 text-white font-mono">Rp {price.toLocaleString()}</Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );

        // STEP 3: BIODATA & TPF
        case 3:
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                    <Card className="bg-zinc-900 border-zinc-800 rounded-[32px] p-6 space-y-5">
                        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
                            <User className="w-5 h-5 text-cyan-500"/>
                            <h3 className="font-black text-white text-sm uppercase">Data Pemain</h3>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <Label className="text-xs text-zinc-500 uppercase font-bold">Nama Lengkap (Sesuai KTP)</Label>
                                <Input className="bg-black border-zinc-800" value={formData.player.fullName} onChange={(e) => updatePlayer('fullName', e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-xs text-zinc-500 uppercase font-bold">Nama Panggilan</Label>
                                    <Input className="bg-black border-zinc-800" value={formData.player.nickname} onChange={(e) => updatePlayer('nickname', e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-zinc-500 uppercase font-bold">Nama Punggung</Label>
                                    <Input className="bg-black border-zinc-800" value={formData.player.jerseyName} onChange={(e) => updatePlayer('jerseyName', e.target.value)} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-zinc-500 uppercase font-bold">NIK (Wajib 16 Digit)</Label>
                                <Input 
                                    className={cn("bg-black border-zinc-800 font-mono", formData.player.nik.length !== 16 && formData.player.nik.length > 0 ? "border-red-500" : "")} 
                                    placeholder="Validasi Usia & Domisili" 
                                    maxLength={16} 
                                    value={formData.player.nik} 
                                    onChange={(e) => updatePlayer('nik', e.target.value)} 
                                />
                                {formData.player.nik.length > 0 && formData.player.nik.length !== 16 && <p className="text-[10px] text-red-500">NIK harus 16 digit angka.</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-xs text-zinc-500 uppercase font-bold">Tgl Lahir</Label>
                                    <Input type="date" className="bg-black border-zinc-800" value={formData.player.dob} onChange={(e) => updatePlayer('dob', e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-zinc-500 uppercase font-bold">Jenis Kelamin</Label>
                                    <Select onValueChange={(val) => updatePlayer('gender', val)} defaultValue={formData.player.gender}>
                                        <SelectTrigger className="bg-black border-zinc-800"><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                                            <SelectItem value="Perempuan">Perempuan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-zinc-500 uppercase font-bold">No. WhatsApp Aktif</Label>
                                <Input type="tel" className="bg-black border-zinc-800" value={formData.player.wa} onChange={(e) => updatePlayer('wa', e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-zinc-500 uppercase font-bold">Nama Komunitas/Tim Asal</Label>
                                <Input className="bg-black border-zinc-800" value={formData.player.club} onChange={(e) => updatePlayer('club', e.target.value)} />
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-zinc-900 border-zinc-800 rounded-[32px] p-6 space-y-5">
                        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
                            <AlertTriangle className="w-5 h-5 text-red-500"/>
                            <h3 className="font-black text-white text-sm uppercase">Data Validasi TPF (Penting!)</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <Label className="text-xs text-zinc-500 uppercase font-bold">Link Video Main Full Youtube</Label>
                                <div className="relative">
                                    <Youtube className="absolute left-3 top-3 w-4 h-4 text-red-500"/>
                                    <Input className="bg-black border-zinc-800 pl-10" placeholder="https://youtube.com/..." value={formData.player.youtube} onChange={(e) => updatePlayer('youtube', e.target.value)} />
                                </div>
                                <p className="text-[10px] text-zinc-500">TPF akan mengecek video main Anda sebagai syarat lolos.</p>
                            </div>
                        </div>
                    </Card>
                </div>
            );

        // STEP 4: MANAGER CONTACT
        case 4:
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                    <Card className="bg-zinc-900 border-zinc-800 rounded-[32px] p-8">
                        <div className="text-center mb-6">
                            <div className="w-14 h-14 bg-zinc-800 rounded-full mx-auto flex items-center justify-center mb-3 border border-zinc-700">
                                <Users className="w-6 h-6 text-white"/>
                            </div>
                            <h3 className="text-xl font-black text-white">Kontak Penanggung Jawab</h3>
                            <p className="text-zinc-400 text-xs">Orang yang dihubungi panitia untuk urusan pembayaran & jadwal.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <Label className="text-xs text-zinc-500 uppercase font-bold">Nama Manajer</Label>
                                <Input className="bg-black border-zinc-800" value={formData.manager.name} onChange={(e) => setFormData(p => ({...p, manager: {...p.manager, name: e.target.value}}))} />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-zinc-500 uppercase font-bold">No. WhatsApp</Label>
                                <Input type="tel" className="bg-black border-zinc-800" value={formData.manager.wa} onChange={(e) => setFormData(p => ({...p, manager: {...p.manager, wa: e.target.value}}))} />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-zinc-500 uppercase font-bold">Email</Label>
                                <Input type="email" className="bg-black border-zinc-800" value={formData.manager.email} onChange={(e) => setFormData(p => ({...p, manager: {...p.manager, email: e.target.value}}))} />
                            </div>
                        </div>
                    </Card>
                </div>
            );

        // STEP 5: PAYMENT & UPLOAD
        case 5:
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                    <Card className="bg-gradient-to-br from-zinc-900 to-black border-zinc-800 rounded-[32px] p-8">
                        <div className="text-center mb-8">
                            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-2">Total Biaya Pendaftaran</p>
                            <h2 className="text-5xl font-black text-white">Rp {totalPrice.toLocaleString()}</h2>
                            <Badge variant="outline" className="mt-4 border-indigo-500 text-indigo-400">{formData.skillLevel} CLASS</Badge>
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-zinc-500 uppercase">Upload Bukti Transfer *</Label>
                                <div 
                                    className={cn("h-28 bg-zinc-900 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all", 
                                    formData.paymentFile ? "border-green-500 bg-green-900/10 text-green-500" : "border-zinc-700 text-zinc-500 hover:text-white hover:border-indigo-500")}
                                    onClick={() => setFormData(p => ({...p, paymentFile: "uploaded_file.jpg"}))}
                                >
                                    {formData.paymentFile ? <CheckCircle2 className="w-8 h-8 mb-2"/> : <Upload className="w-8 h-8 mb-2"/>}
                                    <span className="text-xs font-bold uppercase">{formData.paymentFile ? "File Uploaded" : "Tap to Upload"}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-zinc-500 uppercase">Screenshot IG Follow *</Label>
                                <div className="h-28 bg-zinc-900 border-2 border-dashed border-zinc-700 rounded-2xl flex flex-col items-center justify-center text-zinc-500 hover:text-white hover:border-indigo-500 cursor-pointer transition-all">
                                    <Instagram className="w-8 h-8 mb-2"/>
                                    <span className="text-xs font-bold uppercase">Upload SS @bccbandung.id</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            );
        default: return null;
    }
  };

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
      </div>
    );
  }

  // --- RENDER VIEW 2: WIZARD FORM ---
  if (!isRegistrationComplete) {
    return (
      <div className="min-h-screen bg-zinc-950 font-body py-8 px-4 md:py-12">
        <div className="max-w-3xl mx-auto">
            <div className="mb-10 text-center space-y-4">
                <Badge variant="outline" className="border-indigo-500 text-indigo-400 px-4 py-1 tracking-widest uppercase">Joining: {teamName}</Badge>
                <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">Formulir Pendaftaran</h1>
                <div className="flex items-center justify-center gap-2 mt-4">
                    {[1,2,3,4,5].map(step => (
                        <div key={step} className={cn("h-1.5 rounded-full transition-all duration-300", currentStep >= step ? "bg-cyan-500 w-8" : "bg-zinc-800 w-4")}></div>
                    ))}
                </div>
                <p className="text-zinc-500 text-xs uppercase tracking-widest">Step {currentStep} of 5</p>
            </div>

            <div className="min-h-[400px]">
                {renderWizardContent()}
            </div>

            <div className="flex justify-between mt-12 pt-6 border-t border-zinc-800">
                <Button variant="ghost" onClick={handlePrevStep} disabled={currentStep===1} className="h-14 px-8 rounded-2xl text-zinc-500 hover:text-white hover:bg-zinc-900 font-bold"><ChevronLeft className="w-5 h-5 mr-2"/> BACK</Button>
                
                {currentStep === 5 ? (
                    <Button 
                        onClick={() => setIsRegistrationComplete(true)}
                        disabled={!formData.paymentFile} // Prevent submit if no payment proof
                        className="h-14 px-10 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-black text-lg shadow-lg shadow-green-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        SUBMIT REGISTRATION <CheckCircle2 className="ml-3 w-5 h-5"/>
                    </Button>
                ) : (
                    <Button 
                        onClick={handleNextStep} 
                        disabled={currentStep === 1 && !Object.values(formData.agreements).every(Boolean)} // Step 1 Lock
                        className="h-14 px-10 rounded-2xl bg-white text-black hover:bg-zinc-200 font-bold text-lg"
                    >
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
        {/* Navbar */}
        <div className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 px-4 md:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2"><Trophy className="w-6 h-6 text-cyan-500"/><span className="font-black text-white tracking-tighter hidden md:inline text-lg">PLAYER DASHBOARD</span></div>
            <div className="flex items-center gap-4">
                <div className="text-right hidden md:block"><p className="text-xs font-bold text-white">{formData.player.fullName || "Guest"}</p><p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{teamName}</p></div>
                <Avatar className="h-10 w-10 border-2 border-zinc-800 ring-2 ring-black"><AvatarImage src={ATHLETE_MOCK.avatar} /><AvatarFallback>PL</AvatarFallback></Avatar>
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
