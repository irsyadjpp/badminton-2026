
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, CheckCircle2, Loader2, FilePenLine, AlertTriangle } from "lucide-react";
import { type TieResult, type MatchParty } from "../actions";
import { useToast } from '@/hooks/use-toast';

// --- MOCK DATA (SIMULASI DATA YANG DITARIK DARI DATABASE) ---
const MOCK_TIE_RESULT: TieResult = {
  id: "TIE-1720684800",
  date: "2026-06-14",
  court: "1",
  round: "Penyisihan Grup A",
  teamA: "PB Djarum KW",
  teamB: "PB Jaya Raya",
  matches: [
    { id: 1, category: "MD BEGINNER 1", playerA1: "Budi Santoso", playerA2: "Andi Saputra", playerB1: "Rian Ardianto", playerB2: "Fajar Alfian", score: "21-19, 21-18", winner: 'A' },
    { id: 2, category: "MD INTERMEDIATE 1", playerA1: "Kevin Sanjaya KW", playerA2: "Marcus Gideon KW", playerB1: "Hendra Setiawan KW", playerB2: "M. Ahsan KW", score: "18-21, 22-20, 21-19", winner: 'A' },
    { id: 3, category: "MD ADVANCE", playerA1: "Anthony Ginting KW", playerA2: "J. Christie KW", playerB1: "Viktor Axelsen KW", playerB2: "Lee Zii Jia KW", score: "15-21, 12-21", winner: 'B' },
    { id: 4, category: "MD INTERMEDIATE 2", playerA1: "Bagas Maulana KW", playerA2: "M. S. Fikri KW", playerB1: "Leo R. Carnando KW", playerB2: "Daniel Marthin KW", score: "21-17, 21-19", winner: 'A' },
    { id: 5, category: "MD BEGINNER 2", playerA1: "Rahmat Hidayat KW", playerA2: "Yeremia Rambitan KW", playerB1: "Pramudya K. KW", playerB2: "Rehan Naufal KW", score: "19-21, 21-23", winner: 'B' },
  ],
  finalScoreA: 3,
  finalScoreB: 2,
  winnerTeam: "PB Djarum KW",
  managerA_verified: true, // Manager A sudah setuju
  managerB_verified: false, // Manager B belum
  referee_verified: false, // Wasit belum
  status: 'DRAFT'
};
// -------------------------------------------------------------


