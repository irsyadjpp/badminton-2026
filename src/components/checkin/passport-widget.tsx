'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, CheckCircle, Gift } from 'lucide-react';
import { visitBooth } from '@/app/checkin/actions';
import { useToast } from '@/hooks/use-toast';

const BOOTHS = [
  { id: 'bjb', name: 'Bank BJB' },
  { id: 'yonex', name: 'Yonex' },
  { id: 'pocari', name: 'Pocari' },
  { id: 'kopi', name: 'Kopi' },
];

export function PassportWidget({ visitorId }: { visitorId: string }) {
  const [stamps, setStamps] = useState<string[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSimulateScan = async (boothId: string) => {
    setLoading(boothId);
    const result = await visitBooth(visitorId, boothId);
    
    if (result.success) {
      setStamps(prev => [...prev, boothId]);
      toast({
        title: "Stamp Berhasil! 🎉",
        description: result.message,
      });
    }
    setLoading(null);
  };

  const allCollected = stamps.length === BOOTHS.length;

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-b from-background to-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-headline flex items-center gap-2">
          <QrCode className="w-5 h-5 text-primary" />
          Sponsor Passport
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Kunjungi booth & scan QR untuk 3x lipat peluang doorprise!
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {BOOTHS.map((booth) => {
            const isCollected = stamps.includes(booth.id);
            return (
              <button
                key={booth.id}
                onClick={() => !isCollected && handleSimulateScan(booth.id)}
                disabled={isCollected || loading === booth.id}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center p-1 transition-all relative ${
                  isCollected 
                    ? 'bg-primary text-primary-foreground shadow-md scale-105' 
                    : 'bg-secondary/50 text-muted-foreground hover:bg-secondary border-2 border-dashed border-muted-foreground/30'
                }`}
              >
                {isCollected ? (
                  <CheckCircle className="w-6 h-6 animate-in zoom-in spin-in-180 duration-500" />
                ) : (
                  <span className="text-[10px] font-bold text-center leading-tight">
                    {loading === booth.id ? '...' : booth.name}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {allCollected && (
          <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-3 rounded-lg flex items-center gap-3 animate-in slide-in-from-bottom-2">
            <Gift className="w-8 h-8 text-yellow-600" />
            <div className="text-xs">
              <strong>Misi Selesai!</strong> <br/>
              Peluang doorprise Anda kini dikalikan 3!
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
