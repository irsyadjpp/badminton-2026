

'use client';

import { useState, useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, Trophy, BarChart3, LogOut, Lock, 
  ClipboardCheck, ArrowRight, Menu, Home, Settings, AlertOctagon,
  FileText, Shield, Mic, Ticket, Award, Wallet,
  ClipboardList, Activity, Gavel, Gift, Stethoscope, Receipt, CheckCircle,
  Store, Video, QrCode, Archive, ShieldAlert, DollarSign, ArrowRightCircle, Megaphone, Calculator, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const ADMIN_CODES: Record<string, { name: string; role: string }> = {
  // 1. PIMPINAN INTI (STEERING COMMITTEE)
  "001": { name: "Irsyad Jamal (Project Director)", role: "DIRECTOR" },
  "101": { name: "Rizki/Annisa (Sekretaris)", role: "SECRETARY" },
  "102": { name: "Selvi Yulia (Bendahara)", role: "FINANCE" },

  // 2. BIDANG PERTANDINGAN (MATCH CONTROL)
  "201": { name: "Agung (Koord. Pertandingan)", role: "MATCH_COORD" },
  "202": { name: "Sarah Fatmawati (MLO)", role: "MLO" },
  "203": { name: "Tim Verifikasi (TPF)", role: "TPF" }, // Anindiffa, Aulia, Faiz
  "204": { name: "Referee Utama", role: "REFEREE" }, // Jabatan Fungsional Khusus

  // 3. BIDANG KOMERSIAL (BUSINESS)
  "301": { name: "Teri Taufiq (Koord. Bisnis)", role: "BUSINESS_LEAD" },
  "302": { name: "Ali/Risca (Sponsorship/Tenant)", role: "BUSINESS" },

  // 4. BIDANG ACARA & KREATIF (SHOW & MEDIA)
  "401": { name: "Rizki Karami (Show Director)", role: "SHOW_DIR" },
  "402": { name: "Susi/Sarah/Rizky (Media)", role: "MEDIA" },

  // 5. BIDANG OPERASIONAL UMUM (OPERATIONS)
  "501": { name: "Kevin Deriansyah (Koord. Ops)", role: "OPS_LEAD" },
  "502": { name: "M. Nur Sidiq (Keamanan/Gate)", role: "GATE" },
  "503": { name: "Ananda Putri (Medis)", role: "MEDIC" },
  "504": { name: "Norma/Alfin (Reg/Logistik)", role: "LOGISTICS" },

  // 6. BIDANG IT & DIGITAL
  "601": { name: "Tim IT Support", role: "IT_ADMIN" } 
};

// --- DEFINISI MENU ---
const getMenusByRole = (role: string) => {
  const allMenus = [
    // --- CORE ---
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard, roles: ['ALL'] },

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
        // { name: "Logistik Kok", href: "/admin/logistics", roles: ['LOGISTICS', 'OPS_LEAD', 'MATCH_COORD'] },
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
        // { name: "Dokumen Legal", href: "/admin/secretary/archive", roles: ['SECRETARY', 'DIRECTOR'] },
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


interface NavLinkProps {
  href: string;
  children: ReactNode;
  onClick?: () => void;
  isActive: boolean;
}

const NavLink = ({ href, children, onClick, isActive }: NavLinkProps) => {
  return (
    <Link 
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
        isActive 
          ? 'bg-primary/10 text-primary font-bold' 
          : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground font-medium'
      )}
    >
      {children}
    </Link>
  );
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const pathname = usePathname();
  
  const [session, setSession] = useState({ isLoggedIn: false, role: 'DIRECTOR', name: 'Admin Super' });

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
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = ADMIN_CODES[pin as keyof typeof ADMIN_CODES];
    if (user) {
        const newSession = { isLoggedIn: true, role: user.role, name: user.name };
        setSession(newSession);
        setIsAuthenticated(true);
        sessionStorage.setItem('admin_session', JSON.stringify(newSession));
    } else {
      alert("PIN Salah!");
      setPin("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPin('');
    setSession({ isLoggedIn: false, role: 'DIRECTOR', name: 'Admin Super' });
    sessionStorage.removeItem('admin_session');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex bg-black text-white overflow-hidden">
        <div className="hidden lg:flex w-[60%] relative flex-col justify-between p-12 bg-zinc-900">
          <div className="absolute inset-0 z-0">
              <Image src="/images/gor-koni.jpg" alt="Court" fill className="object-cover opacity-40 grayscale mix-blend-luminosity"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-20 mix-blend-overlay"></div>
          </div>
          <div className="relative z-10">
               <div className="flex items-center gap-3 mb-2">
                  <Image src="/images/logo.png" alt="Logo" width={40} height={40} />
                  <span className="font-bold text-xl tracking-widest uppercase text-white/80">BCC 2026</span>
               </div>
          </div>
          <div className="relative z-10 max-w-xl">
              <h1 className="text-6xl font-black font-headline leading-[0.9] mb-6 tracking-tighter">
                  KENDALIKAN<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">TURNAMEN.</span>
              </h1>
              <p className="text-lg text-zinc-400 font-medium leading-relaxed">
                  Dashboard admin terpusat untuk Bandung Community Championship 2026. 
                  Mulai dari skor live, manajemen data, hingga verifikasi pemain.
              </p>
          </div>
          <div className="relative z-10 flex gap-6 text-sm text-zinc-500 font-mono">
              <span>© 2026 BCC Dev Team</span>
              <span>v2.0.1 (Admin Panel)</span>
          </div>
        </div>
        <div className="w-full lg:w-[40%] flex items-center justify-center p-8 relative">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] pointer-events-none" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 blur-[100px] pointer-events-none" />
           <div className="w-full max-w-md space-y-8 relative z-10">
              <div className="text-center lg:text-left">
                  <h2 className="text-3xl font-black font-headline mb-2">Admin Portal Login</h2>
                  <p className="text-zinc-400">Masukkan PIN unik sesuai divisi Anda.</p>
              </div>
              <div className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase text-zinc-500 tracking-wider">PIN Panitia</Label>
                          <div className="relative">
                              <Lock className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
                              <Input name="pin" type="password" placeholder="••••" className="pl-10 bg-zinc-900 border-zinc-800 text-white h-12 rounded-lg focus:ring-primary focus:border-primary transition-all placeholder:text-zinc-600 text-center tracking-[0.5em]" value={pin} onChange={(e) => setPin(e.target.value)} required />
                          </div>
                      </div>
                      <Button type="submit" className="w-full h-12 bg-primary text-white font-bold rounded-lg transition-all hover:bg-primary/90">Login</Button>
                  </form>
              </div>
              <p className="text-center text-sm text-zinc-500 pt-6">Akses terbatas hanya untuk panitia dan wasit.</p>
           </div>
        </div>
      </div>
    );
  }
  
  const currentMenus = getMenusByRole(session.role);

  const renderNavLinks = (isSheet: boolean = false) => currentMenus.map((menu: any, idx: number) => {
    if (menu.subItems) {
      const isParentActive = menu.subItems.some((sub: any) => pathname.startsWith(sub.href));
      return (
        <Collapsible key={idx} defaultOpen={isParentActive}>
          <CollapsibleTrigger className="flex justify-between items-center w-full group">
              <div className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-colors w-full',
                isParentActive ? 'text-primary' : 'text-foreground/80 hover:bg-secondary/50'
              )}>
                <menu.icon className="w-5 h-5" />
                <span>{menu.name}</span>
              </div>
              <ChevronDown className={cn(
                  'w-4 h-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180',
                  isParentActive && 'text-primary'
              )} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-6 border-l border-border ml-5 mt-1 space-y-1">
            {menu.subItems.map((subItem: any) => {
              const isActive = pathname.startsWith(subItem.href) && (subItem.href !== '/admin' || pathname === '/admin');
              return (
                <NavLink key={subItem.href} href={subItem.href!} isActive={isActive}>
                  <span>{subItem.name}</span>
                </NavLink>
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    const isActive = menu.href ? pathname.startsWith(menu.href) && (menu.href !== '/admin' || pathname === '/admin') : false;
    return (
      <NavLink key={menu.href} href={menu.href!} isActive={isActive}>
        {menu.icon && <menu.icon className="w-5 h-5" />}
        <span>{menu.name}</span>
      </NavLink>
    );
  });


  return (
    <div className="dark flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col fixed h-full">
        <div className="p-6 border-b border-border flex items-center gap-3">
          <Image src="/images/logo.png" alt="Logo" width={32} height={32} />
          <h1 className="font-headline font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-fuchsia-500">
            BCC ADMIN
          </h1>
        </div>
        <nav className="flex-1 py-4 px-2 overflow-y-auto no-scrollbar space-y-1">
          {renderNavLinks()}
        </nav>
        <div className="p-4 border-t border-border">
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
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
                        {currentMenus.map((menu:any, idx) => {
                            if (menu.subItems) {
                              return <p key={idx} className="text-muted-foreground text-xs font-bold uppercase pt-4 px-2">{menu.name}</p>;
                            }
                            const isActive = pathname.startsWith(menu.href!) && (menu.href !== '/admin' || pathname === '/admin');
                            return (
                              <SheetClose key={menu.href} asChild>
                                <Link 
                                  href={menu.href!}
                                  className={cn(
                                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                                    isActive 
                                      ? 'bg-primary text-primary-foreground font-bold' 
                                      : 'text-muted-foreground hover:bg-secondary'
                                  )}
                                >
                                  {menu.icon && <menu.icon className="w-5 h-5" />}
                                  {menu.name}
                                </Link>
                              </SheetClose>
                            )
                          })}
                      </nav>
                      <div className="p-4 border-t border-border absolute bottom-0 w-full">
                        <Button variant="outline" className="w-full" onClick={handleLogout}>
                          <LogOut className="w-4 h-4 mr-2" /> Logout
                        </Button>
                      </div>
                  </SheetContent>
              </Sheet>
             </div>
             
             <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/"><Home className="w-4 h-4" /></Link>
                </Button>
                 <Button variant="ghost" size="icon">
                    <Settings className="w-4 h-4" />
                </Button>
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
