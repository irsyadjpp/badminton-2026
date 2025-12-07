
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Calculator, Zap, Shield, BrainCircuit, PlayCircle, 
  Info, CheckCircle2, AlertTriangle 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { submitVerificationResult, type PlayerVerification } from "@/app/admin/tpf/actions";

// Konstanta Bonus [cite: 681-698]
const BONUS_POINTS = {
  // Attack
  jumpingSmash: 3, stickSmash: 3, backhandSmash: 4, netKill: 2, flickServe: 2,
  // Control
  spinningNet: 3, crossNet: 3, backhandDrop: 3, backhandClear: 3, crossDefense: 3,
  // IQ
  splitStep: 4, divingDefense: 3, deception: 4, intercept: 3, judgement: 2
};

export function TpfAssessmentModal({ isOpen, onClose, player }: { isOpen: boolean, onClose: () => void, player: PlayerVerification }) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("visual");
  
  // State Skor Utama (A) [cite: 678]
  const [scores, setScores] = useState({
    grip: 1, footwork: 1, backhand: 1, attack: 1, defense: 1, gameIq: 1, physique: 1
  });

  // State Skill Bonus (B) [cite: 681-698]
  const [skills, setSkills] = useState<Record<string, boolean>>({});
  
  const [notes, setNotes] = useState("");
  const [finalCalc, setFinalCalc] = useState({ scoreA: 0, scoreB: 0, total: 0, level: "", tier: "", color: "" });

  // Kalkulasi Real-time 
  useEffect(() => {
    // 1. Total A
    const totalA = Object.values(scores).reduce((a, b) => a + b, 0);
    
    // 2. Total B (Max 20)
    let totalB = 0;
    Object.keys(skills).forEach(k => {
      if (skills[k]) totalB += BONUS_POINTS[k as keyof typeof BONUS_POINTS];
    });
    if (totalB > 20) totalB = 20;

    // 3. Rumus: (A x 2) + B
    const finalScore = (totalA * 2) + totalB;

    // 4. Logika Level & Tier
    let level = "REJECTED";
    let tier = "Over Spec / Joki";
    let color = "bg-red-100 text-red-800 border-red-500";

    if (finalScore >= 14 && finalScore <= 36) {
        level = "BEGINNER";
        color = "bg-green-100 text-green-800 border-green-500";
        if (finalScore <= 24) tier = "Tier 3 (Newbie)";
        else if (finalScore <= 30) tier = "Tier 2 (Rookie)";
        else tier = "Tier 1 (Prospect)";
    } else if (finalScore >= 37 && finalScore <= 62) {
        level = "INTERMEDIATE";
        color = "bg-blue-100 text-blue-800 border-blue-500";
        if (finalScore <= 44) tier = "Tier 3 (Grinder)";
        else if (finalScore <= 54) tier = "Tier 2 (Striker)";
        else tier = "Tier 1 (Carry)";
    } else if (finalScore >= 63 && finalScore <= 89) {
        level = "ADVANCE";
        color = "bg-purple-100 text-purple-800 border-purple-500";
        if (finalScore <= 70) tier = "Tier 3 (Master)";
        else if (finalScore <= 80) tier = "Tier 2 (Savage)";
        else tier = "Tier 1 (Prime)";
    }

    setFinalCalc({ scoreA: totalA, scoreB: totalB, total: finalScore, level, tier, color });
  }, [scores, skills]);

  const handleSubmit = async () => {
      await submitVerificationResult(player.id, { 
          ...finalCalc, 
          status: finalCalc.level === 'REJECTED' ? 'REJECTED' : 'APPROVED',
          notes 
      });
      toast({ title: "Verifikasi Selesai", description: `${player.name} ditetapkan sebagai ${finalCalc.level}` });
      onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] h-[95vh] p-0 flex flex-col overflow-hidden bg-background">
        
        {/* HEADER */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-card shrink-0">
            <div>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    <PlayCircle className="w-5 h-5 text-primary"/> Audit: {player.name}
                </DialogTitle>
                <p className="text-sm text-muted-foreground">{player.team} • {player.category} (Claimed)</p>
            </div>
            
            {/* SCORECARD STICKY DI ATAS */}
            <div className={`px-6 py-2 rounded-lg border-2 flex items-center gap-6 ${finalCalc.color}`}>
                <div className="text-center">
                    <div className="text-[10px] uppercase font-bold opacity-70">Skor A (x2)</div>
                    <div className="font-mono font-bold">{finalCalc.scoreA * 2}</div>
                </div>
                <div className="text-2xl font-light opacity-50">+</div>
                <div className="text-center">
                    <div className="text-[10px] uppercase font-bold opacity-70">Bonus B</div>
                    <div className="font-mono font-bold">{finalCalc.scoreB}</div>
                </div>
                <div className="text-2xl font-light opacity-50">=</div>
                <div className="text-center min-w-[120px]">
                    <div className="text-[10px] uppercase font-bold opacity-70">Final Score</div>
                    <div className="text-3xl font-black">{finalCalc.total}</div>
                </div>
                <div className="h-8 w-[1px] bg-current opacity-20 mx-2"></div>
                <div className="text-left">
                    <div className="text-lg font-black">{finalCalc.level}</div>
                    <div className="text-xs font-medium">{finalCalc.tier}</div>
                </div>
            </div>
        </div>

        {/* MAIN CONTENT SPLIT SCREEN */}
        <div className="flex-1 grid grid-cols-12 overflow-hidden">
            
            {/* PANEL KIRI: VIDEO & PANDUAN (40%) */}
            <div className="col-span-12 lg:col-span-5 bg-black flex flex-col h-full relative">
                {/* Video Player */}
                <div className="aspect-video w-full bg-black flex items-center justify-center border-b border-zinc-800">
                    <iframe src={player.videoUrl} className="w-full h-full" allowFullScreen title="Player Video"/>
                </div>
                
                {/* Cheat Sheet (Scrollable) [cite: 714-743] */}
                <ScrollArea className="flex-1 bg-zinc-900 text-zinc-300 p-4">
                    <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                        <Info className="w-4 h-4 text-blue-400"/> Panduan Visual (Cheat Sheet)
                    </h4>
                    <div className="space-y-4 text-xs">
                        <CheatItem title="1. Grip" bad="Panci, kaku, bunyi bletak" good="Salaman, luwes, bunyi tring" />
                        <CheatItem title="2. Footwork" bad="Lari jogging, berat, diam" good="Geser (chasse), jinjit, ringan" />
                        <CheatItem title="3. Backhand" bad="Lari mutar badan, panik" good="Clear sampai belakang, santai" />
                        <CheatItem title="4. Attack" bad="Melambung keluar, nyangkut" good="Menukik tajam, bunyi ledakan" />
                        <CheatItem title="5. Defense" bad="Buang muka, raket ditaruh" good="Tembok, drive balik, tenang" />
                    </div>
                </ScrollArea>
            </div>

            {/* PANEL KANAN: FORM PENILAIAN (60%) */}
            <div className="col-span-12 lg:col-span-7 bg-slate-50 flex flex-col h-full overflow-hidden">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-6 pt-4 bg-white border-b">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="visual">I. Audit Visual (Skor 1-5)</TabsTrigger>
                            <TabsTrigger value="bonus">II. Skill Modifier (Bonus)</TabsTrigger>
                        </TabsList>
                    </div>

                    <ScrollArea className="flex-1 p-6">
                        <TabsContent value="visual" className="mt-0 space-y-6">
                            <div className="grid gap-6">
                                <ScoreSlider 
                                    label="1. Biomekanik (Grip)" 
                                    desc="Apakah pegangan raket kaku (Panci) atau luwes (Salaman)?" 
                                    val={scores.grip} setVal={(v) => setScores({...scores, grip: v})} 
                                />
                                <ScoreSlider 
                                    label="2. Footwork (Kaki)" 
                                    desc="Lari berat (Jogging) vs Langkah geser/jinjit (Chasse)?" 
                                    val={scores.footwork} setVal={(v) => setScores({...scores, footwork: v})} 
                                />
                                <ScoreSlider 
                                    label="3. Backhand (Kiri)" 
                                    desc="Bisa clear lurus sampai belakang?" 
                                    val={scores.backhand} setVal={(v) => setScores({...scores, backhand: v})} 
                                />
                                <ScoreSlider 
                                    label="4. Attack (Smash)" 
                                    desc="Power dan sudut tukikan smash." 
                                    val={scores.attack} setVal={(v) => setScores({...scores, attack: v})} 
                                />
                                <ScoreSlider 
                                    label="5. Defense (Bertahan)" 
                                    desc="Tenang jadi tembok atau panik buang bola?" 
                                    val={scores.defense} setVal={(v) => setScores({...scores, defense: v})} 
                                />
                                <ScoreSlider 
                                    label="6. Game IQ (Rotasi)" 
                                    desc="Saling mengisi posisi atau sering tabrakan?" 
                                    val={scores.gameIq} setVal={(v) => setScores({...scores, gameIq: v})} 
                                />
                                <ScoreSlider 
                                    label="7. Physique (Fisik)" 
                                    desc="Stabil dari awal sampai akhir video?" 
                                    val={scores.physique} setVal={(v) => setScores({...scores, physique: v})} 
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="bonus" className="mt-0 space-y-6">
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 mb-4 flex gap-2">
                                <AlertTriangle className="w-4 h-4 shrink-0" />
                                Centang hanya jika teknik terlihat jelas dan sukses minimal 1x.
                            </div>

                            <SkillGroup title="A. Kelompok Serangan (Attack)" icon={<Zap className="w-4 h-4 text-red-500"/>} items={[
                                {id: 'jumpingSmash', l: 'Jumping Smash (+3)'},
                                {id: 'stickSmash', l: 'Stick Smash (+3)'},
                                {id: 'backhandSmash', l: 'Backhand Smash (+4)'},
                                {id: 'netKill', l: 'Net Kill (+2)'},
                                {id: 'flickServe', l: 'Flick Serve (+2)'}
                            ]} state={skills} setState={setSkills} />

                            <SkillGroup title="B. Kelompok Kontrol" icon={<Shield className="w-4 h-4 text-blue-500"/>} items={[
                                {id: 'spinningNet', l: 'Spinning Net (+3)'},
                                {id: 'crossNet', l: 'Cross Net (+3)'},
                                {id: 'backhandDrop', l: 'Backhand Drop (+3)'},
                                {id: 'backhandClear', l: 'Backhand Clear (+3)'},
                                {id: 'crossDefense', l: 'Cross Defense (+3)'}
                            ]} state={skills} setState={setSkills} />

                            <SkillGroup title="C. Kecerdasan & Refleks" icon={<BrainCircuit className="w-4 h-4 text-purple-500"/>} items={[
                                {id: 'splitStep', l: 'Split Step (+4)'},
                                {id: 'divingDefense', l: 'Diving Defense (+3)'},
                                {id: 'deception', l: 'Deception / Hold (+4)'},
                                {id: 'intercept', l: 'Intercept (+3)'},
                                {id: 'judgement', l: 'Watch the Line (+2)'}
                            ]} state={skills} setState={setSkills} />
                        </TabsContent>
                    </ScrollArea>

                    {/* FOOTER ACTIONS */}
                    <div className="p-4 border-t bg-white space-y-3 shrink-0">
                        <Textarea 
                            placeholder="Catatan Khusus (Opsional). Contoh: 'Menit 02:15 melakukan backhand smash tajam.'" 
                            value={notes} 
                            onChange={e => setNotes(e.target.value)} 
                            className="h-16 text-sm"
                        />
                        <Button className="w-full h-12 text-lg font-bold" onClick={handleSubmit}>
                            <CheckCircle2 className="w-5 h-5 mr-2" /> TETAPKAN HASIL VERIFIKASI
                        </Button>
                    </div>
                </Tabs>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- SUB COMPONENTS ---

function ScoreSlider({ label, desc, val, setVal }: any) {
    return (
        <div className="bg-white p-4 rounded-lg border shadow-sm space-y-3">
            <div className="flex justify-between items-center">
                <Label className="text-base font-bold">{label}</Label>
                <Badge variant="outline" className="text-lg font-mono w-10 justify-center bg-slate-100">{val}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">{desc}</p>
            <Slider value={[val]} min={1} max={5} step={1} onValueChange={(v) => setVal(v[0])} className="py-2" />
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>1. Buruk</span><span>3. Cukup</span><span>5. Sempurna</span>
            </div>
        </div>
    )
}

function SkillGroup({ title, icon, items, state, setState }: any) {
    return (
        <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h4 className="font-bold mb-3 flex items-center gap-2">{icon} {title}</h4>
            <div className="grid grid-cols-2 gap-3">
                {items.map((i: any) => (
                    <div key={i.id} className="flex items-center space-x-2">
                        <Checkbox 
                            id={i.id} 
                            checked={state[i.id] || false}
                            onCheckedChange={(c) => setState({...state, [i.id]: !!c})} 
                        />
                        <label htmlFor={i.id} className="text-sm font-medium cursor-pointer select-none leading-none">
                            {i.l}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    )
}

function CheatItem({ title, bad, good }: any) {
    return (
        <div className="bg-zinc-800 p-3 rounded border border-zinc-700">
            <div className="font-bold text-white mb-1">{title}</div>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="text-red-400">❌ {bad}</div>
                <div className="text-green-400">✅ {good}</div>
            </div>
        </div>
    )
}
