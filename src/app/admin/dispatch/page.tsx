
'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, MapPin, Radio, CheckCircle2, User, ArrowRight, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getDispatchData, assignIncident, resolveIncident } from "./actions";

export default function DispatchPage() {
  const { toast } = useToast();
  const [data, setData] = useState<any>(null);
  const [loadingAction, setLoadingAction] = useState(false);
  
  // State untuk Assign Modal
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<string>("");

  // State untuk Resolve Modal
  const [resolveId, setResolveId] = useState<string | null>(null);
  const [resolveNotes, setResolveNotes] = useState("");

  const refreshData = () => {
    getDispatchData().then(setData);
  };

  useEffect(() => {
    refreshData();
    // Auto refresh tiap 5 detik (Real-time feel)
    const interval = setInterval(refreshData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAssign = async () => {
    if (!selectedIncident || !selectedUnit) return;
    setLoadingAction(true);
    
    const res = await assignIncident(selectedIncident, selectedUnit);
    if (res.success) {
      toast({ title: "Unit Dispatched", description: res.message });
      setSelectedIncident(null);
      refreshData();
    }
    setLoadingAction(false);
  };

  const handleResolve = async () => {
    if (!resolveId) return;
    setLoadingAction(true);
    
    const res = await resolveIncident(resolveId, resolveNotes);
    if (res.success) {
      toast({ title: "Incident Closed", description: res.message, className: "bg-green-600 text-white" });
      setResolveId(null);
      refreshData();
    }
    setLoadingAction(false);
  };

  if (!data) return <div className="p-8 bg-black min-h-screen text-white">Loading Dispatch System...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6 font-mono">
      
      {/* HEADER COMMANDER */}
      <div className="flex justify-between items-end mb-8 border-b border-zinc-800 pb-6">
        <div>
           <div className="text-xs text-primary font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
              <Radio className="w-4 h-4 animate-pulse" /> LIVE CHANNEL: SECURITY & MEDIS
           </div>
           <h1 className="text-4xl font-black font-headline uppercase">Dispatch HQ</h1>
        </div>
        <div className="flex gap-4 text-right">
           <div>
              <div className="text-2xl font-bold">{data.incidents.length}</div>
              <div className="text-xs text-zinc-500 uppercase">Active Alerts</div>
           </div>
           <div>
              <div className="text-2xl font-bold text-green-500">{data.units.filter((u:any) => u.status === 'IDLE').length}</div>
              <div className="text-xs text-zinc-500 uppercase">Units Idle</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KOLOM KIRI: INCOMING SOS LIST */}
        <div className="lg:col-span-2 space-y-4">
           <h2 className="text-sm font-bold text-zinc-400 uppercase mb-2">Active Incidents</h2>
           
           {data.incidents.length === 0 && (
             <div className="p-8 border border-zinc-800 rounded-xl text-center text-zinc-500 bg-zinc-900/50">
               <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-50"/>
               All systems normal. No active incidents.
             </div>
           )}

           {data.incidents.map((incident: any) => (
             <Card key={incident.id} className={`bg-zinc-900 border-l-4 ${incident.status === 'OPEN' ? 'border-l-red-500 animate-pulse' : 'border-l-yellow-500'}`}>
                <CardContent className="p-6 flex justify-between items-center">
                   <div>
                      <div className="flex items-center gap-3 mb-1">
                         <Badge variant="outline" className={`${incident.type === 'MEDIS' ? 'text-red-400 border-red-400' : 'text-blue-400 border-blue-400'}`}>
                            {incident.type}
                         </Badge>
                         <span className="text-zinc-500 text-xs">{incident.time} WIB</span>
                         {incident.status === 'OPEN' && <Badge className="bg-red-600">NEW SOS</Badge>}
                      </div>
                      <div className="text-xl font-bold text-white flex items-center gap-2">
                         <MapPin className="w-5 h-5 text-zinc-400" /> {incident.location}
                      </div>
                      <div className="text-sm text-zinc-400 mt-1">
                         Reported by: {incident.reportedBy} {incident.handler && `• Handler: ${incident.handler}`}
                      </div>
                   </div>

                   {/* ACTION BUTTONS */}
                   <div className="flex gap-2">
                      {incident.status === 'OPEN' ? (
                        <Dialog open={selectedIncident === incident.id} onOpenChange={(open) => !open && setSelectedIncident(null)}>
                           <DialogTrigger asChild>
                              <Button onClick={() => setSelectedIncident(incident.id)} className="bg-white text-black font-bold hover:bg-zinc-200">
                                 DISPATCH UNIT <ArrowRight className="ml-2 w-4 h-4"/>
                              </Button>
                           </DialogTrigger>
                           <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                              <DialogHeader><DialogTitle>Select Unit to Dispatch</DialogTitle></DialogHeader>
                              <div className="py-4 space-y-4">
                                 <Select onValueChange={setSelectedUnit}>
                                    <SelectTrigger className="bg-black border-zinc-700"><SelectValue placeholder="Pilih Petugas..." /></SelectTrigger>
                                    <SelectContent>
                                       {data.units.filter((u:any) => u.status === 'IDLE').map((u:any) => (
                                          <SelectItem key={u.id} value={u.name}>
                                             {u.name} ({u.role})
                                          </SelectItem>
                                       ))}
                                    </SelectContent>
                                 </Select>
                                 <Button onClick={handleAssign} disabled={loadingAction} className="w-full font-bold bg-primary hover:bg-red-700">
                                    {loadingAction ? <Loader2 className="animate-spin" /> : "CONFIRM ASSIGNMENT"}
                                 </Button>
                              </div>
                           </DialogContent>
                        </Dialog>
                      ) : (
                        <Dialog open={resolveId === incident.id} onOpenChange={(open) => !open && setResolveId(null)}>
                           <DialogTrigger asChild>
                              <Button onClick={() => setResolveId(incident.id)} variant="outline" className="border-green-600 text-green-500 hover:bg-green-900/20">
                                 MARK RESOLVED
                              </Button>
                           </DialogTrigger>
                           <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                              <DialogHeader><DialogTitle>Incident Resolution Report</DialogTitle></DialogHeader>
                              <div className="py-4 space-y-4">
                                 <Textarea 
                                    placeholder="Catatan penyelesaian (misal: Korban sudah dibawa ke RS)..." 
                                    className="bg-black border-zinc-700"
                                    onChange={(e) => setResolveNotes(e.target.value)}
                                 />
                                 <Button onClick={handleResolve} disabled={loadingAction} className="w-full font-bold bg-green-600 hover:bg-green-700">
                                    {loadingAction ? <Loader2 className="animate-spin" /> : "CLOSE TICKET"}
                                 </Button>
                              </div>
                           </DialogContent>
                        </Dialog>
                      )}
                   </div>
                </CardContent>
             </Card>
           ))}
        </div>

        {/* KOLOM KANAN: UNIT STATUS (AVAILABLE STAFF) */}
        <div>
           <h2 className="text-sm font-bold text-zinc-400 uppercase mb-4">Unit Status</h2>
           <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-0">
                 {data.units.map((unit: any, i:number) => (
                    <div key={unit.id} className={`flex items-center justify-between p-4 border-b border-zinc-800 last:border-0 ${unit.status === 'BUSY' ? 'bg-zinc-900/50 opacity-60' : ''}`}>
                       <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${unit.status === 'IDLE' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500'}`}></div>
                          <div>
                             <div className="font-bold text-white text-sm">{unit.name}</div>
                             <div className="text-xs text-zinc-500">{unit.role} • {unit.status}</div>
                          </div>
                       </div>
                       <Button size="icon" variant="ghost" className="text-zinc-500"><User className="w-4 h-4"/></Button>
                    </div>
                 ))}
              </CardContent>
           </Card>
        </div>

      </div>
    </div>
  );
}
