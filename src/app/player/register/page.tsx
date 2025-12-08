'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { playerRegisterSchema, type PlayerRegisterValues } from "@/lib/schemas/player-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { registerPlayer } from "../actions";
import { Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function PlayerRegisterPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PlayerRegisterValues>({
    resolver: zodResolver(playerRegisterSchema),
  });

  const onSubmit = async (data: PlayerRegisterValues) => {
    setIsSubmitting(true);
    const res = await registerPlayer(data);
    setIsSubmitting(false);

    if (res.success) {
      toast({ title: "Registrasi Berhasil!", description: "Silakan login untuk bergabung ke tim.", className: "bg-green-600 text-white" });
      // Redirect ke login
      window.location.href = '/player/login';
    } else {
      toast({ title: "Gagal", description: res.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <Card className="w-full max-w-lg border-zinc-800 bg-zinc-900 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-black text-primary uppercase">BCC Player ID</CardTitle>
          <CardDescription>Buat akun atlet resmi. Data NIK & Pribadi Anda aman terenkripsi.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              
              {/* AKUN */}
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} className="bg-black border-zinc-700" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} className="bg-black border-zinc-700" /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

              {/* IDENTITAS (SENSITIF) */}
              <div className="p-4 border border-zinc-700 rounded-lg bg-zinc-950/50 space-y-4">
                 <div className="flex items-center gap-2 text-xs text-green-500 font-bold uppercase mb-2">
                    <ShieldCheck className="w-4 h-4"/> Data Terenkripsi (Hanya Admin)
                 </div>
                 <FormField control={form.control} name="nik" render={({ field }) => (
                    <FormItem><FormLabel>NIK (KTP/KK)</FormLabel><FormControl><Input {...field} className="bg-black border-zinc-700" /></FormControl><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem><FormLabel>Nama Lengkap (Sesuai KTP)</FormLabel><FormControl><Input {...field} className="bg-black border-zinc-700" /></FormControl><FormMessage /></FormItem>
                 )} />
                 <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="birthDate" render={({ field }) => (
                        <FormItem><FormLabel>Tgl Lahir</FormLabel><FormControl><Input type="date" {...field} className="bg-black border-zinc-700" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="gender" render={({ field }) => (
                      <FormItem><FormLabel>Jenis Kelamin</FormLabel>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex pt-2">
                            <FormItem className="flex items-center space-x-2">
                                <FormControl><RadioGroupItem value="Laki-laki" id="male" /></FormControl>
                                <Label htmlFor="male" className="font-normal">Laki-laki</Label>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2">
                                <FormControl><RadioGroupItem value="Perempuan" id="female" /></FormControl>
                                <Label htmlFor="female" className="font-normal">Perempuan</Label>
                            </FormItem>
                        </RadioGroup>
                      <FormMessage /></FormItem>
                    )} />
                 </div>
                  <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem><FormLabel>No. WhatsApp</FormLabel><FormControl><Input {...field} className="bg-black border-zinc-700" /></FormControl><FormMessage /></FormItem>
                  )} />
                 <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem><FormLabel>Alamat Domisili</FormLabel><FormControl><Input {...field} className="bg-black border-zinc-700" /></FormControl><FormMessage /></FormItem>
                 )} />
              </div>

              {/* PROFIL PUBLIK */}
              <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="nickname" render={({ field }) => (
                    <FormItem><FormLabel>Nama Punggung/Panggilan</FormLabel><FormControl><Input {...field} className="bg-black border-zinc-700" /></FormControl><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="jerseySize" render={({ field }) => (
                    <FormItem>
                       <FormLabel>Ukuran Jersey</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger className="bg-black border-zinc-700"><SelectValue placeholder="Pilih" /></SelectTrigger></FormControl>
                          <SelectContent>
                             {["S", "M", "L", "XL", "XXL"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                       </Select>
                       <FormMessage />
                    </FormItem>
                 )} />
              </div>

              <Button type="submit" className="w-full font-bold text-lg h-12 mt-4" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin"/> : "BUAT AKUN PEMAIN"}
              </Button>
              
              <div className="text-center text-sm text-zinc-500">
                Sudah punya akun? <Link href="/player/login" className="text-primary hover:underline">Login di sini</Link>
              </div>

            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
