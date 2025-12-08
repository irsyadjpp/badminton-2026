
'use client';

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty, CommandGroup } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Check, ChevronsUpDown, UserPlus, Search, 
  Filter, Shield, Users, Briefcase, Zap, MoreVertical 
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- MOCK DATA ---
const DIVISIONS = ["ALL", "MATCH CONTROL", "MEDIA", "LOGISTICS", "SECURITY", "MEDICAL", "FINANCE"];

const MOCK_ROSTER = [
  { id: "1", name: "Kevin Sanjaya Sukamuljo", role: "HEAD OF DIVISION", division: "MATCH CONTROL", email: "kevin.s@bcc.com", status: "ACTIVE", avatar: "https://github.com/shadcn.png" },
  { id: "2", name: "Marcus Fernaldi Gideon", role: "STAFF", division: "MATCH CONTROL", email: "marcus.g@bcc.com", status: "ACTIVE", avatar: "" },
  { id: "3", name: "Fajar Alfian", role: "HEAD OF DIVISION", division: "MEDIA", email: "fajar.a@bcc.com", status: "ON LEAVE", avatar: "" },
  { id: "4", name: "Muhammad Rian Ardianto", role: "STAFF", division: "LOGISTICS", email: "rian.a@bcc.com", status: "ACTIVE", avatar: "" },
  { id: "5", name: "Hendra Setiawan", role: "DIRECTOR", division: "INTI", email: "hendra.s@bcc.com", status: "ACTIVE", avatar: "" },
];

const UNASSIGNED_USERS = [
  { id: "U1", name: "Budi Santoso", email: "budi.new@gmail.com" },
  { id: "U2", name: "Siti Aminah", email: "siti.vol@gmail.com" },
];

