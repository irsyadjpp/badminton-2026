
'use client';

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eraser, Package, Ambulance, Wrench, CheckCircle2, ArrowRight } from "lucide-react";
import { getActiveRequests, updateRequestStatus, type ServiceRequest } from "./actions";

export default function CourtServiceDashboard() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);

  // Real-time polling
  useEffect(() => {
    getActiveRequests().then(setRequests);
    const interval = setInterval(() => {
      getActiveRequests().then(setRequests);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (id: string, currentStatus: string) => {
    const next = currentStatus === 'PENDING' ? 'ON_THE_WAY' : 'DONE';
    await updateRequestStatus(id, next);
    getActiveRequests().then(setRequests);
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'MOP': return <Eraser className="w-8 h-8 text-blue-500" />;
      case 'SHUTTLE': return <Package className="w-8 h-8 text-yellow-500" />;
      case 'MEDIC': return <Ambulance className="w-8 h-8 text-red-500" />;
      default: return <Wrench className="w-8 h-8 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-black font-headline mb-6 text-yellow-500 uppercase">Runner Dashboard</h1>
      
      <div className="space-y-4">
        {requests.length === 0 && (
          <div className="text-center py-10 text-zinc-500">Standby... Belum ada panggilan.</div>
        )}

        {requests.map((req) => (
          <Card key={req.id} className={`border-l-8 ${req.status === 'PENDING' ? 'border-l-red-500 animate-pulse' : 'border-l-blue-500'} bg-zinc-900`}>
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-zinc-800 rounded-full">{getIcon(req.type)}</div>
                <div>
                  <div className="text-3xl font-black">COURT {req.court}</div>
                  <div className="text-lg font-bold text-zinc-300">{req.type} REQUEST</div>
                  <div className="text-xs text-zinc-500">{req.time} WIB</div>
                </div>
              </div>
              
              <Button 
                onClick={() => handleAction(req.id, req.status)}
                className={`h-16 w-24 font-bold text-lg ${req.status === 'PENDING' ? 'bg-white text-black hover:bg-zinc-200' : 'bg-green-600 hover:bg-green-700 text-white'}`}
              >
                {req.status === 'PENDING' ? "AMBIL" : "SELESAI"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
