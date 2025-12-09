'use client';

import { useState } from "react";
import { 
  Megaphone, Plus, Search, Filter, 
  CheckCircle2, Clock, AlertCircle, FileText, 
  Send, Download, ArrowUpRight, Handshake
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

// --- MOCK DATA ---
const SPONSOR_INVOICES = [
  { 
    id: "INV-BJB-01", 
    sponsor: "Bank BJB", 
    logo: "/logos/bjb.png", // Mock
    package: "PLATINUM",
    term: "Termin 1 (DP)",
    amount: 150000000, 
    dueDate: "Tomorrow", 
    status: "PENDING", 
    progress: 0,
    contact: "Pak Budi (Marketing)"
  },
  { 
    id: "INV-YNX-02", 
    sponsor: "Yonex Indonesia", 
    logo: "/logos/yonex.png",
    package: "GOLD",
    term: "Full Payment",
    amount: 75000000, 
    dueDate: "2 days ago", 
    status: "OVERDUE", 
    progress: 0,
    contact: "Bu Susi"
  },
  { 
    id: "INV-PCR-01", 
    sponsor: "Pocari Sweat", 
    logo: "/logos/pocari.png",
    package: "SILVER",
    term: "Termin 1",
    amount: 25000000, 
    dueDate: "10 Jun 2026", 
    status: "PAID", 
    progress: 100,
    contact: "Kang Asep"
  },
];

const STATS = {
  totalContract: 850000000,
  collected: 325000000,
  outstanding: 525000000,
  progress: 38 // 38% Collected
};

export default function SponsorshipBillingPage() {
  const [selectedInv, setSelectedInv] = useState<typeof SPONSOR_INVOICES[0] | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("outstanding");

  const filteredInvoices = SPONSOR_INVOICES.filter(inv => 
    activeTab === "outstanding" ? inv.status !== "PAID" : inv.status === "PAID"
  );

  return (
    <div className="space-y-8 p-4 md:p-8 font-body pb-24">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="rounded-full px-3 py-1 border-yellow-500 text-yellow-500 bg-yellow-500/10 backdrop-blur-md">
                    <Handshake className="w-3 h-3 mr-2" /> PARTNERSHIP REVENUE
                </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-headline uppercase tracking-tighter text-white">
                Sponsor <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600">Billing</span>
            </h1>
            <p className="text-zinc-400 mt-2 max-w-xl text-lg">
                Manajemen tagihan, termin pembayaran, dan cash flow masuk dari mitra.
            </p>
        </div>

        <Button 
            onClick={() => setIsCreateOpen(true)}
            className="h-14 rounded-full px-8 bg-white text-black hover:bg-zinc-200 font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        >
            <Plus className="mr-2 w-5 h-5"/> NEW INVOICE
        </Button>
      </div>

      {/* --- REVENUE HERO CARD --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <Card className="lg:col-span-2 bg-gradient-to-br from-zinc-900 to-zinc-950 border-zinc-800 rounded-[40px] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-[100px]"></div>
            <CardContent className="p-8 md:p-10 relative z-10 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <p className="text-zinc-500 font-bold uppercase text-xs tracking-[0.2em] mb-2">Total Contract Value</p>
                        <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight font-mono">
                            Rp {STATS.totalContract.toLocaleString('id-ID', { notation: "compact" })}
                        </h2>
                    </div>
                    <div className="bg-zinc-800/50 p-4 rounded-3xl border border-zinc-700/50 backdrop-blur-md">
                        <Megaphone className="w-8 h-8 text-yellow-500"/>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <div>
                            <span className="text-3xl font-black text-white">{STATS.progress}%</span>
                            <span className="text-zinc-500 ml-2 font-bold text-sm uppercase">Collected</span>
                        </div>
                        <div className="text-right">
                            <span className="text-zinc-400 text-xs font-bold uppercase block mb-1">Outstanding (Piutang)</span>
                            <span className="text-xl font-bold text-yellow-500 font-mono">Rp {STATS.outstanding.toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                    <Progress value={STATS.progress} className="h-4 bg-zinc-800 rounded-full" indicatorClassName="bg-gradient-to-r from-yellow-500 to-orange-500" />
                </div>
            </CardContent>
         </Card>

         {/* QUICK ACTIONS */}
         <div className="space-y-4">
            <Card className="bg-zinc-900 border-zinc-800 rounded-[32px] h-full flex flex-col justify-center">
                <CardContent className="p-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500 animate-pulse">
                        <AlertCircle className="w-8 h-8"/>
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-white">Rp 75.0 Jt</h3>
                        <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest">Overdue Payment</p>
                    </div>
                    <Button variant="outline" className="w-full rounded-full border-red-900/50 text-red-500 hover:bg-red-950 font-bold">
                        SEND REMINDER
                    </Button>
                </CardContent>
            </Card>
         </div>
      </div>

      {/* --- INVOICE LIST (TABS) --- */}
      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-[40px] p-2 backdrop-blur-sm">
        <Tabs defaultValue="outstanding" className="w-full" onValueChange={setActiveTab}>
            
            <div className="flex items-center justify-between px-4 py-4">
                <TabsList className="bg-zinc-950 p-1 rounded-full h-14 border border-zinc-800">
                    <TabsTrigger value="outstanding" className="rounded-full h-12 px-8 font-bold text-sm data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
                        OUTSTANDING
                        <Badge className="ml-2 bg-yellow-600 text-white border-none h-5 px-1.5">{SPONSOR_INVOICES.filter(i => i.status !== 'PAID').length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="settled" className="rounded-full h-12 px-8 font-bold text-sm data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
                        SETTLED (LUNAS)
                    </TabsTrigger>
                </TabsList>

                <div className="relative w-64 hidden md:block">
                    <Search className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
                    <Input placeholder="Cari invoice..." className="h-12 bg-zinc-950 border-zinc-800 rounded-full pl-10 text-white focus-visible:ring-1 focus-visible:ring-yellow-500" />
                </div>
            </div>

            <div className="px-2 pb-2">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-2">
                    {filteredInvoices.map((inv) => (
                        <div 
                            key={inv.id} 
                            onClick={() => setSelectedInv(inv)}
                            className="group relative bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-[32px] p-6 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-2xl overflow-hidden"
                        >
                            {/* Visual Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-14 w-14 border-2 border-zinc-700 bg-white p-1">
                                        <AvatarImage src={inv.logo} className="object-contain" />
                                        <AvatarFallback className="bg-zinc-800 text-sm font-black text-zinc-400">
                                            {inv.sponsor.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="text-lg font-bold text-white leading-none">{inv.sponsor}</h3>
                                        <Badge className="mt-2 bg-zinc-950 border-zinc-800 text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                                            {inv.package}
                                        </Badge>
                                    </div>
                                </div>
                                <div className={cn(
                                    "p-2 rounded-xl",
                                    inv.status === 'PAID' ? "bg-green-500/20 text-green-500" : 
                                    inv.status === 'OVERDUE' ? "bg-red-500/20 text-red-500" : "bg-yellow-500/20 text-yellow-500"
                                )}>
                                    {inv.status === 'PAID' ? <CheckCircle2 className="w-6 h-6"/> : 
                                     inv.status === 'OVERDUE' ? <AlertCircle className="w-6 h-6"/> : <Clock className="w-6 h-6"/>}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-zinc-500 text-xs font-bold uppercase mb-1">{inv.term}</p>
                                    <p className="text-3xl font-black text-white font-mono tracking-tight">
                                        Rp {inv.amount.toLocaleString('id-ID', {notation: "compact"})}
                                    </p>
                                </div>
                                
                                <div className="flex items-center justify-between text-xs font-bold text-zinc-500 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                                    <span className="flex items-center gap-2"><FileText className="w-3 h-3"/> {inv.id}</span>
                                    <span className={cn(inv.status === 'OVERDUE' ? "text-red-500" : "text-zinc-400")}>
                                        Due: {inv.dueDate}
                                    </span>
                                </div>
                            </div>

                            {/* Action Hover */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
                                <span className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                    View Details <ArrowUpRight className="w-3 h-3"/>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Tabs>
      </div>

      {/* --- INVOICE DETAIL SHEET --- */}
      <Sheet open={!!selectedInv} onOpenChange={() => setSelectedInv(null)}>
        <SheetContent className="w-full sm:max-w-md bg-zinc-950 border-l border-zinc-800 p-0 overflow-y-auto">
            {selectedInv && (
                <div className="flex flex-col h-full">
                    
                    <div className="h-40 bg-zinc-900 relative flex items-end p-8 border-b border-zinc-800">
                        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10 mix-blend-overlay"></div>
                        <div className="relative z-10 w-full">
                            <Badge className={cn("mb-2 font-bold", 
                                selectedInv.status === 'OVERDUE' ? "bg-red-500" : 
                                selectedInv.status === 'PAID' ? "bg-green-500" : "bg-yellow-500"
                            )}>
                                {selectedInv.status}
                            </Badge>
                            <h2 className="text-3xl font-black text-white font-mono tracking-tighter">
                                Rp {selectedInv.amount.toLocaleString('id-ID')}
                            </h2>
                            <p className="text-xs text-zinc-500 font-bold uppercase mt-1">{selectedInv.term}</p>
                        </div>
                    </div>

                    <div className="p-8 space-y-8 flex-1">
                        
                        {/* Sponsor Info */}
                        <div className="flex items-center gap-4 bg-zinc-900/50 p-4 rounded-[24px] border border-zinc-800">
                            <Avatar className="w-12 h-12 border-2 border-zinc-800 bg-white p-1">
                                <AvatarImage src={selectedInv.logo} className="object-contain" />
                                <AvatarFallback className="bg-zinc-900 text-zinc-400 font-bold">SP</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-bold text-white">{selectedInv.sponsor}</p>
                                <p className="text-xs text-zinc-500 mt-0.5">PIC: {selectedInv.contact}</p>
                            </div>
                        </div>

                        {/* Invoice Actions */}
                        <div className="space-y-3">
                            <Button variant="outline" className="w-full justify-between h-14 rounded-2xl bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:text-white group">
                                <span className="flex items-center gap-3 font-bold text-zinc-400 group-hover:text-white">
                                    <Download className="w-5 h-5"/> Download PDF
                                </span>
                                <ArrowUpRight className="w-4 h-4 opacity-50"/>
                            </Button>
                            <Button variant="outline" className="w-full justify-between h-14 rounded-2xl bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:text-white group">
                                <span className="flex items-center gap-3 font-bold text-zinc-400 group-hover:text-white">
                                    <Send className="w-5 h-5"/> Kirim Pengingat (WA)
                                </span>
                                <ArrowUpRight className="w-4 h-4 opacity-50"/>
                            </Button>
                        </div>

                        {/* Timeline / History */}
                        <div>
                            <h4 className="text-xs font-bold text-zinc-500 uppercase mb-4 tracking-widest">Activity Log</h4>
                            <div className="space-y-4 border-l-2 border-zinc-800 ml-2 pl-6 relative">
                                <div className="relative">
                                    <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-zinc-700 border-2 border-zinc-950"></div>
                                    <p className="text-xs font-bold text-white">Invoice Created</p>
                                    <p className="text-[10px] text-zinc-500">10 Mei 2026 • by Admin</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-zinc-700 border-2 border-zinc-950"></div>
                                    <p className="text-xs font-bold text-white">Sent to Sponsor</p>
                                    <p className="text-[10px] text-zinc-500">11 Mei 2026 • via Email</p>
                                </div>
                                {selectedInv.status === 'OVERDUE' && (
                                    <div className="relative">
                                        <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-red-500 border-2 border-zinc-950 shadow-[0_0_10px_red]"></div>
                                        <p className="text-xs font-bold text-red-500">Payment Overdue</p>
                                        <p className="text-[10px] text-zinc-500">Yesterday</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Footer Actions */}
                    {selectedInv.status !== 'PAID' && (
                        <div className="p-6 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur-md">
                            <Button className="w-full h-14 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg shadow-green-900/20 text-lg">
                                <CheckCircle2 className="mr-2 w-5 h-5"/> MARK AS PAID
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </SheetContent>
      </Sheet>

      {/* --- CREATE MODAL --- */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-white rounded-[40px] max-w-lg p-0 overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-zinc-800 bg-zinc-900/50">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black font-headline uppercase flex items-center gap-2">
                        <Plus className="w-6 h-6 text-yellow-500"/> Create Invoice
                    </DialogTitle>
                </DialogHeader>
            </div>
            
            <div className="p-8 space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Pilih Sponsor</label>
                    <Select>
                        <SelectTrigger className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl"><SelectValue placeholder="Pilih..." /></SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                            <SelectItem value="BJB">Bank BJB</SelectItem>
                            <SelectItem value="YONEX">Yonex Indonesia</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Nominal (Rp)</label>
                        <Input type="number" className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl font-mono" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Jatuh Tempo</label>
                        <Input type="date" className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl text-xs" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Keterangan Termin</label>
                    <Input placeholder="Cth: Termin 2 (Pelunasan)" className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl" />
                </div>

                <Button className="w-full h-16 rounded-full font-black text-lg bg-yellow-500 hover:bg-yellow-600 text-black mt-4 shadow-xl shadow-yellow-900/20">
                    GENERATE INVOICE
                </Button>
            </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}

    