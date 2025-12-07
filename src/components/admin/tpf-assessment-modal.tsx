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
    { id: 'biomechanics', label: '1. BIOMEKANIK (Grip)', desc: 'Efisiensi tenaga & cara pegang' },
    { id: 'footwork', label: '2. FOOTWORK (Gerak Kaki)', desc: 'Kelincahan & Split Step' },
    { id: 'backhand', label: '3. BACKHAND OVERHEAD', desc: 'Pukulan kiri belakang' },
    { id: 'attack', label: '4. ATTACK (Smash Power)', desc: 'Kekuatan & Sudut' },
    { id: 'defense', label: '5. DEFENSE (Pertahanan)', desc: 'Refleks & Balik Serang' },
    { id: 'gameiq', label: '6. GAME IQ (Taktik)', desc: 'Rotasi & Penguasaan' },
    { id: 'physique', label: '7. PHYSIQUE', desc: 'Fisik & Mental' },
];

const SKILL_BONUSES_ATTACK = [
    { id: 'jumping_smash', label: 'Jumping Smash', points: 3 },
    { id: 'stick_smash', label: 'Stick Smash', points: 3 },
    { id: 'backhand_smash', label: 'Backhand Smash', points: 4 },
    { id: 'net_kill', label: 'Net Kill', points: 2 },
    { id: 'flick_serve', label: 'Flick Serve', points: 2 },
];

const SKILL_BONUSES_CONTROL = [
    { id: 'spinning_net', label: 'Spinning Net', points: 3 },
    { id: 'cross_net', label: 'Cross Net', points: 3 },
    { id: 'backhand_drop', label: 'Backhand Drop', points: 3 },
    { id: 'backhand_clear', label: 'Backhand Clear', points: 3 },
    { id: 'cross_defense', label: 'Cross Defense', points: 3 },
];

const SKILL_BONUSES_IQ = [
    { id: 'split_step', label: 'Split Step', points: 4 },
    { id: 'diving_defense', label: 'Diving Defense', points: 3 },
    { id: 'deception_hold', label: 'Deception / Hold', points: 4 },
    { id: 'intercept', label: 'Intercept', points: 3 },
    { id: 'judgement', label: 'Judgement (Bola Out)', points: 2 },
];


