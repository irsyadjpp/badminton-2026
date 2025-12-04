'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Printer, Save, Trophy, Eraser } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';

// Struktur Partai Default
const DEFAULT_MATCHES = [
  { id: 1, label: "MD BEGINNER 1", pA1: "", pA2: "", pB1: "", pB2: "", score: "", duration: "", winner: "" },
  { id: 2, label: "MD INTERMEDIATE 1", pA1: "", pA2: "", pB1: "", pB2: "", score: "", duration: "", winner: "" },
  { id: 3, label: "MD ADVANCE / BEG 2", pA1: "", pA2: "", pB1: "", pB2: "", score: "", duration: "", winner: "" },
  { id: 4, label: "MD INTERMEDIATE 2", pA1: "", pA2: "", pB1: "", pB2: "", score: "", duration: "", winner: "" },
  { id: 5, label: "MD BEGINNER 2", pA1: "", pA2: "", pB1: "", pB2: "", score: "", duration: "", winner: "" },
];

export default function TieResultPage() {
  const { toast } = useToast();
  const [category, setCategory] = useState("PA");
  const [matches, setMatches] = useState(DEFAULT_MATCHES);
  
  // Form State
  const [info, setInfo] = useState({
      date: new Date().toISOString().split('T')[0],
      timeStart: "", timeEnd: "",
      round: "Grup", pool: "", court: "",
      teamA: "", teamB: "",
      managerA: "", managerB: "", referee: ""
  });

  // Update Label Partai jika Kategori Putri (3-on-3)
  useEffect(() => {
    const newMatches = [...matches];
    if (category === 'PI') {
        newMatches[2].label = "TRIPLES (3-ON-3)";
        newMatches[4].label = "MD INTERMEDIATE 2";
    } else {
        newMatches[2].label = "MD ADVANCE / BEG 2";
        newMatches[4].label = "MD BEGINNER 2";
    }
    setMatches(newMatches);
  }, [category]);

  // Update Data Match
  const updateMatch = (index: number, field: string, value: string) => {
      const updated = [...matches];
      updated[index] = { ...updated[index], [field]: value };
      setMatches(updated);
  };

  // Hitung Skor Akhir Otomatis
  const scoreTeamA = matches.filter(m => m.winner === 'A').length;
  const scoreTeamB = matches.filter(m => m.winner === 'B').length;
  const winnerTeam = scoreTeamA > scoreTeamB ? info.teamA : (scoreTeamB > scoreTeamA ? info.teamB : "SERI");

  const handlePrint = () => {
      window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex justify-center">
      
      {/* CONTAINER KERTAS A4 */}
      <div className="bg-white w-full max-w-[210mm] min-h-[297mm] shadow-xl p-[10mm] md:p-[15mm] relative text-black font-sans text-sm">
        
        {/* --- TOOLBAR (HIDDEN SAAT PRINT) --- */}
        <div className="absolute top-0 right-[-150px] hidden xl:flex flex-col gap-3 print:hidden">
            <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 shadow-lg w-32">
                <Printer className="w-4 h-4 mr-2" /> Cetak PDF
            </Button>
            <Button variant="outline" className="bg-white w-32" onClick={() => window.location.reload()}>
                <Eraser className="w-4 h-4 mr-2" /> Reset
            </Button>
        </div>
        <div className="mb-6 flex justify-end gap-2 xl:hidden print:hidden">
             <Button onClick={handlePrint} size="sm"><Printer className="w-4 h-4 mr-2" /> Cetak</Button>
        </div>
        {/* ---------------------------------- */}

        {/* HEADER KOP */}
        <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-4">
            <div className="flex items-center gap-4">
                {/* Logo Placeholder */}
                <div className="w-16 h-16 relative grayscale opacity-80">
                    <Image src="/images/logo.png" alt="Logo" fill className="object-contain"/>
                </div>
                <div>
                    <h1 className="font-bold text-xl uppercase leading-tight">BERITA ACARA HASIL PERTANDINGAN</h1>
                    <p className="text-xs font-bold text-gray-600">(OFFICIAL TIE RESULT SHEET)</p>
                    <p className="text-sm font-bold mt-1">BANDUNG COMMUNITY CHAMPIONSHIP 2026</p>
                </div>
            </div>
            <div className="text-right text-xs">
                <p>GOR KONI Bandung</p>
                <p>Juni - Juli 2026</p>
            </div>
        </div>

        {/* INFORMASI PERTANDINGAN */}
        <div className="mb-6 border border-black p-4 bg-gray-50 print:bg-transparent">
            <h3 className="font-bold border-b border-gray-300 mb-2 pb-1">I. INFORMASI PERTANDINGAN</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                <div className="flex items-center">
                    <span className="w-32">Hari / Tanggal</span>: 
                    <input type="date" className="ml-2 bg-transparent border-b border-gray-400 focus:outline-none print:border-none" value={info.date} onChange={e => setInfo({...info, date: e.target.value})}/>
                </div>
                <div className="flex items-center">
                    <span className="w-32">Babak</span>: 
                    <select className="ml-2 bg-transparent border-b border-gray-400 focus:outline-none print:appearance-none" value={info.round} onChange={e => setInfo({...info, round: e.target.value})}>
                        <option value="Grup">Penyisihan Grup</option>
                        <option value="Gugur">Gugur (Knockout)</option>
                    </select>
                </div>
                <div className="flex items-center">
                    <span className="w-32">Waktu Main</span>: 
                    <input className="ml-2 w-16 text-center border-b border-gray-400 focus:outline-none print:border-none" placeholder="Mulai" value={info.timeStart} onChange={e => setInfo({...info, timeStart: e.target.value})} />
                    <span className="mx-1">s/d</span>
                    <input className="ml-2 w-16 text-center border-b border-gray-400 focus:outline-none print:border-none" placeholder="Selesai" value={info.timeEnd} onChange={e => setInfo({...info, timeEnd: e.target.value})} />
                    <span className="ml-1">WIB</span>
                </div>
                 <div className="flex items-center">
                    <span className="w-32">Grup / Pool</span>: 
                    <input className="ml-2 w-full border-b border-gray-400 focus:outline-none print:border-none" placeholder="..." value={info.pool} onChange={e => setInfo({...info, pool: e.target.value})} />
                </div>
                <div className="flex items-center">
                    <span className="w-32">Lapangan</span>: 
                    <input className="ml-2 w-full border-b border-gray-400 focus:outline-none print:border-none" placeholder="Court..." value={info.court} onChange={e => setInfo({...info, court: e.target.value})} />
                </div>
                <div className="flex items-center">
                    <span className="w-32">Kategori</span>: 
                    <div className="flex gap-4 ml-2">
                        {['PA', 'PI', 'MIX'].map(c => (
                            <label key={c} className="flex items-center gap-1 cursor-pointer">
                                <input type="radio" name="cat" checked={category === c} onChange={() => setCategory(c)} className="print:hidden"/>
                                <span className={category === c ? "font-bold border-2 border-black px-1 rounded print:border-2" : "print:opacity-30"}>{c}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* SKOR AKHIR BESAR */}
        <div className="flex items-center justify-between border-2 border-black mb-6">
            <div className="flex-1 p-4 text-center border-r border-black bg-blue-50 print:bg-transparent">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">TIM A (KIRI)</p>
                <input 
                    className="w-full text-center text-xl font-bold bg-transparent focus:outline-none placeholder:text-gray-300" 
                    placeholder="Nama Tim A"
                    value={info.teamA}
                    onChange={e => setInfo({...info, teamA: e.target.value})}
                />
            </div>
            <div className="w-48 p-2 text-center bg-black text-white print:bg-white print:text-black print:border-x-2 print:border-black">
                <div className="text-xs uppercase tracking-widest mb-1">SKOR AKHIR</div>
                <div className="text-4xl font-black font-mono">
                    {scoreTeamA} - {scoreTeamB}
                </div>
            </div>
            <div className="flex-1 p-4 text-center border-l border-black bg-red-50 print:bg-transparent">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">TIM B (KANAN)</p>
                <input 
                    className="w-full text-center text-xl font-bold bg-transparent focus:outline-none placeholder:text-gray-300" 
                    placeholder="Nama Tim B"
                    value={info.teamB}
                    onChange={e => setInfo({...info, teamB: e.target.value})}
                />
            </div>
        </div>

        {/* TABEL DETAIL */}
        <div className="mb-6">
            <h3 className="font-bold mb-2">II. RINCIAN HASIL PARTAI</h3>
            <table className="w-full border-collapse border border-black text-xs md:text-sm">
                <thead>
                    <tr className="bg-gray-200 print:bg-gray-300">
                        <th className="border border-black p-2 w-8">#</th>
                        <th className="border border-black p-2 w-40">KATEGORI</th>
                        <th className="border border-black p-2">PEMAIN TIM A</th>
                        <th className="border border-black p-2">PEMAIN TIM B</th>
                        <th className="border border-black p-2 w-32">SKOR</th>
                        <th className="border border-black p-2 w-16">DURASI</th>
                        <th className="border border-black p-2 w-24 print:hidden">WINNER</th>
                    </tr>
                </thead>
                <tbody>
                    {matches.map((m, idx) => (
                        <tr key={m.id}>
                            <td className="border border-black p-2 text-center font-bold">{idx + 1}</td>
                            <td className="border border-black p-2 font-bold bg-gray-50 print:bg-transparent">{m.label}</td>
                            
                            {/* PEMAIN A */}
                            <td className={`border border-black p-1 ${m.winner === 'A' ? 'bg-green-100 print:bg-transparent print:font-bold relative' : ''}`}>
                                <input className="w-full mb-1 border-b border-dotted border-gray-300 focus:outline-none bg-transparent" placeholder="Pemain 1..." value={m.pA1} onChange={e => updateMatch(idx, 'pA1', e.target.value)} />
                                <input className="w-full border-dotted border-gray-300 focus:outline-none bg-transparent" placeholder="Pemain 2..." value={m.pA2} onChange={e => updateMatch(idx, 'pA2', e.target.value)} />
                                {m.winner === 'A' && <div className="hidden print:block absolute right-1 top-1 text-[10px] border border-black px-1 rounded-full">WIN</div>}
                            </td>

                            {/* PEMAIN B */}
                            <td className={`border border-black p-1 ${m.winner === 'B' ? 'bg-green-100 print:bg-transparent print:font-bold relative' : ''}`}>
                                <input className="w-full mb-1 border-b border-dotted border-gray-300 focus:outline-none bg-transparent" placeholder="Pemain 1..." value={m.pB1} onChange={e => updateMatch(idx, 'pB1', e.target.value)} />
                                <input className="w-full border-dotted border-gray-300 focus:outline-none bg-transparent" placeholder="Pemain 2..." value={m.pB2} onChange={e => updateMatch(idx, 'pB2', e.target.value)} />
                                {m.winner === 'B' && <div className="hidden print:block absolute right-1 top-1 text-[10px] border border-black px-1 rounded-full">WIN</div>}
                            </td>

                            <td className="border border-black p-1 text-center">
                                <textarea className="w-full h-full text-center resize-none focus:outline-none bg-transparent" rows={2} placeholder="21-19, 15-21..." value={m.score} onChange={e => updateMatch(idx, 'score', e.target.value)}></textarea>
                            </td>
                            
                            <td className="border border-black p-1 text-center">
                                <input className="w-full text-center focus:outline-none bg-transparent" placeholder="mnt" value={m.duration} onChange={e => updateMatch(idx, 'duration', e.target.value)} />
                            </td>

                            <td className="border border-black p-1 text-center print:hidden">
                                <div className="flex justify-center gap-1">
                                    <button onClick={() => updateMatch(idx, 'winner', 'A')} className={`w-6 h-6 rounded text-xs font-bold ${m.winner === 'A' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>A</button>
                                    <button onClick={() => updateMatch(idx, 'winner', 'B')} className={`w-6 h-6 rounded text-xs font-bold ${m.winner === 'B' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}>B</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {category === 'PI' && <p className="text-[10px] mt-1 italic">*Keterangan: Partai ke-3 Triples (3-on-3)</p>}
        </div>

        {/* FOOTER PENGESAHAN */}
        <div className="border-t-2 border-black pt-4">
            <div className="flex items-center gap-2 mb-6 p-2 bg-yellow-50 print:bg-transparent">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <span className="font-bold">PEMENANG TIE:</span>
                <input className="flex-1 border-b-2 border-black font-bold text-lg bg-transparent focus:outline-none uppercase" value={winnerTeam} readOnly placeholder="Otomatis terisi..." />
            </div>

            <p className="text-center text-xs italic mb-8">
                Dengan ini kedua belah pihak menyatakan menerima hasil pertandingan di atas dengan prinsip Fair Play dan tanpa paksaan.
            </p>

            <div className="flex justify-between text-center pt-4">
                <div className="w-1/3">
                    <p className="mb-16 font-bold">Manajer Tim A</p>
                    <input className="w-full text-center border-b border-black focus:outline-none bg-transparent" placeholder="Nama Jelas" value={info.managerA} onChange={e => setInfo({...info, managerA: e.target.value})} />
                </div>
                <div className="w-1/3">
                    <p className="mb-16 font-bold">Manajer Tim B</p>
                    <input className="w-full text-center border-b border-black focus:outline-none bg-transparent" placeholder="Nama Jelas" value={info.managerB} onChange={e => setInfo({...info, managerB: e.target.value})} />
                </div>
                <div className="w-1/3">
                    <p className="mb-16 font-bold">REFEREE / PENGAWAS</p>
                    <input className="w-full text-center border-b border-black focus:outline-none bg-transparent" placeholder="Nama & Stempel" value={info.referee} onChange={e => setInfo({...info, referee: e.target.value})} />
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
