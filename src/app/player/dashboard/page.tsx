
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
  Check, Loader2, Paperclip, Plus
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

const TEAM_CHATS = [
  { id: 1, user: "Coach Herry", msg: "Kumpul di Court 4 sekarang ya, warming up.", time: "10:00", self: false },
  { id: 2, user: "Ginting", msg: "Siap coach, otw.", time: "10:02", self: false },
  { id: 3, user: "You", msg: "Aman coach, saya bawa kok.", time: "10:06", self: true },
];

const SCHEDULE = {
  status: "CALLING", 
  court: "Court 1 (TV)",
  match: "MS Round of 16",
  opponent: "Lee Zii Jia",
  time: "LIVE NOW"
};

const HISTORY = [
  { event: "Round of 32", opponent: "Kento Momota", score: "21-15, 21-18", result: "WIN", date: "Yesterday" },
  { event: "Round of 16", opponent: "Viktor Axelsen", score: "19-21, 15-21", result: "LOSE", date: "2 days ago" },
];

const GALLERY = [1, 2, 3, 4];

// =================================================================================================
// SUB-COMPONENT: FULL DASHBOARD (VIEW 3)
// =================================================================================================
function PlayerDashboardFull() {
  const [isIdCardFlipped, setIsIdCardFlipped] = useState(false);
  const [isProtestOpen, setIsProtestOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");

  const renderDigitalID = () => (
    <div className="perspective-1000 group cursor-pointer h-[450px] w-full" onClick={() => setIsIdCardFlipped(!isIdCardFlipped)}>
        <div className={cn(
            "relative w-full h-full transition-all duration-700 transform-style-3d",
            isIdCardFlipped ? "rotate-y-180" : ""
        )}>
            {/* FRONT */}
            <Card className="absolute inset-0 bg-gradient-to-b from-zinc-800 to-zinc-950 border-2 border-zinc-700/50 rounded-[32px] overflow-hidden backface-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10 mix-blend-overlay z-10"></div>
                <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/20 rounded-full blur-[80px]"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-[60px]"></div>

                <CardContent className="p-6 flex flex-col items-center h-full relative z-10">
                    <div className="flex justify-between w-full mb-6 items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase">Verified Athlete</span>
                        </div>
                        <Trophy className="w-5 h-5 text-yellow-500"/>
                    </div>
                    
                    <div className="relative mb-6">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 blur-md opacity-50"></div>
                        <Avatar className="w-32 h-32 border-4 border-zinc-950 relative">
                            <AvatarImage src={ATHLETE_MOCK.avatar} className="object-cover"/>
                            <AvatarFallback>AT</AvatarFallback>
                        </Avatar>
                    </div>

                    <h2 className="text-3xl font-black text-white text-center uppercase leading-none mb-2">{ATHLETE_MOCK.name}</h2>
                    <p className="text-sm font-bold text-zinc-400 mb-6">{ATHLETE_MOCK.team}</p>
                    
                    <div className="grid grid-cols-2 gap-2 w-full mb-auto">
                        <Badge variant="secondary" className="bg-zinc-900/50 border-zinc-700 justify-center py-1.5">Mens Singles</Badge>
                        <Badge variant="secondary" className="bg-zinc-900/50 border-zinc-700 justify-center py-1.5">ID: {ATHLETE_MOCK.id}</Badge>
                    </div>
                    
                    <div className="w-full pt-4 border-t border-white/10 flex justify-center">
                        <span className="flex items-center gap-2 text-cyan-400 font-bold text-xs animate-pulse">
                            <RotateCw className="w-4 h-4"/> TAP TO REVEAL QR
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* BACK */}
            <Card className="absolute inset-0 bg-white border-4 border-zinc-200 rounded-[32px] overflow-hidden backface-hidden rotate-y-180 shadow-2xl">
                <CardContent className="p-8 flex flex-col items-center justify-center h-full text-center space-y-6">
                    <div>
                        <h3 className="text-black font-black text-2xl uppercase tracking-tighter">Access Pass</h3>
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Gate • Medical • Umpire</p>
                    </div>
                    <div className="p-2 border-4 border-black rounded-2xl">
                        <QrCode className="w-48 h-48 text-black"/>
                    </div>
                    <span className="flex items-center gap-2 text-zinc-400 font-bold text-xs mt-4">
                        <RotateCw className="w-4 h-4"/> Tap to Front
                    </span>
                </CardContent>
            </Card>
        </div>
    </div>
  );

  const renderSquadChat = () => (
    <Sheet>
        <SheetTrigger asChild>
            <Button className="w-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white justify-between h-20 rounded-[24px] px-6 group transition-all">
                <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                        <Avatar className="w-10 h-10 border-2 border-zinc-900"><AvatarFallback>CH</AvatarFallback></Avatar>
                        <Avatar className="w-10 h-10 border-2 border-zinc-900"><AvatarFallback>GT</AvatarFallback></Avatar>
                        <Avatar className="w-10 h-10 border-2 border-zinc-900"><AvatarFallback>KS</AvatarFallback></Avatar>
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-black text-white uppercase">Team Lounge</p>
                        <p className="text-xs text-green-500 font-bold flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> 4 Online
                        </p>
                    </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-zinc-950 flex items-center justify-center border border-zinc-800 group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:text-white transition-colors text-zinc-500">
                    <MessageCircle className="w-5 h-5"/>
                </div>
            </Button>
        </SheetTrigger>
        <SheetContent side="right" className="bg-zinc-950 border-l border-zinc-800 w-full sm:max-w-md p-0 flex flex-col">
            <SheetHeader className="p-4 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <Avatar><AvatarImage src="/logos/djarum.png"/><AvatarFallback>TM</AvatarFallback></Avatar>
                    <div className="text-left">
                        <SheetTitle className="text-white text-sm font-bold">PB Djarum Official</SheetTitle>
                        <p className="text-xs text-zinc-400">Team Strategy Channel</p>
                    </div>
                </div>
            </SheetHeader>
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-6">
                    {TEAM_CHATS.map(c => (
                        <div key={c.id} className={cn("flex flex-col max-w-[85%]", c.self ? "ml-auto items-end" : "mr-auto items-start")}>
                            {!c.self && <span className="text-[10px] text-zinc-500 mb-1 ml-2 font-bold">{c.user}</span>}
                            <div className={cn("p-4 rounded-3xl text-sm font-medium shadow-sm", c.self ? "bg-indigo-600 text-white rounded-tr-sm" : "bg-zinc-800 text-zinc-200 rounded-tl-sm")}>
                                {c.msg}
                            </div>
                            <span className="text-[10px] text-zinc-600 mt-1 mx-2">{c.time}</span>
                        </div>
                    ))}
                </div>
            </ScrollArea>
            <div className="p-4 border-t border-zinc-800 bg-zinc-900">
                <div className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded-full border border-zinc-800 focus-within:border-indigo-500 transition-colors">
                    <Button size="icon" className="rounded-full bg-zinc-800 hover:bg-zinc-700 w-8 h-8 shrink-0"><Paperclip className="w-4 h-4 text-zinc-400"/></Button>
                    <Input className="bg-transparent border-none h-9 text-sm focus-visible:ring-0 placeholder:text-zinc-600" placeholder="Message team..." value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} />
                    <Button size="icon" className="rounded-full bg-indigo-600 hover:bg-indigo-700 w-9 h-9 shrink-0"><Send className="w-4 h-4 text-white"/></Button>
                </div>
            </div>
        </SheetContent>
    </Sheet>
  );

  const renderCourtCall = () => (
    <Card className="bg-zinc-900 border-zinc-800 rounded-[32px] p-6 relative overflow-hidden group">
        <div className={cn("absolute left-0 top-0 bottom-0 w-2 transition-all", 
            SCHEDULE.status === 'CALLING' ? "bg-red-600 animate-pulse" : "bg-green-500"
        )}></div>
        
        <div className="flex justify-between items-start mb-4 relative z-10">
            <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Clock className="w-4 h-4"/> Court Status
            </h3>
            <Badge className={cn("font-bold border-none px-3 py-1 text-[10px]", 
                SCHEDULE.status === 'CALLING' ? "bg-red-600 text-white animate-bounce" : "bg-green-600"
            )}>
                {SCHEDULE.status}
            </Badge>
        </div>
        
        <div className="space-y-1 relative z-10">
            <p className="text-xs text-zinc-400">Opponent</p>
            <p className="text-2xl font-black text-white uppercase leading-none">{SCHEDULE.opponent}</p>
            <p className="text-sm font-bold text-cyan-500 mt-1">{SCHEDULE.match}</p>
        </div>

        <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between items-center relative z-10">
            <Badge variant="outline" className="border-zinc-700 text-white h-8 px-3 text-sm">{SCHEDULE.court}</Badge>
            <span className="text-xs font-mono text-zinc-500">Est: {SCHEDULE.time}</span>
        </div>
    </Card>
  );

  const renderLiveScore = () => (
    <Card className="bg-zinc-900/50 border border-zinc-800/50 rounded-[32px] p-6">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black text-white uppercase flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-500"/> Live Scoring
            </h3>
            <Badge variant="outline" className="border-red-500 text-red-500 text-[10px] animate-pulse bg-red-500/10">● LIVE</Badge>
        </div>
        
        <div className="bg-black rounded-2xl border border-zinc-800 p-4 flex items-center justify-between">
            <div className="text-center w-1/3">
                <p className="text-xs font-bold text-zinc-500 mb-2">You</p>
                <p className="text-4xl font-black text-white">21</p>
                <div className="mt-2 w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-3/4"></div>
                </div>
            </div>
            <div className="text-center w-1/3 border-x border-zinc-800 h-12 flex flex-col justify-center">
                <p className="text-xs text-zinc-600 font-mono">VS</p>
                <p className="text-[10px] text-zinc-700">00:45</p>
            </div>
            <div className="text-center w-1/3">
                <p className="text-xs font-bold text-zinc-500 mb-2">Opponent</p>
                <p className="text-4xl font-black text-zinc-600">18</p>
                <div className="mt-2 w-full h-1 bg-zinc-800 rounded-full"></div>
            </div>
        </div>
        <Button variant="ghost" className="w-full mt-2 text-xs text-zinc-500 hover:text-white">View Full Bracket</Button>
    </Card>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                {renderDigitalID()}
            </div>
            <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Stats */}
                </div>
                {renderCourtCall()}
                {renderLiveScore()}
                {renderSquadChat()}
            </div>
        </div>
        {/* Tabs */}
        <Tabs defaultValue="history" className="w-full">
            <TabsList className="bg-zinc-900 p-1 rounded-2xl mb-6">
                <TabsTrigger value="history" className="rounded-xl px-6 font-bold data-[state=active]:bg-zinc-800">Match History</TabsTrigger>
                <TabsTrigger value="gallery" className="rounded-xl px-6 font-bold data-[state=active]:bg-zinc-800">Media Gallery</TabsTrigger>
            </TabsList>
            <TabsContent value="history" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {HISTORY.map((match, i) => (
                        <Card key={i} className="bg-zinc-900 border-zinc-800 rounded-[24px] p-0 overflow-hidden hover:bg-zinc-800/80 transition-colors cursor-pointer group">
                            <div className="p-5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={cn("w-1.5 h-12 rounded-full", match.result === 'WIN' ? "bg-green-500" : "bg-red-500")}></div>
                                    <div>
                                        <p className="text-xs text-zinc-500 font-bold uppercase mb-0.5">{match.event}</p>
                                        <h4 className="text-base font-black text-white">vs. {match.opponent}</h4>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Badge variant="secondary" className={cn("mb-1 font-bold text-[10px]", match.result === 'WIN' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500")}>
                                        {match.result}
                                    </Badge>
                                    <p className="text-xs font-mono text-zinc-400">{match.score}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </TabsContent>
            <TabsContent value="gallery">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {GALLERY.map((i) => (
                        <div key={i} className="group relative aspect-square bg-zinc-800 rounded-3xl overflow-hidden cursor-pointer border border-zinc-800 hover:border-zinc-600 transition-all">
                            <div className="absolute inset-0 flex items-center justify-center text-zinc-700 bg-zinc-900">
                                <Camera className="w-8 h-8 opacity-20"/>
                            </div>
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-3 p-4 backdrop-blur-sm">
                                <p className="text-white text-[10px] font-bold tracking-widest uppercase">Match Day {i}</p>
                                <div className="flex gap-2">
                                    <Button size="icon" className="rounded-full bg-white text-black hover:bg-zinc-200 w-10 h-10 shadow-lg"><Download className="w-4 h-4"/></Button>
                                    <Button size="icon" className="rounded-full bg-pink-600 text-white hover:bg-pink-700 w-10 h-10 shadow-lg"><Share2 className="w-4 h-4"/></Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </TabsContent>
        </Tabs>

        {/* Protest Modal */}
        <Dialog open={isProtestOpen} onOpenChange={setIsProtestOpen}>
            <DialogContent className="bg-zinc-950 border-red-900/50 text-white rounded-[32px] max-w-md p-0 overflow-hidden shadow-2xl shadow-red-900/20">
                <div className="p-6 border-b border-red-900/30 bg-red-950/10">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3 text-red-500 uppercase font-black tracking-tight text-xl">
                            <div className="p-2 bg-red-500/20 rounded-lg"><Gavel className="w-6 h-6"/></div>
                            Ajukan Protes
                        </DialogTitle>
                        <DialogDescription className="text-zinc-400 text-xs mt-2">
                            Laporan ini bersifat <strong>RAHASIA</strong> dan akan langsung ditangani oleh Tim Pencari Fakta (TPF).
                        </DialogDescription>
                    </DialogHeader>
                </div>
                <div className="p-6 space-y-5">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Jenis Pelanggaran</Label>
                        <Select>
                            <SelectTrigger className="bg-black border-zinc-800 h-12 rounded-xl text-white"><SelectValue placeholder="Pilih..." /></SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                <SelectItem value="JOKI">Pencurian Umur / Joki</SelectItem>
                                <SelectItem value="LEVEL">Manipulasi Level (Sandbagging)</SelectItem>
                                <SelectItem value="ETHIC">Pelanggaran Etika / Sportivitas</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Bukti (Wajib)</Label>
                        <div className="h-28 bg-black border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-zinc-600 hover:text-red-500 hover:border-red-500/50 cursor-pointer transition-colors">
                            <Upload className="w-6 h-6 mb-2"/>
                            <span className="text-xs font-bold">Upload Foto / Video</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Kronologi</Label>
                        <Textarea placeholder="Jelaskan detail kejadian..." className="bg-black border-zinc-800 min-h-[100px] rounded-xl p-3 text-sm text-white resize-none"/>
                    </div>
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-14 rounded-2xl shadow-lg shadow-red-900/20 text-lg mt-2">
                        KIRIM LAPORAN
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    </div>
  );
}

// --- MAIN PAGE COMPONENT (CONTROLLER) ---
export default function PlayerPage() {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    const [hasJoinedTeam, setHasJoinedTeam] = useState(false); 
    const [isRegistrationComplete, setIsRegistrationComplete] = useState(false); 
  
    useEffect(() => {
        setHasJoinedTeam(false);
    }, []);

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

    const handleVerifyCode = () => {
        if (!joinCode) return;
        setIsJoining(true);
        setTimeout(() => {
        setIsJoining(false);
        if (joinCode === "TWIN-2026") {
            setTeamName("PB TWINTON");
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

    const handleNextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
    const handlePrevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
    const updateAgreement = (key: keyof typeof formData.agreements) => {
        setFormData(prev => ({ ...prev, agreements: { ...prev.agreements, [key]: !prev.agreements[key as keyof typeof prev.agreements] } }));
    };

    const updatePlayer = (field: string, value: string) => {
        if ((field === 'nik' || field === 'wa') && !/^\d*$/.test(value)) return; 
        setFormData(prev => ({ ...prev, player: { ...prev.player, [field]: value } }));
    };
    
    const renderWizardContent = () => {
    switch (currentStep) {
        // STEP 1: DISCLAIMER (MANDATORY CHECKBOXES)
        case 1:
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                    <div className="bg-red-900/20 border border-red-500/30 p-6 rounded-3xl flex gap-4 items-start">
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

            {renderWizardContent()}

            <div className="flex justify-between mt-12 pt-6 border-t border-zinc-800">
                <Button variant="ghost" onClick={() => setCurrentStep(p => Math.max(1, p-1))} disabled={currentStep===1} className="h-14 px-8 rounded-2xl text-zinc-500 hover:text-white hover:bg-zinc-900 font-bold"><ChevronLeft className="w-5 h-5 mr-2"/> BACK</Button>
                
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
                        onClick={() => setCurrentStep(p => Math.min(p + 1, 5))} 
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
