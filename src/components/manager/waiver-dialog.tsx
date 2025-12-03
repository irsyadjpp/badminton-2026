
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface WaiverDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAccept: () => void;
}

export function WaiverDialog({ open, onOpenChange, onAccept }: WaiverDialogProps) {
    const [scrolledToBottom, setScrolledToBottom] = useState(false);
    const [dateString, setDateString] = useState(''); 

    useEffect(() => {
        const date = new Date();
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('id-ID', options);
        setDateString(formattedDate);
    }, []);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        const isBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 10;
        if (isBottom && !scrolledToBottom) {
            setScrolledToBottom(true); 
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl h-[90vh] flex flex-col p-6">
                <DialogHeader className="border-b pb-4">
                    <DialogTitle className="text-xl flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-6 h-6" />
                        Persetujuan Wajib: Waiver of Liability
                    </DialogTitle>
                    <DialogDescription>
                        Anda harus membaca dokumen ini hingga selesai sebelum menyetujui.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea 
                    className="flex-1 pr-6 py-4 border rounded-lg bg-gray-50 font-serif text-sm" 
                    onScrollCapture={handleScroll}
                >
                    <div className="space-y-4 text-justify p-4">
                        <h4 className="font-bold text-center mb-4 uppercase text-lg">SURAT PERNYATAAN PEMBEBASAN TUNTUTAN</h4>
                        
                        <p>
                            Saya yang bertanda tangan di bawah ini, selaku Manajer Tim, mewakili seluruh anggota tim yang terdaftar dalam 
                            <strong>Bandung Community Championship (BCC) 2026</strong>:
                        </p>
                        
                        <Separator className='my-4'/>

                        <ol className="list-decimal pl-5 space-y-4">
                            <li>
                                <strong>KONDISI KESEHATAN:</strong> Saya menjamin bahwa saya dan seluruh anggota tim berada dalam kondisi sehat jasmani dan rohani, serta tidak memiliki riwayat penyakit bawaan yang membahayakan diri jika melakukan aktivitas fisik intensitas tinggi.
                            </li>
                            <li>
                                <strong>PENERIMAAN RISIKO (ASSUMPTION OF RISK):</strong> Saya memahami sepenuhnya bahwa bulutangkis adalah olahraga yang memiliki risiko cedera fisik (ringan, berat, hingga fatal). Saya secara sadar mengambil risiko tersebut atas keinginan sendiri.
                            </li>
                            <li>
                                <strong>PELEPASAN TUNTUTAN (RELEASE):</strong> Saya melepaskan dan membebaskan Panitia Pelaksana BCC 2026, Sponsor (Ayo Indonesia, Bank BJB, dll), Pemilik Venue (GOR KONI), dan pihak terkait lainnya dari segala bentuk tanggung jawab hukum, tuntutan ganti rugi, atau klaim apapun apabila terjadi kecelakaan, cedera, atau kematian yang menimpa saya selama rangkaian acara berlangsung.
                            </li>
                            <li>
                                <strong>TINDAKAN MEDIS:</strong> Saya mengizinkan Tim Medis Panitia untuk memberikan pertolongan pertama (First Aid) jika terjadi keadaan darurat. Saya memahami bahwa biaya pengobatan lanjutan (Rumah Sakit/Operasi) adalah <strong class="font-bold">tanggung jawab saya pribadi</strong> atau asuransi/BPJS pribadi saya.
                            </li>
                            <li>
                                <strong>KEPATUHAN REGULASI (INTEGRITAS):</strong> Saya bersedia mematuhi seluruh peraturan pertandingan dan menerima keputusan TPF terkait verifikasi level. Saya menerima sanksi <strong class="font-bold">DISKUALIFIKASI</strong> tanpa pengembalian uang pendaftaran jika terbukti manipulasi data (Sandbagging).
                            </li>
                            <li>
                                <strong>HAK PUBLIKASI:</strong> Saya memberikan izin kepada Panitia dan Sponsor untuk mendokumentasikan dan menggunakan foto/video aktivitas saya selama turnamen untuk keperluan promosi tanpa menuntut royalti.
                            </li>
                        </ol>
                        
                        <Separator className='my-4'/>

                        <p className='text-sm text-right'>
                            Bandung, <strong class='font-bold'>{dateString}</strong>
                        </p>
                    </div>
                </ScrollArea>

                <DialogFooter className="pt-4 border-t">
                    <div className="flex justify-between items-center w-full">
                        <p className={`text-sm flex items-center gap-2 ${scrolledToBottom ? 'text-green-600' : 'text-red-600'}`}>
                           {scrolledToBottom ? <CheckCircle2 className='w-5 h-5 text-green-600'/> : 'Scroll ke bawah untuk mengaktifkan tombol.'}
                        </p>
                        
                        <Button 
                            onClick={onAccept} 
                            disabled={!scrolledToBottom}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Saya Setuju & Mengerti Syarat Ini
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
