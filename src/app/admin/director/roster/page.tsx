
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { MoreHorizontal, PlusCircle, Trash2, Edit } from "lucide-react";
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
import { getCommitteeRoster, addCommitteeMember, updateCommitteeMember, deleteCommitteeMember, type CommitteeMember, committeeMemberSchema } from './actions';

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
    form.reset(member || { name: "", phone: "", email: "", expertise: "", photoUrl: "" });
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
                        <TableHead>Keahlian</TableHead>
                        <TableHead>Kontak</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        Array.from({length: 3}).map((_, i) => (
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
                                    {member.name}
                                </div>
                            </TableCell>
                            <TableCell><Badge variant="outline">{member.expertise}</Badge></TableCell>
                            <TableCell>
                                <div className="text-xs">{member.email}</div>
                                <div className="text-xs text-muted-foreground">{member.phone}</div>
                            </TableCell>
                            <TableCell className="text-right">
                               <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleOpenModal(member)}><Edit className="w-4 h-4 mr-2"/> Edit</DropdownMenuItem>
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
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{editingMember ? 'Edit Data Anggota' : 'Tambah Anggota Baru'}</DialogTitle>
                <DialogDescription>
                    {editingMember ? `Perbarui detail untuk ${editingMember.name}.` : "Masukkan detail anggota baru ke dalam roster."}
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Nama Lengkap</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="expertise" render={({ field }) => (
                        <FormItem><FormLabel>Keahlian Utama</FormLabel><FormControl><Input placeholder="Contoh: Keuangan, Media, IT" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem><FormLabel>No. Telepon (WhatsApp)</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="photoUrl" render={({ field }) => (
                        <FormItem><FormLabel>URL Foto Profil</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />

                    <DialogFooter className="pt-4">
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
