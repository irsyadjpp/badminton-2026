
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { MoreHorizontal, Plus, Trash2, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { getVolunteers, addVolunteer, updateVolunteer, deleteVolunteer, type Volunteer } from "./actions";

export default function VolunteerManagementPage() {
  const { toast } = useToast();
  const [data, setData] = useState<Volunteer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load Data Real (bukan mock lokal lagi)
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const res = await getVolunteers();
    setData(res);
    setIsLoading(false);
  };

  // CRUD: CREATE
  const handleAdd = async (formData: FormData) => {
    setIsSubmitting(true);
    const res = await addVolunteer(formData);
    if (res.success) {
      toast({ title: "Sukses", description: res.message });
      setIsAddOpen(false);
      loadData();
    }
    setIsSubmitting(false);
  };

  // CRUD: UPDATE STATUS
  const handleStatusChange = async (id: string, status: any) => {
    const res = await updateVolunteer(id, { status });
    if (res.success) {
        toast({ title: "Updated", description: `Status berubah jadi ${status}` });
        loadData();
    }
  };

  // CRUD: DELETE
  const handleDelete = async (id: string) => {
    if(!confirm("Yakin hapus data ini?")) return;
    const res = await deleteVolunteer(id);
    if (res.success) {
        toast({ title: "Deleted", description: res.message, variant: "destructive" });
        loadData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold font-headline">Database Volunteer</h2>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
                <Button><Plus className="mr-2 h-4 w-4"/> Tambah Manual</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Input Volunteer Baru</DialogTitle></DialogHeader>
                <form action={handleAdd} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Nama Lengkap</Label>
                        <Input name="name" required placeholder="Cth: Budi Santoso" />
                    </div>
                    <div className="space-y-2">
                        <Label>WhatsApp</Label>
                        <Input name="wa" required placeholder="0812..." type="tel" />
                    </div>
                    <div className="space-y-2">
                        <Label>Role Awal</Label>
                        <Select name="role" defaultValue="PENDING">
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PENDING">Pending (Belum Assign)</SelectItem>
                                <SelectItem value="LO">LO</SelectItem>
                                <SelectItem value="LOGISTIK">Logistik</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="animate-spin"/> : "Simpan Data"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Kontak</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-8">Loading data...</TableCell></TableRow>
                ) : data.map((vol) => (
                    <TableRow key={vol.id}>
                        <TableCell className="font-bold">{vol.name}</TableCell>
                        <TableCell className="font-mono text-muted-foreground">{vol.wa}</TableCell>
                        <TableCell><Badge variant="outline">{vol.role}</Badge></TableCell>
                        <TableCell>
                            <Badge className={
                                vol.status === 'ACCEPTED' ? 'bg-green-600' : 
                                vol.status === 'REJECTED' ? 'bg-red-600' : 'bg-yellow-500'
                            }>{vol.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild><Button variant="ghost" size="sm"><MoreHorizontal className="w-4 h-4"/></Button></DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Ubah Status</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => handleStatusChange(vol.id, 'INTERVIEW')}>Panggil Interview</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStatusChange(vol.id, 'ACCEPTED')}>Terima (Accept)</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStatusChange(vol.id, 'REJECTED')} className="text-red-500">Tolak (Reject)</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleDelete(vol.id)} className="text-red-600 font-bold">
                                        <Trash2 className="w-4 h-4 mr-2"/> Hapus
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </div>
    </div>
  );
}
