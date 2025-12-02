
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Youtube, Video, AlertCircle, Save, Check, X, User, Users, Calendar, Clock, MapPin, ListNumbers, ShieldQuestion } from 'lucide-react';

// MOCK DATA - In a real app, this would be fetched from useDoc based on params.id
const mockProtest = {
    id: "PROT001",
    managerName: "Rizki Karami",
    teamName: "PB Super",
    managerWhatsapp: "081119522228",
    category: "Putra",
    incidentTime: "10:30",
    courtNumber: "3",
    partaiNumber: 3,
    opponentTeam: "PB Challenger",
    opponentPlayer: "Pemain Curang",
    violationType: ["SANDBAGGING", "JOKI"],
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    videoUrl: "", // Assuming no direct upload for this mock
    additionalEvidence: "Pemain lawan memiliki power smash dan footwork selevel pemain nasional, sangat tidak sesuai dengan level beginner yang diklaim. Wajahnya juga tampak berbeda dari foto di aplikasi Ayo Indonesia.",
    status: "PENDING",
    createdAt: "2026-06-13T10:35:00",
    decisionNotes: ""
};

export default function ProtestDetailPage() {
  const params = useParams();
  const [status, setStatus] = useState(mockProtest.status);
  const [notes, setNotes] = useState(mockProtest.decisionNotes);

  const handleSaveDecision = () => {
    // In a real app, this would be a server action:
    // updateProtestDecision(params.id, { status, decisionNotes: notes });
    console.log("Saving decision:", { id: params.id, status, notes });
    alert("Keputusan berhasil disimpan (simulasi).");
  };

  return (
    <div className="space-y-6">
       <div>
          <h2 className="text-3xl font-bold font-headline">Tinjau Protes #{params.id}</h2>
          <p className="text-muted-foreground">
            Periksa bukti, buat keputusan, dan berikan catatan untuk manajer tim.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Content (Left/Center) */}
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Detail Laporan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div><p className="text-muted-foreground text-xs">Pelapor</p><p className="font-bold flex items-center gap-1"><User size={14}/>{mockProtest.managerName}</p></div>
                            <div><p className="text-muted-foreground text-xs">Tim Pelapor</p><p className="font-bold flex items-center gap-1"><Users size={14}/>{mockProtest.teamName}</p></div>
                            <div><p className="text-muted-foreground text-xs">Waktu Insiden</p><p className="font-bold flex items-center gap-1"><Clock size={14}/>{mockProtest.incidentTime}</p></div>
                            <div><p className="text-muted-foreground text-xs">Kategori</p><p className="font-bold">{mockProtest.category}</p></div>
                            <div><p className="text-muted-foreground text-xs">Lapangan</p><p className="font-bold flex items-center gap-1"><MapPin size={14}/>{mockProtest.courtNumber}</p></div>
                            <div><p className="text-muted-foreground text-xs">Partai Ke-</p><p className="font-bold flex items-center gap-1"><ListNumbers size={14}/>{mockProtest.partaiNumber}</p></div>
                       </div>
                       <div className="border-t pt-4">
                            <p className="text-muted-foreground text-xs">Jenis Pelanggaran</p>
                            <div className="flex gap-2 mt-1">
                                {mockProtest.violationType.map(v => <Badge key={v} variant="destructive">{v}</Badge>)}
                            </div>
                       </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Bukti & Keterangan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Keterangan Teks */}
                        <div>
                            <h4 className="font-semibold mb-2">Keterangan dari Manajer:</h4>
                            <blockquote className="border-l-4 pl-4 text-muted-foreground italic">
                                {mockProtest.additionalEvidence}
                            </blockquote>
                        </div>

                        {/* Bukti Video */}
                        {(mockProtest.youtubeUrl || mockProtest.videoUrl) && (
                            <div className="border-t pt-6">
                                <h4 className="font-semibold mb-3">Bukti Video:</h4>
                                {mockProtest.youtubeUrl && (
                                     <Button asChild variant="outline">
                                        <a href={mockProtest.youtubeUrl} target="_blank" rel="noopener noreferrer">
                                            <Youtube className="w-4 h-4 mr-2 text-red-500" /> Buka Link YouTube
                                        </a>
                                    </Button>
                                )}
                                {mockProtest.videoUrl && (
                                     <Button asChild variant="outline" className="ml-2">
                                        <a href={mockProtest.videoUrl} target="_blank" rel="noopener noreferrer">
                                            <Video className="w-4 h-4 mr-2 text-blue-500" /> Buka File Video
                                        </a>
                                    </Button>
                                )}
                            </div>
                        )}
                         {!mockProtest.youtubeUrl && !mockProtest.videoUrl && (
                            <p className="text-sm text-center py-4 bg-secondary rounded-md text-muted-foreground">Tidak ada bukti video yang dilampirkan.</p>
                         )}

                    </CardContent>
                </Card>
            </div>

            {/* Decision Panel (Right) */}
            <div className="lg:col-span-1">
                 <Card className="sticky top-24 border-2 border-primary/30 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                            <ShieldQuestion size={20} />
                            Panel Keputusan
                        </CardTitle>
                        <CardDescription>Keputusan yang diambil bersifat final dan tidak dapat diganggu gugat.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <Label className="font-bold">Status Protes</Label>
                            <RadioGroup value={status} onValueChange={setStatus} className="flex flex-col gap-2">
                                <Label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-background has-[[data-state=checked]]:border-green-500 has-[[data-state=checked]]:bg-green-500/10">
                                    <RadioGroupItem value="ACCEPTED" id="s-accept" />
                                    <Check className="w-4 h-4 text-green-600"/>
                                    <span className="font-semibold text-green-700">Diterima (Accepted)</span>
                                </Label>
                                <Label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-background has-[[data-state=checked]]:border-red-500 has-[[data-state=checked]]:bg-red-500/10">
                                    <RadioGroupItem value="REJECTED" id="s-reject" />
                                    <X className="w-4 h-4 text-red-600"/>
                                    <span className="font-semibold text-red-700">Ditolak (Rejected)</span>
                                </Label>
                            </RadioGroup>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="decision-notes" className="font-bold">Catatan Keputusan (untuk Manajer)</Label>
                            <Textarea 
                                id="decision-notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Contoh: Setelah meninjau video, TPF memutuskan skill pemain sesuai dengan level Intermediate. Protes ditolak, uang jaminan hangus." 
                                rows={5}
                            />
                        </div>
                        <Button className="w-full h-12 text-lg" onClick={handleSaveDecision}>
                            <Save className="w-5 h-5 mr-2" /> Simpan Keputusan
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
