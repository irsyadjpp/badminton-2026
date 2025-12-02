'use client';

import { useState } from 'react';
import { redirect, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, Users, LogOut, Settings, CheckCircle, 
  Download, Menu, Home, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logoutManager } from '../actions';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Nonaktifkan proteksi route sementara
  // const session = await getManagerSession();
  // if (!session || !session.isLoggedIn) {
  //   redirect('/manager/login');
  // }
  
  const menus = [
    { name: "Dashboard", href: "/manager/dashboard", icon: LayoutDashboard },
    { name: "Registrasi Tim", href: "/manager/register-team", icon: Users },
    { name: "Status & Verifikasi", href: "/manager/status", icon: CheckCircle },
    { name: "Dokumen & Unduh", href: "/manager/downloads", icon: Download },
    { name: "Cetak Waiver", href: "/manager/documents/waiver", icon: FileText, isExternal: true },
    { name: "Pengaturan Akun", href: "/manager/settings", icon: Settings },
  ];
  
  const handleLogout = async () => {
      await logoutManager();
      // Redirect di server action akan menangani pengalihan
  };

  return (
    <div className="dark flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col fixed h-full">
        <div className="p-6 border-b border-border flex items-center gap-3">
          <h1 className="font-headline font-black text-xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-fuchsia-500">
            MANAGER AREA
          </h1>
        </div>
        <div className="p-4 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground px-4 uppercase">Hi, Manager!</p>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {menus.map((menu) => {
            const isActive = pathname === menu.href;
            return (
              <Link 
                key={menu.href} 
                href={menu.href}
                target={menu.isExternal ? "_blank" : undefined}
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
          <form action={handleLogout}>
            <Button variant="outline" className="w-full">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </form>
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
                      <div className="p-6 border-b border-border">
                        <h1 className="font-headline font-black text-xl text-primary">MANAGER AREA</h1>
                      </div>
                      <nav className="p-4 space-y-1">
                          {menus.map((menu) => {
                            const isActive = pathname === menu.href;
                            return (
                              <Link 
                                key={menu.href} 
                                href={menu.href}
                                target={menu.isExternal ? "_blank" : undefined}
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
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="font-bold text-primary">M</span>
                    </div>
                    <div className="text-sm hidden sm:block">
                        <p className="font-bold">Manager</p>
                        <p className="text-xs text-muted-foreground">{'demo@bcc.com'}</p>
                    </div>
                </div>
             </div>
        </header>
        
        <main className="p-4 md:p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
