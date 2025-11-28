"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Dribbble, Menu, BookText, Info, Users, Calendar, Handshake, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';

const NavLink = ({ href, children, onClick, isExternal = false }: { href: string; children: React.ReactNode; onClick?: () => void; isExternal?: boolean }) => {
  const commonProps = {
    onClick: onClick,
    className: "font-medium text-foreground/80 hover:text-primary transition-all duration-300 px-3 py-2 rounded-md hover:bg-secondary text-sm",
  };

  const linkContent = <span className="text-2xl md:text-sm">{children}</span>;

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...commonProps}>
        {linkContent}
      </a>
    );
  }

  return (
    <Link href={href} {...commonProps}>
      {linkContent}
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

  const navItems = (closeSheet: () => void) => (
    <>
      <SheetClose asChild><NavLink href="/" onClick={closeSheet}>Beranda</NavLink></SheetClose>
      <SheetClose asChild><NavLink href="/about" onClick={closeSheet}>Tentang BCC</NavLink></SheetClose>
      <SheetClose asChild><NavLink href="/technical-handbook.pdf" isExternal onClick={closeSheet}>Regulasi</NavLink></SheetClose>
      <SheetClose asChild><NavLink href="https://ayo.co.id/register" isExternal onClick={closeSheet}>Daftar Tim</NavLink></SheetClose>
      <SheetClose asChild><NavLink href="https://ayo.co.id/" isExternal onClick={closeSheet}>Bagan & Jadwal</NavLink></SheetClose>
      <SheetClose asChild><NavLink href="/partners" onClick={closeSheet}>Mitra Kami</NavLink></SheetClose>
      <SheetClose asChild><a href="#contact" onClick={closeSheetAndScroll} className="font-medium text-foreground/80 hover:text-primary transition-all duration-300 px-3 py-2 rounded-md hover:bg-secondary text-2xl md:text-sm">Kontak</a></SheetClose>
    </>
  );
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/90 backdrop-blur-lg">
      <div className="container flex h-16 items-center">
        <div className="mr-auto flex items-center">
            <Link href="/" className="flex items-center gap-2">
            <Dribbble className="h-7 w-7 text-primary" />
            <span className="font-bold font-headline text-xl tracking-tighter">BCC 2026</span>
            </Link>
        </div>

        <nav className="hidden md:flex items-center gap-1">
           <NavLink href="/">Beranda</NavLink>
           <NavLink href="/about">Tentang BCC</NavLink>
           <NavLink href="/technical-handbook.pdf" isExternal>Regulasi</NavLink>
           <NavLink href="https://ayo.co.id/register" isExternal>Daftar Tim</NavLink>
           <NavLink href="https://ayo.co.id/" isExternal>Bagan & Jadwal</NavLink>
           <NavLink href="/partners">Mitra Kami</NavLink>
           <a href="#contact" onClick={handleScroll} className="font-medium text-foreground/80 hover:text-primary transition-all duration-300 px-3 py-2 rounded-md hover:bg-secondary text-sm">Kontak</a>
        </nav>

        <div className="ml-auto flex items-center md:hidden">
           <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6"/>
                <span className="sr-only">Open Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background/95 w-[280px]">
              <div className="flex flex-col items-start justify-center h-full space-y-6 p-6">
                {navItems(() => setIsOpen(false))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
