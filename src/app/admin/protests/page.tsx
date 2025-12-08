
'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Gavel, CheckCircle, XCircle } from "lucide-react";
import { getProtests, resolveProtest } from "@/app/manager/(dashboard)/protest/actions";
import { useToast } from "@/hooks/use-toast";

export default function RefereeProtestPage() {
  const { toast } = useToast();
  const [protests, setProtests] = useState<any[]>([]);
  const [verdict, setVerdict] = useState("");
  const [selectedProtestId, setSelectedProtestId] = useState<string | null>(null);

  useEffect(() => {
    getProtests().then(setProtests);
  }, []);

  const handleDecide = async (id: string, status: 'ACCEPTED' | 'REJECTED') => {
    if (!verdict) {
      toast({ title: "Error", description: "Alasan keputusan wajib diisi.", variant: "destructive" });
      return;
    }
    await resolveProtest(id, status, verdict);
    getProtests().then(setProtests);
    setVerdict("");
    setSelectedProtestId(null); // Close dialog
    toast({ title: "Keputusan Disimpan", description: `Status protes #${id} telah diperbarui.` });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
         <div className="p-3 bg-red-100 text-red-600 rounded-full"><Gavel className="w-8 h-8"/></div>
         <div>
            <h1 className="text-3xl font-bold font-headline">Meja Hakim Garis (Referee)</h1>
            <p className="text-muted-foreground">Pusat penyelesaian sengketa pertandingan.</p>
         </div>
      </div>

      <div className="grid gap-4">
         {protests.map((p) => (
            <Card key={p.id} className={p.status === 'PENDING_REVIEW' ? 'border-l-4 border-l-orange-500' : 'opacity-70'}>
               <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <div className="flex items-center gap-2 mb-1">
                           <Badge variant="outline">{p.id}</Badge>
                           <span className="text-sm font-bold">{p.teamName}</span>
                           <span className="text-xs text-muted-foreground">• {new Date(p.submissionDate).toLocaleTimeString('id-ID')}</span>
                        </div>
                        <h3 className="text-lg font-bold">{p.violationType.join(', ')}</h3>
                        <p className="text-muted-foreground mt-2 bg-muted p-3 rounded-md text-sm">"{p.additionalEvidence}"</p>
                     </div>
                     <Badge className={
                         p.status.startsWith('PENDING') ? 'bg-orange-500' : 
                         p.status.startsWith('ACCEPTED') ? 'bg-green-600' : 'bg-red-600'
                     }>
                        {p.status.replace(/_/g, ' ')}
                     </Badge>
                  </div>

                  {p.status === 'PENDING_REVIEW' ? (
                     <Dialog open={selectedProtestId === p.id} onOpenChange={(open) => !open && setSelectedProtestId(null)}>
                        <DialogTrigger asChild>
                           <Button className="w-full" onClick={() => setSelectedProtestId(p.id)}>BERIKAN KEPUTUSAN</Button>
                        </DialogTrigger>
                        <DialogContent>
                           <DialogHeader><DialogTitle>Keputusan Referee untuk #{p.id}</DialogTitle></DialogHeader>
                           <div className="space-y-4 py-4">
                              <Textarea 
                                placeholder="Alasan keputusan (berdasarkan Rule BWF Pasal X)..." 
                                value={verdict} 
                                onChange={e => setVerdict(e.target.value)}
                              />
                              <div className="grid grid-cols-2 gap-4">
                                 <Button onClick={() => handleDecide(p.id, 'ACCEPTED')} className="bg-green-600 hover:bg-green-700">
                                    <CheckCircle className="mr-2 h-4 w-4"/> TERIMA PROTES
                                 </Button>
                                 <Button onClick={() => handleDecide(p.id, 'REJECTED')} className="bg-red-600 hover:bg-red-700">
                                    <XCircle className="mr-2 h-4 w-4"/> TOLAK PROTES
                                 </Button>
                              </div>
                           </div>
                        </DialogContent>
                     </Dialog>
                  ) : (
                     p.verdict &&
                     <div className="bg-muted/50 p-3 rounded text-sm">
                        <strong>Keputusan:</strong> {p.verdict}
                     </div>
                  )}
               </CardContent>
            </Card>
         ))}
      </div>
    </div>
  );
}
