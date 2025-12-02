
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';

const NavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void; }) => {
  return (
    <Link href={href} onClick={onClick} className="font-medium text-foreground/80 hover:text-primary transition-colors">
      <span className="text-2xl md:text-sm">{children}</span>
    </Link>
  );
};


export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const closeSheet = () => setIsOpen(false);

  const navItems = () => (
    <>
      <SheetClose asChild><NavLink href="/" onClick={closeSheet}>Beranda</NavLink></SheetClose>
      <SheetClose asChild><NavLink href="/about" onClick={closeSheet}>Tentang</NavLink></SheetClose>
      <SheetClose asChild><NavLink href="/faq" onClick={closeSheet}>FAQ</NavLink></SheetClose>
      <SheetClose asChild><NavLink href="/contact" onClick={closeSheet}>Kontak</NavLink></SheetClose>
    </>
  );
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
                <Image src="/images/logo.png" alt="BCC 2026 Logo" width={28} height={28} />
                <span className="font-semibold font-headline text-xl tracking-tighter whitespace-nowrap">BCC 2026</span>
            </Link>
          </div>

          <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-6">
              <NavLink href="/">Beranda</NavLink>
              <NavLink href="/about">Tentang</NavLink>
              <NavLink href="/faq">FAQ</NavLink>
              <NavLink href="/contact">Kontak</NavLink>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <Button asChild variant="outline">
                <Link href="/admin">
                  <Shield className="mr-2 h-4 w-4" /> Admin
                </Link>
              </Button>
              <Button asChild>
                <Link href="/manager/login">
                  Manager Area
                </Link>
              </Button>
            </div>
            <div className="flex items-center md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6"/>
                    <span className="sr-only">Open Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-background w-[280px]">
                  <div className="flex flex-col items-start justify-center h-full space-y-6 p-6">
                    {navItems()}
                    <div className="flex flex-col gap-4 w-full pt-4 border-t border-border">
                      <Button asChild className="w-full">
                          <Link href="/manager/login" onClick={closeSheet}>
                            Manager Area
                          </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/admin" onClick={closeSheet}>
                          <Shield className="mr-2 h-4 w-4" /> Admin Login
                        </Link>
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
