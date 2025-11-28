"use client";

import React from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ShieldCheck, Trophy, PartyPopper, ArrowLeft, ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const valueProps = [
  {
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    title: "Sistem Anti-Sandbagging",
    description: "Kompetisi adil dengan verifikasi video untuk setiap pemain, memastikan integritas turnamen.",
  },
  {
    icon: <Trophy className="w-8 h-8 text-primary" />,
    title: "Total Hadiah Rp 42 Juta+",
    description: "Rebut total hadiah lebih dari 42 juta Rupiah dan buktikan supremasi komunitasmu.",
  },
  {
    icon: <PartyPopper className="w-8 h-8 text-primary" />,
    title: "WBD Celebration",
    description: "Rayakan World Basketball Day pada 5 Juli 2026 dengan acara puncak yang meriah dan tak terlupakan.",
  },
];

export function ValuePropositionSection() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  const sliderImage = PlaceHolderImages.find(img => img.id === 'slider-phone-mockup');

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = React.useCallback(() => {
    api?.scrollNext()
  }, [api])

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center items-center">
            {sliderImage && (
              <Image
                src={sliderImage.imageUrl}
                alt={sliderImage.description}
                width={400}
                height={800}
                className="rounded-xl shadow-lg"
                data-ai-hint={sliderImage.imageHint}
              />
            )}
          </div>
          <div className="text-left">
            <h3 className="font-headline text-sm font-semibold text-primary uppercase tracking-widest mb-2">Kenapa Harus Ikut?</h3>
            
            <Carousel setApi={setApi} className="w-full">
              <CarouselContent>
                {valueProps.map((prop, index) => (
                  <CarouselItem key={index}>
                      <div>
                        <h2 className="text-4xl md:text-5xl font-black font-headline text-foreground mb-4">{prop.title}</h2>
                        <p className="text-lg text-muted-foreground font-body">
                          {prop.description}
                        </p>
                      </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            
            <div className="flex items-center gap-4 mt-8">
                <div className="font-mono text-lg font-medium text-foreground">
                    <span>{String(current).padStart(2, '0')}</span>
                    <span className="text-muted-foreground">/</span>
                    <span>{String(count).padStart(2, '0')}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={scrollPrev} disabled={current === 1}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={scrollNext} disabled={current === count}>
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
