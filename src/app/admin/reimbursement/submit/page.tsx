
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Upload, Loader2, Send, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { submitReimbursement } from "../../finance/actions";
import { Label } from "@/components/ui/label";

export default function SubmitReimbursementPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State Form Utama
  const [applicant, setApplicant] = useState({ name: "", division: "", phone: "", date: "" });
  const [bank, setBank] = useState({ name: "", number: "", holder: "" });
  
  // State Items
  const [items, setItems] = useState<any[]>([]);
  const [newItem, setNewItem] = useState({ desc: "", cat: "", qty: "", price: "", total: "" });

  // Efek untuk kalkulasi otomatis
  useEffect(() => {
    const qty = parseFloat(newItem.qty);
    const price = parseFloat(newItem.price);
    if (!isNaN(qty) && !isNaN(price)) {
      const calculatedTotal = qty * price;
      setNewItem(prev => ({ ...prev, total: String(calculatedTotal) }));
    }
  }, [newItem.qty, newItem.price]);


  const addItem = () => {
    if (!newItem.desc || !newItem.total) return;
    setItems([...items, { ...newItem, id: Date.now().toString() }]);
    setNewItem({ desc: "", cat: "", qty: "", price: "", total: "" });
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const totalAmount = items.reduce((acc, curr) => acc + Number(curr.total), 0);

  const handleSubmit = async () => {
    if (items.length === 0) return toast({ title: "Gagal", description: "Minimal isi 1 item pengeluaran", variant: "destructive" });
    
    setIsSubmitting(true);
    const payload = {
        applicantName: applicant.name,
        division: applicant.division,
        date: applicant.date,
        whatsapp: applicant.phone,
        bankName: bank.name,
        accountNumber: bank.number,
        accountHolder: bank.holder,
        items: items.map(({ id, ...rest }) => rest), // Kirim tanpa ID temp
        totalAmount: totalAmount
    };

    await submitReimbursement(payload);
    setIsSubmitting(false);
    toast({ title: "Terkirim!", description: "Klaim Anda sedang direview Bendahara.", className: "bg-green-600 text-white" });
    // Reset form
    setItems([]);
    setApplicant({ name: "", division: "", phone: "", date: "" });
    setBank({ name: "", number: "", holder: "" });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Pengajuan Reimbursement</h1>
        <p className="text-muted-foreground">Isi formulir ini untuk klaim penggantian dana operasional.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DATA PEMOHON */}
        <Card>
            <CardHeader><CardTitle className="text-base">Data Pemohon</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Nama Lengkap</Label><Input placeholder="Nama Anda" value={applicant.name} onChange={e => setApplicant({...applicant, name: e.target.value})} /></div>
                    <div className="space-y-2"><Label>Divisi</Label>
                        <Select value={applicant.division} onValueChange={v => setApplicant({...applicant, division: v})}>
                            <SelectTrigger><SelectValue placeholder="Pilih Divisi" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="OPERATIONS">Operasional</SelectItem>
                                <SelectItem value="MATCH_CONTROL">Pertandingan</SelectItem>
                                <SelectItem value="BUSINESS">Komersial</SelectItem>
                                <SelectItem value="SECRETARY">Sekretariat</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Tanggal Belanja</Label><Input type="date" value={applicant.date} onChange={e => setApplicant({...applicant, date: e.target.value})} /></div>
                    <div className="space-y-2"><Label>No. WhatsApp</Label><Input type="tel" value={applicant.phone} onChange={e => setApplicant({...applicant, phone: e.target.value})} /></div>
                </div>
            </CardContent>
        </Card>

        {/* DATA REKENING */}
        <Card>
            <CardHeader><CardTitle className="text-base">Rekening Tujuan</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2"><Label>Nama Bank</Label><Input placeholder="Cth: BCA / Mandiri" value={bank.name} onChange={e => setBank({...bank, name: e.target.value})} /></div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>No. Rekening</Label><Input type="number" value={bank.number} onChange={e => setBank({...bank, number: e.target.value})} /></div>
                    <div className="space-y-2"><Label>Atas Nama</Label><Input value={bank.holder} onChange={e => setBank({...bank, holder: e.target.value})} /></div>
                </div>
            </CardContent>
        </Card>
      </div>

      {/* ITEM PENGELUARAN */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Rincian Pengeluaran</CardTitle>
            <div className="text-xl font-bold text-primary">Total: Rp {totalAmount.toLocaleString('id-ID')}</div>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-2 items-end border-b pb-4">
                <div className="flex-1 w-full space-y-2">
                    <Label>Deskripsi Barang/Jasa</Label>
                    <Input placeholder="Cth: Nasi Box Panitia" value={newItem.desc} onChange={e => setNewItem({...newItem, desc: e.target.value})} />
                </div>
                 <div className="md:w-40 w-full space-y-2">
                    <Label>Kategori</Label>
                    <Select value={newItem.cat} onValueChange={v => setNewItem({...newItem, cat: v})}>
                        <SelectTrigger><SelectValue placeholder="Kategori" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Konsumsi">Konsumsi</SelectItem>
                            <SelectItem value="Transport">Transport</SelectItem>
                            <SelectItem value="Logistik">Logistik</SelectItem>
                            <SelectItem value="ATK">ATK</SelectItem>
                            <SelectItem value="Lainnya">Lainnya</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="w-20 space-y-2">
                        <Label>Qty</Label>
                        <Input type="number" placeholder="20" value={newItem.qty} onChange={e => setNewItem({...newItem, qty: e.target.value})} />
                    </div>
                    <div className="flex-1 space-y-2">
                        <Label>Harga Satuan</Label>
                        <Input type="number" placeholder="25000" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} />
                    </div>
                </div>
                <div className="flex-1 w-full md:w-40 space-y-2">
                    <Label>Total (Rp)</Label>
                    <Input type="number" placeholder="0" value={newItem.total} onChange={e => setNewItem({...newItem, total: e.target.value})} />
                </div>
                <Button onClick={addItem} size="icon" className="w-full md:w-10"><Plus className="w-4 h-4" /></Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Deskripsi</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Detail</TableHead>
                        <TableHead className="text-right">Jumlah</TableHead>
                        <TableHead className="w-10"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.desc}</TableCell>
                            <TableCell>{item.cat}</TableCell>
                            <TableCell className="text-xs text-muted-foreground font-mono">
                                {item.qty && item.price ? `${item.qty} x ${Number(item.price).toLocaleString('id-ID')}` : '-'}
                            </TableCell>
                            <TableCell className="text-right font-mono">Rp {Number(item.total).toLocaleString('id-ID')}</TableCell>
                            <TableCell>
                                <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {items.length === 0 && (
                        <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground h-24">Belum ada item ditambahkan</TableCell></TableRow>
                    )}
                </TableBody>
            </Table>

            <div className="pt-4 border-t">
                <Label className="mb-2 block">Upload Bukti Transaksi (Struk/Nota)</Label>
                <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-muted-foreground hover:bg-secondary/20 cursor-pointer transition-colors">
                    <Upload className="w-8 h-8 mb-2" />
                    <span className="text-sm">Klik untuk upload gambar/PDF (Max 5MB)</span>
                </div>
            </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button size="lg" onClick={handleSubmit} disabled={isSubmitting} className="w-full md:w-auto">
            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
            Ajukan Klaim Sekarang
        </Button>
      </div>
    </div>
  );
}
