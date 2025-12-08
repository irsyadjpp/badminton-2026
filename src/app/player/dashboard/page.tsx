
'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, Calendar, Users, Activity, QrCode, 
  ArrowRight, Shield, Zap, TrendingUp, Edit3 
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { QRCodeSVG } from "qrcode.react";

export default function PlayerDashboard() {
  // Mock Data
  const stats = { wins: 12, losses: 4, rank: 24, points: 4500 };
  const nextMatch = {
    event: "Ganda Putra Open (R16)",
    opponent: "Ahsan / Hendra",
    court: "Court 1",
    time: "Besok, 14:00 WIB",
    status: "CONFIRMED"
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 font-body">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b border-zinc-800 pb-8">
        <div className="flex items-center gap-6">
            <div className="relative">
                <Avatar className="w-20 h-20 md:w-24 md:h-24 border-4 border-zinc-800 shadow-2xl">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>KS</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-black">
                    PRO
                </div>
            </div>
            <div>
                <h1 className="text-3xl md:text-4xl font-black font-headline uppercase tracking-tight">Kevin Sanjaya</h1>
                <div className="flex items-center gap-3 text-zinc-400 mt-1">
                    <Badge variant="outline" className="border-zinc-700 text-zinc-400">ID: P-102938</Badge>
                    <span className="flex items-center gap-1 text-sm"><Shield className="w-3 h-3 text-green-500"/> PB Djarum</span>
                </div>
            </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
            <Button asChild variant="outline" className="flex-1 md:flex-none border-zinc-700 hover:bg-zinc-800">
                <Link href="/player/profile"><Edit3 className="w-4 h-4 mr-2"/> Edit Profil</Link>
            </Button>
            <Button className="flex-1 md:flex-none bg-primary hover:bg-red-700 font-bold">
                <QrCode className="w-4 h-4 mr-2"/> My ID Card
            </Button>
        </div>
      </div>

      {/* --- MAIN GRID LAYOUT --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
        {/* KOLOM KIRI: STATUS UTAMA (2/4 Lebar di Desktop) */}
        <div className="md:col-span-2 lg:col-span-2 space-y-6">
            
            {/* NEXT MATCH CARD (HERO) */}
            <Card className="bg-gradient-to-br from-zinc-900 to-black border-l-4 border-l-primary border-y-0 border-r-0 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] group-hover:bg-primary/20 transition-all"></div>
                <CardContent className="p-8 relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <Badge className="bg-primary text-white px-3 py-1 animate-pulse">NEXT MATCH</Badge>
                        <span className="text-zinc-400 font-mono text-sm">{nextMatch.time}</span>
                    </div>
                    
                    <div className="flex items-center justify-between gap-4 mb-8">
                        <div>
                            <div className="text-sm text-zinc-500 uppercase font-bold mb-1">Anda</div>
                            <div className="text-2xl md:text-3xl font-black text-white">Kevin / Marcus</div>
                        </div>
                        <div className="text-xl font-black text-zinc-700 italic">VS</div>
                        <div className="text-right">
                            <div className="text-sm text-zinc-500 uppercase font-bold mb-1">Lawan</div>
                            <div className="text-2xl md:text-3xl font-black text-white">{nextMatch.opponent}</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-zinc-300 bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
                        <div className="flex items-center gap-2"><Trophy className="w-4 h-4 text-yellow-500"/> {nextMatch.event}</div>
                        <div className="h-4 w-[1px] bg-zinc-700"></div>
                        <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-500"/> {nextMatch.court}</div>
                    </div>
                </CardContent>
            </Card>

            {/* PERFORMANCE STATS */}
            <div className="grid grid-cols-2 gap-4">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                        <div className="text-zinc-500 text-xs uppercase font-bold mb-2 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4"/> Win Rate
                        </div>
                        <div className="text-4xl font-black text-white">75%</div>
                        <Progress value={75} className="h-1 mt-4 bg-zinc-800" indicatorClassName="bg-green-500"/>
                        <p className="text-xs text-zinc-500 mt-2">{stats.wins} Menang - {stats.losses} Kalah</p>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                        <div className="text-zinc-500 text-xs uppercase font-bold mb-2 flex items-center gap-2">
                            <Zap className="w-4 h-4"/> Total Poin
                        </div>
                        <div className="text-4xl font-black text-white">{stats.points}</div>
                        <div className="text-xs text-green-500 mt-2 flex items-center gap-1">
                            <ArrowRight className="w-3 h-3 rotate-[-45deg]"/> +120 minggu ini
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>

        {/* KOLOM KANAN: TOOLS & INFO (1/3 Lebar di Desktop) */}
        <div className="md:col-span-1 lg:col-span-2 space-y-6">
            
            {/* DIGITAL ID (QR) */}
            <Card className="bg-white text-black border-none shadow-xl overflow-hidden">
                <CardHeader className="bg-zinc-100 border-b border-zinc-200 pb-3">
                    <CardTitle className="text-sm uppercase font-bold text-zinc-500 flex justify-between items-center">
                        Access Pass <QrCode className="w-4 h-4"/>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                    <div className="p-2 border-2 border-black rounded-lg mb-4">
                        <QRCodeSVG value="P-102938" size={140} />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Scan di Gate Masuk</p>
                </CardContent>
            </Card>

            {/* TEAMMATES MINI LIST */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold text-zinc-400 uppercase flex items-center gap-2">
                        <Users className="w-4 h-4"/> Rekan Tim (PB Djarum)
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {['Fajar Alfian', 'Rian Ardianto', 'Leo Rolly'].map((name, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer">
                            <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center text-xs font-bold">
                                {name.charAt(0)}
                            </div>
                            <span className="text-sm font-medium">{name}</span>
                        </div>
                    ))}
                    <Button variant="link" className="w-full text-xs text-zinc-500">Lihat Semua Anggota →</Button>
                </CardContent>
            </Card>

        </div>
      </div>
    </div>
  );
}
