import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ShieldCheck, Trophy, PartyPopper } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const valueProps = [
  {
    icon: <ShieldCheck className="w-10 h-10 text-primary" />,
    title: "Sistem Anti-Sandbagging",
    description: "Kompetisi adil dengan verifikasi video untuk setiap pemain, memastikan integritas turnamen. Visi kami adalah menciptakan kompetisi yang menjunjung tinggi sportivitas.",
  },
  {
    icon: <Trophy className="w-10 h-10 text-primary" />,
    title: "Total Hadiah Rp 42 Juta+",
    description: "Rebut total hadiah lebih dari 42 juta Rupiah dan buktikan supremasi komunitasmu. Misi kami adalah memberikan penghargaan yang layak bagi para juara.",
  },
  {
    icon: <PartyPopper className="w-10 h-10 text-primary" />,
    title: "WBD Celebration",
    description: "Rayakan World Basketball Day pada 5 Juli 2026 dengan acara puncak yang meriah dan tak terlupakan, sebagai bagian dari komitmen kami pada komunitas.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black font-headline text-primary">Tentang BCC 2026</h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
            Visi, Misi, dan Keunikan Bandung Community Championship 2026.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
              {valueProps.map((prop, index) => (
                <Card key={prop.title} 
                      className="text-left bg-secondary/30 border-l-4 border-primary/50 flex items-center p-6">
                  <div className="pr-6">
                    {prop.icon}
                  </div>
                  <div>
                    <CardTitle className="font-headline text-2xl font-bold mb-2">{prop.title}</CardTitle>
                    <CardDescription className="font-body text-base text-muted-foreground">
                      {prop.description}
                    </CardDescription>
                  </div>
                </Card>
              ))}
            </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
