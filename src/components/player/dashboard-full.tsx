
'use client';

import { useState } from "react";
import Link from "next/link";
import {
  Trophy, Users, Shield, QrCode, Activity, Calendar,
  ArrowRight, LogOut, User, Upload, FileText,
  AlertTriangle, Instagram, History, Info, ChevronRight,
  Camera, MessageCircle, Download, Gavel, Clock,
  Share2, RotateCw, AlertOctagon, Send, Paperclip,
  MoreHorizontal, CheckCheck, Smile, Plus, Heart,
  Wallet, Banknote, CreditCard, Sparkles, UserRound, Footprints, Save
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// --- CONSTANTS & MOCK DATA ---
const ATHLETE_MOCK = {
  id: "ATL-8821",
  name: "Jonathan Christie",
  team: "PB Djarum Official",
  rank: "PRO",
  points: 8500,
  winRate: 78,
  avatar: "https://github.com/shadcn.png",
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
export default function PlayerDashboardFull() {
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

                <CardContent className="p-8 flex flex-col items-center h-full relative z-10">
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
    <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                {renderDigitalID()}
                {renderSquadChat()}
            </div>
            <div className="lg:col-span-2 space-y-6">
                {renderCourtCall()}
                {renderLiveScore()}
            </div>
        </div>
        
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
