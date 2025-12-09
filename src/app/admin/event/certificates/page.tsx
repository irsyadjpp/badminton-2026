
'use client';

import { useState } from "react";
import { 
  Award, Download, Upload, Type, 
  Palette, QrCode, CheckCircle2, RefreshCcw, 
  Users, Mail, Printer, Sparkles, Wand2,
  ChevronRight, FileBadge
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// --- MOCK DATA ---
const TEMPLATES = [
  { id: "TMP-01", name: "Modern Gold (Winner)", style: "bg-gradient-to-br from-yellow-900 to-black border-yellow-500", text: "text-yellow-500" },
  { id: "TMP-02", name: "Classic Minimalist", style: "bg-white border-zinc-200", text: "text-black" },
  { id: "TMP-03", name: "Gen-Z Cyber", style: "bg-zinc-950 border-cyan-500", text: "text-cyan-400" },
];

const RECIPIENTS_QUEUE = [
  { id: 1, name: "Kevin Sanjaya", category: "Juara 1 - Ganda Putra", email: "kevin@mail.com", status: "PENDING" },
  { id: 2, name: "Marcus Gideon", category: "Juara 1 - Ganda Putra", email: "marcus@mail.com", status: "PENDING" },
  { id: 3, name: "Anthony Ginting", category: "Juara 2 - Tunggal Putra", email: "ginting@mail.com", status: "SENT" },
];

export default function CertificateGeneratorPage() {
  const [activeTab, setActiveTab] = useState("design");
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Design State
  const [certTitle, setCertTitle] = useState("CERTIFICATE OF ACHIEVEMENT");
  const [certName, setCertName] = useState("NAMA PENERIMA");
  const [certDesc, setCertDesc] = useState("Diberikan atas pencapaian luar biasa sebagai JUARA 1 dalam Turnamen Bandung Championship 2026.");
  const [showQR, setShowQR] = useState(true);

  const handleBulkGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
        setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="space-y-8 p-4 md:p-8 font-body pb-24 h-[calc(100vh-64px)] flex flex-col">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shrink-0">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="rounded-full px-3 py-1 border-yellow-500 text-yellow-500 bg-yellow-500/10 backdrop-blur-md">
                    <Sparkles className="w-3 h-3 mr-2" /> HALL OF FAME
                </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-black font-headline uppercase tracking-tighter text-white">
                Achievement <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">Minting</span>
            </h1>
            <p className="text-zinc-400 mt-2 max-w-xl text-lg">
                Studio desain & generator sertifikat digital otomatis.
            </p>
        </div>

        <div className="flex gap-3">
            <Button variant="outline" className="h-14 rounded-full border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 font-bold">
                <Upload className="mr-2 w-5 h-5"/> Import CSV
            </Button>
            <Button 
                onClick={handleBulkGenerate}
                disabled={isGenerating}
                className="h-14 rounded-full px-8 bg-yellow-500 hover:bg-yellow-600 text-black font-black text-lg shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all"
            >
                {isGenerating ? "MINTING..." : <><Wand2 className="mr-2 w-5 h-5"/> GENERATE ALL</>}
            </Button>
        </div>
      </div>

      {/* --- MAIN WORKSPACE --- */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
         
         {/* LEFT: CONFIGURATION PANEL (1/3) */}
         <Card className="lg:col-span-1 bg-zinc-900 border-zinc-800 rounded-[32px] flex flex-col overflow-hidden h-full shadow-2xl">
            <div className="p-2 bg-zinc-950 border-b border-zinc-800">
                <Tabs defaultValue="design" className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="bg-transparent w-full">
                        <TabsTrigger value="design" className="flex-1 rounded-xl data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-500 font-bold">
                            <Palette className="w-4 h-4 mr-2"/> DESIGN
                        </TabsTrigger>
                        <TabsTrigger value="data" className="flex-1 rounded-xl data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-500 font-bold">
                            <Users className="w-4 h-4 mr-2"/> RECIPIENTS
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <ScrollArea className="flex-1 p-6">
                {activeTab === 'design' ? (
                    <div className="space-y-6">
                        {/* Template Selector */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Select Template</label>
                            <div className="grid grid-cols-1 gap-3">
                                {TEMPLATES.map((t) => (
                                    <div 
                                        key={t.id}
                                        onClick={() => setSelectedTemplate(t)}
                                        className={cn(
                                            "p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between",
                                            selectedTemplate.id === t.id ? "bg-zinc-800 border-yellow-500" : "bg-zinc-950 border-zinc-800 hover:border-zinc-600"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-8 h-8 rounded-full border shadow-sm", t.style)}></div>
                                            <span className="font-bold text-white text-sm">{t.name}</span>
                                        </div>
                                        {selectedTemplate.id === t.id && <CheckCircle2 className="w-5 h-5 text-yellow-500"/>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Text Config */}
                        <div className="space-y-4 border-t border-zinc-800 pt-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                                    <Type className="w-3 h-3"/> Headline
                                </label>
                                <Input 
                                    value={certTitle} 
                                    onChange={(e) => setCertTitle(e.target.value)} 
                                    className="bg-black border-zinc-800 rounded-xl text-white font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                                    <Type className="w-3 h-3"/> Placeholder Name
                                </label>
                                <Input 
                                    value={certName} 
                                    onChange={(e) => setCertName(e.target.value)} 
                                    className="bg-black border-zinc-800 rounded-xl text-white font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                                    <Type className="w-3 h-3"/> Description Body
                                </label>
                                <textarea 
                                    value={certDesc} 
                                    onChange={(e) => setCertDesc(e.target.value)} 
                                    className="w-full bg-black border border-zinc-800 rounded-xl text-sm text-zinc-300 p-3 min-h-[100px] focus:outline-none focus:ring-1 focus:ring-yellow-500"
                                />
                            </div>
                        </div>

                        {/* Toggle Features */}
                        <div className="space-y-3 border-t border-zinc-800 pt-6">
                            <div 
                                onClick={() => setShowQR(!showQR)}
                                className={cn(
                                    "flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all",
                                    showQR ? "bg-zinc-800 border-green-500/50" : "bg-zinc-950 border-zinc-800"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-black rounded-lg"><QrCode className="w-4 h-4 text-white"/></div>
                                    <span className="text-sm font-bold text-white">Validation QR Code</span>
                                </div>
                                <div className={cn("w-4 h-4 rounded-full border", showQR ? "bg-green-500 border-green-500" : "border-zinc-600")}></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest">Queue List</h3>
                            <Badge variant="secondary" className="bg-zinc-800 text-white">{RECIPIENTS_QUEUE.length} Pax</Badge>
                        </div>
                        {RECIPIENTS_QUEUE.map((user) => (
                            <div key={user.id} className="p-3 bg-zinc-950 border border-zinc-800 rounded-2xl flex justify-between items-center group hover:border-zinc-600 transition-colors">
                                <div>
                                    <p className="font-bold text-white text-sm">{user.name}</p>
                                    <p className="text-[10px] text-zinc-500 uppercase">{user.category}</p>
                                </div>
                                {user.status === 'SENT' ? (
                                    <Badge className="bg-green-500/20 text-green-500 border-none text-[9px]">SENT</Badge>
                                ) : (
                                    <Badge variant="outline" className="border-zinc-700 text-zinc-500 text-[9px]">WAITING</Badge>
                                )}
                            </div>
                        ))}
                        <Button variant="outline" className="w-full border-dashed border-zinc-700 text-zinc-500 hover:text-white">
                            + Add Manually
                        </Button>
                    </div>
                )}
            </ScrollArea>
         </Card>

         {/* RIGHT: LIVE PREVIEW (2/3) */}
         <div className="lg:col-span-2 flex flex-col h-full gap-6">
            
            {/* CANVAS AREA */}
            <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-[32px] p-8 flex items-center justify-center relative overflow-hidden group">
                
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[url('/images/grid-pattern.png')] opacity-10 pointer-events-none"></div>

                {/* THE CERTIFICATE */}
                <div className={cn(
                    "aspect-[1.414/1] w-full max-w-3xl shadow-2xl relative transition-all duration-500 transform group-hover:scale-[1.01]",
                    selectedTemplate.style
                )}>
                    {/* Ornamental Border (CSS) */}
                    <div className="absolute inset-4 border-2 border-white/20 pointer-events-none"></div>
                    <div className="absolute inset-6 border border-white/10 pointer-events-none"></div>

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 space-y-6">
                        
                        {/* Header Logo */}
                        <div className="flex items-center gap-4 opacity-80 mb-4">
                            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <Award className={cn("w-6 h-6", selectedTemplate.text)}/>
                            </div>
                            <span className={cn("text-sm font-black tracking-[0.3em] uppercase", selectedTemplate.text)}>Official Award</span>
                        </div>

                        {/* Title */}
                        <h1 className={cn("text-4xl md:text-5xl font-black uppercase tracking-tight", selectedTemplate.text === "text-black" ? "text-black" : "text-white")}>
                            {certTitle}
                        </h1>

                        {/* Awarded To */}
                        <div className="space-y-2 w-full">
                            <p className={cn("text-xs font-bold uppercase tracking-widest opacity-60", selectedTemplate.text === "text-black" ? "text-zinc-600" : "text-zinc-400")}>Presented To</p>
                            <div className="border-b-2 border-white/20 pb-2 w-3/4 mx-auto">
                                <h2 className={cn("text-3xl md:text-5xl font-serif italic font-bold", selectedTemplate.text === "text-black" ? "text-zinc-900" : "text-white")}>
                                    {certName}
                                </h2>
                            </div>
                        </div>

                        {/* Description */}
                        <p className={cn("max-w-lg text-sm md:text-base leading-relaxed font-medium", selectedTemplate.text === "text-black" ? "text-zinc-700" : "text-zinc-300")}>
                            {certDesc}
                        </p>

                        {/* Footer (Signatures & QR) */}
                        <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
                            <div className="text-left space-y-1">
                                <div className="h-12 w-32 border-b border-white/30 mb-2 relative">
                                    {/* Mock Signature */}
                                    <svg className="absolute bottom-0 w-full h-full stroke-current text-white/50" viewBox="0 0 100 50">
                                        <path d="M10,40 Q30,10 50,40 T90,20" fill="none" strokeWidth="2" />
                                    </svg>
                                </div>
                                <p className={cn("text-[10px] font-bold uppercase", selectedTemplate.text === "text-black" ? "text-black" : "text-white")}>Ketua Panitia</p>
                            </div>

                            {showQR && (
                                <div className="bg-white p-1 rounded-lg">
                                    <QrCode className="w-16 h-16 text-black"/>
                                </div>
                            )}

                            <div className="text-right space-y-1">
                                <div className="h-12 w-32 border-b border-white/30 mb-2 relative">
                                    <svg className="absolute bottom-0 w-full h-full stroke-current text-white/50" viewBox="0 0 100 50">
                                        <path d="M10,30 Q40,50 60,10 T90,30" fill="none" strokeWidth="2" />
                                    </svg>
                                </div>
                                <p className={cn("text-[10px] font-bold uppercase", selectedTemplate.text === "text-black" ? "text-black" : "text-white")}>Referee</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* ACTION BAR */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-zinc-900 border-zinc-800 rounded-[24px] p-4 flex items-center justify-center gap-2 cursor-pointer hover:bg-zinc-800 hover:border-yellow-500/30 transition-all">
                    <FileBadge className="w-5 h-5 text-yellow-500"/>
                    <span className="text-sm font-bold text-white">Preview PDF</span>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800 rounded-[24px] p-4 flex items-center justify-center gap-2 cursor-pointer hover:bg-zinc-800 hover:border-blue-500/30 transition-all">
                    <Mail className="w-5 h-5 text-blue-500"/>
                    <span className="text-sm font-bold text-white">Test Email</span>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800 rounded-[24px] p-4 flex items-center justify-center gap-2 cursor-pointer hover:bg-zinc-800 hover:border-green-500/30 transition-all">
                    <Printer className="w-5 h-5 text-green-500"/>
                    <span className="text-sm font-bold text-white">Print Mode</span>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800 rounded-[24px] p-4 flex items-center justify-center gap-2 cursor-pointer hover:bg-zinc-800 hover:border-purple-500/30 transition-all">
                    <Download className="w-5 h-5 text-purple-500"/>
                    <span className="text-sm font-bold text-white">Download</span>
                </Card>
            </div>

         </div>

      </div>

    </div>
  );
}
