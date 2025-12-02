'use client';

import { useEffect, useState } from "react";
import { loginManagerGoogle } from "../actions";
import { Loader2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export default function ManagerLoginPage() {
  const router = useRouter();
  const [loadingMessage, setLoadingMessage] = useState("Menghubungkan ke Manager Portal...");

  // Efek ini akan berjalan HANYA SEKALI saat komponen dimuat
  useEffect(() => {
    const autoLogin = async () => {
      // 1. Tunda sedikit untuk kesan "loading" yang lebih baik
      await new Promise(r => setTimeout(r, 500));
      setLoadingMessage("Memverifikasi sesi...");
      
      // 2. Panggil Server Action untuk mengatur Cookie (Simulasi Login Berhasil)
      const result = await loginManagerGoogle();
      
      // 3. Redirect ke Dashboard jika berhasil
      if (result.success) {
        setLoadingMessage("Sesi Berhasil. Mengalihkan...");
        router.push('/manager/dashboard');
      } else {
        setLoadingMessage("Gagal membuat sesi otomatis.");
      }
    };

    autoLogin();
  }, [router]); // Hanya dijalankan saat mounting

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      
      {/* Visualizer Loading (Desain Modern/Sporty) */}
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-700 text-center p-8 shadow-xl border-t-4 border-t-primary">
        <CardTitle className="text-2xl font-black font-headline mb-4 text-primary flex items-center justify-center gap-3">
             <ShieldCheck className="w-6 h-6" />
             Manager Portal
        </CardTitle>
        <CardContent className="space-y-4 pt-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-2" />
            <p className="text-zinc-300 font-medium">{loadingMessage}</p>
            <p className="text-sm text-zinc-500">Auto-Login sebagai Developer...</p>
        </CardContent>
      </Card>
      
    </div>
  );
}
