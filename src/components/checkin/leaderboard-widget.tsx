'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { getLeaderboard } from '@/app/checkin/actions';

export function LeaderboardWidget() {
  const [data, setData] = useState<{ team: string, votes: number, percent: number }[]>([]);

  useEffect(() => {
    getLeaderboard().then(setData);
  }, []);

  return (
    <Card className="mt-6 border border-border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-headline flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Live Dukungan Penonton
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-bold">{item.team}</span>
              <span className="text-muted-foreground">{item.votes} Suara</span>
            </div>
            <div className="flex items-center gap-2">
                <Progress value={item.percent} className="h-2" />
                <span className="text-xs font-mono w-8 text-right">{item.percent}%</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
