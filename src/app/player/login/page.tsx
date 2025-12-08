
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, User, Lock } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { loginPlayerGoogle } from "../actions"; // Import action baru

// Simulasi Server Action (bisa disatukan di src/app/player/actions.ts)
const loginPlayer = async (formData: FormData) => {
  await new Promise(r => setTimeout(r, 1000));
  // Di real app, validasi email/password ke DB
  return { success: true }; 
};

export default function PlayerLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Handler Login Google (Dev Bypass)
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    const res = await loginPlayerGoogle();
    
    if (res.success) {
      toast({ 
        title: "Login Berhasil (Dev)", 
        description: "Masuk sebagai Atlet Development.",
        className: "bg-green-600 text-white"
      });
      // Force redirect agar session terbaca
      window.location.href = '/player/dashboard';
    } else {
        setIsGoogleLoading(false);
    }
  };

  // Handler Manual (Biarkan saja untuk tes validasi form)
  const handleManualSubmit = async (formData: FormData) => {
    setIsLoading(true);
    const res = await loginPlayer(formData);
    
    if (res.success) {
      // Simpan session dummy
      sessionStorage.setItem('player_session', JSON.stringify({ email: formData.get('email'), name: 'Player' }));
      toast({ title: "Login Berhasil", description: "Selamat datang kembali!" });
      router.push('/player/dashboard');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/net-pattern.png')] opacity-5 pointer-events-none"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>

      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 text-white relative z-10 shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-700">
             <User className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-black font-headline uppercase">Login Atlet</CardTitle>
          <CardDescription>Masuk untuk cek jadwal tanding & statistik.</CardDescription>
        </CardHeader>
        <CardContent>
          
          {/* --- TOMBOL GOOGLE (DEV) --- */}
          <div className="mb-6">
             <Button 
                onClick={handleGoogleLogin} 
                disabled={isGoogleLoading}
                className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-bold flex items-center gap-3 text-sm md:text-base"
             >
                {isGoogleLoading ? <Loader2 className="animate-spin w-5 h-5"/> : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                )}
                MASUK DENGAN GOOGLE
             </Button>
             
             <div className="relative flex py-4 items-center">
                <div className="flex-grow border-t border-zinc-800"></div>
                <span className="flex-shrink-0 mx-4 text-xs text-zinc-500 uppercase font-bold tracking-wider">Atau Manual</span>
                <div className="flex-grow border-t border-zinc-800"></div>
             </div>
          </div>

          <form action={handleManualSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label>Email</Label>
                <Input name="email" type="email" placeholder="nama@email.com" className="bg-black border-zinc-700 text-white" />
            </div>
            <div className="space-y-2">
                <Label>Password</Label>
                <div className="relative">
                    <Input name="password" type="password" placeholder="••••••••" className="bg-black border-zinc-700 text-white pr-10" />
                    <Lock className="absolute right-3 top-3 w-4 h-4 text-zinc-500" />
                </div>
            </div>
            
            <Button type="submit" className="w-full h-12 font-bold text-lg border border-zinc-700 bg-transparent hover:bg-zinc-800 text-zinc-400" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin"/> : "Masuk Manual"}
            </Button>

            <div className="pt-4 text-center text-sm text-zinc-500 border-t border-zinc-800 mt-4">
                Belum punya akun atlet? <br/>
                <Link href="/player/register" className="text-primary font-bold hover:underline">Daftar di sini</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
