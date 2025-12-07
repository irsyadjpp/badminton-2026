'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CalendarClock, ArrowRight, FileDown } from 'lucide-react';
import { Countdown } from '@/components/countdown';
import { CourtLines } from '@/components/ui/court-lines';

export function HeroSection() {
  
  return (
    <section className="relative bg-black text-white overflow-hidden">
      
      {/* BACKGROUND IMAGE & ANIMATION */}
      <div className="absolute inset-0 z-0">
        {/* Latar Belakang Gambar Stadion */}
        <div className="relative h-full w-full animate-zoom-slow">
            <Image
            src="/images/gor-koni.jpg"
            alt="GOR KONI Bandung"
            fill
            priority
            className="object-cover opacity-50" 
            />
        </div>
        
        {/* Overlay Gradasi Hitam */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40" />
        
        {/* Animasi Garis Lapangan & Shuttlecock */}
        <CourtLines />

        {/* Efek Partikel/Debu Stadion */}
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-20 mix-blend-overlay"></div>
      </div>
      
      <div className="relative z-10 flex min-h-[90vh] items-center pt-20 md:min-h-[75vh] md:pt-0">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
             {/* Badge Kecil */}
             <div className="flex flex-wrap gap-2 mb-6 animate-fade-in-down" style={{ animationDelay: '0.1s' }}>
                <span className="inline-flex items-center rounded-full border border-primary/50 bg-primary/20 px-3 py-1 text-sm font-medium text-white backdrop-blur-md shadow-[0_0_15px_rgba(210,35,42,0.5)]">
                    🏆 Perebutkan Piala Bergilir Juara Umum
                </span>
                <span className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur-md">
                    💰 Total Hadiah 42 Juta+
                </span>
            </div>

            <p className="text-lg md:text-xl text-primary font-bold mb-2 font-body tracking-widest uppercase animate-fade-in-up">
              Bandung Community Championship 2026
            </p>
            
            {/* Judul Besar */}
            <h1 className="text-5xl md:text-[80px] leading-[0.9] font-black font-headline text-white mb-6 animate-fade-in-up tracking-tighter drop-shadow-2xl">
              INTEGRITAS.<br/>
              SOLIDARITAS.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">SPORTIVITAS.</span>
            </h1>
            
            <p className="text-lg md:text-2xl text-gray-300 max-w-2xl mb-10 font-body animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.3s' }}>
              Turnamen bulutangkis antar komunitas terbesar di Bandung. <br/>
              <span className="text-white font-semibold">13 Juni - 5 Juli 2026 | GOR KONI Bandung</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg h-14 px-8 rounded-lg shadow-[0_0_20px_rgba(210,35,42,0.4)] hover:shadow-[0_0_30px_rgba(210,35,42,0.6)] transition-all transform hover:-translate-y-1">
                <Link href="/manager/login">
                  DAFTAR SEKARANG
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="bg-transparent border-white/30 text-white hover:bg-white/10 font-bold text-lg h-14 px-8 rounded-lg backdrop-blur-sm transition-all">
                <a href="/handbook-bcc-2026.pdf" target="_blank" rel="noopener noreferrer">
                  <FileDown className="mr-2 h-6 w-6" />
                  UNDUH HANDBOOK
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Widget Countdown (Bagian Bawah) */}
      <div className="relative z-20 bg-black/80 backdrop-blur-md border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                     <div className="p-3 bg-primary/20 rounded-full animate-pulse-slow">
                        <CalendarClock className="h-8 w-8 text-primary" />
                     </div>
                    <div>
                        <h3 className="font-headline text-sm font-semibold text-gray-400 uppercase tracking-widest">Kick-off Pendaftaran</h3>
                        <p className="text-white font-bold">1 Januari 2026</p>
                    </div>
                </div>
                {/* Garis Pemisah Visual */}
                <div className="hidden md:block w-px h-12 bg-white/10"></div>
                
                <div className="flex-grow flex justify-center md:justify-end text-white">
                    <Countdown targetDate="2026-01-01" />
                </div>
              </div>
        </div>
      </div>
    </section>
  );
}