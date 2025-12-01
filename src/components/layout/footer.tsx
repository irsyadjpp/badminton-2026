import { Mail, Phone, BookOpen, ArrowRight, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

export function Footer() {
  return (
    <footer id="contact" className="bg-background text-foreground border-t">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="font-headline text-lg font-bold mb-4 text-primary">Kontak</h3>
            <p className="text-muted-foreground mb-4">
              Punya pertanyaan? Jangan ragu untuk menghubungi kami.
            </p>
             <Button asChild>
                <Link href="/contact">
                  Hubungi Kami <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
          </div>
          <div>
            <h3 className="font-headline text-lg font-bold mb-4 text-primary">Informasi</h3>
            <ul className="space-y-2 text-muted-foreground">
               <li className="flex items-center justify-center md:justify-start">
                <BookOpen className="w-4 h-4 mr-2 text-primary/70" />
                <a href="/technical-handbook.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  Buku Panduan Teknis
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <HelpCircle className="w-4 h-4 mr-2 text-primary/70" />
                <Link href="/faq" className="hover:text-primary transition-colors">
                  Pertanyaan Umum (FAQ)
                </Link>
              </li>
                 <li className="flex items-center justify-center md:justify-start">
                <Mail className="w-4 h-4 mr-2 text-primary/70" />
                <a href="mailto:admin@managementbcc.com" className="hover:text-primary transition-colors">
                  admin@managementbcc.com
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <Phone className="w-4 h-4 mr-2 text-primary/70" />
                <a href="tel:+6285693738869" className="hover:text-primary transition-colors">
                  +62 856-9373-8869 (WA)
                </a>
              </li>
            </ul>
          </div>
           <div className="md:col-span-1">
             <h3 className="font-headline text-lg font-bold mb-4 text-primary">Komitmen Integritas</h3>
            <p className="text-sm text-muted-foreground [&_a]:text-primary [&_a:hover]:underline">
                BCC 2026 menjunjung tinggi nilai sportivitas. Setiap pelanggaran terhadap integritas kompetisi akan ditindak sesuai aturan yang berlaku.
            </p>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Bandung Community Championship. All Rights Reserved.</p>
          <p className="mt-2">Diselenggarakan oleh Komunitas Dayminton</p>
        </div>
      </div>
    </footer>
  );
}
