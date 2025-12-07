import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Sparkles } from "lucide-react";
import { CourtLines } from '@/components/ui/court-lines';

export default function FAQPage() {
  const faqs = [
    {
      category: "Verifikasi Level & Integritas (TPF)",
      items: [
        {
          q: "Bagaimana jika TPF menaikkan level pemain saya (Upgrade), tapi slot di level atas tim kami sudah penuh?",
          a: "Panitia memberikan Masa Toleransi 3 Hari setelah hasil verifikasi keluar. Anda diperbolehkan untuk: Merombak susunan pemain tim atau mengganti pemain yang di-upgrade dengan pemain baru (New Entry) yang levelnya sesuai. Lewat dari 3 hari, susunan pemain akan dikunci (Locked)."
        },
        {
          q: "Apa batasan antara 'Underperform' di video dengan 'Jago' di lapangan?",
          a: "Parameter kami bukan skor, melainkan Biomekanik (Gerak Tubuh). Jika di video pemain memiliki grip kaku dan langkah berat, namun di lapangan tiba-tiba menunjukkan finger power dan backhand smash tajam, itu dikategorikan sebagai Manipulasi. Wasit berhak mendiskualifikasi pemain tersebut."
        },
        {
          q: "Bagaimana TPF memastikan tidak ada Joki (Pemain Cabutan)?",
          a: "Saat registrasi ulang di hari-H, pemain wajib menunjukkan KTP Asli. Wajah akan dicocokkan dengan video verifikasi. Jika berbeda, satu tim akan langsung di-blacklist."
        },
        {
          q: "Pemain saya latihan keras sehingga kemampuannya meningkat pesat. Apakah akan didiskualifikasi?",
          a: "Tidak, selama teknik dasar di video awal memang asli dan bukan akting. Kemajuan latihan dihargai, namun manipulasi video akan ditindak tegas."
        }
      ]
    },
    {
      category: "Sistem Pertandingan & Waktu",
      items: [
        {
          q: "Apa definisi 'NO INTERVAL' di poin 8 (Fase Gugur)?",
          a: "Dilarang istirahat/duduk di bench. Pemain boleh minum cepat di sisi lapangan saat bola mati, tapi tidak boleh menerima instruksi pelatih yang memakan waktu (Coaching)."
        },
        {
          q: "Bagaimana jika Tim saya sudah menang 3-0 di Fase Grup? Bolehkah partai sisa tidak dimainkan?",
          a: "Di Fase Grup, seluruh 5 partai WAJIB dimainkan. Jika bermain tidak serius (main sabun), itu akan merugikan Selisih Poin tim Anda sendiri di klasemen akhir."
        },
        {
          q: "Apa sanksi jika pemain terlambat masuk lapangan karena macet?",
          a: "Aturan Walkover (WO) berlaku mutlak. Risiko perjalanan adalah tanggung jawab peserta. Kami sangat menyarankan penggunaan Transportasi Online (Grab/Gojek)."
        }
      ]
    },
    {
      category: "Teknis Permainan (Rules of Play)",
      items: [
        {
          q: "Bolehkah Pelatih berteriak memberi instruksi saat reli berjalan?",
          a: "DILARANG KERAS. Instruksi hanya boleh diberikan saat bola mati. Pelatih yang mengganggu konsentrasi lawan akan diberi peringatan atau diusir dari Field of Play."
        },
        {
          q: "Bagaimana jika senar raket putus saat reli sedang berlangsung?",
          a: "Permainan LANJUT TERUS sampai bola mati. Pemain boleh berlari mengambil raket cadangan, namun reli tidak boleh berhenti. Jika raket terlepas dan masuk ke area lawan, dinyatakan Fault."
        },
        {
          q: "Bagaimana aturan cedera, khususnya kram?",
          a: "Tidak ada Medical Timeout khusus untuk kram. Petugas medis akan memberikan Pain Killer Spray. Jika pemain tidak bisa melanjutkan, wasit akan menyatakan Retired (Kalah)."
        },
        {
          q: "Untuk kategori 3-on-3 Putri, bagaimana aturan servisnya?",
          a: "Servis dilakukan bergantian sesuai rotasi poin. Penerima servis (Receiver) hanya pemain yang berdiri di kotak servis yang sesuai. Dua rekan lainnya tidak boleh memotong servis."
        }
      ]
    },
    {
      category: "Administrasi & Logistik",
      items: [
        {
          q: "Apakah Panitia menyediakan konsumsi/makan siang?",
          a: "TIDAK. Biaya pendaftaran tidak termasuk makan siang. Peserta dapat membeli makanan di area Bazaar/Kantin GOR dengan pembayaran via QRIS."
        },
        {
          q: "Apakah shuttlecock dijatah atau bebas?",
          a: "Fase Grup mendapat jatah 3 shuttlecock per partai. Fase Gugur menyesuaikan kebutuhan wasit. Shuttlecock tambahan dapat dibeli di meja panitia via QRIS."
        },
        {
          q: "Bagaimana jika pemain tidak bisa install Aplikasi Ayo Indonesia?",
          a: "Satu HP boleh digunakan untuk login beberapa akun secara bergantian. Panitia menyediakan Tim Helpdesk dan Wi-Fi Station di meja registrasi untuk membantu."
        },
        {
          q: "Apakah hadiah uang tunai bisa diminta cash?",
          a: "TIDAK BISA. Pencairan hadiah hanya dilakukan melalui transfer ke rekening Bank BJB. Pemenang yang belum memiliki rekening diharapkan untuk segera mempersiapkannya."
        },
        {
          q: "Apakah hadiah uang tunai sudah bersih dari pajak?",
          a: "Ya, nominal hadiah yang diterima pemenang adalah nominal bersih. Pajak hadiah ditanggung sepenuhnya oleh panitia penyelenggara."
        }
      ]
    },
    {
      category: "Etika & Kostum",
      items: [
        {
          q: "Apakah pasangan ganda wajib memakai jersey yang sama?",
          a: "Sangat disarankan demi estetika. Namun jika tidak, minimal TIDAK BOLEH memakai jersey dengan nama/logo tim lawan yang dapat membingungkan wasit."
        },
        {
          q: "Bolehkan memakai sepatu lari (Running Shoes)?",
          a: "DILARANG. Pemain wajib menggunakan sepatu khusus badminton/indoor (Non-marking Sole) untuk mencegah cedera dan menjaga kualitas karpet. Wasit berhak melarang pemain masuk jika sepatu tidak sesuai."
        },
        {
          q: "Bagaimana jika terjadi keributan fisik antar pemain?",
          a: "Panitia menerapkan kebijakan ZERO TOLERANCE. Siapapun yang memulai kontak fisik akan dikenakan KARTU HITAM (Diskualifikasi) dan timnya di-blacklist permanen dari turnamen BCC selanjutnya."
        }
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Header />
      <main className="flex-grow py-16 md:py-24 relative">
        <CourtLines />

        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4 ring-4 ring-primary/5">
                <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-headline text-foreground mb-4">
              KEPOIN BCC 2026
            </h1>
            <p className="text-lg text-muted-foreground">
              Semua yang perlu kamu tahu biar gak salah langkah. Baca baik-baik ya!
            </p>
          </div>

          <div className="space-y-12">
            {faqs.map((section, idx) => (
              <div key={idx}>
                <h3 className="text-2xl font-bold font-headline mb-6 text-primary border-l-4 border-primary pl-4">
                  {section.category}
                </h3>
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {section.items.map((item, itemIdx) => (
                    <AccordionItem 
                      key={itemIdx} 
                      value={`item-${idx}-${itemIdx}`}
                      className="bg-card border-l-4 border-transparent rounded-lg shadow-sm hover:border-primary/50 transition-colors duration-300 data-[state=open]:border-primary/80 data-[state=open]:shadow-md"
                    >
                      <AccordionTrigger className="text-left font-bold text-lg text-foreground p-6 hover:no-underline data-[state=open]:text-primary">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6 text-muted-foreground leading-relaxed">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}