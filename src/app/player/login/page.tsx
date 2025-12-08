
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { loginPlayerGoogle } from "../actions";

export default function PlayerLoginPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await loginPlayerGoogle();
    window.location.href = '/player/dashboard';
  };

  return (
    <div className="min-h-screen w-full flex bg-zinc-950">
      
      {/* --- BAGIAN KIRI: VISUAL (DESKTOP ONLY) --- */}
      <div className="hidden lg:flex w-[60%] relative bg-black items-center justify-center overflow-hidden">
         <div className="absolute inset-0 bg-[url('/images/gor-koni.jpg')] bg-cover bg-center opacity-40 mix-blend-luminosity"></div>
         <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent"></div>
         
         <div className="relative z-10 p-16 space-y-6 max-w-2xl">
            <div className="inline-block bg-primary/20 text-primary border border-primary/50 px-4 py-1 rounded-full text-sm font-bold tracking-widest uppercase mb-4">
                Athlete Portal
            </div>
            <h1 className="text-7xl font-black font-headline text-white leading-tight">
                FOCUS ON <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">THE GAME.</span>
            </h1>
            <p className="text-xl text-zinc-400 font-light leading-relaxed">
                Biarkan sistem kami mengurus administrasi. Anda cukup fokus berlatih dan memenangkan pertandingan.
                Pantau jadwal, statistik, dan info lawan dalam satu genggaman.
            </p>
         </div>
      </div>

      {/* --- BAGIAN KANAN: FORM (WEB FIRST LAYOUT) --- */}
      <div className="w-full lg:w-[40%] flex flex-col justify-center p-8 md:p-16 lg:p-24 bg-zinc-900 border-l border-zinc-800 relative">
         {/* Decoration */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] pointer-events-none"></div>

         <div className="max-w-md w-full mx-auto space-y-8 relative z-10">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Welcome Back, Champ.</h2>
                <p className="text-zinc-400">Masuk untuk mengakses dashboard atlet.</p>
            </div>

            <div className="space-y-4">
                <Button 
                    onClick={handleGoogleLogin} 
                    className="w-full h-14 bg-white text-black hover:bg-zinc-200 font-bold text-lg flex items-center justify-center gap-3 transition-transform active:scale-95"
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="animate-spin"/> : (
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
                    )}
                    Masuk dengan Google
                </Button>

                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-zinc-700"></div>
                    <span className="flex-shrink-0 mx-4 text-xs text-zinc-500 uppercase font-bold tracking-wider">Atau Manual</span>
                    <div className="flex-grow border-t border-zinc-700"></div>
                </div>

                <form className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-zinc-400">Email Atlet</Label>
                        <Input className="bg-black border-zinc-800 h-12 focus:border-primary" placeholder="atlet@example.com" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label className="text-zinc-400">Password</Label>
                            <Link href="#" className="text-xs text-primary hover:underline">Lupa?</Link>
                        </div>
                        <Input type="password" className="bg-black border-zinc-800 h-12 focus:border-primary" placeholder="••••••••" />
                    </div>
                    <Button className="w-full h-12 bg-zinc-800 hover:bg-zinc-700 text-white font-bold" variant="outline">
                        Login Manual
                    </Button>
                </form>
            </div>

            <p className="text-center text-sm text-zinc-500">
                Belum terdaftar? <Link href="/player/register" className="text-primary font-bold hover:underline">Buat Akun Atlet</Link>
            </p>
         </div>
      </div>
    </div>
  );
}
