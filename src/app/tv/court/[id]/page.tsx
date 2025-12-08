
'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

// Mock Data Live Score (Nanti fetch dari DB berdasarkan param ID Court)
const MOCK_LIVE = {
  court: "1",
  category: "GANDA PUTRA (MD) - SEMI FINAL",
  matchId: "M-SF01",
  teamA: { name: "Kevin Sanjaya / Marcus Gideon", country: "INA", score: 18, sets: [21] }, // Menang set 1
  teamB: { name: "Takuro Hoki / Yugo Kobayashi", country: "JPN", score: 16, sets: [19] }, // Kalah set 1
  currentSet: 2,
  server: 'A' // Siapa yang sedang servis
};

export default function TVScoreboard({ params }: { params: { id: string } }) {
  const [data, setData] = useState(MOCK_LIVE);

  // Auto-refresh setiap 1 detik untuk real-time feel
  useEffect(() => {
    const interval = setInterval(() => {
        // Fetch logic here...
        // setData(newData);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-screen h-screen bg-black text-white overflow-hidden flex flex-col font-sans">
      
      {/* HEADER */}
      <div className="h-20 bg-gradient-to-r from-red-700 to-black flex items-center justify-between px-8 border-b-4 border-yellow-500">
        <div className="flex items-center gap-4">
            <Image src="/images/logo.png" width={60} height={60} alt="Logo" />
            <div>
                <h1 className="text-2xl font-black font-headline tracking-widest">BCC 2026</h1>
                <p className="text-sm font-bold text-yellow-400 tracking-wider">BANDUNG COMMUNITY CHAMPIONSHIP</p>
            </div>
        </div>
        <div className="text-right">
            <div className="text-3xl font-black bg-white text-black px-4 py-1 rounded">COURT {params.id}</div>
        </div>
      </div>

      {/* SCORE AREA */}
      <div className="flex-grow flex items-center justify-center p-10 gap-8">
        
        {/* TEAM A */}
        <div className="flex-1 h-full bg-zinc-900 rounded-3xl border-4 border-zinc-800 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
            {data.server === 'A' && <div className="absolute top-0 left-0 w-full h-4 bg-green-500 animate-pulse shadow-[0_0_50px_#22c55e]"></div>}
            
            <div className="text-4xl font-bold text-zinc-400 mb-2">{data.teamA.country}</div>
            <div className="text-5xl font-black text-center leading-tight mb-8 px-4 font-headline uppercase">
                {data.teamA.name.split("/").map((n, i) => <div key={i}>{n.trim()}</div>)}
            </div>
            
            {/* BIG POINTS */}
            <div className="text-[250px] font-black leading-none text-white tracking-tighter shadow-black drop-shadow-2xl">
                {data.teamA.score}
            </div>
        </div>

        {/* VS / SETS INFO */}
        <div className="w-48 flex flex-col items-center gap-6">
            <div className="text-2xl font-bold text-zinc-500 bg-zinc-900 px-4 py-2 rounded-full">SET {data.currentSet}</div>
            
            {/* Previous Sets History */}
            <div className="space-y-2 w-full">
                <div className="flex justify-between text-2xl font-bold text-zinc-400 border-b border-zinc-800 pb-2">
                    <span>{data.teamA.sets[0]}</span>
                    <span className="text-zinc-600">-</span>
                    <span>{data.teamB.sets[0]}</span>
                </div>
                {/* Placeholder Set 2 & 3 */}
                <div className="flex justify-between text-2xl font-bold text-zinc-600">
                    <span>-</span><span>-</span><span>-</span>
                </div>
            </div>

            <div className="mt-10">
                <Badge variant="outline" className="text-xl px-4 py-2 border-primary text-primary animate-pulse">LIVE</Badge>
            </div>
        </div>

        {/* TEAM B */}
        <div className="flex-1 h-full bg-zinc-900 rounded-3xl border-4 border-zinc-800 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
            {data.server === 'B' && <div className="absolute top-0 left-0 w-full h-4 bg-green-500 animate-pulse shadow-[0_0_50px_#22c55e]"></div>}
            
            <div className="text-4xl font-bold text-zinc-400 mb-2">{data.teamB.country}</div>
            <div className="text-5xl font-black text-center leading-tight mb-8 px-4 font-headline uppercase">
                {data.teamB.name.split("/").map((n, i) => <div key={i}>{n.trim()}</div>)}
            </div>
            
            {/* BIG POINTS */}
            <div className="text-[250px] font-black leading-none text-yellow-500 tracking-tighter shadow-black drop-shadow-2xl">
                {data.teamB.score}
            </div>
        </div>

      </div>

      {/* FOOTER RUNNING TEXT */}
      <div className="h-12 bg-black border-t border-zinc-800 flex items-center overflow-hidden">
        <div className="whitespace-nowrap animate-marquee text-lg font-bold text-zinc-400 px-4">
            NEXT MATCH: [MD-OPEN] Mohammad Ahsan / Hendra Setiawan (INA) vs Leo Rolly Carnando / Daniel Marthin (INA) • ESTIMATED TIME: 14:30 WIB • SPONSORED BY BANK BJB
        </div>
      </div>
    </div>
  );
}
