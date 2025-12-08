
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Edit3, Coins, Save, BookOpen, TrendingUp, Users, Wallet, Trophy, Target } from "lucide-react";
import { getStaffEvaluations, saveEvaluation, type StaffEvaluation } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// --- DATA PARAMETER (Sama seperti sebelumnya) ---
const parameterDetails = [
    { id: "P1", title: "P1 — Kehadiran & Kedisiplinan", description: "Mengukur seberapa konsisten hadir, tepat waktu, dan mengikuti agenda kerja.", scores: [ "1: Sering absen / sering terlambat.", "2: Hadir tapi cukup sering terlambat.", "3: Kehadiran cukup baik, kadang terlambat.", "4: Jarang absen, disiplin.", "5: Sangat disiplin, selalu hadir dan tepat waktu." ] },
    { id: "P2", title: "P2 — Komitmen terhadap Tugas", description: "Mengukur keseriusan menjalankan tugas hingga selesai.", scores: [ "1: Banyak tugas tidak selesai.", "2: Sering terlambat menyelesaikan tugas.", "3: Tugas selesai meski kadang lewat deadline.", "4: Hampir semua tugas selesai tepat waktu.", "5: Sangat berkomitmen, selalu selesai sebelum deadline." ] },
    { id: "P3", title: "P3 — Kualitas Output", description: "Seberapa baik hasil kerja yang diberikan.", scores: [ "1: Output sering bermasalah.", "2: Output cukup banyak revisi.", "3: Standar, ada revisi kecil.", "4: Kualitas baik dan konsisten.", "5: Output sangat baik, presisi, profesional." ] },
    { id: "P4", title: "P4 — Inisiatif & Proaktivitas", description: "Kemampuan bergerak tanpa harus selalu disuruh.", scores: [ "1: Pasif.", "2: Kadang inisiatif, tapi jarang.", "3: Cukup proaktif.", "4: Sering memberi ide dan bertindak.", "5: Sangat proaktif dan jadi motor penggerak." ] },
    { id: "P5", title: "P5 — Problem Solving", description: "Menyelesaikan masalah secara mandiri dan efektif.", scores: [ "1: Tidak mampu menyelesaikan masalah.", "2: Sering bingung dan butuh arahan.", "3: Cukup bisa menyelesaikan masalah.", "4: Mandiri menyelesaikan masalah.", "5: Sangat solutif, strategis, efektif." ] },
    { id: "P6", title: "P6 — Kerja Sama Tim", description: "Seberapa baik berkolaborasi dengan tim lain.", scores: [ "1: Menyulitkan / sering konflik.", "2: Kadang tidak kooperatif.", "3: Cukup kooperatif.", "4: Baik dalam kolaborasi.", "5: Sangat kooperatif & memberi energi positif." ] },
    { id: "P7", title: "P7 — Komunikasi", description: "Kemampuan berkomunikasi, melaporkan progres, dan merespons chat.", scores: [ "1: Tidak komunikatif.", "2: Respons lambat.", "3: Komunikatif cukup.", "4: Komunikatif dan responsif.", "5: Sangat komunikatif, koordinatif, dan jelas." ] },
    { id: "P8", title: "P8 — Manajemen Waktu", description: "Kemampuan mengelola waktu saat event dan persiapan.", scores: [ "1: Sangat buruk.", "2: Cukup buruk.", "3: Standar.", "4: Baik.", "5: Sangat baik." ] },
    { id: "P9", title: "P9 — Tanggung Jawab & Reliabilitas", description: "Seberapa dapat diandalkan dan bertanggung jawab.", scores: [ "1: Tidak dapat diandalkan.", "2: Sering lalai.", "3: Cukup bertanggung jawab.", "4: Dapat diandalkan.", "5: Sangat andal & dipercaya." ] },
    { id: "P10", title: "P10 — Adaptasi & Fleksibilitas", description: "Kemampuan beradaptasi dengan perubahan mendadak.", scores: [ "1: Sulit beradaptasi.", "2: Kurang fleksibel.", "3: Cukup fleksibel.", "4: Cepat beradaptasi.", "5: Sangat fleksibel & adaptif." ] },
    { id: "P11", title: "P11 — Kontribusi Ide & Perencanaan", description: "Apakah berkontribusi dalam brainstorming dan rancangan event.", scores: [ "1: Tidak memberi ide.", "2: Sesekali memberi ide.", "3: Memberi ide standar.", "4: Sering memberi ide membantu.", "5: Ide strategis, visioner, berdampak." ] },
    { id: "P12", title: "P12 — Eksekusi Lapangan", description: "Kinerja saat hari-H event.", scores: [ "1: Buruk, tidak menjalankan.", "2: Banyak kesalahan.", "3: Cukup baik.", "4: Baik dan sesuai SOP.", "5: Sangat baik, eksekutor utama." ] },
    { id: "P13", title: "P13 — Beban Kerja Real", description: "Seberapa berat tugas yang diambil.", scores: [ "1: Beban sangat kecil.", "2: Beban kecil.", "3: Beban sedang.", "4: Beban besar.", "5: Beban sangat besar / penanggung jawab utama." ] },
    { id: "P14", title: "P14 — Keahlian Teknis (Role-based)", description: "Kemampuan teknis sesuai jabatan (operator, scoring, MD, kamera, sosial media, dll).", scores: [ "1: Tidak menguasai.", "2: Sedikit menguasai.", "3: Cukup bisa.", "4: Ahli.", "5: Sangat ahli / level profesional." ] },
    { id: "P15", title: "P15 — Sikap & Etika Kerja", description: "Manner, etika, dan attitude secara keseluruhan.", scores: [ "1: Sikap buruk.", "2: Kurang baik.", "3: Sikap cukup.", "4: Etika baik.", "5: Sangat profesional & positif." ] },
    { id: "P16", title: "P16 — Peran Strategis / Dampak", description: "Berapa besar peran terhadap keberlangsungan event.", scores: [ "1: Dampak sangat kecil.", "2: Dampak kecil.", "3: Dampak sedang.", "4: Dampak signifikan.", "5: Dampak kritikal / event akan kacau tanpa orang ini." ] }
];

