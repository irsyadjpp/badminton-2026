
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, Zap, Shield, BrainCircuit, 
  Info, CheckCircle2, XCircle, BookOpen, AlertTriangle, Loader2, ChevronUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getPlayerById, submitVerificationResult, type PlayerVerification } from "../../actions";
import { RUBRIC_GUIDELINES, ASSESSMENT_METHODS, COMPARISON_TABLE, RED_FLAGS } from "@/lib/tpf-data";
import { cn } from '@/lib/utils';


// Konstanta Bonus
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
  const [manualStatus, setManualStatus] = useState<'VALID' | 'INVALID'>('VALID');

  // Scoring State
  const [scores, setScores] = useState({
    grip: 1, footwork: 1, backhand: 1, attack: 1, defense: 1, gameIq: 1, physique: 1
  });
  const [skills, setSkills] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState("");
  const [finalCalc, setFinalCalc] = useState({ scoreA: 0, scoreB: 0, total: 0, level: "", tier: "", color: "" });

  // Fetch Data
  useEffect(() => {
    if (id) {
        getPlayerById(id).then((data) => {
            if (data) setPlayer(data);
            setLoading(false);
        });
    }
  }, [id]);

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
    let color = "bg-destructive text-destructive-foreground border-destructive/50";

    if (manualStatus === 'VALID') {
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
    }


    if (manualStatus === 'INVALID') {
        level = "REJECTED";
        tier = "Dibatalkan Manual (Invalid)";
        color = "bg-destructive text-destructive-foreground border-destructive/50";
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

  const isFormDisabled = finalCalc.level === 'REJECTED';

  if (loading) return <div className="flex h-full items-center justify-center bg-background"><Loader2 className="w-8 h-8 animate-spin"/></div>;
  if (!player) return <div className="flex h-full items-center justify-center text-red-500">Player Not Found</div>;

  return (
    <div className="space-y-4">
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => router.back()} className="h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl font-black font-headline text-foreground">
              {player.name}
            </h1>
            <p className="text-sm text-muted-foreground -mt-1">{player.team} | <span className="font-semibold text-primary">{player.category} (Klaim)</span></p>
          </div>
        </div>
        <div className={`flex items-center gap-4 px-4 py-1.5 rounded-lg shadow-sm border ${finalCalc.color}`}>
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
      </div>

      {/* --- MAIN LAYOUT: VERTICAL STACK --- */}
      
      {/* 1. VIDEO PLAYER (STICKY TOP) */}
      <div className="shrink-0 bg-black w-full relative group sticky top-[76px] z-10 rounded-lg overflow-hidden border shadow-lg">
        <iframe src={player.videoUrl} className="w-full aspect-video" allowFullScreen />
        
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
      </div>

      {/* 2. SCROLLABLE FORM AREA (BOTTOM) */}
      <div className="bg-card border rounded-lg p-1 mt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mx-auto max-w-lg">
            <TabsTrigger value="visual">Audit Visual</TabsTrigger>
            <TabsTrigger value="bonus">Skill Bonus</TabsTrigger>
            <TabsTrigger value="guide"><BookOpen className="w-4 h-4 mr-2"/>Panduan</TabsTrigger>
          </TabsList>

          <div className="p-6">
             <TabsContent value="visual" className="mt-0 space-y-6">
                <div className="flex justify-center mb-6">
                    <div className="inline-flex bg-background p-1 rounded-lg border shadow-sm">
                        <button onClick={() => setManualStatus('VALID')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${manualStatus === 'VALID' ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-secondary'}`}>
                            Video VALID
                        </button>
                        <button onClick={() => setManualStatus('INVALID')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${manualStatus === 'INVALID' ? 'bg-destructive text-white' : 'text-muted-foreground hover:bg-secondary'}`}>
                            Video INVALID
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ScoreSelector disabled={isFormDisabled} label="1. Biomekanik (Grip)" desc="Pegangan raket kaku (Panci) vs Luwes (Salaman)?" val={scores.grip} setVal={(v) => setScores({...scores, grip: v})} />
                  <ScoreSelector disabled={isFormDisabled} label="2. Footwork" desc="Lari berat vs Langkah geser/jinjit?" val={scores.footwork} setVal={(v) => setScores({...scores, footwork: v})} />
                  <ScoreSelector disabled={isFormDisabled} label="3. Backhand" desc="Panik vs Clear sampai belakang?" val={scores.backhand} setVal={(v) => setScores({...scores, backhand: v})} />
                  <ScoreSelector disabled={isFormDisabled} label="4. Attack Power" desc="Smash melambung vs Menukik tajam?" val={scores.attack} setVal={(v) => setScores({...scores, attack: v})} />
                  <ScoreSelector disabled={isFormDisabled} label="5. Defense" desc="Buang muka vs Tembok tenang?" val={scores.defense} setVal={(v) => setScores({...scores, defense: v})} />
                  <ScoreSelector disabled={isFormDisabled} label="6. Game IQ" desc="Tabrakan vs Saling mengisi rotasi?" val={scores.gameIq} setVal={(v) => setScores({...scores, gameIq: v})} />
                  <ScoreSelector disabled={isFormDisabled} label="7. Fisik" desc="Ngos-ngosan vs Stabil Explosif?" val={scores.physique} setVal={(v) => setScores({...scores, physique: v})} />
                </div>
            </TabsContent>
            <TabsContent value="bonus" className="mt-0 space-y-6">
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded text-sm text-yellow-300 flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /><span>Centang <strong>hanya jika</strong> teknik terlihat jelas & sukses minimal 1x.</span></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SkillGroup disabled={isFormDisabled} title="A. Serangan" icon={<Zap className="w-4 h-4 text-red-400"/>} items={[ {id: 'jumpingSmash', l: 'Jumping Smash (+3)'}, {id: 'stickSmash', l: 'Stick Smash (+3)'}, {id: 'backhandSmash', l: 'Backhand Smash (+4)'}, {id: 'netKill', l: 'Net Kill (+2)'}, {id: 'flickServe', l: 'Flick Serve (+2)'} ]} state={skills} setState={setSkills} />
                <SkillGroup disabled={isFormDisabled} title="B. Kontrol" icon={<Shield className="w-4 h-4 text-blue-400"/>} items={[ {id: 'spinningNet', l: 'Spinning Net (+3)'}, {id: 'crossNet', l: 'Cross Net (+3)'}, {id: 'backhandDrop', l: 'Backhand Drop (+3)'}, {id: 'backhandClear', l: 'Backhand Clear (+3)'}, {id: 'crossDefense', l: 'Cross Defense (+3)'} ]} state={skills} setState={setSkills} />
                <SkillGroup disabled={isFormDisabled} title="C. IQ & Refleks" icon={<BrainCircuit className="w-4 h-4 text-purple-400"/>} items={[ {id: 'splitStep', l: 'Split Step (+4)'}, {id: 'divingDefense', l: 'Diving Defense (+3)'}, {id: 'deception', l: 'Deception / Hold (+4)'}, {id: 'intercept', l: 'Intercept (+3)'}, {id: 'judgement', l: 'Watch Line (+2)'} ]} state={skills} setState={setSkills} />
              </div>
            </TabsContent>
            <TabsContent value="guide" className="mt-0 space-y-6 text-foreground">
              <div className="space-y-6">
                 <RubricItem title="PANDUAN VISUAL RUBRIK" data={RUBRIC_GUIDELINES} />
                 <MethodItem title="PETUNJUK TEKNIS PENILAIAN" data={ASSESSMENT_METHODS} />
                 <ComparisonTable title="TABEL PEMBANDING (CHEAT SHEET)" data={COMPARISON_TABLE} />
                 <RedFlagItem title="RED FLAG: TANDA SANDBAGGING" data={RED_FLAGS} />
              </div>
            </TabsContent>
          </div>
          
          <div className="p-4 border-t space-y-3">
            <Textarea placeholder={manualStatus === 'INVALID' ? "WAJIB ISI ALASAN..." : "Catatan tambahan (Opsional)..."} value={notes} onChange={e => setNotes(e.target.value)} className="h-16 text-sm bg-background" />
            <Button size="lg" className={`w-full text-lg font-bold h-12 shadow-lg transition-all ${isFormDisabled ? 'bg-destructive' : 'bg-primary'}`} onClick={handleSubmit}>
              {isFormDisabled ? <><XCircle className="w-6 h-6 mr-2" /> TOLAK (INVALID)</> : <><CheckCircle2 className="w-6 h-6 mr-2" /> TETAPKAN: {finalCalc.level}</>}
            </Button>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

// SUB COMPONENTS
function ScoreSelector({ label, desc, val, setVal, disabled }: any) {
  return (
    <div className={`bg-card p-4 rounded-xl border border-border shadow-sm space-y-4 transition-all ${disabled ? 'opacity-50 pointer-events-none' : 'hover:border-primary/30'}`}>
      <div>
        <Label className="text-base font-bold text-foreground">{label}</Label>
        <p className="text-xs text-muted-foreground mt-1 h-8">{desc}</p>
      </div>
      <div className="flex items-center justify-between bg-secondary/30 p-1 rounded-full">
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            onClick={() => setVal(score)}
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-full text-lg font-mono font-bold transition-all",
              val === score
                ? "bg-primary text-primary-foreground shadow-sm scale-110"
                : "text-muted-foreground hover:bg-secondary"
            )}
          >
            {score}
          </button>
        ))}
      </div>
    </div>
  );
}


function SkillGroup({ title, icon, items, state, setState, disabled }: any) {
  return (
    <div className={`bg-card p-5 rounded-xl border border-border shadow-sm ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <h4 className="font-bold text-base mb-4 flex items-center gap-2 text-foreground border-b pb-2">
        {icon} {title}
      </h4>
      <div className="space-y-3">
        {items.map((i: any) => (
          <div key={i.id} 
            className={`flex items-center space-x-3 p-2 rounded-lg border cursor-pointer transition-all ${state[i.id] ? 'bg-primary/5 border-primary/40' : `bg-secondary/20 border-transparent ${!disabled && 'hover:bg-secondary/50'}`}`}
            onClick={() => !disabled && setState({...state, [i.id]: !state[i.id]})}
          >
            <Checkbox 
              id={i.id} 
              checked={state[i.id] || false}
              onCheckedChange={(c) => !disabled && setState({...state, [i.id]: !!c})} 
              disabled={disabled}
              className="border-muted-foreground"
            />
            <label className={`text-sm font-semibold select-none leading-tight ${!disabled && 'cursor-pointer'}`}>
              {i.l}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

const SectionWrapper = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="mb-6">
    <h3 className="font-bold text-lg text-primary mb-3 border-l-4 border-primary pl-3">{title}</h3>
    {children}
  </div>
);

const RubricItem = ({ title, data }: { title: string, data: any[] }) => (
  <SectionWrapper title={title}>
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="p-4 bg-card rounded-lg border">
          <p className="font-semibold text-foreground mb-2">{item.title}</p>
          <ul className="space-y-1 text-xs text-muted-foreground">
            {item.scores.map((score: any, i: number) => (
              <li key={i}><strong>{score.score}:</strong> {score.desc}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </SectionWrapper>
);

const MethodItem = ({ title, data }: { title: string, data: any[] }) => (
  <SectionWrapper title={title}>
    {data.map((section, index) => (
      <div key={index} className="mb-4">
        <h4 className="font-semibold text-base text-accent-foreground mb-2">{section.title}</h4>
        <div className="space-y-3">
          {section.points.map((point: any, i: number) => (
            <div key={i} className="p-3 bg-card rounded-lg text-sm border">
              <p className="font-bold text-foreground">{point.subtitle}</p>
              <p className="text-xs text-muted-foreground">{point.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ))}
  </SectionWrapper>
);

const ComparisonTable = ({ title, data }: { title: string, data: any[] }) => (
  <SectionWrapper title={title}>
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-secondary/50">
            <th className="border p-2">Indikator</th>
            <th className="border p-2">Saat Audit Video (Layar)</th>
            <th className="border p-2">Saat di Lapangan (Mata)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="odd:bg-background even:bg-secondary/20">
              <td className="border p-2 font-bold text-foreground">{row.indicator}</td>
              <td className="border p-2 text-muted-foreground">{row.video_assessment}</td>
              <td className="border p-2 text-muted-foreground">{row.field_assessment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </SectionWrapper>
);

const RedFlagItem = ({ title, data }: { title: string, data: string[] }) => (
  <SectionWrapper title={title}>
    <ul className="space-y-2 list-disc pl-5 text-sm text-destructive/80">
      {data.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </SectionWrapper>
);

    