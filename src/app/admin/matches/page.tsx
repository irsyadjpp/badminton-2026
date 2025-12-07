
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CalendarPlus, Trash2, RefreshCw } from "lucide-react";
import { getMatches, createMatch, deleteMatch, type Match } from "./actions";
import { useToast } from "@/hooks/use-toast";

export default function MasterMatchPage() {
  const { toast } = useToast();
  const [matches, setMatches] = useState<Match[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load Data
  useEffect(() => { load() }, []);
  
  const load = async () => {
    const data = await getMatches();
    setMatches(data);
  };

  const handleCreate = async (formData: FormData) => {
    await createMatch(formData);
    toast({ title: "Jadwal Dibuat", description: "Pertandingan masuk ke database." });
    setIsOpen(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Hapus jadwal ini?")) return;
    await deleteMatch(id);
    toast({ title: "Terhapus", variant: "destructive" });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold font-headline">Master Jadwal Pertandingan</h2>
            <p className="text-muted-foreground">Database seluruh pertandingan BCC 2026.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary"><CalendarPlus className="mr-2 h-4 w-4"/> Buat Match Baru</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Jadwal Baru</DialogTitle></DialogHeader>
                <form action={handleCreate} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Select name="category" required defaultValue="MD Open">
                            <SelectTrigger><SelectValue placeholder="Kategori" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="MD Open">Ganda Putra (MD)</SelectItem>
                                <SelectItem value="XD Open">Ganda Campuran (XD)</SelectItem>
                                <SelectItem value="Beginner">Pemula</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input name="time" type="time" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4 items-center">
                        <Input name="playerA" placeholder="Pasangan A (Cth: Kevin/Marcus)" required />
                        <div className="text-center font-bold">VS</div>
                        <Input name="playerB" placeholder="Pasangan B (Cth: Ahsan/Hendra)" required />
                    </div>
                    <div className="space-y-2">
                        <Input name="court" placeholder="Rencana Court (Opsional)" />
                    </div>
                    <Button type="submit" className="w-full">Simpan Jadwal</Button>
                </form>
            </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Matchup</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {matches.map((m) => (
                    <TableRow key={m.id}>
                        <TableCell className="font-mono text-xs text-muted-foreground">{m.id}</TableCell>
                        <TableCell>{m.time}</TableCell>
                        <TableCell><Badge variant="outline">{m.category}</Badge></TableCell>
                        <TableCell className="font-medium">
                            {m.playerA} <span className="text-red-500 font-bold mx-1">vs</span> {m.playerB}
                        </TableCell>
                        <TableCell>
                            <Badge className={m.status === 'LIVE' ? 'bg-red-600 animate-pulse' : 'bg-gray-500'}>
                                {m.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(m.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                <Trash2 className="w-4 h-4"/>
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </div>
    </div>
  );
}
