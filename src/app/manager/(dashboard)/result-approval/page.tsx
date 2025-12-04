
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Trophy, CheckCircle2, AlertTriangle, FilePenLine, Loader2 } from "lucide-react";
import { type TieResult } from "@/app/admin/matches/actions";
import { useToast } from '@/hooks/use-toast';

// --- MOCK DATA (SIMULASI DATA DARI DATABASE YANG PERLU PERSETUJUAN MANAJER) ---
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
  managerA_verified: false, // <-- Manager Tim A (kita) belum setuju
  managerB_verified: true, // <-- Manager Lawan sudah setuju
  referee_verified: false,
  status: 'DRAFT'
};
// -------------------------------------------------------------

export default function ManagerResultApprovalPage() {
  const { toast } = useToast();
  const [data, setData] = useState<TieResult | null>(MOCK_TIE_RESULT);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Anggap tim kita adalah Tim A
  const hasApproved = data?.managerA_verified;

  const handleApprove = async () => {
    if (!data) return;
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1500)); // Simulasi API call
    setData({...data, managerA_verified: true});
    setIsSubmitting(false);
    toast({
        title: "Hasil Disetujui!",
        description: "Persetujuan Anda telah dikirim ke Referee untuk pengesahan akhir.",
        className: "bg-green-600 text-white"
    });
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-10">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
        <h2 className="text-xl font-bold">Tidak Ada Hasil Pertandingan</h2>
        <p className="text-muted-foreground">Saat ini tidak ada berita acara yang memerlukan persetujuan Anda.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-black font-headline text-primary">Persetujuan Hasil</h1>
            <p className="text-muted-foreground">Review dan setujui berita acara pertandingan terakhir tim Anda.</p>
        </div>
      </div>

      <Card className="border-t-4 border-primary">
          <CardHeader className="bg-secondary/20">
              <CardTitle>ID Pertandingan: #{data.id}</CardTitle>
              <CardDescription>{data.round} • {new Date(data.date).toLocaleDateString('id-ID', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'})}</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
              <div className="text-center mb-6">
                  <div className="flex justify-center items-center gap-4 md:gap-8">
                      <div className="text-lg md:text-xl font-bold font-headline text-blue-600 text-right">{data.teamA}</div>
                      <div className="font-mono text-3xl md:text-5xl font-black">{data.finalScoreA} - {data.finalScoreB}</div>
                      <div className="text-lg md:text-xl font-bold font-headline text-red-600 text-left">{data.teamB}</div>
                  </div>
                  <div className="mt-2 flex items-center justify-center gap-2 text-yellow-600 font-bold">
                    <Trophy className="w-5 h-5"/> Pemenang: {data.winnerTeam}
                  </div>
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="details">
                  <AccordionTrigger className="text-muted-foreground font-semibold">Lihat Detail Setiap Partai</AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-4">
                    {data.matches.map((match, idx) => (
                      <div key={idx} className="p-4 bg-secondary/40 rounded-lg">
                        <div className="flex justify-between items-center">
                            <div className="space-y-0.5">
                                <p className="text-xs font-bold text-primary">{match.category}</p>
                                <p className="text-sm text-muted-foreground">({match.playerA1} / {match.playerA2}) vs ({match.playerB1} / {match.playerB2})</p>
                            </div>
                            <div className="text-right">
                                <p className="font-mono text-sm font-semibold">{match.score}</p>
                                <Badge className={`mt-1 ${match.winner === 'A' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                                    WIN: {match.winner}
                                </Badge>
                            </div>
                        </div>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
          </CardContent>
          <CardFooter className="p-4 bg-secondary/50 border-t">
              {hasApproved ? (
                  <div className="w-full flex items-center justify-center gap-2 text-green-600 font-semibold bg-green-50 p-4 rounded-lg border border-green-200">
                    <CheckCircle2 className="w-5 h-5"/> Anda Telah Menyetujui Hasil Ini. Menunggu Pengesahan Referee.
                  </div>
              ) : (
                <div className="w-full space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    <AlertTriangle className="w-5 h-5 mt-1 shrink-0"/>
                    <div>
                        <h4 className="font-bold">Tindakan Diperlukan</h4>
                        <p className="text-sm text-red-800/80">Periksa kembali detail di atas. Jika sudah sesuai, klik tombol 'Setuju & Kunci Hasil' di bawah. Keputusan ini final dan tidak dapat diubah.</p>
                    </div>
                  </div>
                  <Button 
                    className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90"
                    onClick={handleApprove}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin"/> : <><FilePenLine className="w-6 h-6 mr-2"/> Setujui & Kunci Hasil</>}
                  </Button>
                </div>
              )}
          </CardFooter>
      </Card>
    </div>
  );
}
