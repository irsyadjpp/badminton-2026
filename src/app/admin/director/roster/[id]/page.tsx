
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getCommitteeRoster } from '../actions';
import { type CommitteeMember } from '@/lib/schemas/committee';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Mail, Phone, GraduationCap, Briefcase, Sparkles, Star, ClipboardList, ThumbsUp } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

function InfoField({ icon, label, value, isBadge, badgeVariant }: { icon: React.ReactNode, label: string, value?: string, isBadge?: boolean, badgeVariant?: any }) {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3">
            <div className="text-muted-foreground w-5 h-5 mt-0.5">{icon}</div>
            <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                {isBadge ? (
                    <Badge variant={badgeVariant || "secondary"}>{value}</Badge>
                ) : (
                    <p className="font-semibold text-foreground">{value}</p>
                )}
            </div>
        </div>
    );
}

export default function RosterDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [member, setMember] = useState<CommitteeMember | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            const fetchMember = async () => {
                const roster = await getCommitteeRoster();
                const foundMember = roster.find(m => m.id === id);
                setMember(foundMember || null);
                setIsLoading(false);
            };
            fetchMember();
        }
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-muted-foreground">Loading member data...</div>
            </div>
        );
    }

    if (!member) {
        return (
            <div className="text-center">
                <h2 className="text-2xl font-bold">Anggota Tidak Ditemukan</h2>
                <p className="text-muted-foreground">Data panitia dengan ID ini tidak ada di roster.</p>
                <Button onClick={() => router.back()} className="mt-4">Kembali</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold font-headline">{member.name}</h1>
                    <p className="text-muted-foreground">{member.expertise}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Kolom Kiri: Foto & Info Utama */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardContent className="pt-6 flex flex-col items-center text-center">
                            <Avatar className="w-24 h-24 mb-4 border-2 border-primary">
                                <AvatarImage src={member.photoUrl} alt={member.name} />
                                <AvatarFallback className="text-3xl">{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <h2 className="text-xl font-bold">{member.name}</h2>
                            <p className="text-sm text-primary font-semibold">{member.expertise}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Informasi Kontak</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <InfoField icon={<Mail />} label="Email" value={member.email} />
                            <InfoField icon={<Phone />} label="WhatsApp" value={member.phone} />
                        </CardContent>
                    </Card>
                </div>

                {/* Kolom Kanan: Detail Lainnya */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Latar Belakang</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <InfoField icon={<GraduationCap />} label="Pendidikan Terakhir" value={member.education} isBadge />
                             <InfoField icon={<Briefcase />} label="Status Saat Ini" value={member.status} isBadge />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Preferensi & Motivasi</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InfoField icon={<Star />} label="Pilihan Divisi 1 (Prioritas)" value={member.division1?.split(':')[0]} isBadge badgeVariant="default" />
                                <InfoField icon={<ClipboardList />} label="Pilihan Divisi 2 (Cadangan)" value={member.division2?.split(':')[0]} isBadge />
                            </div>
                            <Separator />
                            <InfoField icon={<ThumbsUp />} label="Alasan Bergabung / Motivasi" value={member.reason} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

    