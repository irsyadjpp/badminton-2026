
'use client';

import { useState, useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, Trophy, BarChart3, LogOut, Lock, 
  ClipboardCheck, ArrowRight, Menu, Home, Settings, AlertOctagon,
  FileCheck, Shield, Mic, Ticket, Award, Wallet,
  ClipboardList, Activity, Gavel, Gift, Stethoscope, Receipt
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const ADMIN_PIN = "2026"; 

// --- DEFINISI MENU ---
const getMenusByRole = (role: string) => {
  
  // MENU PANITIA (Back Office)
  const adminMenus = [
    { header: "Utama" },
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard, roles: ['DIRECTOR', 'FINANCE', 'BUSINESS', 'SECRETARY', 'OPERATIONS'] },
    
    { header: "Keuangan & Legal" },
    { name: "Verifikasi Pembayaran", href: "/admin/teams", icon: Receipt, roles: ['DIRECTOR', 'FINANCE'] },
    { name: "Jurnal & Reimburse", href: "/admin/finance/reimbursement-approval", icon: Wallet, roles: ['DIRECTOR', 'FINANCE'] },
    
    { header: "Peserta & Data" },
    { name: "Verifikasi TPF (Audit)", href: "/admin/tpf", icon: CheckCircle, roles: ['DIRECTOR', 'TPF'] },
    { name: "Data Pengunjung", href: "/admin/visitors", icon: Users, roles: ['DIRECTOR', 'BUSINESS'] },
    { name: "Laporan Komersial", href: "/admin/analytics", icon: BarChart3, roles: ['DIRECTOR', 'BUSINESS'] },
    
    { header: "Operasional" },
    { name: "Generator Sertifikat", href: "/admin/secretary/cert-gen", icon: FileText, roles: ['DIRECTOR', 'SECRETARY'] },
    { name: "Undian Doorprize", href: "/admin/raffle", icon: Gift, roles: ['DIRECTOR', 'OPERATIONS'] },
    // { name: "Medical Log", href: "/admin/medical", icon: Stethoscope, roles: ['DIRECTOR', 'OPERATIONS'] },
  ];

  // MENU WASIT & MATCH CONTROL (Field)
  const technicalMenus = [
    { header: "Match Control" },
    { name: "Jadwal Lapangan", href: "/admin/referee", icon: ClipboardList, roles: ['MATCH_CONTROL', 'REFEREE', 'MLO'] },
    { name: "Input Skor (Wasit)", href: "/admin/matches", icon: Activity, roles: ['MATCH_CONTROL', 'REFEREE', 'MLO'] },
    { name: "Keputusan Protes", href: "/admin/protests", icon: Gavel, roles: ['MATCH_CONTROL', 'REFEREE'] },
    // { name: "Cek Line-Up", href: "/admin/lineups", icon: Users, roles: ['MATCH_CONTROL', 'MLO'] },
  ];

  // Gabungkan menu berdasarkan Role Group
  // Jika role adalah perangkat pertandingan, tampilkan menu teknis saja
  if (['MATCH_CONTROL', 'REFEREE', 'MLO'].includes(role)) {
    return technicalMenus.filter(m => m.roles?.includes(role) || m.header);
  }
  
  // Jika role panitia, tampilkan menu admin
  if (['DIRECTOR', 'FINANCE', 'BUSINESS', 'SECRETARY', 'OPERATIONS', 'TPF'].includes(role)) {
    return adminMenus.filter(m => m.roles?.includes(role) || m.header);
  }

  // Fallback untuk role 'ADMIN' atau 'SUPERUSER' (tampilkan semua)
  return [...adminMenus, ...technicalMenus];
};


interface NavLinkProps {
  href: string;
  children: ReactNode;
  onClick?: () => void;
  isActive: boolean;
  isSheet: boolean;
}

