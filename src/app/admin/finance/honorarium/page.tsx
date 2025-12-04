
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
import { Edit3, Coins, Save, BookOpen } from "lucide-react";
import { getStaffEvaluations, saveEvaluation, type StaffEvaluation } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [totalProfit, setTotalProfit] = useState(100000000); // Default 100 Juta
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

  // --- LOGIKA PEMBAGIAN KEUNTUNGAN (REVISI) ---
  const SHARE = {
    inisiator: 0.40,
    pemilikWadah: 0.10,
    panitia: 0.45,
    nonPanitia: 0.05,
  };

  // 1. Pisahkan Data
  const listPanitia = staffList.filter(s => s.type === 'PANITIA');
  const listNonPanitia = staffList.filter(s => s.type === 'NON_PANITIA');

  // 2. Hitung Total Poin
  const totalPoinPanitia = listPanitia.reduce((acc, curr) => acc + curr.rawScore, 0);
  const totalPoinNP = listNonPanitia.reduce((acc, curr) => acc + curr.rawScore, 0);

  // 3. Hitung Nilai Per Poin
  const nilaiPerPoinPanitia = totalPoinPanitia > 0 
    ? (totalProfit * SHARE.panitia) / totalPoinPanitia 
    : 0;
    
  const nilaiPerPoinNP = totalPoinNP > 0
    ? (totalProfit * SHARE.nonPanitia) / totalPoinNP
    : 0;

  // 4. Alokasi Global
  const honorInisiator = totalProfit * SHARE.inisiator;
  const honorPemilikWadah = totalProfit * SHARE.pemilikWadah;
  const budgetPanitia = totalProfit * SHARE.panitia;
  const budgetNP = totalProfit * SHARE.nonPanitia;

  // --- HANDLERS ---

  const openEvaluation = (staff: StaffEvaluation) => {
      setSelectedStaff(staff);
      setTempScores({ ...staff.scores });
      setIsModalOpen(true);
  };

  const handleScoreChange = (key: string, val: number) => {
      if (tempScores) {
          setTempScores({ ...tempScores, [key]: val });
      }
  };

  const handleSave = async () => {
      if (selectedStaff && tempScores) {
          await saveEvaluation(selectedStaff.id, tempScores);
          toast({ title: "Penilaian Disimpan", description: `Skor ${selectedStaff.name} diperbarui.` });
          setIsModalOpen(false);
          loadData(); // Refresh
      }
  };

  // --- HELPER COMPONENT ---
  const ScoreInput = ({ id, label }: { id: string, label: string }) => (
    <div className="mb-4">
        <div className="flex justify-between mb-1">
            <Label className="text-xs font-medium text-muted-foreground">{id.toUpperCase()} - {label}</Label>
            <span className="text-xs font-bold">{tempScores?.[id] || 0} / 5</span>
        </div>
        <Slider 
            value={[tempScores?.[id] || 0]} 
            max={5} 
            step={1} 
            onValueChange={(v) => handleScoreChange(id, v[0])}
            className="py-1"
        />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-3xl font-bold font-headline text-primary">Skema Profit Sharing</h2>
            <p className="text-muted-foreground">Distribusi keuntungan untuk Inisiator, Pemilik Wadah, Panitia & Kontributor.</p>
        </div>
        
        {/* TOTAL PROFIT LABEL */}
        <Card className="w-full md:w-auto bg-secondary/30 border-primary/20">
            <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-green-100 text-green-700 rounded-full"><Coins className="w-6 h-6" /></div>
                <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold">Total Keuntungan (Net)</p>
                    <div className="font-bold text-xl text-foreground">
                        Rp {totalProfit.toLocaleString('id-ID')}
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>

      {/* RINGKASAN ALOKASI (PIE CHART SIMULATION) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-2"><CardTitle className="text-xs uppercase text-blue-700 font-bold">Inisiator (40%)</CardTitle></CardHeader>
            <CardContent><div className="text-xl font-bold text-blue-900">Rp {honorInisiator.toLocaleString('id-ID')}</div></CardContent>
         </Card>
         <Card className="bg-purple-50 border-purple-200">
            <CardHeader className="pb-2"><CardTitle className="text-xs uppercase text-purple-700 font-bold">Pemilik Wadah (10%)</CardTitle></CardHeader>
            <CardContent><div className="text-xl font-bold text-purple-900">Rp {honorPemilikWadah.toLocaleString('id-ID')}</div></CardContent>
         </Card>
         <Card className="bg-green-50 border-green-200">
            <CardHeader className="pb-2"><CardTitle className="text-xs uppercase text-green-700 font-bold">Panitia (45%)</CardTitle></CardHeader>
            <CardContent>
                <div className="text-xl font-bold text-green-900">Rp {budgetPanitia.toLocaleString('id-ID')}</div>
                <div className="text-xs text-green-700 mt-1">Rate: Rp {Math.round(nilaiPerPoinPanitia).toLocaleString()}/poin</div>
            </CardContent>
         </Card>
         <Card className="bg-orange-50 border-orange-200">
            <CardHeader className="pb-2"><CardTitle className="text-xs uppercase text-orange-700 font-bold">Kontributor (5%)</CardTitle></CardHeader>
            <CardContent>
                <div className="text-xl font-bold text-orange-900">Rp {budgetNP.toLocaleString('id-ID')}</div>
                <div className="text-xs text-orange-700 mt-1">Rate: Rp {Math.round(nilaiPerPoinNP).toLocaleString()}/poin</div>
            </CardContent>
         </Card>
      </div>

      {/* TABS UNTUK PANITIA & KONTRIBUTOR */}
      <Tabs defaultValue="panitia" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="panitia">Panitia (P1-P16)</TabsTrigger>
            <TabsTrigger value="kontributor">Kontributor (NP1-NP4)</TabsTrigger>
        </TabsList>
        
        {/* TAB PANITIA */}
        <TabsContent value="panitia">
            <Card>
                <CardHeader>
                    <CardTitle>Distribusi Honor Panitia</CardTitle>
                    <CardDescription>Total Poin Terkumpul: {totalPoinPanitia} | Estimasi Rate: Rp {Math.round(nilaiPerPoinPanitia).toLocaleString()}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama</TableHead>
                                <TableHead>Jabatan</TableHead>
                                <TableHead className="text-center">Total Poin (P1-P16)</TableHead>
                                <TableHead className="text-right">Honor Diterima</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {listPanitia.map((staff) => (
                                <TableRow key={staff.id}>
                                    <TableCell className="font-medium">{staff.name}</TableCell>
                                    <TableCell><Badge variant="outline">{staff.jabatan}</Badge></TableCell>
                                    <TableCell className="text-center font-mono text-lg font-bold">{staff.rawScore}</TableCell>
                                    <TableCell className="text-right font-bold text-green-700">
                                        Rp {Math.round(staff.rawScore * nilaiPerPoinPanitia).toLocaleString('id-ID')}
                                    </TableCell>
                                    <TableCell>
                                        <Button size="icon" variant="ghost" onClick={() => openEvaluation(staff)}>
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
             <Card>
                <CardHeader>
                    <CardTitle>Distribusi Honor Kontributor</CardTitle>
                    <CardDescription>Total Poin Terkumpul: {totalPoinNP} | Estimasi Rate: Rp {Math.round(nilaiPerPoinNP).toLocaleString()}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama</TableHead>
                                <TableHead>Peran</TableHead>
                                <TableHead className="text-center">Total Poin (NP1-NP4)</TableHead>
                                <TableHead className="text-right">Honor Diterima</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {listNonPanitia.map((staff) => (
                                <TableRow key={staff.id}>
                                    <TableCell className="font-medium">{staff.name}</TableCell>
                                    <TableCell><Badge variant="secondary">{staff.jabatan}</Badge></TableCell>
                                    <TableCell className="text-center font-mono text-lg font-bold">{staff.rawScore}</TableCell>
                                    <TableCell className="text-right font-bold text-orange-700">
                                        Rp {Math.round(staff.rawScore * nilaiPerPoinNP).toLocaleString('id-ID')}
                                    </TableCell>
                                    <TableCell>
                                        <Button size="icon" variant="ghost" onClick={() => openEvaluation(staff)}>
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
      
      {/* PANDUAN PENILAIAN */}
      <div className="text-center">
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <BookOpen className="w-4 h-4 text-primary" /> Lihat Panduan Penilaian
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Panduan Parameter Penilaian (P1-P16)</DialogTitle>
                    <DialogDescription>Gunakan pedoman ini untuk memberikan penilaian yang objektif.</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 overflow-y-auto">
                    <div>
                        <Accordion type="single" collapsible className="w-full">
                            {parameterDetails.map((param) => (
                                <AccordionItem value={param.id} key={param.id}>
                                    <AccordionTrigger className="font-bold text-left hover:no-underline">{param.title}</AccordionTrigger>
                                    <AccordionContent className="space-y-2">
                                        <p className="text-muted-foreground italic mb-3">{param.description}</p>
                                        <ul className="space-y-1 text-sm">
                                            {param.scores.map((score, i) => (
                                                <li key={i} className="flex gap-2">
                                                    <span className="font-semibold">{score.charAt(0)}:</span> 
                                                    <span className="text-muted-foreground">{score.slice(2)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                    <div>
                        <div className="sticky top-0 bg-background/95 backdrop-blur-sm p-1 rounded-lg">
                            <h4 className="font-bold mb-2">Makna Umum Skor 1-5</h4>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Skor</TableHead>
                                        <TableHead>Makna Ringkas</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {generalScores.map(s => (
                                        <TableRow key={s.score}>
                                            <TableCell className="font-bold text-lg">{s.score}</TableCell>
                                            <TableCell>{s.meaning}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
      </div>


      {/* MODAL PENILAIAN DINAMIS */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Evaluasi: {selectedStaff?.name}</DialogTitle>
                <DialogDescription>Isi nilai 1-5 untuk setiap parameter.</DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
                {selectedStaff?.type === 'PANITIA' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Parameter Panitia P1-P16 */}
                        <div className="border p-4 rounded-lg bg-slate-50">
                            <h4 className="font-bold text-primary mb-4">1. STRUKTUR</h4>
                            <ScoreInput id="p1" label="Risiko Jabatan" />
                            <ScoreInput id="p2" label="Keahlian Khusus" />
                            <ScoreInput id="p3" label="Durasi Kontrak" />
                            <ScoreInput id="p4" label="Posisi Hirarki" />
                        </div>
                        <div className="border p-4 rounded-lg bg-slate-50">
                            <h4 className="font-bold text-primary mb-4">2. KINERJA</h4>
                            <ScoreInput id="p5" label="Eksekusi" />
                            <ScoreInput id="p6" label="Inisiatif" />
                            <ScoreInput id="p7" label="Kehadiran" />
                            <ScoreInput id="p8" label="Respon" />
                            <ScoreInput id="p9" label="Beban Fisik" />
                        </div>
                        <div className="border p-4 rounded-lg bg-slate-50">
                            <h4 className="font-bold text-primary mb-4">3. DAMPAK</h4>
                            <ScoreInput id="p10" label="Kompleksitas" />
                            <ScoreInput id="p11" label="Interdependency" />
                            <ScoreInput id="p12" label="Criticality" />
                        </div>
                        <div className="border p-4 rounded-lg bg-slate-50">
                            <h4 className="font-bold text-primary mb-4">4. PROFESIONAL</h4>
                            <ScoreInput id="p13" label="Dokumentasi" />
                            <ScoreInput id="p14" label="Komunikasi" />
                            <ScoreInput id="p15" label="Kerjasama" />
                            <ScoreInput id="p16" label="Stress Mgmt" />
                        </div>
                    </div>
                ) : (
                    <div className="border p-4 rounded-lg bg-orange-50">
                        {/* Parameter Non-Panitia NP1-NP4 */}
                        <h4 className="font-bold text-orange-700 mb-4">PARAMETER KONTRIBUTOR (NP)</h4>
                        <ScoreInput id="np1" label="Kontribusi Strategis" />
                        <ScoreInput id="np2" label="Dampak Jaringan" />
                        <ScoreInput id="np3" label="Komitmen Waktu" />
                        <ScoreInput id="np4" label="Efektivitas Saran" />
                    </div>
                )}
            </div>

            <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
                <Button onClick={handleSave} className="bg-primary"><Save className="w-4 h-4 mr-2" /> Simpan Penilaian</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
