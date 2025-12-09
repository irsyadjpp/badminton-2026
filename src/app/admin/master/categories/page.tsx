
'use client';

import { useState } from "react";
import { 
  Trophy, Users, Banknote, Plus, 
  Search, Filter, MoreHorizontal, Edit3, 
  Trash2, Sword, LayoutGrid, CheckCircle2, 
  AlertCircle, ChevronRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

// --- MOCK DATA ---
const CATEGORIES = [
  { 
    id: "CAT-001", 
    code: "MS-OPEN", 
    name: "Tunggal Putra Open", 
    group: "SINGLES", // SINGLES, DOUBLES, TEAM
    age: "Dewasa / Open",
    price: 150000,
    quota: { current: 45, max: 64 },
    status: "OPEN",
    gender: "MALE"
  },
  { 
    id: "CAT-002", 
    code: "WS-U19", 
    name: "Tunggal Putri U-19", 
    group: "SINGLES",
    age: "U-19 (Remaja)",
    price: 150000,
    quota: { current: 20, max: 32 },
    status: "OPEN",
    gender: "FEMALE"
  },
  { 
    id: "CAT-003", 
    code: "MD-PRO", 
    name: "Ganda Putra Pro", 
    group: "DOUBLES",
    age: "Professional",
    price: 300000,
    quota: { current: 32, max: 32 },
    status: "FULL",
    gender: "MALE"
  },
  { 
    id: "CAT-004", 
    code: "XD-GEN", 
    name: "Ganda Campuran Umum", 
    group: "DOUBLES",
    age: "Umum",
    price: 250000,
    quota: { current: 12, max: 32 },
    status: "OPEN",
    gender: "MIXED"
  },
];

const GROUPS = ["ALL", "SINGLES", "DOUBLES", "TEAM"];

export default function MasterCategoryPage() {
  const [selectedCat, setSelectedCat] = useState<typeof CATEGORIES[0] | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = CATEGORIES.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (activeFilter === 'ALL' || c.group === activeFilter)
  );

  // Helper Visuals
  const getGenderColor = (g: string) => {
    switch(g) {
        case 'MALE': return "text-blue-400 bg-blue-500/10 border-blue-500/20";
        case 'FEMALE': return "text-pink-400 bg-pink-500/10 border-pink-500/20";
        default: return "text-purple-400 bg-purple-500/10 border-purple-500/20";
    }
  };

  const getStatusBadge = (s: string) => {
    switch(s) {
        case 'OPEN': return "bg-green-500/20 text-green-500 hover:bg-green-500/30";
        case 'FULL': return "bg-red-500/20 text-red-500 hover:bg-red-500/30";
        default: return "bg-zinc-800 text-zinc-400";
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-8 font-body pb-24 h-[calc(100vh-64px)] flex flex-col">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shrink-0">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="rounded-full px-3 py-1 border-cyan-500 text-cyan-500 bg-cyan-500/10 backdrop-blur-md">
                    <Trophy className="w-3 h-3 mr-2" /> TOURNAMENT CONFIG
                </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-black font-headline uppercase tracking-tighter text-white">
                Competition <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-600">Divisions</span>
            </h1>
            <p className="text-zinc-400 mt-2 max-w-xl text-lg">
                Atur kelas pertandingan, kuota peserta, dan biaya pendaftaran.
            </p>
        </div>

        <Button 
            onClick={() => setIsFormOpen(true)}
            className="h-14 rounded-full px-8 bg-cyan-600 hover:bg-cyan-700 text-white font-black text-lg shadow-[0_0_20px_rgba(8,145,178,0.4)] transition-transform active:scale-95"
        >
            <Plus className="mr-2 w-5 h-5"/> NEW CLASS
        </Button>
      </div>

      {/* --- FILTER BAR --- */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-zinc-900/50 p-2 rounded-[24px] border border-zinc-800/50 backdrop-blur-sm shrink-0">
         <div className="flex gap-2 overflow-x-auto w-full md:w-auto p-1 no-scrollbar">
            {GROUPS.map((grp) => (
                <button
                    key={grp}
                    onClick={() => setActiveFilter(grp)}
                    className={cn(
                        "px-6 h-10 rounded-full text-sm font-bold transition-all whitespace-nowrap border border-transparent",
                        activeFilter === grp 
                            ? "bg-zinc-800 text-white border-zinc-700 shadow-md" 
                            : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
                    )}
                >
                    {grp}
                </button>
            ))}
         </div>

         <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-3 w-5 h-5 text-zinc-500" />
            <input 
                type="text" 
                placeholder="Search category..." 
                className="w-full bg-zinc-950 text-white font-bold placeholder:text-zinc-600 pl-12 pr-4 h-12 rounded-full border border-zinc-800 focus:outline-none focus:border-cyan-500 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
         </div>
      </div>

      {/* --- CATEGORY GRID --- */}
      <ScrollArea className="flex-1 -mx-4 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
            {filteredData.map((cat) => {
                const fillPercent = (cat.quota.current / cat.quota.max) * 100;
                
                return (
                    <div 
                        key={cat.id}
                        onClick={() => setSelectedCat(cat)}
                        className="group relative bg-zinc-900 border border-zinc-800 rounded-[32px] p-6 cursor-pointer hover:border-cyan-500/50 transition-all hover:-translate-y-1 hover:shadow-2xl overflow-hidden"
                    >
                        {/* Header Code */}
                        <div className="flex justify-between items-start mb-6">
                            <div className={cn("px-4 py-2 rounded-xl border text-xl font-black tracking-tighter", getGenderColor(cat.gender))}>
                                {cat.code}
                            </div>
                            <Badge className={cn("border-none font-bold", getStatusBadge(cat.status))}>
                                {cat.status}
                            </Badge>
                        </div>

                        {/* Title & Info */}
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{cat.name}</h3>
                            <p className="text-sm text-zinc-500 font-medium">{cat.age}</p>
                        </div>

                        {/* Quota Bar */}
                        <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 mb-4">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase">Slots Filled</span>
                                <span className="text-sm font-bold text-white">
                                    {cat.quota.current} <span className="text-zinc-600">/ {cat.quota.max}</span>
                                </span>
                            </div>
                            <Progress value={fillPercent} className="h-2 bg-zinc-800" indicatorClassName={cn(fillPercent >= 100 ? "bg-red-500" : "bg-cyan-500")} />
                        </div>

                        {/* Price Tag */}
                        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/50">
                            <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold">
                                <Banknote className="w-4 h-4"/> Reg. Fee
                            </div>
                            <div className="font-mono font-bold text-white text-lg">
                                Rp {cat.price.toLocaleString('id-ID', {notation: "compact"})}
                            </div>
                        </div>

                        {/* Hover Action */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-zinc-800 text-zinc-400">
                                <Edit3 className="w-4 h-4"/>
                            </Button>
                        </div>
                    </div>
                )
            })}

            {/* Add New Card Placeholder */}
            <button 
                onClick={() => setIsFormOpen(true)}
                className="border-2 border-dashed border-zinc-800 rounded-[32px] flex flex-col items-center justify-center gap-4 text-zinc-600 hover:text-cyan-500 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all min-h-[250px] group"
            >
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus className="w-8 h-8"/>
                </div>
                <span className="font-black uppercase tracking-widest text-sm">Add New Division</span>
            </button>
        </div>
      </ScrollArea>

      {/* --- EDIT / DETAIL SHEET --- */}
      <Sheet open={!!selectedCat} onOpenChange={() => setSelectedCat(null)}>
        <SheetContent className="w-full sm:max-w-md bg-zinc-950 border-l border-zinc-800 p-0 overflow-y-auto">
            {selectedCat && (
                <div className="flex flex-col h-full">
                    
                    {/* Header */}
                    <div className="p-8 border-b border-zinc-800 bg-cyan-950/20">
                        <div className="flex items-center gap-4 mb-4">
                            <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center text-2xl font-black border-2", getGenderColor(selectedCat.gender))}>
                                {selectedCat.code.split('-')[0]}
                            </div>
                            <div>
                                <Badge variant="outline" className="border-cyan-500/50 text-cyan-500 mb-1">{selectedCat.id}</Badge>
                                <h2 className="text-2xl font-black text-white uppercase leading-none">{selectedCat.name}</h2>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Badge className="bg-zinc-900 text-zinc-300 hover:bg-zinc-800">{selectedCat.group}</Badge>
                            <Badge className="bg-zinc-900 text-zinc-300 hover:bg-zinc-800">{selectedCat.age}</Badge>
                        </div>
                    </div>

                    <div className="p-8 space-y-8 flex-1">
                        
                        {/* Quota Management */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                    <Users className="w-4 h-4 text-cyan-500"/> Capacity Control
                                </h3>
                                <Switch checked={selectedCat.status === 'OPEN'} />
                            </div>
                            
                            <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 text-center">
                                <div className="text-4xl font-black text-white mb-2">
                                    {selectedCat.quota.current} <span className="text-lg text-zinc-600">/ {selectedCat.quota.max}</span>
                                </div>
                                <div className="flex justify-center gap-4 mt-4">
                                    <Button size="icon" variant="outline" className="h-10 w-10 rounded-full border-zinc-700">-</Button>
                                    <span className="text-xs font-bold text-zinc-500 self-center uppercase">Adjust Max</span>
                                    <Button size="icon" variant="outline" className="h-10 w-10 rounded-full border-zinc-700">+</Button>
                                </div>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <Banknote className="w-4 h-4 text-green-500"/> Registration Fee
                            </h3>
                            <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 flex items-center gap-4">
                                <div className="bg-black p-3 rounded-xl text-green-500">Rp</div>
                                <Input 
                                    defaultValue={selectedCat.price} 
                                    className="bg-transparent border-none text-2xl font-mono font-bold text-white focus-visible:ring-0 p-0"
                                />
                            </div>
                        </div>

                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur-md grid grid-cols-2 gap-4">
                        <Button variant="outline" className="h-14 rounded-2xl border-red-900/50 text-red-500 hover:bg-red-950 font-bold hover:text-white">
                            <Trash2 className="w-5 h-5 mr-2"/> DELETE
                        </Button>
                        <Button className="h-14 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold shadow-lg shadow-cyan-900/20">
                            SAVE CHANGES
                        </Button>
                    </div>
                </div>
            )}
        </SheetContent>
      </Sheet>

      {/* --- ADD CATEGORY MODAL --- */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-white rounded-[40px] max-w-lg p-0 overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-zinc-800 bg-cyan-950/20">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black font-headline uppercase flex items-center gap-2 text-cyan-500">
                        <LayoutGrid className="w-6 h-6"/> Create Division
                    </DialogTitle>
                    <DialogDescription>Tambahkan kategori pertandingan baru.</DialogDescription>
                </DialogHeader>
            </div>
            
            <div className="p-8 space-y-6">
                
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Nama Kategori</label>
                    <Input placeholder="Cth: Tunggal Putra U-15" className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl text-lg font-bold" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Kode (Singkatan)</label>
                        <Input placeholder="MS-U15" className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl font-black uppercase" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Group</label>
                        <Select>
                            <SelectTrigger className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl"><SelectValue placeholder="Type..." /></SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                <SelectItem value="SINGLES">Singles</SelectItem>
                                <SelectItem value="DOUBLES">Doubles</SelectItem>
                                <SelectItem value="TEAM">Team Event</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Maksimal Peserta</label>
                        <Input type="number" placeholder="64" className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Biaya (Rp)</label>
                        <Input type="number" placeholder="150000" className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl" />
                    </div>
                </div>

                <Button className="w-full h-16 rounded-full font-black text-lg bg-cyan-600 hover:bg-cyan-700 text-white mt-4 shadow-xl shadow-cyan-900/20">
                    PUBLISH DIVISION
                </Button>
            </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}

    