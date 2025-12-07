"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { recruitmentSchema, type RecruitmentFormValues, DIVISIONS } from "@/lib/schemas/recruitment";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2, Briefcase, Calendar, Shirt, BrainCircuit, User, ShieldCheck, Target } from "lucide-react";
import { useState, useEffect } from "react";
import confetti from 'canvas-confetti';
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function RecruitmentPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<RecruitmentFormValues>({
    resolver: zodResolver(recruitmentSchema),
    defaultValues: {
      skills: [],
      equipment: [],
      availability: [],
    },
  });

  // Logic: Select All Dates
  const handleAvailabilityChange = (checked: boolean, value: string, field: any) => {
    const allDates = ["Week 1 (13-14 Juni)", "Week 2 (20-21 Juni)", "Week 3 (27-28 Juni)", "Grand Final (5 Juli)"];
    let newValues = [...(field.value || [])];

    if (value === "ALL") {
      newValues = checked ? [...allDates, "ALL"] : [];
    } else {
      if (checked) newValues.push(value);
      else newValues = newValues.filter((v) => v !== value);

      // Smart Check/Uncheck ALL
      const isAllDatesSelected = allDates.every(d => newValues.includes(d));
      if (newValues.includes("ALL") && !isAllDatesSelected) newValues = newValues.filter(v => v !== "ALL");
      if (isAllDatesSelected && !newValues.includes("ALL")) newValues.push("ALL");
    }
    field.onChange(newValues);
  };

  async function onSubmit(data: RecruitmentFormValues) {
    setIsSubmitting(true);
    console.log("Committee Data:", data); // Debug
    await new Promise((resolve) => setTimeout(resolve, 2500)); // Simulasi agak lama biar "serius"
    setIsSubmitting(false);
    setIsSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  useEffect(() => {
    if (isSuccess) {
      const end = Date.now() + 3000;
      const colors = ['#000000', '#9e1d24', '#ffffff']; // Hitam, Merah, Putih (Warna Official)
      (function frame() {
        confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors });
        confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors });
        if (Date.now() < end) requestAnimationFrame(frame);
      }());
    }
  }, [isSuccess]);

  // Error Toast
  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
        toast({ variant: "destructive", title: "Incomplete Data", description: "Mohon lengkapi semua data wajib." });
    }
  }, [form.formState.errors, toast]);

  if (isSuccess) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow flex items-center justify-center py-16 px-4 bg-grid-sporty">
          <Card className="max-w-xl w-full shadow-2xl border-t-8 border-t-primary text-center p-10 rounded-none border-b-8 border-b-black bg-white/95 backdrop-blur">
            <ShieldCheck className="w-24 h-24 text-primary mx-auto mb-6 animate-bounce" />
            <h1 className="text-4xl font-black font-headline text-primary mb-4 uppercase">Aplikasi Diterima</h1>
            <p className="text-lg text-muted-foreground mb-8 font-medium">
              Data Anda telah masuk ke sistem rekrutmen inti BCC 2026.<br/>
              Harap stand-by di WhatsApp untuk jadwal <strong>Interview Tahap 1</strong>.
            </p>
            <Button asChild className="rounded-none font-bold tracking-widest px-8">
              <Link href="/">KEMBALI KE MARKAS</Link>
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <Header />
      {/* BACKGROUND: Beda dengan Volunteer, disini pakai nuansa lebih gelap/cyber */}
      <main className="relative flex-grow py-12 px-4 md:px-8 bg-grid-sporty overflow-hidden">
        
        {/* Dekorasi: Glow Biru Gelap (Strategic) + Merah */}
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-slate-800/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto space-y-10">
          
          {/* HEADER: Lebih Formal & Tegas */}
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/5 px-4 py-2 rounded-sm mb-4 backdrop-blur-sm">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold tracking-widest uppercase text-primary">Core Team Recruitment</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black font-headline text-foreground uppercase tracking-tight">
              PANITIA <span className="text-primary underline decoration-4 decoration-primary/30 underline-offset-8">INTI</span> BCC 2026
            </h1>
            <p className="text-xl font-medium text-muted-foreground max-w-2xl mx-auto">
              Bukan sekadar relawan. Ini adalah panggilan untuk para perancang strategi dan eksekutor lapangan.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* LAYOUT: Menggunakan Grid 2 Kolom untuk Data Diri (Lebih padat/profesional) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* KOLOM KIRI: Informasi Utama */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* BAGIAN 1 */}
                    <Card className="rounded-xl border-l-4 border-l-primary shadow-lg hover:shadow-primary/10 transition-shadow">
                        <CardHeader className="bg-secondary/20 border-b p-6">
                            <CardTitle className="flex items-center gap-3 font-headline text-lg uppercase tracking-wide">
                                <User className="w-5 h-5 text-primary"/> Biodata Profesional
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormField control={form.control} name="fullName" render={({ field }) => (
                                    <FormItem><FormLabel>Nama Lengkap (Sesuai KTP)</FormLabel><FormControl><Input {...field} className="rounded-md h-11" /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="nickname" render={({ field }) => (
                                    <FormItem><FormLabel>Nama Panggilan</FormLabel><FormControl><Input {...field} className="rounded-md h-11" /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                 <FormField control={form.control} name="dob" render={({ field }) => (
                                    <FormItem><FormLabel>Tanggal Lahir</FormLabel><FormControl><Input type="date" {...field} className="rounded-md h-11" /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="gender" render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel>Jenis Kelamin</FormLabel>
                                        <FormControl>
                                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                                                {["Laki-laki", "Perempuan"].map(g => (
                                                    <FormItem key={g} className="flex items-center space-x-2"><FormControl><RadioGroupItem value={g} /></FormControl><FormLabel className="font-normal">{g}</FormLabel></FormItem>
                                                ))}
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormField control={form.control} name="whatsapp" render={({ field }) => (
                                    <FormItem><FormLabel>WhatsApp</FormLabel><FormControl><Input type="tel" {...field} className="rounded-md h-11" /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="email" render={({ field }) => (
                                    <FormItem><FormLabel>Email Profesional</FormLabel><FormControl><Input type="email" {...field} className="rounded-md h-11" /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                             <FormField control={form.control} name="address" render={({ field }) => (
                                <FormItem><FormLabel>Alamat Domisili</FormLabel><FormControl><Textarea {...field} rows={2} className="rounded-md resize-none" /></FormControl><FormMessage /></FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    {/* BAGIAN 2: Pendidikan & Keahlian */}
                    <Card className="rounded-xl border-l-4 border-l-primary shadow-lg">
                        <CardHeader className="bg-secondary/20 border-b p-6">
                            <CardTitle className="flex items-center gap-3 font-headline text-lg uppercase tracking-wide">
                                <BrainCircuit className="w-5 h-5 text-primary"/> Kompetensi
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormField control={form.control} name="education" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Pendidikan Terakhir</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger className="h-11 rounded-md"><SelectValue placeholder="Pilih..." /></SelectTrigger></FormControl>
                                            <SelectContent><SelectItem value="SMA/SMK">SMA/SMK</SelectItem><SelectItem value="D3/D4">Diploma</SelectItem><SelectItem value="S1">Sarjana</SelectItem><SelectItem value="S2/S3">Pascasarjana</SelectItem></SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="major" render={({ field }) => (
                                    <FormItem><FormLabel>Jurusan / Bidang Studi</FormLabel><FormControl><Input {...field} className="rounded-md h-11" /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                             <FormField control={form.control} name="status" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status Saat Ini</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger className="h-11 rounded-md"><SelectValue placeholder="Pilih..." /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            {["Mahasiswa", "Karyawan / Profesional", "Wirausaha", "Fresh Graduate"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                             <FormField control={form.control} name="skills" render={() => (
                                <FormItem>
                                    <FormLabel className="mb-3 block">Hard Skills (Pilih yang dikuasai)</FormLabel>
                                    <div className="grid grid-cols-2 gap-3">
                                        {["Project Management", "Financial Planning", "Graphic Design", "Video Editing", "Public Speaking", "Medical/P3K", "Badminton Rules (BWF)", "Web/IT Dev"].map((item) => (
                                            <FormField key={item} control={form.control} name="skills" render={({ field }) => (
                                                <FormItem className="flex flex-row items-center space-x-2 border p-2 rounded-md hover:bg-secondary/50">
                                                    <FormControl><Checkbox checked={field.value?.includes(item)} onCheckedChange={(checked) => checked ? field.onChange([...(field.value||[]), item]) : field.onChange(field.value?.filter(v => v !== item))} /></FormControl>
                                                    <FormLabel className="font-normal cursor-pointer text-sm w-full">{item}</FormLabel>
                                                </FormItem>
                                            )} />
                                        ))}
                                    </div>
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>

                     {/* BAGIAN 3: STUDI KASUS (Full Width) */}
                    <Card className="rounded-xl border-l-4 border-l-primary shadow-lg bg-secondary/5">
                        <CardHeader className="bg-secondary/20 border-b p-6">
                            <CardTitle className="flex items-center gap-3 font-headline text-lg uppercase tracking-wide text-red-700">
                                <Target className="w-5 h-5"/> Challange: Problem Solving
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <FormField control={form.control} name="caseStudy1" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">Kasus 1: Integritas</FormLabel>
                                    <p className="text-sm text-muted-foreground mb-2">Anda menemukan teman sesama panitia membiarkan temannya masuk tanpa tiket. Teguran lisan sudah diabaikan. Apa tindakan Anda selanjutnya?</p>
                                    <FormControl><Textarea {...field} className="bg-white" placeholder="Jelaskan analisa dan tindakan Anda..." /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                             <FormField control={form.control} name="caseStudy2" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">Kasus 2: Pressure</FormLabel>
                                    <p className="text-sm text-muted-foreground mb-2">Jadwal pertandingan molor 2 jam karena mati lampu. Peserta mulai protes keras ke meja panitia. Sebagai penanggung jawab, apa yang Anda lakukan?</p>
                                    <FormControl><Textarea {...field} className="bg-white" placeholder="Solusi konkret Anda..." /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>

                </div>

                {/* KOLOM KANAN: Divisi & Komitmen (Sticky) */}
                <div className="space-y-8">
                    
                    {/* DIVISI */}
                    <Card className="rounded-xl border-t-4 border-t-primary shadow-xl sticky top-4">
                        <CardHeader className="p-6 pb-2">
                             <CardTitle className="font-headline text-lg uppercase">Plotting Divisi</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-5">
                            <FormField control={form.control} name="division1" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-primary font-bold">Pilihan Utama</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger className="h-12 bg-primary/5 border-primary/30 font-semibold"><SelectValue placeholder="Pilih Divisi" /></SelectTrigger></FormControl>
                                        <SelectContent>{DIVISIONS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="division2" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pilihan Cadangan</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger className="h-12"><SelectValue placeholder="Pilih Divisi" /></SelectTrigger></FormControl>
                                        <SelectContent>{DIVISIONS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            
                            <div className="py-4 border-t border-dashed space-y-4">
                                <FormField control={form.control} name="hasExperience" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Pengalaman Panitia?</FormLabel>
                                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Ya" /></FormControl><FormLabel>Ya (Expert)</FormLabel></FormItem>
                                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Tidak" /></FormControl><FormLabel>Tidak (New)</FormLabel></FormItem>
                                        </RadioGroup>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                {form.watch("hasExperience") === "Ya" && (
                                    <FormField control={form.control} name="experienceDetail" render={({ field }) => (
                                        <FormItem><FormControl><Input {...field} placeholder="Event apa & posisi apa?" className="text-sm" /></FormControl><FormMessage /></FormItem>
                                    )} />
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* KOMITMEN */}
                    <Card className="rounded-xl bg-slate-900 text-white shadow-xl">
                        <CardHeader className="p-6 pb-2 border-b border-white/10">
                            <CardTitle className="font-headline text-lg uppercase flex items-center gap-2"><Calendar className="w-5 h-5"/> Komitmen</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-5">
                             <FormField control={form.control} name="availability" render={() => (
                                <FormItem>
                                    <FormLabel className="text-gray-300">Jadwal Bertugas (Wajib)</FormLabel>
                                    <div className="space-y-2 mt-2">
                                        {["Week 1 (13-14 Juni)", "Week 2 (20-21 Juni)", "Week 3 (27-28 Juni)", "Grand Final (5 Juli)", "ALL"].map((item) => (
                                            <FormField key={item} control={form.control} name="availability" render={({ field }) => (
                                                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                                    <FormControl><Checkbox className="border-white/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary" checked={field.value?.includes(item)} onCheckedChange={(c) => handleAvailabilityChange(!!c, item, field)} /></FormControl>
                                                    <FormLabel className={`font-normal cursor-pointer text-sm ${item === "ALL" ? "font-bold text-primary" : "text-gray-300"}`}>{item === "ALL" ? "SIAP SEMUA TANGGAL" : item}</FormLabel>
                                                </FormItem>
                                            )} />
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="attendBriefing" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-300">Wajib Technical Meeting (Mei)</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger className="bg-white/10 border-white/10 text-white"><SelectValue placeholder="Konfirmasi..." /></SelectTrigger></FormControl>
                                        <SelectContent><SelectItem value="Ya">Saya Siap Hadir</SelectItem><SelectItem value="Tidak">Tidak Bisa</SelectItem></SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="shirtSize" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-300 flex items-center gap-2"><Shirt className="w-4 h-4"/> Ukuran Jersey</FormLabel>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {["S", "M", "L", "XL", "2XL", "3XL"].map((s) => (
                                            <div key={s} onClick={() => field.onChange(s)} 
                                            className={`cursor-pointer w-8 h-8 flex items-center justify-center rounded text-xs font-bold border transition-all ${field.value === s ? "bg-primary border-primary text-white" : "border-white/20 text-gray-400 hover:border-white"}`}>
                                                {s}
                                            </div>
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>
                    
                    {/* PERNYATAAN */}
                    <Card>
                        <CardHeader className="p-4"><CardTitle className="text-sm">Pernyataan Integritas</CardTitle></CardHeader>
                        <CardContent className="p-4 pt-0 space-y-3">
                             {["agreeData", "agreeRules", "agreeCompetitive"].map((item, index) => (
                                <FormField key={item} control={form.control} name={item as any} render={({ field }) => (
                                    <FormItem className="flex items-start space-x-2 space-y-0">
                                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                        <FormLabel className="font-normal text-xs text-muted-foreground">
                                           {index === 0 && "Saya menyatakan data di atas adalah benar."}
                                           {index === 1 && "Saya bersedia mematuhi SOP panitia."}
                                           {index === 2 && "Saya memahami seleksi ini kompetitif."}
                                        </FormLabel>
                                    </FormItem>
                                )} />
                            ))}
                        </CardContent>
                    </Card>

                    {/* SUBMIT */}
                    <Button type="submit" size="lg" className="w-full h-14 font-headline font-black text-lg uppercase rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform" disabled={isSubmitting}>
                         {isSubmitting ? <Loader2 className="animate-spin"/> : "KIRIM APLIKASI"}
                    </Button>

                </div>
              </div>

            </form>
          </Form>
        </div>
      </main>
      <Footer />
    </div>
  );
}