

'use client';

import { useState, useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, redirect } from 'next/navigation';
import { 
  LayoutDashboard, Users, Trophy, BarChart3, LogOut, Lock, 
  ClipboardCheck, ArrowRight, Menu, Home, Settings, AlertOctagon,
  FileText, Shield, Mic, Ticket, Award, Wallet,
  ClipboardList, Activity, Gavel, Gift, Stethoscope, Receipt, CheckCircle,
  Store, Video, QrCode, Archive, ShieldAlert, DollarSign, ArrowRightCircle, Megaphone, Calculator, ChevronDown, Loader2, UserCog, UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { logoutAdmin } from './actions';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ThemeToggle } from '@/components/theme-toggle';

// --- DEFINISI MENU ---
const getMenusByRole = (role: string) => {
  const allMenus = [
    // --- CORE ---
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, roles: ['ALL'] },

    // --- DIRECTOR ---
    { 
      name: "Director's Office", 
      icon: Shield,
      roles: ['DIRECTOR'],
      subItems: [
        { name: "Master Roster Panitia", href: "/admin/director/roster", icon: UserPlus, roles: ['DIRECTOR'] },
        { name: "Struktur & Penugasan", href: "/admin/director/committee", icon: UserCog, roles: ['DIRECTOR'] },
      ]
    },

    // --- FINANCE ---
    { 
      name: "Keuangan", 
      icon: DollarSign, 
      roles: ['FINANCE', 'DIRECTOR', 'BUSINESS_LEAD', 'TENANT_RELATIONS', 'BUSINESS'],
      subItems: [
        { name: "Dashboard Keuangan", href: "/admin/finance", roles: ['FINANCE', 'DIRECTOR'] },
        { name: "Verifikasi Pendaftaran", href: "/admin/teams", roles: ['FINANCE', 'DIRECTOR', 'BUSINESS_LEAD'] },
        { name: "Approval Reimbursement", href: "/admin/finance/reimbursement-approval", roles: ['FINANCE', 'DIRECTOR'] },
        { name: "Tagihan Sponsor", href: "/admin/finance/invoices", roles: ['FINANCE', 'DIRECTOR', 'BUSINESS_LEAD'] },
        { name: "Manajemen Tenant", href: "/admin/tenants", roles: ['FINANCE', 'TENANT_RELATIONS', 'BUSINESS_LEAD', 'BUSINESS'] },
        { name: "Skema Honorarium", href: "/admin/finance/honorarium", roles: ['DIRECTOR'] },
      ]
    },

    // --- MATCH CONTROL ---
    { 
      name: "Pertandingan", 
      icon: Activity, 
      roles: ['MATCH_COORD', 'REFEREE', 'IT_ADMIN', 'DIRECTOR', 'OPS_LEAD', 'TPF', 'MLO'],
      subItems: [
        { name: "Match Control Center", href: "/admin/matches", roles: ['MATCH_COORD', 'REFEREE', 'IT_ADMIN', 'DIRECTOR', 'OPS_LEAD'] },
        { name: "Berita Acara Hasil", href: "/admin/matches/result-sheet", roles: ['REFEREE', 'MATCH_COORD'] },
        { name: "Verifikasi TPF", href: "/admin/tpf", roles: ['TPF', 'MATCH_COORD', 'DIRECTOR'] },
        { name: "Call Room (Antrean)", href: "/admin/mlo/dashboard", roles: ['MLO', 'MATCH_COORD'] },
        { name: "Verifikasi Line-Up", href: "/admin/mlo/lineups", roles: ['MLO', 'MATCH_COORD'] },
        { name: "Keputusan Protes", href: "/admin/protests", roles: ['REFEREE', 'MATCH_COORD', 'DIRECTOR'] },
        { name: "Papan Skor Wasit", href: "/admin/referee", roles: ['REFEREE', 'MATCH_COORD', 'IT_ADMIN'] },
      ]
    },

    // --- OPERATIONS ---
    { 
      name: "Operasional", 
      icon: Users,
      roles: ['GATE', 'OPS_LEAD', 'IT_ADMIN', 'MEDIC', 'LOGISTICS', 'DIRECTOR', 'SHOW_DIR', 'MEDIA', 'ALL'],
      subItems: [
        { name: "Gate Check-in", href: "/admin/gate", roles: ['GATE', 'OPS_LEAD', 'IT_ADMIN'] },
        { name: "Log Medis", href: "/admin/medical", roles: ['MEDIC', 'OPS_LEAD', 'DIRECTOR'] },
        { name: "Undian Doorprize", href: "/admin/raffle", roles: ['OPS_LEAD', 'DIRECTOR', 'SHOW_DIR', 'MEDIA'] },
        { name: "Pengajuan Reimbursement", href: "/admin/reimbursement/submit", roles: ['ALL'] },
      ]
    },

    // --- COMMERCIAL & MEDIA ---
    { 
      name: "Bisnis & Media", 
      icon: BarChart3,
      roles: ['BUSINESS_LEAD', 'BUSINESS', 'DIRECTOR', 'SHOW_DIR', 'MEDIA'],
      subItems: [
        { name: "Data Pengunjung", href: "/admin/visitors", roles: ['BUSINESS_LEAD', 'BUSINESS', 'DIRECTOR'] },
        { name: "Laporan Sponsor", href: "/admin/analytics", roles: ['BUSINESS_LEAD', 'BUSINESS', 'DIRECTOR'] },
        { name: "Manajemen Media", href: "/admin/media", roles: ['SHOW_DIR', 'MEDIA', 'DIRECTOR'] },
      ]
    },

    // --- SECRETARY ---
     { 
      name: "Sekretariat", 
      icon: FileText,
      roles: ['SECRETARY', 'DIRECTOR', 'SHOW_DIR'],
      subItems: [
        { name: "Generator Sertifikat", href: "/admin/secretary/cert-gen", roles: ['SECRETARY', 'DIRECTOR', 'SHOW_DIR'] },
      ]
    },
    
    // --- SYSTEM ---
    { name: "Pengaturan Global", href: "/admin/settings", icon: Settings, roles: ['DIRECTOR', 'IT_ADMIN'] },
  ];

  const filterMenu = (menuItems: any[]) => {
    return menuItems.map(item => {
      if (item.subItems) {
        const visibleSubItems = item.subItems.filter((sub:any) => 
          sub.roles.includes(role) || role === 'IT_ADMIN' || role === 'DIRECTOR' || sub.roles.includes('ALL')
        );
        if (visibleSubItems.length > 0) {
          return { ...item, subItems: visibleSubItems };
        }
        return null;
      }
      
      const canAccess = item.roles.includes(role) || role === 'IT_ADMIN' || role === 'DIRECTOR' || item.roles.includes('ALL');
      return canAccess ? item : null;
    }).filter(Boolean);
  };
  
  return filterMenu(allMenus);
};

