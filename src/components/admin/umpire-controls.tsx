
'use client';

import { Button } from "@/components/ui/button";
import { Eye, Hand, XCircle, ArrowUpFromLine } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Komponen ini dipasang di dalam halaman Scoring
export function UmpireControls({ onFault, onOverrule }: any) {
  const { toast } = useToast();

  const handleFault = (type: string) => {
      onFault(); // Callback untuk tambah poin lawan
      toast({ title: `FAULT: ${type}`, className: "bg-red-600 text-white" });
  };

  return (
    <div className="grid grid-cols-2 gap-2">
        {/* FAULT CONTROLS */}
        <div className="space-y-2">
            <p className="text-[10px] text-muted-foreground uppercase font-bold text-center">Service Faults</p>
            <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="h-12 border-red-200 hover:bg-red-50 text-red-600 flex flex-col gap-0" onClick={() => handleFault("Too High")}>
                    <ArrowUpFromLine className="w-4 h-4" /> <span className="text-[9px]">TINGGI</span>
                </Button>
                <Button variant="outline" size="sm" className="h-12 border-red-200 hover:bg-red-50 text-red-600 flex flex-col gap-0" onClick={() => handleFault("Stepping")}>
                    <XCircle className="w-4 h-4" /> <span className="text-[9px]">INJAK GARIS</span>
                </Button>
                <Button variant="outline" size="sm" className="h-12 border-red-200 hover:bg-red-50 text-red-600 flex flex-col gap-0 col-span-2" onClick={() => handleFault("Receiver Move")}>
                    <Hand className="w-4 h-4" /> <span className="text-[9px]">GERAK DULUAN (Receiver)</span>
                </Button>
            </div>
        </div>

        {/* LINE JUDGE CONTROLS */}
        <div className="space-y-2">
            <p className="text-[10px] text-muted-foreground uppercase font-bold text-center">Line Judge Correction</p>
            <Button variant="secondary" className="w-full h-24 bg-zinc-800 text-white hover:bg-zinc-700 flex flex-col gap-1" onClick={() => { onOverrule(); toast({title: "CORRECTION CALLED", description: "Wasit mengoreksi keputusan hakim garis."}); }}>
                <Eye className="w-8 h-8 text-yellow-400" />
                <span className="font-bold">CORRECTION / OVERRULE</span>
                <span className="text-[9px] font-normal text-zinc-400">(Ubah In/Out)</span>
            </Button>
        </div>
    </div>
  );
}

