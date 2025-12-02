'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, QrCode, Target } from "lucide-react";

// Simulasi Data Scan
const sponsorData = [
  { name: 'Bank BJB', scans: 450, color: 'hsl(var(--chart-1))' },
  { name: 'Yonex', scans: 620, color: 'hsl(var(--chart-2))' },
  { name: 'Pocari Sweat', scans: 380, color: 'hsl(var(--chart-3))' },
  { name: 'Kopi Kenangan', scans: 510, color: 'hsl(var(--chart-4))' },
];

const totalScans = sponsorData.reduce((acc, sponsor) => acc + sponsor.scans, 0);
const totalVisitors = 850; // Anggap ada 850 pengunjung unik

const recentScans = [
    { visitor: "Budi Santoso", booth: "Yonex", time: "15:32" },
    { visitor: "Siti Aminah", booth: "Bank BJB", time: "15:31" },
    { visitor: "Rizky Febian", booth: "Kopi Kenangan", time: "15:30" },
    { visitor: "Dewi Persik", booth: "Yonex", time: "15:29" },
    { visitor: "Agus Kotak", booth: "Pocari Sweat", time: "15:28" },
];

export default function AnalyticsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold font-headline">Laporan Sponsor</h2>
                <p className="text-muted-foreground">
                    Data real-time dari aktivitas scan QR di booth sponsor.
                </p>
            </div>

            {/* STATS OVERVIEW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Scan Booth</CardTitle>
                        <QrCode className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalScans.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Di semua booth sponsor</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pengunjung Terlibat</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalVisitors.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Pengunjung yang melakukan scan</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rata-rata Scan</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{(totalScans / totalVisitors).toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Per pengunjung yang terlibat</p>
                    </CardContent>
                </Card>
            </div>

            {/* GRAFIK & TABEL */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* GRAFIK */}
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Performa Scan per Booth</CardTitle>
                        <CardDescription>Perbandingan jumlah scan untuk setiap sponsor.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] w-full">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sponsorData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis 
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'hsl(var(--background))', 
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: 'var(--radius)'
                                    }}
                                    cursor={{ fill: 'hsl(var(--secondary))' }}
                                />
                                <Bar dataKey="scans" name="Total Scans" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* TABEL SCAN TERAKHIR */}
                <Card className="lg:col-span-2">
                     <CardHeader>
                        <CardTitle>Aktivitas Terkini</CardTitle>
                        <CardDescription>5 scan terakhir yang tercatat.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Pengunjung</TableHead>
                                    <TableHead>Booth</TableHead>
                                    <TableHead>Waktu</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentScans.map((scan, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="font-medium">{scan.visitor}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{scan.booth}</Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{scan.time}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                         </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
