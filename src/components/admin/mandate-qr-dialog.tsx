
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { Download, Share2 } from "lucide-react";

interface MandateQRDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mandateData: { id: string; no: string; title: string };
}

export function MandateQRDialog({ isOpen, onClose, mandateData }: MandateQRDialogProps) {
  // URL Publik (Ganti domain saat production)
  const verifyUrl = `${window.location.origin}/verify/mandate/${mandateData.id}`; // ID ini tokennya

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black max-w-sm rounded-[32px] p-0 overflow-hidden border-none">
        
        <DialogHeader className="bg-zinc-950 p-8 text-center text-white">
          <DialogTitle className="font-black font-headline uppercase tracking-widest text-lg">DIGITAL MANDATE</DialogTitle>
          <DialogDescription className="text-xs text-zinc-400 mt-1">{mandateData.no}</DialogDescription>
        </DialogHeader>

        {/* QR Area */}
        <div className="p-8 flex flex-col items-center justify-center space-y-6 bg-white">
            <div className="p-2 border-4 border-black rounded-xl">
                <QRCodeSVG value={verifyUrl} size={200} />
            </div>
            
            <div className="text-center space-y-1">
                <p className="font-bold text-xl uppercase">{mandateData.title}</p>
                <p className="text-xs text-zinc-500 px-4">
                    Tunjukkan QR ini kepada petugas keamanan atau pihak berwenang untuk validasi tugas.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full">
                <Button className="w-full rounded-full font-bold bg-zinc-100 text-black hover:bg-zinc-200 shadow-none border">
                    <Download className="w-4 h-4 mr-2"/> SAVE
                </Button>
                <Button className="w-full rounded-full font-bold bg-black text-white hover:bg-zinc-800">
                    <Share2 className="w-4 h-4 mr-2"/> SHARE
                </Button>
            </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