export function TpfAssessmentModal({ isOpen, onClose, player }: any) {
    const [scores, setScores] = useState<Record<string, number>>({});
    const [bonuses, setBonuses] = useState<Record<string, boolean>>({});
    const [logCheck, setLogCheck] = useState({ early: false, mid: false, late: false });
    const [videoStatus, setVideoStatus] = useState<"VALID" | "INVALID" | null>(null);

    const allBonuses = [...SKILL_BONUSES_ATTACK, ...SKILL_BONUSES_CONTROL, ...SKILL_BONUSES_IQ];
    
    // Kalkulasi Skor
    const totalScoreA = Object.values(scores).reduce((a, b) => a + b, 0);
    const totalBonusB = allBonuses.reduce((acc, item) => acc + (bonuses[item.id] ? item.points : 0), 0);
    const finalScore = (totalScoreA * 2) + totalBonusB;

    // Penentuan Level & Tier
    let calculatedLevel = "REJECTED";
    let calculatedTier = "N/A";
    let levelColor = "text-destructive";

    if (videoStatus === 'VALID') {
        if (finalScore >= 81) { calculatedLevel = "ADVANCE"; calculatedTier = "Tier 1 (Prime)"; levelColor = "text-red-600"; }
        else if (finalScore >= 71) { calculatedLevel = "ADVANCE"; calculatedTier = "Tier 2 (Savage)"; levelColor = "text-red-600"; }
        else if (finalScore >= 63) { calculatedLevel = "ADVANCE"; calculatedTier = "Tier 3 (Master)"; levelColor = "text-red-600"; }
        else if (finalScore >= 55) { calculatedLevel = "INTERMEDIATE"; calculatedTier = "Tier 1 (Carry)"; levelColor = "text-blue-600"; }
        else if (finalScore >= 45) { calculatedLevel = "INTERMEDIATE"; calculatedTier = "Tier 2 (Striker)"; levelColor = "text-blue-600"; }
        else if (finalScore >= 37) { calculatedLevel = "INTERMEDIATE"; calculatedTier = "Tier 3 (Grinder)"; levelColor = "text-blue-600"; }
        else if (finalScore >= 31) { calculatedLevel = "BEGINNER"; calculatedTier = "Tier 1 (Prospect)"; levelColor = "text-green-600"; }
        else if (finalScore >= 25) { calculatedLevel = "BEGINNER"; calculatedTier = "Tier 2 (Rookie)"; levelColor = "text-green-600"; }
        else if (finalScore >= 14) { calculatedLevel = "BEGINNER"; calculatedTier = "Tier 3 (Newbie)"; levelColor = "text-green-600"; }
        else { calculatedLevel = "BEGINNER"; calculatedTier = "Tier 3 (Newbie)"; levelColor = "text-green-600"; }
    } else if (videoStatus === 'INVALID') {
        calculatedLevel = "REJECTED";
        calculatedTier = "Video Invalid";
    }

    if (finalScore > 90) {
        calculatedLevel = "REJECTED";
        calculatedTier = "Skor Terlalu Tinggi (Indikasi Atlet)";
        levelColor = "text-destructive";
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-7xl h-[95vh] flex flex-col p-0 overflow-hidden">
                <div className="flex h-full">
                    
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
                        <div className="p-4 bg-zinc-900 text-white border-t border-zinc-800">
                            <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-zinc-400">Log Sampling (Wajib Tonton)</h4>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
                                    <Checkbox checked={logCheck.early} onCheckedChange={(c) => setLogCheck(prev => ({...prev, early: !!c}))} className="border-white/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"/>
                                    1. Early (0-5)
                                </label>
                                <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
                                    <Checkbox checked={logCheck.mid} onCheckedChange={(c) => setLogCheck(prev => ({...prev, mid: !!c}))} className="border-white/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"/>
                                    2. Mid (Interval)
                                </label>
                                <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
                                    <Checkbox checked={logCheck.late} onCheckedChange={(c) => setLogCheck(prev => ({...prev, late: !!c}))} className="border-white/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"/>
                                    3. Late (18++)
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="w-1/2 flex flex-col bg-background">
                        <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between">
                            <div>
                                <DialogTitle>Audit: {player?.name} ({player?.team})</DialogTitle>
                                <DialogDescription>Klaim Awal: <span className="font-bold text-foreground">{player?.category}</span></DialogDescription>
                            </div>
                            
                            <Sheet>
                                <SheetTrigger asChild><Button variant="outline" size="sm" className="gap-2"><BookOpen className="w-4 h-4" /> Panduan</Button></SheetTrigger>
                                <SheetContent className="w-[400px] sm:w-[540px]"><ScrollArea className="h-full pr-6"><SheetHeader className="mb-6"><SheetTitle>Panduan Skoring Teknis</SheetTitle><SheetDescription>Gunakan panduan ini untuk menentukan skor 1-5 secara objektif.</SheetDescription></SheetHeader><div className="space-y-8">{RUBRIC_GUIDELINES.map((rubric) => (<div key={rubric.id} className="space-y-3"><h4 className="font-bold text-primary border-b pb-1">{rubric.title}</h4><ul className="space-y-3">{rubric.scores.map((s) => (<li key={s.score} className="text-sm grid grid-cols-[20px_1fr] gap-2"><span className={`font-bold ${s.score <= 2 ? 'text-red-500' : s.score === 3 ? 'text-yellow-600' : 'text-green-600'}`}>{s.score}</span><span className="text-muted-foreground">{s.desc}</span></li>))}</ul></div>))}</div></ScrollArea></SheetContent>
                            </Sheet>
                        </DialogHeader>

                        <ScrollArea className="flex-1 px-6 py-4">
                            <div className="space-y-8 pb-10">
                                <div className="p-4 border-2 border-dashed rounded-lg bg-secondary/10">
                                    <Label className="text-base font-bold mb-3 block">Status Video (Wajib Diisi)</Label>
                                    <RadioGroup onValueChange={(val) => setVideoStatus(val as any)} className="flex gap-4">
                                        <div className={`flex items-center space-x-2 border p-3 rounded-md flex-1 cursor-pointer transition-colors ${videoStatus === 'VALID' ? 'bg-green-50 border-green-500' : 'hover:bg-secondary'}`}><RadioGroupItem value="VALID" id="status-valid" /><Label htmlFor="status-valid" className="cursor-pointer font-medium">Valid (Uncut)</Label></div>
                                        <div className={`flex items-center space-x-2 border p-3 rounded-md flex-1 cursor-pointer transition-colors ${videoStatus === 'INVALID' ? 'bg-red-50 border-red-500' : 'hover:bg-secondary'}`}><RadioGroupItem value="INVALID" id="status-invalid" /><Label htmlFor="status-invalid" className="cursor-pointer font-medium text-destructive">Invalid (Edit/Buram)</Label></div>
                                    </RadioGroup>
                                </div>

                                <div className={!videoStatus || videoStatus === 'INVALID' ? 'opacity-50 pointer-events-none grayscale' : ''}>
                                    <div className="space-y-6">
                                        <h3 className="font-bold text-lg flex items-center gap-2 border-b pb-2">A. Indikator Utama (Skor 1-5)</h3>
                                        {TECHNICAL_RUBRICS.map((item) => (<div key={item.id} className="space-y-3 p-4 rounded-lg bg-secondary/20 hover:bg-secondary/40"><div className="flex justify-between items-center"><Label className="text-base font-semibold">{item.label}</Label><span className="text-xs text-muted-foreground">{item.desc}</span></div><RadioGroup onValueChange={(val) => setScores(prev => ({...prev, [item.id]: parseInt(val)}))} className="flex justify-between">{[1, 2, 3, 4, 5].map((val) => (<div key={val} className="flex flex-col items-center gap-1"><RadioGroupItem value={val.toString()} id={`${item.id}-${val}`} /><Label htmlFor={`${item.id}-${val}`} className="text-xs font-normal text-muted-foreground">{val}</Label></div>))}</RadioGroup></div>))}
                                    </div>
                                    
                                    <div className="space-y-4 mt-8">
                                        <h3 className="font-bold text-lg flex items-center gap-2 border-b pb-2">B. Bonus Skill (Modifier)</h3>
                                        {[ { title: 'Kelompok Serangan', items: SKILL_BONUSES_ATTACK }, { title: 'Kelompok Kontrol', items: SKILL_BONUSES_CONTROL }, { title: 'Kelompok IQ & Fisik', items: SKILL_BONUSES_IQ } ].map(group => (
                                            <div key={group.title} className="p-4 border rounded-lg"><h4 className="font-semibold text-sm mb-3">{group.title}</h4><div className="grid grid-cols-2 gap-3">
                                                {group.items.map((bonus) => (<div key={bonus.id} className="flex items-center space-x-3"><Checkbox id={bonus.id} onCheckedChange={(c) => setBonuses(prev => ({...prev, [bonus.id]: !!c}))} /><div className="flex-1"><Label htmlFor={bonus.id} className="font-medium text-xs">{bonus.label}</Label></div><Badge variant="secondary">+{bonus.points}</Badge></div>))}
                                            </div></div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2 mt-6">
                                    <Label>Catatan Verifikator</Label>
                                    <Textarea placeholder={videoStatus === 'INVALID' ? "Jelaskan kenapa video tidak valid..." : "Contoh: Pemain memiliki backhand smash..."} className={videoStatus === 'INVALID' ? 'border-destructive focus-visible:ring-destructive' : ''}/>
                                </div>
                            </div>
                        </ScrollArea>

                        <div className="p-4 bg-secondary/30 border-t space-y-4">
                            <div className={`flex items-center justify-between p-4 rounded-lg border shadow-sm ${videoStatus === 'INVALID' ? 'bg-red-50 border-red-200' : 'bg-background'}`}>
                                <div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-widest">Skor Akhir: ({totalScoreA} x 2) + {totalBonusB}</div>
                                    <div className="text-4xl font-black font-mono">{videoStatus === 'INVALID' ? '-' : finalScore}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-muted-foreground uppercase tracking-widest">Hasil Level</div>
                                    <div className={`text-2xl font-bold ${levelColor} flex items-center justify-end gap-2`}>
                                        {videoStatus === 'INVALID' && <AlertCircle className="w-6 h-6" />}
                                        {calculatedLevel}
                                    </div>
                                    <div className="text-xs text-muted-foreground font-bold mt-1">{calculatedTier}</div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" className="w-full" onClick={onClose}>Batal</Button>
                                <Button className="w-full bg-primary hover:bg-primary/90" disabled={!videoStatus}><Save className="w-4 h-4 mr-2" /> {videoStatus === 'INVALID' ? 'Tolak Pemain' : 'Simpan Hasil'}</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
