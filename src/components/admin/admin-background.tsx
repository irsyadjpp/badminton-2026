'use client';

export function AdminBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-zinc-950">
      
      {/* 1. Base Gradient (Deep Depth) */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900 to-black opacity-90" />

      {/* 2. Noise Texture (Untuk kesan 'Gritty/Sporty') */}
      {/* Pastikan Anda punya noise.png atau hapus baris ini jika ingin polos */}
      <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-20 mix-blend-overlay" />

      {/* 3. Sporty Grid Pattern (Subtle) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* 4. Ambient Glows (Gen-Z Style) */}
      {/* Primary Glow (Top Right - Red/Orange) */}
      <div className="absolute -top-[10%] -right-[10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-pulse-slow mix-blend-screen" />
      
      {/* Secondary Glow (Bottom Left - Deep Blue) */}
      <div className="absolute -bottom-[10%] -left-[10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] mix-blend-screen" />

      {/* 5. Center Spotlight (Fokus ke konten tengah) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

    </div>
  );
}
