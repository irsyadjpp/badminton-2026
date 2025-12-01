'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Ticket, Loader2, CheckCircle2, RefreshCw } from 'lucide-react';
import { submitCheckin } from './actions';
import { VoteWidget } from '@/components/checkin/vote-widget';
import { PassportWidget } from '@/components/checkin/passport-widget';
import { LeaderboardWidget } from '@/components/checkin/leaderboard-widget';
import confetti from 'canvas-confetti';

const initialState = {
  success: false,
  voucherCode: '',
  visitorId: '',
  isExisting: false,
  message: ''
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      className="w-full h-14 text-lg font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1" 
      disabled={pending}
    >
      {pending ? (
        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Memproses...</>
      ) : (
        "AMBIL VOUCHER SAYA"
      )}
    </Button>
  );
}

export default function CheckInPage() {
  const [state, formAction] = useActionState(submitCheckin, initialState);

  useEffect(() => {
    if (state.success && !state.isExisting) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    }
  }, [state.success, state.isExisting]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary/90 flex items-center justify-center p-4 py-10">
       {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-black/10 rounded-full blur-3xl"></div>
      </div>
      
      <Card className="w-full max-w-md shadow-2xl border-none relative z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
        
        <CardHeader className="text-center space-y-2 pt-8">
          <div className="mx-auto bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mb-2 shadow-inner">
            <Ticket className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-black font-headline text-foreground">
            SPECTATOR CHECK-IN
          </CardTitle>
          <CardDescription className="text-base">
            Isi data diri untuk mendapatkan Digital Voucher Doorprise!
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-8">
          {state.success ? (
            <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
              
              {/* KODE VOUCHER */}
              <div className="bg-secondary/30 p-6 rounded-2xl border-2 border-dashed border-primary/30 mb-6 relative overflow-hidden group">
                <p className="text-sm text-muted-foreground mb-2 font-medium uppercase tracking-wider">Kode Voucher Anda</p>
                <div className="text-5xl font-black font-mono text-primary tracking-wider select-all drop-shadow-sm">
                  {state.voucherCode}
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className={`flex items-center justify-center gap-2 font-bold ${state.isExisting ? 'text-amber-600' : 'text-green-600'}`}>
                  <CheckCircle2 className="w-6 h-6" />
                  {state.isExisting ? "Data Sudah Terdaftar" : "Check-in Berhasil!"}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed px-4">
                  Simpan kode ini untuk pengundian Doorprise.
                </p>
              </div>

              {/* 1. SPONSOR PASSPORT */}
              <div className="mb-6 text-left">
                  <PassportWidget visitorId={state.visitorId} />
              </div>

              {/* 2. VOTING */}
              <div className="mb-6 text-left">
                 <VoteWidget visitorId={state.visitorId} />
              </div>

              {/* 3. LEADERBOARD */}
              <div className="mb-6 text-left">
                 <LeaderboardWidget />
              </div>
              
              <Button onClick={() => window.location.reload()} variant="ghost" className="w-full mt-8 text-muted-foreground hover:text-foreground">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Halaman
              </Button>
            </div>
          ) : (
            <form action={formAction} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base">Nama Panggilan</Label>
                <Input id="name" name="name" placeholder="Budi" className="h-12 text-lg bg-secondary/20" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="text-base">Nomor WhatsApp</Label>
                <Input id="whatsapp" name="whatsapp" type="tel" placeholder="0812..." className="h-12 text-lg bg-secondary/20" required />
              </div>
              {state.message && !state.success && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm text-center font-medium">
                  {state.message}
                </div>
              )}
              <SubmitButton />
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
