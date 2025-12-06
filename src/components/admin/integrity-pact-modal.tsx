'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShieldCheck, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Simpan status persetujuan ke server/cookie
import { signIntegrityPact } from '@/app/admin/actions'; 

export function IntegrityPactModal({ isOpen, onComplete, userName }: { isOpen: boolean, onComplete: () => void, userName: string }) {
  const [agreed, setAgreed] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const { toast } = useToast();

  const handleSign = async () => {
    setIsSigning(true);
    await signIntegrityPact(); // Server action untuk update status user
    setIsSigning(false);
    toast({
      title: "Pakta Integritas Ditandatangani",
      description: "Terima kasih atas komitmen profesional Anda.",
      className: "bg-green-600 text-white"
    });
    onComplete();
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-2xl" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-center text-2xl font-headline">PAKTA INTEGRITAS BCC 2026</DialogTitle>
          <DialogDescription className="text-center">
            Halo <strong>{userName}</strong>. Sebelum memulai tugas, mohon pahami dan setujui kode etik panitia berikut.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[300px] border p-4 rounded-md bg-secondary/5 text-sm leading-relaxed">
          <h4 className="font-bold mb-2">PASAL 1: INTEGRITAS DATA</h4>
          <p className="mb-4">Saya berjanji tidak akan memanipulasi data peserta, skor, atau jadwal pertandingan demi keuntungan pribadi maupun kelompok tertentu.</p>
          
          <h4 className="font-bold mb-2">PASAL 2: ANTI-SUAP & GRATIFIKASI</h4>
          <p className="mb-4">Saya menolak segala bentuk pemberian (uang/barang) dari peserta yang bertujuan mempengaruhi keputusan teknis di lapangan.</p>
          
          <h4 className="font-bold mb-2">PASAL 3: KERAHASIAAN</h4>
          <p className="mb-4">Saya akan menjaga kerahasiaan data strategi panitia dan data pribadi peserta sesuai undang-undang yang berlaku.</p>
          
          <h4 className="font-bold mb-2">SANKSI</h4>
          <p>Pelanggaran terhadap poin di atas akan berakibat pada pemecatan tidak hormat dan pencantuman nama dalam daftar hitam komunitas (Blacklist).</p>
        </ScrollArea>

        <div className="flex items-start space-x-3 pt-4">
          <Checkbox id="terms" checked={agreed} onCheckedChange={(c) => setAgreed(!!c)} />
          <div className="grid gap-1.5 leading-none">
            <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Saya telah membaca, memahami, dan menyetujui Pakta Integritas ini secara sadar dan tanpa paksaan.
            </label>
            <p className="text-xs text-muted-foreground">Tindakan klik tombol di bawah sah secara hukum sebagai tanda tangan digital.</p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSign} disabled={!agreed || isSigning} className="w-full sm:w-auto font-bold text-lg h-12">
            {isSigning ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "SAYA SETUJU & TANDA TANGAN"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