export default function RosterPage() {
  const [filterDiv, setFilterDiv] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  
  // State untuk Modal Assign
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [openCombobox, setOpenCombobox] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Filter Logic
  const filteredRoster = MOCK_ROSTER.filter(staff => {
    const matchesDiv = filterDiv === "ALL" || staff.division === filterDiv;
    const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDiv && matchesSearch;
  });

  return (
    <div className="space-y-8 p-4 md:p-8 font-body pb-24">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
              <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="rounded-full px-3 py-1 border-zinc-700 text-zinc-400 bg-zinc-900/50 backdrop-blur-md">
                      <Shield className="w-3 h-3 mr-2 text-primary" /> COMMITTEE DATABASE
                  </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-black font-headline uppercase tracking-tighter text-white">
                  Master Roster
              </h1>
              <p className="text-zinc-400 mt-2 max-w-xl text-lg">
                  Kelola struktur organisasi, delegasi tugas, dan manajemen personil turnamen.
              </p>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
              <div className="flex items-center gap-3 bg-zinc-900 px-5 py-3 rounded-[20px] border border-zinc-800 min-w-fit">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                      <Users className="w-5 h-5" />
                  </div>
                  <div>
                      <div className="text-xs font-bold text-zinc-500 uppercase">Total Staff</div>
                      <div className="text-xl font-black text-white">{MOCK_ROSTER.length}</div>
                  </div>
              </div>
              <div className="flex items-center gap-3 bg-zinc-900 px-5 py-3 rounded-[20px] border border-zinc-800 min-w-fit">
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
                      <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                      <div className="text-xs font-bold text-zinc-500 uppercase">Divisi</div>
                      <div className="text-xl font-black text-white">{DIVISIONS.length - 1}</div>
                  </div>
              </div>
          </div>
      </div>

      <div className="sticky top-4 z-30 bg-zinc-950/80 backdrop-blur-xl p-2 rounded-[24px] border border-zinc-800 flex flex-col md:flex-row gap-2 shadow-2xl">
          <div className="relative flex-grow">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
              <Input 
                  placeholder="Cari nama personil..." 
                  className="h-12 bg-zinc-900 border-none rounded-full pl-12 text-white focus-visible:ring-1 focus-visible:ring-primary placeholder:text-zinc-600"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
              />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto px-2 py-1 md:py-0 no-scrollbar max-w-full md:max-w-2xl">
              {DIVISIONS.map((div) => (
                  <button
                      key={div}
                      onClick={() => setFilterDiv(div)}
                      className={cn(
                          "px-5 h-10 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300",
                          filterDiv === div 
                              ? "bg-white text-black shadow-lg scale-105" 
                              : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      )}
                  >
                      {div}
                  </button>
              ))}
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <button 
              onClick={() => setIsAssignOpen(true)}
              className="group h-full min-h-[220px] border-2 border-dashed border-zinc-800 rounded-[32px] flex flex-col items-center justify-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
          >
              <div className="w-16 h-16 rounded-full bg-zinc-900 group-hover:bg-primary group-hover:text-white flex items-center justify-center text-zinc-500 transition-colors">
                  <UserPlus className="w-8 h-8" />
              </div>
              <div className="text-zinc-500 font-bold group-hover:text-primary tracking-widest text-sm">ASSIGN NEW STAFF</div>
          </button>

            {/* STAFF CARDS (REVISI: ANTI-OVERLAP) */}
            {filteredRoster.map((staff) => (
                <div key={staff.id} className="group relative bg-zinc-900 rounded-[32px] p-6 border border-zinc-800 hover:border-zinc-700 transition-all hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between h-full">
                    
                    {/* Role Badge (Posisi Absolute di Pojok Kanan Atas) */}
                    <div className="absolute top-5 right-5 z-20">
                        <Badge className={cn(
                            "rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider border-none shadow-lg",
                            staff.role.includes("HEAD") || staff.role.includes("DIRECTOR") 
                                ? "bg-white text-black" 
                                : "bg-zinc-800 text-zinc-400"
                        )}>
                            {staff.role}
                        </Badge>
                    </div>

                    {/* Content Body */}
                    <div className="flex items-start gap-4 relative z-10">
                        {/* Avatar: shrink-0 agar tidak gepeng */}
                        <Avatar className="w-14 h-14 md:w-16 md:h-16 rounded-[24px] border-2 border-zinc-800 group-hover:border-primary/50 transition-colors shadow-xl shrink-0">
                            <AvatarImage src={staff.avatar} className="object-cover" />
                            <AvatarFallback className="bg-zinc-800 text-zinc-500 font-black text-xl rounded-[24px]">
                                {staff.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        
                        {/* Container Teks: min-w-0 penting agar text-wrap berfungsi di dalam flex */}
                        <div className="flex flex-col gap-2 w-full min-w-0">
                            
                            {/* 1. NAMA: padding-right besar agar tidak nabrak Badge Role */}
                            <h3 className="text-lg md:text-xl font-black text-white leading-tight pr-24 break-words group-hover:text-primary transition-colors">
                                {staff.name}
                            </h3>
                            
                            <div className="flex flex-col gap-1.5">
                                {/* 2. DIVISI: Menggunakan w-fit max-w-full agar tidak melebar sembarangan */}
                                <div className="inline-flex items-start gap-2 text-xs font-bold text-zinc-400 bg-zinc-950/50 px-3 py-1.5 rounded-xl w-fit max-w-full border border-zinc-800/50">
                                    <Briefcase className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" /> 
                                    {/* break-words & leading-snug agar teks panjang turun ke bawah dengan rapi */}
                                    <span className="break-words leading-snug">
                                        {staff.division}
                                    </span>
                                </div>
                                
                                {/* Email */}
                                <div className="text-[10px] text-zinc-600 font-mono truncate pl-1">
                                    {staff.email}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-between items-center">
                        <div className="flex items-center gap-2 bg-zinc-950/30 px-3 py-1.5 rounded-full">
                            <div className={cn("w-2 h-2 rounded-full shadow-[0_0_8px]", staff.status === 'ACTIVE' ? "bg-green-500 shadow-green-500/50" : "bg-yellow-500 shadow-yellow-500/50")}></div>
                            <span className={cn("text-[10px] font-bold uppercase tracking-wide", staff.status === 'ACTIVE' ? "text-green-500" : "text-yellow-500")}>
                                {staff.status}
                            </span>
                        </div>
                        
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white hover:text-black transition-all">
                            <MoreVertical className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            ))}
      </div>

      <button 
        onClick={() => setIsAssignOpen(true)}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-[20px] shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50"
      >
        <UserPlus className="w-6 h-6" />
      </button>

      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogContent className="max-w-md bg-zinc-950 border-zinc-800 p-0 overflow-hidden rounded-[32px] shadow-2xl">
            
            <div className="p-6 pb-2">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black font-headline uppercase">Draft New Staff</DialogTitle>
                    <DialogDescription>Pilih user yang sudah mendaftar dan berikan posisi.</DialogDescription>
                </DialogHeader>
            </div>

            <div className="p-6 space-y-6">
                
                <div className="space-y-3">
                    <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Pilih Personil (Unassigned)</label>
                    <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" role="combobox" aria-expanded={openCombobox} className="w-full justify-between h-14 rounded-2xl bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:text-white">
                                {selectedUser 
                                    ? UNASSIGNED_USERS.find((u) => u.id === selectedUser)?.name 
                                    : "Cari nama..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[350px] p-0 bg-zinc-900 border-zinc-800 text-white rounded-xl">
                            <Command>
                                <CommandInput placeholder="Search user..." className="h-12" />
                                <CommandList>
                                    <CommandEmpty>No user found.</CommandEmpty>
                                    <CommandGroup>
                                        {UNASSIGNED_USERS.map((user) => (
                                            <CommandItem
                                                key={user.id}
                                                value={user.name}
                                                onSelect={() => { setSelectedUser(user.id); setOpenCombobox(false); }}
                                                className="data-[selected=true]:bg-zinc-800 data-[selected=true]:text-white py-3 cursor-pointer"
                                            >
                                                <Check className={cn("mr-2 h-4 w-4", selectedUser === user.id ? "opacity-100" : "opacity-0")} />
                                                <div className="flex flex-col">
                                                    <span className="font-bold">{user.name}</span>
                                                    <span className="text-xs text-zinc-500">{user.email}</span>
                                                </div>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Divisi</label>
                        <Select>
                            <SelectTrigger className="h-14 rounded-2xl bg-zinc-900 border-zinc-800"><SelectValue placeholder="Pilih" /></SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                {DIVISIONS.filter(d => d !== 'ALL').map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Jabatan</label>
                        <Select>
                            <SelectTrigger className="h-14 rounded-2xl bg-zinc-900 border-zinc-800"><SelectValue placeholder="Pilih" /></SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                <SelectItem value="HEAD">Head of Division</SelectItem>
                                <SelectItem value="STAFF">Staff / Officer</SelectItem>
                                <SelectItem value="VOLUNTEER">Volunteer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Button className="w-full h-14 rounded-full text-lg font-bold bg-white text-black hover:bg-zinc-200 mt-4 shadow-xl" disabled={!selectedUser}>
                    <Zap className="w-5 h-5 mr-2" /> KONFIRMASI POSISI
                </Button>

            </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}
