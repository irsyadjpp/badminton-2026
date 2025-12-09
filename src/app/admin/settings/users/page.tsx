
'use client';

import { useState } from "react";
import { 
  ShieldCheck, UserCog, Key, Plus, 
  Search, Filter, MoreHorizontal, Lock, 
  Unlock, Mail, RefreshCw, Smartphone, 
  Trash2, BadgeCheck, LayoutGrid, CircleUser 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

// --- MOCK DATA ---
const USERS = [
  { 
    id: "USR-001", 
    name: "Faiz Azilla", 
    email: "faiz@admin.com", 
    role: "SUPER_ADMIN", 
    dept: "IT & System", 
    status: "ACTIVE", 
    lastActive: "Now",
    avatar: "https://github.com/shadcn.png"
  },
  { 
    id: "USR-002", 
    name: "Budi Santoso", 
    email: "budi.ref@bcc.com", 
    role: "REFEREE", 
    dept: "Match Control", 
    status: "ACTIVE", 
    lastActive: "2m ago",
    avatar: ""
  },
  { 
    id: "USR-003", 
    name: "Siti Logistik", 
    email: "siti.log@bcc.com", 
    role: "STAFF", 
    dept: "Logistics", 
    status: "SUSPENDED", 
    lastActive: "2 days ago",
    avatar: ""
  },
  { 
    id: "USR-004", 
    name: "Rina Media", 
    email: "rina.socmed@bcc.com", 
    role: "EDITOR", 
    dept: "Media & Cr.", 
    status: "ACTIVE", 
    lastActive: "1h ago",
    avatar: ""
  },
];

const ROLES = [
  { id: "SUPER_ADMIN", label: "Super Admin", color: "text-violet-400 border-violet-500 bg-violet-500/10", desc: "Full System Access" },
  { id: "REFEREE", label: "Referee / Match", color: "text-red-400 border-red-500 bg-red-500/10", desc: "Score & Schedule Only" },
  { id: "STAFF", label: "Staff / Logistics", color: "text-orange-400 border-orange-500 bg-orange-500/10", desc: "Inventory & Check-in" },
  { id: "EDITOR", label: "Media Editor", color: "text-pink-400 border-pink-500 bg-pink-500/10", desc: "News & Social Media" },
];

export default function UserManagementPage() {
  const [selectedUser, setSelectedUser] = useState<typeof USERS[0] | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const filteredUsers = USERS.filter(u => 
    (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.includes(searchQuery)) &&
    (roleFilter === "ALL" || u.role === roleFilter)
  );

  const getRoleBadge = (roleCode: string) => {
    const role = ROLES.find(r => r.id === roleCode) || ROLES[2];
    return (
      <Badge variant="outline" className={cn("text-[10px] font-black border uppercase", role.color)}>
        {role.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-8 p-4 md:p-8 font-body pb-24 h-[calc(100vh-64px)] flex flex-col">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shrink-0">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="rounded-full px-3 py-1 border-violet-500 text-violet-500 bg-violet-500/10 backdrop-blur-md">
                    <UserCog className="w-3 h-3 mr-2" /> SYSTEM ACCESS
                </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-black font-headline uppercase tracking-tighter text-white">
                User <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-600">Management</span>
            </h1>
            <p className="text-zinc-400 mt-2 max-w-xl text-lg">
                Atur hak akses panitia, referee, dan staff operasional.
            </p>
        </div>

        <Button 
            onClick={() => setIsAddOpen(true)}
            className="h-14 rounded-full px-8 bg-violet-600 hover:bg-violet-700 text-white font-black text-lg shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-transform active:scale-95"
        >
            <Plus className="mr-2 w-5 h-5"/> INVITE USER
        </Button>
      </div>

      {/* --- STATS BAR --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
         <Card className="bg-zinc-900 border-zinc-800 rounded-[28px] p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-400">
                <ShieldCheck className="w-6 h-6"/>
            </div>
            <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Accounts</p>
                <p className="text-3xl font-black text-white">{USERS.length}</p>
            </div>
         </Card>
         <Card className="bg-zinc-900 border-zinc-800 rounded-[28px] p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
                <Smartphone className="w-6 h-6"/>
            </div>
            <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Online Now</p>
                <p className="text-3xl font-black text-white">2</p>
            </div>
         </Card>
         <Card className="bg-zinc-900 border-zinc-800 rounded-[28px] p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                <Lock className="w-6 h-6"/>
            </div>
            <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Suspended</p>
                <p className="text-3xl font-black text-white">{USERS.filter(u => u.status === 'SUSPENDED').length}</p>
            </div>
         </Card>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 bg-zinc-900/50 border border-zinc-800/50 rounded-[40px] p-2 backdrop-blur-sm flex flex-col min-h-0">
        
        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between px-4 py-4 gap-4 shrink-0">
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto p-1 no-scrollbar">
                <button 
                    onClick={() => setRoleFilter("ALL")}
                    className={cn("px-6 h-10 rounded-full text-sm font-bold transition-all border", roleFilter === "ALL" ? "bg-zinc-800 text-white border-zinc-700" : "border-transparent text-zinc-500 hover:text-white")}
                >
                    All Users
                </button>
                {ROLES.map(role => (
                    <button 
                        key={role.id}
                        onClick={() => setRoleFilter(role.id)}
                        className={cn("px-6 h-10 rounded-full text-sm font-bold transition-all border", roleFilter === role.id ? "bg-zinc-800 text-white border-zinc-700" : "border-transparent text-zinc-500 hover:text-white")}
                    >
                        {role.label.split('/')[0]}
                    </button>
                ))}
            </div>

            <div className="relative w-full md:w-72">
                <Search className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
                <Input 
                    placeholder="Find user..." 
                    className="h-12 bg-zinc-950 border-zinc-800 rounded-full pl-10 text-white focus:ring-violet-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>

        {/* User Grid */}
        <ScrollArea className="flex-1 px-4 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredUsers.map((user) => (
                    <div 
                        key={user.id} 
                        onClick={() => setSelectedUser(user)}
                        className="group relative bg-zinc-900 border border-zinc-800 rounded-[32px] p-6 hover:border-violet-500/50 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-2xl overflow-hidden"
                    >
                        {/* ID Card Visual Header */}
                        <div className="flex justify-between items-start mb-6">
                            <Avatar className="h-16 w-16 border-4 border-zinc-950 shadow-xl">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback className="bg-zinc-800 font-bold text-zinc-500 text-xl">{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="text-right">
                                {user.status === 'ACTIVE' ? (
                                    <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30 border-none">ACTIVE</Badge>
                                ) : (
                                    <Badge className="bg-red-500/20 text-red-500 hover:bg-red-500/30 border-none">SUSPENDED</Badge>
                                )}
                                <p className="text-[10px] text-zinc-500 font-mono mt-2">{user.lastActive}</p>
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="space-y-1 mb-4">
                            <h3 className="text-lg font-black text-white leading-tight group-hover:text-violet-400 transition-colors">
                                {user.name}
                            </h3>
                            <p className="text-sm text-zinc-500 truncate">{user.email}</p>
                        </div>

                        {/* Role & Dept */}
                        <div className="flex items-center gap-2 pt-4 border-t border-zinc-800">
                            {getRoleBadge(user.role)}
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">
                                • {user.dept}
                            </span>
                        </div>

                        {/* Hover Action */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="w-5 h-5 text-zinc-400"/>
                        </div>
                    </div>
                ))}
                
                {/* Add New Card Placeholder */}
                <button 
                    onClick={() => setIsAddOpen(true)}
                    className="border-2 border-dashed border-zinc-800 rounded-[32px] flex flex-col items-center justify-center gap-4 text-zinc-600 hover:text-violet-500 hover:border-violet-500/50 hover:bg-violet-500/5 transition-all min-h-[200px] group"
                >
                    <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Plus className="w-8 h-8"/>
                    </div>
                    <span className="font-black uppercase tracking-widest text-sm">Add New User</span>
                </button>
            </div>
        </ScrollArea>
      </div>

      {/* --- USER DETAIL SHEET --- */}
      <Sheet open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <SheetContent className="w-full sm:max-w-md bg-zinc-950 border-l border-zinc-800 p-0 overflow-y-auto">
            {selectedUser && (
                <div className="flex flex-col h-full">
                    
                    {/* Header Profile */}
                    <div className="h-48 bg-gradient-to-b from-violet-900/50 to-zinc-900 relative flex flex-col items-center justify-center">
                        <div className="absolute inset-0 bg-[url('/images/grid-pattern.png')] opacity-20 pointer-events-none"></div>
                        <Avatar className="h-24 w-24 border-4 border-zinc-900 shadow-2xl mb-3">
                            <AvatarImage src={selectedUser.avatar} />
                            <AvatarFallback className="bg-zinc-800 text-2xl font-black text-zinc-500">{selectedUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h2 className="text-2xl font-black text-white">{selectedUser.name}</h2>
                        <p className="text-zinc-400 text-sm font-mono">{selectedUser.email}</p>
                    </div>

                    <div className="p-8 space-y-8 flex-1">
                        
                        {/* Status Toggle */}
                        <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 flex justify-between items-center">
                            <div>
                                <p className="text-xs font-bold text-zinc-500 uppercase">Account Status</p>
                                <p className={cn("font-bold text-sm", selectedUser.status === 'ACTIVE' ? "text-green-500" : "text-red-500")}>
                                    {selectedUser.status}
                                </p>
                            </div>
                            <Switch checked={selectedUser.status === 'ACTIVE'} />
                        </div>

                        {/* Access Control */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <Key className="w-4 h-4 text-violet-500"/> Permissions
                            </h3>
                            <div className="grid grid-cols-1 gap-3">
                                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-3">
                                    <BadgeCheck className="w-5 h-5 text-violet-500"/>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-white">Current Role</p>
                                        <p className="text-xs text-zinc-500">{ROLES.find(r => r.id === selectedUser.role)?.label}</p>
                                    </div>
                                    <Button size="sm" variant="outline" className="h-8 text-xs border-zinc-700 hover:bg-zinc-800">Change</Button>
                                </div>
                                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-3">
                                    <LayoutGrid className="w-5 h-5 text-zinc-500"/>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-white">Department</p>
                                        <p className="text-xs text-zinc-500">{selectedUser.dept}</p>
                                    </div>
                                    <Button size="sm" variant="outline" className="h-8 text-xs border-zinc-700 hover:bg-zinc-800">Edit</Button>
                                </div>
                            </div>
                        </div>

                        {/* Security Actions */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <Lock className="w-4 h-4 text-red-500"/> Danger Zone
                            </h3>
                            <div className="flex flex-col gap-2">
                                <Button variant="outline" className="justify-start h-12 border-zinc-800 bg-zinc-900 hover:bg-zinc-800 hover:text-white text-zinc-400">
                                    <RefreshCw className="w-4 h-4 mr-3"/> Reset Password
                                </Button>
                                <Button variant="outline" className="justify-start h-12 border-red-900/30 bg-red-950/10 hover:bg-red-950/30 text-red-500 hover:text-red-400">
                                    <Trash2 className="w-4 h-4 mr-3"/> Revoke Access
                                </Button>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </SheetContent>
      </Sheet>

      {/* --- INVITE MODAL --- */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-white rounded-[40px] max-w-lg p-0 overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-zinc-800 bg-violet-950/20">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black font-headline uppercase flex items-center gap-2 text-violet-500">
                        <UserPlus className="w-6 h-6"/> Invite Staff
                    </DialogTitle>
                    <DialogDescription>Kirim undangan akses ke anggota tim baru.</DialogDescription>
                </DialogHeader>
            </div>
            
            <div className="p-8 space-y-6">
                
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Email Address</label>
                    <Input placeholder="user@committee.com" className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl text-lg" />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Full Name</label>
                    <Input placeholder="Nama Lengkap" className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Role / Access</label>
                        <Select>
                            <SelectTrigger className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl"><SelectValue placeholder="Select..." /></SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                {ROLES.map(r => <SelectItem key={r.id} value={r.id}>{r.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-zinc-500 ml-1">Department</label>
                        <Select>
                            <SelectTrigger className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl"><SelectValue placeholder="Unit..." /></SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                <SelectItem value="IT">IT & System</SelectItem>
                                <SelectItem value="MATCH">Match Control</SelectItem>
                                <SelectItem value="LOG">Logistics</SelectItem>
                                <SelectItem value="SEC">Security</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 text-xs text-zinc-400">
                    <p className="font-bold text-white mb-1">Access Preview:</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Dapat login ke Dashboard Admin.</li>
                        <li>Akses terbatas sesuai departemen.</li>
                        <li>Link undangan berlaku 24 jam.</li>
                    </ul>
                </div>

                <Button className="w-full h-16 rounded-full font-black text-lg bg-violet-600 hover:bg-violet-700 text-white mt-2 shadow-xl shadow-violet-900/20">
                    SEND INVITATION
                </Button>
            </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}

    