'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, RefreshCw, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function TeamSettingsPage() {
  const { toast } = useToast();
  // Mock Data Tim
  const [teamCode, setTeamCode] = useState("BCC-8821");

  const handleCopy = () => {
    navigator.clipboard.writeText(teamCode);
    toast({ title: "Disalin!", description: "Bagikan kode ini ke pemain Anda." });
  };

  const handleRegenerate = () => {
    if(confirm("Kode lama akan hangus. Yakin ganti?")) {
        setTeamCode("BCC-" + Math.floor(1000 + Math.random() * 9000));
        toast({ title: "Kode Baru Dibuat" });
    }
  };

  return (
    <div className="space-y-6">
       <h2 className="text-3xl font-bold font-headline">Pengaturan Tim</h2>

       {/* KARTU KODE JOIN */}
       <Card className="border-l-4 border-l-primary bg-zinc-50 dark:bg-zinc-900">
          <CardHeader>
             <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary"/> Kode Akses Pemain (Join Code)
             </CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground mb-4">
                Bagikan kode ini kepada atlet Anda. Mereka harus mendaftar sendiri melalui website agar data NIK mereka aman.
             </p>
             
             <div className="flex gap-2 max-w-md">
                <div className="relative flex-grow">
                    <Input value={teamCode} readOnly className="font-mono text-2xl font-black text-center tracking-widest bg-white dark:bg-black h-16 border-2 border-primary/20" />
                </div>
                <Button onClick={handleCopy} className="h-16 w-16" variant="outline"><Copy className="w-6 h-6"/></Button>
             </div>

             <div className="mt-4">
                <Button variant="ghost" size="sm" onClick={handleRegenerate} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                   <RefreshCw className="w-4 h-4 mr-2"/> Reset Kode (Jika Bocor)
                </Button>
             </div>
          </CardContent>
       </Card>

       {/* Form Edit Info Tim Lainnya... */}
    </div>
  );
}
