"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Swords, UserPlus, Trophy } from "lucide-react";

const categories = [
  {
    id: "mens-team",
    title: "Beregu Putra",
    subtitle: "Power & Strategi",
    description: "Medan pertempuran klasik. Adu kekuatan smash dan strategi bertahan yang solid.",
    matches: [
      "2x Ganda Beginner",
      "2x Ganda Intermediate",
      "1x Ganda Advance"
    ],
    icon: Swords,
    accent: "text-blue-600",
    bgAccent: "bg-blue-500/10",
    borderHover: "group-hover:border-blue-500/50"
  },
  {
    id: "womens-team",
    title: "Beregu Putri",
    subtitle: "Srikandi Tangguh",
    description: "Panggung bagi para srikandi. Hadirkan keunikan strategi dengan format 3-on-3.",
    matches: [
      "2x Ganda Beginner",
      "2x Ganda Intermediate",
      "1x Ganda 3-on-3 (Open)"
    ],
    icon: Users,
    accent: "text-pink-600",
    bgAccent: "bg-pink-500/10",
    borderHover: "group-hover:border-pink-500/50"
  },
  {
    id: "mixed-team",
    title: "Beregu Campuran",
    subtitle: "Harmoni & Taktik",
    description: "Keseimbangan sempurna putra dan putri. Uji kekompakan dan rotasi pemain.",
    matches: [
      "XD Beginner",
      "MD Beginner",
      "WD Intermediate",
      "MD Intermediate",
      "XD Advance"
    ],
    icon: UserPlus,
    accent: "text-purple-600",
    bgAccent: "bg-purple-500/10",
    borderHover: "group-hover:border-purple-500/50"
  },
];

export function CategoriesSection() {
  return (
    <section className="bg-secondary py-16 md:py-24 relative overflow-hidden">
       {/* Elemen Dekoratif Background */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
       </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground mb-4">
            Kategori Kompetisi
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tiga panggung berbeda untuk membuktikan siapa komunitas terbaik. <br />
            Pilih medan tempur Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 hover-spotlight">
          {categories.map((category) => (
            <Card 
                key={category.id} 
                className={`group card-item relative overflow-hidden border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-card ${category.borderHover}`}
            >
              {/* Ikon Latar Belakang Pudar */}
              <div className={`absolute -top-6 -right-6 p-4 opacity-5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:opacity-10`}>
                <category.icon className={`w-40 h-40 ${category.accent}`} />
              </div>

              <CardHeader className="relative pb-2">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${category.bgAccent} ${category.accent} shadow-sm group-hover:scale-110 transition-transform`}>
                    <category.icon className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                    <span className={`text-xs font-bold tracking-widest uppercase ${category.accent}`}>{category.subtitle}</span>
                    <CardTitle className="font-headline text-2xl font-black text-foreground">{category.title}</CardTitle>
                </div>
              </CardHeader>
              
              <CardContent className="relative space-y-6">
                <p className="text-muted-foreground text-sm leading-relaxed">
                    {category.description}
                </p>
                
                <div className="bg-secondary/40 rounded-xl p-5 border border-border/50">
                    <h4 className="text-sm font-bold mb-3 flex items-center gap-2 text-foreground">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        Komposisi 5 Partai:
                    </h4>
                    <ul className="space-y-2.5">
                        {category.matches.map((match, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                                <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${category.accent.replace('text-', 'bg-')}`} />
                                <span className="font-medium">{match}</span>
                            </li>
                        ))}
                    </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
