'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  Info, CheckCircle2, XCircle, PlayCircle, BookOpen, AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  getPlayerById, 
  submitVerificationResult, 
  type PlayerVerification 
} from "../../actions"; 

const BONUS_POINTS = {
  jumpingSmash: 3, stickSmash: 3, backhandSmash: 4, netKill: 2, flickServe: 2,
  spinningNet: 3, crossNet: 3, backhandDrop: 3, backhandClear: 3, crossDefense: 3,
  splitStep: 4, divingDefense: 3, deception: 4, intercept: 3, judgement: 2
};

export default function AssessmentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
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

  // 1. Fetch Player Data
  useEffect(() => {
    if (id) {
        getPlayerById(id).then((data) => {
            if (data) setPlayer(data);
            setLoading(false);
        });
    }
  }, [id]);

  // 2. Real-time Calculation
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

    // Auto Level Logic
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

    // Manual Override
    if (manualStatus === 'INVALID') {
        level = "REJECTED";
        tier = "Video Bermasalah / Invalid";
        color = "bg-red-600 text-white border-red-800";
    }

    setFinalCalc({ scoreA: totalA, scoreB: totalB, total: finalScore, level, tier, color });
  }, [scores, skills, manualStatus]);

  const handleSubmit = async () => {
      if (!player) return;
      
      if (manualStatus === 'INVALID' && !notes) {
          return toast({ title: "Wajib Isi Catatan", description: "Jelaskan kenapa video dinyatakan invalid.", variant: "destructive" });
      }

      await submitVerificationResult(player.id, { 
          ...finalCalc, 
          status: finalCalc.level === 'REJECTED' ? 'REJECTED' : 'APPROVED',
          notes 
      });
      toast({ title: "Selesai", description: "Hasil verifikasi disimpan." });
      router.push('/admin/tpf');
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-900 text-white">Loading...</div>;
  if (!player) return <div className="flex h-screen items-center justify-center">Player Not Found</div>;

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans">
        
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0 h-16 shadow-sm z-20">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-slate-100">
                    <ArrowLeft className="w-5 h-5 text-slate-700" />
                </Button>
                <div>
                    <h1 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                        {player.name}
                        <Badge variant="outline" className="text-slate-600 border-slate-300">{player.category} (Klaim)</Badge>
                    </h1>
                    <p className="text-xs text-slate-500">{player.team}</p>
                </div>
            </div>

            <div className={`flex items-center gap-4 px-6 py-2 rounded-lg shadow-md border-2 transition-colors duration-300 ${finalCalc.color}`}>
                <div className="flex items-center gap-3 text-sm font-medium opacity-90">
                    <div className="text-center">
                        <span className="text-[10px] uppercase block opacity-70">A (x2)</span>
                        <span className="font-mono text-lg font-bold">{finalCalc.scoreA * 2}</span>
                    </div>
                    <span className="text-xl opacity-50">+</span>
                    <div className="text-center">
                        <span className="text-[10px] uppercase block opacity-70">B</span>
                        <span className="font-mono text-lg font-bold">{finalCalc.scoreB}</span>
                    </div>
                    <span className="text-xl opacity-50">=</span>
                </div>
                <div className="border-l border-white/30 pl-4">
                    <span className="text-xs uppercase font-bold block leading-none opacity-80 mb-1">Rekomendasi</span>
                    <span className="text-2xl font-black leading-none">{finalCalc.level}</span>
                </div>
            </div>
        </header>

        <div className="flex-1 grid grid-cols-12 overflow-hidden">
            
            <div className="col-span-12 lg:col-span-5 bg-black flex flex-col relative border-r border-zinc-800">
                <div className="aspect-video w-full bg-black flex items-center justify-center border-b border-zinc-800 shadow-lg relative z-10">
                    <iframe src={player.videoUrl} className="w-full h-full" allowFullScreen />
                </div>

                <div className="bg-zinc-900 p-3 border-b border-zinc-800 flex justify-between items-center px-4">
                    <span className="text-xs text-zinc-500 font-mono">ID: {player.id}</span>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-zinc-300 hover:text-white hover:bg-zinc-800"
                        onClick={() => setShowCheatSheet(!showCheatSheet)}
                    >
                        <BookOpen className="w-4 h-4 mr-2" />
                        {showCheatSheet ? "Tutup Panduan" : "Buka Panduan Rubrik"}
                    </Button>
                </div>

                <div className="flex-1 bg-zinc-950 relative overflow-hidden flex flex-col">
                    {showCheatSheet ? (
                        <ScrollArea className="flex-1 p-6 animate-in slide-in-from-bottom-5 bg-zinc-950">
                            <h4 className="font-bold text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-wider sticky top-0 bg-zinc-950 pb-2 z-10">
                                <Info className="w-4 h-4 text-blue-400"/> Panduan Visual
                            </h4>
                            <div className="space-y-4 pb-10">
                                <CheatItem title="1. Grip" bad="Panci, kaku, bunyi bletak" good="Salaman, luwes, bunyi tring" />
                                <CheatItem title="2. Footwork" bad="Lari jogging, berat, diam" good="Geser (chasse), jinjit, ringan" />
                                <CheatItem title="3. Backhand" bad="Lari mutar badan, panik" good="Clear sampai belakang, santai" />
                                <CheatItem title="4. Attack" bad="Melambung keluar, nyangkut" good="Menukik tajam, bunyi ledakan" />
                                <CheatItem title="5. Defense" bad="Buang muka, raket ditaruh" good="Tembok, drive balik, tenang" />
                            </div>
                        </ScrollArea>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6">
                            
                            <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                                <button 
                                    onClick={() => setManualStatus('AUTO')}
                                    className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${manualStatus === 'AUTO' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                                >
                                    AUTO (Skor)
                                </button>
                                <button 
                                    onClick={() => setManualStatus('INVALID')}
                                    className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${manualStatus === 'INVALID' ? 'bg-red-600 text-white' : 'text-zinc-500 hover:text-red-400'}`}
                                >
                                    SET INVALID
                                </button>
                            </div>

                            {manualStatus === 'INVALID' || finalCalc.level === 'REJECTED' ? (
                                <div className="bg-red-950/50 border-2 border-red-600 p-8 rounded-2xl w-full max-w-sm text-center shadow-2xl shadow-red-900/20">
                                    <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
                                    <h3 className="text-3xl font-black text-white mb-2 tracking-tight">VIDEO DITOLAK</h3>
                                    <p className="text-red-200 font-medium text-sm">
                                        {manualStatus === 'INVALID' 
                                            ? "Dibatalkan secara manual oleh Verifikator (Cek Catatan)." 
                                            : `Skor ${finalCalc.total} terlalu tinggi (Joki/Atlet).`}
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-green-950/30 border-2 border-green-600 p-8 rounded-2xl w-full max-w-sm text-center shadow-2xl shadow-green-900/20">
                                    <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
                                    <h3 className="text-3xl font-black text-white mb-2 tracking-tight">VIDEO VALID</h3>
                                    <p className="text-green-200 font-medium text-sm">
                                        Level: {finalCalc.level}<br/>
                                        <span className="opacity-70 text-xs">{finalCalc.tier}</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className={`col-span-12 lg:col-span-7 bg-slate-50 flex flex-col h-full overflow-hidden border-l border-slate-200 shadow-xl z-10 text-slate-900 transition-opacity ${manualStatus === 'INVALID' ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-6 pt-4 bg-white border-b border-slate-200 shadow-sm z-10">
                        <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1">
                            <TabsTrigger value="visual" className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
                                I. Audit Visual (Skor 1-5)
                            </TabsTrigger>
                            <TabsTrigger value="bonus" className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
                                II. Skill Modifier (Bonus)
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <ScrollArea className="flex-1 p-6 lg:p-8 bg-slate-50">
                        <TabsContent value="visual" className="mt-0 space-y-6 pb-10">
                            <ScoreSlider label="1. Biomekanik (Grip)" desc="Apakah pegangan raket kaku (Panci) atau luwes (Salaman)?" val={scores.grip} setVal={(v) => setScores({...scores, grip: v})} />
                            <ScoreSlider label="2. Footwork (Kaki)" desc="Lari berat (Jogging) vs Langkah geser/jinjit (Chasse)?" val={scores.footwork} setVal={(v) => setScores({...scores, footwork: v})} />
                            <ScoreSlider label="3. Backhand (Kiri)" desc="Bisa clear lurus sampai belakang?" val={scores.backhand} setVal={(v) => setScores({...scores, backhand: v})} />
                            <ScoreSlider label="4. Attack (Smash)" desc="Power dan sudut tukikan smash." val={scores.attack} setVal={(v) => setScores({...scores, attack: v})} />
                            <ScoreSlider label="5. Defense (Bertahan)" desc="Tenang jadi tembok atau panik buang bola?" val={scores.defense} setVal={(v) => setScores({...scores, defense: v})} />
                            <ScoreSlider label="6. Game IQ (Rotasi)" desc="Saling mengisi posisi atau sering tabrakan?" val={scores.gameIq} setVal={(v) => setScores({...scores, gameIq: v})} />
                            <ScoreSlider label="7. Physique (Fisik)" desc="Stabil dari awal sampai akhir video?" val={scores.physique} setVal={(v) => setScores({...scores, physique: v})} />
                        </TabsContent>

                        <TabsContent value="bonus" className="mt-0 space-y-6 pb-10">
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-900 mb-6 flex gap-3 shadow-sm">
                                <AlertTriangle className="w-5 h-5 shrink-0 text-yellow-600" />
                                <div><strong>Instruksi:</strong> Centang hanya jika teknik terlihat jelas dan sukses minimal 1x.</div>
                            </div>
                            <SkillGroup title="A. Kelompok Serangan" icon={<Zap className="w-5 h-5 text-red-600"/>} items={[ {id: 'jumpingSmash', l: 'Jumping Smash (+3)'}, {id: 'stickSmash', l: 'Stick Smash (+3)'}, {id: 'backhandSmash', l: 'Backhand Smash (+4)'}, {id: 'netKill', l: 'Net Kill (+2)'}, {id: 'flickServe', l: 'Flick Serve (+2)'} ]} state={skills} setState={setSkills} />
                            <SkillGroup title="B. Kelompok Kontrol" icon={<Shield className="w-5 h-5 text-blue-600"/>} items={[ {id: 'spinningNet', l: 'Spinning Net (+3)'}, {id: 'crossNet', l: 'Cross Net (+3)'}, {id: 'backhandDrop', l: 'Backhand Drop (+3)'}, {id: 'backhandClear', l: 'Backhand Clear (+3)'}, {id: 'crossDefense', l: 'Cross Defense (+3)'} ]} state={skills} setState={setSkills} />
                            <SkillGroup title="C. IQ & Refleks" icon={<BrainCircuit className="w-5 h-5 text-purple-600"/>} items={[ {id: 'splitStep', l: 'Split Step (+4)'}, {id: 'divingDefense', l: 'Diving Defense (+3)'}, {id: 'deception', l: 'Deception (+4)'}, {id: 'intercept', l: 'Intercept (+3)'}, {id: 'judgement', l: 'Watch the Line (+2)'} ]} state={skills} setState={setSkills} />
                        </TabsContent>
                    </ScrollArea>

                    <div className="p-6 border-t border-slate-200 bg-white space-y-4 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
                        <div className="space-y-2">
                            <Label className="text-slate-900 font-bold">Catatan Verifikator {manualStatus === 'INVALID' && <span className="text-red-600">*</span>}</Label>
                            <Textarea 
                                placeholder={manualStatus === 'INVALID' ? "WAJIB DIISI: Alasan penolakan (Misal: Video terpotong, buram, tidak uncut)" : "Opsional. Contoh: 'Backhand smash di menit 02:15 sangat tajam.'"} 
                                value={notes} 
                                onChange={e => setNotes(e.target.value)} 
                                className="h-20 text-sm border-slate-300 focus:border-primary bg-slate-50 text-slate-900 placeholder:text-slate-400" 
                            />
                        </div>
                        <Button 
                            size="lg" 
                            className={`w-full text-lg font-bold h-14 shadow-lg transition-all ${
                                finalCalc.level === 'REJECTED' 
                                ? 'bg-red-600 hover:bg-red-700 text-white ring-2 ring-red-200' 
                                : 'bg-primary hover:bg-primary/90 ring-2 ring-primary/20'
                            }`}
                            onClick={handleSubmit}
                        >
                            {finalCalc.level === 'REJECTED' ? (
                                <><XCircle className="w-6 h-6 mr-2" /> KONFIRMASI TOLAK (INVALID)</>
                            ) : (
                                <><CheckCircle2 className="w-6 h-6 mr-2" /> KONFIRMASI: {finalCalc.level}</>
                            )}
                        </Button>
                    </div>
                </Tabs>
            </div>
        </div>
    </div>
  );
}

// SUB COMPONENTS
function ScoreSlider({ label, desc, val, setVal }: any) {
    return (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 transition-all hover:shadow-md hover:border-slate-300">
            <div className="flex justify-between items-center">
                <Label className="text-lg font-bold text-slate-900">{label}</Label>
                <Badge variant="outline" className="text-xl font-mono w-12 h-12 flex items-center justify-center bg-slate-100 text-slate-900 border-slate-300 rounded-lg shadow-inner">
                    {val}
                </Badge>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">{desc}</p>
            <Slider value={[val]} min={1} max={5} step={1} onValueChange={(v) => setVal(v[0])} className="py-2" />
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                <span>1. Buruk</span><span>3. Cukup</span><span>5. Sempurna</span>
            </div>
        </div>
    )
}

function SkillGroup({ title, icon, items, state, setState }: any) {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
            <h4 className="font-bold text-lg mb-4 flex items-center gap-3 text-slate-900 border-b border-slate-100 pb-3">
                {icon} {title}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {items.map((i: any) => (
                    <div key={i.id} 
                        className={`flex items-start space-x-3 p-3 rounded-lg border transition-all cursor-pointer ${state[i.id] ? 'bg-primary/5 border-primary/30' : 'bg-slate-50 border-transparent hover:bg-slate-100'}`}
                        onClick={() => setState({...state, [i.id]: !state[i.id]})}
                    >
                        <Checkbox 
                            id={i.id} 
                            checked={state[i.id] || false}
                            onCheckedChange={(c) => setState({...state, [i.id]: !!c})} 
                            className="mt-0.5 border-slate-400 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <label className="text-sm font-semibold cursor-pointer select-none leading-tight text-slate-700 hover:text-slate-900 pt-0.5">
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
        <div className="bg-zinc-800/80 p-3 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition-colors">
            <div className="font-bold text-blue-400 mb-2 text-xs uppercase tracking-wide">{title}</div>
            <div className="grid grid-cols-1 gap-1.5 text-[11px] text-zinc-300">
                <div className="flex gap-2 items-start"><span className="text-red-500 font-bold shrink-0">❌</span> <span>{bad}</span></div>
                <div className="flex gap-2 items-start"><span className="text-green-500 font-bold shrink-0">✅</span> <span>{good}</span></div>
            </div>
        </div>
    )
}