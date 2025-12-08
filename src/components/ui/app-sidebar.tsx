
'use client';

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, User, Briefcase, CalendarRange, // UTAMA
  Activity, Users, Network, CheckSquare, // DIRECTOR
  PieChart, FileCheck, Stamp, Receipt, Store, Wallet, Coins, // KEUANGAN
  Trophy, CalendarDays, FilePenLine, ShieldAlert, Mic2, LifeBuoy, ClipboardList, Gavel, MonitorPlay, ClipboardCheck, // PERTANDINGAN
  QrCode, Stethoscope, Package, Box, Database, Utensils, Gift, Upload, Layers, // OPERASIONAL
  Timer, // ACARA
  BarChart3, Megaphone, Image, // BISNIS
  Mail, FileSignature, Award, // SEKRETARIAT
  Tags, UserCog, Handshake, Newspaper, Settings, ChevronRight, LogOut // MASTER
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// --- DATA MENU LENGKAP ---
const data = {
  user: {
    name: "Irsyad Jamal",
    role: "Project Director",
    avatar: "/avatars/irsyad.jpg",
  },
  // 1. UTAMA
  navMain: [
    { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Profil Saya", url: "/admin/profile", icon: User },
    { title: "Workspace", url: "/admin/workspace", icon: Briefcase },
    { title: "RKA & Planning", url: "/admin/planning", icon: CalendarRange },
  ],
  // 2. DIRECTOR'S OFFICE
  navDirector: [
    { title: "Live Monitor", url: "/admin/director/monitor", icon: Activity },
    { title: "Master Roster", url: "/admin/director/roster", icon: Users },
    { title: "Struktur Panitia", url: "/admin/director/committee", icon: Network },
    { title: "Surat Tugas TPF", url: "/admin/director/assignments", icon: CheckSquare },
  ],
  // 3. KEUANGAN
  navFinance: [
    { title: "Dashboard Keuangan", url: "/admin/finance", icon: PieChart },
    { title: "Approval Reimbursement", url: "/admin/finance/reimbursement-approval", icon: Stamp },
    { title: "Tagihan Sponsor", url: "/admin/finance/invoices", icon: Receipt },
    { title: "Skema Honorarium", url: "/admin/finance/honorarium", icon: Wallet },
    { title: "Kas Kecil (Petty Cash)", url: "/admin/finance/petty-cash", icon: Coins },
  ],
  // 4. PERTANDINGAN
  navMatch: [
    { title: "Penugasan Match", url: "/admin/match-control/assignment", icon: Trophy },
    { title: "Editor Jadwal", url: "/admin/match-control/schedule-editor", icon: CalendarDays },
    { title: "Berita Acara Hasil", url: "/admin/matches/result-sheet", icon: FilePenLine },
    { title: "Verifikasi TPF", url: "/admin/tpf", icon: ShieldAlert },
    { title: "MLO: Dashboard", url: "/admin/mlo/dashboard", icon: Mic2 },
    { title: "MLO: Helpdesk", url: "/admin/mlo/helpdesk", icon: LifeBuoy },
    { title: "MLO: Verifikasi Line-Up", url: "/admin/mlo/lineups", icon: ClipboardList },
    { title: "Keputusan Protes", url: "/admin/protests", icon: Gavel },
    { title: "Papan Skor Wasit", url: "/admin/referee/match/1", icon: MonitorPlay },
    { title: "Checklist Venue", url: "/admin/referee/checklist", icon: ClipboardCheck },
    { title: "Dispatch Service", url: "/admin/match-control/service", icon: Megaphone },
  ],
  // 5. OPERASIONAL
  navOps: [
    { title: "Gate Check-in", url: "/admin/gate", icon: QrCode },
    { title: "Log Medis", url: "/admin/medical", icon: Stethoscope },
    { title: "Kontrol Shuttlecock", url: "/admin/logistics/shuttlecock", icon: Package },
    { title: "Inventaris Umum", url: "/admin/logistics/inventory", icon: Box },
    { title: "Database Volunteer", url: "/admin/hr/volunteers", icon: Database },
    { title: "Absensi & Konsumsi", url: "/admin/hr/meals", icon: Utensils },
    { title: "Undian Doorprize", url: "/admin/raffle", icon: Gift },
    { title: "Pengajuan Reimbursement", url: "/admin/reimbursement/submit", icon: Upload },
    { title: "Logistik Habis Pakai", url: "/admin/logistics/consumables", icon: Layers },
  ],
  // 6. ACARA & PENUTUPAN
  navEvent: [
    { title: "Master Rundown", url: "/admin/event/rundown", icon: Timer },
  ],
  // 7. BISNIS & MEDIA
  navBiz: [
    { title: "Data Pengunjung", url: "/admin/visitors", icon: BarChart3 },
    { title: "Laporan Sponsor", url: "/admin/analytics", icon: BarChart3 },
    { title: "Sponsorship CRM", url: "/admin/business/partners", icon: Handshake },
    { title: "Manajemen Media", url: "/admin/media", icon: Image },
    { title: "Tulis Berita", url: "/admin/media/news", icon: Newspaper },
  ],
  // 8. SEKRETARIAT
  navSecretariat: [
    { title: "E-Office / Surat", url: "/admin/secretary/correspondence", icon: Mail },
    { title: "Notulensi Rapat", url: "/admin/secretary/minutes", icon: FileSignature },
    { title: "Generator Sertifikat", url: "/admin/secretary/cert-gen", icon: Award },
  ],
  // 9. MASTER DATA
  navMaster: [
    { title: "Verifikasi Pendaftaran Tim", url: "/admin/teams", icon: FileCheck },
    { title: "Master Tim/Pemain", url: "/admin/master/teams", icon: Users },
    { title: "Master Kategori", url: "/admin/master/categories", icon: Tags },
    { title: "Manajemen User", url: "/admin/settings/users", icon: UserCog },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" {...props} className="border-r-0 bg-black">
      
      {/* 1. HEADER (LOGO) */}
      <SidebarHeader className="h-20 flex justify-center border-b border-white/5 bg-zinc-950/50">
        <div className="flex items-center gap-3 px-2 group-data-[collapsible=icon]:justify-center">
          <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black text-xl shadow-[0_0_15px_rgba(220,38,38,0.5)]">
            B
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-black font-headline text-lg tracking-tight text-white">BCC 2026</span>
            <span className="truncate text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Official Admin</span>
          </div>
        </div>
      </SidebarHeader>

      {/* 2. CONTENT (MENU ITEMS) - Scrollable */}
      <SidebarContent className="px-3 py-4 space-y-6 bg-zinc-950/50 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-800">
        
        <NavGroup label="UTAMA" items={data.navMain} currentPath={pathname} />
        <NavGroup label="DIRECTOR'S OFFICE" items={data.navDirector} currentPath={pathname} />
        <NavGroup label="KEUANGAN" items={data.navFinance} currentPath={pathname} />
        <NavGroup label="PERTANDINGAN" items={data.navMatch} currentPath={pathname} />
        <NavGroup label="OPERASIONAL" items={data.navOps} currentPath={pathname} />
        <NavGroup label="ACARA" items={data.navEvent} currentPath={pathname} />
        <NavGroup label="BISNIS & MEDIA" items={data.navBiz} currentPath={pathname} />
        <NavGroup label="SEKRETARIAT" items={data.navSecretariat} currentPath={pathname} />
        <NavGroup label="MASTER DATA" items={data.navMaster} currentPath={pathname} />

      </SidebarContent>

      {/* 3. FOOTER (USER PROFILE) */}
      <SidebarFooter className="p-4 bg-zinc-950/80 border-t border-white/5">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
            <Avatar className="h-10 w-10 rounded-xl border-2 border-zinc-800 cursor-pointer hover:border-primary transition-colors">
                <AvatarImage src={data.user.avatar} />
                <AvatarFallback className="bg-zinc-900 font-bold text-zinc-400">IJ</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-bold text-white">{data.user.name}</span>
                <span className="truncate text-xs text-zinc-500">{data.user.role}</span>
            </div>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-full group-data-[collapsible=icon]:hidden">
                <LogOut className="h-4 w-4" />
            </Button>
        </div>
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  )
}

// --- SUB COMPONENT: NAV GROUP (MD3 STYLE) ---
function NavGroup({ label, items, currentPath }: { label: string, items: any[], currentPath: string }) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] font-black tracking-[0.2em] text-zinc-600 uppercase mb-2 px-2 group-data-[collapsible=icon]:hidden">
                {label}
            </SidebarGroupLabel>
            <SidebarMenu className="space-y-1">
                {items.map((item) => {
                    const isActive = currentPath === item.url || currentPath.startsWith(`${item.url}/`);
                    
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild tooltip={item.title} 
                                className={cn(
                                    "h-10 rounded-full px-4 transition-all duration-300 font-medium text-sm group/btn relative overflow-hidden",
                                    isActive 
                                        ? "bg-primary text-primary-foreground shadow-[0_2px_10px_-5px_rgba(220,38,38,0.5)] font-bold hover:bg-primary" 
                                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <Link href={item.url} className="flex items-center w-full">
                                    <item.icon className={cn("size-4 mr-3 transition-transform duration-300 group-hover/btn:scale-110", isActive && "animate-pulse-slow")} />
                                    <span className="flex-1 truncate">{item.title}</span>
                                    {isActive && <ChevronRight className="size-3 opacity-50 ml-auto" />}
                                    
                                    {/* Active Indicator Glow */}
                                    {isActive && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-shimmer" />}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}
