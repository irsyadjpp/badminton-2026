'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle2, QrCode } from "lucide-react";
import Image from "next/image";
// Gunakan library 'react-qr-code' (perlu install: npm i react-qr-code)
import QRCode from "react-qr-code"; 

export default function DigitalMandatePage() {
  // Data diambil dari session login
  const user = {
    name: "Risca Amalia",
    role: "Koordinator Komersial",
    id: "PAN-302",
    validUntil: "30 Juli 2026",
    photo: "/images/staff-placeholder.jpg" 
  };

  const validationUrl = `https://bcc2026.com/verify-staff/${user.id}`;

  return (
    <div className="max-w-md mx-auto space-y-6 pb-12">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-black font-headline text-primary">DIGITAL CREDENTIAL</h1>
        <p className="text-muted-foreground text-sm">Surat Tugas & Identitas Resmi Panitia</p>
      </div>

      {/* ID CARD VISUAL */}
      <Card className="border-2 border-primary/20 overflow-hidden shadow-2xl relative">
        {/* Background Pattern */}
        <div className="absolute top-0 w-full h-32 bg-gradient-to-r from-blue-900 to-primary z-0" />
        
        <CardContent className="pt-12 px-6 pb-8 relative z-10 flex flex-col items-center text-center">
          <div className="w-28 h-28 rounded-full border-4 border-white shadow-md overflow-hidden bg-white mb-4">
             {/* Ganti dengan Foto User */}
             <div className="w-full h-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-400">RA</div> 
          </div>
          
          <h2 className="text-2xl font-bold uppercase">{user.name}</h2>
          <Badge className="mt-2 text-sm px-3 py-1 bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">
            {user.role.toUpperCase()}
          </Badge>

          <div className="mt-6 w-full space-y-4">
             <div className="bg-secondary/20 p-4 rounded-lg border border-secondary text-left text-sm space-y-2">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Nomor ID</span>
                    <span className="font-mono font-bold">{user.id}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="text-green-600 font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> AKTIF / BERTUGAS</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Berlaku s.d.</span>
                    <span className="font-bold">{user.validUntil}</span>
                </div>
             </div>

             {/* QR Code untuk Pihak Luar */}
             <div className="flex flex-col items-center gap-2 pt-4 border-t">
                <div className="bg-white p-2 rounded border">
                    <QRCode value={validationUrl} size={100} />
                </div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Scan untuk Verifikasi Keaslian Petugas</p>
             </div>
          </div>
        </CardContent>
      </Card>

      {/* ACTION BUTTONS */}
      <div className="grid grid-cols-2 gap-4">
         <Button variant="outline" className="h-14 flex flex-col gap-1 items-center justify-center">
            <Download className="w-5 h-5" />
            <span className="text-xs">Unduh PDF SK</span>
         </Button>
         <Button variant="outline" className="h-14 flex flex-col gap-1 items-center justify-center">
            <QrCode className="w-5 h-5" />
            <span className="text-xs">Handbook Panitia</span>
         </Button>
      </div>
      
      <p className="text-center text-xs text-muted-foreground px-8">
        Dokumen ini sah secara digital menggantikan surat tugas fisik sesuai SK Project Director No. 001/SK/BCC/XII/2025.
      </p>
    </div>
  );
}
