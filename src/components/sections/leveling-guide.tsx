import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";

export function LevelingGuideSection() {
  const levels = [
    {
      title: "Beginner (Pemula)",
      dos: ["Grip 'Panci' (Panhandle)", "Ayunan lengan besar (bahu)"],
      donts: ["DILARANG bisa Backhand Overhead Clear", "Tidak ada rotasi lengan bawah"],
      color: "bg-green-500/10 text-green-700"
    },
    {
      title: "Intermediate (Menengah)",
      dos: ["Power Smash baik", "Langkah Chassé & Lob baseline-to-baseline"],
      donts: ["Backhand Overhead masih tanggung/datar", "Transisi menyerang ke bertahan lambat"],
      color: "bg-blue-500/10 text-blue-700"
    },
    {
      title: "Advance (Mahir)",
      dos: ["Finger Power & Wrist Snap (Bunyi Nyaring)", "Split Step konsisten", "Backhand Clear silang/lurus"],
      donts: ["Hanya untuk pemain non-profesional (Komunitas)"],
      color: "bg-red-500/10 text-red-700"
    }
  ];

  return (
    <section id="levels" className="py-16 bg-secondary md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground">Klasifikasi Level Pemain</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            BCC 2026 menggunakan parameter Biomekanik & Muscle Memory untuk memastikan kompetisi yang adil.
            <br/>
            <span className="text-destructive font-semibold">Salah kategori = Diskualifikasi tanpa refund.</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {levels.map((level, idx) => (
            <Card key={idx} className="border-t-4 border-t-primary shadow-sm hover:shadow-lg transition-shadow bg-card">
              <CardHeader className={`${level.color} rounded-t-lg pb-4`}>
                <CardTitle className="text-xl font-bold text-center">{level.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" /> Ciri Khas Level Ini:
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
                      {level.dos.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-destructive/90">
                      <XCircle className="w-5 h-5" /> Pantangan Level Ini:
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
                      {level.donts.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}