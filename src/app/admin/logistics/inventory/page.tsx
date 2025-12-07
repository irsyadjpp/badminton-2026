
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Package, BoxSelect, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { QrCode, ArrowRightLeft, History } from "lucide-react";

export default function InventoryTracker() {
  const [mode, setMode] = useState<'CHECKOUT' | 'CHECKIN'>('CHECKOUT');
  const [logs, setLogs] = useState([
    { item: "HT Motorola #04", user: "Budi Security", time: "07:30", status: "OUT" },
    { item: "Canon DSLR #01", user: "Sarah Media", time: "08:15", status: "OUT" },
  ]);

  return (
    <div className="p-6 max-w-lg mx-auto min-h-screen bg-black text-white">
       <h1 className="text-2xl font-black font-headline mb-6 flex items-center gap-2">
         <ArrowRightLeft className="text-primary"/> GEAR TRACKER
       </h1>

       {/* MODE SWITCHER */}
       <div className="grid grid-cols-2 gap-2 bg-zinc-900 p-1 rounded-xl mb-6">
          <button 
            onClick={() => setMode('CHECKOUT')}
            className={`py-3 rounded-lg font-bold text-sm transition-all ${mode === 'CHECKOUT' ? 'bg-primary text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
          >
            PINJAM (OUT)
          </button>
          <button 
            onClick={() => setMode('CHECKIN')}
            className={`py-3 rounded-lg font-bold text-sm transition-all ${mode === 'CHECKIN' ? 'bg-green-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
          >
            KEMBALI (IN)
          </button>
       </div>

       {/* SCAN AREA */}
       <Card className={`border-2 ${mode === 'CHECKOUT' ? 'border-primary bg-primary/5' : 'border-green-600 bg-green-900/10'}`}>
          <CardContent className="p-6 flex flex-col gap-4">
             <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">1. Scan QR Barang</label>
                <div className="flex gap-2">
                    <Input placeholder="ID Barang..." className="bg-black border-zinc-700 text-white font-mono" autoFocus />
                    <Button variant="outline" size="icon" className="border-zinc-700"><QrCode className="w-5 h-5"/></Button>
                </div>
             </div>

             {mode === 'CHECKOUT' && (
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">2. Scan ID Card Peminjam</label>
                    <div className="flex gap-2">
                        <Input placeholder="ID Panitia..." className="bg-black border-zinc-700 text-white font-mono" />
                        <Button variant="outline" size="icon" className="border-zinc-700"><QrCode className="w-5 h-5"/></Button>
                    </div>
                 </div>
             )}

             <Button className={`h-12 font-bold text-lg mt-2 ${mode === 'CHECKOUT' ? 'bg-primary hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}>
                {mode === 'CHECKOUT' ? 'CONFIRM PINJAM' : 'CONFIRM KEMBALI'}
             </Button>
          </CardContent>
       </Card>

       {/* RECENT LOGS */}
       <div className="mt-8">
          <h3 className="text-xs font-bold text-zinc-500 uppercase mb-4 flex items-center gap-2"><History className="w-4 h-4"/> Recent Activity</h3>
          <div className="space-y-3">
             {logs.map((log, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                    <div>
                        <div className="font-bold text-white text-sm">{log.item}</div>
                        <div className="text-xs text-zinc-500">{log.user}</div>
                    </div>
                    <div className="text-right">
                        <div className={`text-xs font-black px-2 py-1 rounded ${log.status === 'OUT' ? 'bg-red-900/30 text-red-500' : 'bg-green-900/30 text-green-500'}`}>
                            {log.status}
                        </div>
                        <div className="text-xs text-zinc-600 mt-1 font-mono">{log.time}</div>
                    </div>
                </div>
             ))}
          </div>
       </div>

    </div>
  );
}
