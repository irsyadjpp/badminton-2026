'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Briefcase, CheckCircle2, XCircle, Plus, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock Data Pipeline
const PIPELINE = [
  { id: 1, name: "Bank BJB", pic: "Pak Budi", status: "DEAL", value: 50000000 },
  { id: 2, name: "Yonex", pic: "Bu Susi", status: "NEGOTIATION", value: 25000000 },
  { id: 3, name: "Warung Nasi Ampera", pic: "Kang Dadang", status: "PROPOSAL_SENT", value: 5000000 },
];

export default function SponsorshipPage() {
  const { toast } = useToast();
  const [partners, setPartners] = useState(PIPELINE);
  const [newPartner, setNewPartner] = useState({ name: "", pic: "", value: 0 });

  const handleAdd = () => {
    setPartners([...partners, { id: Date.now(), ...newPartner, status: "PROPOSAL_SENT" }]);
    toast({ title: "Target Sponsor Ditambahkan" });
  };

  const updateStatus = (id: number, status: string) => {
    setPartners(partners.map(p => p.id === id ? { ...p, status } : p));
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'DEAL': return 'bg-green-100 text-green-800 border-green-200';
      case 'NEGOTIATION': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Hitung Total Deal
  const totalFunding = partners
    .filter(p => p.status === 'DEAL')
    .reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <div>
             <h2 className="text-3xl font-bold font-headline text-primary">Sponsorship CRM</h2>
             <p className="text-muted-foreground">Pipeline pencarian dana & kerjasama.</p>
          </div>
          <Card className="bg-green-600 text-white border-none px-6 py-2">
             <div className="text-xs opacity-80 uppercase font-bold">Total Funding Secured</div>
             <div className="text-2xl font-black">Rp {totalFunding.toLocaleString('id-ID')}</div>
          </Card>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {['PROPOSAL_SENT', 'NEGOTIATION', 'DEAL', 'REJECTED'].map((stage) => (
             <div key={stage} className="bg-muted/30 p-4 rounded-xl min-h-[400px]">
                <h3 className="font-bold text-sm text-muted-foreground mb-4 uppercase flex items-center gap-2">
                   {stage === 'DEAL' ? <CheckCircle2 className="w-4 h-4"/> : stage === 'REJECTED' ? <XCircle className="w-4 h-4"/> : <Briefcase className="w-4 h-4"/>}
                   {stage.replace('_', ' ')}
                </h3>
                
                <div className="space-y-3">
                   {partners.filter(p => p.status === stage).map(p => (
                      <Card key={p.id} className="cursor-pointer hover:shadow-md transition-all">
                         <CardContent className="p-4">
                            <div className="font-bold text-lg">{p.name}</div>
                            <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                               <Phone className="w-3 h-3"/> {p.pic}
                            </div>
                            <div className="flex justify-between items-center">
                               <Badge variant="outline" className="font-mono">Rp {p.value.toLocaleString('id-ID', { notation: 'compact' })}</Badge>
                               
                               {/* Quick Move Button */}
                               {stage !== 'DEAL' && stage !== 'REJECTED' && (
                                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => updateStatus(p.id, stage === 'PROPOSAL_SENT' ? 'NEGOTIATION' : 'DEAL')}>
                                     →
                                  </Button>
                               )}
                            </div>
                         </CardContent>
                      </Card>
                   ))}
                   
                   {stage === 'PROPOSAL_SENT' && (
                      <Dialog>
                         <DialogTrigger asChild>
                            <Button variant="outline" className="w-full border-dashed text-muted-foreground">
                               <Plus className="w-4 h-4 mr-2"/> Target Baru
                            </Button>
                         </DialogTrigger>
                         <DialogContent>
                            <DialogHeader><DialogTitle>Input Target Sponsor</DialogTitle></DialogHeader>
                            <div className="space-y-4 py-4">
                               <Input placeholder="Nama Perusahaan" onChange={e => setNewPartner({...newPartner, name: e.target.value})} />
                               <Input placeholder="Nama PIC / Kontak" onChange={e => setNewPartner({...newPartner, pic: e.target.value})} />
                               <Input type="number" placeholder="Potensi Nilai (Rp)" onChange={e => setNewPartner({...newPartner, value: Number(e.target.value)})} />
                               <Button onClick={handleAdd} className="w-full">Simpan ke Pipeline</Button>
                            </div>
                         </DialogContent>
                      </Dialog>
                   )}
                </div>
             </div>
          ))}
       </div>
    </div>
  );
}