export default function RefereeResultSheetPage() {
  const { toast } = useToast();
  const [data, setData] = useState<TieResult>(MOCK_TIE_RESULT);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRefereeVerification = async () => {
    if (!data.managerA_verified || !data.managerB_verified) {
        toast({
            title: "Verifikasi Gagal",
            description: "Kedua manajer tim harus menyetujui hasil terlebih dahulu sebelum wasit bisa mengesahkan.",
            variant: "destructive"
        });
        return;
    }
    
    setIsSubmitting(true);
    // Di sini akan ada panggilan ke server action
    await new Promise(r => setTimeout(r, 1500));
    setData({...data, referee_verified: true, status: 'FINAL'});
    setIsSubmitting(false);

    toast({
        title: "Disahkan!",
        description: "Berita Acara telah dikunci dan disimpan secara permanen.",
        className: "bg-green-600 text-white"
    });
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER & OPSI CETAK */}
      <div className="flex justify-between items-center print:hidden">
        <div>
            <h1 className="text-3xl font-black font-headline text-primary">Verifikasi Berita Acara</h1>
            <p className="text-muted-foreground">Review hasil yang diinput dan sahkan jika semua data sudah benar.</p>
        </div>
      </div>
      
      {data.status === 'FINAL' && (
        <Card className="bg-green-50 border-green-600 border-l-4">
            <CardContent className="p-4 flex items-center justify-center gap-3 text-green-700 font-bold">
                <CheckCircle2 className="w-5 h-5"/>
                Hasil pertandingan ini sudah FINAL dan telah diarsipkan.
            </CardContent>
        </Card>
      )}

      {/* TAMPILAN LAPORAN */}
      <div className="p-0 md:p-8 bg-card border rounded-lg print:p-0 print:border-none print:shadow-none">
        
        {/* --- KARTU IDENTITAS PERTANDINGAN --- */}
        <Card className="mb-6 border-border">
            <CardHeader className="bg-secondary/20">
                <CardTitle>ID Pertandingan: #{data.id}</CardTitle>
                <CardDescription>{data.round} • Lapangan {data.court} • {new Date(data.date).toLocaleDateString('id-ID', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'})}</CardDescription>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-3 items-center text-center">
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Tim A</p>
                    <p className="text-xl font-bold font-headline text-blue-600">{data.teamA}</p>
                </div>
                <div className="font-mono text-2xl md:text-4xl font-black text-muted-foreground">VS</div>
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Tim B</p>
                    <p className="text-xl font-bold font-headline text-red-600">{data.teamB}</p>
                </div>
            </CardContent>
        </Card>

        {/* --- DAFTAR PARTAI --- */}
        <Card className="mb-6">
            <CardHeader><CardTitle>Rincian Hasil Partai</CardTitle></CardHeader>
            <CardContent>
                <Accordion type="multiple" defaultValue={['item-0','item-1','item-2','item-3','item-4']} className="w-full">
                    {data.matches.map((match, idx) => (
                        <AccordionItem key={match.id} value={`item-${idx}`}>
                            <AccordionTrigger className="hover:no-underline bg-secondary/20 px-4 rounded-md mb-2">
                                <div className="flex justify-between w-full items-center pr-4">
                                    <span className="font-bold text-sm text-primary">PARTAI {idx + 1}: {match.category}</span>
                                    <Badge className={match.winner === 'A' ? 'bg-blue-600' : 'bg-red-600'}>
                                        WIN: TIM {match.winner}
                                    </Badge>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 py-4 border rounded-lg -mt-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="text-sm"><p className="font-bold mb-2 text-blue-700">Pemain Tim A:</p><p className="text-muted-foreground">{match.playerA1} / {match.playerA2}</p></div>
                                    <div className="text-sm"><p className="font-bold mb-2 text-red-700">Pemain Tim B:</p><p className="text-muted-foreground">{match.playerB1} / {match.playerB2}</p></div>
                                </div>
                                <div className="mt-4 pt-4 border-t text-center"><p className="text-xs text-muted-foreground">Skor</p><p className="font-mono text-lg font-semibold">{match.score}</p></div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>

        {/* --- HASIL AKHIR & VERIFIKASI --- */}
        <Card className="bg-zinc-900 text-white border-none shadow-xl">
            <CardContent className="p-6 md:p-8 space-y-6">
                <div className="text-center">
                    <p className="text-sm text-zinc-400 uppercase tracking-widest mb-2">Hasil Akhir (Tie Score)</p>
                    <div className="text-6xl font-black font-mono flex justify-center items-center gap-4">
                        <span className="text-blue-400">{data.finalScoreA}</span>
                        <span className="text-zinc-600">-</span>
                        <span className="text-red-400">{data.finalScoreB}</span>
                    </div>
                     <div className="mt-4 flex items-center justify-center gap-2 text-yellow-400 text-xl font-bold">
                        <Trophy className="w-6 h-6" />
                        Pemenang: {data.winnerTeam}
                    </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                    <h4 className="font-bold text-sm text-center uppercase tracking-wider mb-4 text-zinc-400">
                        Status Verifikasi Digital
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                          { label: "Manajer Tim A", verified: data.managerA_verified },
                          { label: "Manajer Tim B", verified: data.managerB_verified },
                          { label: "Referee/Match Control", verified: data.referee_verified },
                        ].map(v => (
                            <div key={v.label} className={`flex items-center gap-3 p-3 rounded-lg border ${v.verified ? "bg-green-500/10 border-green-500/20 text-green-300" : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"}`}>
                                {v.verified ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0"/>}
                                <div>
                                    <p className="text-sm font-bold">{v.label}</p>
                                    <p className="text-xs">{v.verified ? "Telah Menyetujui" : "Menunggu Persetujuan"}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {data.status !== 'FINAL' && (
                    <div className="pt-6 border-t border-white/10">
                        <Button 
                            className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90"
                            onClick={handleRefereeVerification}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin"/> : <><FilePenLine className="w-6 h-6 mr-2"/>SAHKAN SEBAGAI REFEREE</>}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
