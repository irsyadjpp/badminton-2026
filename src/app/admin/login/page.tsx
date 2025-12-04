'use client';

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Lock, Loader2 } from "lucide-react";
import { loginAdminByCode, loginAdminGoogle } from "../actions";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Masuk dengan PIN"}
    </Button>
  );
}

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  const [state, formAction] = useFormState(loginAdminByCode, { success: false, message: '' });

  useEffect(() => {
    if (state.success) {
      // Logic to store session client-side
      sessionStorage.setItem('admin_session', JSON.stringify({ isLoggedIn: true, name: 'Admin', role: 'DIRECTOR' })); // Simplified
      toast({ title: "Login Berhasil", description: "Mengalihkan ke dashboard...", className: "bg-green-600 text-white" });
      router.push('/admin');
      router.refresh(); // Force refresh to re-evaluate layout
    }
    if (state.message && !state.success) {
       toast({ title: "Gagal", description: state.message, variant: "destructive" });
    }
  }, [state, router, toast]);

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    const res = await loginAdminGoogle();
    if(res.success){
        // Logic to store session client-side
        sessionStorage.setItem('admin_session', JSON.stringify({ isLoggedIn: true, name: 'Irsyad Jamal', role: 'DIRECTOR' })); // Simplified
        toast({ title: "Google Login Berhasil", description: "Selamat datang, Director.", className: "bg-green-600 text-white" });
        router.push('/admin');
        router.refresh(); // Force refresh to re-evaluate layout
    } else {
        setIsGoogleLoading(false);
        toast({ title: "Gagal", description: "Gagal login dengan Google.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <Card className="w-full max-w-md bg-zinc-900 border-t-4 border-t-primary shadow-2xl text-white border-x-0 border-b-0">
        <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <Lock className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">BCC Admin Portal</CardTitle>
            <CardDescription className="text-zinc-400">Pusat Komando Panitia Pelaksana</CardDescription>
        </CardHeader>
        <CardContent>
          
          <Tabs defaultValue="pin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-zinc-800">
                <TabsTrigger value="pin">Kode PIN</TabsTrigger>
                <TabsTrigger value="google">Akun Google</TabsTrigger>
            </TabsList>

            {/* --- METODE 1: PIN (UNTUK LAPANGAN) --- */}
            <TabsContent value="pin">
                <form action={formAction} className="space-y-4">
                    <div className="space-y-2 text-center">
                        <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Masukkan Kode Akses</p>
                        <Input 
                        name="code" 
                        type="password"
                        maxLength={6}
                        placeholder="••••"
                        className="text-center text-4xl tracking-[0.5em] bg-black border-zinc-700 text-white h-20 rounded-xl focus:ring-primary focus:border-primary font-mono"
                        required 
                        />
                    </div>
                    <SubmitButton />
                    <p className="text-center text-xs text-zinc-600 pt-2">
                        Gunakan PIN yang tertera pada ID Card Panitia.
                    </p>
                </form>
            </TabsContent>

            {/* --- METODE 2: GOOGLE (UNTUK ADMIN PUSAT) --- */}
            <TabsContent value="google" className="space-y-4">
                <div className="text-center py-4 px-2 border border-zinc-800 rounded-lg bg-black/50">
                    <p className="text-sm text-zinc-400 mb-6">
                        Gunakan akun Google resmi panitia untuk akses penuh dan sesi yang lebih lama.
                    </p>
                    <button
                        onClick={handleGoogleLogin}
                        disabled={isGoogleLoading}
                        className="w-full h-12 bg-white text-black font-bold rounded-lg flex items-center justify-center gap-3 transition-transform active:scale-95 hover:bg-gray-100 disabled:opacity-70"
                    >
                        {isGoogleLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                <span>Masuk dengan Google</span>
                            </>
                        )}
                    </button>
                </div>
            </TabsContent>
          </Tabs>

        </CardContent>
      </Card>
    </div>
  );
}
