import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LocationSection() {
  return (
    <section id="venue" className="py-16 bg-background md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-0 items-center rounded-2xl overflow-hidden border bg-card shadow-sm">
            {/* Bagian Kiri: Info Teks */}
            <div className="w-full md:w-1/3 p-8">
                <div className="flex items-center gap-2 text-primary mb-4">
                    <MapPin className="w-6 h-6" />
                    <span className="font-bold tracking-wider uppercase">Official Venue</span>
                </div>
                <h2 className="text-3xl font-black font-headline mb-4">GOR KONI Bandung</h2>
                <p className="text-muted-foreground mb-6">
                    Jl. Jakarta No.18, Kebonwaru, Kec. Batununggal, Kota Bandung, Jawa Barat 40272
                </p>
                <Button variant="outline" asChild className="w-full">
                    <Link href="https://maps.app.goo.gl/tZ22aG6o2mZpA5p18" target="_blank">
                        Buka di Google Maps
                    </Link>
                </Button>
            </div>

            {/* Bagian Kanan: Map Embed */}
            <div className="w-full md:w-2/3 h-64 md:h-96 bg-muted relative">
                 <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.835376082724!2d107.63972231530936!3d-6.91027779500735!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e7b99c000001%3A0x1234567890abcdef!2sGor%20Koni%20Bandung!5e0!3m2!1sen!2sid!4v1624500000000"
                    width="100%" 
                    height="100%" 
                    style={{border:0}} 
                    allowFullScreen 
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-500"
                ></iframe>
            </div>
        </div>
      </div>
    </section>
  );
}
