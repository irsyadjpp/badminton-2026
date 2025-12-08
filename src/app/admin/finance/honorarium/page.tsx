
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Edit3, Coins, Save, BookOpen, TrendingUp, Users, Wallet, Trophy, Target, Star, Info, HelpCircle } from "lucide-react";
import { getStaffEvaluations, saveEvaluation, type StaffEvaluation } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// --- DATA PARAMETER ---
// Note: Array scores index 0 = Nilai 1, index 4 = Nilai 5
const parameterDetails = [
    { id: "P1", title: "Kehadiran & Kedisiplinan", description: "Mengukur seberapa konsisten hadir, tepat waktu, dan mengikuti agenda kerja.", scores: [ "Sering absen / terlambat.", "Hadir tapi sering terlambat.", "Cukup baik, kadang terlambat.", "Jarang absen, disiplin.", "Sangat disiplin, on-time." ] },
    { id: "P2", title: "Komitmen Tugas", description: "Mengukur keseriusan menjalankan tugas hingga selesai.", scores: [ "Banyak tugas terbengkalai.", "Sering terlambat selesai.", "Selesai meski lewat deadline.", "Selesai tepat waktu.", "Selalu selesai sebelum deadline." ] },
    { id: "P3", title: "Kualitas Output", description: "Seberapa baik hasil kerja yang diberikan.", scores: [ "Sering bermasalah/error.", "Banyak revisi.", "Standar, revisi minor.", "Baik dan konsisten.", "Sangat baik, presisi, pro." ] },
    { id: "P4", title: "Inisiatif", description: "Kemampuan bergerak tanpa harus selalu disuruh.", scores: [ "Pasif, harus disuruh.", "Jarang inisiatif.", "Cukup proaktif.", "Sering memberi ide.", "Motor penggerak tim." ] },
    { id: "P5", title: "Problem Solving", description: "Menyelesaikan masalah secara mandiri.", scores: [ "Tidak mampu/bingung.", "Butuh banyak arahan.", "Cukup bisa mandiri.", "Mandiri menyelesaikan.", "Sangat solutif & strategis." ] },
    { id: "P6", title: "Kerja Sama Tim", description: "Kemampuan berkolaborasi dengan divisi lain.", scores: [ "Sering konflik/menyulitkan.", "Kurang kooperatif.", "Cukup kooperatif.", "Baik dalam kolaborasi.", "Sangat suportif & positif." ] },
    { id: "P7", title: "Komunikasi", description: "Responsivitas dan kejelasan laporan.", scores: [ "Sulit dihubungi/silent.", "Respons lambat.", "Cukup komunikatif.", "Responsif & jelas.", "Sangat komunikatif & rapi." ] },
    { id: "P8", title: "Manajemen Waktu", description: "Pengelolaan waktu persiapan dan eksekusi.", scores: [ "Sangat buruk/keteteran.", "Kurang teratur.", "Standar.", "Baik & teratur.", "Sangat efisien & rapi." ] },
    { id: "P9", title: "Tanggung Jawab", description: "Level reliabilitas dalam memegang amanah.", scores: [ "Sering lalai/lempar tgs.", "Kurang bisa diandalkan.", "Cukup bertanggung jawab.", "Dapat diandalkan.", "Sangat amanah & dipercaya." ] },
    { id: "P10", title: "Adaptasi", description: "Fleksibilitas menghadapi perubahan mendadak.", scores: [ "Kaku/panik.", "Mengeluh saat berubah.", "Cukup fleksibel.", "Cepat beradaptasi.", "Sangat adaptif & tenang." ] },
    { id: "P11", title: "Kontribusi Ide", description: "Sumbangsih pemikiran dalam perencanaan.", scores: [ "Pasif/diam.", "Jarang berpendapat.", "Ide standar.", "Ide sering membantu.", "Ide visioner & berdampak." ] },
    { id: "P12", title: "Eksekusi Lapangan", description: "Performa kerja saat hari-H event.", scores: [ "Pasif/banyak diam.", "Banyak bingung/salah.", "Kerja sesuai SOP.", "Kerja cekatan & rapi.", "Eksekutor andalan/mvp." ] },
    { id: "P13", title: "Beban Kerja Real", description: "Volume pekerjaan yang ditanggung.", scores: [ "Sangat ringan/gabut.", "Ringan.", "Sedang.", "Berat/sibuk.", "Sangat berat/tulang punggung." ] },
    { id: "P14", title: "Keahlian Teknis", description: "Skill teknis sesuai role (IT/Wasit/Desain/dll).", scores: [ "Tidak menguasai.", "Masih belajar.", "Cukup menguasai.", "Ahli/Mahir.", "Expert/Profesional." ] },
    { id: "P15", title: "Etika & Sikap", description: "Sopan santun dan attitude kerja.", scores: [ "Buruk/toxic.", "Kurang sopan.", "Cukup baik.", "Baik & sopan.", "Sangat profesional & teladan." ] },
    { id: "P16", title: "Dampak Strategis", description: "Seberapa kritikal peran orang ini.", scores: [ "Digantikan mudah.", "Dampak kecil.", "Dampak sedang.", "Signifikan.", "Kritikal/tak tergantikan." ] }
];