const generalScores = [
    { score: 1, meaning: "Sangat buruk / minim kontribusi" },
    { score: 2, meaning: "Kurang / di bawah harapan" },
    { score: 3, meaning: "Cukup / memenuhi standar" },
    { score: 4, meaning: "Baik / di atas standar" },
    { score: 5, meaning: "Sangat baik / luar biasa" },
]

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

  // --- LOGIKA PEMBAGIAN KEUNTUNGAN ---
  const SHARE = {
    inisiatorActive: 0.30,
    inisiatorPassive: 0.10,
    panitia: 0.50,
    komunitas: 0.05,
    nonPanitia: 0.05,
  };

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

  // --- MD3 STYLED COMPONENTS ---
  
  // Custom Slider (Thicker & Colored)
  const ScoreInput = ({ id, label }: { id: string, label: string }) => {
    const score = tempScores?.[id] || 0;
    // Dynamic color based on score
    const scoreColor = score <= 2 ? 'bg-red-500' : score === 3 ? 'bg-yellow-500' : 'bg-green-500';
    
    return (
        <div className="mb-6 p-4 bg-secondary/20 rounded-2xl border border-transparent hover:border-primary/20 transition-all">
            <div className="flex justify-between items-center mb-4">
                <Label className="text-sm font-bold text-foreground/80">{id} • {label}</Label>
                <div className={`w-8 h-8 rounded-full ${scoreColor} text-white flex items-center justify-center font-bold shadow-sm`}>
                    {score}
                </div>
            </div>
            <Slider 
                value={[score]} 
                max={5} 
                step={1} 
                onValueChange={(v) => handleScoreChange(id, v[0])}
                className="py-2"
            />
            <div className="flex justify-between mt-2 text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                <span>Buruk</span>
                <span>Sempurna</span>
            </div>
        </div>
    );
  };
  
  // MD3 Color System Simulation
  const colorVariants = {
    blue: {
      container: "bg-blue-100 text-blue-900 border-none",
      iconBg: "bg-blue-200 text-blue-800",
      label: "text-blue-700"
    },
    cyan: {
      container: "bg-cyan-100 text-cyan-900 border-none",
      iconBg: "bg-cyan-200 text-cyan-800",
      label: "text-cyan-700"
    },
    primary: { // Replaces green
      container: "bg-primary/10 text-primary-foreground border-none", // Pakai warna primary theme
      iconBg: "bg-primary/20 text-primary",
      label: "text-primary"
    },
    purple: {
      container: "bg-purple-100 text-purple-900 border-none",
      iconBg: "bg-purple-200 text-purple-800",
      label: "text-purple-700"
    },
    orange: {
      container: "bg-orange-100 text-orange-900 border-none",
      iconBg: "bg-orange-200 text-orange-800",
      label: "text-orange-700"
    }
  };

  const AllocationCard = ({ title, amount, color, description, icon: Icon }: { title:string, amount:number, color:keyof typeof colorVariants, description?:string, icon: any}) => {
    const variants = colorVariants[color];
    return (
      <Card className={cn("rounded-[24px] shadow-sm hover:shadow-md transition-all duration-300", variants.container)}>
          <CardContent className="p-6 flex flex-col justify-between h-full">
              <div className="flex justify-between items-start mb-4">
                  <div className={cn("p-3 rounded-2xl", variants.iconBg)}>
                      <Icon className="w-6 h-6" />
                  </div>
                  {/* Chip Style for percentage/desc */}
                  {description && (
                      <span className={cn("text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full bg-white/50", variants.label)}>
                          {description}
                      </span>
                  )}
              </div>
              <div>
                  <p className={cn("text-xs font-bold uppercase tracking-widest opacity-80 mb-1", variants.label)}>{title}</p>
                  <h3 className="text-2xl font-black tracking-tight">Rp {amount.toLocaleString('id-ID', {notation: "compact"})}</h3>
              </div>
          </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8 font-body">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-border/50">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="rounded-full px-4 py-1 border-primary text-primary font-bold">FINANCE MODULE</Badge>
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Updated: Today</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black font-headline text-foreground uppercase tracking-tighter">
                Profit <span className="text-primary">Sharing.</span>
            </h2>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl">
                Transparansi distribusi keuangan untuk seluruh stakeholder BCC 2026.
            </p>
        </div>
        
        {/* TOTAL PROFIT PILL */}
        <div className="bg-zinc-900 text-white pl-6 pr-8 py-4 rounded-full flex items-center gap-4 shadow-xl">
            <div className="p-2 bg-green-500 rounded-full animate-pulse">
                <TrendingUp className="w-5 h-5 text-black" />
            </div>
            <div>
                <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">Net Profit</p>
                <div className="font-black text-2xl">
                    Rp {totalProfit.toLocaleString('id-ID', { notation: "compact" })}
                </div>
            </div>
        </div>
      </div>

      {/* BENTO GRID ALLOCATION */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
         <div className="lg:col-span-2">
             <AllocationCard title="Inisiator Aktif" description="30% Share" amount={honorInisiatorActive} color="blue" icon={Target}/>
         </div>
         <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            <AllocationCard title="Pasif" description="10%" amount={honorInisiatorPassive} color="cyan" icon={Wallet}/>
            <AllocationCard title="Komunitas" description="5% Kas" amount={honorKomunitas} color="purple" icon={Users}/>
            <AllocationCard title="Kontributor" description="5%" amount={budgetNP} color="orange" icon={BookOpen}/>
         </div>
         {/* Main Card for Panitia */}
         <div className="lg:col-span-5">
            <Card className="rounded-[32px] bg-primary text-primary-foreground border-none shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                            <Trophy className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black uppercase tracking-tight">Panitia (50%)</h3>
                            <p className="text-primary-foreground/80 font-medium">Alokasi terbesar untuk eksekutor lapangan.</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold uppercase opacity-80 mb-1">Total Budget</p>
                        <div className="text-5xl font-black">Rp {budgetPanitia.toLocaleString('id-ID', {notation: "compact"})}</div>
                        <div className="mt-2 inline-block bg-black/20 px-4 py-1 rounded-full text-xs font-mono font-bold">
                            Rate: Rp {Math.round(nilaiPerPoinPanitia).toLocaleString()}/poin
                        </div>
                    </div>
                </CardContent>
            </Card>
         </div>
      </div>

      {/* TABS SECTION */}
      <Tabs defaultValue="panitia" className="w-full mt-8">
        <div className="flex justify-center mb-8">
            <TabsList className="bg-muted/50 p-1 rounded-full h-14 w-full max-w-md">
                <TabsTrigger value="panitia" className="rounded-full h-12 w-1/2 font-bold text-sm data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg transition-all">
                    PANITIA INTI
                </TabsTrigger>
                <TabsTrigger value="kontributor" className="rounded-full h-12 w-1/2 font-bold text-sm data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg transition-all">
                    KONTRIBUTOR
                </TabsTrigger>
            </TabsList>
        </div>
        
        {/* TAB PANITIA */}
        <TabsContent value="panitia">
            <Card className="rounded-[32px] border-none shadow-xl overflow-hidden bg-card/50 backdrop-blur-sm">
                <CardHeader className="bg-muted/30 p-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-2xl font-black uppercase">Evaluasi Kinerja</CardTitle>
                            <CardDescription>Klik tombol edit untuk menilai performa panitia.</CardDescription>
                        </div>
                        <Button variant="outline" className="rounded-full border-2 font-bold" onClick={() => (document.getElementById('guide-trigger') as HTMLElement)?.click()}>
                            <BookOpen className="w-4 h-4 mr-2"/> Panduan P1-P16
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 hover:bg-muted/50 border-none">
                                <TableHead className="pl-8 h-14 font-bold text-foreground">NAMA STAFF</TableHead>
                                <TableHead className="font-bold text-foreground">JABATAN</TableHead>
                                <TableHead className="text-center font-bold text-foreground">TOTAL POIN</TableHead>
                                <TableHead className="text-right pr-8 font-bold text-foreground">HONORARIUM</TableHead>
                                <TableHead className="w-[80px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {listPanitia.map((staff, idx) => (
                                <TableRow key={staff.id} className="hover:bg-muted/30 border-b border-border/50 transition-colors">
                                    <TableCell className="pl-8 py-4">
                                        <div className="font-bold text-base">{staff.name}</div>
                                        <div className="text-xs text-muted-foreground">ID: {staff.id}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="rounded-lg px-3 py-1 font-bold text-xs uppercase tracking-wider">
                                            {staff.jabatan}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="inline-block bg-primary/10 text-primary font-black text-xl px-4 py-2 rounded-xl min-w-[60px]">
                                            {staff.rawScore}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-8">
                                        <div className="font-mono font-bold text-lg text-green-600">
                                            Rp {Math.round(staff.rawScore * nilaiPerPoinPanitia).toLocaleString('id-ID')}
                                        </div>
                                    </TableCell>
                                    <TableCell className="pr-4">
                                        <Button size="icon" className="rounded-full w-10 h-10 bg-zinc-100 hover:bg-zinc-200 text-black shadow-sm" onClick={() => openEvaluation(staff)}>
                                            <Edit3 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>

        {/* TAB KONTRIBUTOR */}
        <TabsContent value="kontributor">
             <Card className="rounded-[32px] border-none shadow-xl overflow-hidden bg-card/50 backdrop-blur-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 hover:bg-muted/50 border-none">
                                <TableHead className="pl-8 h-14 font-bold text-foreground">NAMA</TableHead>
                                <TableHead className="font-bold text-foreground">PERAN</TableHead>
                                <TableHead className="text-center font-bold text-foreground">TOTAL POIN</TableHead>
                                <TableHead className="text-right pr-8 font-bold text-foreground">HONOR</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {listNonPanitia.map((staff) => (
                                <TableRow key={staff.id} className="hover:bg-muted/30 border-b border-border/50">
                                    <TableCell className="pl-8 py-4 font-bold">{staff.name}</TableCell>
                                    <TableCell><Badge variant="outline" className="rounded-lg">{staff.jabatan}</Badge></TableCell>
                                    <TableCell className="text-center font-black text-xl text-orange-500">{staff.rawScore}</TableCell>
                                    <TableCell className="text-right pr-8 font-mono font-bold text-lg">
                                        Rp {Math.round(staff.rawScore * nilaiPerPoinNP).toLocaleString('id-ID')}
                                    </TableCell>
                                    <TableCell>
                                        <Button size="icon" className="rounded-full w-10 h-10 bg-zinc-100 hover:bg-zinc-200 text-black" onClick={() => openEvaluation(staff)}>
                                            <Edit3 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
      
      {/* HIDDEN TRIGGER FOR GUIDE */}
      <Dialog>
        <DialogTrigger asChild>
            <span id="guide-trigger" className="hidden"></span>
        </DialogTrigger>
        <DialogContent className="max-w-4xl h-[85vh] flex flex-col bg-background rounded-[32px] border-none shadow-2xl p-0 overflow-hidden">
            <div className="p-8 border-b bg-muted/30">
                <DialogTitle className="text-3xl font-black uppercase tracking-tighter text-primary">Panduan Penilaian</DialogTitle>
                <DialogDescription className="text-lg">Parameter P1-P16 untuk objektivitas honorarium.</DialogDescription>
            </div>
            <ScrollArea className="flex-grow p-8">
                <div className="grid grid-cols-1 gap-8">
                    <div className="space-y-4">
                        <Accordion type="single" collapsible className="w-full space-y-2">
                            {parameterDetails.map((param) => (
                                <AccordionItem value={param.id} key={param.id} className="border-none bg-secondary/10 rounded-2xl px-4">
                                    <AccordionTrigger className="font-bold text-left hover:no-underline py-4 text-base">{param.title}</AccordionTrigger>
                                    <AccordionContent className="pb-4">
                                        <p className="text-muted-foreground italic mb-4 text-sm">{param.description}</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {param.scores.map((score, i) => (
                                                <div key={i} className="flex gap-3 items-center bg-background p-2 rounded-lg border text-sm">
                                                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                                                        {score.charAt(0)}
                                                    </div>
                                                    <span className="text-foreground/80">{score.slice(3)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </ScrollArea>
        </DialogContent>
      </Dialog>


      {/* MODAL PENILAIAN (MD3 STYLE) */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col bg-background rounded-[32px] border-none p-0 shadow-2xl">
            <div className="p-6 border-b bg-muted/30 shrink-0">
                <DialogTitle className="text-2xl font-black uppercase flex items-center gap-2">
                    <Edit3 className="w-6 h-6 text-primary" /> Evaluasi Kinerja
                </DialogTitle>
                <DialogDescription className="text-base font-medium text-foreground/60">
                    Menilai: <span className="text-primary font-bold">{selectedStaff?.name}</span> ({selectedStaff?.jabatan})
                </DialogDescription>
            </div>
            
            <ScrollArea className="flex-grow p-6 md:p-8">
                {selectedStaff?.type === 'PANITIA' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                      <ScoreInput id="p1" label="Kehadiran & Disiplin" />
                      <ScoreInput id="p2" label="Komitmen Tugas" />
                      <ScoreInput id="p3" label="Kualitas Output" />
                      <ScoreInput id="p4" label="Inisiatif & Proaktif" />
                      <ScoreInput id="p5" label="Problem Solving" />
                      <ScoreInput id="p6" label="Kerja Sama Tim" />
                      <ScoreInput id="p7" label="Komunikasi" />
                      <ScoreInput id="p8" label="Manajemen Waktu" />
                      <ScoreInput id="p9" label="Tanggung Jawab" />
                      <ScoreInput id="p10" label="Adaptasi" />
                      <ScoreInput id="p11" label="Kontribusi Ide" />
                      <ScoreInput id="p12" label="Eksekusi Lapangan" />
                      <ScoreInput id="p13" label="Beban Kerja Real" />
                      <ScoreInput id="p14" label="Keahlian Teknis" />
                      <ScoreInput id="p15" label="Sikap & Etika" />
                      <ScoreInput id="p16" label="Peran Strategis" />
                    </div>
                ) : (
                    <div className="p-6 rounded-3xl bg-orange-50 dark:bg-orange-950/20 border-2 border-orange-200 dark:border-orange-900">
                        <h4 className="font-black text-orange-700 dark:text-orange-400 mb-6 text-lg uppercase tracking-widest">PARAMETER KONTRIBUTOR</h4>
                        <ScoreInput id="np1" label="Kontribusi Strategis" />
                        <ScoreInput id="np2" label="Dampak Jaringan" />
                        <ScoreInput id="np3" label="Komitmen Waktu" />
                        <ScoreInput id="np4" label="Efektivitas Saran" />
                    </div>
                )}
            </ScrollArea>

            <div className="p-6 border-t bg-muted/30 shrink-0 flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-full px-6 font-bold h-12 hover:bg-zinc-200">
                    BATAL
                </Button>
                <Button onClick={handleSave} className="rounded-full px-8 font-bold h-12 bg-primary hover:bg-primary/90 text-lg shadow-lg shadow-primary/20">
                    <Save className="w-5 h-5 mr-2" /> SIMPAN SKOR
                </Button>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

