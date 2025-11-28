import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SponsorsSection } from '@/components/sections/sponsors';

export default function PartnersPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow py-16">
        <SponsorsSection />
      </main>
      <Footer />
    </div>
  );
}