export default function HonorariumPage() {
  const { toast } = useToast();
  const [totalProfit, setTotalProfit] = useState(100000000); 
  const [staffList, setStaffList] = useState<StaffEvaluation[]>([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffEvaluation | null>(null);
  const [tempScores, setTempScores] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getStaffEvaluations();
    setStaffList(data);
  };

  // --- LOGIKA HITUNGAN (Sama) ---
  const SHARE = { inisiatorActive: 0.30, inisiatorPassive: 0.10, panitia: 0.50, komunitas: 0.05, nonPanitia: 0.05 };
  const listPanitia = staffList.filter(s => s.type === 'PANITIA');
  const listNonPanitia = staffList.filter(s => s.type === 'NON_PANITIA');
  const totalPoinPanitia = listPanitia.reduce((acc, curr) => acc + curr.rawScore, 0);
  const totalPoinNP = listNonPanitia.reduce((acc, curr) => acc + curr.rawScore, 0);
  const nilaiPerPoinPanitia = totalPoinPanitia > 0 ? (totalProfit * SHARE.panitia) / totalPoinPanitia : 0;
  const nilaiPerPoinNP = totalPoinNP > 0 ? (totalProfit * SHARE.nonPanitia) / totalPoinNP : 0;
  const honorInisiatorActive = totalProfit * SHARE.inisiatorActive;
  const honorInisiatorPassive = totalProfit * SHARE.inisiatorPassive;
  const honorKomunitas = totalProfit * SHARE.komunitas;
  const budgetPanitia = totalProfit * SHARE.panitia;
  const budgetNP = totalProfit * SHARE.nonPanitia;

  // --- HANDLERS ---
  const openEvaluation = (staff: StaffEvaluation) => {
      setSelectedStaff(staff);
      setTempScores({ ...staff.scores });
      setIsModalOpen(true);
  };

  const handleScoreChange = (key: string, val: number) => {
      if (tempScores) setTempScores({ ...tempScores, [key]: val });
  };

  const handleSave = async () => {
      if (selectedStaff && tempScores) {
          await saveEvaluation(selectedStaff.id, tempScores);
          toast({ title: "Penilaian Disimpan", description: `Skor ${selectedStaff.name} diperbarui.` });
          setIsModalOpen(false);
          loadData(); 
      }
  };

  // --- COMPONENT: SCORE INPUT WITH TOOLTIPS ---
  const ScoreInput = ({ paramId }: { paramId: string }) => {
    const score = tempScores?.[paramId] || 0;
    
    // Cari detail parameter
    const detail = parameterDetails.find(p => p.id === paramId);
    const title = detail ? detail.title : paramId;
    const desc = detail ? detail.description : "Deskripsi parameter...";
    const scoreDescs = detail ? detail.scores : ["-", "-", "-", "-", "-"];

    return (
        <TooltipProvider delayDuration={100}>
            <div className="mb-4 p-5 bg-secondary/10 hover:bg-secondary/20 rounded-[20px] transition-colors border border-transparent hover:border-primary/10">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <Label className="text-sm font-bold text-foreground/80 tracking-wide uppercase">
                            {title}
                        </Label>
                        {/* 1. INFO TOOLTIP UNTUK PARAMETER */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="w-4 h-4 text-muted-foreground cursor-help hover:text-primary transition-colors"/>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs bg-zinc-900 text-white border-zinc-800 p-3">
                                <p className="text-xs font-medium">{desc}</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    {score > 0 && (
                        <Badge variant={score >= 4 ? 'default' : score === 3 ? 'secondary' : 'destructive'} className="rounded-full px-3 text-[10px]">
                            {score} / 5
                        </Badge>
                    )}
                </div>
                
                {/* 2. TOMBOL NILAI 1-5 DENGAN TOOLTIP MAKNA */}
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((val) => {
                        const isSelected = score === val;
                        let activeClass = "";
                        if (val <= 2) activeClass = "bg-red-500 hover:bg-red-600 text-white ring-2 ring-red-200";
                        else if (val === 3) activeClass = "bg-yellow-500 hover:bg-yellow-600 text-white ring-2 ring-yellow-200";
                        else activeClass = "bg-green-600 hover:bg-green-700 text-white ring-2 ring-green-200";

                        return (
                            <Tooltip key={val}>
                                <TooltipTrigger asChild>
                                    <button
                                        type="button"
                                        onClick={() => handleScoreChange(paramId, val)}
                                        className={cn(
                                            "flex-1 h-12 rounded-xl font-black text-lg transition-all duration-200 transform",
                                            isSelected 
                                                ? `${activeClass} shadow-lg scale-105 z-10` 
                                                : "bg-white dark:bg-zinc-800 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-transparent hover:border-primary/20 hover:text-primary active:scale-95"
                                        )}
                                    >
                                        {val}
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="bg-zinc-900 text-white border-zinc-800 text-xs p-2">
                                    {/* Ambil deskripsi skor spesifik (index array = val - 1) */}
                                    <p className="font-bold mb-0.5">Nilai {val}</p>
                                    <p className="text-zinc-400">{scoreDescs[val - 1]}</p>
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </div>
            </div>
        </TooltipProvider>
    );
  };
  
  // MD3 Color System
  const colorVariants = {
    blue: { container: "bg-blue-100/50 text-blue-900", iconBg: "bg-blue-200 text-blue-700", label: "text-blue-700" },
    cyan: { container: "bg-cyan-100/50 text-cyan-900", iconBg: "bg-cyan-200 text-cyan-700", label: "text-cyan-700" },
    primary: { container: "bg-primary/5 text-primary-foreground border-primary/10 border", iconBg: "bg-primary/20 text-primary", label: "text-primary" },
    purple: { container: "bg-purple-100/50 text-purple-900", iconBg: "bg-purple-200 text-purple-700", label: "text-purple-700" },
    orange: { container: "bg-orange-100/50 text-orange-900", iconBg: "bg-orange-200 text-orange-700", label: "text-orange-700" }
  };

  const AllocationCard = ({ title, amount, color, description, icon: Icon }: any) => {
    const variants = colorVariants[color as keyof typeof colorVariants];
    return (
      <Card className={cn("rounded-[28px] border-none shadow-sm", variants.container)}>
          <CardContent className="p-6 flex flex-col justify-between h-full">
              <div className="flex justify-between items-start mb-4">
                  <div className={cn("p-4 rounded-[20px]", variants.iconBg)}><Icon className="w-6 h-6" /></div>
                  {description && <span className={cn("text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full bg-white/60", variants.label)}>{description}</span>}
              </div>
              <div>
                  <p className={cn("text-xs font-bold uppercase tracking-widest opacity-70 mb-1", variants.label)}>{title}</p>
                  <h3 className="text-2xl font-black tracking-tight">Rp {amount.toLocaleString('id-ID', {notation: "compact"})}</h3>
              </div>
          </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-10 font-body pb-20">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
            <div className="flex items-center gap-2 mb-3">
                <Badge className="rounded-full px-4 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold border-none">FINANCE • PROFIT SHARING</Badge>
            </div>
            <h2 className="text-5xl font-black font-headline text-foreground uppercase tracking-tighter leading-none">
                Profit <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">Distribution</span>
            </h2>
            <p className="text-lg text-muted-foreground mt-3 max-w-2xl font-medium">Transparansi distribusi keuangan untuk seluruh stakeholder.</p>
        </div>
        <div className="bg-zinc-950 text-white pl-2 pr-8 py-2 rounded-full flex items-center gap-4 shadow-2xl border border-zinc-800">
            <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.4)]"><TrendingUp className="w-6 h-6 text-black" /></div>
            <div>
                <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest mb-0.5">Net Profit</p>
                <div className="font-black text-2xl font-mono">Rp {totalProfit.toLocaleString('id-ID', { notation: "compact" })}</div>
            </div>
        </div>
      </div>

      {/* ALLOCATION GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
         <div className="lg:col-span-2"><AllocationCard title="Inisiator Aktif" description="30% Share" amount={honorInisiatorActive} color="blue" icon={Target}/></div>
         <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            <AllocationCard title="Pasif" description="10%" amount={honorInisiatorPassive} color="cyan" icon={Wallet}/>
            <AllocationCard title="Komunitas" description="5% Kas" amount={honorKomunitas} color="purple" icon={Users}/>
            <AllocationCard title="Kontributor" description="5%" amount={budgetNP} color="orange" icon={BookOpen}/>
         </div>
         <div className="lg:col-span-5">
            <Card className="rounded-[40px] bg-gradient-to-br from-zinc-900 to-black text-white border-none shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none group-hover:bg-primary/30 transition-all duration-1000"></div>
                <CardContent className="p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    <div className="flex items-center gap-8">
                        <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/10"><Trophy className="w-10 h-10 text-yellow-400 drop-shadow-lg" /></div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-4xl font-black uppercase tracking-tight">Panitia</h3>
                                <Badge className="bg-yellow-500 text-black hover:bg-yellow-400 font-bold px-3">50% POOL</Badge>
                            </div>
                            <p className="text-zinc-400 font-medium max-w-md">Alokasi terbesar untuk eksekutor lapangan berdasarkan kinerja.</p>
                        </div>
                    </div>
                    <div className="text-right bg-white/5 p-6 rounded-3xl border border-white/5 backdrop-blur-sm">
                        <p className="text-xs font-bold uppercase text-zinc-500 mb-1">Total Budget Pool</p>
                        <div className="text-5xl font-black text-white mb-2">Rp {budgetPanitia.toLocaleString('id-ID', {notation: "compact"})}</div>
                        <div className="inline-flex items-center gap-2 text-green-400 font-mono font-bold bg-green-900/30 px-4 py-2 rounded-full text-sm"><Coins className="w-4 h-4" /> Rate: Rp {Math.round(nilaiPerPoinPanitia).toLocaleString()}/poin</div>
                    </div>
                </CardContent>
            </Card>
         </div>
      </div>

      {/* TABS & TABLE */}
      <Tabs defaultValue="panitia" className="w-full mt-8">
        <div className="flex justify-center mb-10">
            <TabsList className="bg-muted/50 p-1.5 rounded-full h-16 w-full max-w-lg shadow-inner">
                <TabsTrigger value="panitia" className="rounded-full h-full w-1/2 font-bold text-base data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg transition-all">PANITIA INTI</TabsTrigger>
                <TabsTrigger value="kontributor" className="rounded-full h-full w-1/2 font-bold text-base data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg transition-all">KONTRIBUTOR</TabsTrigger>
            </TabsList>
        </div>
        
        <TabsContent value="panitia">
            <Card className="rounded-[40px] border-none shadow-xl overflow-hidden bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl">
                <CardHeader className="bg-muted/30 p-10 pb-6 border-b border-border/50">
                    <CardTitle className="text-3xl font-black uppercase tracking-tight">Tabel Evaluasi</CardTitle>
                    <CardDescription className="text-base mt-2">Daftar staf dan kalkulasi honorarium otomatis.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-b border-border/60">
                                <TableHead className="pl-10 h-16 font-black text-xs uppercase tracking-widest text-muted-foreground">NAMA STAFF</TableHead>
                                <TableHead className="font-black text-xs uppercase tracking-widest text-muted-foreground">JABATAN</TableHead>
                                <TableHead className="text-center font-black text-xs uppercase tracking-widest text-muted-foreground">POIN (P1-16)</TableHead>
                                <TableHead className="text-right pr-10 font-black text-xs uppercase tracking-widest text-muted-foreground">TAKE HOME PAY</TableHead>
                                <TableHead className="w-[100px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {listPanitia.map((staff) => (
                                <TableRow key={staff.id} className="hover:bg-primary/5 border-b border-border/40 transition-all group cursor-pointer" onClick={() => openEvaluation(staff)}>
                                    <TableCell className="pl-10 py-5">
                                        <div className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{staff.name}</div>
                                        <div className="text-xs font-mono text-muted-foreground opacity-60">ID: {staff.id}</div>
                                    </TableCell>
                                    <TableCell><Badge variant="secondary" className="rounded-lg px-3 py-1.5 font-bold text-[10px] uppercase tracking-wider bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 group-hover:bg-primary/20 group-hover:text-primary">{staff.jabatan}</Badge></TableCell>
                                    <TableCell className="text-center"><div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 font-black text-xl text-zinc-700 dark:text-zinc-300 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">{staff.rawScore}</div></TableCell>
                                    <TableCell className="text-right pr-10"><div className="font-mono font-black text-xl text-green-600 dark:text-green-400 group-hover:scale-105 origin-right transition-transform">Rp {Math.round(staff.rawScore * nilaiPerPoinPanitia).toLocaleString('id-ID')}</div></TableCell>
                                    <TableCell className="pr-6 text-center"><Button size="icon" variant="ghost" className="rounded-full w-12 h-12 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"><Edit3 className="w-5 h-5" /></Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="kontributor">
             <Card className="rounded-[40px] border-none shadow-xl overflow-hidden bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-b border-border/60">
                                <TableHead className="pl-10 h-16 font-black text-xs uppercase tracking-widest text-muted-foreground">NAMA</TableHead>
                                <TableHead className="font-black text-xs uppercase tracking-widest text-muted-foreground">PERAN</TableHead>
                                <TableHead className="text-center font-black text-xs uppercase tracking-widest text-muted-foreground">POIN</TableHead>
                                <TableHead className="text-right pr-10 font-black text-xs uppercase tracking-widest text-muted-foreground">HONOR</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {listNonPanitia.map((staff) => (
                                <TableRow key={staff.id} className="hover:bg-orange-50/50 border-b border-border/40 transition-all group cursor-pointer" onClick={() => openEvaluation(staff)}>
                                    <TableCell className="pl-10 py-5 font-bold text-lg">{staff.name}</TableCell>
                                    <TableCell><Badge variant="outline" className="rounded-lg">{staff.jabatan}</Badge></TableCell>
                                    <TableCell className="text-center"><div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 font-black text-xl">{staff.rawScore}</div></TableCell>
                                    <TableCell className="text-right pr-10 font-mono font-black text-xl text-orange-600">Rp {Math.round(staff.rawScore * nilaiPerPoinNP).toLocaleString('id-ID')}</TableCell>
                                    <TableCell className="pr-6 text-center"><Button size="icon" variant="ghost" className="rounded-full w-12 h-12 hover:bg-orange-100 text-orange-600"><Edit3 className="w-5 h-5" /></Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>

      {/* --- DIALOGS (WITH TOOLTIP PROVIDER & SCROLLAREA) --- */}
      <Dialog>
        <DialogTrigger asChild><span id="guide-trigger" className="hidden"></span></DialogTrigger>
        <DialogContent className="max-w-4xl h-[85vh] flex flex-col bg-background rounded-[32px] border-none shadow-2xl p-0 overflow-hidden">
            <div className="p-8 border-b bg-muted/30"><DialogTitle className="text-3xl font-black uppercase tracking-tighter text-primary">Panduan Penilaian</DialogTitle><DialogDescription className="text-lg">Parameter P1-P16 untuk objektivitas honorarium.</DialogDescription></div>
            <ScrollArea className="flex-grow p-8"><Accordion type="single" collapsible className="w-full space-y-2">{parameterDetails.map((param) => (<AccordionItem value={param.id} key={param.id} className="border-none bg-secondary/10 rounded-2xl px-4"><AccordionTrigger className="font-bold text-left hover:no-underline py-4 text-base">{param.title}</AccordionTrigger><AccordionContent className="pb-4"><p className="text-muted-foreground italic mb-4 text-sm">{param.description}</p><div className="grid grid-cols-1 md:grid-cols-2 gap-2">{param.scores.map((score, i) => (<div key={i} className="flex gap-3 items-center bg-background p-2 rounded-lg border text-sm"><div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">{i+1}</div><span className="text-foreground/80">{score}</span></div>))}</div></AccordionContent></AccordionItem>))}</Accordion></ScrollArea>
        </DialogContent>
      </Dialog>
      
      {/* --- MODAL PENILAIAN (REVISI SCROLL) --- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {/* PERBAIKAN: 
           1. h-[90vh]: Menetapkan tinggi fix agar flex-grow berfungsi.
           2. p-0: Menghapus padding default dialog agar header/footer menempel ke tepi.
        */}
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col bg-background rounded-[32px] border-none p-0 shadow-2xl">
            
            {/* HEADER (FIXED/STICKY) */}
            <div className="p-8 border-b bg-muted/20 shrink-0 z-10">
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                        <Star className="w-6 h-6 fill-primary" />
                    </div>
                    <div>
                        <DialogTitle className="text-3xl font-black uppercase tracking-tight text-foreground">
                            Lembar Evaluasi
                        </DialogTitle>
                        <DialogDescription className="text-lg">
                            Menilai: <span className="font-bold text-primary">{selectedStaff?.name}</span>
                        </DialogDescription>
                    </div>
                </div>
            </div>
            
            {/* CONTENT AREA (SCROLLABLE) */}
            {/* PERBAIKAN: 
               Menggunakan ScrollArea dengan 'flex-1' agar mengisi sisa ruang antara Header & Footer.
               Isi konten diberi padding yang cukup agar tidak terpotong scrollbar.
            */}
            <ScrollArea className="flex-1 bg-muted/5 w-full rounded-none">
                <div className="p-8 pb-20"> {/* pb-20 untuk extra space di bawah */}
                    {selectedStaff?.type === 'PANITIA' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                          <ScoreInput paramId="P1" />
                          <ScoreInput paramId="P2" />
                          <ScoreInput paramId="P3" />
                          <ScoreInput paramId="P4" />
                          <ScoreInput paramId="P5" />
                          <ScoreInput paramId="P6" />
                          <ScoreInput paramId="P7" />
                          <ScoreInput paramId="P8" />
                          <ScoreInput paramId="P9" />
                          <ScoreInput paramId="P10" />
                          <ScoreInput paramId="P11" />
                          <ScoreInput paramId="P12" />
                          <ScoreInput paramId="P13" />
                          <ScoreInput paramId="P14" />
                          <ScoreInput paramId="P15" />
                          <ScoreInput paramId="P16" />
                        </div>
                    ) : (
                        <div className="p-8 rounded-[32px] bg-orange-50/50 border-2 border-orange-100">
                            <h4 className="font-black text-orange-700 mb-8 text-xl uppercase tracking-widest flex items-center gap-3">
                                <BookOpen className="w-6 h-6"/> Parameter Kontributor
                            </h4>
                            <div className="grid gap-4">
                                <ScoreInput paramId="NP1" /> {/* Pastikan ID ini ditangani di logic */}
                                <div className="text-center text-muted-foreground p-4">
                                    Parameter khusus kontributor (Non-Panitia).
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* FOOTER (FIXED/STICKY) */}
            <div className="p-6 border-t bg-background shrink-0 flex justify-end gap-4 z-10 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                <Button 
                    variant="ghost" 
                    onClick={() => setIsModalOpen(false)} 
                    className="rounded-full px-8 font-bold h-14 text-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white transition-colors"
                >
                    Batal
                </Button>
                
                <Button 
                    onClick={handleSave} 
                    className="rounded-full px-10 font-bold h-14 text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 transition-all active:scale-95"
                >
                    <Save className="w-6 h-6 mr-2" /> Simpan Penilaian
                </Button>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