const NavLink = ({ href, children, onClick, isActive, isSheet }: NavLinkProps) => {
  const linkContent = (
    <Link 
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group',
        isActive 
          ? 'bg-primary/10 text-primary font-bold shadow-inner shadow-primary/10' 
          : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground font-medium'
      )}
    >
      {!isSheet && <div className={cn('absolute left-0 w-1 h-6 rounded-r-full bg-primary transition-all', isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50')} />}
      {children}
    </Link>
  );
  
  return isSheet ? <SheetClose asChild>{linkContent}</SheetClose> : linkContent;
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const pathname = usePathname();
  
  // MOCK SESSION
  const [session, setSession] = useState({ isLoggedIn: false, role: 'DIRECTOR', name: 'Admin Super' });

  useEffect(() => {
    const sessionStr = sessionStorage.getItem('admin_session');
    if (sessionStr) {
        const storedSession = JSON.parse(sessionStr);
        setSession(storedSession);
        setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent, role: string) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
        const newSession = { isLoggedIn: true, role, name: `${role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()} User` };
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
                  <h2 className="text-3xl font-black font-headline mb-2">Simulasi Login Role</h2>
                  <p className="text-zinc-400">Masukkan PIN Admin (2026) lalu pilih role.</p>
              </div>
              <div className="space-y-4">
                  <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                      <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase text-zinc-500 tracking-wider">PIN Admin</Label>
                          <div className="relative">
                              <Lock className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
                              <Input name="pin" type="password" placeholder="••••" className="pl-10 bg-zinc-900 border-zinc-800 text-white h-12 rounded-lg focus:ring-primary focus:border-primary transition-all placeholder:text-zinc-600 text-center tracking-[0.5em]" value={pin} onChange={(e) => setPin(e.target.value)} required />
                          </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                          <Button onClick={(e) => handleLogin(e, 'DIRECTOR')} className="w-full h-12 bg-primary text-white font-bold rounded-lg transition-all hover:bg-primary/90">Director</Button>
                          <Button onClick={(e) => handleLogin(e, 'FINANCE')} variant="secondary">Finance</Button>
                          <Button onClick={(e) => handleLogin(e, 'REFEREE')} variant="secondary">Referee</Button>
                          <Button onClick={(e) => handleLogin(e, 'TPF')} variant="secondary">TPF</Button>
                      </div>
                  </form>
              </div>
              <p className="text-center text-sm text-zinc-500 pt-6">Akses terbatas hanya untuk panitia dan wasit.</p>
           </div>
        </div>
      </div>
    );
  }
  
  const currentMenus = getMenusByRole(session.role);

  const renderNavLinks = (isSheet: boolean = false) => currentMenus.map((menu, idx) => {
      if (menu.header) {
          return !isSheet && (
              <div key={idx} className="px-4 pt-4 pb-2 text-xs font-semibold text-muted-foreground tracking-wider">
                  {menu.header}
              </div>
          );
      }
      const isActive = menu.href ? pathname.startsWith(menu.href) && (menu.href !== '/admin' || pathname === '/admin') : false;
      return (
        <NavLink key={menu.href} href={menu.href!} isActive={isActive} isSheet={isSheet}>
          {menu.icon && <menu.icon className="w-5 h-5" />}
          <span>{menu.name}</span>
        </NavLink>
      )
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
        <nav className="flex-1 py-2 overflow-y-auto no-scrollbar">
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
                  <SheetContent side="left" className="p-0 w-72 bg-card">
                      <div className="p-6 border-b border-border flex items-center gap-3">
                        <Image src="/images/logo.png" alt="Logo" width={32} height={32} />
                        <h1 className="font-headline font-black text-2xl text-primary">BCC ADMIN</h1>
                      </div>
                      <nav className="p-4 space-y-1">
                          {currentMenus.map((menu) => {
                            if(menu.header) return null;
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
                        <span className="font-bold text-primary">{session.role.charAt(0)}</span>
                    </div>
                    <div className="text-sm hidden sm:block">
                        <p className="font-bold">{session.name}</p>
                        <p className="text-xs text-muted-foreground">{session.role}</p>
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
