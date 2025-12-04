
'use client';

import { useState, useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, Trophy, BarChart3, LogOut, Lock, 
  ClipboardCheck, ArrowRight, Menu, Home, Settings, AlertOctagon,
  FileText, Shield, Mic, Ticket, Award, Wallet,
  ClipboardList, Activity, Gavel, Gift, Stethoscope, Receipt, CheckCircle,
  Store, Video, QrCode, Archive, ShieldAlert, DollarSign, ArrowRightCircle, Megaphone, Calculator, ChevronDown, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';

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
  "445": { name: "Hera (Tenant)", role: "TENANT_RELATIONS" },


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

// PIN Master untuk demo
const MASTER_PIN = "202626";

// --- DEFINISI MENU ---
const getMenusByRole = (role: string) => {
  const allMenus = [
    // --- CORE ---
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard, roles: ['ALL'] },

    // --- DIRECTOR ---
    { 
      name: "Director's Office", 
      icon: Shield,
      roles: ['DIRECTOR'],
      subItems: [
        { name: "Struktur Panitia", href: "/admin/director/committee", roles: ['DIRECTOR'] },
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
        'flex items-center gap-3 rounded-md text-sm transition-colors px-3 py-2',
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
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const pathname = usePathname();
  
  const [session, setSession] = useState({ isLoggedIn: false, role: 'DIRECTOR', name: 'Admin Super' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- MOCK SIMULATION DATA ---
  const MOCK_GOOGLE_USER = {
    name: "Irsyad Jamal",
    email: "irsyad@managementbcc.com",
    role: "DIRECTOR"
  };

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

  const handleGoogleLogin = () => {
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      setLoading(false);
      toast({ title: `Selamat Datang, ${MOCK_GOOGLE_USER.name}!`, description: "Simulasi login via Google berhasil." });
      
      const newSession = { isLoggedIn: true, role: MOCK_GOOGLE_USER.role, name: MOCK_GOOGLE_USER.name };
      setSession(newSession);
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_session', JSON.stringify(newSession));
    }, 1500);
  };

  const handlePinLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      const user = ADMIN_CODES[pin as keyof typeof ADMIN_CODES];
      if (user) {
        toast({ title: `Akses Diterima: ${user.name}` });
        const newSession = { isLoggedIn: true, role: user.role, name: user.name };
        setSession(newSession);
        setIsAuthenticated(true);
        sessionStorage.setItem('admin_session', JSON.stringify(newSession));
      } else {
        setError("PIN Salah! Akses ditolak.");
        toast({ title: "PIN Salah", variant: "destructive" });
        setPin('');
      }
    }, 1000);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPin('');
    setSession({ isLoggedIn: false, role: 'DIRECTOR', name: 'Admin Super' });
    sessionStorage.removeItem('admin_session');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex bg-zinc-950 text-white overflow-hidden">
        <div className="hidden lg:flex w-[60%] relative flex-col justify-between p-12 bg-zinc-900">
          <div className="absolute inset-0 z-0">
              <Image src="/images/gor-koni.jpg" alt="Court" fill className="object-cover opacity-30 grayscale mix-blend-luminosity"/>
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
              <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10 mix-blend-overlay"></div>
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
              <span>v2.1.0 (Admin Panel)</span>
          </div>
        </div>

        <div className="w-full lg:w-[40%] flex items-center justify-center p-8 relative bg-zinc-950 lg:bg-transparent">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] pointer-events-none" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 blur-[100px] pointer-events-none" />
           <div className="w-full max-w-sm space-y-8 relative z-10">
              <div className="text-center lg:text-left">
                  <h2 className="text-3xl font-black font-headline mb-2">Admin Portal</h2>
                  <p className="text-zinc-400">Masuk untuk mengelola turnamen.</p>
              </div>
              
              <div className="space-y-4">
                  <Button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full h-12 flex items-center justify-center gap-3 bg-white text-zinc-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-200 transition duration-200 text-base"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Masuk dengan Google
                      </>
                    )}
                  </Button>

                  <div className="relative flex py-2 items-center">
                      <div className="flex-grow border-t border-zinc-700"></div>
                      <span className="flex-shrink mx-4 text-zinc-500 text-xs font-bold">ATAU</span>
                      <div className="flex-grow border-t border-zinc-700"></div>
                  </div>

                  <form onSubmit={handlePinLogin}>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase text-zinc-500 tracking-wider">PIN Akses</Label>
                       <Input
                        type="password"
                        maxLength={6}
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        className="w-full px-4 py-3 text-center text-xl tracking-[0.5em] bg-zinc-900 border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white h-14"
                        placeholder="••••••"
                        disabled={loading}
                      />
                    </div>
                    {error && <p className="text-red-500 text-xs text-center mt-2">{error}</p>}
                    <Button
                      type="submit"
                      disabled={loading || pin.length < 3}
                      className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg mt-4 h-12 text-base hover:bg-primary/90 transition duration-200 disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : 'Lanjutkan dengan PIN'}
                    </Button>
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
          <CollapsibleTrigger className="flex justify-between items-center w-full group rounded-md hover:bg-secondary/50">
              <div className={cn(
                'flex items-center gap-3 px-3 py-2.5 text-sm font-bold',
                isParentActive ? 'text-primary' : 'text-foreground/80'
              )}>
                <menu.icon className="w-5 h-5" />
                <span>{menu.name}</span>
              </div>
              <ChevronDown className={cn(
                  'w-4 h-4 mr-2 text-muted-foreground transition-transform group-data-[state=open]:rotate-180',
                  isParentActive && 'text-primary'
              )} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-5 mt-1">
             <div className="pl-6 border-l border-border space-y-1">
                {menu.subItems.map((subItem: any) => {
                  const isActive = pathname.startsWith(subItem.href) && (subItem.href !== '/admin' || pathname === '/admin');
                  const NavContent = () => (
                    <NavLink key={subItem.href} href={subItem.href!} isActive={isActive}>
                      <span>{subItem.name}</span>
                    </NavLink>
                  );
                  return isSheet ? <SheetClose asChild><NavContent /></SheetClose> : <NavContent />;
                })}
             </div>
          </CollapsibleContent>
        </Collapsible>
      );
    }

    const isActive = menu.href ? pathname.startsWith(menu.href) && (menu.href !== '/admin' || pathname === '/admin') : false;
    const NavContent = () => (
      <NavLink key={menu.href} href={menu.href!} isActive={isActive}>
        {menu.icon && <menu.icon className="w-5 h-5" />}
        <span>{menu.name}</span>
      </NavLink>
    );
    return isSheet ? <SheetClose asChild><NavContent /></SheetClose> : <NavContent />;
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
                        {renderNavLinks(true)}
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

    
    