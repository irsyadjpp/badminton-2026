
'use client';

import { 
  Wallet, TrendingUp, TrendingDown, PieChart, 
  ArrowUpRight, ArrowDownLeft, FileText, 
  AlertCircle, DollarSign, CreditCard, Download, 
  CheckCircle2, Clock, XCircle, QrCode, Banknote
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

// --- MOCK DATA ---
const FINANCIAL_SUMMARY = {
  balance: 325450000,
  income: 450000000,
  expense: 124550000,
  pendingIn: 75000000,  // Tagihan Sponsor belum cair
  pendingOut: 12500000, // Reimburse belum diapprove
};

const RECENT_TRANSACTIONS = [
  { id: "TRX-001", desc: "Sponsorship Term 1 - Bank BJB", date: "Today, 10:23", amount: 150000000, type: "IN", category: "SPONSORSHIP", status: "SUCCESS" },
  { id: "TRX-002", desc: "DP Sewa GOR KONI", date: "Yesterday, 14:00", amount: -25000000, type: "OUT", category: "VENUE", status: "SUCCESS" },
  { id: "TRX-003", desc: "Registrasi Tim PB Djarum (10 Atlet)", date: "Yesterday, 09:15", amount: 3500000, type: "IN", category: "REGISTRATION", status: "SUCCESS" },
  { id: "TRX-004", desc: "Cetak Banner & Backdrop", date: "12 Jun 2026", amount: -8500000, type: "OUT", category: "LOGISTICS", status: "PENDING" },
  { id: "TRX-005", desc: "Konsumsi Technical Meeting", date: "10 Jun 2026", amount: -2100000, type: "OUT", category: "CONSUMPTION", status: "SUCCESS" },
];

export default function FinanceDashboard() {
  
  return (
    <div className="space-y-8 p-4 md:p-8 font-body pb-24">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="rounded-full px-3 py-1 border-green-500 text-green-500 bg-green-500/10 backdrop-blur-md">
                    <TrendingUp className="w-3 h-3 mr-2" /> CASH FLOW POSITIVE
                </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-headline uppercase tracking-tighter text-white">
                Treasury <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Command</span>
            </h1>
            <p className="text-zinc-400 mt-2 max-w-xl text-lg">
                Pantauan likuiditas, persetujuan anggaran, dan arus kas real-time.
            </p>
        </div>

        <div className="flex gap-3">
            <Button variant="outline" className="h-14 rounded-full border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800">
                <Download className="mr-2 w-5 h-5"/> Report
            </Button>
            <Button className="h-14 rounded-full px-8 bg-white text-black hover:bg-zinc-200 font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                <FileText className="mr-2 w-5 h-5"/> New Invoice
            </Button>
        </div>
      </div>
      
        {/* ROW BARU: SPONSORSHIP & POS */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            
            {/* SPONSORSHIP TRACKER (3 Cols) */}
            <Card className="lg:col-span-3 bg-zinc-900 border-zinc-800 rounded-[32px]">
                <CardHeader className="border-b border-zinc-800 pb-4">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-emerald-500"/> Sponsorship Pipeline
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-zinc-800"><TableHead>Sponsor</TableHead><TableHead>Package</TableHead><TableHead>Commitment</TableHead><TableHead>Paid</TableHead><TableHead>Status</TableHead></TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                                <TableCell className="font-bold text-white">Bank BJB</TableCell>
                                <TableCell>Platinum</TableCell>
                                <TableCell>Rp 250.000.000</TableCell>
                                <TableCell className="text-emerald-400 font-mono">Rp 150.000.000</TableCell>
                                <TableCell><Badge variant="outline" className="text-yellow-500 border-yellow-500">Term 2 Pending</Badge></TableCell>
                            </TableRow>
                             <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                                <TableCell className="font-bold text-white">Yonex</TableCell>
                                <TableCell>Gold (Barter)</TableCell>
                                <TableCell>Rp 100.000.000</TableCell>
                                <TableCell className="text-emerald-400 font-mono">Rp 100.000.000</TableCell>
                                <TableCell><Badge variant="outline" className="text-green-500 border-green-500">Settled</Badge></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* POS / KASIR MINI (1 Col) */}
            <Card className="bg-gradient-to-b from-indigo-900 to-zinc-900 border-indigo-500/30 rounded-[32px] flex flex-col">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <QrCode className="w-5 h-5"/> Quick POS
                    </CardTitle>
                    <CardDescription className="text-indigo-200">Terima pembayaran tunai/QRIS.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-indigo-300 uppercase">Perihal</label>
                        <select className="w-full bg-black/30 border border-indigo-500/30 rounded-xl h-10 px-3 text-white text-sm">
                            <option>Denda Shuttlecock</option>
                            <option>Denda WO</option>
                            <option>Sewa Raket</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-indigo-300 uppercase">Nominal</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-indigo-400 text-sm font-bold">Rp</span>
                            <input type="number" className="w-full bg-black/30 border border-indigo-500/30 rounded-xl h-10 pl-10 text-white font-mono font-bold" />
                        </div>
                    </div>
                    <Button className="w-full bg-white text-indigo-900 hover:bg-indigo-100 font-bold mt-auto">
                        <Banknote className="w-4 h-4 mr-2"/> TERIMA UANG
                    </Button>
                </CardContent>
            </Card>
        </div>


      {/* --- HERO: CASH POSITION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* 1. MAIN BALANCE CARD */}
         <Card className="lg:col-span-2 bg-gradient-to-br from-zinc-900 to-zinc-950 border-zinc-800 rounded-[40px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] group-hover:bg-emerald-500/20 transition-all"></div>
            
            <CardContent className="p-8 md:p-10 relative z-10 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <p className="text-zinc-500 font-bold uppercase text-xs tracking-[0.2em] mb-2">Total Net Balance</p>
                        <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight font-mono">
                            Rp {FINANCIAL_SUMMARY.balance.toLocaleString('id-ID')}
                        </h2>
                    </div>
                    <div className="bg-zinc-800/50 p-4 rounded-3xl border border-zinc-700/50 backdrop-blur-md">
                        <Wallet className="w-8 h-8 text-emerald-500"/>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mt-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="p-1.5 bg-green-500/20 rounded-full text-green-500"><ArrowUpRight className="w-4 h-4"/></div>
                            <span className="text-xs font-bold text-zinc-500 uppercase">Income (YTD)</span>
                        </div>
                        <p className="text-2xl font-bold text-green-400 font-mono">
                            + Rp {FINANCIAL_SUMMARY.income.toLocaleString('id-ID', {notation: "compact"})}
                        </p>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="p-1.5 bg-red-500/20 rounded-full text-red-500"><ArrowDownLeft className="w-4 h-4"/></div>
                            <span className="text-xs font-bold text-zinc-500 uppercase">Expense (YTD)</span>
                        </div>
                        <p className="text-2xl font-bold text-red-400 font-mono">
                            - Rp {FINANCIAL_SUMMARY.expense.toLocaleString('id-ID', {notation: "compact"})}
                        </p>
                    </div>
                </div>
            </CardContent>
         </Card>

         {/* 2. PENDING ACTIONS (Vertical Stack) */}
         <div className="space-y-6 flex flex-col">
            {/* Reimbursement Alert */}
            <Card className="bg-zinc-900 border-zinc-800 rounded-[32px] flex-1 hover:border-red-500/30 transition-all cursor-pointer group">
                <CardContent className="p-6 flex flex-col justify-center h-full">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-red-500/10 rounded-2xl text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <Badge className="bg-red-500/20 text-red-500 border-none font-bold">Action Needed</Badge>
                    </div>
                    <p className="text-zinc-500 text-xs font-bold uppercase">Pending Reimbursement</p>
                    <h3 className="text-3xl font-black text-white mt-1">Rp 12.5 Jt</h3>
                    <p className="text-xs text-zinc-600 mt-2">5 pengajuan menunggu approval Anda.</p>
                </CardContent>
            </Card>

            {/* Incoming Receivables */}
            <Card className="bg-zinc-900 border-zinc-800 rounded-[32px] flex-1 hover:border-blue-500/30 transition-all cursor-pointer group">
                <CardContent className="p-6 flex flex-col justify-center h-full">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            <Clock className="w-6 h-6" />
                        </div>
                        <Badge className="bg-blue-500/20 text-blue-500 border-none font-bold">Receivables</Badge>
                    </div>
                    <p className="text-zinc-500 text-xs font-bold uppercase">Outstanding Invoices</p>
                    <h3 className="text-3xl font-black text-white mt-1">Rp 75.0 Jt</h3>
                    <p className="text-xs text-zinc-600 mt-2">Tagihan sponsor yang belum cair.</p>
                </CardContent>
            </Card>
         </div>
      </div>

      {/* --- TRANSACTION & ANALYSIS TABS --- */}
      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-[40px] p-2 backdrop-blur-sm">
        <Tabs defaultValue="transactions" className="w-full">
            <div className="flex items-center justify-between px-6 py-4">
                <TabsList className="bg-zinc-950 p-1 rounded-full h-14 border border-zinc-800">
                    <TabsTrigger value="transactions" className="rounded-full h-12 px-8 font-bold text-sm data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
                        <CreditCard className="w-4 h-4 mr-2"/> TRANSACTIONS
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="rounded-full h-12 px-8 font-bold text-sm data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
                        <PieChart className="w-4 h-4 mr-2"/> ANALYTICS
                    </TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="transactions" className="mt-0 p-4">
                <div className="space-y-3">
                    {RECENT_TRANSACTIONS.map((trx) => (
                        <div key={trx.id} className="group flex flex-col md:flex-row items-center gap-4 p-5 bg-zinc-900 border border-zinc-800 rounded-[28px] hover:border-zinc-700 transition-all hover:-translate-y-1">
                            
                            {/* Icon Type */}
                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                                trx.type === 'IN' ? "bg-green-500/10 text-green-500" : "bg-zinc-800 text-zinc-400"
                            )}>
                                {trx.type === 'IN' ? <ArrowUpRight className="w-6 h-6"/> : <ArrowDownLeft className="w-6 h-6"/>}
                            </div>

                            {/* Details */}
                            <div className="flex-1 text-center md:text-left">
                                <h4 className="font-bold text-white text-base">{trx.desc}</h4>
                                <div className="flex items-center justify-center md:justify-start gap-2 mt-1 text-xs font-medium text-zinc-500">
                                    <span className="bg-zinc-950 px-2 py-1 rounded-md border border-zinc-800 uppercase">{trx.category}</span>
                                    <span>● {trx.date}</span>
                                    <span>● {trx.id}</span>
                                </div>
                            </div>

                            {/* Amount & Status */}
                            <div className="text-center md:text-right min-w-[150px]">
                                <div className={cn("font-mono font-bold text-lg", trx.type === 'IN' ? "text-green-400" : "text-white")}>
                                    {trx.type === 'IN' ? '+' : ''} Rp {Math.abs(trx.amount).toLocaleString('id-ID')}
                                </div>
                                <div className="flex justify-center md:justify-end mt-1">
                                    {trx.status === 'SUCCESS' && <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/20">SUCCESS</Badge>}
                                    {trx.status === 'PENDING' && <Badge className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/20 animate-pulse">PENDING</Badge>}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
                
                <div className="mt-6 text-center">
                    <Button variant="ghost" className="text-zinc-500 hover:text-white font-bold rounded-full">
                        View All Transactions
                    </Button>
                </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-0 p-8 min-h-[300px] flex items-center justify-center text-zinc-500">
                <div className="text-center">
                    <PieChart className="w-16 h-16 mx-auto mb-4 opacity-20"/>
                    <p className="font-bold uppercase tracking-widest text-sm">Analytics Module Coming Soon</p>
                </div>
            </TabsContent>
        </Tabs>
      </div>

    </div>
  );
}
