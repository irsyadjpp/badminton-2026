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
import { AlertCircle, FileText, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useState } from 'react';

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
      partaiNumber: "",
      opponentTeam: "",
      opponentPlayer: "",
      violationType: [],
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-black font-headline text-red-600">FORMULIR PENGAJUAN PROTES</h1>
        <p className="text-muted-foreground">Protes hanya boleh diajukan oleh Manajer Tim yang terdaftar.</p>
        
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex justify-between items-center">
            <p className="text-sm text-yellow-800 flex items-center gap-2 font-medium">
                <AlertCircle className="w-5 h-5 text-red-600" />
                Wajib Serahkan Uang Jaminan **Rp 500.000,-** tunai bersama formulir cetak!
            </p>
            <Button asChild size="sm" variant="destructive" className="bg-red-600 hover:bg-red-700">
                <Link href="/manager/protest/form-print" target="_blank">
                    Cetak Formulir
                </Link>
            </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Detail Pelapor & Kejadian</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {/* Identitas Pelapor (Pre-filled) */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><Label>Manajer:</Label><p className="font-bold">{MOCK_SESSION_MANAGER.name}</p></div>
                <div><Label>Tim Pelapor:</Label><p className="font-bold">{MOCK_SESSION_MANAGER.team}</p></div>
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
                <FormField control={form.control} name="incidentTime" render={({ field }) => (<FormItem><FormLabel>Waktu Kejadian (WIB)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="courtNumber" render={({ field }) => (<FormItem><FormLabel>No. Lapangan</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="partaiNumber" render={({ field }) => (<FormItem><FormLabel>Partai Ke-</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="opponentTeam" render={({ field }) => (<FormItem><FormLabel>Nama Tim Terlapor</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="opponentPlayer" render={({ field }) => (<FormItem><FormLabel>Nama Pemain Terlapor</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Jenis Pelanggaran & Bukti</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="violationType" render={({ field }) => (
                <FormItem className="space-y-3">
                    <FormLabel>Jenis Pelanggaran yang Dilaporkan:</FormLabel>
                    {VIOLATIONS.map((item) => (
                        <FormField key={item.id} control={form.control} name="violationType" render={({ field }) => (
                            <FormItem key={item.id} className="flex items-start space-x-3 space-y-0 border p-3 rounded-md">
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
              
              <FormField control={form.control} name="additionalEvidence" render={({ field }) => (
                <FormItem>
                    <FormLabel>Bukti & Keterangan Tambahan</FormLabel>
                    <FormControl><Textarea placeholder="Jelaskan secara spesifik gerakan atau fakta yang menjadi dasar protes..." rows={5} {...field} /></FormControl>
                </FormItem>
              )} />
            </CardContent>
          </Card>

          <Card className="bg-red-50 border border-red-300">
            <CardContent className="p-4 space-y-2">
                <FormField control={form.control} name="depositAgreement" render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer leading-snug text-sm text-red-800">
                            Saya memahami dan menyetujui penyerahan **UANG JAMINAN PROTES Rp 500.000,-** secara tunai. Uang akan hangus jika protes ditolak, dan dikembalikan 100% jika diterima.
                        </FormLabel>
                        <FormMessage />
                    </FormItem>
                )} />
            </CardContent>
          </Card>

          <Button type="submit" className="w-full h-12 text-lg" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <><Send className="w-5 h-5 mr-2" /> Ajukan Protes Digital</>}
          </Button>
        </form>
      </Form>
    </div>
  );
}
