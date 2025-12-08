
'use client';

import { Button } from "@/components/ui/button";
import { Printer, FileText } from "lucide-react";
import Link from 'next/link';

export default function ProtestPrintPage() {
  const MOCK_SESSION_MANAGER = { name: "Nama Manajer", team: "Nama Tim Komunitas", wa: "+62812..." };
  
  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      
      {/* Toolbar Cetak */}
      <div className="w-full max-w-[210mm] mb-6 flex justify-end gap-2 print:hidden">
        <Button onClick={() => window.print()} className="bg-primary text-white">
            <Printer className="w-4 h-4 mr-2" /> Cetak Formulir
        </Button>
        <Button variant="secondary" className="text-sm" asChild>
            <Link href="/manager/protest/submit">Kembali ke Form Digital</Link>
        </Button>
      </div>

      {/* Kertas A4 */}
      <div className="bg-white w-full max-w-[210mm] min-h-[297mm] p-[15mm] shadow-xl print:shadow-none print:m-0 text-black font-serif leading-relaxed text-sm md:text-base border border-gray-300">
        
        {/* KOP SURAT */}
        <div className="text-center border-b-2 border-black pb-4 mb-6 text-xs md:text-sm">
            <p className="font-bold uppercase tracking-wider">PANITIA PELAKSANA BCC 2026</p>
            <p>Sekretariat: GOR BBR, Jl. Komp. Buah Batu Regency</p>
        </div>

        {/* JUDUL */}
        <div className="text-center mb-6">
            <h3 className="font-bold text-lg underline decoration-1 underline-offset-4">FORMULIR PENGAJUAN PROTES</h3>
            <span className="font-bold text-sm">(OFFICIAL PROTEST FORM)</span>
            <p className="text-xs mt-2">No. Registrasi Protes: PRT/....../....../2026 (Diisi Panitia)</p>
        </div>

        {/* BAGIAN I: IDENTITAS PELAPOR */}
        <h4 className="font-bold text-base mb-2 underline">BAGIAN I: IDENTITAS PELAPOR (WAJIB MANAJER TIM)</h4>
        <p className="text-xs mb-4">Sesuai aturan, protes hanya boleh diajukan oleh Manajer Tim yang terdaftar.</p>

        <table className="w-full mb-4 text-sm">
            <tbody>
                <tr><td className="w-48 py-1">Nama Manajer</td><td className="border-b border-dashed border-gray-400">: {MOCK_SESSION_MANAGER.name}</td></tr>
                <tr><td className="w-48 py-1">Nama Tim/Komunitas</td><td className="border-b border-dashed border-gray-400">: {MOCK_SESSION_MANAGER.team}</td></tr>
                <tr><td className="w-48 py-1">No. HP / WhatsApp</td><td className="border-b border-dashed border-gray-400">: {MOCK_SESSION_MANAGER.wa}</td></tr>
                <tr><td className="w-48 py-1">Kategori Pertandingan</td><td className="border-b border-dashed border-gray-400">: [ ] Putra [ ] Putri [ ] Campuran</td></tr>
            </tbody>
        </table>

        {/* DETAIL KEJADIAN */}
        <h4 className="font-bold text-base mb-2 underline mt-6">DETAIL KEJADIAN (INCIDENT DETAILS)</h4>
        <table className="w-full mb-4 text-sm">
            <tbody>
                <tr><td className="w-48 py-1">Waktu Kejadian</td><td className="border-b border-dashed border-gray-400">:</td></tr>
                <tr><td className="w-48 py-1">No. Lapangan</td><td className="border-b border-dashed border-gray-400">:</td></tr>
                <tr><td className="w-48 py-1">Partai Ke-</td><td className="border-b border-dashed border-gray-400">:</td></tr>
                <tr><td className="w-48 py-1">Nama Tim Terlapor</td><td className="border-b border-dashed border-gray-400">:</td></tr>
                <tr><td className="w-48 py-1">Nama Pemain Terlapor</td><td className="border-b border-dashed border-gray-400">:</td></tr>
            </tbody>
        </table>

        {/* JENIS PELANGGARAN */}
        <h4 className="font-bold text-base mb-2 underline mt-6">JENIS PELANGGARAN YANG DILAPORKAN:</h4>
        <div className="text-sm space-y-1">
            <p>[ ] SANDBAGGING (Manipulasi Level): Kemampuan teknis pemain lawan jauh melebihi level kategori yang didaftarkan.</p>
            <p>[ ] JOKI (Pemalsuan Identitas): Wajah pemain di lapangan tidak sesuai dengan KTP/Video Verifikasi.</p>
            <p>[ ] ADMINISTRASI (Double Play): Pemain lawan bermain rangkap dalam satu pertemuan (Tie).</p>
            <p>[ ] LAINNYA: ..........................................................................................................</p>
        </div>
        
        <h4 className="font-bold text-base mb-2 underline mt-4">BUKTI & KETERANGAN TAMBAHAN:</h4>
        <div className="h-16 border border-dashed border-gray-400 mb-6"></div>


        {/* PERNYATAAN JAMINAN */}
        <h4 className="font-bold text-base mb-2 underline mt-6">PERNYATAAN JAMINAN & DEPOSIT</h4>
        <p className="text-sm mb-4">Bersama formulir ini, saya menyerahkan <strong>UANG JAMINAN PROTES (DEPOSIT) Rp 500.000,-</strong> secara tunai.</p>
        
        <div className="flex justify-between items-end pt-8">
            <div className="w-1/3 text-center text-sm font-bold">
                Bandung, .............................. 2026
                <div className="mt-2 text-xs font-normal">(Tempel Materai Rp 10.000)</div>
                <div className="h-20 border border-dashed border-black mt-2 flex items-center justify-center text-xs">
                    AREA MATERAI
                </div>
            </div>
            <div className="w-1/3 text-center text-sm font-bold">
                <div className="mb-2">Manajer Tim (Pelapor)</div>
                <div className="h-4 border-b border-dashed border-black mt-10"></div>
                <div className="mt-2 text-sm">( Tanda Tangan & Nama Jelas )</div>
            </div>
        </div>

        {/* BAGIAN II: KEPUTUSAN REFEREE / PANITIA */}
        <h4 className="font-bold text-base mb-2 underline mt-10">BAGIAN II: KEPUTUSAN REFEREE / PANITIA (Diisi oleh Referee)</h4>
        
        <p className="text-sm font-bold mt-4">HASIL INVESTIGASI: [ ] PROTES DITERIMA (ACCEPTED)</p>
        <div className="text-xs ml-4 mt-1">
            <p>* Sanksi yang diberikan: [ ] Diskualifikasi Pemain [ ] Diskualifikasi Tim [ ] Skor Dibatalkan</p>
            <p>* Uang Jaminan: DIKEMBALIKAN</p>
        </div>
        
        <p className="text-sm font-bold mt-4">HASIL INVESTIGASI: [ ] PROTES DITOLAK (REJECTED)</p>
        <div className="text-xs ml-4 mt-1">
            <p>* Alasan Penolakan: ................................................................................</p>
            <p>* Uang Jaminan: HANGUS</p>
        </div>
        
        <div className="flex justify-end pt-12 text-sm">
            <div className="w-1/2 text-center">
                <div className="h-4 border-b border-dashed border-black mt-8"></div>
                <div className="mt-2 text-sm">( Tanda Tangan Referee / Panitia Pertandingan )</div>
            </div>
        </div>

      </div>
    </div>
  );
}
