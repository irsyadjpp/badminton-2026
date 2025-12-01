export function CourtLines() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
      {/* Garis Tengah Lapangan (Vertikal) */}
      <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-foreground/20 -translate-x-1/2" />
      
      {/* Garis Serang (Horizontal) - Atas */}
      <div className="absolute left-0 right-0 top-[30%] h-[2px] bg-foreground/20" />
      
      {/* Garis Serang (Horizontal) - Bawah */}
      <div className="absolute left-0 right-0 bottom-[30%] h-[2px] bg-foreground/20" />
      
      {/* Shuttlecock Melayang (Animasi Floating) */}
      <div className="absolute top-[20%] right-[10%] animate-float opacity-30">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary rotate-45">
            <path d="M12 2L12 22" />
            <path d="M2 12L22 12" />
            <circle cx="12" cy="12" r="10" />
        </svg>
      </div>
       <div className="absolute bottom-[20%] left-[5%] animate-float opacity-20" style={{ animationDelay: '2s' }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-foreground -rotate-12">
             <path d="M18.6 18.6L12 12L5.4 5.4" />
             <path d="M5.4 18.6L18.6 5.4" />
        </svg>
      </div>
    </div>
  );
}
