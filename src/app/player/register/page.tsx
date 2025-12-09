
'use client';

import Link from "next/link";
import { ArrowRight, Mail, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-950">
      
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 rounded-[32px] p-8 shadow-2xl">
        <header className="text-center space-y-3 mb-8">
            <Shield className="w-10 h-10 text-cyan-500 mx-auto" />
            <h1 className="text-3xl font-black text-white">Join BCC 2026</h1>
            <p className="text-zinc-400 text-sm">Akses cepat portal atlet dengan Google.</p>
        </header>

        <div className="space-y-4">
            
            {/* GOOGLE LOGIN BUTTON (SIMULATED) */}
            <Link href="/player/dashboard" passHref>
                <Button className="w-full h-14 rounded-xl bg-white text-black hover:bg-zinc-200 shadow-lg font-bold text-lg flex items-center justify-center transition-transform hover:scale-[1.01]">
                    <img src="/logos/google-logo.svg" alt="Google" className="w-6 h-6 mr-3" /> 
                    Sign in with Google
                </Button>
            </Link>

            <div className="flex items-center space-x-2 text-zinc-600">
                <Separator className="flex-1 bg-zinc-800"/>
                <span className="text-xs">Secure Access</span>
                <Separator className="flex-1 bg-zinc-800"/>
            </div>

            <p className="text-center text-zinc-500 text-xs pt-4">
                Dengan mendaftar, Anda setuju dengan Syarat & Ketentuan.
            </p>
        </div>
      </Card>
    </div>
  );
}
