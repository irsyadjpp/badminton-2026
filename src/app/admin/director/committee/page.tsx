
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Save, Users, RefreshCw, UserPlus, Trash2, UserCog } from "lucide-react";
import { getCommitteeStructure, updateCommitteeStructure } from "./actions";
import { type CommitteeDivision } from '@/lib/committee-data';
import { useToast } from "@/hooks/use-toast";
import { INITIAL_COMMITTEE_STRUCTURE } from '@/lib/committee-data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export default function CommitteeManagementPage() {
  const { toast } = useToast();
  const [divisions, setDivisions] = useState<CommitteeDivision[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // MOCK MASTER ROSTER - Nanti ini akan di-fetch dari actions
  const masterRoster = [
      { id: "irsyad_j", name: "Irsyad Jamal Pratama Putra" },
      { id: "rizki_k", name: "Rizki Karami" },
      { id: "annisa_s", name: "Annisa Syafira" },
      { id: "selvi_y", name: "Selvi Yulia" },
      // ...tambahkan semua panitia lain di sini
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const data = await getCommitteeStructure();
    setDivisions(data);
    setIsLoading(false);
  };
  
  const resetData = () => {
      setDivisions(JSON.parse(JSON.stringify(INITIAL_COMMITTEE_STRUCTURE)));
      toast({
          title: "Struktur Direset",
          description: "Data kembali ke susunan awal.",
      })
  }

  // Update nama personil
  const handleMemberChange = (divIndex: number, memberIndex: number, field: 'name' | 'position' | 'id', value: string) => {
    const newDivisions = [...divisions];
    
    // Jika field yang diubah adalah 'name', update juga ID nya dari master roster
    let memberData = { ...newDivisions[divIndex].members[memberIndex], [field]: value };
    if (field === 'name') {
        const selectedPerson = masterRoster.find(p => p.name === value);
        memberData.id = selectedPerson?.id;
    }
    
    newDivisions[divIndex].members[memberIndex] = memberData;
    setDivisions(newDivisions);
  };

  const addMember = (divIndex: number) => {
    const newDivisions = [...divisions];
    newDivisions[divIndex].members.push({ position: "Posisi Baru", name: "" });
    setDivisions(newDivisions);
  };

  const removeMember = (divIndex: number, memberIndex: number) => {
    if (confirm("Yakin ingin menghapus posisi ini dari struktur?")) {
        const newDivisions = [...divisions];
        newDivisions[divIndex].members.splice(memberIndex, 1);
        setDivisions(newDivisions);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const res = await updateCommitteeStructure(divisions);
    setIsSaving(false);
    toast({ 
        title: "Struktur Disimpan", 
        description: res.message,
        className: "bg-green-600 text-white"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold font-headline text-primary">Struktur & Penugasan Panitia</h2>
            <p className="text-muted-foreground">Assign personil dari Master Roster ke posisi yang tersedia.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" onClick={resetData}>
                <RefreshCw className="w-4 h-4 mr-2" /> Reset
            </Button>
            <Button onClick={handleSave} disabled={isSaving || isLoading} className="bg-primary">
                <Save className="w-4 h-4 mr-2" /> {isSaving ? "Menyimpan..." : "Simpan Penugasan"}
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
            Array.from({length: 5}).map((_, i) => (
                <Card key={i}><CardContent className="p-4 space-y-2"><div className="h-8 w-1/2 bg-secondary/50 rounded animate-pulse"/><div className="h-10 w-full bg-secondary/50 rounded animate-pulse"/><div className="h-10 w-full bg-secondary/50 rounded animate-pulse"/></CardContent></Card>
            ))
        ) : (
            divisions.map((div, divIdx) => (
              <Card key={div.id} className="border-t-4 border-t-secondary">
                <CardHeader className="bg-secondary/5 pb-3">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        {div.title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                    {div.members.map((member, memIdx) => (
                        <div key={memIdx} className="grid grid-cols-12 gap-3 items-end">
                            <div className="col-span-5 space-y-1">
                                <Label className="text-xs text-muted-foreground">Jabatan</Label>
                                <p className="font-semibold text-sm h-8 flex items-center">{member.position}</p>
                            </div>
                            <div className="col-span-6 space-y-1">
                                <Label className="text-xs text-muted-foreground">Nama Personil</Label>
                                <Select 
                                    value={member.name} 
                                    onValueChange={(value) => handleMemberChange(divIdx, memIdx, 'name', value)}
                                >
                                    <SelectTrigger className="h-8">
                                        <SelectValue placeholder="Pilih Personil..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">-- Kosongkan --</SelectItem>
                                        {masterRoster.map(person => (
                                            <SelectItem key={person.id} value={person.name}>{person.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="col-span-1">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-destructive hover:bg-destructive/10 invisible" // Tombol hapus disembunyikan untuk mencegah perubahan struktur
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
              </Card>
            ))
        )}
      </div>
    </div>
  );
}
