import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/sections/hero';
import { SponsorsSection } from '@/components/sections/sponsors';
import { ValuePropositionSection } from '@/components/sections/value-props';
import { CategoriesSection } from '@/components/sections/categories';
import { LevelingGuideSection } from '@/components/sections/leveling-guide';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <ValuePropositionSection />
        <LevelingGuideSection />
        <CategoriesSection />
        <SponsorsSection />
      </main>
      <Footer />
    </div>
  );
}
