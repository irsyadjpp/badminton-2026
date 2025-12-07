"use client";

import { cn } from "@/lib/utils";

export function CourtLines() {
  const ShuttlecockIcon = ({ className }: { className?: string }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      className={cn("text-primary", className)}
    >
      <path d="M12 2v20" />
      <path d="M17 2l-5 5-5-5" />
      <path d="M17 22l-5-5-5 5" />
    </svg>
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-10">
      {/* Garis Lapangan */}
      <div className="absolute top-[20%] bottom-[20%] left-[10%] right-[10%] border-x border-foreground/30">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-[2px] bg-foreground/30"></div>
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-foreground/30"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground/30"></div>
      </div>

      {/* Elemen Shuttlecock Animasi */}
      <ShuttlecockIcon className="absolute top-[15%] left-[5%] w-16 h-16 rotate-12 animate-float" />
      <ShuttlecockIcon
        className="absolute bottom-[10%] right-[8%] w-24 h-24 -rotate-45 animate-float"
        style={{ animationDelay: "2s" }}
      />
       <ShuttlecockIcon
        className="absolute top-[40%] right-[15%] w-10 h-10 rotate-90 animate-float text-foreground/50"
        style={{ animationDelay: "4s" }}
      />
    </div>
  );
}