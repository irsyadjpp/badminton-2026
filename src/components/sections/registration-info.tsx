import { Button } from "@/components/ui/button";
import { Video, UserCheck, CreditCard, Ticket } from "lucide-react";

export function RegistrationInfoSection() {
  const steps = [
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: "1. Akun Ayo Indonesia",
      desc: "Seluruh pemain WAJIB memiliki akun terverifikasi di aplikasi Ayo Indonesia."
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: "2. Siapkan Video",
      desc: "Siapkan link video YouTube main 1 game penuh (skor 30) tanpa potongan (uncut) untuk verifikasi level."
    },
    {
      icon: <Ticket className="w-6 h-6" />,
      title: "3. Daftar Tim",
      desc: "Kapten mendaftarkan tim melalui link pendaftaran resmi dan mengisi DSP (Daftar Susunan Pemain)."
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "4. Pembayaran",
      desc: "Lakukan pembayaran biaya pendaftaran untuk mengunci slot tim Anda."
    }
  ];

  return (
    <section id="registration" className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold font-headline text-center mb-10">Alur Pendaftaran</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center relative">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-primary border-2 border-primary/20 z-10">
                {step.icon}
              </div>
              {/* Garis penghubung (hidden di mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-primary/20 -z-0" />
              )}
              <h3 className="font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
            <Button size="lg" className="bg-primary text-white font-bold px-8">
                Buka Panduan Lengkap (PDF)
            </Button>
        </div>
      </div>
    </section>
  );
}