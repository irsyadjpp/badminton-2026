"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationFormSchema, type RegistrationFormValues } from "@/lib/schemas/registration";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Info, AlertTriangle, CheckCircle2, Instagram, ChevronsUpDown } from "lucide-react";
import { useState, useEffect } from "react";
import confetti from 'canvas-confetti';
import Link from "next/link";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CourtLines } from "@/components/ui/court-lines";

export default function RegistrationPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedTeamName, setSubmittedTeamName] = useState("");

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      teamName: "",
      managerName: "",
      managerWhatsapp: "",
      managerEmail: "",
      basecamp: "",
      instagram: "",
      players: Array(10).fill({
        fullName: "",
        nik: "",
        motherName: "",
        ayoId: "",
        level: undefined,
        videoUrl: "",
      }),
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "players",
    control: form.control,
  });

  const playerCount = fields.length;
  const registrationFee = 100000;
  const totalFee = playerCount * registrationFee;

  // Efek Confetti saat Sukses
  useEffect(() => {
    if (isSuccess) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    }
  }, [isSuccess]);

  async function onSubmit(data: RegistrationFormValues) {
    setIsSubmitting(true);
    
    console.log("Form Data Submitted:", data);
    
    await new Promise((resolve) => setTimeout(resolve, 2000)); 

    setIsSubmitting(false);
    setSubmittedTeamName(data.teamName);
    setIsSuccess(true);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow flex items-center justify-center py-16 px-4 bg-secondary/30 relative overflow-hidden">
          <CourtLines />
          <Card className="max-w-2xl w-full shadow-2xl border-t-8 border-t-green-500 animate-in fade-in zoom-in-95 duration-700 relative z-10">
            <CardContent className="pt-10 pb-10 px-8 text-center space-y-8">
              
              <div className="mx-auto bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-sm ring-4 ring-green-500/20">
                <CheckCircle2 className="w-12 h-12 text-green-600 animate-in zoom-in-50 delay-300 duration-500" />
              </div>

              <div>
                <h1 className="text-3xl font-black font-headline text-green-700 mb-2">
                  Terima Kasih telah mendaftar di BCC 2026!
                </h1>
                <p className="text-lg text-muted-foreground">
                  Data tim <span className="font-bold text-foreground">{submittedTeamName}</span> telah kami terima.
                </p>
              </div>

              <div className="bg-secondary/30 rounded-xl p-6 text-left space-y-4 border border-border">
                <h3 className="font-bold text-lg text-primary border-b pb-2 mb-4">Langkah Selanjutnya:</h3>
                
                <div className="flex gap-4">
                  <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-sm font-bold text-primary">1</div>
                  <div>
                    <h4 className="font-bold text-foreground">Verifikasi Keuangan</h4>
                    <p className="text-sm text-muted-foreground">Bendahara kami akan mengecek bukti transfer Anda dalam waktu <strong>1x24 jam</strong>.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-sm font-bold text-primary">2</div>
                  <div>
                    <h4 className="font-bold text-foreground">Verifikasi TPF</h4>
                    <p className="text-sm text-muted-foreground">Tim Pencari Fakta akan menonton video pemain Anda. Hasil verifikasi level akan dikirimkan via WhatsApp/Email ke Manajer Tim dalam <strong>3-7 hari kerja</strong>.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-sm font-bold text-primary">3</div>
                  <div>
                    <h4 className="font-bold text-foreground">Join Grup</h4>
                    <p className="text-sm text-muted-foreground">Jika pembayaran lunas & data valid, nomor WhatsApp Manajer akan diundang ke <strong>WAG Official Captain BCC 2026</strong>.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <Button asChild variant="outline" className="gap-2">
                  <Link href="https://instagram.com/bccbandung.id" target="_blank">
                    <Instagram className="w-4 h-4" />
                    Pantau update di @bccbandung.id
                  </Link>
                </Button>
                <p className="text-sm font-medium text-muted-foreground">
                  Salam Sportivitas,<br/>
                  <strong>Panitia BCC 2026</strong>
                </p>
              </div>

              <Button onClick={() => window.location.reload()} variant="ghost" className="text-muted-foreground">
                Kembali ke Halaman Utama
              </Button>

            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className="flex-grow py-12 px-4 md:px-8 bg-gradient-to-b from-secondary/10 to-secondary/40 relative">
        <CourtLines />
        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          
          <div className="text-center space-y-4 mb-10">
            <h1 className="text-3xl md:text-4xl font-black font-headline text-primary">REGISTRASI TIM - BCC 2026</h1>
            <Card className="bg-blue-50/80 backdrop-blur-sm border-blue-200 text-left">
              <CardContent className="p-6 text-sm text-blue-900 space-y-2">
                <p className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Info className="w-5 h-5" /> Penting Dibaca:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Data digunakan untuk verifikasi TPF, BPJS Ketenagakerjaan, dan database Ayo Indonesia.</li>
                  <li><strong>Wajib Video Uncut:</strong> 1 Game Full untuk setiap pemain.</li>
                  <li><strong>Biaya Pendaftaran:</strong> Rp 100.000,- per Orang.</li>
                  <li><strong>Deadline:</strong> 30 Mei 2026.</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* BAGIAN 1: IDENTITAS TIM */}
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader className="bg-primary/5 border-b">
                  <CardTitle className="text-xl font-headline text-primary">BAGIAN 1: IDENTITAS TIM</CardTitle>
                  <CardDescription>Informasi umum mengenai tim dan manajer.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <FormField
                    control={form.control}
                    name="teamName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Tim / Komunitas</FormLabel>
                        <FormControl>
                          <Input placeholder="Contoh: PB Smash Bandung" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Kategori yang Diikuti</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col md:flex-row gap-4"
                          >
                            {["Beregu PUTRA", "Beregu PUTRI", "Beregu CAMPURAN"].map((item) => (
                              <FormItem key={item} className="flex items-center space-x-3 space-y-0 border p-4 rounded-md cursor-pointer hover:bg-secondary/50 bg-card">
                                <FormControl>
                                  <RadioGroupItem value={item} />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {item}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormDescription>Jika ikut lebih dari 1 kategori, silakan isi formulir baru setelah ini.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="managerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Manajer / Kapten</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="managerWhatsapp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>No. WhatsApp Manajer</FormLabel>
                          <FormControl><Input type="tel" placeholder="08..." {...field} /></FormControl>
                          <FormDescription>Pastikan aktif untuk Grup Kapten.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="managerEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Manajer</FormLabel>
                          <FormControl><Input type="email" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="instagram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instagram Komunitas (Opsional)</FormLabel>
                          <FormControl><Input placeholder="@nama_pb" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="basecamp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Domisili / Basecamp</FormLabel>
                        <FormControl><Input placeholder="Contoh: GOR Saparua, Bandung" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* BAGIAN 2: DATA PEMAIN */}
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader className="bg-primary/5 border-b">
                  <CardTitle className="text-xl font-headline text-primary">BAGIAN 2: DATA PEMAIN (ROSTER)</CardTitle>
                  <CardDescription>
                    Minimal 10 pemain, Maksimal 14 pemain. <br/>
                    <span className="text-destructive font-semibold">*NIK & Nama Ibu Kandung WAJIB valid untuk klaim asuransi BPJS TK.</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {fields.map((field, index) => (
                    <Collapsible key={field.id} defaultOpen={index < 3} className="border rounded-xl bg-card/80 shadow-sm transition-all has-[[data-state=open]]:bg-secondary/20">
                      <div className="flex items-center justify-between p-4">
                        <CollapsibleTrigger className="flex items-center gap-3 text-left w-full">
                          <ChevronsUpDown className="h-5 w-5 text-muted-foreground transition-transform data-[state=open]:rotate-180" />
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-primary">Data Pemain #{index + 1}</h4>
                            <span className="text-sm text-muted-foreground">{form.getValues(`players.${index}.fullName`) || 'Belum diisi'}</span>
                          </div>
                        </CollapsibleTrigger>
                         {index >= 10 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <CollapsibleContent className="p-6 pt-0 space-y-6 animate-in fade-in-0 zoom-in-95">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name={`players.${index}.fullName`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nama Lengkap (Sesuai KTP)</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`players.${index}.nik`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>NIK (16 Digit KTP)</FormLabel>
                                <FormControl><Input maxLength={16} {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`players.${index}.motherName`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nama Ibu Kandung</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormDescription className="text-xs">Syarat wajib BPJS TK.</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`players.${index}.ayoId`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Username Ayo Indonesia</FormLabel>
                                <FormControl><Input placeholder="@username" {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`players.${index}.level`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Level Didaftarkan</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Pilih Level" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                    <SelectItem value="Advance">Advance</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`players.${index}.videoUrl`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Link Video YouTube</FormLabel>
                                <FormControl><Input placeholder="https://youtube.com/..." {...field} /></FormControl>
                                <FormDescription className="text-xs">Full game, uncut, angle belakang.</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}

                  {fields.length < 14 && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-dashed border-2 py-8 text-muted-foreground hover:text-primary hover:border-primary bg-transparent"
                      onClick={() => append({ 
                        fullName: "", nik: "", motherName: "", ayoId: "", level: undefined as any, videoUrl: "" 
                      })}
                    >
                      <Plus className="w-5 h-5 mr-2" /> Tambah Pemain Cadangan (Maksimal 14)
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* BAGIAN 3: PEMBAYARAN */}
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader className="bg-primary/5 border-b">
                  <CardTitle className="text-xl font-headline text-primary">BAGIAN 3: ADMINISTRASI & PEMBAYARAN</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="bg-yellow-100/80 border border-yellow-200 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                         <h4 className="font-bold text-yellow-900">Total Pembayaran</h4>
                         <div className="text-right">
                           <p className="text-2xl font-black text-yellow-900 font-mono">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalFee)}
                           </p>
                           <p className="text-xs text-yellow-800 font-medium">({playerCount} pemain x Rp 100.000)</p>
                         </div>
                    </div>
                    <div className="text-sm text-yellow-800 space-y-2 border-t border-yellow-300 pt-4">
                      <p className="font-bold">Instruksi Transfer:</p>
                      <p>Silakan transfer ke <strong>Bank BJB</strong> No. Rek: <strong>0123-4567-8900</strong> a.n Panitia BCC 2026.</p>
                      <p>Untuk verifikasi, tambahkan <strong>3 digit terakhir No. HP Manajer</strong> pada nominal. Contoh: Rp {new Intl.NumberFormat('id-ID').format(totalFee)}.<strong>123</strong></p>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="transferProof"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel>Upload Bukti Transfer</FormLabel>
                        <FormControl>
                          <Input
                            {...fieldProps}
                            type="file"
                            accept="image/*, application/pdf"
                            onChange={(event) => {
                              onChange(event.target.files);
                            }}
                          />
                        </FormControl>
                        <FormDescription>Format: JPG/PNG/PDF. Max 5MB.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* BAGIAN 4: PERNYATAAN LEGAL */}
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader className="bg-primary/5 border-b">
                  <CardTitle className="text-xl font-headline text-primary">BAGIAN 4: PERNYATAAN LEGAL</CardTitle>
                  <CardDescription>Harap baca dan centang semua poin di bawah ini.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {[
                    { id: "agreementValidData", label: "DATA VALID: Seluruh data yang saya isikan (Nama, NIK, Level) adalah benar. Tidak ada joki/pemalsuan." },
                    { id: "agreementWaiver", label: "WAIVER OF LIABILITY: Kami membebaskan Panitia BCC 2026 dari tuntutan hukum atas cedera fisik yang terjadi selama turnamen." },
                    { id: "agreementTpf", label: "KEPUTUSAN TPF: Saya menerima keputusan mutlak TPF terkait penentuan level pemain (Lolos/Upgrade/Reject)." },
                    { id: "agreementRules", label: "ATURAN MAIN: Saya telah memahami Technical Handbook BCC 2026 (termasuk sistem Skor 30 & aturan WO)." }
                  ].map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name={item.id as any}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm hover:bg-secondary/50 bg-card">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-normal cursor-pointer leading-relaxed">
                              {item.label}
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  ))}
                  
                  {Object.keys(form.formState.errors).filter(k => k.startsWith('agreement')).length > 0 && (
                     <p className="text-destructive text-sm font-medium">Anda wajib menyetujui semua pernyataan di atas.</p>
                  )}

                </CardContent>
              </Card>

              <div className="flex justify-end pt-6">
                <Button type="submit" size="lg" className="w-full md:w-auto text-lg px-8 py-6 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-1 transform" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Mengirim Data...
                    </>
                  ) : (
                    "KIRIM PENDAFTARAN TIM"
                  )}
                </Button>
              </div>

            </form>
          </Form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
