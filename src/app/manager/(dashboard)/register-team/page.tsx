

"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationFormSchema, type RegistrationFormValues, CATEGORIES } from "@/lib/schemas/registration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Info, Users, AlertCircle, CheckCircle2, Receipt, Wallet, Save, QrCode, CreditCard, Download } from "lucide-react";
import { useState, useEffect } from "react";
import confetti from 'canvas-confetti';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { WaiverDialog } from "@/components/manager/waiver-dialog";

// --- PETA HARGA BARU ---
const COST_PER_LEVEL: Record<string, number> = {
  Beginner: 150000,
  Intermediate: 150000,
  Advance: 200000,
  undefined: 0, // Fallback jika level belum dipilih
};
// -----------------------


const STORAGE_KEY = "bcc_registration_draft";

export default function RegistrationPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<RegistrationFormValues | null>(null);

  const [isWaiverModalOpen, setIsWaiverModalOpen] = useState(false);
  const [isWaiverLegallyAccepted, setIsWaiverLegallyAccepted] = useState(false);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      communityName: "",
      managerName: "", // Akan diisi dari session nanti
      managerWhatsapp: "", // Akan diisi dari session nanti
      managerEmail: "", // Akan diisi dari session nanti
      basecamp: "",
      players: [
        { fullName: "", nik: "", phone: "", dob: "", motherName: "", ayoId: "", level: undefined, videoUrl: "", participation: [] }
      ], 
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "players",
    control: form.control,
  });
  
  // --- LOAD DRAFT SAAT MOUNT ---
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        form.reset(parsed); 
        toast({
          title: "Draft Ditemukan",
          description: "Melanjutkan pengisian formulir terakhir Anda.",
          duration: 3000,
        });
      } catch (e) {
        console.error("Gagal load draft", e);
      }
    }
  }, [form, toast]);


  // --- LOGIC SAVE DRAFT ---
  const handleSaveDraft = () => {
    const currentValues = form.getValues();
    // Hapus file transferProof dari draft karena File object tidak bisa disimpan di localStorage
    const { transferProof, waiverProof, ...dataToSave } = currentValues; 
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    toast({
      title: "Draft Disimpan!",
      description: "Anda bisa menutup browser dan melanjutkannya nanti.",
      variant: "default", 
      className: "bg-green-50 border-green-200"
    });
  };

  const handleWaiverAccept = () => {
    setIsWaiverLegallyAccepted(true);
    setIsWaiverModalOpen(false);
    // Otomatis centang checkbox setelah persetujuan pop-up
    form.setValue("agreementWaiver", true, { shouldValidate: true });
    toast({
        title: "Waiver Diterima", 
        description: "Persetujuan legal telah dicatat.",
        className: "bg-green-600 text-white"
    });
  };


  const watchedPlayers = form.watch("players");
  
  const stats: {
    "Beregu PUTRA": number;
    "Beregu PUTRI": number;
    "Beregu CAMPURAN": number;
    totalSlots: number;
  } = {
    "Beregu PUTRA": 0,
    "Beregu PUTRI": 0,
    "Beregu CAMPURAN": 0,
    totalSlots: 0
  };

  // --- LOGIC PERHITUNGAN BIAYA DINAMIS ---
  let totalBillEstimate = 0;

  watchedPlayers?.forEach(p => {
    // 1. Ambil harga per pemain berdasarkan level deklarasi
    const costPerPlayer = COST_PER_LEVEL[p.level as keyof typeof COST_PER_LEVEL] || 0;
    
    // 2. Hitung jumlah kategori yang diikuti pemain ini (slots)
    const slotsTaken = p.participation?.length || 0;

    // 3. Tambahkan ke total bill estimate
    totalBillEstimate += costPerPlayer * slotsTaken;

    // 4. Update stats (kuota)
    if (p.participation && p.participation.length > 0) {
        p.participation.forEach((cat: any) => {
            if (stats[cat as keyof typeof stats] !== undefined) {
                stats[cat as keyof typeof stats]++;
                stats.totalSlots++;
            }
        });
    }
  });

  const potentialBill = totalBillEstimate;
  // --- END LOGIC ---

  useEffect(() => {
    if (isSuccess) {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
  }, [isSuccess]);

  async function onSubmit(data: RegistrationFormValues) {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    localStorage.removeItem(STORAGE_KEY);
    
    setSubmittedData(data);
    setIsSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsSubmitting(false);
  }

  if (isSuccess) {
    return (
        <main className="flex items-center justify-center py-16 px-4">
          <Card className="max-w-2xl w-full shadow-2xl border-t-8 border-t-green-500">
             <CardContent className="pt-10 pb-10 px-8 text-center space-y-8">
                <CheckCircle2 className="w-20 h-20 text-green-600 mx-auto" />
                <div>
                    <h1 className="text-3xl font-black text-green-700">Pendaftaran Komunitas Berhasil!</h1>
                    <p className="text-muted-foreground">
                        Terima kasih <span class="font-bold text-foreground">{submittedData?.communityName}</span>.
                    </p>
                </div>
                <div className="bg-white border rounded-lg p-4 text-left grid grid-cols-1 gap-2">
                     <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Total Slot Terdaftar:</span>
                        <span className="font-bold">{stats.totalSlots} Slot</span>
                    </div>
                     <div className="flex justify-between pt-2 text-lg text-primary">
                        <span className="font-bold">Estimasi Biaya:</span>
                        <span className="font-black">Rp {potentialBill.toLocaleString('id-ID')}</span>
                    </div>
                </div>
                <Button onClick={() => window.location.reload()} variant="outline">Daftar Lagi</Button>
             </CardContent>
          </Card>
        </main>
    );
  }

  return (
    <>
      <WaiverDialog 
        open={isWaiverModalOpen}
        onOpenChange={setIsWaiverModalOpen}
        onAccept={handleWaiverAccept}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* KOLOM KIRI: FORM */}
          <div className="lg:col-span-2 space-y-8">
              <div className="space-y-2">
              <h1 className="text-3xl font-black font-headline text-primary">Formulir Pendaftaran Tim</h1>
              <p className="text-muted-foreground">
                  Biaya dihitung per level pemain: Beginner/Intermediate <strong class="font-bold">Rp 150rb</strong>, Advance <strong class="font-bold">Rp 200rb</strong>.
              </p>
              </div>

              <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              <Card>
                  <CardHeader className="bg-primary/5 border-b pb-4">
                  <CardTitle className="text-lg text-primary font-bold">1. Identitas Komunitas</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                  <FormField control={form.control} name="communityName" render={({ field }) => (
                      <FormItem><FormLabel>Nama Komunitas</FormLabel><FormControl><Input placeholder="PB Juara Bandung" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="basecamp" render={({ field }) => (
                      <FormItem><FormLabel>Basecamp Mabar</FormLabel><FormControl><Input placeholder="GOR Susi Susanti" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  </CardContent>
              </Card>

              <Card>
                  <CardHeader className="bg-primary/5 border-b pb-4">
                  <div className="flex justify-between items-center">
                      <CardTitle className="text-lg text-primary font-bold">2. Data Pemain</CardTitle>
                      <div className="flex gap-2">
                          <Button type="button" variant="secondary" size="sm" onClick={handleSaveDraft} className="hidden sm:flex">
                              <Save className="w-4 h-4 mr-2" /> Simpan Draft
                          </Button>
                          <Badge variant="secondary">{fields.length} Pemain</Badge>
                      </div>
                  </div>
                  <CardDescription>Putri maks 18 pemain, lainnya maks 14 pemain.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                  
                  {fields.map((field, index) => (
                      <div key={field.id} className="p-5 border rounded-xl bg-card relative shadow-sm hover:border-primary/30 transition-colors">
                      <div className="absolute top-4 right-4">
                          <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => remove(index)}>
                              <Trash2 className="w-4 h-4" />
                          </Button>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-4">
                          <div className="bg-primary/10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-primary">{index + 1}</div>
                          <h4 className="font-bold text-sm text-foreground">Identitas Pemain</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <FormField control={form.control} name={`players.${index}.fullName`} render={({ field }) => (
                              <FormItem><FormLabel>Nama Lengkap (KTP)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                              )} />
                              <FormField control={form.control} name={`players.${index}.nik`} render={({ field }) => (
                              <FormItem><FormLabel>NIK</FormLabel><FormControl><Input {...field} maxLength={16} /></FormControl><FormMessage /></FormItem>
                              )} />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <FormField control={form.control} name={`players.${index}.phone`} render={({ field }) => (
                              <FormItem><FormLabel>No. Handphone (WA)</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
                              )} />
                              <FormField control={form.control} name={`players.${index}.dob`} render={({ field }) => (
                              <FormItem><FormLabel>Tanggal Lahir</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                              )} />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <FormField control={form.control} name={`players.${index}.ayoId`} render={({ field }) => (
                              <FormItem><FormLabel>Username Ayo Indonesia</FormLabel><FormControl><Input placeholder="@username" {...field} /></FormControl><FormMessage /></FormItem>
                              )} />
                              <FormField control={form.control} name={`players.${index}.level`} render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Level</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl><SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger></FormControl>
                                  <SelectContent>
                                      <SelectItem value="Beginner">Beginner (Rp 150.000)</SelectItem>
                                      <SelectItem value="Intermediate">Intermediate (Rp 150.000)</SelectItem>
                                      <SelectItem value="Advance">Advance (Rp 200.000)</SelectItem>
                                  </SelectContent>
                                  </Select>
                                  <FormMessage />
                              </FormItem>
                              )} />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <FormField control={form.control} name={`players.${index}.motherName`} render={({ field }) => (
                              <FormItem><FormLabel>Nama Ibu Kandung</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name={`players.${index}.videoUrl`} render={({ field }) => (
                              <FormItem><FormLabel>Link Video (YouTube)</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                      </div>

                      <FormField
                          control={form.control}
                          name={`players.${index}.participation`}
                          render={({ field }) => {
                              const selected = field.value || [];
                              const isMaleSelected = selected.includes("Beregu PUTRA");
                              const isFemaleSelected = selected.includes("Beregu PUTRI");

                              return (
                              <FormItem className="bg-secondary/30 p-3 rounded-lg mt-2">
                                  <div className="mb-3 font-semibold text-sm flex items-center gap-2">
                                      <Wallet className="w-4 h-4 text-primary" />
                                      Pilih Kategori:
                                  </div>
                                  <div className="flex flex-wrap gap-4">
                                      {CATEGORIES.map((cat) => {
                                          let isDisabled = false;
                                          if (cat === "Beregu PUTRA" && isFemaleSelected) isDisabled = true;
                                          if (cat === "Beregu PUTRI" && isMaleSelected) isDisabled = true;

                                          return (
                                          <FormItem
                                              key={cat}
                                              className={`flex flex-row items-start space-x-2 space-y-0 ${isDisabled ? 'opacity-50' : ''}`}
                                          >
                                              <FormControl>
                                                  <Checkbox
                                                      checked={selected.includes(cat)}
                                                      disabled={isDisabled}
                                                      onCheckedChange={(checked) => {
                                                          const newValue = checked
                                                              ? [...(field.value || []), cat]
                                                              : (field.value || []).filter(
                                                                  (value) => value !== cat
                                                              );
                                                          field.onChange(newValue);
                                                      }}
                                                  />
                                              </FormControl>
                                              <FormLabel className="text-sm font-normal cursor-pointer">
                                                  {cat.replace('Beregu ', '')}
                                              </FormLabel>
                                          </FormItem>
                                      )})}
                                  </div>
                                  <FormMessage />
                              </FormItem>
                          )}}
                      />
                      </div>
                  ))}

                  {fields.length < 18 && (
                      <Button
                      type="button"
                      variant="outline"
                      className="w-full py-6 border-dashed border-2 hover:border-primary hover:text-primary"
                      onClick={() => append({ fullName: "", nik: "", phone: "", dob: "", motherName: "", ayoId: "", level: undefined as any, videoUrl: "", participation: [] })}
                      >
                      <Plus className="w-4 h-4 mr-2" /> Tambah Pemain
                      </Button>
                  )}
                  
                  {form.formState.errors.players?.root && (
                          <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md font-medium flex items-center gap-2 border border-destructive/20">
                          <AlertCircle className="w-4 h-4" />
                          {form.formState.errors.players.root.message}
                          </div>
                  )}

                  </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-primary/5 border-b pb-4">
                  <CardTitle className="text-lg text-primary font-bold">3. Administrasi & Pembayaran</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
                      <p className="font-bold text-red-800 mb-2 flex items-center gap-2">
                          <AlertCircle className="w-5 h-5" /> Dokumen Legal Wajib
                      </p>
                      <p className="text-sm text-red-700 mb-3">
                          Pendaftaran baru dianggap sah jika Waiver sudah ditandatangani dan bermaterai Rp 10.000.
                      </p>
                      <Button asChild size="sm" variant="outline" className="bg-white border-red-200 text-red-600 hover:bg-red-100">
                          <Link href="/manager/documents/waiver" target="_blank">
                              <Download className="w-4 h-4 mr-2" /> Unduh Template Waiver
                          </Link>
                      </Button>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="waiverProof"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel>Upload Waiver Final (Tandatangan & Materai)</FormLabel>
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

                   <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-md mb-4">
                        <p className="text-sm text-yellow-800">
                            <strong class="font-bold">PERHATIAN: Biaya di bawah ini adalah <strong class="font-bold">ESTIMASI AWAL</strong>.</strong> <br/>
                            Biaya Final akan disesuaikan setelah TPF mengesahkan level pemain Anda.
                        </p>
                    </div>

                  
                  <Tabs defaultValue="transfer" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-4">
                          <TabsTrigger value="transfer">Transfer Bank</TabsTrigger>
                          <TabsTrigger value="qris">QRIS</TabsTrigger>
                      </TabsList>
                      <TabsContent value="transfer" className="space-y-4 p-4 border rounded-lg bg-secondary/10">
                          <div className="flex items-center gap-3 mb-2">
                              <CreditCard className="w-6 h-6 text-primary" />
                              <div>
                                  <p className="font-bold text-sm">Bank BJB</p>
                                  <p className="text-xs text-muted-foreground">Transfer Manual / Mobile Banking</p>
                              </div>
                          </div>
                          <div className="space-y-1 text-sm">
                              <p>No. Rekening: <span className="font-mono font-bold text-lg select-all">0123-4567-8900</span></p>
                              <p>Atas Nama: <strong>Panitia BCC 2026</strong></p>
                              <p className="text-xs text-muted-foreground mt-2">*Mohon tambahkan 3 digit terakhir nomor HP Manajer pada nominal transfer.</p>
                          </div>
                      </TabsContent>
                      <TabsContent value="qris" className="space-y-4 p-4 border rounded-lg bg-secondary/10 text-center">
                          <div className="flex flex-col items-center gap-3">
                              <QrCode className="w-12 h-12 text-primary" />
                              <div>
                                  <p className="font-bold text-sm">QRIS Bank BJB</p>
                                  <p className="text-xs text-muted-foreground">Scan menggunakan aplikasi e-wallet / banking apa saja</p>
                              </div>
                              <div className="w-48 h-48 bg-white border rounded-lg flex items-center justify-center">
                                  <span className="text-muted-foreground text-xs">QR Code Image Placeholder</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">*Pastikan nama merchant adalah <strong>"BCC 2026 - Registrasi"</strong></p>
                          </div>
                      </TabsContent>
                  </Tabs>

                  <FormField control={form.control} name="transferProof" render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                          <FormLabel>Upload Bukti Transfer / Screenshot QRIS</FormLabel>
                          <FormControl><Input {...fieldProps} type="file" accept="image/*,application/pdf" onChange={(e) => onChange(e.target.files)} /></FormControl>
                          <FormMessage />
                      </FormItem>
                  )} />
                  
                  <div className="space-y-2 pt-4 border-t">
                      {[
                          { id: "agreementValidData", label: "Data Valid & Benar" }
                      ].map((item) => (
                          <FormField key={item.id} control={form.control} name={item.id as any} render={({ field }) => (
                              <FormItem className="flex gap-2 items-center space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal text-sm">{item.label}</FormLabel></FormItem>
                          )} />
                      ))}

                      <FormField
                          control={form.control}
                          name="agreementWaiver"
                          render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                                  <FormControl>
                                      <Checkbox 
                                          checked={field.value} 
                                          onCheckedChange={field.onChange}
                                          disabled={!isWaiverLegallyAccepted} 
                                      />
                                  </FormControl>
                                  <div className="space-y-1 leading-none flex justify-between items-center w-full">
                                      <FormLabel className="text-sm font-normal cursor-pointer leading-relaxed">
                                          Saya telah membaca dan menyetujui Pembebasan Tuntutan (Waiver of Liability).
                                      </FormLabel>
                                      <Button 
                                          type="button" 
                                          size="sm" 
                                          variant="ghost" 
                                          onClick={() => setIsWaiverModalOpen(true)}
                                          className='text-primary font-bold hover:bg-primary/10'
                                      >
                                          {isWaiverLegallyAccepted ? 'Diterima' : 'Lihat & Setujui'}
                                      </Button>
                                  </div>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />

                      {[
                        { id: "agreementTpf", label: "Terima Keputusan Mutlak TPF" },
                        { id: "agreementRules", label: "Paham Peraturan BCC 2026" }
                      ].map((item) => (
                          <FormField key={item.id} control={form.control} name={item.id as any} render={({ field }) => (
                              <FormItem className="flex gap-2 items-center space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal text-sm">{item.label}</FormLabel></FormItem>
                          )} />
                      ))}
                      {(form.formState.errors.agreementValidData || form.formState.errors.agreementWaiver || form.formState.errors.agreementTpf || form.formState.errors.agreementRules) && (
                              <p className="text-sm font-medium text-destructive">Anda harus menyetujui semua pernyataan legal.</p>
                      )}
                  </div>
                </CardContent>
              </Card>

                  <div className="block lg:hidden sticky bottom-4 z-50">
                  <Button type="submit" size="lg" className="w-full shadow-xl border-2 border-white" disabled={isSubmitting}>
                      {isSubmitting ? "Mengirim..." : `BAYAR Rp ${potentialBill.toLocaleString('id-ID')}`}
                  </Button>
                  </div>

              </form>
              </Form>
          </div>

          {/* KOLOM KANAN: SUMMARY STICKY */}
          <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-6 space-y-6">
              <Card className="border-2 border-primary/20 bg-primary/5 shadow-lg">
                  <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-primary" />
                          Status Kuota Tim
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      {Object.entries(stats).filter(([k]) => k !== 'totalSlots').map(([key, val]) => {
                          const min = key === 'Beregu PUTRI' ? 11 : 10;
                          const max = key === 'Beregu PUTRI' ? 18 : 14;
                          return (
                          <div key={key} className="space-y-1">
                              <div className="flex justify-between text-sm font-medium">
                                  <span>{key.replace('Beregu ', '')}</span>
                                  <span className={val < min || val > max ? 'text-destructive' : 'text-green-600'}>
                                      {val}/{max} (Min {min})
                                  </span>
                              </div>
                              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                  <div 
                                      className={`h-full transition-all ${val < min || val > max ? 'bg-destructive' : 'bg-green-500'}`} 
                                      style={{ width: `${Math.min((val / max) * 100, 100)}%` }} 
                                  />
                              </div>
                              <p className="text-xs text-muted-foreground">
                                  {val === 0 ? 'Belum ada pemain' : val < min ? `Kurang ${min - val} lagi` : val > max ? `Kelebihan ${val - max}` : 'Siap!'}
                              </p>
                          </div>
                      )})}
                  </CardContent>
                  <CardFooter className="flex-col items-start pt-4 border-t gap-3">
                      <div className="w-full flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Estimasi Tagihan</span>
                          <span className="text-xl font-black text-primary">Rp {potentialBill.toLocaleString('id-ID')}</span>
                      </div>
                      
                       <p className="text-xs text-yellow-600 text-right w-full font-semibold">*Biaya final setelah TPF</p>
                      
                      <div className="grid grid-cols-2 gap-2 w-full mt-2">
                          <Button 
                              type="button"
                              onClick={handleSaveDraft} 
                              variant="secondary" 
                              className="w-full font-bold border border-primary/20"
                          >
                              <Save className="w-4 h-4 mr-2" /> Draft
                          </Button>

                          <Button 
                              onClick={form.handleSubmit(onSubmit)} 
                              className="w-full font-bold shadow-md" 
                              disabled={isSubmitting}
                          >
                              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "KIRIM"}
                          </Button>
                      </div>
                  </CardFooter>
              </Card>
              </div>
          </div>

      </div>
    </>
  );
}
