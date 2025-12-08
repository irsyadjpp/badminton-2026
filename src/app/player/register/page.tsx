
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
import { Loader2, ShieldCheck, ArrowRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Image from "next/image";

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
    <div className="min-h-screen w-full flex bg-zinc-950">
      
      {/* KIRI: FORM REGISTRASI (SCROLLABLE) */}
      <div className="w-full lg:w-[50%] p-6 md:p-12 overflow-y-auto h-screen bg-zinc-900 no-scrollbar">
         <div className="max-w-lg mx-auto space-y-8">
            <div>
               <h2 className="text-3xl font-black font-headline text-white mb-2">Join the League.</h2>
               <p className="text-zinc-400">Buat akun atlet resmi BCC 2026.</p>
            </div>

            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  {/* Section Akun */}
                  <div className="space-y-4">
                     <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-2">1. Akun Login</h3>
                     <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="email" render={({field}) => (
                           <FormItem><FormLabel className="text-zinc-300">Email</FormLabel><FormControl><Input {...field} className="bg-black border-zinc-800"/></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="password" render={({field}) => (
                           <FormItem><FormLabel className="text-zinc-300">Password</FormLabel><FormControl><Input type="password" {...field} className="bg-black border-zinc-800"/></FormControl><FormMessage /></FormItem>
                        )} />
                     </div>
                  </div>

                  {/* Section Data Pribadi */}
                  <div className="space-y-4">
                     <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-2 flex items-center gap-2">
                        2. Data Pribadi <ShieldCheck className="w-4 h-4 text-green-500"/>
                     </h3>
                     <FormField control={form.control} name="nik" render={({field}) => (
                        <FormItem><FormLabel className="text-zinc-300">NIK (Sesuai KTP)</FormLabel><FormControl><Input {...field} className="bg-black border-zinc-800"/></FormControl><FormMessage /></FormItem>
                     )} />
                     <FormField control={form.control} name="fullName" render={({field}) => (
                        <FormItem><FormLabel className="text-zinc-300">Nama Lengkap</FormLabel><FormControl><Input {...field} className="bg-black border-zinc-800"/></FormControl><FormMessage /></FormItem>
                     )} />
                     <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="birthDate" render={({ field }) => (
                            <FormItem><FormLabel>Tgl Lahir</FormLabel><FormControl><Input type="date" {...field} className="bg-black border-zinc-800" /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="gender" render={({ field }) => (
                          <FormItem><FormLabel>Jenis Kelamin</FormLabel>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex pt-2">
                                <FormItem className="flex items-center space-x-2">
                                    <FormControl><RadioGroupItem value="Laki-laki" id="male" /></FormControl>
                                    <Label htmlFor="male" className="font-normal text-white">Laki-laki</Label>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2">
                                    <FormControl><RadioGroupItem value="Perempuan" id="female" /></FormControl>
                                    <Label htmlFor="female" className="font-normal text-white">Perempuan</Label>
                                </FormItem>
                            </RadioGroup>
                          <FormMessage /></FormItem>
                        )} />
                     </div>
                     <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem><FormLabel>No. WhatsApp</FormLabel><FormControl><Input {...field} className="bg-black border-zinc-800" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="address" render={({ field }) => (
                        <FormItem><FormLabel>Alamat Domisili</FormLabel><FormControl><Input {...field} className="bg-black border-zinc-800" /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  
                  {/* Section Profil Publik */}
                   <div className="space-y-4">
                     <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-2">3. Profil Publik</h3>
                      <div className="grid grid-cols-2 gap-4">
                         <FormField control={form.control} name="nickname" render={({ field }) => (
                            <FormItem><FormLabel>Nama Punggung/Panggilan</FormLabel><FormControl><Input {...field} className="bg-black border-zinc-800" /></FormControl><FormMessage /></FormItem>
                         )} />
                         <FormField control={form.control} name="jerseySize" render={({ field }) => (
                            <FormItem>
                               <FormLabel>Ukuran Jersey</FormLabel>
                               <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl><SelectTrigger className="bg-black border-zinc-800"><SelectValue placeholder="Pilih" /></SelectTrigger></FormControl>
                                  <SelectContent>
                                     {["S", "M", "L", "XL", "XXL"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                  </SelectContent>
                               </Select>
                               <FormMessage />
                            </FormItem>
                         )} />
                      </div>
                  </div>

                  <Button type="submit" className="w-full h-14 text-lg font-bold bg-primary hover:bg-red-700 mt-8" disabled={isSubmitting}>
                     {isSubmitting ? <Loader2 className="animate-spin"/> : "DAFTAR SEKARANG"}
                  </Button>

                  <div className="text-center text-sm text-zinc-500">
                     Sudah punya akun? <Link href="/player/login" className="text-primary font-bold hover:underline">Login</Link>
                  </div>
               </form>
            </Form>
         </div>
      </div>

      {/* KANAN: VISUAL (STICKY) */}
      <div className="hidden lg:flex w-[50%] bg-black relative items-center justify-center h-screen sticky top-0">
         <div className="absolute inset-0 bg-[url('/images/gor-koni.jpg')] bg-cover bg-center opacity-30 mix-blend-luminosity"></div>
         <div className="relative z-10 text-center p-12">
            <h1 className="text-6xl font-black text-white mb-4">BE THE<br/>NEXT CHAMPION</h1>
            <p className="text-xl text-zinc-400 max-w-md mx-auto">
               Bergabung dengan 1.500+ atlet lainnya di turnamen komunitas terbesar.
            </p>
         </div>
      </div>

    </div>
  );
}
