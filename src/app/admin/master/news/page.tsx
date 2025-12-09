'use client';

import { useState } from "react";
import { 
  Newspaper, PenTool, Eye, Calendar, 
  User, Image as ImageIcon, MoreHorizontal, 
  Search, Plus, ArrowLeft, Save, Send, 
  BarChart3, Globe, Hash, Clock,
  Bold, Italic, Underline, List, ListOrdered, 
  Quote, Link as LinkIcon, Heading1, Heading2,
  AlignLeft, AlignCenter, AlignRight, FileImage
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// --- MOCK DATA ---
const ARTICLES = [
  { 
    id: "N-001", 
    title: "Kevin/Marcus Melaju ke Final dengan Dramatis!", 
    excerpt: "Pertandingan sengit 3 set melawan wakil China berakhir dengan kemenangan manis untuk The Minions...",
    category: "MATCH REPORT",
    author: { name: "Sarah (Media)", img: "https://github.com/shadcn.png" },
    date: "12 Oct 2026",
    status: "PUBLISHED",
    views: "15.4k",
    cover: "/images/news-1.jpg"
  },
  { 
    id: "N-002", 
    title: "Panduan Parkir & Shuttle Bus Final Day", 
    excerpt: "Demi kenyamanan, panitia menyediakan 5 titik jemput shuttle bus. Berikut detail lokasinya...",
    category: "INFO",
    author: { name: "Admin Logistik", img: "" },
    date: "11 Oct 2026",
    status: "PUBLISHED",
    views: "8.2k",
    cover: "/images/news-2.jpg"
  },
  { 
    id: "N-003", 
    title: "Interview Eksklusif: Masa Depan Bulutangkis", 
    excerpt: "Bincang santai dengan legenda Taufik Hidayat mengenai regenerasi atlet muda...",
    category: "FEATURE",
    author: { name: "Budi (Jurnalis)", img: "" },
    date: "Drafted 2h ago",
    status: "DRAFT",
    views: "-",
    cover: ""
  },
];

const CATEGORIES = ["ALL", "MATCH REPORT", "INFO", "FEATURE", "PRESS RELEASE"];

export default function NewsManagementPage() {
  const [viewMode, setViewMode] = useState<'GRID' | 'EDITOR'>('GRID');
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Editor State
  const [editorTitle, setEditorTitle] = useState("");
  const [editorContent, setEditorContent] = useState("");

  const filteredArticles = ARTICLES.filter(a => 
    (activeFilter === 'ALL' || a.category === activeFilter) &&
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 p-4 md:p-8 font-body pb-24 h-[calc(100vh-64px)] flex flex-col">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shrink-0">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="rounded-full px-3 py-1 border-cyan-500 text-cyan-500 bg-cyan-500/10 backdrop-blur-md">
                    <Newspaper className="w-3 h-3 mr-2" /> PRESS ROOM
                </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-black font-headline uppercase tracking-tighter text-white">
                Newsroom <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-600">Command</span>
            </h1>
            <p className="text-zinc-400 mt-2 max-w-xl text-lg">
                Pusat publikasi berita, artikel pertandingan, dan informasi resmi.
            </p>
        </div>

        {viewMode === 'GRID' && (
            <Button 
                onClick={() => setViewMode('EDITOR')}
                className="h-14 rounded-full px-8 bg-cyan-600 hover:bg-cyan-700 text-white font-black text-lg shadow-[0_0_20px_rgba(8,145,178,0.4)] transition-transform active:scale-95"
            >
                <PenTool className="mr-2 w-5 h-5"/> WRITE STORY
            </Button>
        )}
      </div>

      {viewMode === 'GRID' ? (
        <>
            {/* --- STATS OVERVIEW --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
                <Card className="bg-zinc-900 border-zinc-800 rounded-[28px] p-5 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                        <Eye className="w-6 h-6"/>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Reads</p>
                        <p className="text-3xl font-black text-white">24.5k</p>
                    </div>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800 rounded-[28px] p-5 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
                        <Globe className="w-6 h-6"/>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Published</p>
                        <p className="text-3xl font-black text-white">12</p>
                    </div>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800 rounded-[28px] p-5 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                        <PenTool className="w-6 h-6"/>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Drafts</p>
                        <p className="text-3xl font-black text-white">3</p>
                    </div>
                </Card>
            </div>

            {/* --- CONTENT GRID --- */}
            <div className="flex-1 bg-zinc-900/50 border border-zinc-800/50 rounded-[40px] p-2 backdrop-blur-sm flex flex-col min-h-0">
                
                <div className="flex flex-col md:flex-row items-center justify-between px-4 py-4 gap-4 shrink-0">
                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto p-1 no-scrollbar">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveFilter(cat)}
                                className={cn(
                                    "px-6 h-10 rounded-full text-sm font-bold transition-all whitespace-nowrap border border-transparent",
                                    activeFilter === cat 
                                        ? "bg-zinc-800 text-white border-zinc-700 shadow-md" 
                                        : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-3 w-5 h-5 text-zinc-500" />
                        <input 
                            type="text" 
                            placeholder="Search headlines..." 
                            className="w-full bg-zinc-950 text-white font-bold placeholder:text-zinc-600 pl-12 pr-4 h-12 rounded-full border border-zinc-800 focus:outline-none focus:border-cyan-500 transition-colors"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <ScrollArea className="flex-1 px-4 pb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredArticles.map((article) => (
                            <div 
                                key={article.id} 
                                className="group relative bg-zinc-900 border border-zinc-800 rounded-[32px] overflow-hidden cursor-pointer hover:-translate-y-1 transition-all hover:shadow-2xl"
                            >
                                {/* Thumbnail */}
                                <div className="h-48 bg-zinc-950 relative overflow-hidden">
                                    {article.cover ? (
                                        <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center text-zinc-600">
                                            {/* Mock Image Placeholder */}
                                            <ImageIcon className="w-12 h-12 opacity-20"/>
                                        </div>
                                    ) : (
                                        <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center text-zinc-600">
                                            <ImageIcon className="w-12 h-12 opacity-20"/>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-80"></div>
                                    
                                    {/* Badges on Image */}
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <Badge className={cn("text-[10px] font-black border-none", 
                                            article.status === 'PUBLISHED' ? "bg-green-500 text-black" : "bg-yellow-500 text-black"
                                        )}>
                                            {article.status}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="p-6 pt-2">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">{article.category}</span>
                                        <span className="text-[10px] font-mono text-zinc-500">{article.date}</span>
                                    </div>
                                    
                                    <h3 className="text-xl font-black text-white leading-tight mb-3 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                                        {article.title}
                                    </h3>
                                    
                                    <p className="text-xs text-zinc-400 line-clamp-2 mb-6">
                                        {article.excerpt}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6 border border-zinc-700">
                                                <AvatarImage src={article.author.img} />
                                                <AvatarFallback className="bg-zinc-800 text-[9px] text-zinc-400">{article.author.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="text-xs font-bold text-zinc-500">{article.author.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs font-bold text-zinc-500">
                                            <BarChart3 className="w-3 h-3"/> {article.views}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </>
      ) : (
        // --- EDITOR MODE (WYSIWYG) ---
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0 animate-in slide-in-from-bottom-4 fade-in duration-300">
            
            {/* Main Editor */}
            <Card className="lg:col-span-2 bg-zinc-950 border-zinc-800 rounded-[32px] flex flex-col overflow-hidden shadow-2xl relative">
                
                <div className="flex items-center gap-4 p-4 border-b border-zinc-800">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-zinc-800" onClick={() => setViewMode('GRID')}>
                        <ArrowLeft className="w-5 h-5 text-zinc-400"/>
                    </Button>
                    <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Story Editor</span>
                </div>

                {/* WYSIWYG TOOLBAR */}
                <div className="flex items-center gap-1 p-2 bg-zinc-900 border-b border-zinc-800 overflow-x-auto no-scrollbar sticky top-0 z-20">
                    <div className="flex items-center bg-zinc-950 rounded-xl p-1 border border-zinc-800">
                        <Toggle size="sm" className="h-9 w-9 data-[state=on]:bg-cyan-900 data-[state=on]:text-cyan-400"><Bold className="w-4 h-4"/></Toggle>
                        <Toggle size="sm" className="h-9 w-9 data-[state=on]:bg-cyan-900 data-[state=on]:text-cyan-400"><Italic className="w-4 h-4"/></Toggle>
                        <Toggle size="sm" className="h-9 w-9 data-[state=on]:bg-cyan-900 data-[state=on]:text-cyan-400"><Underline className="w-4 h-4"/></Toggle>
                    </div>
                    <Separator orientation="vertical" className="h-6 bg-zinc-800 mx-1" />
                    <div className="flex items-center bg-zinc-950 rounded-xl p-1 border border-zinc-800">
                        <Toggle size="sm" className="h-9 w-9"><AlignLeft className="w-4 h-4"/></Toggle>
                        <Toggle size="sm" className="h-9 w-9"><AlignCenter className="w-4 h-4"/></Toggle>
                        <Toggle size="sm" className="h-9 w-9"><AlignRight className="w-4 h-4"/></Toggle>
                    </div>
                    <Separator orientation="vertical" className="h-6 bg-zinc-800 mx-1" />
                    <div className="flex items-center bg-zinc-950 rounded-xl p-1 border border-zinc-800">
                        <Toggle size="sm" className="h-9 w-9"><Heading1 className="w-4 h-4"/></Toggle>
                        <Toggle size="sm" className="h-9 w-9"><Heading2 className="w-4 h-4"/></Toggle>
                    </div>
                    <Separator orientation="vertical" className="h-6 bg-zinc-800 mx-1" />
                    <div className="flex items-center bg-zinc-950 rounded-xl p-1 border border-zinc-800">
                        <Toggle size="sm" className="h-9 w-9"><List className="w-4 h-4"/></Toggle>
                        <Toggle size="sm" className="h-9 w-9"><ListOrdered className="w-4 h-4"/></Toggle>
                        <Toggle size="sm" className="h-9 w-9"><Quote className="w-4 h-4"/></Toggle>
                    </div>
                    <Separator orientation="vertical" className="h-6 bg-zinc-800 mx-1" />
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-zinc-800 text-zinc-400"><LinkIcon className="w-4 h-4"/></Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-zinc-800 text-zinc-400"><FileImage className="w-4 h-4"/></Button>
                    </div>
                </div>
                
                <ScrollArea className="flex-1 bg-zinc-950">
                    <div className="p-8 md:p-12 max-w-3xl mx-auto space-y-8 min-h-[500px]">
                        
                        {/* Cover Image Uploader */}
                        <div className="aspect-video bg-zinc-900 border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center text-zinc-600 hover:text-cyan-500 hover:border-cyan-500/30 hover:bg-cyan-900/5 transition-all cursor-pointer group">
                            <ImageIcon className="w-12 h-12 mb-2 group-hover:scale-110 transition-transform"/>
                            <span className="font-bold uppercase tracking-widest text-sm">Add Cover Image</span>
                        </div>

                        {/* Title Input */}
                        <Textarea 
                            placeholder="Type your Headline here..." 
                            className="text-4xl md:text-5xl font-black text-white bg-transparent border-none resize-none placeholder:text-zinc-800 focus-visible:ring-0 p-0 leading-tight min-h-[100px] overflow-hidden"
                            value={editorTitle}
                            onChange={(e) => setEditorTitle(e.target.value)}
                        />

                        {/* WYSIWYG Content Area */}
                        <div 
                            className="prose prose-invert prose-lg max-w-none text-zinc-300 focus:outline-none min-h-[300px]"
                            contentEditable
                            suppressContentEditableWarning
                            onInput={(e) => setEditorContent(e.currentTarget.textContent || "")}
                        >
                            <p className="text-zinc-500 italic">Start writing your story here...</p>
                        </div>
                    </div>
                </ScrollArea>
            </Card>

            {/* Sidebar Settings */}
            <div className="space-y-6">
                <Card className="bg-zinc-900 border-zinc-800 rounded-[32px] p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest">Publishing</h3>
                        <Badge variant="outline" className="border-yellow-500 text-yellow-500 bg-yellow-500/10">DRAFT</Badge>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase">Category</label>
                            <Select>
                                <SelectTrigger className="bg-black border-zinc-800 h-12 rounded-xl text-white"><SelectValue placeholder="Select..."/></SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                    {CATEGORIES.filter(c => c !== 'ALL').map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase">Tags</label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-3.5 w-4 h-4 text-zinc-500"/>
                                <Input placeholder="badminton, final..." className="bg-black border-zinc-800 h-12 rounded-xl pl-9 text-white" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase">Schedule</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-3.5 w-4 h-4 text-zinc-500"/>
                                <Input type="datetime-local" className="bg-black border-zinc-800 h-12 rounded-xl pl-9 text-zinc-400 text-xs" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-800">
                        <Button variant="outline" className="h-12 rounded-xl border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800">
                            <Save className="mr-2 w-4 h-4"/> Save
                        </Button>
                        <Button className="h-12 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold shadow-lg shadow-cyan-900/20">
                            <Send className="mr-2 w-4 h-4"/> PUBLISH
                        </Button>
                    </div>
                </Card>
            </div>

        </div>
      )}

    </div>
  );
}
