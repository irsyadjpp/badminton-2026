'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calculator, Save, Edit3, Coins, TrendingUp } from "lucide-react";
import { getStaffEvaluations, saveEvaluation, type StaffEvaluation, type EvaluationParams } from "./actions";
import { useToast } from "@/hooks/use-toast";

export default function HonorariumPage() {
  const { toast } = useToast();
  const [budget, setBudget] = useState(30000000); // Default 30 Juta
  const [staffList, setStaffList] = useState<StaffEvaluation[]>([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffEvaluation | null>(null);
  const [tempScores, setTempScores] = useState<EvaluationParams | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getStaffEvaluations();
    setStaffList(data);
  };

  // --- KALKULASI HONOR OTOMATIS (LOGIC E) ---
  const totalPointsAllStaff = staffList.reduce((acc, curr) => acc + curr.rawScore, 0);
  const valuePerPoint = totalPointsAllStaff > 0 ? budget / totalPointsAllStaff : 0;

  const calculatedList = staffList.map(staff => ({
      ...staff,
      honorReceived: Math.round(staff.rawScore * valuePerPoint)
  }));
  // -------------------------------------------

  const openEvaluation = (staff: StaffEvaluation) => {
      setSelectedStaff(staff);
      setTempScores({ ...staff.scores });
      setIsModalOpen(true);
  };

  const handleScoreChange = (key: keyof EvaluationParams, val: number) => {
      if (tempScores) {
          setTempScores({ ...tempScores, [key]: val });
      }
  };

  const handleSave = async () => {
      if (selectedStaff && tempScores) {
          await saveEvaluation(selectedStaff.id, tempScores);
          toast({ title: "Penilaian Disimpan", description: `Skor ${selectedStaff.name} diperbarui.` });
          setIsModalOpen(false);
          loadData(); // Refresh table
      }
  };

  // Helper UI untuk Slider Input
  const ScoreInput = ({ id, label, max }: { id: keyof EvaluationParams, label: string, max: number }) => (
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
            <h2 className="text-3xl font-bold font-headline text-primary">Skema Honorarium</h2>
            <p className="text-muted-foreground">Evaluasi kinerja & kalkulasi honor otomatis (Sistem Poin).</p>
        </div>
        
        {/* BUDGET INPUT */}
        <Card className="w-full md:w-auto bg-secondary/30 border-primary/20">
            <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-green-100 text-green-700 rounded-full"><Coins className="w-6 h-6" /></div>
                <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold">Total Anggaran Honor</p>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">Rp</span>
                        <Input 
                            type="number" 
                            value={budget} 
                            onChange={(e) => setBudget(Number(e.target.value))} 
                            className="h-8 w-36 font-mono font-bold bg-white"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>

      {/* STATISTIK GLOBAL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Poin Panitia</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{totalPointsAllStaff} Poin</div></CardContent>
         </Card>
         <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Nilai Per Poin</CardTitle></CardHeader>
            <CardContent className="flex items-center gap-2">
                <div className="text-2xl font-bold text-green-600">Rp {Math.round(valuePerPoint).toLocaleString('id-ID')}</div>
                <TrendingUp className="w-4 h-4 text-green-500" />
            </CardContent>
         </Card>
         <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Rata-rata Kinerja</CardTitle></CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {staffList.length > 0 
                        ? (staffList.reduce((a,b) => a + b.weightedScore, 0) / staffList.length).toFixed(1) 
                        : 0}%
                </div>
            </CardContent>
         </Card>
      </div>

      {/* TABEL EVALUASI */}
      <Card>
        <CardHeader><CardTitle>Daftar Evaluasi Panitia</CardTitle></CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Jabatan</TableHead>
                        <TableHead className="text-center">Skor Mentah (Max 80)</TableHead>
                        <TableHead className="text-center">Skor Terbobot</TableHead>
                        <TableHead className="text-center">Grade</TableHead>
                        <TableHead className="text-right">Honor Diterima</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {calculatedList.map((staff) => (
                        <TableRow key={staff.id}>
                            <TableCell className="font-medium">{staff.name}</TableCell>
                            <TableCell><Badge variant="outline">{staff.role}</Badge></TableCell>
                            <TableCell className="text-center font-mono text-lg">{staff.rawScore}</TableCell>
                            <TableCell className="text-center">
                                <div className="flex items-center justify-center gap-2">
                                    <span className="font-bold">{staff.weightedScore}%</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                <Badge className={
                                    staff.grade === 'A' ? 'bg-green-600' : 
                                    staff.grade === 'B' ? 'bg-blue-600' : 
                                    staff.grade === 'C' ? 'bg-yellow-500 text-black' : 'bg-gray-500'
                                }>{staff.grade}</Badge>
                            </TableCell>
                            <TableCell className="text-right font-bold text-green-700">
                                Rp {staff.honorReceived.toLocaleString('id-ID')}
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

      {/* MODAL PENILAIAN */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Evaluasi Kinerja: {selectedStaff?.name}</DialogTitle>
                <DialogDescription>Isi nilai 1-5 untuk setiap parameter.</DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                
                {/* GROUP 1: STRUKTUR (25%) */}
                <div className="border p-4 rounded-lg bg-slate-50">
                    <h4 className="font-bold text-primary mb-4 flex justify-between">1. STRUKTUR <span className="text-xs bg-primary text-white px-2 py-0.5 rounded">25%</span></h4>
                    <ScoreInput id="p1" label="Risiko Jabatan" max={5} />
                    <ScoreInput id="p2" label="Keahlian Khusus" max={5} />
                    <ScoreInput id="p3" label="Durasi Kontrak" max={5} />
                    <ScoreInput id="p4" label="Posisi Hirarki" max={5} />
                </div>

                {/* GROUP 2: KINERJA (35%) */}
                <div className="border p-4 rounded-lg bg-slate-50">
                    <h4 className="font-bold text-primary mb-4 flex justify-between">2. KINERJA <span className="text-xs bg-primary text-white px-2 py-0.5 rounded">35%</span></h4>
                    <ScoreInput id="p5" label="Eksekusi" max={5} />
                    <ScoreInput id="p6" label="Inisiatif" max={5} />
                    <ScoreInput id="p7" label="Kehadiran" max={5} />
                    <ScoreInput id="p8" label="Respon" max={5} />
                    <ScoreInput id="p9" label="Beban Fisik" max={5} />
                </div>

                {/* GROUP 3: DAMPAK (25%) */}
                <div className="border p-4 rounded-lg bg-slate-50">
                    <h4 className="font-bold text-primary mb-4 flex justify-between">3. DAMPAK <span className="text-xs bg-primary text-white px-2 py-0.5 rounded">25%</span></h4>
                    <ScoreInput id="p10" label="Kompleksitas Masalah" max={5} />
                    <ScoreInput id="p11" label="Interdependency" max={5} />
                    <ScoreInput id="p12" label="Criticality of Role" max={5} />
                </div>

                {/* GROUP 4: PROFESIONALISME (15%) */}
                <div className="border p-4 rounded-lg bg-slate-50">
                    <h4 className="font-bold text-primary mb-4 flex justify-between">4. PROFESIONAL <span className="text-xs bg-primary text-white px-2 py-0.5 rounded">15%</span></h4>
                    <ScoreInput id="p13" label="Dokumentasi" max={5} />
                    <ScoreInput id="p14" label="Komunikasi & Etika" max={5} />
                    <ScoreInput id="p15" label="Kerja Sama Tim" max={5} />
                    <ScoreInput id="p16" label="Manajemen Stress" max={5} />
                </div>
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
