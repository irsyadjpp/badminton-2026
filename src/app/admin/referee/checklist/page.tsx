
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ShieldCheck, CloudLightning, Wind, Grid } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CHECKLIST_ITEMS = [
  { id: "light", label: "Pencahayaan (Lux) cukup & tidak silau", icon: CloudLightning },
  { id: "wind", label: "Kondisi Angin / AC aman", icon: Wind },
  { id: "net", label: "Tinggi Net & Tiang sesuai regulasi", icon: Grid },
  { id: "floor", label: "Karpet lapangan bersih & tidak licin", icon: ShieldCheck },
  { id: "score", label: "Perangkat Skor Digital berfungsi", icon: CloudLightning },
];

export default function RefereeChecklistPage() {
  const { toast } = useToast();
  const [checked, setChecked] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const handleToggle = (id: string) => {
      setChecked(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSubmit = () => {
      if (checked.length !== CHECKLIST_ITEMS.length) {
          return toast({ title: "Venue Belum Siap!", description: "Mohon cek semua item sebelum memberi persetujuan.", variant: "destructive" });
      }
      toast({ title: "Venue Approved", description: "Turnamen dinyatakan sah untuk dimulai.", className: "bg-green-600 text-white" });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
       <div className="flex items-center gap-3 mb-6">
           <div className="p-3 bg-primary text-white rounded-full"><ShieldCheck className="w-8 h-8" /></div>
           <div>
               <h2 className="text-2xl font-bold font-headline">Venue Inspection Log</h2>
               <p className="text-muted-foreground">Protokol pemeriksaan Referee sebelum sesi dimulai.</p>
           </div>
       </div>

       <Card>
           <CardHeader><CardTitle>Daftar Periksa Kesiapan</CardTitle></CardHeader>
           <CardContent className="space-y-4">
               {CHECKLIST_ITEMS.map((item) => (
                   <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-secondary/10 transition-colors cursor-pointer" onClick={() => handleToggle(item.id)}>
                       <Checkbox checked={checked.includes(item.id)} id={item.id} />
                       <div className="flex-1">
                           <label htmlFor={item.id} className="text-sm font-bold cursor-pointer flex items-center gap-2">
                               <item.icon className="w-4 h-4 text-muted-foreground" />
                               {item.label}
                           </label>
                       </div>
                   </div>
               ))}
               
               <div className="space-y-2 mt-4">
                   <label className="text-sm font-bold">Catatan Khusus Referee</label>
                   <Textarea 
                        placeholder="Contoh: Lampu court 3 agak redup, sudah lapor teknisi..." 
                        value={notes} 
                        onChange={(e) => setNotes(e.target.value)}
                   />
               </div>

               <Button className="w-full h-12 text-lg font-bold bg-green-600 hover:bg-green-700 mt-6" onClick={handleSubmit}>
                   SAHKAN KESIAPAN VENUE
               </Button>
           </CardContent>
       </Card>
    </div>
  );
}

    