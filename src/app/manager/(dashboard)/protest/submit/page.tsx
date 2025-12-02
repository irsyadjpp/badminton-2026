'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { protestFormSchema, type ProtestFormValues } from '@/lib/schemas/protest';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertCircle, FileText, Send, Loader2, Info, Youtube, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


// Mock Data - Biasanya dari Session/DB
const MOCK_SESSION_MANAGER = { name: "Rizki Karami", team: "PB Super", wa: "081119522228" };
const VIOLATIONS = [
  { id: "SANDBAGGING", label: "SANDBAGGING (Manipulasi Level)" },
  { id: "JOKI", label: "JOKI (Pemalsuan Identitas)" },
  { id: "ADMINISTRASI", label: "ADMINISTRASI (Double Play)" },
];

export default function ProtestSubmissionPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProtestFormValues>({
    resolver: zodResolver(protestFormSchema),
    defaultValues: {
      managerName: MOCK_SESSION_MANAGER.name,
      teamName: MOCK_SESSION_MANAGER.team,
      managerWhatsapp: MOCK_SESSION_MANAGER.wa,
      category: undefined,
      incidentTime: "",
      courtNumber: "",
      partaiNumber: undefined,
      opponentTeam: "",
      opponentPlayer: "",
      violationType: [],
      youtubeUrl: "",
      videoFile: undefined,
      additionalEvidence: "",
      depositAgreement: false,
    },
  });

  async function onSubmit(data: ProtestFormValues) {
    setIsSubmitting(true);
    // Di sini akan dipanggil Server Action submitProtest(data)
    console.log("Protest Submitted:", data);
    
    await new Promise((resolve) => setTimeout(resolve, 2000)); 

    setIsSubmitting(false);
    toast({
      title: "Pengajuan Protes Diterima!",
      description: "Tim Match Control telah menerima notifikasi Anda. Segera serahkan formulir cetak dan uang jaminan ke Meja Panitia.",
      variant: "default",
      className: "bg-red-600 text-white"
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* KOLOM KIRI: FORM */}
      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-1">
            <h1 className="text-3xl font-black font-headline text-red-600">FORMULIR PENGAJUAN PROTES</h1>
            <p className="text-muted-foreground">Protes hanya boleh diajukan oleh Manajer Tim yang terdaftar.</p>
        </div>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>1. Detail Pelapor & Kejadian</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm p-4 bg-secondary/50 rounded-lg">
                    <div>
                        <Label className="text-xs text-muted-foreground">Manajer Pelapor</Label>
                        <p className="font-bold">{MOCK_SESSION_MANAGER.name}</p>
                    </div>
                    <div>
                        <Label className="text-xs text-muted-foreground">Tim Pelapor</Label>
                        <p className="font-bold">{MOCK_SESSION_MANAGER.team}</p>
                    </div>
                </div>
                
                <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem><FormLabel>Kategori Pertandingan</FormLabel>
                        <RadioGroup onValueChange={field.onChange} className="flex gap-4">
                            {["Putra", "Putri", "Campuran"].map((cat) => (
                            <FormItem key={cat} className="flex items-center space-x-2"><FormControl><RadioGroupItem value={cat} /></FormControl><FormLabel>{cat}</FormLabel></FormItem>
                            ))}
                        </RadioGroup>
                    <FormMessage /></FormItem>
                )} />
                
                <div className="grid grid-cols-3 gap-4">
                    <FormField control={form.control} name="incidentTime" render={({ field }) => (<FormItem><FormLabel>Waktu Kejadian</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="courtNumber" render={({ field }) => (
                      <FormItem>
                        <FormLabel>No. Lapangan</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih..." />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {[1, 2, 3, 4, 5].map(num => (
                                    <SelectItem key={num} value={String(num)}>{num}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="partaiNumber" render={({ field }) => (<FormItem><FormLabel>Partai Ke-</FormLabel><FormControl><Input type="number" min="1" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="opponentTeam" render={({ field }) => (<FormItem><FormLabel>Nama Tim Terlapor</FormLabel><FormControl><Input {...field} pattern="[A-Za-z\s]+" title="Hanya boleh berisi huruf dan spasi" /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="opponentPlayer" render={({ field }) => (<FormItem><FormLabel>Nama Pemain Terlapor</FormLabel><FormControl><Input {...field} pattern="[A-Za-z\s]+" title="Hanya boleh berisi huruf dan spasi" /></FormControl><FormMessage /></FormItem>)} />
                </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>2. Jenis Pelanggaran & Bukti</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                <FormField control={form.control} name="violationType" render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel>Jenis Pelanggaran yang Dilaporkan:</FormLabel>
                        {VIOLATIONS.map((item) => (
                            <FormField key={item.id} control={form.control} name="violationType" render={({ field }) => (
                                <FormItem key={item.id} className="flex items-start space-x-3 space-y-0 border p-3 rounded-md bg-card hover:bg-secondary/20 transition-colors">
                                    <FormControl>
                                        <Checkbox checked={field.value?.includes(item.id)} onCheckedChange={(checked) => {
                                            return checked ? field.onChange([...field.value, item.id]) : field.onChange(field.value?.filter((value) => value !== item.id))}}
                                        />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer leading-tight">
                                        <span className="font-semibold">{item.label}</span>
                                        <p className="text-xs text-muted-foreground">{item.id === 'SANDBAGGING' ? 'Kemampuan teknis pemain lawan jauh melebihi level yang didaftarkan.' : item.id === 'JOKI' ? 'Wajah pemain di lapangan tidak sesuai dengan KTP/Video.' : 'Pemain lawan bermain rangkap dalam satu pertemuan.'}</p>
                                    </FormLabel>
                                </FormItem>
                            )}/>
                        ))}
                        <FormMessage />
                    </FormItem>
                )} />
                
                <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Youtube className="w-5 h-5 text-red-600" /> Link Video YouTube (Opsional)</Label>
                    <FormField control={form.control} name="youtubeUrl" render={({ field }) => (<FormItem className="!mt-0"><FormControl><Input placeholder="https://www.youtube.com/watch?v=..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>

                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t"></div>
                    <span className="flex-shrink mx-4 text-xs text-muted-foreground">ATAU</span>
                    <div className="flex-grow border-t"></div>
                </div>

                <FormField control={form.control} name="videoFile" render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><Video className="w-5 h-5 text-blue-600" /> Upload File Video (Opsional, Max 100MB)</FormLabel>
                    <FormControl>
                      <Input
                        {...fieldProps}
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        onChange={(event) => {
                          onChange(event.target.files);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="additionalEvidence" render={({ field }) => (
                    <FormItem className='pt-4 border-t'>
                        <FormLabel>Keterangan Tambahan</FormLabel>
                        <FormControl><Textarea placeholder="Jelaskan secara spesifik gerakan atau fakta yang menjadi dasar protes..." rows={5} {...field} /></FormControl>
                    </FormItem>
                )} />

                </CardContent>
            </Card>

            <Card className="bg-red-50 border border-red-300">
                <CardHeader>
                    <CardTitle className="text-red-700">3. Persetujuan Uang Jaminan</CardTitle>
                </CardHeader>
                <CardContent>
                    <FormField control={form.control} name="depositAgreement" render={({ field }) => (
                        <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer leading-snug text-sm text-red-800">
                                Saya memahami dan menyetujui penyerahan **UANG JAMINAN PROTES Rp 500.000,-** secara tunai. Uang akan hangus jika protes ditolak, dan dikembalikan 100% jika diterima.
                            </FormLabel>
                        </FormItem>
                    )} />
                     <FormMessage className="pl-9 pt-2">
                        {form.formState.errors.depositAgreement?.message}
                    </FormMessage>
                </CardContent>
            </Card>
            
            <div className="lg:hidden">
              <Button type="submit" className="w-full h-12 text-lg" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <><Send className="w-5 h-5 mr-2" /> Ajukan Protes Digital</>}
              </Button>
            </div>

            </form>
        </Form>
      </div>

       {/* KOLOM KANAN: PROSEDUR */}
      <div className="hidden lg:block lg:col-span-1">
        <div className="sticky top-24 space-y-6">
            <Card className="border-yellow-500/50 bg-yellow-500/5">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-yellow-800">
                        <Info className="w-5 h-5"/>
                        Prosedur Protes
                    </CardTitle>
                    <CardDescription>Ikuti langkah-langkah berikut untuk mengajukan protes resmi.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-yellow-900/80">
                   <ol className="list-decimal pl-4 space-y-3">
                        <li>
                            <span className="font-bold">Isi Formulir Digital:</span>
                            Lengkapi semua field di samping untuk notifikasi awal ke Match Control.
                        </li>
                        <li>
                            <span className="font-bold">Cetak Formulir Fisik:</span>
                            Gunakan tombol di bawah untuk mencetak formulir protes resmi.
                        </li>
                         <li>
                            <span className="font-bold">Serahkan Berkas:</span>
                            Bawa formulir cetak yang sudah ditandatangani & bermaterai, beserta uang jaminan tunai <strong>Rp 500.000</strong> ke Meja Panitia.
                        </li>
                         <li>
                            <span className="font-bold">Tunggu Keputusan:</span>
                            Referee akan melakukan investigasi dan memberikan keputusan mutlak.
                        </li>
                   </ol>
                   <Button asChild className="w-full" variant="outline">
                       <Link href="/manager/protest/form-print" target="_blank">
                           <FileText className="w-4 h-4 mr-2" /> Cetak Formulir
                       </Link>
                   </Button>
                </CardContent>
            </Card>
            
            <Button onClick={form.handleSubmit(onSubmit)} className="w-full font-bold shadow-md h-12 text-lg" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <><Send className="w-5 h-5 mr-2" /> Ajukan Protes</>}
            </Button>
        </div>
      </div>

    </div>
  );
}
