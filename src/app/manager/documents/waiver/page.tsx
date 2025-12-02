'use client';

import { useEffect, useState } from "react";
import { XCircle, FileText } from "lucide-react";

export default function WaiverPrintPage() {
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    setDateStr(date.toLocaleDateString('id-ID', options));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 print:p-0 flex justify-center">
      
      {/* Kertas A4 (Printable Area) */}
      <div className="bg-white w-full max-w-[210mm] min-h-[297mm] p-[20mm] shadow-lg print:shadow-none print:m-0 text-black font-serif leading-relaxed text-sm md:text-base">
        
        {/* KOP SURAT */}
        <div className="text-center border-b-2 border-black pb-6 mb-6 text-sm">
            <p className="font-bold uppercase tracking-wider">PANITIA PELAKSANA</p>
            <h1 className="font-bold text-xl uppercase mb-2">BANDUNG COMMUNITY CHAMPIONSHIP (BCC) 2026</h1>
            <p>Sekretariat: GOR BBR, Jl. Komp. Buah Batu Regency, Kota Bandung</p>
        </div>

        {/* JUDUL */}
        <div className="text-center mb-8">
            <h3 className="font-bold text-lg underline decoration-1 underline-offset-4">SURAT PERNYATAAN KEIKUTSERTAAN & PEMBEBASAN TUNTUTAN</h3>
            <span className="font-bold text-sm">(WAIVER OF LIABILITY & RELEASE)</span>
        </div>

        {/* ISI WAIVER (Sesuai Dokumen Legal) */}
        <div className="space-y-4 text-justify">
            <p>Saya yang bertanda tangan di bawah ini, selaku <strong>Manajer Tim</strong> yang mewakili seluruh anggota tim yang terdaftar:</p>

            <table className="w-full mb-4 text-sm border-collapse">
                <tbody>
                    <tr><td className="w-48 py-1">Nama Lengkap</td><td className="border-b border-dashed border-gray-400">: </td></tr>
                    <tr><td className="w-48 py-1">No. KTP (NIK)</td><td className="border-b border-dashed border-gray-400">: </td></tr>
                    <tr><td className="w-48 py-1">Nama Tim/Komunitas</td><td className="border-b border-dashed border-gray-400">: </td></tr>
                    <tr><td className="w-48 py-1">No. HP/WhatsApp</td><td className="border-b border-dashed border-gray-400">: </td></tr>
                    <tr><td className="w-48 py-1">Alamat Domisili</td><td className="border-b border-dashed border-gray-400">: </td></tr>
                </tbody>
            </table>

            <p>
                Sehubungan dengan keikutsertaan saya/tim saya dalam turnamen <strong>Bandung Community Championship (BCC) 2026</strong> yang diselenggarakan di GOR KONI Bandung pada bulan Juni - Juli 2026, dengan ini saya menyatakan dengan sadar dan tanpa paksaan bahwa:
            </p>

            <ol className="list-decimal pl-5 space-y-3">
                <li>
                    <strong>KONDISI KESEHATAN:</strong> Saya menjamin bahwa saya (dan seluruh anggota tim yang saya wakili) saat ini dalam kondisi sehat jasmani dan rohani, serta tidak memiliki riwayat penyakit bawaan yang membahayakan diri jika melakukan aktivitas fisik intensitas tinggi.
                </li>
                <li>
                    <strong>PENERIMAAN RISIKO (ASSUMPTION OF RISK):</strong> Saya memahami sepenuhnya bahwa bulutangkis adalah olahraga yang memiliki risiko cedera fisik, mulai dari cedera ringan, cedera berat, hingga risiko fatal lainnya. Saya secara sadar mengambil risiko tersebut atas keinginan sendiri.
                </li>
                <li>
                    <strong>PELEPASAN TUNTUTAN (RELEASE):</strong> Saya melepaskan dan membebaskan Panitia Pelaksana BCC 2026, Sponsor (Ayo Indonesia, Bank BJB, dll), Pemilik Venue (GOR KONI), dan pihak terkait lainnya dari segala bentuk tanggung jawab hukum, tuntutan ganti rugi, atau klaim apapun apabila terjadi kecelakaan, cedera, sakit, kehilangan barang pribadi, atau kematian yang menimpa saya selama rangkaian acara berlangsung.
                </li>
                <li>
                    <strong>TINDAKAN MEDIS:</strong> Saya mengizinkan Tim Medis yang ditunjuk Panitia untuk memberikan pertolongan pertama (First Aid). Saya memahami dan menyetujui bahwa biaya pengobatan lanjutan adalah tanggung jawab saya pribadi atau asuransi/BPJS pribadi saya.
                </li>
                <li>
                    <strong>KEPATUHAN REGULASI (INTEGRITAS):</strong> Saya bersedia mematuhi seluruh peraturan pertandingan, termasuk keputusan TPF. Saya menerima sanksi **DISKUALIFIKASI** tanpa pengembalian uang pendaftaran jika terbukti melakukan manipulasi data (Sandbagging) atau menggunakan pemain tidak sah (Joki).
                </li>
                <li>
                    <strong>HAK PUBLIKASI:</strong> Saya memberikan izin kepada Panitia dan Sponsor untuk mendokumentasikan dan menggunakan foto/video aktivitas saya selama turnamen untuk keperluan promosi tanpa menuntut royalti.
                </li>
            </ol>

            <p className="pt-4">Demikian surat pernyataan ini saya buat dengan sebenar-benarnya untuk dapat dipergunakan sebagaimana mestinya.</p>
        </div>

        {/* AREA TANDA TANGAN */}
        <div className="flex justify-between pt-12">
            <div className="w-1/3 text-center text-sm font-bold">
                Bandung, {dateStr}
                <div className="mt-2 text-xs font-normal">(Tempel Materai Rp 10.000)</div>
                <div className="h-20 border border-dashed border-gray-400 mt-2 flex items-center justify-center">
                    AREA MATERAI
                </div>
            </div>
            <div className="w-1/3 text-center text-sm font-bold">
                <div className="mb-2">Manajer Tim</div>
                <div className="h-20 border-b border-dashed border-gray-400 mt-10"></div>
                <div className="mt-2 text-sm">( Tanda Tangan & Nama Jelas )</div>
            </div>
        </div>
      </div>
    </div>
  );
}
