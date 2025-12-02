import { redirect } from 'next/navigation';
import { getManagerSession, logoutManager } from '../actions';
import Link from 'next/link';
import { LayoutDashboard, Users, LogOut, Settings, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function ManagerLayout({ children }: { children: React.ReactNode }) {
  const session = await getManagerSession();

  // PROTEKSI ROUTE: Jika tidak ada session, tendang ke login
  if (!session || !session.isLoggedIn) {
    redirect('/manager/login');
  }

  const menus = [
    { name: "Dashboard", href: "/manager/dashboard", icon: LayoutDashboard },
    { name: "Registrasi Tim", href: "/manager/register-team", icon: FileText },
    { name: "Data Pemain", href: "/manager/players", icon: Users },
    { name: "Pengaturan Akun", href: "/manager/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Sederhana */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col fixed h-full">
        <div className="p-6 border-b">
          <h2 className="font-black text-xl text-primary">BCC Manager</h2>
          <p className="text-xs text-muted-foreground mt-1">Hi, {session.name}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {menus.map((menu) => (
            <Link 
              key={menu.href} 
              href={menu.href}
              className="flex items-center gap-3 px-4 py-3 rounded-md text-gray-600 hover:bg-primary/5 hover:text-primary transition-colors"
            >
              <menu.icon className="w-5 h-5" />
              {menu.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <form action={logoutManager}>
            <Button variant="outline" className="w-full text-red-600 hover:bg-red-50 hover:border-red-200 hover:text-red-700 border-red-200">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-white border-b flex items-center justify-between px-4 sticky top-0 z-10">
           <span className="font-bold">BCC Manager Area</span>
           <form action={logoutManager}>
             <Button size="sm" variant="ghost"><LogOut className="w-4 h-4" /></Button>
           </form>
        </header>
        
        <main className="p-4 md:p-8 max-w-5xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
