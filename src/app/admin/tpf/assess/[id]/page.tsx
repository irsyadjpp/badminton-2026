'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, Calculator, Zap, Shield, BrainCircuit, 
  Info, CheckCircle2, XCircle, PlayCircle, BookOpen, AlertTriangle, ChevronDown, ChevronUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getPlayerById, submitVerificationResult, type PlayerVerification } from "../../actions";

// Konstanta Bonus
const BONUS_POINTS = {
  jumpingSmash: 3, stickSmash: 3, backhandSmash: 4, netKill: 2, flickServe: 2,
  spinningNet: 3, crossNet: 3, backhandDrop: 3, backhandClear: 3, crossDefense: 3,
  splitStep: 4, divingDefense: 3, deception: 4, intercept: 3, judgement: 2
};

export default function AssessmentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [player, setPlayer] = useState<PlayerVerification | null>(null);
  const [loading, setLoading] = useState(true);

  // UI State
  const [activeTab, setActiveTab] = useState("visual");
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [manualStatus, setManualStatus] = useState<'AUTO' | 'VALID' | 'INVALID'>('AUTO');

  // Scoring State
  const [scores, setScores] = useState({
    grip: 1, footwork: 1, backhand: 1, attack: 1, defense: 1, gameIq: 1, physique: 1
  });
  const [skills, setSkills] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState("");
  const [finalCalc, setFinalCalc] = useState({ scoreA: 0, scoreB: 0, total: 0, level: "", tier: "", color: "" });

  // Fetch Data
  useEffect(() => {
    getPlayerById(params.id).then((data) => {
        if (data) setPlayer(data);
        setLoading(false);
    });
  }, [params.id]);

  // Real-time Calculation
  useEffect(() => {
    const totalA = Object.values(scores).reduce((a, b) => a + b, 0);
    let totalB = 0;
    Object.keys(skills).forEach(k => {
      if (skills[k]) totalB += BONUS_POINTS[k as keyof typeof BONUS_POINTS];
    });
    if (totalB > 20) totalB = 20;

    const finalScore = (totalA * 2) + totalB;

    let level = "REJECTED";
    let tier = "Over Spec / Joki";
    let color = "bg-red-600 text-white border-red-800";

    if (finalScore >= 14 && finalScore <= 36) {
        level = "BEGINNER";
        color = "bg-green-600 text-white border-green-800";
        if (finalScore <= 24) tier = "Tier 3 (Newbie)";
        else if (finalScore <= 30) tier = "Tier 2 (Rookie)";
        else tier = "Tier 1 (Prospect)";
    } else if (finalScore >= 37 && finalScore <= 62) {
        level = "INTERMEDIATE";
        color = "bg-blue-600 text-white border-blue-800";
        if (finalScore <= 44) tier = "Tier 3 (Grinder)";
        else if (finalScore <= 54) tier = "Tier 2 (Striker)";
        else tier = "Tier 1 (Carry)";
    } else if (finalScore >= 63 && finalScore <= 89) {
        level = "ADVANCE";
        color = "bg-purple-600 text-white border-purple-800";
        if (finalScore <= 70) tier = "Tier 3 (Master)";
        else if (finalScore <= 80) tier = "Tier 2 (Savage)";
        else tier = "Tier 1 (Prime)";
    }

    if (manualStatus === 'INVALID') {
        level = "REJECTED";
        tier = "Dibatalkan Manual (Invalid)";
        color = "bg-red-600 text-white border-red-800";
    }

    setFinalCalc({ scoreA: totalA, scoreB: totalB, total: finalScore, level, tier, color });
  }, [scores, skills, manualStatus]);

  const handleSubmit = async () => {
      if (!player) return;
      if (manualStatus === 'INVALID' && !notes) {
          return toast({ title: "Isi Catatan", description: "Jelaskan alasan video invalid.", variant: "destructive" });
      }
      await submitVerificationResult(player.id, { 
          ...finalCalc, 
          status: finalCalc.level === 'REJECTED' ? 'REJECTED' : 'APPROVED',
          notes 
      });
      toast({ title: "Sukses", description: "Hasil verifikasi tersimpan." });
      router.push('/admin/tpf');
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-900 text-white">Loading...</div>;
  if (!player) return <div className="flex h-screen items-center justify-center">Player Not Found</div>;

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans">
        
        {/* --- HEADER NAVBAR --- */}
        <header className="bg-white border-b border-slate-200 px-6 py-2 flex items-center justify-between shrink-0 h-14 z-50">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8">
                    <ArrowLeft className="w-5 h-5 text-slate-700" />
                </Button>
                <div>
                    <h1 className="font-bold text-slate-900 leading-none">
                        {player.name} <span className="text-slate-400 font-normal">|</span> <span className="text-primary text-sm">{player.category} (Klaim)</span>
                    </h1>
                </div>
            </div>

            {/* Live Score Indicator (Compact) */}
            <div className={`flex items-center gap-3 px-4 py-1 rounded-md shadow-sm border ${finalCalc.color}`}>
                <div className="flex gap-2 text-xs font-bold opacity-90">
                    <span>A: {finalCalc.scoreA * 2}</span>
                    <span>+</span>
                    <span>B: {finalCalc.scoreB}</span>
                    <span>=</span>
                    <span className="text-lg">{finalCalc.total}</span>
                </div>
                <div className="h-4 w-[1px] bg-white/40"></div>
                <div className="font-black text-sm uppercase">{finalCalc.level}</div>
            </div>
        </header>

        {/* --- MAIN LAYOUT: VERTICAL STACK --- */}
        
        {/* 1. VIDEO PLAYER (STICKY TOP) */}
        <div className="shrink-0 bg-black w-full relative group" style={{ height: '45vh' }}>
            <iframe src={player.videoUrl} className="w-full h-full" allowFullScreen />
            
            {/* Toolbar Overlay di atas Video */}
            <div className="absolute top-2 right-2 flex gap-2">
                 <Button 
                    size="sm" 
                    variant="secondary"
                    className="bg-black/50 text-white hover:bg-black/80 backdrop-blur-md border border-white/10"
                    onClick={() => setShowCheatSheet(!showCheatSheet)}
                >
                    <BookOpen className="w-4 h-4 mr-2" />
                    {showCheatSheet ? "Tutup Panduan" : "Panduan Rubrik"}
                </Button>
            </div>

            {/* Cheat Sheet Drawer (Muncul di atas video jika diaktifkan) */}
            {showCheatSheet && (
                <div className="absolute inset-0 bg-black/90 z-20 p-6 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-blue-400 flex items-center gap-2"><Info className="w-4 h-4"/> PANDUAN VISUAL</h4>
                        <Button size="sm" variant="ghost" className="text-white hover:bg-white/20" onClick={() => setShowCheatSheet(false)}><ChevronUp className="w-4 h-4"/></Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                        <CheatItem title="1. Grip" bad="Panci, kaku, bunyi bletak" good="Salaman, luwes, bunyi tring" />
                        <CheatItem title="2. Footwork" bad="Lari jogging, berat, diam" good="Geser (chasse), jinjit, ringan" />
                        <CheatItem title="3. Backhand" bad="Lari mutar badan, panik" good="Clear sampai belakang, santai" />
                        <CheatItem title="4. Attack" bad="Melambung keluar, nyangkut" good="Menukik tajam, bunyi ledakan" />
                        <CheatItem title="5. Defense" bad="Buang muka, raket ditaruh" good="Tembok, drive balik, tenang" />
                    </div>
                </div>
            )}
        </div>

        {/* 2. SCROLLABLE FORM AREA (BOTTOM) */}
        <div className="flex-1 overflow-hidden flex flex-col bg-slate-50 relative">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                
                {/* Tabs Header */}
                <div className="bg-white border-b px-4 pt-2 shadow-sm z-10 shrink-0">
                    <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                        <TabsTrigger value="visual">I. Audit Visual (1-5)</TabsTrigger>
                        <TabsTrigger value="bonus">II. Skill Bonus</TabsTrigger>
                    </TabsList>
                </div>

                {/* Form Content (Scrollable) */}
                <ScrollArea className="flex-1 p-4 lg:p-8">
                    <div className="max-w-5xl mx-auto space-y-8 pb-20"> {/* pb-20 untuk memberi ruang footer */}
                        
                        {/* VALIDASI MANUAL SWITCH */}
                        <div className="flex justify-center mb-6">
                            <div className="inline-flex bg-white p-1 rounded-lg border shadow-sm">
                                <button onClick={() => setManualStatus('AUTO')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${manualStatus === 'AUTO' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                                    Hitung Auto
                                </button>
                                <button onClick={() => setManualStatus('INVALID')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${manualStatus === 'INVALID' ? 'bg-red-600 text-white' : 'text-slate-500 hover:text-red-600'}`}>
                                    Set INVALID
                                </button>
                            </div>
                        </div>

                        {/* CONTENT TABS */}
                        <TabsContent value="visual" className="mt-0 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ScoreSlider label="1. Biomekanik (Grip)" desc="Pegangan raket kaku (Panci) vs Luwes (Salaman)?" val={scores.grip} setVal={(v) => setScores({...scores, grip: v})} />
                                <ScoreSlider label="2. Footwork" desc="Lari berat vs Langkah geser/jinjit?" val={scores.footwork} setVal={(v) => setScores({...scores, footwork: v})} />
                                <ScoreSlider label="3. Backhand" desc="Panik vs Clear sampai belakang?" val={scores.backhand} setVal={(v) => setScores({...scores, backhand: v})} />
                                <ScoreSlider label="4. Attack Power" desc="Smash melambung vs Menukik tajam?" val={scores.attack} setVal={(v) => setScores({...scores, attack: v})} />
                                <ScoreSlider label="5. Defense" desc="Buang muka vs Tembok tenang?" val={scores.defense} setVal={(v) => setScores({...scores, defense: v})} />
                                <ScoreSlider label="6. Game IQ" desc="Tabrakan vs Saling mengisi rotasi?" val={scores.gameIq} setVal={(v) => setScores({...scores, gameIq: v})} />
                                <ScoreSlider label="7. Fisik" desc="Ngos-ngosan vs Stabil Explosif?" val={scores.physique} setVal={(v) => setScores({...scores, physique: v})} />
                            </div>
                        </TabsContent>

                        <TabsContent value="bonus" className="mt-0 space-y-6">
                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-900 flex gap-2">
                                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                <span>Centang <strong>hanya jika</strong> teknik terlihat jelas & sukses minimal 1x.</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <SkillGroup title="A. Serangan" icon={<Zap className="w-4 h-4 text-red-600"/>} items={[ {id: 'jumpingSmash', l: 'Jumping Smash'}, {id: 'stickSmash', l: 'Stick Smash'}, {id: 'backhandSmash', l: 'Backhand Smash (+4)'}, {id: 'netKill', l: 'Net Kill'}, {id: 'flickServe', l: 'Flick Serve'} ]} state={skills} setState={setSkills} />
                                <SkillGroup title="B. Kontrol" icon={<Shield className="w-4 h-4 text-blue-600"/>} items={[ {id: 'spinningNet', l: 'Spinning Net'}, {id: 'crossNet', l: 'Cross Net'}, {id: 'backhandDrop', l: 'Backhand Drop'}, {id: 'backhandClear', l: 'Backhand Clear'}, {id: 'crossDefense', l: 'Cross Defense'} ]} state={skills} setState={setSkills} />
                                <SkillGroup title="C. IQ & Refleks" icon={<BrainCircuit className="w-4 h-4 text-purple-600"/>} items={[ {id: 'splitStep', l: 'Split Step (+4)'}, {id: 'divingDefense', l: 'Diving Defense'}, {id: 'deception', l: 'Deception / Hold (+4)'}, {id: 'intercept', l: 'Intercept'}, {id: 'judgement', l: 'Watch Line'} ]} state={skills} setState={setSkills} />
                            </div>
                        </TabsContent>
                    </div>
                </ScrollArea>

                {/* 3. STICKY FOOTER ACTIONS */}
                <div className="p-4 bg-white border-t border-slate-200 shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-20 flex gap-4 items-center">
                    <div className="flex-1">
                        <input 
                            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary text-slate-900 placeholder:text-slate-400"
                            placeholder={manualStatus === 'INVALID' ? "WAJIB ISI ALASAN..." : "Catatan tambahan (Opsional)..."}
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                        />
                    </div>
                    <Button 
                        size="lg" 
                        className={`font-bold px-8 h-12 shadow-md transition-all ${
                            finalCalc.level === 'REJECTED' 
                            ? 'bg-red-600 hover:bg-red-700 text-white' 
                            : 'bg-primary hover:bg-primary/90'
                        }`}
                        onClick={handleSubmit}
                    >
                        {finalCalc.level === 'REJECTED' ? (
                            <><XCircle className="w-5 h-5 mr-2" /> TOLAK (INVALID)</>
                        ) : (
                            <><CheckCircle2 className="w-5 h-5 mr-2" /> TETAPKAN: {finalCalc.level}</>
                        )}
                    </Button>
                </div>

            </Tabs>
        </div>
    </div>
  );
}

// --- SUB COMPONENTS (OPTIMIZED FOR LIGHT MODE) ---

function ScoreSlider({ label, desc, val, setVal }: any) {
    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-primary/30 transition-colors">
            <div className="flex justify-between items-center mb-2">
                <Label className="text-base font-bold text-slate-900">{label}</Label>
                <Badge variant="outline" className="text-lg font-mono bg-slate-100 text-slate-900 border-slate-300 w-10 justify-center">
                    {val}
                </Badge>
            </div>
            <p className="text-xs text-slate-500 mb-4 h-8">{desc}</p>
            <Slider value={[val]} min={1} max={5} step={1} onValueChange={(v) => setVal(v[0])} className="py-1" />
            <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1 uppercase">
                <span>Buruk</span><span>Cukup</span><span>Sempurna</span>
            </div>
        </div>
    )
}

function SkillGroup({ title, icon, items, state, setState }: any) {
    return (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-base mb-4 flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-2">
                {icon} {title}
            </h4>
            <div className="space-y-3">
                {items.map((i: any) => (
                    <div key={i.id} 
                        className={`flex items-center space-x-3 p-2 rounded-lg border cursor-pointer transition-all ${state[i.id] ? 'bg-primary/5 border-primary/40' : 'bg-slate-50 border-transparent hover:bg-slate-100'}`}
                        onClick={() => setState({...state, [i.id]: !state[i.id]})}
                    >
                        <Checkbox 
                            id={i.id} 
                            checked={state[i.id] || false}
                            onCheckedChange={(c) => setState({...state, [i.id]: !!c})} 
                            className="border-slate-400 data-[state=checked]:bg-primary"
                        />
                        <label className="text-sm font-semibold cursor-pointer select-none text-slate-700 hover:text-slate-900">
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
        <div className="bg-zinc-900 border border-zinc-700 p-3 rounded-lg">
            <div className="font-bold text-blue-400 mb-1 text-xs uppercase">{title}</div>
            <div className="grid grid-cols-1 gap-1 text-[11px] text-zinc-300">
                <div className="flex gap-2"><span className="text-red-500 font-bold">✕</span> {bad}</div>
                <div className="flex gap-2"><span className="text-green-500 font-bold">✓</span> {good}</div>
            </div>
        </div>
    )
}
