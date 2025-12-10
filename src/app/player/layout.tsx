
'use client';

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// A new, dedicated background component for the player section
function PlayerBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden bg-zinc-950">
      {/* 1. Base Gradient (Sporty but distinct from admin) */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-950 opacity-95" />

      {/* 2. Noise Texture */}
      <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10 mix-blend-overlay" />

      {/* 3. Sporty Grid Pattern (Subtle) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* 4. Ambient Glows (Player Theme: Cyan/Indigo) */}
      <div className="absolute -top-[15%] -right-[15%] w-[700px] h-[700px] bg-cyan-500/10 rounded-full blur-[150px] animate-pulse-slow" />
      <div className="absolute -bottom-[15%] -left-[15%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
    </div>
  );
}


export default function PlayerLayout({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="relative flex flex-col min-h-screen bg-transparent overflow-hidden">
      <div className="fixed inset-0 -z-50 pointer-events-none">
        {/* Use the new PlayerBackground instead of AdminBackground */}
        <PlayerBackground />
      </div>
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4 sm:px-6 bg-black/40 backdrop-blur-md border-b border-white/5 sticky top-0 z-40">
        <div>
            <Button variant="ghost" size="icon" asChild>
                <Link href="/"><Home className="w-4 h-4" /></Link>
            </Button>
        </div>
        <div className="flex items-center gap-2">
            {isMounted && <ThemeToggle />}
        </div>
      </header>
      <main className="relative z-10 flex-1 overflow-auto scroll-smooth">
        {children}
      </main>
    </div>
  );
}
