'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, Trophy, BarChart3, LogOut, Lock, 
  ClipboardCheck, ArrowRight, Menu, Home, Settings, AlertOctagon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const ADMIN_PIN = "2026"; 

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const session = sessionStorage.getItem('admin_session');
    if (session === 'true') setIsAuthenticated(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_session', 'true');
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
              <Image 
                  src="/images/gor-koni.jpg" 
                  alt="Court" 
                  fill 
                  className="object-cover opacity-40 grayscale mix-blend-luminosity"
              />
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
                  <h2 className="text-3xl font-black font-headline mb-2">Admin Panel</h2>
                  <p className="text-zinc-400">Masukkan PIN untuk mengakses data.</p>
              </div>
              <div className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase text-zinc-500 tracking-wider">PIN Admin</Label>
                          <div className="relative">
                              <Lock className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
                              <Input 
                                  name="pin" 
                                  type="password" 
                                  placeholder="••••••••" 
                                  className="pl-10 bg-zinc-900 border-zinc-800 text-white h-12 rounded-lg focus:ring-primary focus:border-primary transition-all placeholder:text-zinc-600 text-center tracking-[0.5em]" 
                                  value={pin}
                                  onChange={(e) => setPin(e.target.value)}
                                  required
                              />
                          </div>
                      </div>
                      <Button 
                          type="submit" 
                          className="w-full h-14 bg-primary text-white font-bold rounded-lg transition-all hover:bg-primary/90 text-lg group"
                      >
                          Masuk Dashboard
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                  </form>
              </div>
              <p className="text-center text-sm text-zinc-500 pt-6">
                  Akses terbatas hanya untuk panitia dan wasit.
              </p>
           </div>
        </div>
      </div>
    );
  }

  const menus = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Manajemen Tim", href: "/admin/teams", icon: Users },
    { name: "Input Skor (Live)", href: "/admin/matches", icon: Trophy },
    { name: "Area Wasit", href: "/admin/referee", icon: Trophy },
    { name: "Manajemen Protes", href: "/admin/protests", icon: AlertOctagon },
    { name: "Data Pengunjung", href: "/admin/visitors", icon: Users },
    { name: "Undian Doorprize", href: "/admin/raffle", icon: Trophy },
    { name: "Laporan Sponsor", href: "/admin/analytics", icon: BarChart3 },
    { name: "Verifikasi TPF", href: "/admin/tpf", icon: ClipboardCheck },
  ];

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
        <nav className="flex-1 p-4 space-y-1">
          {menus.map((menu) => {
            const isActive = pathname.startsWith(menu.href) && (menu.href !== '/admin' || pathname === '/admin');
            return (
              <Link 
                key={menu.href} 
                href={menu.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group',
                  isActive 
                    ? 'bg-primary/10 text-primary font-bold shadow-inner shadow-primary/10' 
                    : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground font-medium'
                )}
              >
                <div className={cn('absolute left-0 w-1 h-6 rounded-r-full bg-primary transition-all', isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50')} />
                <menu.icon className="w-5 h-5" />
                <span>{menu.name}</span>
              </Link>
            )
          })}
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
                          {menus.map((menu) => {
                            const isActive = pathname.startsWith(menu.href) && (menu.href !== '/admin' || pathname === '/admin');
                            return (
                              <Link 
                                key={menu.href} 
                                href={menu.href}
                                className={cn(
                                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                                  isActive 
                                    ? 'bg-primary text-primary-foreground font-bold' 
                                    : 'text-muted-foreground hover:bg-secondary'
                                )}
                              >
                                <menu.icon className="w-5 h-5" />
                                {menu.name}
                              </Link>
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
                        <span className="font-bold text-primary">A</span>
                    </div>
                    <div className="text-sm hidden sm:block">
                        <p className="font-bold">Admin</p>
                        <p className="text-xs text-muted-foreground">Superuser</p>
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
