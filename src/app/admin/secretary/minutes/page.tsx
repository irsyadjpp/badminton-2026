
'use client';

import { useState } from "react";
import { 
  FileText, Calendar, Clock, MapPin, 
  CheckSquare, Users, Plus, Search, 
  ArrowRight, MoreHorizontal, AlertCircle, 
  PieChart, StickyNote, ListChecks 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// --- MOCK DATA ---
const MEETINGS = [
  { 
    id: "M-005", 
    title: "Finalisasi Rundown Opening Ceremony", 
    category: "PLENARY", 
    date: "Today, 10:00", 
    location: "Meeting Room A", 
    attendees: 12, 
    actionItems: { total: 5, done: 2 },
    status: "OPEN",
    summary: "Pembahasan durasi sambutan dan cue card MC. Gladi resik dijadwalkan H-1."
  },
  { 
    id: "M-004", 
    title: "Koordinasi Keamanan & Gate", 
    category: "TECHNICAL", 
    date: "Yesterday", 
    location: "Venue Hall", 
    attendees: 8, 
    actionItems: { total: 3, done: 3 },
    status: "CLOSED",
    summary: "Plotting personil keamanan di 3 titik pintu masuk. SOP pemeriksaan tas disepakati."
  },
  { 
    id: "M-003", 
    title: "Evaluasi Vendor Katering", 
    category: "EVALUATION", 
    date: "10 Jun 2026", 
    location: "Online (Zoom)", 
    attendees: 5, 
    actionItems: { total: 4, done: 1 },
    status: "OPEN",
    summary: "Komplain mengenai keterlambatan makan siang crew. Vendor berjanji menambah armada."
  },
];

const CATEGORIES = [
  { id: "PLENARY", label: "Rapat Pleno (Besar)", color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
  { id: "TECHNICAL", label: "Rapat Teknis", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  { id: "EVALUATION", label: "Evaluasi", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
  { id: "EMERGENCY", label: "Darurat / Insidental", color: "text-red-400 bg-red-500/10 border-red-500/20" },
];

export default function MeetingMinutesPage() {
  const [selectedMeeting, setSelectedMeeting] = useState<typeof MEETINGS[0] | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const getCategoryStyle = (catId: string) => {
    return CATEGORIES.find(c => c.id === catId) || CATEGORIES[0];
  };

  return (
    <div className="space-y-8 p-4 md:p-8 font-body pb-24 h-[calc(100vh-64px)] flex flex-col">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shrink-0">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="rounded-full px-3 py-1 border-indigo-500 text-indigo-500 bg-indigo-500/10 backdrop-blur-md">
                    <FileText className="w-3 h-3 mr-2" /> SECRETARIAT LOGS
                </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-black font-headline uppercase tracking-tighter text-white">
                Tactical <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-600">Briefing</span>
            </h1>
            <p className="text-zinc-400 mt-2 max-w-xl text-lg">
                Rekam jejak keputusan strategis dan monitoring tugas pasca-rapat.
            </p>
        </div>

        <Button 
            onClick={() => setIsAddOpen(true)}
            className="h-14 rounded-full px-8 bg-white text-black hover:bg-zinc-200 font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-transform active:scale-95"
        >
            <Plus className="mr-2 w-5 h-5"/> NEW BRIEFING
        </Button>
      </div>

      {/* --- STATS OVERVIEW --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
         <Card className="bg-zinc-900 border-zinc-800 rounded-[28px] p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                <Calendar className="w-6 h-6"/>
            </div>
            <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Meetings</p>
                <p className="text-3xl font-black text-white">24</p>
            </div>
         </Card>
         <Card className="bg-zinc-900 border-zinc-800 rounded-[28px] p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                <ListChecks className="w-6 h-6"/>
            </div>
            <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Open Actions</p>
                <p className="text-3xl font-black text-white">8 <span className="text-sm text-zinc-500">Items</span></p>
            </div>
         </Card>
         <Card className="bg-zinc-900 border-zinc-800 rounded-[28px] p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
                <PieChart className="w-6 h-6"/>
            </div>
            <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Completion Rate</p>
                <p className="text-3xl font-black text-white">78%</p>
            </div>
         </Card>
      </div>

      {/* --- MAIN CONTENT (LIST) --- */}
      <div className="flex-1 bg-zinc-900/50 border border-zinc-800/50 rounded-[40px] p-2 backdrop-blur-sm min-h-0 flex flex-col">
        
        <div className="flex flex-col md:flex-row items-center justify-between px-4 py-4 gap-4 shrink-0">
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 no-scrollbar">
                <Badge variant="secondary" className="h-10 px-6 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer">
                    All Logs
                </Badge>
                <Badge variant="outline" className="h-10 px-6 rounded-full border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer">
                    Pending Actions
                </Badge>
                <Badge variant="outline" className="h-10 px-6 rounded-full border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer">
                    Archived
                </Badge>
            </div>

            <div className="relative w-full md:w-72">
                <Search className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
                <Input 
                    placeholder="Search topics..." 
                    className="h-12 bg-zinc-950 border-zinc-800 rounded-full pl-10 text-white focus:ring-indigo-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>

        <ScrollArea className="flex-1 px-4 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {MEETINGS.map((meeting) => {
                    const style = getCategoryStyle(meeting.category);
                    const progress = (meeting.actionItems.done / meeting.actionItems.total) * 100;

                    return (
                        <div 
                            key={meeting.id}
                            onClick={() => setSelectedMeeting(meeting)}
                            className="group bg-zinc-900 border border-zinc-800 rounded-[32px] p-6 hover:border-indigo-500/50 transition-all cursor-pointer hover:-translate-y-1 relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <Badge variant="outline" className={cn("text-[9px] font-black border-none px-2 py-1", style.color)}>
                                    {style.label}
                                </Badge>
                                <span className="text-xs font-mono font-bold text-zinc-500">{meeting.date}</span>
                            </div>

                            <h3 className="text-lg font-black text-white leading-tight mb-2 line-clamp-2 group-hover:text-indigo-400 transition-colors">
                                {meeting.title}
                            </h3>
                            
                            <div className="flex items-center gap-4 text-xs text-zinc-400 mb-6">
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {meeting.location}</span>
                                <span className="flex items-center gap-1"><Users className="w-3 h-3"/> {meeting.attendees} Pax</span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase">
                                    <span>Action Items</span>
                                    <span className={cn(progress === 100 ? "text-green-500" : "text-white")}>
                                        {meeting.actionItems.done}/{meeting.actionItems.total} Done
                                    </span>
                                </div>
                                <Progress value={progress} className="h-2 bg-zinc-950" indicatorClassName={cn(progress === 100 ? "bg-green-500" : "bg-indigo-500")} />
                            </div>

                            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="icon" className="h-10 w-10 rounded-full bg-white text-black hover:bg-zinc-200">
                                    <ArrowRight className="w-5 h-5"/>
                                </Button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </ScrollArea>
      </div>

      {/* --- DETAIL SHEET --- */}
      <Sheet open={!!selectedMeeting} onOpenChange={() => setSelectedMeeting(null)}>
        <SheetContent className="w-full sm:max-w-md bg-zinc-950 border-l border-zinc-800 p-0 overflow-y-auto">
            {selectedMeeting && (
                <div className="flex flex-col h-full">
                    
                    {/* Header */}
                    <div className="p-8 border-b border-zinc-800 bg-indigo-950/20">
                        <Badge variant="outline" className="mb-4 border-indigo-500 text-indigo-500 font-mono">
                            {selectedMeeting.id}
                        </Badge>
                        <h2 className="text-2xl font-black text-white uppercase leading-tight mb-2">
                            {selectedMeeting.title}
                        </h2>
                        <div className="flex flex-wrap gap-3 text-sm text-zinc-400">
                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {selectedMeeting.date}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {selectedMeeting.location}</span>
                        </div>
                    </div>

                    <div className="p-8 space-y-8 flex-1">
                        
                        {/* Summary */}
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <StickyNote className="w-4 h-4 text-indigo-500"/> Executive Summary
                            </h3>
                            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl text-sm text-zinc-300 leading-relaxed">
                                {selectedMeeting.summary}
                            </div>
                        </div>

                        {/* Action Items Checklist */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <ListChecks className="w-4 h-4 text-indigo-500"/> Action Items (Quests)
                            </h3>
                            <div className="space-y-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                                        <div className={cn(
                                            "w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5",
                                            i <= selectedMeeting.actionItems.done ? "bg-green-500 border-green-500 text-black" : "border-zinc-600"
                                        )}>
                                            {i <= selectedMeeting.actionItems.done && <CheckSquare className="w-3 h-3"/>}
                                        </div>
                                        <div>
                                            <p className={cn("text-sm font-bold", i <= selectedMeeting.actionItems.done ? "text-zinc-500 line-through" : "text-white")}>
                                                Update final rundown ke seluruh divisi
                                            </p>
                                            <p className="text-[10px] text-zinc-500 mt-1">PIC: Sekretaris • Due: Tomorrow</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Attendance */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <Users className="w-4 h-4 text-indigo-500"/> Squad Presence
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {[1,2,3,4,5,6].map(i => (
                                    <Avatar key={i} className="w-10 h-10 border-2 border-zinc-800">
                                        <AvatarFallback className="bg-zinc-900 text-xs font-bold text-zinc-500">P{i}</AvatarFallback>
                                    </Avatar>
                                ))}
                                <div className="w-10 h-10 rounded-full bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500">
                                    +6
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur-md">
                        <Button className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-900/20">
                            UPDATE PROGRESS
                        </Button>
                    </div>
                </div>
            )}
        </SheetContent>
      </Sheet>

      {/* --- ADD MEETING MODAL --- */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-white rounded-[40px] max-w-lg p-0 overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-zinc-800 bg-indigo-950/20">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black font-headline uppercase flex items-center gap-2 text-indigo-500">
                        <FileText className="w-6 h-6"/> Create Briefing
                    </DialogTitle>
                    <DialogDescription>Catat hasil rapat dan delegasikan tugas.</DialogDescription>
                </DialogHeader>
            </div>
            
            <div className="p-8 space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Judul Rapat</label>
                    <Input placeholder="Topik Pembahasan" className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl text-lg font-bold" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Kategori</label>
                        <Select>
                            <SelectTrigger className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl"><SelectValue placeholder="Pilih..." /></SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                {CATEGORIES.map(c => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Lokasi</label>
                        <Input placeholder="Room / Zoom" className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Ringkasan / Hasil</label>
                    <Textarea placeholder="Poin-poin penting..." className="bg-zinc-900 border-zinc-800 rounded-2xl min-h-[100px] resize-none p-4" />
                </div>

                <Button className="w-full h-16 rounded-full font-black text-lg bg-indigo-600 hover:bg-indigo-700 text-white mt-4 shadow-xl shadow-indigo-900/20">
                    SAVE & ADD TASKS
                </Button>
            </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
