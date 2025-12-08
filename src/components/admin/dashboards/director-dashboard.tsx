'use client';

import { 
  TrendingUp, Users, AlertTriangle, Activity, 
  Wallet, Calendar, ArrowUpRight, Zap, 
  CheckCircle2, Clock, Megaphone, Target
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function DirectorDashboard() {
  return (
    <div className="space-y-8 p-4 md:p-8 font-body pb-24">
      
      {/* HEADER: GREETING & STATUS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <Badge className="rounded-full px-3 py-1 bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20 backdrop-blur-md animate-pulse">
                    ● LIVE EVENT: DAY 2
                </Badge>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">GOR KONI BANDUNG</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-headline uppercase tracking-tighter text-white">
                Director <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">Overview</span>
            </h1>
            <p className="text-zinc-400 mt-2 max-w-xl text-lg">
                Pantauan strategis real-time: Keuangan, Operasional, dan Isu Kritis.
            </p>
        </div>
        
        <div className="flex gap-3">
            <Button className="h-14 rounded-full px-8 bg-white text-black hover:bg-zinc-200 font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                <Zap className="mr-2 w-5 h-5"/> Quick Action
            </Button>
        </div>
      </div>

      {/* --- BENTO GRID LAYOUT --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* 1. FINANCIAL HEALTH (LARGE CARD) */}
        <Card className="lg:col-span-2 bg-zinc-900 border-zinc-800 rounded-[32px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px] group-hover:bg-green-500/20 transition-all"></div>
            <CardContent className="p-8">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <p className="text-zinc-400 font-bold uppercase text-xs tracking-widest mb-1">Total Revenue (Gross)</p>
                        <h2 className="text-5xl font-black text-white tracking-tight">Rp 450.0M</h2>
                    </div>
                    <div className="bg-green-900/30 p-3 rounded-2xl">
                        <Wallet className="w-8 h-8 text-green-500"/>
                    </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-black/40 rounded-2xl border border-zinc-800">
                        <p className="text-[10px] text-zinc-500 uppercase font-bold">Sponsorship</p>
                        <p className="text-xl font-bold text-white mt-1">85%</p>
                        <Progress value={85} className="h-1.5 mt-2 bg-zinc-800" indicatorClassName="bg-green-500"/>
                    </div>
                    <div className="p-4 bg-black/40 rounded-2xl border border-zinc-800">
                        <p className="text-[10px] text-zinc-500 uppercase font-bold">Registrasi</p>
                        <p className="text-xl font-bold text-white mt-1">92%</p>
                        <Progress value={92} className="h-1.5 mt-2 bg-zinc-800" indicatorClassName="bg-blue-500"/>
                    </div>
                    <div className="p-4 bg-black/40 rounded-2xl border border-zinc-800">
                        <p className="text-[10px] text-zinc-500 uppercase font-bold">Tenant/Bazaar</p>
                        <p className="text-xl font-bold text-white mt-1">60%</p>
                        <Progress value={60} className="h-1.5 mt-2 bg-zinc-800" indicatorClassName="bg-orange-500"/>
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* 2. CRITICAL ISSUES (ALERT CARD) */}
        <Card className="bg-red-900/10 border-red-900/30 rounded-[32px] relative overflow-hidden">
            <CardContent className="p-8 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                    <div className="p-3 bg-red-500/20 rounded-2xl text-red-500 animate-pulse">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <Badge className="bg-red-500 text-white border-none font-bold">3 OPEN</Badge>
                </div>
                <div>
                    <h3 className="text-3xl font-black text-red-500 mb-1">Critical Issues</h3>
                    <p className="text-red-300/70 text-sm font-medium leading-relaxed">
                        Perlu keputusan segera: Protes Tim Djarum, AC Hall B Mati, Izin Keramaian (Polsek).
                    </p>
                </div>
                <Button className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold">
                    Resolve Now <ArrowUpRight className="ml-2 w-4 h-4"/>
                </Button>
            </CardContent>
        </Card>

        {/* 3. PARTICIPANT STATS */}
        <Card className="bg-zinc-900 border-zinc-800 rounded-[32px]">
            <CardContent className="p-8 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                    <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
                        <Users className="w-8 h-8" />
                    </div>
                    <Badge variant="outline" className="border-blue-500/30 text-blue-400 font-bold">+12% YoY</Badge>
                </div>
                <div>
                    <h3 className="text-4xl font-black text-white mb-1">1,240</h3>
                    <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Total Atlet</p>
                </div>
                <div className="flex items-center gap-[-10px]">
                    <div className="flex -space-x-3">
                        {[1,2,3,4].map(i => (
                            <Avatar key={i} className="w-8 h-8 border-2 border-zinc-900">
                                <AvatarImage src={`https://i.pravatar.cc/100?img=${i}`} />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                        ))}
                    </div>
                    <span className="ml-4 text-xs text-zinc-400">+150 Teams</span>
                </div>
            </CardContent>
        </Card>

        {/* 4. LIVE RUNDOWN (TALL CARD) */}
        <Card className="lg:col-span-1 lg:row-span-2 bg-zinc-950 border-zinc-800 rounded-[32px] overflow-hidden flex flex-col">
            <CardHeader className="p-8 pb-4 bg-zinc-900/50">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary"/> Live Rundown
                    </CardTitle>
                    <Badge variant="secondary" className="bg-zinc-800 text-zinc-400">SESSION 2</Badge>
                </div>
            </CardHeader>
            <ScrollArea className="flex-1 p-0">
                <div className="space-y-1 p-4">
                    {[
                        { time: "09:00", event: "Penyisihan Ganda Putra", status: "DONE" },
                        { time: "11:30", event: "Ishoma / Break", status: "DONE" },
                        { time: "13:00", event: "Penyisihan Ganda Campuran", status: "LIVE" },
                        { time: "15:00", event: "Exhibition Match (Kevin S)", status: "NEXT" },
                        { time: "16:30", event: "Doorprize Utama", status: "UPCOMING" },
                        { time: "17:00", event: "Quarter Final - MD", status: "UPCOMING" },
                    ].map((item, i) => (
                        <div key={i} className={cn(
                            "flex gap-4 p-4 rounded-2xl transition-all",
                            item.status === 'LIVE' ? "bg-primary text-white shadow-lg scale-105" : 
                            item.status === 'DONE' ? "opacity-50" : "bg-zinc-900/50 text-zinc-400"
                        )}>
                            <div className="font-mono font-bold text-sm w-12">{item.time}</div>
                            <div className="flex-1">
                                <p className="font-bold text-sm leading-tight">{item.event}</p>
                                {item.status === 'LIVE' && <span className="text-[10px] uppercase font-black tracking-wider animate-pulse">● On Air</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </Card>

        {/* 5. MATCH CONTROL STATUS (WIDE) */}
        <Card className="lg:col-span-3 bg-zinc-900 border-zinc-800 rounded-[32px] overflow-hidden">
            <CardHeader className="p-8 pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                        <Activity className="w-6 h-6 text-orange-500"/> Field Operations
                    </CardTitle>
                    <Button variant="ghost" className="text-xs text-zinc-500 hover:text-white uppercase font-bold">View Details</Button>
                </div>
            </CardHeader>
            <CardContent className="p-8 pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatusWidget label="Court Usage" value="8/8" sub="Full Capacity" color="text-white" icon={Target} />
                    <StatusWidget label="Next Match Queue" value="12" sub="On Schedule" color="text-green-500" icon={Users} />
                    <StatusWidget label="Medical Incidents" value="2" sub="Minor Injuries" color="text-yellow-500" icon={Activity} />
                    <StatusWidget label="Pending Protests" value="0" sub="Clean Sheet" color="text-blue-500" icon={CheckCircle2} />
                </div>
            </CardContent>
        </Card>

      </div>
    </div>
  );
}

// Sub-Component untuk Widget Kecil
function StatusWidget({ label, value, sub, color, icon: Icon }: any) {
    return (
        <div className="bg-black/40 p-4 rounded-2xl border border-zinc-800/50 flex flex-col justify-between h-28">
            <div className="flex justify-between items-start">
                <Icon className={cn("w-5 h-5 opacity-70", color)} />
                <span className={cn("text-xs font-bold", color)}>{sub}</span>
            </div>
            <div>
                <div className="text-3xl font-black text-white">{value}</div>
                <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">{label}</div>
            </div>
        </div>
    )
}
