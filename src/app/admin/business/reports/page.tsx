
'use client';

import { useState } from "react";
import { 
  BarChart3, Download, Share2, Eye, 
  ThumbsUp, Users, Megaphone, Camera, 
  ArrowUpRight, Target, CheckCircle2 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// --- MOCK DATA ---
const SPONSORS = [
  { id: "SP-01", name: "Bank BJB", tier: "PLATINUM", logo: "/logos/bjb.png" },
  { id: "SP-02", name: "Yonex", tier: "GOLD", logo: "/logos/yonex.png" },
  { id: "SP-03", name: "Pocari Sweat", tier: "SILVER", logo: "/logos/pocari.png" },
];

const REPORT_DATA = {
  summary: {
    totalReach: "1.2M",
    engagementRate: "8.5%",
    boothVisitors: "4,500",
    mediaValue: "Rp 850.000.000"
  },
  channels: [
    { name: "Instagram", value: 85, color: "bg-pink-500" },
    { name: "TikTok", value: 92, color: "bg-black border border-zinc-700" },
    { name: "YouTube Live", value: 60, color: "bg-red-600" },
    { name: "On-Site (Venue)", value: 100, color: "bg-blue-500" }
  ],
  gallery: [
    { id: 1, title: "Jersey Branding", type: "Main Asset", img: "/evidence/jersey.jpg", views: "15k" },
    { id: 2, title: "A-Board Court 1", type: "TV Visible", img: "/evidence/aboard.jpg", views: "450k" },
    { id: 3, title: "Booth Crowd", type: "Activation", img: "/evidence/booth.jpg", views: "2.1k" },
    { id: 4, title: "Ad-libs MC", type: "Audio", img: "/evidence/mc.jpg", views: "1.2k" },
  ]
};

export default function SponsorReportPage() {
  const [selectedSponsor, setSelectedSponsor] = useState("SP-01");
  const [activeTab, setActiveTab] = useState("overview");

  const currentSponsor = SPONSORS.find(s => s.id === selectedSponsor);

  return (
    <div className="space-y-8 p-4 md:p-8 font-body pb-24">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="rounded-full px-3 py-1 border-emerald-500 text-emerald-500 bg-emerald-500/10 backdrop-blur-md">
                    <Target className="w-3 h-3 mr-2" /> ROI TRACKER
                </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-headline uppercase tracking-tighter text-white">
                Impact <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-600">Report</span>
            </h1>
            <p className="text-zinc-400 mt-2 max-w-xl text-lg">
                Bukti performa sponsorship dan valuasi media (Post-Event Report).
            </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
            <Select value={selectedSponsor} onValueChange={setSelectedSponsor}>
                <SelectTrigger className="h-14 w-full md:w-64 bg-zinc-900 border-zinc-800 rounded-2xl text-white font-bold">
                    <SelectValue placeholder="Pilih Sponsor" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    {SPONSORS.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button size="icon" className="h-14 w-14 rounded-2xl bg-white text-black hover:bg-zinc-200 shrink-0">
                <Download className="w-6 h-6"/>
            </Button>
        </div>
      </div>

      {/* --- SPONSOR PROFILE HERO --- */}
      <Card className="bg-gradient-to-r from-zinc-900 to-black border-zinc-800 rounded-[32px] p-8 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]"></div>
         
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <Avatar className="w-24 h-24 border-4 border-zinc-800 bg-white p-2 shadow-2xl">
                <AvatarImage src={currentSponsor?.logo} className="object-contain" />
                <AvatarFallback>SP</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left flex-1">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                    <h2 className="text-3xl font-black text-white uppercase">{currentSponsor?.name}</h2>
                    <Badge variant="secondary" className="bg-emerald-500 text-black font-bold hover:bg-emerald-400">
                        {currentSponsor?.tier} PARTNER
                    </Badge>
                </div>
                <p className="text-zinc-400 text-sm">
                    Campaign: <span className="text-white font-bold">BCC 2026 Official Partner</span> • Duration: <span className="text-white font-bold">Jun - Jul 2026</span>
                </p>
            </div>
            
            {/* Impact Score */}
            <div className="bg-zinc-800/50 p-4 rounded-2xl border border-zinc-700/50 text-center backdrop-blur-md">
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Impact Score</p>
                <div className="text-4xl font-black text-emerald-400">9.8<span className="text-lg text-zinc-500">/10</span></div>
            </div>
         </div>
      </Card>

      {/* --- REPORT METRICS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         
         {/* KEY METRICS */}
         <Card className="bg-zinc-900 border-zinc-800 rounded-[32px] p-6 lg:col-span-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                    <div className="flex items-center gap-2 mb-2 text-blue-500">
                        <Eye className="w-5 h-5"/>
                        <span className="text-xs font-bold uppercase tracking-widest">Total Reach</span>
                    </div>
                    <p className="text-3xl font-black text-white">{REPORT_DATA.summary.totalReach}</p>
                    <p className="text-[10px] text-zinc-500 mt-1">Impressions across all channels</p>
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-2 text-pink-500">
                        <ThumbsUp className="w-5 h-5"/>
                        <span className="text-xs font-bold uppercase tracking-widest">Engagement</span>
                    </div>
                    <p className="text-3xl font-black text-white">{REPORT_DATA.summary.engagementRate}</p>
                    <p className="text-[10px] text-zinc-500 mt-1">Likes, Shares, & Comments</p>
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-2 text-orange-500">
                        <Users className="w-5 h-5"/>
                        <span className="text-xs font-bold uppercase tracking-widest">Booth Traffic</span>
                    </div>
                    <p className="text-3xl font-black text-white">{REPORT_DATA.summary.boothVisitors}</p>
                    <p className="text-[10px] text-zinc-500 mt-1">Unique visitors scanned</p>
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-2 text-emerald-500">
                        <BarChart3 className="w-5 h-5"/>
                        <span className="text-xs font-bold uppercase tracking-widest">Media Value</span>
                    </div>
                    <p className="text-3xl font-black text-white tracking-tight">{REPORT_DATA.summary.mediaValue}</p>
                    <p className="text-[10px] text-zinc-500 mt-1">Estimated Ad Equivalent</p>
                </div>
            </div>
         </Card>

         {/* MAIN TABS */}
         <div className="lg:col-span-3 bg-zinc-900/50 border border-zinc-800/50 rounded-[40px] p-2 backdrop-blur-sm">
            <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
                <div className="px-4 py-4">
                    <TabsList className="bg-zinc-950 p-1 rounded-full h-14 border border-zinc-800 w-full md:w-auto">
                        <TabsTrigger value="overview" className="rounded-full h-12 px-8 font-bold text-sm data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                            VISUAL PROOF
                        </TabsTrigger>
                        <TabsTrigger value="analytics" className="rounded-full h-12 px-8 font-bold text-sm data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
                            CHANNEL BREAKDOWN
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="overview" className="p-4 pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {REPORT_DATA.gallery.map((item) => (
                            <div key={item.id} className="group relative aspect-video bg-black rounded-[24px] border border-zinc-800 overflow-hidden cursor-pointer">
                                {/* Image Placeholder */}
                                <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center text-zinc-600 group-hover:scale-105 transition-transform duration-500">
                                    <Camera className="w-12 h-12 opacity-20"/>
                                </div>
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
                                
                                <div className="absolute bottom-0 left-0 right-0 p-5">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <Badge className="mb-2 bg-emerald-500 text-black hover:bg-emerald-400 border-none font-bold text-[10px]">
                                                {item.type}
                                            </Badge>
                                            <h3 className="text-lg font-black text-white leading-none">{item.title}</h3>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs font-bold text-zinc-300">
                                            <Eye className="w-3 h-3"/> {item.views}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="analytics" className="p-6 pt-0">
                    <div className="space-y-6">
                        {REPORT_DATA.channels.map((channel) => (
                            <div key={channel.name}>
                                <div className="flex justify-between text-sm font-bold text-white mb-2">
                                    <span>{channel.name}</span>
                                    <span>{channel.value}% Visibility</span>
                                </div>
                                <div className="h-4 bg-zinc-950 rounded-full p-1 border border-zinc-800">
                                    <div 
                                        className={cn("h-full rounded-full", channel.color)} 
                                        style={{ width: `${channel.value}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                        <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-xs text-zinc-400 italic">
                            *Data dihitung berdasarkan impresi digital dan estimasi *eyeballs* di venue selama 5 hari acara.
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
         </div>

         {/* SIDE: ACTIONS & NOTES */}
         <div className="lg:col-span-1 space-y-6">
            <Card className="bg-zinc-900 border-zinc-800 rounded-[32px] p-6">
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500"/> Fulfillment
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 border border-green-500/30">
                            <CheckCircle2 className="w-4 h-4"/>
                        </div>
                        <span className="text-sm font-bold text-white">Logo on Jersey</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 border border-green-500/30">
                            <CheckCircle2 className="w-4 h-4"/>
                        </div>
                        <span className="text-sm font-bold text-white">Booth 3x3m</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 border border-green-500/30">
                            <CheckCircle2 className="w-4 h-4"/>
                        </div>
                        <span className="text-sm font-bold text-white">Opening Speech</span>
                    </div>
                </div>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800 rounded-[32px] p-6">
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4">Export Options</h3>
                <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-between h-12 rounded-xl border-zinc-700 hover:bg-zinc-800">
                        Full Report (PDF) <ArrowUpRight className="w-4 h-4"/>
                    </Button>
                    <Button variant="outline" className="w-full justify-between h-12 rounded-xl border-zinc-700 hover:bg-zinc-800">
                        Gallery Assets (ZIP) <ArrowUpRight className="w-4 h-4"/>
                    </Button>
                    <Button className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold mt-2">
                        <Share2 className="mr-2 w-4 h-4"/> SHARE LINK
                    </Button>
                </div>
            </Card>
         </div>

      </div>

    </div>
  );
}
