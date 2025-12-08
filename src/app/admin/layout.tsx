
'use client';

import { useState, useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, redirect } from 'next/navigation';
import Image from 'next/image';
import { 
  LogOut,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { logoutAdmin } from './actions';
import { ThemeToggle } from '@/components/theme-toggle';
import { IntegrityPactModal } from '@/components/admin/integrity-pact-modal';
import { EmergencyButton } from '@/components/admin/emergency-button';
import { Toaster } from "@/components/ui/toaster";
import { NotificationBell } from '@/components/admin/notification-bell';
import { AdminBackground } from "@/components/admin/admin-background"; 
import { Separator } from '@/components/ui/separator';
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from '@/components/ui/app-sidebar';


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
    if (!session) return;
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
            <div className="w-8 h-8 animate-spin text-primary" />
        </div>
    );
  }

  if (!session?.isLoggedIn) {
    if (pathname === '/admin/login') {
        return <div className="min-h-screen">{children}</div>;
    }
    return null;
  }
  
  if (!session.isOnboarded) {
    return (
        <IntegrityPactModal 
            isOpen={true}
            onComplete={handlePactComplete}
            userName={session.name}
        />
    )
  }

  return (
    // DefaultOpen = true agar di desktop langsung terbuka
    <SidebarProvider defaultOpen={true}>
      
      {/* 1. SIDEBAR (Layer Tertinggi di Kiri) */}
      <AppSidebar className="z-50 border-r border-white/5" />
      
      {/* 2. AREA KONTEN (Sebelah Kanan) */}
      <SidebarInset className="relative flex flex-col min-h-screen bg-transparent overflow-hidden">
        
        {/* GLOBAL BACKGROUND: Fixed di belakang semuanya */}
        <div className="fixed inset-0 -z-50 pointer-events-none">
            <AdminBackground />
        </div>

        {/* HEADER: Sticky di atas konten */}
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4 bg-black/40 backdrop-blur-md border-b border-white/5 sticky top-0 z-40 transition-all">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="text-zinc-400 hover:text-white hover:bg-white/10 rounded-full w-10 h-10 transition-all" />
                <Separator orientation="vertical" className="mr-2 h-4 bg-zinc-700" />
                <span className="text-sm font-black text-zinc-200 hidden md:block tracking-widest uppercase font-headline">
                  BCC COMMAND CENTER
                </span>
            </div>

            <div className="flex items-center gap-4">
                <NotificationBell />
            </div>
        </header>

        {/* MAIN CONTENT: Scrollable */}
        <div className="flex-1 overflow-auto relative z-10 scroll-smooth">
            <div className="p-4 md:p-6 lg:p-8">
                {children}
            </div>
        </div>
        
        {/* FLOATING WIDGETS */}
        <EmergencyButton /> 
        <Toaster />

      </SidebarInset>
    </SidebarProvider>
  )
}
