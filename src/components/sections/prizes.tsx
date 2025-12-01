"use client";

import { Trophy, Medal, Crown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourtLines } from "@/components/ui/court-lines";

export function PrizesSection() {
  const prizePool = [
    {
      rank: "Juara 1",
      amount: "Rp 7.000.000",
      items: "Medali Emas + Trofi",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20"
    },
    {
      rank: "Juara 2",
      amount: "Rp 4.000.000",
      items: "Medali Perak + Trofi",
      color: "text-slate-400",
      bgColor: "bg-slate-400/10",
      borderColor: "border-slate-400/20"
    },
    {
      rank: "Juara 3",
      amount: "Rp 3.000.000",
      items: "Medali Perunggu + Trofi",
      color: "text-amber-700",
      bgColor: "bg-amber-700/10",
      borderColor: "border-amber-700/20"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <CourtLines /> 

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground mb-4">
            Panggung Kejayaan
          </h2>
          <div className="flex flex-col items-center gap-2">
             <span className="text-muted-foreground text-lg uppercase tracking-widest font-semibold">
                Total Prize Pool Minimum
             </span>
             <span className="text-5xl md:text-6xl font-black font-headline text-primary drop-shadow-sm">
                Rp 42.000.000<span className="text-3xl align-top text-foreground/40 ml-1">+</span>
             </span>
             <p className="text-sm text-muted-foreground mt-4 max-w-lg mx-auto">
                *Jumlah hadiah bersifat dinamis dan berpotensi bertambah sesuai dengan dukungan sponsor yang masuk.
             </p>
          </div>
        </div>

        {/* --- HIGHLIGHT PIALA BERGILIR --- */}
        <div className="max-w-4xl mx-auto mb-12">
            <Card className="border-2 border-primary/30 bg-gradient-to-br from-background via-background to-primary/5 shadow-xl shadow-primary/5 relative overflow-hidden group hover:border-primary/50 transition-all duration-500">
                {/* Ikon Dekoratif Background */}
                <div className="absolute -top-10 -right-10 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500">
                    <Crown className="w-64 h-64 text-foreground rotate-12" />
                </div>
                
                <CardContent className="flex flex-col md:flex-row items-center p-8 md:p-10 gap-8 text-center md:text-left relative z-10">
                    <div className="bg-gradient-to-br from-yellow-100 to-yellow-400 p-6 rounded-full shadow-lg shrink-0 border-4 border-white/50 ring-1 ring-yellow-500/20">
                        <Trophy className="w-20 h-20 text-yellow-800" />
                    </div>
                    <div className="space-y-3">
                        <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-1">
                            Penghargaan Tertinggi
                        </div>
                        <h3 className="text-3xl md:text-4xl font-black font-headline text-foreground leading-tight">
                            PIALA BERGILIR JUARA UMUM
                        </h3>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Simbol supremasi komunitas bulutangkis Bandung. Akumulasi poin tertinggi dari seluruh kategori akan membawa pulang trofi legendaris ini.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* --- GRID JUARA 1, 2, 3 --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {prizePool.map((prize) => (
            <Card key={prize.rank} className={`border-2 bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${prize.borderColor}`}>
              <CardHeader className="text-center pb-4 pt-8">
                <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${prize.bgColor} shadow-inner`}>
                  <Medal className={`w-10 h-10 ${prize.color}`} />
                </div>
                <CardTitle className="font-headline text-2xl font-bold">{prize.rank}</CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-8">
                <div className="text-2xl md:text-3xl font-black text-foreground mb-3 font-headline tracking-tight">
                  {prize.amount}
                </div>
                <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground text-sm font-medium">
                  <span>{prize.items}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Footer Note */}
        <div className="text-center mt-12">
          <div className="inline-block p-4 bg-secondary/30 rounded-xl max-w-2xl mx-auto border border-border/50">
            <p className="text-sm text-muted-foreground">
              <span className="font-bold text-primary">*Catatan Penting:</span> Hadiah uang tunai akan ditransfer sepenuhnya melalui rekening resmi <strong>Bank BJB</strong>. Pajak hadiah ditanggung oleh pemenang sesuai peraturan yang berlaku.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
