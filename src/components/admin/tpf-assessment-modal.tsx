'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Save, BookOpen, AlertCircle } from "lucide-react";
import { RUBRIC_GUIDELINES } from '@/lib/tpf-data';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";

// INDIKATOR UTAMA (Skor 1-5)
const TECHNICAL_RUBRICS = [
    { id: 'biomechanics', label: '1. BIOMEKANIK (Grip & Wrist)', desc: 'Efisiensi tenaga & cara pegang' },
    { id: 'footwork', label: '2. FOOTWORK (Gerak Kaki)', desc: 'Kelincahan & Split Step' },
    { id: 'backhand', label: '3. BACKHAND OVERHEAD', desc: 'Pukulan kiri belakang' },
    { id: 'attack', label: '4. ATTACK (Smash Power)', desc: 'Kekuatan & Sudut' },
    { id: 'defense', label: '5. DEFENSE (Pertahanan)', desc: 'Refleks & Balik Serang' },
    { id: 'gameiq', label: '6. GAME IQ (Taktik)', desc: 'Rotasi & Penguasaan' },
    { id: 'physique', label: '7. PHYSIQUE', desc: 'Fisik & Mental' },
];

// SKILL MODIFIER (Bonus)
const SKILL_BONUSES = [
    { id: 'baseline_clear', label: 'Baseline Backhand Clear', points: 3 },
    { id: 'split_step', label: 'Refleks Split Step', points: 4 },
    { id: 'spinning_net', label: 'Spinning Net', points: 3 },
    { id: 'deception', label: 'Deception / Hold', points: 4 },
    { id: 'cross_defense', label: 'Cross Court Defense', points: 3 },
];

