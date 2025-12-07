

'use client';

import { useState, useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, redirect } from 'next/navigation';
import Image from 'next/image';
import { 
  LayoutDashboard, Users, Trophy, BarChart3, LogOut, Lock, 
  ClipboardCheck, ArrowRight, Menu, Home, Settings, AlertOctagon,
  FileText, ShieldCheck, Mic, Ticket, Award, Wallet,
  ClipboardList, Activity, Gavel, Gift, Stethoscope, Receipt, CheckCircle,
  Store, Video, QrCode, Archive, FileBadge, DollarSign, ArrowRightCircle, Megaphone, Calculator, ChevronDown, Loader2, UserCog, UserPlus, UserRound, Kanban, Package, Utensils, Clock, CalendarClock, Settings2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { logoutAdmin } from './actions';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ThemeToggle } from '@/components/theme-toggle';
import { IntegrityPactModal } from '@/components/admin/integrity-pact-modal';
import { EmergencyButton } from '@/components/admin/emergency-button';
import { Toaster } from "@/components/ui/toaster";
import { Separator } from "@/components/ui/separator";
import { NotificationBell } from "@/components/admin/notification-bell";
import { DialogTitle } from '@/components/ui/dialog';

// --- DEFINISI MENU ---
const getMenusByRole = (role: string) => {
  const allMenus = [
    // --- CORE ---
    { 
      title: "UTAMA",
      items: [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, roles: ['ALL'] },
        { name: "Profil Saya", href: "/admin/profile", icon: UserRound, roles: ['ALL'] },
        { name: "Workspace", href: "/admin/workspace", icon: Kanban, roles: ['ALL'] },
        { name: "RKA & Planning", href: "/admin/planning", icon: ClipboardList, roles: ['ALL'] },
      ]
    },

    // --- DIRECTOR ---
    { 
      title: "DIRECTOR'S OFFICE",
      roles: ['DIRECTOR'],
      items: [
        { name: "Live Monitor", href: "/admin/director/monitor", icon: Activity, roles: ['DIRECTOR'] },
        { name: "Master Roster Panitia", href: "/admin/director/roster", icon: UserPlus, roles: ['DIRECTOR'] },
        { name: "Struktur & Penugasan", href: "/admin/director/committee", icon: UserCog, roles: ['DIRECTOR'] },
        { name: "Penugasan Digital", href: "/admin/director/assignments", icon: FileBadge, roles: ['DIRECTOR'] },
      ]
    },

    // --- FINANCE ---
    { 
      title: "KEUANGAN", 
      roles: ['FINANCE', 'DIRECTOR', 'BUSINESS_LEAD', 'TENANT_RELATIONS', 'BUSINESS'],
      items: [
        { name: "Dashboard Keuangan", href: "/admin/finance", icon: LayoutDashboard, roles: ['FINANCE', 'DIRECTOR'], exact: true },
        { name: "Verifikasi Pendaftaran", href: "/admin/teams", icon: Users, roles: ['FINANCE', 'DIRECTOR', 'BUSINESS_LEAD'] },
        { name: "Approval Reimbursement", href: "/admin/finance/reimbursement-approval", icon: CheckCircle, roles: ['FINANCE', 'DIRECTOR'] },
        { name: "Tagihan Sponsor", href: "/admin/finance/invoices", icon: Receipt, roles: ['FINANCE', 'DIRECTOR', 'BUSINESS_LEAD'] },
        { name: "Manajemen Tenant", href: "/admin/tenants", icon: Store, roles: ['FINANCE', 'TENANT_RELATIONS', 'BUSINESS_LEAD', 'BUSINESS'] },
        { name: "Skema Honorarium", href: "/admin/finance/honorarium", icon: Calculator, roles: ['DIRECTOR'] },
      ]
    },

    // --- MATCH CONTROL ---
    { 
      title: "PERTANDINGAN", 
      roles: ['MATCH_COORD', 'REFEREE', 'IT_ADMIN', 'DIRECTOR', 'OPS_LEAD', 'TPF', 'MLO'],
      items: [
        { name: "Match Control Desk", href: "/admin/match-control/assignment", icon: LayoutDashboard, roles: ['MATCH_COORD', 'DIRECTOR'] },
        { name: "Editor Jadwal", href: "/admin/match-control/schedule-editor", icon: CalendarClock, roles: ['MATCH_COORD'] },
        { name: "Berita Acara Hasil", href: "/admin/matches/result-sheet", icon: FileText, roles: ['REFEREE', 'MATCH_COORD'] },
        { name: "Verifikasi TPF", href: "/admin/tpf", icon: ShieldCheck, roles: ['TPF', 'MATCH_COORD', 'DIRECTOR'] },
        { name: "Call Room (Antrean)", href: "/admin/mlo/dashboard", icon: Megaphone, roles: ['MLO', 'MATCH_COORD'] },
        { name: "Verifikasi Line-Up", href: "/admin/mlo/lineups", icon: ClipboardCheck, roles: ['MLO', 'MATCH_COORD'] },
        { name: "Keputusan Protes", href: "/admin/protests", icon: Gavel, roles: ['REFEREE', 'MATCH_COORD', 'DIRECTOR'] },
        { name: "Papan Skor Wasit", href: "/admin/referee", icon: Trophy, roles: ['REFEREE', 'MATCH_COORD', 'IT_ADMIN'] },
        { name: "Checklist Venue", href: "/admin/referee/checklist", icon: ShieldCheck, roles: ['REFEREE', 'DIRECTOR'] },
      ]
    },

    // --- OPERATIONS ---
    { 
      title: "OPERASIONAL", 
      roles: ['GATE', 'OPS_LEAD', 'IT_ADMIN', 'MEDIC', 'LOGISTICS', 'DIRECTOR', 'SHOW_DIR', 'MEDIA', 'ALL', 'SECRETARY'],
      items: [
        { name: "Gate Check-in", href: "/admin/gate", icon: QrCode, roles: ['GATE', 'OPS_LEAD', 'IT_ADMIN'] },
        { name: "Log Medis", href: "/admin/medical", icon: Stethoscope, roles: ['MEDIC', 'OPS_LEAD', 'DIRECTOR'] },
        { name: "Kontrol Shuttlecock", href: "/admin/logistics/shuttlecock", icon: Package, roles: ['LOGISTICS', 'MATCH_COORD', 'OPS_LEAD', 'DIRECTOR'] },
        { name: "Inventaris Umum", href: "/admin/logistics/inventory", icon: Archive, roles: ['LOGISTICS', 'OPS_LEAD', 'DIRECTOR'] },
        { name: "Database Volunteer", href: "/admin/hr/volunteers", icon: Users, roles: ['OPS_LEAD', 'SECRETARY', 'DIRECTOR'] },
        { name: "Absensi & Konsumsi", href: "/admin/hr/meals", icon: Utensils, roles: ['LOGISTICS', 'SECRETARY', 'OPS_LEAD', 'DIRECTOR'] },
        { name: "Undian Doorprize", href: "/admin/raffle", icon: Gift, roles: ['OPS_LEAD', 'DIRECTOR', 'SHOW_DIR', 'MEDIA'] },
        { name: "Pengajuan Reimbursement", href: "/admin/reimbursement/submit", icon: ArrowRightCircle, roles: ['ALL'] },
      ]
    },
    
    // --- EVENT ---
    {
      title: "ACARA & PENUTUPAN",
      roles: ['SHOW_DIR', 'MEDIA', 'DIRECTOR'],
      items: [
         { name: "Master Rundown", href: "/admin/event/rundown", icon: Clock, roles: ['SHOW_DIR', 'MEDIA', 'DIRECTOR'] },
      ]
    },

    // --- COMMERCIAL & MEDIA ---
    { 
      title: "BISNIS & MEDIA", 
      roles: ['BUSINESS_LEAD', 'BUSINESS', 'DIRECTOR', 'SHOW_DIR', 'MEDIA'],
      items: [
        { name: "Data Pengunjung", href: "/admin/visitors", icon: Users, roles: ['BUSINESS_LEAD', 'BUSINESS', 'DIRECTOR'] },
        { name: "Laporan Sponsor", href: "/admin/analytics", icon: BarChart3, roles: ['BUSINESS_LEAD', 'BUSINESS', 'DIRECTOR'] },
        { name: "Manajemen Media", href: "/admin/media", icon: Video, roles: ['SHOW_DIR', 'MEDIA', 'DIRECTOR'] },
      ]
    },

    // --- SECRETARY ---
     { 
      title: "SEKRETARIAT", 
      roles: ['SECRETARY', 'DIRECTOR', 'SHOW_DIR'],
      items: [
        { name: "Generator Sertifikat", href: "/admin/secretary/cert-gen", icon: Award, roles: ['SECRETARY', 'DIRECTOR', 'SHOW_DIR'] },
      ]
    },
    
    // --- Master Data & Settings ---
    { 
      title: "Master Data & Settings",
      roles: ['DIRECTOR', 'IT_ADMIN', 'BUSINESS', 'MEDIA', 'SECRETARY', 'MATCH_COORD'],
      items: [
        { name: "Master Tim/Pemain", href: "/admin/master/teams", icon: Users, roles: ['SECRETARY', 'MATCH_COORD'] },
        { name: "Master Kategori", href: "/admin/master/categories", icon: Settings2, roles: ['DIRECTOR', 'IT_ADMIN'] },
        { name: "Manajemen User", href: "/admin/settings/users", icon: Users, roles: ['DIRECTOR', 'IT_ADMIN'] },
        { name: "Partner & Sponsor", href: "/admin/business/partners", icon: Store, roles: ['DIRECTOR', 'BUSINESS'] },
        { name: "CMS Berita", href: "/admin/media/news", icon: FileText, roles: ['MEDIA', 'IT_ADMIN', 'DIRECTOR'] },
        { name: "Pengaturan Global", href: "/admin/settings", icon: Settings, roles: ['DIRECTOR', 'IT_ADMIN'] },
      ]
    }
  ];

  const canAccessRole = (itemRoles: string[]) => {
      return itemRoles.includes(role) || role === 'IT_ADMIN' || role === 'DIRECTOR' || itemRoles.includes('ALL');
  }

  const filterMenu = (menuGroups: any[]) => {
    return menuGroups
      .map(group => {
        // Filter item di dalam grup
        const visibleItems = group.items.filter((item: any) => canAccessRole(item.roles));
        
        // Jika setelah difilter ada item yang tersisa, tampilkan grup beserta itemnya
        if (visibleItems.length > 0) {
          // Hanya tampilkan grup jika rolenya diizinkan ATAU jika ada item di dalamnya yg bisa diakses
          const canAccessGroup = group.roles ? canAccessRole(group.roles) : true;
          if(canAccessGroup) {
            return { ...group, items: visibleItems };
          }
        }
        return null;
      })
      .filter(Boolean); // Hapus grup yang null (tidak punya item visible)
  };
  
  return filterMenu(allMenus);
};


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  
  useEffect(() => {
    const sessionStr = sessionStorage.getItem('admin_session');
    if (sessionStr) {
        try {
            const storedSession = JSON.parse(sessionStr);
            if (storedSession && storedSession.isLoggedIn) {
                setSession(storedSession);
            } else if (pathname !== '/admin/login') {
                redirect('/admin/login');
            }
        } catch (error) {
            console.error("Failed to parse admin session", error);
            sessionStorage.removeItem('admin_session');
            if (pathname !== '/admin/login') redirect('/admin/login');
        }
    } else if (pathname !== '/admin/login') {
        redirect('/admin/login');
    }
    setLoading(false);
  }, [pathname]);
  
  const handlePactComplete = () => {
    const updatedSession = { ...session, isOnboarded: true };
    setSession(updatedSession);
    sessionStorage.setItem('admin_session', JSON.stringify(updatedSession));
  };


  const handleLogout = async () => {
    await logoutAdmin();
    sessionStorage.removeItem('admin_session');
    setSession(null);
    toast({ title: "Logout Berhasil" });
    redirect('/');
  };
  
  if (loading) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );
  }

  if (!session?.isLoggedIn) {
    if (pathname === '/admin/login') {
        return <div className="min-h-screen">{children}</div>;
    }
    return null;
  }
  
  const currentMenus = getMenusByRole(session.role);

  const renderNavLinks = (isSheet: boolean = false) => currentMenus.map((group: any, groupIndex: number) => (
    <div key={groupIndex} className="space-y-1">
        <p className="px-4 pt-4 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            {group.title}
        </p>
        {group.items.map((menu: any) => {
            const isActive = menu.exact ? pathname === menu.href : pathname.startsWith(menu.href);
            const NavLinkComponent = (
                 <Link 
                    key={menu.href} 
                    href={menu.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group',
                      isActive 
                        ? 'bg-primary/10 text-primary font-bold' 
                        : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground font-medium'
                    )}
                  >
                    <menu.icon className="w-5 h-5" />
                    <span>{menu.name}</span>
                </Link>
            );
            return isSheet ? <SheetClose asChild>{NavLinkComponent}</SheetClose> : NavLinkComponent;
        })}
    </div>
  ));


  return (
    <>
    <IntegrityPactModal 
        isOpen={session.isLoggedIn && !session.isOnboarded}
        onComplete={handlePactComplete}
        userName={session.name}
    />
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-72 bg-card hidden md:flex flex-col fixed h-full">
        <div className="p-6 flex items-center gap-3">
          <Image src="/images/logo.png" alt="BCC Logo" width={32} height={32} />
          <h1 className="font-headline font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-fuchsia-500">
            BCC ADMIN
          </h1>
        </div>
        <nav className="flex-1 py-4 px-2 overflow-y-auto no-scrollbar space-y-2">
          {renderNavLinks()}
        </nav>
        <div className="p-4 border-t">
          <form action={handleLogout}>
            <Button variant="outline" className="w-full">
                <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-72">
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-zinc-800 px-4 bg-black/50 backdrop-blur sticky top-0 z-40">
             <div className="flex items-center gap-2 md:hidden">
              <Sheet>
                  <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                          <Menu className="w-5 h-5"/>
                      </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-0 w-72 bg-card overflow-y-auto no-scrollbar">
                      <div className="p-6">
                        <DialogTitle className="sr-only">BCC Admin Menu</DialogTitle>
                        <h1 className="font-headline font-black text-xl text-primary">BCC ADMIN</h1>
                      </div>
                      <nav className="p-4 space-y-2">
                        {renderNavLinks(true)}
                      </nav>
                      <div className="p-4 absolute bottom-0 w-full">
                        <form action={handleLogout}>
                            <Button variant="outline" className="w-full">
                                <LogOut className="w-4 h-4 mr-2" /> Logout
                            </Button>
                        </form>
                      </div>
                  </SheetContent>
              </Sheet>
             </div>
             
             <div className="flex items-center gap-4 ml-auto">
                <NotificationBell />
                <ThemeToggle />
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="font-bold text-primary">{session.name.charAt(0)}</span>
                    </div>
                    <div className="text-sm hidden sm:block">
                        <p className="font-bold">{session.name.split('(')[0].trim()}</p>
                        <p className="text-xs text-muted-foreground">{session.role.replace('_', ' ')}</p>
                    </div>
                </div>
             </div>
        </header>
        
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
        <EmergencyButton />
        <Toaster />
      </div>
    </div>
    </>
  );
}

    