interface NavItemProps {
  href: string;
  children: ReactNode;
  icon: React.ElementType;
}

const NavItem = ({ href, children, icon: Icon }: NavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
      )}
    >
      <Icon className="w-4 h-4" />
      {children}
    </Link>
  );
};

interface NavGroupProps {
    title: string;
    icon: React.ElementType;
    subItems: any[];
    isInitiallyOpen: boolean;
}

const NavGroup = ({ title, icon: Icon, subItems, isInitiallyOpen }: NavGroupProps) => {
    const pathname = usePathname();
    return (
        <Collapsible defaultOpen={isInitiallyOpen}>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-foreground hover:bg-secondary [&[data-state=open]>svg]:rotate-180">
                 <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    {title}
                 </div>
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 py-1 pl-5">
                {subItems.map((item) => (
                    <Link 
                      key={item.href} 
                      href={item.href}
                      className={cn(
                          'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                          pathname.startsWith(item.href)
                            ? 'bg-secondary text-foreground'
                            : 'text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
                      )}
                    >
                        <item.icon className="w-4 h-4" />
                        {item.name}
                    </Link>
                ))}
            </CollapsibleContent>
        </Collapsible>
    );
};


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [session, setSession] = useState({ isLoggedIn: false, role: 'DIRECTOR', name: 'Admin Super' });
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  
  useEffect(() => {
    const sessionStr = sessionStorage.getItem('admin_session');
    if (sessionStr) {
        try {
            const storedSession = JSON.parse(sessionStr);
            if (storedSession && storedSession.isLoggedIn) {
                setSession(storedSession);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error("Failed to parse admin session", error);
            sessionStorage.removeItem('admin_session');
        }
    } else if (pathname !== '/admin/login') {
        redirect('/admin/login');
    }
    setLoading(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logoutAdmin();
    sessionStorage.removeItem('admin_session');
    setIsAuthenticated(false);
    toast({ title: "Logout Berhasil" });
  };
  
  if (loading) {
    return (
        <div className="dark min-h-screen w-full flex items-center justify-center bg-background">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );
  }

  if (!isAuthenticated) {
    if (pathname === '/admin/login') {
        return <div className="dark">{children}</div>;
    }
    return null;
  }
  
  const currentMenus = getMenusByRole(session.role);

  const renderNavLinks = (isSheet: boolean = false) => currentMenus.map((menu: any, idx: number) => {
    if (menu.subItems) {
        const isGroupActive = menu.subItems.some((sub:any) => pathname.startsWith(sub.href));
        const NavComponent = (
            <NavGroup 
                key={menu.name}
                title={menu.name}
                icon={menu.icon}
                subItems={menu.subItems}
                isInitiallyOpen={isGroupActive}
            />
        );
        return isSheet ? <SheetClose asChild>{NavComponent}</SheetClose> : NavComponent;
    }
    
    return (
        <NavItem key={menu.href} href={menu.href} icon={menu.icon}>
            {menu.name}
        </NavItem>
    );
  });


  return (
    <div className="dark flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-72 bg-card border-r border-border hidden md:flex flex-col fixed h-full">
        <div className="p-6 border-b border-border flex items-center gap-3">
          <Image src="/images/logo.png" alt="Logo" width={32} height={32} />
          <h1 className="font-headline font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-fuchsia-500">
            BCC ADMIN
          </h1>
        </div>
        <nav className="flex-1 py-4 px-4 overflow-y-auto no-scrollbar space-y-2">
          {renderNavLinks()}
        </nav>
        <div className="p-4 border-t border-border">
          <form action={handleLogout}>
            <Button variant="outline" className="w-full">
                <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-72">
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-10 md:justify-end">
             <div className="md:hidden">
              <Sheet>
                  <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                          <Menu className="w-5 h-5"/>
                      </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-0 w-72 bg-card overflow-y-auto no-scrollbar">
                      <div className="p-6 border-b border-border">
                        <h1 className="font-headline font-black text-xl text-primary">BCC ADMIN</h1>
                      </div>
                      <nav className="p-4 space-y-2">
                        {renderNavLinks(true)}
                      </nav>
                      <div className="p-4 border-t border-border absolute bottom-0 w-full">
                        <form action={handleLogout}>
                            <Button variant="outline" className="w-full">
                                <LogOut className="w-4 h-4 mr-2" /> Logout
                            </Button>
                        </form>
                      </div>
                  </SheetContent>
              </Sheet>
             </div>
             
             <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/"><Home className="w-4 h-4" /></Link>
                </Button>
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
      </div>
    </div>
  );
}