export function TpfAssessmentModal({ isOpen, onClose, player }: any) {
    // State untuk Skor
    const [scores, setScores] = useState<Record<string, number>>({});
    const [bonuses, setBonuses] = useState<Record<string, boolean>>({});
    const [logCheck, setLogCheck] = useState({ early: false, mid: false, late: false });
    
    // State Baru: Status Video
    const [videoStatus, setVideoStatus] = useState<"VALID" | "INVALID" | null>(null);
    
    // Kalkulasi Real-time
    const totalScoreA = Object.values(scores).reduce((a, b) => a + b, 0);
    const totalBonusB = SKILL_BONUSES.reduce((acc, item) => acc + (bonuses[item.id] ? item.points : 0), 0);
    const finalScore = totalScoreA + totalBonusB;

    // Logic Penentuan Level (Otomatis REJECT jika video invalid)
    let calculatedLevel = "BEGINNER";
    let levelColor = "text-green-600";
    let seedingPoints = 0;

    if (videoStatus === "INVALID") {
        calculatedLevel = "REJECTED (VIDEO)";
        levelColor = "text-destructive";
        seedingPoints = 0;
    } else {
        if (finalScore >= 16) { calculatedLevel = "INTERMEDIATE"; levelColor = "text-blue-600"; }
        if (finalScore >= 30) { calculatedLevel = "ADVANCE"; levelColor = "text-red-600"; }

        // Logic Seeding Points
        if (calculatedLevel === "BEGINNER") {
            if (finalScore <= 9) seedingPoints = 10;
            else if (finalScore <= 12) seedingPoints = 20;
            else seedingPoints = 30;
        } else if (calculatedLevel === "INTERMEDIATE") {
            if (finalScore <= 20) seedingPoints = 40;
            else if (finalScore <= 25) seedingPoints = 50;
            else seedingPoints = 60;
        } else if (calculatedLevel === "ADVANCE") {
            if (finalScore <= 37) seedingPoints = 70;
            else if (finalScore <= 45) seedingPoints = 80;
            else seedingPoints = 100;
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-7xl h-[90vh] flex flex-col p-0 overflow-hidden">
                <div className="flex h-full">
                    
                    {/* KOLOM KIRI: VIDEO PLAYER */}
                    <div className="w-1/2 bg-black flex flex-col">
                        <div className="flex-1 relative">
                            <iframe 
                                src={player?.videoUrl} 
                                className="absolute inset-0 w-full h-full" 
                                title="Player Video"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            />
                        </div>
                        {/* Log Sampling Control */}
                        <div className="p-4 bg-zinc-900 text-white border-t border-zinc-800">
                            <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-zinc-400">Log Sampling (Wajib Tonton)</h4>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
                                    <Checkbox 
                                        checked={logCheck.early} 
                                        onCheckedChange={(c) => setLogCheck(prev => ({...prev, early: !!c}))} 
                                        className="border-white/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                    />
                                    1. Early (0-5)
                                </label>
                                <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
                                    <Checkbox 
                                        checked={logCheck.mid} 
                                        onCheckedChange={(c) => setLogCheck(prev => ({...prev, mid: !!c}))}
                                        className="border-white/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                    />
                                    2. Mid (Interval)
                                </label>
                                <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
                                    <Checkbox 
                                        checked={logCheck.late} 
                                        onCheckedChange={(c) => setLogCheck(prev => ({...prev, late: !!c}))}
                                        className="border-white/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                    />
                                    3. Late (18++)
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* KOLOM KANAN: FORM PENILAIAN */}
                    <div className="w-1/2 flex flex-col bg-background">
                        <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between">
                            <div>
                                <DialogTitle>Audit Teknis: {player?.name}</DialogTitle>
                                <DialogDescription>Klaim Awal: <span className="font-bold text-foreground">{player?.claim}</span></DialogDescription>
                            </div>
                            
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <BookOpen className="w-4 h-4" />
                                        Panduan Rubrik
                                    </Button>
                                </SheetTrigger>
                                <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                                    <SheetHeader className="mb-6">
                                        <SheetTitle>Panduan Skoring Teknis</SheetTitle>
                                        <SheetDescription>
                                            Gunakan panduan ini untuk menentukan skor 1-5 secara objektif.
                                        </SheetDescription>
                                    </SheetHeader>
                                    <div className="space-y-8">
                                        {RUBRIC_GUIDELINES.map((rubric) => (
                                            <div key={rubric.id} className="space-y-3">
                                                <h4 className="font-bold text-primary border-b pb-1">{rubric.title}</h4>
                                                <ul className="space-y-3">
                                                    {rubric.scores.map((s) => (
                                                        <li key={s.score} className="text-sm grid grid-cols-[20px_1fr] gap-2">
                                                            <span className={`font-bold ${s.score <= 2 ? 'text-red-500' : s.score === 3 ? 'text-yellow-600' : 'text-green-600'}`}>
                                                                {s.score}
                                                            </span>
                                                            <span className="text-muted-foreground">{s.desc}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </DialogHeader>

                        <ScrollArea className="flex-1 px-6 py-4">
                            <div className="space-y-8 pb-10">
                                
                                {/* --- BAGIAN BARU: STATUS VIDEO --- */}
                                <div className="p-4 border-2 border-dashed rounded-lg bg-secondary/10">
                                    <Label className="text-base font-bold mb-3 block">Status Video (Wajib Diisi)</Label>
                                    <RadioGroup 
                                        onValueChange={(val) => setVideoStatus(val as "VALID" | "INVALID")}
                                        className="flex flex-col sm:flex-row gap-4"
                                    >
                                        <div className={`flex items-center space-x-2 border p-3 rounded-md w-full cursor-pointer transition-colors ${videoStatus === 'VALID' ? 'bg-green-50 border-green-500' : 'hover:bg-secondary'}`}>
                                            <RadioGroupItem value="VALID" id="status-valid" />
                                            <Label htmlFor="status-valid" className="cursor-pointer font-medium">Valid (Uncut)</Label>
                                        </div>
                                        <div className={`flex items-center space-x-2 border p-3 rounded-md w-full cursor-pointer transition-colors ${videoStatus === 'INVALID' ? 'bg-red-50 border-red-500' : 'hover:bg-secondary'}`}>
                                            <RadioGroupItem value="INVALID" id="status-invalid" />
                                            <Label htmlFor="status-invalid" className="cursor-pointer font-medium text-destructive">Invalid (Rusak/Edit/Angle Buruk)</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                {/* --------------------------------- */}

                                {/* FORM HANYA AKTIF JIKA VIDEO VALID */}
                                <div className={videoStatus === 'INVALID' ? 'opacity-50 pointer-events-none grayscale' : ''}>
                                    
                                    {/* A. AUDIT TEKNIS */}
                                    <div className="space-y-6">
                                        <h3 className="font-bold text-lg flex items-center gap-2 border-b pb-2">
                                            A. Indikator Utama (Skor 1-5)
                                        </h3>
                                        {TECHNICAL_RUBRICS.map((item) => (
                                            <div key={item.id} className="space-y-3 p-4 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors">
                                                <div className="flex justify-between items-center">
                                                    <Label className="text-base font-semibold">{item.label}</Label>
                                                    <span className="text-xs text-muted-foreground">{item.desc}</span>
                                                </div>
                                                <RadioGroup 
                                                    onValueChange={(val) => setScores(prev => ({...prev, [item.id]: parseInt(val)}))}
                                                    className="flex justify-between"
                                                >
                                                    {[1, 2, 3, 4, 5].map((val) => (
                                                        <div key={val} className="flex flex-col items-center gap-1">
                                                            <RadioGroupItem value={val.toString()} id={`${item.id}-${val}`} />
                                                            <Label htmlFor={`${item.id}-${val}`} className="text-xs font-normal text-muted-foreground">{val}</Label>
                                                        </div>
                                                    ))}
                                                </RadioGroup>
                                            </div>
                                        ))}
                                    </div>

                                    {/* B. SKILL MODIFIER */}
                                    <div className="space-y-4 mt-8">
                                        <h3 className="font-bold text-lg flex items-center gap-2 border-b pb-2">
                                            B. Bonus Skill (Modifier)
                                        </h3>
                                        <div className="grid grid-cols-1 gap-3">
                                            {SKILL_BONUSES.map((bonus) => (
                                                <div key={bonus.id} className="flex items-center space-x-3 p-3 border rounded-md">
                                                    <Checkbox 
                                                        id={bonus.id} 
                                                        onCheckedChange={(c) => setBonuses(prev => ({...prev, [bonus.id]: !!c}))}
                                                    />
                                                    <div className="flex-1">
                                                        <Label htmlFor={bonus.id} className="font-medium">{bonus.label}</Label>
                                                    </div>
                                                    <Badge variant="secondary">+{bonus.points}</Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* CATATAN */}
                                <div className="space-y-2">
                                    <Label>Catatan Verifikator</Label>
                                    <Textarea 
                                        placeholder={videoStatus === 'INVALID' ? "Jelaskan kenapa video tidak valid (misal: terpotong, resolusi rendah, dll)..." : "Contoh: Pemain memiliki Stamina & Mental nilai 5..."} 
                                        className={videoStatus === 'INVALID' ? 'border-destructive focus-visible:ring-destructive' : ''}
                                    />
                                </div>
                            </div>
                        </ScrollArea>

                        {/* FOOTER: HASIL KALKULASI */}
                        <div className="p-6 bg-secondary/30 border-t space-y-4">
                            {videoStatus !== 'INVALID' && (
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>Subtotal Skor (A): <span className="font-bold">{totalScoreA}</span> / 35</div>
                                    <div>Subtotal Bonus (B): <span className="font-bold">{totalBonusB}</span> / 17</div>
                                </div>
                            )}
                            
                            <div className={`flex items-center justify-between p-4 rounded-lg border shadow-sm ${videoStatus === 'INVALID' ? 'bg-red-50 border-red-200' : 'bg-background'}`}>
                                <div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-widest">Total Score</div>
                                    <div className="text-3xl font-black font-mono">{videoStatus === 'INVALID' ? '-' : finalScore}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-muted-foreground uppercase tracking-widest">Hasil Level</div>
                                    <div className={`text-2xl font-bold ${levelColor} flex items-center justify-end gap-2`}>
                                        {videoStatus === 'INVALID' && <AlertCircle className="w-6 h-6" />}
                                        {calculatedLevel}
                                    </div>
                                    {videoStatus !== 'INVALID' && <div className="text-xs text-muted-foreground mt-1">Seeding: {seedingPoints} Poin</div>}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button variant="outline" className="w-full" onClick={onClose}>Batal</Button>
                                <Button 
                                    className="w-full bg-primary hover:bg-primary/90" 
                                    disabled={!videoStatus}
                                >
                                    <Save className="w-4 h-4 mr-2" /> 
                                    {videoStatus === 'INVALID' ? 'Tolak Pemain' : 'Simpan Hasil'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
