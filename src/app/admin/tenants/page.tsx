'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Store, MapPin, CheckCircle, AlertCircle } from "lucide-react";

const TENANTS = [
  { id: "B01", name: "Es Teh Solo", owner: "Ibu Ani", category: "F&B", slot: "A-01", status: "PAID" },
  { id: "B02", name: "Jersey Murah Bandung", owner: "Kang Ujang", category: "APPAREL", slot: "B-03", status: "UNPAID" },
];

export default function TenantPage() {
  const [tenants, setTenants] = useState(TENANTS);

  const toggleStatus = (id: string) => {
    setTenants(tenants.map(t => t.id === id ? { ...t, status: 'PAID' } : t));
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <div>
             <h2 className="text-3xl font-bold font-headline flex items-center gap-2">
                <Store className="w-8 h-8 text-orange-500"/> Bazaar Control
             </h2>
             <p className="text-muted-foreground">Manajemen penyewa lapak / tenant venue.</p>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* MAP VISUALIZATION (Simulasi) */}
          <Card className="bg-zinc-900 text-white border-none">
             <CardContent className="p-6">
                <h3 className="text-sm font-bold uppercase text-zinc-500 mb-4">Denah Lapak</h3>
                <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold">
                   <div className="bg-green-600 p-4 rounded">A-01<br/>(Terisi)</div>
                   <div className="bg-zinc-800 p-4 rounded border border-dashed border-zinc-600">A-02<br/>(Kosong)</div>
                   <div className="bg-green-600 p-4 rounded">B-03<br/>(Terisi)</div>
                   <div className="bg-zinc-800 p-4 rounded border border-dashed border-zinc-600">B-04<br/>(Kosong)</div>
                </div>
             </CardContent>
          </Card>

          {/* LIST TENANT */}
          <Card className="md:col-span-2">
             <CardContent className="p-0">
                <Table>
                   <TableHeader>
                      <TableRow><TableHead>Tenant</TableHead><TableHead>Lapak</TableHead><TableHead>Kategori</TableHead><TableHead>Status Sewa</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow>
                   </TableHeader>
                   <TableBody>
                      {tenants.map((t) => (
                         <TableRow key={t.id}>
                            <TableCell>
                               <div className="font-bold">{t.name}</div>
                               <div className="text-xs text-muted-foreground">{t.owner}</div>
                            </TableCell>
                            <TableCell><Badge variant="outline">{t.slot}</Badge></TableCell>
                            <TableCell>{t.category}</TableCell>
                            <TableCell>
                               {t.status === 'PAID' ? 
                                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Lunas</Badge> : 
                                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Belum Bayar</Badge>
                               }
                            </TableCell>
                            <TableCell className="text-right">
                               {t.status === 'UNPAID' && (
                                  <Button size="sm" onClick={() => toggleStatus(t.id)}>Verifikasi Bayar</Button>
                               )}
                            </TableCell>
                         </TableRow>
                      ))}
                   </TableBody>
                </Table>
             </CardContent>
          </Card>
       </div>
    </div>
  );
}