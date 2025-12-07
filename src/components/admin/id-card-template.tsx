"use client";

import React, { forwardRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";

interface IdCardProps {
  user: {
    name: string;
    role: string;
    division: string;
    id_number: string;
    avatar: string;
    photoUrl?: string; 
  };
  className?: string; // Tambahkan prop className agar fleksibel
}

export const IdCardTemplate = forwardRef<HTMLDivElement, IdCardProps>(({ user, className }, ref) => {
  const photo = user.photoUrl || user.avatar;

  return (
    // Hapus 'hidden-on-screen', ganti dengan style fleksibel tapi tetap fixed width
    <div ref={ref} className={cn("flex gap-4 p-4 bg-white text-black font-sans box-border w-[650px]", className)}>
      
      {/* --- SISI DEPAN (FRONT) --- */}
      <div className="relative w-[300px] h-[480px] bg-black overflow-hidden flex flex-col rounded-xl shadow-xl shrink-0 border border-zinc-800">
        
        {/* Background Texture & Accents */}
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-30 mix-blend-overlay z-10" />
        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-primary blur-[80px] opacity-60 z-0" />
        <div className="absolute bottom-0 left-0 w-[150px] h-[150px] bg-blue-600 blur-[60px] opacity-40 z-0" />
        
        {/* Header Logo - DIPERBAIKI */}
        <div className="relative z-20 p-4 flex justify-between items-center">
             <div className="flex items-center gap-2">
                {/* Logo BCC */}
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center p-1">
                    <img src="/images/logo.png" alt="BCC" className="w-full h-full object-contain" />
                </div>
                <span className="text-white font-bold tracking-widest text-xs">BCC 2026</span>
             </div>
             {/* Logo PBSI - Filter dikurangi agar aman */}
             <div className="w-12 h-8 flex items-center justify-end">
                <img 
                    src="/images/logo-pbsi.png" 
                    alt="PBSI" 
                    className="h-full w-auto object-contain brightness-0 invert" 
                />
             </div>
        </div>

        {/* Photo Area */}
        <div className="relative z-20 mt-4 mx-auto w-[180px] h-[180px]">
            <div className="absolute inset-0 border-2 border-primary/50 rounded-full animate-pulse-slow"></div>
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg bg-zinc-800">
                <img 
                    src={photo} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous" 
                />
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md whitespace-nowrap">
                {user.role}
            </div>
        </div>

        {/* Identity Info */}
        <div className="relative z-20 flex-grow flex flex-col items-center justify-center text-center p-4 mt-2">
            <h2 className="text-2xl font-black font-headline text-white uppercase leading-none mb-1">
                {user.name.split(" ")[0]}
            </h2>
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">
                {user.name.split(" ").slice(1).join(" ")}
            </h3>

            <div className="w-full border-t border-white/20 my-2"></div>
            
            <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">DIVISI</p>
            <p className="text-lg font-black text-primary uppercase">{user.division}</p>
        </div>

        {/* Footer Bar */}
        <div className="relative z-20 bg-white h-10 flex items-center justify-between px-4 mt-auto">
             <span className="text-black font-mono font-bold text-xs">{user.id_number}</span>
             <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
             </div>
        </div>
      </div>

      {/* --- SISI BELAKANG (BACK) --- */}
      <div className="relative w-[300px] h-[480px] bg-zinc-900 overflow-hidden flex flex-col rounded-xl shadow-xl shrink-0 border border-zinc-700">
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-20 mix-blend-overlay z-10" />
        
        <div className="relative z-20 p-6 flex flex-col h-full items-center text-center">
            <h4 className="text-white font-bold uppercase tracking-widest text-[10px] mb-8 border-b border-primary pb-2">
                Official Access Pass
            </h4>

            <div className="bg-white p-2 rounded-lg shadow-lg mb-6">
                <QRCodeSVG value={`https://bcc2026.com/verify/${user.id_number}`} size={100} />
            </div>

            <p className="text-[9px] text-zinc-400 leading-relaxed mb-4 px-2">
                Kartu ini adalah tanda pengenal resmi Panitia BCC 2026. 
                Wajib dikenakan selama bertugas di area GOR KONI.
                Kehilangan kartu dikenakan denda Rp 50.000.
            </p>

            <div className="mt-auto w-full">
                <div className="border-t border-dashed border-zinc-700 pt-4">
                    <p className="text-[8px] text-zinc-500 mb-2">Authorized By:</p>
                    <div className="h-8 w-20 mx-auto bg-contain bg-no-repeat bg-center opacity-70 border border-dashed border-zinc-800"></div> 
                    <p className="text-xs font-bold text-white mt-1">IRSYAD JAMAL</p>
                    <p className="text-[8px] text-primary uppercase">Project Director</p>
                </div>
            </div>
        </div>
      </div>

    </div>
  );
});

IdCardTemplate.displayName = "IdCardTemplate";
