import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

// Section Utama
import { HeroSection } from '@/components/sections/hero';

// Section Informasi Teknis (Dari Handbook)
import { TimelineSection } from '@/components/sections/timeline';
import { LevelingGuideSection } from '@/components/sections/leveling-guide';
import { RegistrationInfoSection } from '@/components/sections/registration-info';
import { LocationSection } from '@/components/sections/location';

// Section Kompetisi & Bisnis
import { CategoriesSection } from '@/components/sections/categories';
import { PrizesSection } from '@/components/sections/prizes';
import { SponsorsSection } from '@/components/sections/sponsors';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className="flex-grow">
        {/* 1. Hero: Judul Besar & Tombol Aksi */}
        <HeroSection />
        
        {/* 2. Jadwal: Kapan mainnya? */}
        <div id="schedule">
          <TimelineSection />
        </div>

        {/* 3. Hadiah: Motivasi utama peserta */}
        <PrizesSection />

        {/* 4. Kategori: Siapa saja yang bisa ikut? */}
        <CategoriesSection />

        {/* 5. Syarat Level: Filter peserta agar tidak salah daftar */}
        <div id="levels">
          <LevelingGuideSection /> 
        </div>

        {/* 6. Cara Daftar: Langkah-langkah teknis */}
        <div id="registration">
          <RegistrationInfoSection />
        </div>

        {/* 7. Sponsor: Undangan kerjasama */}
        <SponsorsSection />

        {/* 8. Lokasi: Peta GOR KONI */}
        <div id="venue">
          <LocationSection />
        </div>
        
      </main>

      <Footer />
    </div>
  );
}
