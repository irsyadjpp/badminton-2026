"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Users, CalendarClock, ArrowRight } from 'lucide-react';
import { Countdown } from '@/components/countdown';

export function HeroSection() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-stadium');

  return (
    <section className="relative h-[110vh] min-h-[750px] w-full flex items-center justify-center text-white overflow-hidden">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          priority
          className="object-cover scale-110 blur-sm"
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-black/80 to-black/60" />
      <div className="relative z-10 container mx-auto px-4 text-center mt-[-10vh]">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-headline uppercase tracking-tighter mb-4 animate-fade-in-down bg-clip-text text-transparent bg-gradient-to-r from-primary via-red-400 to-white">
          Bandung Community Championship 2026
        </h1>
        <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-12 font-body animate-fade-in-up">
          Integritas, Solidaritas, <span className="text-primary font-bold">Kejayaan.</span>
        </p>
        <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-8 px-12 rounded-full transition-transform transform hover:scale-105 group shadow-[0_0_20px_hsl(var(--primary))]">
            <Link href="https://indonesia.ayo.co.id/">
              DAFTAR SEKARANG
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
            </Link>
          </Button>
        </div>

        <div className="absolute bottom-[-200px] left-1/2 -translate-x-1/2 w-[90%] max-w-4xl">
            <Card className="bg-background/50 backdrop-blur-xl border-t-2 border-primary/50 shadow-2xl shadow-primary/10">
                <CardContent className="p-4 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-foreground">
                    <div className="flex flex-col items-center justify-center p-2 rounded-lg">
                        <Users className="h-7 w-7 mb-2 text-primary" />
                        <h3 className="font-headline text-base font-semibold text-muted-foreground uppercase tracking-widest">Slot Terisi</h3>
                        <p className="text-4xl md:text-5xl font-bold font-headline">80 / 96</p>
                        <p className="text-sm text-muted-foreground">Tim Sudah Terverifikasi</p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 rounded-lg">
                        <CalendarClock className="h-7 w-7 mb-2 text-primary" />
                        <h3 className="font-headline text-base font-semibold text-muted-foreground uppercase tracking-widest">Hitung Mundur</h3>
                        <Countdown targetDate="2026-06-13" />
                        <p className="text-sm text-muted-foreground">Hari Menuju Kick-off</p>
                    </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </section>
  );
}
