
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { MoreHorizontal, PlusCircle, Trash2, Edit, GraduationCap, Briefcase, UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { getCommitteeRoster, addCommitteeMember, updateCommitteeMember, deleteCommitteeMember } from './actions';
import { type CommitteeMember, committeeMemberSchema } from '@/lib/schemas/committee';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VOLUNTEER_DIVISIONS } from '@/lib/schemas/volunteer';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

export default function RosterPage() {
  const { toast } = useToast();
  const [roster, setRoster] = useState<CommitteeMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<CommitteeMember | null>(null);

  const form = useForm<CommitteeMember>({
    resolver: zodResolver(committeeMemberSchema),
    defaultValues: {
        name: "",
        phone: "",
        email: "",
        expertise: "",
        photoUrl: "",
        education: undefined,
        status: undefined,
        division1: undefined,
        division2: undefined,
        reason: ""
    },
  });

  const loadRoster = async () => {
    setIsLoading(true);
    const data = await getCommitteeRoster();
    setRoster(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadRoster();
  }, []);

  const handleOpenModal = (member: CommitteeMember | null = null) => {
    setEditingMember(member);
    form.reset(member || { 
        name: "", phone: "", email: "", expertise: "", photoUrl: "",
        education: undefined, status: undefined, division1: undefined, division2: undefined, reason: ""
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: CommitteeMember) => {
    const action = editingMember ? updateCommitteeMember(editingMember.id!, data) : addCommitteeMember(data);
    const result = await action;
    
    toast({
        title: result.success ? "Sukses!" : "Gagal",
        description: result.message,
        variant: result.success ? "default" : "destructive",
        className: result.success ? "bg-green-600 text-white" : ""
    });

    if (result.success) {
        setIsModalOpen(false);
        loadRoster(); // Refresh data
    }
  };
  
  const handleDelete = async (id: string) => {
      if(confirm("Yakin ingin menghapus anggota ini dari roster? Tindakan ini tidak bisa dibatalkan.")){
          const result = await deleteCommitteeMember(id);
          toast({
            title: result.success ? "Terhapus" : "Gagal",
            description: result.message,
          });
          if(result.success) loadRoster();
      }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold font-headline">Master Roster Panitia</h2>
            <p className="text-muted-foreground">Database pusat untuk semua anggota tim inti dan pelaksana.</p>
        </div>
        <Button onClick={() => handleOpenModal(null)}>
            <PlusCircle className="w-4 h-4 mr-2" /> Tambah Anggota
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nama Personil</TableHead>
                        <TableHead>Informasi Personal</TableHead>
                        <TableHead>Posisi Pilihan</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        Array.from({length: 5}).map((_, i) => (
                            <TableRow key={i}><TableCell colSpan={4}><div className="h-10 bg-secondary/50 animate-pulse rounded-md"/></TableCell></TableRow>
                        ))
                    ) : roster.length === 0 ? (
                        <TableRow><TableCell colSpan={4} className="text-center h-24">Belum ada anggota di roster.</TableCell></TableRow>
                    ) : (
                        roster.map((member) => (
                        <TableRow key={member.id}>
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={member.photoUrl} alt={member.name} />
                                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p>{member.name}</p>
                                      <p className="text-xs text-muted-foreground">{member.expertise}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-xs space-y-1">
                                <div className="flex items-center gap-2"><Briefcase className="w-3 h-3 text-muted-foreground" /> {member.status || "N/A"}</div>
                                <div className="flex items-center gap-2"><GraduationCap className="w-3 h-3 text-muted-foreground" /> {member.education || "N/A"}</div>
                            </TableCell>
                            <TableCell className="text-xs space-y-1">
                                <p><span className="font-bold">P1:</span> {member.division1?.split(':')[0]}</p>
                                <p className="text-muted-foreground"><span className="font-bold">P2:</span> {member.division2?.split(':')[0]}</p>
                            </TableCell>
                            <TableCell className="text-right">
                               <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link href={`/admin/director/roster/${member.id}`}><UserRound className="w-4 h-4 mr-2"/> Lihat Detail</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleOpenModal(member)}><Edit className="w-4 h-4 mr-2"/> Edit Data</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDelete(member.id!)} className="text-destructive"><Trash2 className="w-4 h-4 mr-2"/> Hapus</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
      
      {/* MODAL TAMBAH/EDIT */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle>{editingMember ? 'Edit Data Anggota' : 'Tambah Anggota Baru'}</DialogTitle>
                <DialogDescription>
                    {editingMember ? `Perbarui detail untuk ${editingMember.name}.` : "Masukkan detail anggota baru ke dalam roster."}
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2 max-h-[70vh] overflow-y-auto px-1">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Nama Lengkap</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="expertise" render={({ field }) => (
                        <FormItem><FormLabel>Keahlian Utama</FormLabel><FormControl><Input placeholder="Contoh: Keuangan, Media, IT" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="phone" render={({ field }) => (
                          <FormItem><FormLabel>No. Telepon (WhatsApp)</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="email" render={({ field }) => (
                          <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>

                     <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="education" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pendidikan Terakhir</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Pilih..." /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="SMA/SMK">SMA / SMK / Sederajat</SelectItem>
                                        <SelectItem value="Diploma">Diploma (D3 / D4)</SelectItem>
                                        <SelectItem value="S1">Sarjana (S1)</SelectItem>
                                        <SelectItem value="Pascasarjana">Pascasarjana</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="status" render={({ field }) => (
                             <FormItem>
                                <FormLabel>Status Saat Ini</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Pilih..."/></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {["Mahasiswa Aktif", "Fresh Graduate (Belum Bekerja)", "Karyawan / Profesional", "Freelancer / Wirausaha"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                             </FormItem>
                        )} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <FormField control={form.control} name="division1" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pilihan Divisi 1 (Prioritas)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Pilih..." /></SelectTrigger></FormControl>
                                    <SelectContent>{VOLUNTEER_DIVISIONS.map(d => <SelectItem key={d} value={d}>{d.split(':')[0]}</SelectItem>)}</SelectContent>
                                </Select>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="division2" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pilihan Divisi 2 (Cadangan)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Pilih..." /></SelectTrigger></FormControl>
                                    <SelectContent>{VOLUNTEER_DIVISIONS.map(d => <SelectItem key={d} value={d}>{d.split(':')[0]}</SelectItem>)}</SelectContent>
                                </Select>
                            </FormItem>
                        )} />
                    </div>

                    <FormField control={form.control} name="reason" render={({ field }) => (
                        <FormItem><FormLabel>Alasan Bergabung / Motivasi</FormLabel><FormControl><Textarea placeholder="Kenapa Anda tertarik menjadi panitia BCC 2026?" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />

                    <FormField control={form.control} name="photoUrl" render={({ field }) => (
                        <FormItem><FormLabel>URL Foto Profil</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />

                    <DialogFooter className="pt-4 sticky bottom-0 bg-background/90 py-4">
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? "Menyimpan..." : "Simpan Data"}
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

    