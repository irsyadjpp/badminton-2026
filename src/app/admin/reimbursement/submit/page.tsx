

'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Upload, Loader2, Send, Wallet, User, Banknote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { submitReimbursement } from "../../finance/actions";
import { Label } from "@/components/ui/label";

type ReimbursementItem = {
  id: string;
  desc: string;
  cat: string;
  qty: string;
  price: string;
  total: string;
}

// SIMULASI DATA DARI SESSION
const MOCK_USER_SESSION = {
    name: "Teri Taufiq Mulyadi",
    division: "OPERATIONS",
    phone: "081233334444",
    bankAccountName: "Teri Taufiq Mulyadi",
    bankAccountNumber: "0030214714101"
};

export default function SubmitReimbursementPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State Form Utama
  const [applicant, setApplicant] = useState({ name: "", division: "", phone: "", date: "" });
  const [bank, setBank] = useState({ name: "Bank BJB", number: "", holder: "" });
  
  // State Items
  const [items, setItems] = useState<ReimbursementItem[]>([]);
  const [newItem, setNewItem] = useState({ desc: "", cat: "", qty: "", price: "", total: "" });

  // -- EFEK UNTUK MENGISI DATA DIRI & BANK OTOMATIS --
  useEffect(() => {
    // Di aplikasi nyata, data ini akan diambil dari session login
    setApplicant(prev => ({
        ...prev,
        name: MOCK_USER_SESSION.name,
        division: MOCK_USER_SESSION.division,
        phone: MOCK_USER_SESSION.phone
    }));
    setBank(prev => ({
        ...prev,
        number: MOCK_USER_SESSION.bankAccountNumber,
        holder: MOCK_USER_SESSION.bankAccountName
    }));
  }, []);
  
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
        items: items.map(({ id, ...rest }) => ({...rest, qty: Number(rest.qty), price: Number(rest.price), total: Number(rest.total)})), // Kirim tanpa ID temp
        totalAmount: totalAmount
    };

    await submitReimbursement(payload);
    setIsSubmitting(false);
    toast({ title: "Terkirim!", description: "Klaim Anda sedang direview Bendahara.", className: "bg-green-600 text-white" });
    // Reset form (kecuali data diri)
    setItems([]);
    setBank(prev => ({...prev, number: MOCK_USER_SESSION.bankAccountNumber, holder: MOCK_USER_SESSION.bankAccountName}));
    setApplicant(prev => ({ ...prev, date: "" }));
  };
  
  const StepIndicator = ({ number, title }: { number: number, title: string }) => (
      <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-lg">
              {number}
          </div>
          <h2 className="text-xl font-bold font-headline text-foreground">{title}</h2>
      </div>
  );

  return (
    <div className="space-y-8">
      {/* HEADER & SCOREBOARD TOTAL */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 rounded-xl bg-card border-l-4 border-primary shadow-sm">
        <div>
            <h1 className="text-3xl font-black font-headline text-primary">Klaim Dana Operasional</h1>
            <p className="text-muted-foreground">Isi formulir ini untuk klaim penggantian dana.</p>
        </div>
        <div className="w-full md:w-auto p-4 rounded-lg bg-secondary/30 text-center">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">TOTAL KLAIM</p>
            <p className="text-3xl font-black font-mono text-primary">Rp {totalAmount.toLocaleString('id-ID')}</p>
        </div>
      </div>
      
      {/* STEP 1: INFO PEMOHON & REKENING */}
      <div className="space-y-6">
          <StepIndicator number={1} title="Informasi Pemohon & Rekening" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card/70 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                    <User className="w-5 h-5 text-primary"/>
                    <CardTitle className="text-base">Data Diri Pemohon</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                        <Label>Nama Lengkap (Otomatis)</Label>
                        <Input value={applicant.name} readOnly className="font-bold bg-secondary/50"/>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5"><Label>Divisi (Otomatis)</Label><Input value={applicant.division} readOnly className="font-bold bg-secondary/50"/></div>
                        <div className="space-y-1.5"><Label>No. WhatsApp (Otomatis)</Label><Input type="tel" value={applicant.phone} readOnly className="font-bold bg-secondary/50" /></div>
                    </div>
                    <div className="space-y-1.5"><Label>Tanggal Belanja</Label><Input type="date" value={applicant.date} onChange={e => setApplicant({...applicant, date: e.target.value})} /></div>
                </CardContent>
            </Card>

            <Card className="bg-card/70 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                    <Banknote className="w-5 h-5 text-primary"/>
                    <CardTitle className="text-base">Rekening Tujuan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1.5"><Label>Nama Bank</Label><Input value={bank.name} readOnly className="font-bold bg-secondary/50"/></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5"><Label>No. Rekening (Otomatis)</Label><Input type="number" value={bank.number} readOnly className="font-bold bg-secondary/50" /></div>
                        <div className="space-y-1.5"><Label>Atas Nama (Otomatis)</Label><Input value={bank.holder} readOnly className="font-bold bg-secondary/50" /></div>
                    </div>
                </CardContent>
            </Card>
          </div>
      </div>

      {/* STEP 2: RINCIAN PENGELUARAN */}
      <div className="space-y-6">
          <StepIndicator number={2} title="Rincian Pengeluaran" />
          <Card className="bg-card/70 backdrop-blur-sm">
            <CardContent className="p-6 space-y-6">
                
                {/* Form Input Item */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end p-4 bg-secondary/50 rounded-lg">
                    <div className="md:col-span-4 space-y-1.5">
                        <Label className="text-xs">Deskripsi Barang/Jasa</Label>
                        <Input placeholder="Cth: Nasi Box Panitia" value={newItem.desc} onChange={e => setNewItem({...newItem, desc: e.target.value})} />
                    </div>
                    <div className="md:col-span-2 space-y-1.5">
                        <Label className="text-xs">Kategori</Label>
                        <Select value={newItem.cat} onValueChange={v => setNewItem({...newItem, cat: v})}>
                            <SelectTrigger><SelectValue placeholder="Pilih..." /></SelectTrigger>
                            <SelectContent><SelectItem value="Konsumsi">Konsumsi</SelectItem><SelectItem value="Transport">Transport</SelectItem><SelectItem value="Logistik">Logistik</SelectItem><SelectItem value="ATK">ATK</SelectItem><SelectItem value="Lainnya">Lainnya</SelectItem></SelectContent>
                        </Select>
                    </div>
                    <div className="md:col-span-1 space-y-1.5">
                        <Label className="text-xs">Qty</Label>
                        <Input type="number" placeholder="1" value={newItem.qty} onChange={e => setNewItem({...newItem, qty: e.target.value})} />
                    </div>
                    <div className="md:col-span-2 space-y-1.5">
                        <Label className="text-xs">Harga Satuan</Label>
                        <Input type="number" placeholder="25000" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} />
                    </div>
                    <div className="md:col-span-2 space-y-1.5">
                        <Label className="text-xs">Total (Auto)</Label>
                        <Input type="number" placeholder="0" value={newItem.total} onChange={e => setNewItem({...newItem, total: e.target.value})} className="font-bold bg-background"/>
                    </div>
                    <div className="md:col-span-1">
                        <Button onClick={addItem} size="icon" className="w-full h-10"><Plus className="w-4 h-4" /></Button>
                    </div>
                </div>

                {/* List Item */}
                <div className="space-y-2">
                    {items.map((item, index) => (
                        <div key={item.id} className="flex items-center gap-4 p-3 rounded-md hover:bg-secondary/30">
                            <div className="font-mono text-xs text-muted-foreground">{String(index + 1).padStart(2, '0')}</div>
                            <div className="flex-1">
                                <p className="font-medium text-sm">{item.desc}</p>
                                <p className="text-xs text-muted-foreground">{item.cat}</p>
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">
                                {item.qty && item.price ? `${item.qty} x ${Number(item.price).toLocaleString('id-ID')}` : '-'}
                            </div>
                            <div className="font-mono font-bold text-sm w-32 text-right">Rp {Number(item.total).toLocaleString('id-ID')}</div>
                            <Button variant="ghost" size="icon" className="text-destructive/50 hover:text-destructive" onClick={() => removeItem(item.id)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <div className="text-center text-muted-foreground h-24 flex items-center justify-center border-2 border-dashed rounded-lg">Belum ada item ditambahkan.</div>
                    )}
                </div>
            </CardContent>
          </Card>
      </div>

      {/* STEP 3: SUBMIT */}
      <div className="space-y-6">
        <StepIndicator number={3} title="Upload Bukti & Kirim" />
        <Card className="bg-card/70 backdrop-blur-sm">
            <CardContent className="p-6 grid md:grid-cols-2 gap-6 items-center">
                <div>
                     <Label className="mb-2 block">Upload Bukti Transaksi (Struk/Nota)</Label>
                     <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-muted-foreground hover:bg-secondary/20 cursor-pointer transition-colors bg-secondary/50">
                        <Upload className="w-8 h-8 mb-2" />
                        <span className="text-sm font-medium">Klik untuk upload gambar/PDF</span>
                        <span className="text-xs">(Max 5MB)</span>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-muted-foreground text-center md:text-left">Pastikan semua data sudah benar. Setelah dikirim, pengajuan tidak dapat diubah kembali.</p>
                     <Button size="lg" onClick={handleSubmit} disabled={isSubmitting} className="w-full h-16 text-lg font-bold">
                        {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Send className="w-5 h-5 mr-3" /> AJUKAN KLAIM</>}
                    </Button>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

    