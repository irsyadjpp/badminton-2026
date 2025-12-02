
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, Check, X, Eye } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

// MOCK DATA - IN A REAL APP, THIS WOULD COME FROM useCollection
const mockProtests = [
  {
    id: "PROT001",
    teamName: "PB Super",
    opponentTeam: "PB Challenger",
    incidentTime: "2026-06-13T10:30:00",
    status: "PENDING",
    violationType: ["SANDBAGGING"]
  },
  {
    id: "PROT002",
    teamName: "Srikandi Smash",
    opponentTeam: "PB Galaxy",
    incidentTime: "2026-06-13T11:45:00",
    status: "ACCEPTED",
    violationType: ["JOKI"]
  },
  {
    id: "PROT003",
    teamName: "Mix Max",
    opponentTeam: "PB Starlight",
    incidentTime: "2026-06-14T09:15:00",
    status: "REJECTED",
    violationType: ["ADMINISTRASI"]
  },
];


export default function AdminProtestsPage() {
    
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold font-headline">Manajemen Protes</h2>
          <p className="text-muted-foreground">
            Tinjau dan putuskan protes yang diajukan oleh manajer tim.
          </p>
        </div>
         <Badge variant="outline" className="text-lg">
            {mockProtests.filter(p => p.status === 'PENDING').length} Protes Menunggu
        </Badge>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Daftar Protes Masuk</CardTitle>
            <CardDescription>Urutkan berdasarkan waktu kejadian terbaru.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Waktu Insiden</TableHead>
                        <TableHead>Tim Pelapor</TableHead>
                        <TableHead>Tim Terlapor</TableHead>
                        <TableHead>Jenis Pelanggaran</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockProtests.map(protest => (
                        <TableRow key={protest.id}>
                            <TableCell className="font-mono text-xs">
                                {format(new Date(protest.incidentTime), "dd MMM yyyy, HH:mm")}
                            </TableCell>
                            <TableCell className="font-medium">{protest.teamName}</TableCell>
                            <TableCell className="font-medium">{protest.opponentTeam}</TableCell>
                            <TableCell>
                                <div className="flex flex-col gap-1">
                                    {protest.violationType.map(v => (
                                        <Badge key={v} variant="secondary" className="w-fit">{v}</Badge>
                                    ))}
                                </div>
                            </TableCell>
                            <TableCell>
                                {protest.status === "PENDING" && <Badge className="bg-yellow-500/20 text-yellow-600 border border-yellow-500/30"><Clock className="w-3 h-3 mr-1" />Menunggu</Badge>}
                                {protest.status === "ACCEPTED" && <Badge className="bg-green-500/20 text-green-600 border border-green-500/30"><Check className="w-3 h-3 mr-1" />Diterima</Badge>}
                                {protest.status === "REJECTED" && <Badge className="bg-red-500/20 text-red-600 border border-red-500/30"><X className="w-3 h-3 mr-1" />Ditolak</Badge>}
                            </TableCell>
                             <TableCell className="text-right">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={`/admin/protests/${protest.id}`}>
                                        <Eye className="w-4 h-4 mr-2" /> Tinjau
                                    </Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
