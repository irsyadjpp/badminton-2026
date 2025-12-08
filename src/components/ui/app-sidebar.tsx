'use client';

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, Users, Trophy, Wallet, 
  Settings, Megaphone, ShieldAlert, LogOut, 
  Briefcase, ChevronRight, Store, Box,
  ClipboardList, CircleUser, FileText,
  Gavel, Activity, Video, BarChart2
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

// DATA MENU
const data = {
  user: {
    name: "Irsyad Jamal",
    role: "Project Director",
    avatar: "/avatars/irsyad.jpg",
  },
  navDirector: [
    { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Live Monitor", url: "/admin/director/monitor", icon: Activity },
    { title: "Workspace", url: "/admin/workspace", icon: Briefcase },
    { title: "Struktur Panitia", url: "/admin/director/committee", icon: Users },
    { title: "Surat Tugas", url: "/admin/director/assignments", icon: FileText },
    { title: "Laporan Sponsor", url: "/admin/analytics", icon: BarChart2 },
  ],
  navOperations: [
    { title: "Penugasan Match", url: "/admin/match-control/assignment", icon: Trophy },
    { title: "Verifikasi Atlet (TPF)", url: "/admin/tpf", icon: Gavel },
    { title: "Gate Control", url: "/admin/gate", icon: ShieldAlert },
    { title: "MLO & Lineup", url: "/admin/mlo/dashboard", icon: ClipboardList },
    { title: "Media & Streaming", url: "/admin/media", icon: Video },
  ],
  navFinance: [
    { title: "Keuangan & RAB", url: "/admin/finance", icon: Wallet },
    { title: "Sponsorship CRM", url: "/admin/business/partners", icon: Megaphone },
  ],
  navSettings: [
    { title: "Master Roster", url: "/admin/director/roster", icon: CircleUser },
    { title: "Pengaturan Akun", url: "/admin/settings/users", icon: Settings },
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

      {/* 2. CONTENT (MENU ITEMS) */}
      <SidebarContent className="px-3 py-4 space-y-6 bg-zinc-950/50 scrollbar-none">
        
        <NavGroup label="DIRECTOR" items={data.navDirector} currentPath={pathname} />
        <NavGroup label="OPERATIONS" items={data.navOperations} currentPath={pathname} />
        <NavGroup label="FINANCE & BIZ" items={data.navFinance} currentPath={pathname} />
        <NavGroup label="MASTER DATA" items={data.navSettings} currentPath={pathname} />

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
                                    "h-12 rounded-full px-4 transition-all duration-300 font-medium text-sm group/btn relative overflow-hidden",
                                    isActive 
                                        ? "bg-primary text-primary-foreground shadow-[0_4px_20px_-5px_rgba(220,38,38,0.5)] font-bold hover:bg-primary" 
                                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <Link href={item.url} className="flex items-center w-full">
                                    <item.icon className={cn("size-5 mr-3 transition-transform duration-300 group-hover/btn:scale-110", isActive && "animate-pulse-slow")} />
                                    <span className="flex-1">{item.title}</span>
                                    {isActive && <ChevronRight className="size-4 opacity-50 ml-auto" />}
                                    
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
