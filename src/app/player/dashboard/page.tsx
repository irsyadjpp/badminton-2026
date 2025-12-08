'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Ticket, CheckCircle2 } from "lucide-react";
import { joinTeam } from "../actions";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function PlayerDashboard() {
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const [myTeam, setMyTeam] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    setLoading(true);
    const res = await joinTeam("player@email.com", code); // Email dari session
    setLoading(false);

    if (res.success) {
      setMyTeam(res.teamName);
      toast({ title: "Welcome!", description: `Anda berhasil bergabung ke ${res.teamName}`, className: "bg-green-600 text-white" });
    } else {
      toast({ title: "Gagal", description: res.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-md mx-auto space-y-8">
        
        {/* HEADER */}
        <div>
           <h1 className="text-3xl font-black font-headline text-primary uppercase">Player Hub</h1>
           <p className="text-zinc-400">Kelola profil dan keanggotaan tim Anda.</p>
        </div>

        {/* STATUS KEANGGOTAAN */}
        {myTeam ? (
           <Card className="bg-zinc-900 border-green-600 border-l-4">
              <CardContent className="p-6">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-900/30 rounded-full text-green-500"><CheckCircle2 className="w-8 h-8"/></div>
                    <div>
                       <div className="text-sm text-zinc-400 uppercase font-bold">Terdaftar di Tim</div>
                       <div className="text-2xl font-black text-white">{myTeam}</div>
                    </div>
                 </div>
                 <p className="text-xs text-zinc-500 mt-4">Hubungi Manajer tim untuk info pertandingan.</p>
              </CardContent>
           </Card>
        ) : (
           <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                 <CardTitle className="flex items-center gap-2"><Ticket className="w-5 h-5 text-primary"/> Gabung Tim (Join)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <p className="text-sm text-zinc-400">
                    Masukkan **Kode Unik** yang diberikan oleh Manajer Tim Anda untuk masuk ke dalam roster.
                 </p>
                 <div className="flex gap-2">
                    <Input 
                        placeholder="Contoh: BCC-8821" 
                        value={code}
                        onChange={e => setCode(e.target.value.toUpperCase())}
                        className="bg-black border-zinc-700 font-mono text-center text-lg tracking-widest uppercase"
                    />
                 </div>
                 <Button onClick={handleJoin} disabled={loading} className="w-full font-bold">
                    {loading ? "Memverifikasi..." : "GABUNG TIM SEKARANG"}
                 </Button>
              </CardContent>
           </Card>
        )}

        {/* PROFIL CARD */}
        <Card className="bg-zinc-900 border-zinc-800">
           <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center font-black text-xl">A</div>
                 <div>
                    <div className="font-bold text-white">Atlet Development</div>
                    <div className="text-xs text-zinc-500">ID: P-DEV-1234</div>
                 </div>
              </div>
              <Button asChild variant="outline" size="sm" className="text-xs border-zinc-700">
                 <Link href="/player/profile">Edit Profil</Link>
              </Button>
           </CardContent>
        </Card>

      </div>
    </div>
  );
}
