
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { volunteerSchema, type VolunteerFormValues, VOLUNTEER_DIVISIONS } from "@/lib/schemas/volunteer";
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
import { Loader2, User, GraduationCap, Briefcase, Wrench, CalendarCheck, FileSignature, HeartHandshake, Shirt } from "lucide-react";
import { useState, useEffect } from "react";
import confetti from 'canvas-confetti';
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function VolunteerPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<VolunteerFormValues>({
    resolver: zodResolver(volunteerSchema),
    defaultValues: {
      skills: [],
      availability: [],
      agreeData: undefined, // Harus undefined/false agar checkbox validation jalan
    },
  });

  // Logic Khusus: "SAYA SIAP SEMUA TANGGAL"
  const handleAvailabilityChange = (checked: boolean, value: string, field: any) => {
    const allDates = ["Week 1 (13-14 Juni)", "Week 2 (20-21 Juni)", "Week 3 (27-28 Juni)", "Grand Final (5 Juli) - WAJIB"];
    let newValues = [...(field.value || [])];

    if (value === "ALL") {
      if (checked) {
        newValues = [...allDates, "ALL"];
      } else {
        newValues = [];
      }
    } else {
      if (checked) {
        newValues.push(value);
      } else {
        newValues = newValues.filter((v) => v !== value);
      }
      
      // Uncheck "ALL" if any date is unchecked
      if (newValues.includes("ALL") && !allDates.every(date => newValues.includes(date))) {
         newValues = newValues.filter((v) => v !== "ALL");
      }

      // Check "ALL" if all other dates are checked
      const isAllDatesSelected = allDates.every(date => newValues.includes(date));
      if (isAllDatesSelected && !newValues.includes("ALL")) {
          newValues.push("ALL");
      }
    }
    field.onChange(newValues);
  };

  async function onSubmit(data: VolunteerFormValues) {
    setIsSubmitting(true);
    console.log("Volunteer Valid Data:", data);
    
    // Simulasi Delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  useEffect(() => {
    if (isSuccess) {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#9e1d24', '#ffffff'] // Merah & Putih
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#9e1d24', '#ffffff']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isSuccess]);

  // Handle Validation Errors untuk debugging
  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
        console.log("Form Errors:", form.formState.errors);
        toast({
            variant: "destructive",
            title: "Cek Kembali Form Anda",
            description: "Masih ada isian yang kosong atau tidak valid.",
        });
    }
  }, [form.formState.errors, toast]);


  if (isSuccess) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow flex items-center justify-center py-16 px-4 bg-noise">
          <Card className="max-w-2xl w-full shadow-2xl border-t-8 border-t-primary text-center p-12 rounded-3xl animate-fade-in-up">
            <HeartHandshake className="w-24 h-24 text-primary mx-auto mb-6 animate-pulse" />
            <h1 className="text-4xl font-black font-headline text-primary mb-4 uppercase tracking-tight">Terima Kasih, Champ!</h1>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed font-body">
              Aplikasi kamu sudah masuk ke database kami. <br/>
              Dedikasi kamu adalah bahan bakar turnamen ini.<br/><br/>
              Pantau terus <strong>WhatsApp</strong> kamu dalam 7-14 hari ke depan untuk jadwal wawancara.
            </p>
            <Button asChild variant="default" size="lg" className="rounded-full px-10 h-14 text-lg font-bold shadow-lg hover:shadow-primary/50 transition-all">
              <Link href="/">Kembali ke Arena</Link>
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
      <main className="flex-grow py-12 px-4 md:px-8 bg-noise">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* HEADER SECTION */}
          <div className="text-center space-y-4 mb-12 animate-fade-in-down">
            <Badge variant="outline" className="border-primary text-primary px-4 py-1 text-sm mb-2 font-bold tracking-widest uppercase bg-primary/5">
              Open Recruitment Phase 1
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black font-headline text-foreground tracking-tighter">
              VOLUNTEER <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-red-600">BCC 2026</span>
            </h1>
            <p className="text-xl font-medium text-muted-foreground max-w-2xl mx-auto">
              "Jadilah bagian dari sejarah turnamen komunitas terbesar di Bandung."
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 max-w-3xl mx-auto">
                <Card className="bg-card/50 backdrop-blur border-l-4 border-l-primary shadow-none">
                    <CardContent className="p-4 flex items-center gap-4 text-left">
                        <div className="p-3 bg-primary/10 rounded-full"><CalendarCheck className="w-6 h-6 text-primary"/></div>
                        <div>
                            <h4 className="font-bold font-headline">Waktu Bertugas</h4>
                            <p className="text-sm text-muted-foreground">Sabtu & Minggu (Juni - Juli 2026)</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur border-l-4 border-l-primary shadow-none">
                    <CardContent className="p-4 flex items-center gap-4 text-left">
                        <div className="p-3 bg-primary/10 rounded-full"><Briefcase className="w-6 h-6 text-primary"/></div>
                        <div>
                            <h4 className="font-bold font-headline">Benefit Utama</h4>
                            <p className="text-sm text-muted-foreground">Honor, Jersey, Sertifikat, Network</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* BAGIAN 1: DATA PRIBADI */}
              <Card className="rounded-3xl border-2 border-border/50 shadow-xl overflow-hidden group hover:border-primary/30 transition-colors">
                <CardHeader className="bg-secondary/30 border-b p-6">
                    <CardTitle className="flex items-center gap-3 font-headline text-xl">
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">1</div>
                        Data Pribadi
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="fullName" render={({ field }) => (
                            <FormItem><FormLabel>Nama Lengkap (Sesuai KTP)</FormLabel><FormControl><Input placeholder="Isi nama lengkap..." className="h-12 rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="nickname" render={({ field }) => (
                            <FormItem><FormLabel>Nama Panggilan</FormLabel><FormControl><Input placeholder="Nama sapaan..." className="h-12 rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="dob" render={({ field }) => (
                            <FormItem><FormLabel>Tanggal Lahir</FormLabel><FormControl><Input type="date" className="h-12 rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="gender" render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>Jenis Kelamin</FormLabel>
                                <FormControl>
                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                                        {['Laki-laki', 'Perempuan'].map((g) => (
                                             <FormItem key={g} className="flex items-center space-x-2 border rounded-xl p-3 px-4 hover:bg-secondary cursor-pointer transition-colors">
                                                <FormControl><RadioGroupItem value={g} /></FormControl>
                                                <FormLabel className="font-normal cursor-pointer">{g}</FormLabel>
                                            </FormItem>
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                     {/* TAMBAHAN: UKURAN BAJU */}
                     <FormField control={form.control} name="shirtSize" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2"><Shirt className="w-4 h-4"/> Ukuran Jersey (Unisex)</FormLabel>
                            <div className="flex flex-wrap gap-2">
                                {["S", "M", "L", "XL", "XXL", "XXXL"].map((size) => (
                                    <div key={size} onClick={() => field.onChange(size)} 
                                        className={`cursor-pointer px-4 py-2 rounded-lg border-2 font-bold transition-all 
                                        ${field.value === size ? "bg-primary text-white border-primary shadow-lg scale-105" : "bg-transparent border-input hover:border-primary/50"}`}>
                                        {size}
                                    </div>
                                ))}
                            </div>
                            <FormMessage className="mt-2" />
                        </FormItem>
                    )} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <FormField control={form.control} name="whatsapp" render={({ field }) => (
                            <FormItem><FormLabel>Nomor WhatsApp Aktif</FormLabel><FormControl><Input type="tel" className="h-12 rounded-xl" {...field} /></FormControl><FormDescription>Pastikan nomor ini terhubung dengan WA.</FormDescription><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem><FormLabel>Alamat Email</FormLabel><FormControl><Input type="email" className="h-12 rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                    <FormField control={form.control} name="address" render={({ field }) => (
                        <FormItem><FormLabel>Alamat Domisili di Bandung</FormLabel><FormControl><Textarea placeholder="Sebutkan Kecamatan & Kelurahan." className="rounded-xl resize-none" rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="instagram" render={({ field }) => (
                        <FormItem><FormLabel>Username Instagram</FormLabel><FormControl><Input placeholder="@username (Jangan diprivate)" className="h-12 rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </CardContent>
              </Card>

              {/* BAGIAN 2: LATAR BELAKANG */}
              <Card className="rounded-3xl border-2 border-border/50 shadow-xl overflow-hidden group hover:border-primary/30 transition-colors">
                <CardHeader className="bg-secondary/30 border-b p-6">
                    <CardTitle className="flex items-center gap-3 font-headline text-xl">
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">2</div>
                        Latar Belakang
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="education" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pendidikan Terakhir</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Pilih Jenjang" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="SMA/SMK">SMA / SMK / Sederajat</SelectItem>
                                        <SelectItem value="Diploma">Diploma (D3 / D4)</SelectItem>
                                        <SelectItem value="S1">Sarjana (S1)</SelectItem>
                                        <SelectItem value="Pascasarjana">Pascasarjana</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                         <FormField control={form.control} name="institution" render={({ field }) => (
                            <FormItem><FormLabel>Nama Institusi / Sekolah</FormLabel><FormControl><Input placeholder="Contoh: ITB, UNPAD, SMAN 3..." className="h-12 rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                     </div>
                     <FormField control={form.control} name="major" render={({ field }) => (
                        <FormItem><FormLabel>Jurusan / Prodi</FormLabel><FormControl><Input placeholder="Contoh: Manajemen, DKV..." className="h-12 rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    
                    <FormField control={form.control} name="status" render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Status Saat Ini</FormLabel>
                            <FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {["Mahasiswa / Pelajar", "Belum Bekerja / Fresh Graduate", "Karyawan / Profesional", "Freelancer"].map((item) => (
                                        <FormItem key={item} className="flex items-center space-x-3 space-y-0 border-2 border-transparent bg-secondary/30 p-4 rounded-xl hover:bg-secondary hover:border-primary/20 transition-all [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5">
                                            <FormControl><RadioGroupItem value={item} /></FormControl>
                                            <FormLabel className="font-semibold cursor-pointer w-full text-foreground">{item}</FormLabel>
                                        </FormItem>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="expertise" render={({ field }) => (
                        <FormItem><FormLabel>Bidang Keahlian Utama</FormLabel><FormControl><Input placeholder="Contoh: Desain Grafis, Medis, Networking..." className="h-12 rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </CardContent>
              </Card>

              {/* BAGIAN 3: POSISI */}
              <Card className="rounded-3xl border-2 border-border/50 shadow-xl overflow-hidden group hover:border-primary/30 transition-colors">
                <CardHeader className="bg-secondary/30 border-b p-6">
                    <CardTitle className="flex items-center gap-3 font-headline text-xl">
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">3</div>
                        Posisi & Minat
                    </CardTitle>
                    <CardDescription className="ml-14">Pastikan Divisi 1 dan Divisi 2 berbeda.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <FormField control={form.control} name="division1" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-primary font-bold">Pilihan 1 (Prioritas)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger className="h-14 rounded-xl font-bold bg-primary/5 border-primary/20"><SelectValue placeholder="Pilih Divisi Utama" /></SelectTrigger></FormControl>
                                    <SelectContent>{VOLUNTEER_DIVISIONS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="division2" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pilihan 2 (Cadangan)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger className="h-14 rounded-xl"><SelectValue placeholder="Pilih Divisi Cadangan" /></SelectTrigger></FormControl>
                                    <SelectContent>{VOLUNTEER_DIVISIONS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                </CardContent>
              </Card>

              {/* BAGIAN 4: SKILL */}
              <Card className="rounded-3xl border-2 border-border/50 shadow-xl overflow-hidden group hover:border-primary/30 transition-colors">
                 <CardHeader className="bg-secondary/30 border-b p-6">
                    <CardTitle className="flex items-center gap-3 font-headline text-xl">
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">4</div>
                        Keahlian & Aset
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                    <FormField control={form.control} name="experience" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Pengalaman Organisasi / Event (Khususnya Olahraga)</FormLabel>
                            <FormControl><Textarea {...field} rows={5} className="rounded-xl leading-relaxed" placeholder="Ceritakan dengan detail: Nama Event, Tahun, Posisi, dan Jobdesc singkat..." /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    
                    <FormField control={form.control} name="skills" render={() => (
                        <FormItem>
                            <div className="mb-4"><FormLabel>Hard Skill Pendukung (Boleh pilih lebih dari satu)</FormLabel></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {["Fotografi/Videografi (Punya Kamera)", "Desain Grafis (Canva/Adobe)", "Public Speaking/MC", "Microsoft Office/Excel (Advanced)", "P3K/Fisioterapi Dasar", "Instalasi Jaringan/IT", "Setir Mobil (SIM A)"].map((item) => (
                                    <FormField key={item} control={form.control} name="skills" render={({ field }) => (
                                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 border p-3 rounded-lg hover:bg-secondary transition-colors">
                                            <FormControl>
                                                <Checkbox checked={field.value?.includes(item)} onCheckedChange={(checked) => checked ? field.onChange([...(field.value || []), item]) : field.onChange((field.value || []).filter((v) => v !== item))} />
                                            </FormControl>
                                            <FormLabel className="font-normal cursor-pointer w-full py-1">{item}</FormLabel>
                                        </FormItem>
                                    )} />
                                ))}
                            </div>
                        </FormItem>
                    )} />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="hasVehicle" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Punya Motor?</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Pilih" /></SelectTrigger></FormControl>
                                    <SelectContent><SelectItem value="Ya">Ya</SelectItem><SelectItem value="Tidak">Tidak</SelectItem></SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="hasLaptop" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Punya Laptop?</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Pilih" /></SelectTrigger></FormControl>
                                    <SelectContent><SelectItem value="Ya">Ya</SelectItem><SelectItem value="Tidak">Tidak</SelectItem></SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                </CardContent>
              </Card>

               {/* BAGIAN 5: KOMITMEN */}
               <Card className="rounded-3xl border-2 border-border/50 shadow-xl overflow-hidden group hover:border-primary/30 transition-colors">
                 <CardHeader className="bg-secondary/30 border-b p-6">
                    <CardTitle className="flex items-center gap-3 font-headline text-xl">
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">5</div>
                        Komitmen & Studi Kasus
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                     <FormField control={form.control} name="availability" render={({ field }) => (
                        <FormItem>
                            <div className="mb-4"><FormLabel className="text-base font-bold text-primary">Ketersediaan Waktu (Wajib Hadir Full Day)</FormLabel></div>
                            <div className="space-y-3">
                                {["Week 1 (13-14 Juni)", "Week 2 (20-21 Juni)", "Week 3 (27-28 Juni)", "Grand Final (5 Juli) - WAJIB", "ALL"].map((item) => (
                                    <FormField key={item} control={form.control} name="availability" render={({ field }) => (
                                        <FormItem className={`flex flex-row items-center space-x-3 space-y-0 p-4 rounded-xl border-2 transition-all 
                                            ${item === "ALL" ? "bg-primary text-white border-primary hover:bg-primary/90" : "bg-card hover:border-primary/50"}
                                            ${field.value?.includes(item) && item !== "ALL" ? "border-primary bg-primary/5" : ""}
                                            `}>
                                            <FormControl>
                                                <Checkbox 
                                                    className={item === "ALL" ? "border-white data-[state=checked]:bg-white data-[state=checked]:text-primary" : ""}
                                                    checked={item === 'ALL' ? field.value?.length === 5 : field.value?.includes(item)}
                                                    onCheckedChange={(checked) => handleAvailabilityChange(!!checked, item, field)} 
                                                />
                                            </FormControl>
                                            <FormLabel className={`font-bold cursor-pointer w-full text-base ${item === "ALL" ? "text-white" : ""}`}>
                                                {item === "ALL" ? "🔥 SAYA SIAP SEMUA TANGGAL (Prioritas)" : item}
                                            </FormLabel>
                                        </FormItem>
                                    )} />
                                ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <div className="space-y-6 pt-6 border-t border-dashed">
                        <FormField control={form.control} name="caseStudy1" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold text-lg leading-snug block mb-2">Kasus 1: <span className="font-normal text-base">Teman sesama panitia terlihat duduk santai & main HP padahal antrian peserta di meja registrasi sedang membludak. Apa yang kamu lakukan?</span></FormLabel>
                                <FormControl><Textarea {...field} className="rounded-xl bg-secondary/20 border-2 focus:border-primary" placeholder="Tindakan saya..." rows={3} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="caseStudy2" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold text-lg leading-snug block mb-2">Kasus 2: <span className="font-normal text-base">Ada peserta VIP marah-marah karena dilarang masuk ke area lapangan (steril) karena tidak memakai ID Card. Bagaimana cara kamu menanganinya?</span></FormLabel>
                                <FormControl><Textarea {...field} className="rounded-xl bg-secondary/20 border-2 focus:border-primary" placeholder="Solusi saya..." rows={3} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                </CardContent>
              </Card>

              {/* PERNYATAAN FINAL */}
              <Card className="border-none bg-transparent shadow-none">
                <CardContent className="p-0 space-y-4">
                    <div className="flex items-center gap-2 text-primary font-bold mb-2 uppercase tracking-widest text-sm">
                        <FileSignature className="w-5 h-5" /> Pernyataan Integritas
                     </div>
                    {[
                        { id: "agreeData", label: "Saya menyatakan bahwa data yang diisi adalah benar, jujur, dan dapat dipertanggungjawabkan." },
                        { id: "agreeRules", label: "Saya bersedia mematuhi segala peraturan panitia (SOP) dan menjaga nama baik BCC 2026." },
                        { id: "agreeCompetitive", label: "Saya memahami bahwa seleksi ini bersifat kompetitif dan keputusan panitia mutlak dan tidak dapat diganggu gugat." }
                    ].map((item) => (
                        <FormField key={item.id} control={form.control} name={item.id as any} render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                <FormLabel className="font-normal cursor-pointer text-muted-foreground leading-snug">{item.label}</FormLabel>
                                <FormMessage />
                            </FormItem>
                        )} />
                    ))}
                </CardContent>
              </Card>

              <Button type="submit" size="lg" className="w-full h-16 text-xl font-headline font-black uppercase tracking-wider rounded-full shadow-xl hover:scale-[1.01] hover:shadow-primary/40 transition-all" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-6 w-6 animate-spin"/> MENGIRIM DATA...</> : "KIRIM LAMARAN SAYA 🚀"}
              </Button>

            </form>
          </Form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
