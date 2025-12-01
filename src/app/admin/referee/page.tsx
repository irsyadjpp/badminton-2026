'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const myMatches = [
  { id: 1, court: "Lapangan 1", time: "09:00", category: "MD Beginner", teamA: "PB Djarum KW", teamB: "PB Jaya Raya", status: "READY" },
  { id: 2, court: "Lapangan 1", time: "09:45", category: "XD Intermediate", teamA: "PB Exist", teamB: "PB Tangkas", status: "WAITING" },
];

export default function RefereeDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold font-headline">Halo, Wasit Budi</h2>
        <Badge variant="outline" className="text-lg px-3 py-1">Court 1</Badge>
      </div>

      <div className="grid gap-4">
        {myMatches.map((match) => (
          <Card key={match.id} className={`border-l-8 ${match.status === 'READY' ? 'border-l-green-500' : 'border-l-secondary'}`}>
            <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                    <Badge>{match.time}</Badge>
                    <span className="font-bold text-muted-foreground">{match.category}</span>
                </div>
                <div className="text-xl font-black font-headline flex items-center gap-4">
                    <span>{match.teamA}</span>
                    <span className="text-muted-foreground text-sm">VS</span>
                    <span>{match.teamB}</span>
                </div>
              </div>
              
              {match.status === 'READY' ? (
                  <Button size="lg" className="w-full md:w-auto bg-green-600 hover:bg-green-700" asChild>
                    <Link href={`/admin/referee/match/${match.id}`}>
                        <Play className="w-5 h-5 mr-2" /> Mulai Pertandingan
                    </Link>
                  </Button>
              ) : (
                  <Button variant="secondary" disabled>
                    <Clock className="w-4 h-4 mr-2" /> Menunggu
                  </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
