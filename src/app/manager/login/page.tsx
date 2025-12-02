'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginManager } from "../actions";
import { Loader2, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import Link from "next/link";

export default function ManagerLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Handler untuk Login Manual (Email/Pass)
  const handleManualLogin = async (formData: FormData) => {
    setIsLoading(true);
    const res = await loginManager(null, formData);
    
    if (res.success) {
      toast({ title: "Welcome Back, Coach!", description: "Mengalihkan ke dashboard..." });
      router.push('/manager/dashboard');
    } else {
      toast({ title: "Login Gagal", description: res.message, variant: "destructive" });
      setIsLoading(false);
    }
  };

  // Handler untuk Login Google (Simulasi Langsung)
  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    
    // Tampilkan pesan sukses
    toast({ 
        title: "Google Login Berhasil", 
        description: "Mengalihkan ke dasbor Anda...",
        className: "bg-green-600 text-white border-none"
    });

    // Langsung arahkan ke dashboard setelah delay singkat untuk simulasi
    setTimeout(() => {
        router.push('/manager/dashboard');
    }, 1000); 
  };

  return (
    <div className="min-h-screen w-full flex bg-black text-white overflow-hidden">
      
      {/* --- BAGIAN KIRI: VISUAL & BRANDING (60%) --- */}
      <div className="hidden lg:flex w-[60%] relative flex-col justify-between p-12 bg-zinc-900">
        
        {/* Background Image dengan Overlay */}
        <div className="absolute inset-0 z-0">
            <Image 
                src="/images/gor-koni.jpg" 
                alt="Court" 
                fill 
                className="object-cover opacity-40 grayscale mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-20 mix-blend-overlay"></div>
        </div>

        {/* Logo Area */}
        <div className="relative z-10">
             <div className="flex items-center gap-3 mb-2">
                <Image src="/images/logo.png" alt="Logo" width={40} height={40} />
                <span className="font-bold text-xl tracking-widest uppercase text-white/80">BCC 2026</span>
             </div>
        </div>

        {/* Main Copywriting */}
        <div className="relative z-10 max-w-xl">
            <h1 className="text-6xl font-black font-headline leading-[0.9] mb-6 tracking-tighter">
                ATUR TIM.<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">RAIH JUARA.</span>
            </h1>
            <p className="text-lg text-zinc-400 font-medium leading-relaxed">
                Platform manajemen tim resmi Bandung Community Championship 2026. 
                Kelola roster pemain, pembayaran, dan jadwal dalam satu dashboard terintegrasi.
            </p>
        </div>

        {/* Footer Info */}
        <div className="relative z-10 flex gap-6 text-sm text-zinc-500 font-mono">
            <span>© 2026 BCC Dev Team</span>
            <span>v2.0.1 (Beta)</span>
        </div>
      </div>

      {/* --- BAGIAN KANAN: FORM LOGIN (40%) --- */}
      <div className="w-full lg:w-[40%] flex items-center justify-center p-8 relative">
         {/* Dekorasi Garis Lapangan Abstrak */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] pointer-events-none" />
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 blur-[100px] pointer-events-none" />

         <div className="w-full max-w-md space-y-8 relative z-10">
            <div className="text-center lg:text-left">
                <h2 className="text-3xl font-black font-headline mb-2">Manager Login</h2>
                <p className="text-zinc-400">Masuk untuk mengelola tim Anda.</p>
            </div>

            <div className="space-y-4">
                {/* --- TOMBOL GOOGLE (HERO BUTTON) --- */}
                <button
                    onClick={handleGoogleLogin}
                    disabled={isGoogleLoading || isLoading}
                    className="group relative w-full h-14 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] disabled:opacity-70 disabled:pointer-events-none"
                >
                    {isGoogleLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-black" />
                    ) : (
                        <>
                             {/* Icon Google SVG */}
                             <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            <span>Lanjutkan dengan Google</span>
                        </>
                    )}
                </button>

                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-zinc-800"></div>
                    <span className="flex-shrink-0 mx-4 text-xs text-zinc-500 uppercase font-bold tracking-wider">Atau Manual</span>
                    <div className="flex-grow border-t border-zinc-800"></div>
                </div>

                {/* FORM LOGIN MANUAL */}
                <form action={handleManualLogin} className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
                            <Input 
                                name="email" 
                                type="email" 
                                placeholder="manager@club.com" 
                                className="pl-10 bg-zinc-900 border-zinc-800 text-white h-12 rounded-lg focus:ring-primary focus:border-primary transition-all placeholder:text-zinc-600" 
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Password</Label>
                            <Link href="#" className="text-xs text-primary hover:underline">Lupa Password?</Link>
                        </div>
                        <Input 
                            name="password" 
                            type="password" 
                            placeholder="••••••••"
                            className="bg-zinc-900 border-zinc-800 text-white h-12 rounded-lg focus:ring-primary focus:border-primary transition-all placeholder:text-zinc-600" 
                            required
                        />
                    </div>

                    <Button 
                        type="submit" 
                        className="w-full h-12 bg-transparent border border-zinc-700 hover:bg-zinc-800 text-white font-bold rounded-lg transition-all"
                        disabled={isLoading || isGoogleLoading}
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : "Masuk dengan Email"}
                    </Button>
                </form>
            </div>

            <p className="text-center text-sm text-zinc-500 pt-6">
                Belum punya akun manajer? <br/>
                <span className="text-white font-bold cursor-pointer hover:underline">Hubungi Admin untuk Registrasi</span>
            </p>
         </div>
      </div>
    </div>
  );
}
