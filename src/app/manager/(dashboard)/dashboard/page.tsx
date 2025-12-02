import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  // Mock data tim yang sudah didaftarkan oleh manajer ini
  const myTeams = [
    // { id: 1, name: "PB Juara", category: "Beregu PUTRA", status: "DRAFT" } // Contoh data
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-bold font-headline">Dashboard Saya</h1>
            <p className="text-muted-foreground">Kelola pendaftaran tim dan pembayaran Anda di sini.</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/manager/register-team">
                <PlusCircle className="w-4 h-4 mr-2" /> Daftarkan Tim Baru
            </Link>
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Tim Terdaftar</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">0 Tim</div></CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Status Pembayaran</CardTitle></CardHeader>
            <CardContent className="flex items-center gap-2"><AlertCircle className="w-5 h-5 text-yellow-500" /><div className="text-lg font-semibold">Belum Ada Tagihan</div></CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Verifikasi TPF</CardTitle></CardHeader>
            <CardContent><div className="text-lg font-semibold text-muted-foreground">-</div></CardContent>
        </Card>
      </div>

      {/* Empty State / List Tim */}
      <Card className="border-dashed border-2 bg-secondary/5">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <div className="p-4 bg-background rounded-full shadow-sm">
                <PlusCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-1">
                <h3 className="font-bold text-lg">Belum ada tim yang didaftarkan</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                    Silakan klik tombol "Daftarkan Tim Baru" untuk mulai mengisi data pemain dan kategori.
                </p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
