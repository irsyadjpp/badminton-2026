"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarClock, ArrowRight } from 'lucide-react';
import { Countdown } from '@/components/countdown';

export function HeroSection() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-stadium');
  
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const href = e.currentTarget.href;
    const targetId = href.replace(/.*#/, "");
    const elem = document.getElementById(targetId);
    elem?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative bg-white text-foreground">
      <div className="relative h-[70vh] md:h-[75vh] flex items-center justify-start">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            priority
            className="object-cover opacity-10"
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white to-transparent" />
        
        <div className="relative z-10 container mx-auto px-4 text-left">
          <div className="max-w-xl">
             <p className="text-lg md:text-xl text-primary font-bold mb-4 font-body animate-fade-in-up">
              BANDUNG COMMUNITY CHAMPIONSHIP 2026
            </p>
            <h1 className="text-4xl md:text-[64px] leading-tight font-bold font-headline uppercase tracking-tighter mb-4 text-foreground animate-fade-in-down">
              Integritas, Solidaritas, dan Kejayaan
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-8 font-body animate-fade-in-up">
              Turnamen bulutangkis antar komunitas terbesar di Bandung akan segera hadir.
            </p>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base py-6 px-8 rounded-lg transition-transform transform hover:scale-105 group shadow-lg shadow-primary/20">
                <a href="#contact" onClick={handleScroll}>
                  HUBUNGI KAMI
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4 items-center">
                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-center gap-4 p-4 rounded-lg">
                     <CalendarClock className="h-7 w-7 text-primary-foreground/80" />
                    <div className="text-center sm:text-left">
                        <h3 className="font-headline text-sm font-semibold text-primary-foreground/80 uppercase tracking-widest">Kick-off</h3>
                        <Countdown targetDate="2026-06-13" />
                    </div>
                </div>
              </div>
        </div>
      </div>
    </section>
  );
}
