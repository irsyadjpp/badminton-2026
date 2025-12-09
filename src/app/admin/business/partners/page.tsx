'use client';

import { useState } from "react";
import { 
  Handshake, TrendingUp, CheckCircle2, 
  Megaphone, MoreHorizontal, Plus, 
  Search, Phone, Mail, FileSignature, 
  LayoutTemplate, ArrowUpRight, DollarSign 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// --- MOCK DATA ---
const PARTNERS = [
  { 
    id: "SP-01", 
    name: "Bank BJB", 
    tier: "PLATINUM", 
    logo: "/logos/bjb.png",
    status: "SIGNED", 
    value: 250000000, 
    pic: "Ibu Rina (Marketing)", 
    contact: "0812-3344-5566",
    deliverables: { total: 10, completed: 8 },
    notes: "Main Sponsor. Wajib ad-libs setiap jeda set."
  },
  { 
    id: "SP-02", 
    name: "Yonex Indonesia", 
    tier: "GOLD", 
    logo: "/logos/yonex.png",
    status: "SIGNED", 
    value: 150000000, 
    pic: "Pak Dani", 
    contact: "0811-2233-4455",
    deliverables: { total: 8, completed: 4 },
    notes: "Apparel Partner. Booth di pintu utama."
  },
  { 
    id: "SP-03", 
    name: "Pocari Sweat", 
    tier: "SILVER", 
    logo: "/logos/pocari.png",
    status: "NEGOTIATION", 
    value: 75000000, 
    pic: "Kang Asep", 
    contact: "0857-1122-3344",
    deliverables: { total: 5, completed: 0 },
    notes: "Menunggu approval budget pusat."
  },
  { 
    id: "SP-04", 
    name: "Kopi Kenangan", 
    tier: "BRONZE", 
    logo: "/logos/kopken.png",
    status: "PROSPECT", 
    value: 25000000, 
    pic: "Mba Sarah", 
    contact: "-",
    deliverables: { total: 3, completed: 0 },
    notes: "Baru kirim proposal kemarin."
  },
];

const DELIVERABLES_CHECKLIST = [
  { id: 1, item: "Logo on Jersey", done: true },
  { id: 2, item: "A-Board Court 1", done: true },
  { id: 3, item: "Social Media Post (Feed)", done: true },
  { id: 4, item: "MC Ad-libs (Opening)", done: false },
  { id: 5, item: "Booth 3x3m Activation", done: false },
];

export default function SponsorshipCRMPage() {
  const [selectedPartner, setSelectedPartner] = useState<typeof PARTNERS[0] | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("pipeline");

  // Stats
  const totalValue = PARTNERS.reduce((acc, curr) => acc + curr.value, 0);
  const signedValue = PARTNERS.filter(p => p.status === 'SIGNED').reduce((acc, curr) => acc + curr.value, 0);
  const progress = Math.round((signedValue / totalValue) * 100) || 0;

  const getTierColor = (tier: string) => {
    switch(tier) {
        case 'PLATINUM': return "text-cyan-400 border-cyan-500 bg-cyan-500/10";
        case 'GOLD': return "text-yellow-400 border-yellow-500 bg-yellow-500/10";
        case 'SILVER': return "text-zinc-300 border-zinc-400 bg-zinc-500/10";
        default: return "text-orange-400 border-orange-500 bg-orange-500/10";
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-8 font-body pb-24">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="rounded-full px-3 py-1 border-yellow-500 text-yellow-500 bg-yellow-500/10 backdrop-blur-md">
                    <Handshake className="w-3 h-3 mr-2" /> COMMERCIAL DIVISION
                </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-headline uppercase tracking-tighter text-white">
                Partnership <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">Ecosystem</span>
            </h1>
            <p className="text-zinc-400 mt-2 max-w-xl text-lg">
                Kelola pipeline sponsor, negosiasi, dan pemenuhan hak (deliverables).
            </p>
        </div>

        <Button 
            onClick={() => setIsAddOpen(true)}
            className="h-14 rounded-full px-8 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-black text-lg shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-transform active:scale-95"
        >
            <Plus className="mr-2 w-6 h-6"/> ADD PARTNER
        </Button>
      </div>

      {/* --- REVENUE HERO --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <Card className="lg:col-span-2 bg-gradient-to-br from-zinc-900 to-zinc-950 border-zinc-800 rounded-[32px] p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-[80px] group-hover:bg-yellow-500/20 transition-all"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-zinc-500 font-bold uppercase text-xs tracking-[0.2em]">Total Value Locked</p>
                        <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight font-mono mt-2">
                            Rp {totalValue.toLocaleString('id-ID', { notation: "compact" })}
                        </h2>
                    </div>
                    <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-500 border border-yellow-500/20">
                        <TrendingUp className="w-8 h-8"/>
                    </div>
                </div>
                
                <div className="space-y-2 mt-8">
                    <div className="flex justify-between text-xs font-bold text-zinc-500 uppercase">
                        <span>Secured (Signed)</span>
                        <span className="text-white">{progress}% Goal</span>
                    </div>
                    <Progress value={progress} className="h-4 bg-zinc-800 rounded-full" indicatorClassName="bg-gradient-to-r from-yellow-500 to-amber-600" />
                </div>
            </div>
         </Card>

         {/* QUICK PIPELINE STATS */}
         <div className="space-y-4">
            <Card className="bg-zinc-900 border-zinc-800 rounded-[28px] p-5 flex items-center justify-between group hover:border-green-500/30 transition-colors">
                <div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase">Signed Deals</p>
                    <p className="text-3xl font-black text-green-500">{PARTNERS.filter(p => p.status === 'SIGNED').length}</p>
                </div>
                <FileSignature className="w-8 h-8 text-green-500/50 group-hover:text-green-500 transition-colors"/>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800 rounded-[28px] p-5 flex items-center justify-between group hover:border-blue-500/30 transition-colors">
                <div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase">Negotiating</p>
                    <p className="text-3xl font-black text-blue-500">{PARTNERS.filter(p => p.status === 'NEGOTIATION').length}</p>
                </div>
                <LayoutTemplate className="w-8 h-8 text-blue-500/50 group-hover:text-blue-500 transition-colors"/>
            </Card>
         </div>
      </div>

      {/* --- PARTNER LIST (TABS) --- */}
      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-[40px] p-2 backdrop-blur-sm min-h-[500px] flex flex-col">
        <Tabs defaultValue="pipeline" className="w-full flex-1 flex flex-col" onValueChange={setActiveTab}>
            
            <div className="flex flex-col md:flex-row items-center justify-between px-4 py-4 gap-4">
                <TabsList className="bg-zinc-950 p-1 rounded-full h-14 border border-zinc-800">
                    <TabsTrigger value="pipeline" className="rounded-full h-12 px-8 font-bold text-sm data-[state=active]:bg-yellow-600 data-[state=active]:text-black">
                        DEAL PIPELINE
                    </TabsTrigger>
                    <TabsTrigger value="active" className="rounded-full h-12 px-8 font-bold text-sm data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
                        ACTIVE PARTNERS
                    </TabsTrigger>
                </TabsList>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
                    <Input 
                        placeholder="Search partner..." 
                        className="h-12 bg-zinc-950 border-zinc-800 rounded-full pl-10 text-white focus:ring-yellow-500"
                    />
                </div>
            </div>

            <ScrollArea className="flex-1 px-4 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {PARTNERS.filter(p => activeTab === 'pipeline' ? true : p.status === 'SIGNED').map((partner) => (
                        <div 
                            key={partner.id} 
                            onClick={() => setSelectedPartner(partner)}
                            className="group bg-zinc-900 border border-zinc-800 rounded-[28px] p-6 hover:border-yellow-500/50 transition-all cursor-pointer hover:-translate-y-1 relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-14 w-14 border-2 border-zinc-700 bg-white p-1">
                                        <AvatarImage src={partner.logo} className="object-contain"/>
                                        <AvatarFallback className="bg-zinc-800 font-bold text-zinc-500">{partner.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h4 className="font-bold text-white text-lg leading-tight">{partner.name}</h4>
                                        <Badge variant="outline" className={cn("mt-1 text-[9px] font-black border", getTierColor(partner.tier))}>
                                            {partner.tier}
                                        </Badge>
                                    </div>
                                </div>
                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-zinc-500 hover:text-white">
                                    <MoreHorizontal className="w-5 h-5"/>
                                </Button>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                                    <span className="text-xs font-bold text-zinc-500 uppercase">Valuation</span>
                                    <span className="font-mono font-black text-white">Rp {partner.value.toLocaleString('id-ID', {notation: "compact"})}</span>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                    <span className={cn("text-xs font-black uppercase tracking-wider", 
                                        partner.status === 'SIGNED' ? "text-green-500" : 
                                        partner.status === 'NEGOTIATION' ? "text-blue-500" : "text-zinc-500"
                                    )}>
                                        ● {partner.status}
                                    </span>
                                    
                                    {/* Mini Progress for Deliverables */}
                                    {partner.status === 'SIGNED' && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-zinc-500">Fulfilled</span>
                                            <div className="h-2 w-16 bg-zinc-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-green-500" style={{ width: `${(partner.deliverables.completed / partner.deliverables.total) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </Tabs>
      </div>

      {/* --- PARTNER DOSSIER (DETAIL SHEET) --- */}
      <Sheet open={!!selectedPartner} onOpenChange={() => setSelectedPartner(null)}>
        <SheetContent className="w-full sm:max-w-md bg-zinc-950 border-l border-zinc-800 p-0 overflow-y-auto">
            {selectedPartner && (
                <div className="flex flex-col h-full">
                    
                    {/* Header Cover */}
                    <div className="h-48 bg-gradient-to-b from-yellow-900/40 to-zinc-900 relative p-8 flex flex-col justify-end">
                        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10 mix-blend-overlay"></div>
                        
                        <div className="flex items-end gap-4 relative z-10">
                            <Avatar className="h-20 w-20 border-4 border-zinc-900 bg-white p-1 shadow-2xl">
                                <AvatarImage src={selectedPartner.logo} className="object-contain"/>
                                <AvatarFallback>SP</AvatarFallback>
                            </Avatar>
                            <div className="mb-2">
                                <Badge className={cn("mb-2 text-[10px] font-black border", getTierColor(selectedPartner.tier))}>
                                    {selectedPartner.tier} PARTNER
                                </Badge>
                                <h2 className="text-2xl font-black text-white uppercase leading-none">{selectedPartner.name}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 space-y-8 flex-1">
                        
                        {/* PIC & Contact */}
                        <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-zinc-500 uppercase">PIC</span>
                                <span className="text-sm font-bold text-white">{selectedPartner.pic}</span>
                            </div>
                            <div className="h-[1px] bg-zinc-800 w-full"></div>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="flex-1 h-9 border-zinc-700 text-zinc-300 hover:text-white text-xs">
                                    <Phone className="w-3 h-3 mr-2"/> Call
                                </Button>
                                <Button size="sm" variant="outline" className="flex-1 h-9 border-zinc-700 text-zinc-300 hover:text-white text-xs">
                                    <Mail className="w-3 h-3 mr-2"/> Email
                                </Button>
                            </div>
                        </div>

                        {/* Deliverables Checklist (Crucial for CRM) */}
                        <div>
                            <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Megaphone className="w-4 h-4 text-yellow-500"/> Deliverables
                            </h3>
                            <div className="space-y-3">
                                {DELIVERABLES_CHECKLIST.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-3 bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                                        <div className={cn(
                                            "w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors cursor-pointer",
                                            item.done ? "bg-green-500 border-green-500 text-black" : "border-zinc-600"
                                        )}>
                                            {item.done && <CheckCircle2 className="w-4 h-4"/>}
                                        </div>
                                        <span className={cn("text-sm font-bold", item.done ? "text-zinc-500 line-through" : "text-white")}>
                                            {item.item}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest mb-2">Internal Notes</h3>
                            <p className="text-sm text-zinc-400 italic bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                                "{selectedPartner.notes}"
                            </p>
                        </div>

                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur-md grid grid-cols-2 gap-4">
                        <Button variant="outline" className="h-14 rounded-2xl border-zinc-700 text-zinc-300 font-bold">
                            EDIT DEAL
                        </Button>
                        <Button className="h-14 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold shadow-lg shadow-yellow-900/20">
                            UPDATE STATUS
                        </Button>
                    </div>
                </div>
            )}
        </SheetContent>
      </Sheet>

      {/* --- ADD PARTNER MODAL --- */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-white rounded-[40px] max-w-lg p-0 overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-zinc-800 bg-yellow-950/20">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black font-headline uppercase flex items-center gap-2 text-yellow-500">
                        <Handshake className="w-6 h-6"/> New Partner
                    </DialogTitle>
                    <DialogDescription>Tambahkan calon sponsor ke dalam pipeline.</DialogDescription>
                </DialogHeader>
            </div>
            
            <div className="p-8 space-y-6">
                
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Nama Perusahaan</label>
                    <Input placeholder="PT..." className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl text-lg font-bold" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Potensi Nilai</label>
                        <div className="relative">
                            <span className="absolute left-4 top-4 text-zinc-500 font-bold">Rp</span>
                            <Input type="number" className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl pl-10 font-mono" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Target Tier</label>
                        <Select>
                            <SelectTrigger className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl"><SelectValue placeholder="Pilih..." /></SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                <SelectItem value="PLATINUM">Platinum</SelectItem>
                                <SelectItem value="GOLD">Gold</SelectItem>
                                <SelectItem value="SILVER">Silver</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Contact Person (PIC)</label>
                    <Input placeholder="Nama & No. HP" className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl" />
                </div>

                <Button className="w-full h-16 rounded-full font-black text-lg bg-yellow-500 hover:bg-yellow-600 text-black mt-4 shadow-xl shadow-yellow-900/20">
                    ADD TO PIPELINE
                </Button>
            </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
```