'use client';

import { useState, useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, redirect } from 'next/navigation';
import { 
  LayoutDashboard, Users, Trophy, BarChart3, LogOut, Lock, 
  ClipboardCheck, ArrowRight, Menu, Home, Settings, AlertOctagon,
  FileText, Shield, Mic, Ticket, Award, Wallet,
  ClipboardList, Activity, Gavel, Gift, Stethoscope, Receipt, CheckCircle,
  Store, Video, QrCode, Archive, ShieldCheck, DollarSign, ArrowRightCircle, Megaphone, Calculator, ChevronDown, Loader2, UserCog, UserPlus, FileBadge, UserRound
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { logoutAdmin } from './actions';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ThemeToggle } from '@/components/theme-toggle';
import { IntegrityPactModal } from '@/components/admin/integrity-pact-modal';

// --- DEFINISI MENU ---
const getMenusByRole = (role: string) => {
  const allMenus = [
    // --- CORE ---
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, roles: ['ALL'] },
    { name: "Profil Saya", href: "/admin/profile", icon: UserRound, roles: ['ALL'] },
    { name: "RKA & Planning", href: "/admin/planning", icon: ClipboardList, roles: ['ALL'] },

    // --- DIRECTOR ---
    { 
      name: "Director's Office", 
      icon: ShieldCheck,
      roles: ['DIRECTOR'],
      subItems: [
        { name: "Master Roster Panitia", href: "/admin/director/roster", icon: UserPlus, roles: ['DIRECTOR'] },
        { name: "Struktur & Penugasan", href: "/admin/director/committee", icon: UserCog, roles: ['DIRECTOR'] },
        { name: "Penugasan Digital", href: "/admin/director/assignments", icon: FileBadge, roles: ['DIRECTOR'] },
      ]
    },

    // --- FINANCE ---
    { 
      name: "Keuangan", 
      icon: DollarSign, 
      roles: ['FINANCE', 'DIRECTOR', 'BUSINESS_LEAD', 'TENANT_RELATIONS', 'BUSINESS'],
      subItems: [
        { name: "Dashboard Keuangan", href: "/admin/finance", icon: LayoutDashboard, roles: ['FINANCE', 'DIRECTOR'] },
        { name: "Verifikasi Pendaftaran", href: "/admin/teams", icon: Users, roles: ['FINANCE', 'DIRECTOR', 'BUSINESS_LEAD'] },
        { name: "Approval Reimbursement", href: "/admin/finance/reimbursement-approval", icon: CheckCircle, roles: ['FINANCE', 'DIRECTOR'] },
        { name: "Tagihan Sponsor", href: "/admin/finance/invoices", icon: Receipt, roles: ['FINANCE', 'DIRECTOR', 'BUSINESS_LEAD'] },
        { name: "Manajemen Tenant", href: "/admin/tenants", icon: Store, roles: ['FINANCE', 'TENANT_RELATIONS', 'BUSINESS_LEAD', 'BUSINESS'] },
        { name: "Skema Honorarium", href: "/admin/finance/honorarium", icon: Calculator, roles: ['DIRECTOR'] },
      ]
    },

    // --- MATCH CONTROL ---
    { 
      name: "Pertandingan", 
      icon: Activity, 
      roles: ['MATCH_COORD', 'REFEREE', 'IT_ADMIN', 'DIRECTOR', 'OPS_LEAD', 'TPF', 'MLO'],
      subItems: [
        { name: "Match Control Center", href: "/admin/matches", icon: LayoutDashboard, roles: ['MATCH_COORD', 'REFEREE', 'IT_ADMIN', 'DIRECTOR', 'OPS_LEAD'] },
        { name: "Berita Acara Hasil", href: "/admin/matches/result-sheet", icon: FileText, roles: ['REFEREE', 'MATCH_COORD'] },
        { name: "Verifikasi TPF", href: "/admin/tpf", icon: ShieldCheck, roles: ['TPF', 'MATCH_COORD', 'DIRECTOR'] },
        { name: "Call Room (Antrean)", href: "/admin/mlo/dashboard", icon: Megaphone, roles: ['MLO', 'MATCH_COORD'] },
        { name: "Verifikasi Line-Up", href: "/admin/mlo/lineups", icon: ClipboardCheck, roles: ['MLO', 'MATCH_COORD'] },
        { name: "Keputusan Protes", href: "/admin/protests", icon: Gavel, roles: ['REFEREE', 'MATCH_COORD', 'DIRECTOR'] },
        { name: "Papan Skor Wasit", href: "/admin/referee", icon: Trophy, roles: ['REFEREE', 'MATCH_COORD', 'IT_ADMIN'] },
      ]
    },

    // --- OPERATIONS ---
    { 
      name: "Operasional", 
      icon: Users,
      roles: ['GATE', 'OPS_LEAD', 'IT_ADMIN', 'MEDIC', 'LOGISTICS', 'DIRECTOR', 'SHOW_DIR', 'MEDIA', 'ALL'],
      subItems: [
        { name: "Gate Check-in", href: "/admin/gate", icon: QrCode, roles: ['GATE', 'OPS_LEAD', 'IT_ADMIN'] },
        { name: "Log Medis", href: "/admin/medical", icon: Stethoscope, roles: ['MEDIC', 'OPS_LEAD', 'DIRECTOR'] },
        { name: "Undian Doorprize", href: "/admin/raffle", icon: Gift, roles: ['OPS_LEAD', 'DIRECTOR', 'SHOW_DIR', 'MEDIA'] },
        { name: "Pengajuan Reimbursement", href: "/admin/reimbursement/submit", icon: ArrowRightCircle, roles: ['ALL'] },
      ]
    },

    // --- COMMERCIAL & MEDIA ---
    { 
      name: "Bisnis & Media", 
      icon: BarChart3,
      roles: ['BUSINESS_LEAD', 'BUSINESS', 'DIRECTOR', 'SHOW_DIR', 'MEDIA'],
      subItems: [
        { name: "Data Pengunjung", href: "/admin/visitors", icon: Users, roles: ['BUSINESS_LEAD', 'BUSINESS', 'DIRECTOR'] },
        { name: "Laporan Sponsor", href: "/admin/analytics", icon: BarChart3, roles: ['BUSINESS_LEAD', 'BUSINESS', 'DIRECTOR'] },
        { name: "Manajemen Media", href: "/admin/media", icon: Video, roles: ['SHOW_DIR', 'MEDIA', 'DIRECTOR'] },
      ]
    },

    // --- SECRETARY ---
     { 
      name: "Sekretariat", 
      icon: FileText,
      roles: ['SECRETARY', 'DIRECTOR', 'SHOW_DIR'],
      subItems: [
        { name: "Generator Sertifikat", href: "/admin/secretary/cert-gen", icon: Award, roles: ['SECRETARY', 'DIRECTOR', 'SHOW_DIR'] },
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
    
    const navItem = (
      <NavItem key={menu.href} href={menu.href} icon={menu.icon}>
        {menu.name}
      </NavItem>
    );

    return isSheet ? <SheetClose asChild>{navItem}</SheetClose> : navItem;
  });


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
          <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.81 9.5L12 2.69L5.19 9.5H18.81ZM12 21.31L5.19 14.5H18.81L12 21.31Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <h1 className="font-headline font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-fuchsia-500">
            BCC ADMIN
          </h1>
        </div>
        <nav className="flex-1 py-4 px-4 overflow-y-auto no-scrollbar space-y-2">
          {renderNavLinks()}
        </nav>
        <div className="p-4">
          <form action={handleLogout}>
            <Button variant="outline" className="w-full">
                <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-72">
        <header className="h-16 bg-card/50 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-10 md:justify-end">
             <div className="md:hidden">
              <Sheet>
                  <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                          <Menu className="w-5 h-5"/>
                      </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-0 w-72 bg-card overflow-y-auto no-scrollbar">
                      <div className="p-6">
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
    </>
  );
}
