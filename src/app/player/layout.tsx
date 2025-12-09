
'use client';

import { AdminBackground } from "@/components/admin/admin-background";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";

export default function PlayerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col min-h-screen bg-transparent overflow-hidden">
      <div className="fixed inset-0 -z-50 pointer-events-none">
        <AdminBackground />
      </div>
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4 sm:px-6 bg-black/40 backdrop-blur-md border-b border-white/5 sticky top-0 z-40">
        {/* Placeholder for potential logo/title on the left */}
        <div>
            <Button variant="ghost" size="icon" asChild>
                <Link href="/"><Home className="w-4 h-4" /></Link>
            </Button>
        </div>
        <div className="flex items-center gap-2">
            <ThemeToggle />
        </div>
      </header>
      <main className="relative z-10 flex-1 overflow-auto scroll-smooth">
        {children}
      </main>
    </div>
  );
}
