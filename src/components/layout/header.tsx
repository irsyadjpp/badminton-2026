"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
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
  
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const href = e.currentTarget.href;
    const targetId = href.replace(/.*#/, "");
    const elem = document.getElementById(targetId);
    elem?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };
  
  const closeSheetAndScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    handleScroll(e);
    setIsOpen(false);
  };

  const closeSheet = () => setIsOpen(false);

  const navItems = () => (
    <>
      <SheetClose asChild><NavLink href="/" onClick={closeSheet}>Beranda</NavLink></SheetClose>
      <SheetClose asChild><a href="#contact" onClick={closeSheetAndScroll} className="font-medium text-foreground/80 hover:text-primary transition-colors text-2xl md:text-sm">Kontak</a></SheetClose>
    </>
  );
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-8 flex items-center gap-2">
          <Image src="/images/logo.png" alt="BCC 2026 Logo" width={28} height={28} />
          <span className="font-semibold font-headline text-xl tracking-tighter">BCC 2026</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
           <NavLink href="/">Beranda</NavLink>
           <a href="#contact" onClick={handleScroll} className="font-medium text-foreground/80 hover:text-primary transition-colors text-sm">Kontak</a>
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2">
           <Button asChild>
            <a href="#contact" onClick={handleScroll}>
              Hubungi Kami
            </a>
          </Button>
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
                        <a href="#contact" onClick={closeSheetAndScroll}>
                          Hubungi Kami
                        </a>
                      </Button>
                   </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
