
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, ArrowRight, AlertCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock Data Antrean Match
const PENDING_MATCHES = [
  { id: "M10", category: "MD Open", pA: "Kevin/Marcus", pB: "Hendra/Ahsan", conflict: false },
  { id: "M11", category: "WD Open", pA: "Greysia/Apri", pB: "Ribka/Fadia", conflict: false },
  { id: "M12", category: "XD Open", pA: "Praven/Melati", pB: "Dejan/Gloria", conflict: true }, // Simulasi bentrok jadwal
];

// Mock Data Wasit (Untuk Rotasi)
const UMPIRES = [
  { id: "U1", name: "Budi (Nasional)", status: "AVAILABLE", matchesCount: 2 },
  { id: "U2", name: "Siti (Provinsi)", status: "ON_DUTY", matchesCount: 3 },
  { id: "U3", name: "Agus (Daerah)", status: "AVAILABLE", matchesCount: 1 },
];

export default function MatchAssignmentPage() {
  const { toast } = useToast();
  const [courts, setCourts] = useState([
    { id: 1, status: "EMPTY", currentMatch: null, umpire: null },
    { id: 2, status: "LIVE", currentMatch: "M05", umpire: "Siti (Provinsi)" },
    { id: 3, status: "EMPTY", currentMatch: null, umpire: null },
  ]);

  const [selectedMatch, setSelectedMatch] = useState<string>("");
  const [selectedUmpire, setSelectedUmpire] = useState<string>("");

  const handleAssign = (courtId: number) => {
    if (!selectedMatch || !selectedUmpire) return toast({ title: "Error", description: "Pilih Pertandingan dan Wasit dulu!", variant: "destructive" });
    
    // Update State Lapangan
    const matchDetails = PENDING_MATCHES.find(m => m.id === selectedMatch);
    const umpireDetails = UMPIRES.find(u => u.id === selectedUmpire);

    setCourts(courts.map(c => c.id === courtId ? { 
        ...c, 
        status: "WARMUP", 
        currentMatch: `${matchDetails?.category}: ${matchDetails?.pA} vs ${matchDetails?.pB}`,
        umpire: umpireDetails?.name || ""
    } : c));

    toast({ title: "Tugas Diberikan", description: `Match ${selectedMatch} masuk Court ${courtId} dengan wasit ${umpireDetails?.name}` });
    
    // Reset Selection
    setSelectedMatch("");
    setSelectedUmpire("");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold font-headline text-primary">Match Control Desk</h2>
            <p className="text-muted-foreground">Alokasi Lapangan & Penugasan Wasit.</p>
        </div>
      </div>

      {/* DASHBOARD LAPANGAN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {courts.map((court) => (
            <Card key={court.id} className={`border-t-4 ${court.status === 'LIVE' ? 'border-t-green-500' : court.status === 'WARMUP' ? 'border-t-yellow-500' : 'border-t-gray-300'}`}>
                <CardHeader className="pb-2">
                    <div className="flex justify-between">
                        <CardTitle>COURT {court.id}</CardTitle>
                        <Badge variant="outline">{court.status}</Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    {court.status === 'EMPTY' ? (
                        <div className="space-y-3">
                            <div className="text-xs text-muted-foreground text-center py-2">Siap untuk pertandingan baru</div>
                            
                            {/* FORM ASSIGNMENT */}
                            <div className="space-y-2">
                                <Select onValueChange={setSelectedMatch}>
                                    <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Pilih Match..." /></SelectTrigger>
                                    <SelectContent>
                                        {PENDING_MATCHES.map(m => (
                                            <SelectItem key={m.id} value={m.id} disabled={m.conflict}>
                                                {m.conflict ? "⚠️ " : ""}{m.id} - {m.category} {m.conflict ? "(Bentrok)" : ""}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                
                                <Select onValueChange={setSelectedUmpire}>
                                    <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Pilih Wasit..." /></SelectTrigger>
                                    <SelectContent>
                                        {UMPIRES.map(u => (
                                            <SelectItem key={u.id} value={u.id} disabled={u.status === 'ON_DUTY'}>
                                                {u.name} (Load: {u.matchesCount})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Button size="sm" className="w-full bg-primary" onClick={() => handleAssign(court.id)}>
                                    Deploy ke Lapangan
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <p className="text-sm font-bold truncate">{court.currentMatch}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/20 p-2 rounded">
                                <Users className="w-3 h-3" /> Wasit: {court.umpire}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}

    