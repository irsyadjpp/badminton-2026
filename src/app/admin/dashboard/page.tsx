
'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { QrCode, Utensils, Wallet, CheckCircle2, MapPin, ScanLine, Trophy, AlertCircle, Camera, Upload, Clock, ShieldCheck } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useToast } from "@/hooks/use-toast";
import { clockIn, redeemMeal, completeMission, getCommitteeData, getMyDutyRoster } from "./actions";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

type Mission = {
  id: number;
  title: string;
  xp: number;
  status: 'TODO' | 'PENDING_REVIEW' | 'DONE';
};

export default function CommitteeDashboard() {
  const { toast } = useToast();
  
  // State Data
  const [data, setData] = useState<any>(null);
  const [roster, setRoster] = useState<any>(null);

  // State Fitur
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState("-");
  const [mealCode, setMealCode] = useState<string | null>(null);
  const [loadingMeal, setLoadingMeal] = useState(false);
  
  // Mission Modal State
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [isSubmittingMission, setIsSubmittingMission] = useState(false);


  // Load Data Awal
  useEffect(() => {
    getCommitteeData().then(setData);
    getMyDutyRoster().then(setRoster);
  }, []);

  // 1. HANDLER ABSENSI
  const handleScanAttendance = async () => {
    toast({ title: "Membuka Kamera...", description: "Arahkan ke QR Code Pos Jaga." });
    
    setTimeout(async () => {
      const res = await clockIn("Main Gate");
      if (res.success) {
        setIsClockedIn(true);
        setCheckInTime(res.timestamp);
        toast({ 
          title: `Streak Hari ke-${res.streak}! 🔥`, 
          description: "Absensi berhasil dicatat.", 
          className: "bg-green-600 text-white" 
        });
      }
    }, 1500);
  };

  // 2. HANDLER KUPON MAKAN
  const handleRedeemMeal = async () => {
    setLoadingMeal(true);
    const res = await redeemMeal();
    if (res.success) {
      setMealCode(res.code);
    }
    setLoadingMeal(false);
  };

  // 3. HANDLER MISI
  const handleMissionSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedMission) return;

    setIsSubmittingMission(true);
    const formData = new FormData(e.currentTarget);
    formData.append('missionId', selectedMission.id.toString());
    const res = await completeMission(formData);
    
    if (res.success) {
      const newMissions = data.missions.map((m: any) => 
        m.id === selectedMission.id ? { ...m, status: res.status } : m
      );
      setData({ ...data, missions: newMissions });
      toast({ title: "Terkirim!", description: res.message });
      setIsMissionModalOpen(false);
    }
    setIsSubmittingMission(false);
  };

  if (!data || !roster) return <div className="p-8 text-white flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-black text-white font-body pb-20">
      <div className="fixed inset-0 bg-grid-sporty opacity-20 pointer-events-none" />
      
      <div className="relative z-10 p-6 bg-zinc-900 border-b border-zinc-800">
        <h1 className="text-2xl font-black font-headline text-white uppercase tracking-tighter">
          Committee <span className="text-primary">Hub</span>
        </h1>
        <p className="text-zinc-400 text-sm">Welcome back, Agent Kevin.</p>
        
        <div className="mt-4 flex items-center justify-between bg-black p-3 rounded-lg border border-zinc-800">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                    <Trophy className="w-5 h-5" />
                </div>
                <div>
                    <div className="text-xs text-zinc-500 uppercase font-bold">Level 5</div>
                    <div className="text-sm font-bold text-white">Elite Officer</div>
                </div>
            </div>
            <div className="text-right">
                <div className="text-xs text-zinc-500 mb-1">1250 XP</div>
                <Progress value={75} className="w-24 h-2 bg-zinc-800" />
            </div>
        </div>
      </div>

      <div className="relative z-10 p-6 space-y-6">
        
        {roster && (
            <Card className="bg-zinc-900 border-l-4 border-l-primary shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                  <Clock className="w-3 h-3" /> Shift Jadwal Anda
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-2xl font-black text-white font-headline">{roster.currentShift.time}</div>
                    <div className="flex items-center gap-2 text-primary font-bold text-sm mt-1">
                      <MapPin className="w-4 h-4" />
                      {roster.currentShift.location}
                    </div>
                  </div>
                  <Badge className="bg-primary hover:bg-primary animate-pulse">ACTIVE</Badge>
                </div>
                
                <div className="pt-3 border-t border-zinc-800 flex items-center gap-2 text-xs text-zinc-500">
                  <ShieldCheck className="w-3 h-3" />
                  Supervisor: {roster.currentShift.supervisor}
                </div>
              </CardContent>
            </Card>
        )}
        
        <Card className="bg-zinc-900 border-zinc-800 shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><QrCode className="w-24 h-24 text-white" /></div>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                    <ScanLine className="text-primary" /> Absensi Harian
                </CardTitle>
            </CardHeader>
            <CardContent>
                {isClockedIn ? (
                    <div className="bg-green-900/20 border border-green-900 p-4 rounded-xl text-center">
                        <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-2" />
                        <h3 className="text-xl font-bold text-green-500">CLOCKED IN</h3>
                        <p className="text-zinc-400 font-mono text-sm">{checkInTime} WIB @ Main Gate</p>
                    </div>
                ) : (
                    <Button onClick={handleScanAttendance} size="lg" className="w-full h-16 text-lg font-bold uppercase tracking-widest bg-white text-black hover:bg-zinc-200">
                        <Camera className="mr-2 w-6 h-6" /> Scan QR Pos
                    </Button>
                )}
            </CardContent>
        </Card>

        <Tabs defaultValue="missions" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-zinc-800 h-12">
                <TabsTrigger value="missions">Misi</TabsTrigger>
                <TabsTrigger value="meals">Makan</TabsTrigger>
                <TabsTrigger value="wallet">Dompet</TabsTrigger>
            </TabsList>

            <TabsContent value="missions" className="space-y-4 mt-4">
                {data.missions.map((mission: Mission) => (
                    <div key={mission.id} className={`p-4 rounded-xl border flex items-center justify-between transition-all ${mission.status !== 'TODO' ? "bg-zinc-900/50 border-zinc-800 opacity-70" : "bg-zinc-900 border-zinc-700"}`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${mission.status === 'DONE' ? "bg-primary border-primary" : "border-zinc-500"}`}>
                                {mission.status === 'DONE' && <CheckCircle2 className="w-4 h-4 text-white" />}
                                {mission.status === 'PENDING_REVIEW' && <Clock className="w-4 h-4 text-yellow-500" />}
                            </div>
                            <span className={mission.status !== 'TODO' ? "line-through text-zinc-500" : "text-white font-medium"}>
                                {mission.title}
                            </span>
                        </div>
                        {mission.status === 'TODO' && (
                            <Dialog open={selectedMission?.id === mission.id} onOpenChange={(open) => !open && setSelectedMission(null)}>
                                <DialogTrigger asChild>
                                    <Button size="sm" variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10" onClick={() => setSelectedMission(mission)}>
                                        <Upload className="w-4 h-4 mr-1"/> Selesaikan Misi
                                    </Button>
                                </DialogTrigger>
                            </Dialog>
                        )}
                        {mission.status === 'PENDING_REVIEW' && (
                            <Badge variant="outline" className="border-yellow-500 text-yellow-500">Review</Badge>
                        )}
                         {mission.status === 'DONE' && (
                            <Badge variant="outline" className="text-zinc-500 border-zinc-500">+{mission.xp} XP</Badge>
                        )}
                    </div>
                ))}
            </TabsContent>

            <TabsContent value="meals" className="mt-4">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2"><Utensils className="w-5 h-5"/> Digital Meal Ticket</CardTitle>
                        <CardDescription>Tunjukkan QR ini ke tim konsumsi.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-6">
                        {mealCode ? (
                            <div className="text-center animate-in zoom-in duration-300">
                                <div className="bg-white p-4 rounded-xl mb-4">
                                    <QRCodeSVG value={mealCode} size={180} />
                                </div>
                                <div className="font-mono text-xl font-bold text-primary tracking-widest">{mealCode}</div>
                                <p className="text-sm text-zinc-400 mt-2">Nasi Ayam Bakar + Es Teh</p>
                            </div>
                        ) : (
                            <div className="text-center space-y-4">
                                <div className="w-32 h-32 bg-zinc-800 rounded-full flex items-center justify-center mx-auto">
                                    <Utensils className="w-12 h-12 text-zinc-600" />
                                </div>
                                <p className="text-zinc-400 text-sm">Jatah makan siang tersedia pukul 12:00 - 14:00</p>
                                <Button onClick={handleRedeemMeal} disabled={loadingMeal} className="w-full">
                                    {loadingMeal ? "Generating..." : "Klaim Tiket Makan"}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="wallet" className="mt-4">
                <Card className="bg-gradient-to-br from-zinc-900 to-black border-zinc-800">
                    <CardHeader>
                         <CardTitle className="text-zinc-400 text-sm uppercase tracking-widest">Estimasi Honorarium</CardTitle>
                         <div className="text-4xl font-black text-white font-mono mt-2">
                            Rp {data.honorarium.total.toLocaleString('id-ID')}
                         </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-white border-b border-zinc-800 pb-2">History Kehadiran</h4>
                            {data.honorarium.breakdown.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center text-sm">
                                    <div className="text-zinc-400">{item.activity} <span className="text-xs text-zinc-600">({item.date})</span></div>
                                    <div className="font-mono text-green-500">+Rp {item.amount.toLocaleString('id-ID')}</div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-8 pt-4 border-t border-zinc-800">
                            <Button variant="outline" className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                                <Upload className="mr-2 w-4 h-4" /> Upload Struk Reimbursement
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!selectedMission} onOpenChange={(open) => !open && setSelectedMission(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
            <DialogHeader>
                <DialogTitle>Selesaikan Misi: {selectedMission?.title}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleMissionSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label>Upload Bukti Foto</Label>
                    <Input name="proof" type="file" accept="image/*" required className="file:text-primary file:font-bold"/>
                    <p className="text-xs text-muted-foreground">Ambil foto yang menunjukkan Anda telah menyelesaikan tugas.</p>
                </div>
                <DialogFooter>
                    <Button type="submit" className="w-full font-bold" disabled={isSubmittingMission}>
                        {isSubmittingMission ? <Loader2 className="animate-spin" /> : "Kirim Bukti Kerja"}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
