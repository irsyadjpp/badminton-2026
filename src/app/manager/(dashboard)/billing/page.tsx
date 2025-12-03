
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, FileWarning, ShoppingCart, QrCode } from "lucide-react";

// Mock Data Tagihan
const mockInvoices = [
  { id: "INV001", date: "2026-06-14 10:30", description: "Penggunaan 2 Shuttlecock (Lapangan 1)", amount: 50000, type: "shuttlecock" },
  { id: "INV002", date: "2026-06-14 11:15", description: "Kartu Kuning - Pemain Budi (MD-INT-1)", amount: 50000, type: "penalty" },
  { id: "INV003", date: "2026-06-15 09:45", description: "Penggunaan 1 Shuttlecock (Lapangan 3)", amount: 25000, type: "shuttlecock" },
  { id: "INV004", date: "2026-06-15 13:00", description: "Denda Keterlambatan Tim", amount: 100000, type: "penalty" },
];

const totalAmount = mockInvoices.reduce((sum, inv) => sum + inv.amount, 0);
const shuttlecockAmount = mockInvoices.filter(inv => inv.type === 'shuttlecock').reduce((sum, inv) => sum + inv.amount, 0);
const penaltyAmount = mockInvoices.filter(inv => inv.type === 'penalty').reduce((sum, inv) => sum + inv.amount, 0);


export default function BillingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black font-headline text-destructive">Tagihan & Denda</h1>
        <p className="text-muted-foreground">
            Lakukan pembayaran untuk semua tagihan insidental seperti shuttlecock dan denda kartu.
        </p>
      </div>

      {/* OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-destructive/10 border-destructive">
            <CardHeader>
                <CardTitle className="text-destructive">Total Tagihan</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-black text-destructive">
                    Rp {totalAmount.toLocaleString('id-ID')}
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Biaya Shuttlecock</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">Rp {shuttlecockAmount.toLocaleString('id-ID')}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Denda</CardTitle>
                <FileWarning className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">Rp {penaltyAmount.toLocaleString('id-ID')}</div>
            </CardContent>
        </Card>
      </div>

      {/* TABEL RINCIAN */}
      <Card>
        <CardHeader>
          <CardTitle>Rincian Tagihan</CardTitle>
          <CardDescription>
            Berikut adalah daftar semua transaksi yang belum dibayar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal & Waktu</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="text-muted-foreground text-xs">{invoice.date}</TableCell>
                  <TableCell className="font-medium flex items-center gap-2">
                    {invoice.type === 'penalty' ? (
                        <Badge variant="destructive">Denda</Badge>
                    ) : (
                        <Badge variant="secondary">Penggunaan</Badge>
                    )}
                    {invoice.description}
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold">Rp {invoice.amount.toLocaleString('id-ID')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="bg-secondary/20 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="text-left flex-1">
               <p className="text-sm text-muted-foreground">
                    Pembayaran untuk semua item di atas harus dilakukan secara <strong className="text-foreground">kolektif (satu kali bayar)</strong>, tidak bisa per-item.
               </p>
           </div>
           <div className="flex items-center gap-4">
               <div className="text-right">
                   <p className="text-xs text-muted-foreground">Total Bayar</p>
                   <p className="font-bold text-lg text-destructive">Rp {totalAmount.toLocaleString('id-ID')}</p>
               </div>
               <Button className="bg-primary hover:bg-primary/90 h-12">
                   <QrCode className="w-4 h-4 mr-2" />
                   Bayar Sekarang
               </Button>
           </div>
        </CardFooter>
      </Card>

    </div>
  );
}
