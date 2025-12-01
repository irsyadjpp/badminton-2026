'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Trophy, BarChart3, LogOut, Lock, ClipboardCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

// PIN Sederhana untuk proteksi halaman admin
const ADMIN_PIN = "2026"; 

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const pathname = usePathname();

  // Cek sesi (simulasi)
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
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_session');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/30">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <Lock className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>BCC Admin Panel</CardTitle>
            <CardDescription>Masukkan PIN untuk mengakses data.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input 
                type="password" 
                placeholder="Masukkan PIN" 
                value={pin} 
                onChange={(e) => setPin(e.target.value)} 
                className="text-center text-lg tracking-widest"
              />
              <Button type="submit" className="w-full">Masuk Dashboard</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const menus = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Manajemen Tim", href: "/admin/teams", icon: Users },
    { name: "Input Skor (Live)", href: "/admin/matches", icon: Trophy },
    { name: "Area Wasit", href: "/admin/referee", icon: Trophy },
    { name: "Data Pengunjung", href: "/admin/visitors", icon: Users },
    { name: "Undian Doorprize", href: "/admin/raffle", icon: Trophy },
    { name: "Laporan Sponsor", href: "/admin/analytics", icon: BarChart3 },
    { name: "Verifikasi TPF", href: "/admin/tpf", icon: ClipboardCheck },
  ];

  return (
    <div className="flex min-h-screen bg-secondary/10">
      {/* Sidebar */}
      <aside className="w-64 bg-background border-r border-border hidden md:flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="font-headline font-bold text-xl text-primary">BCC Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menus.map((menu) => {
            const isActive = pathname.startsWith(menu.href) && (menu.href !== '/admin' || pathname === '/admin');
            return (
              <Link 
                key={menu.href} 
                href={menu.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary text-primary-foreground font-medium' : 'text-muted-foreground hover:bg-secondary'}`}
              >
                <menu.icon className="w-5 h-5" />
                {menu.name}
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

      {/* Mobile Header (Simplified) */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-border bg-background flex items-center px-6 md:hidden">
             <span className="font-bold">BCC 2026 Admin</span>
        </header>
        
        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
