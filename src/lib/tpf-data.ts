// src/lib/tpf-data.ts

export const RUBRIC_GUIDELINES = [
  {
    id: 'biomechanics',
    title: '1. BIOMEKANIK & GRIP',
    scores: [
      { score: 1, desc: "Buruk: Grip Panci (Panhandle). Menggenggam raket kaku seperti palu. Pukulan hanya dari ayunan bahu. Tidak ada rotasi lengan." },
      { score: 2, desc: "Kurang: Grip V (Salaman) tapi kaku/keras. Gerakan memukul seperti 'mendorong'." },
      { score: 3, desc: "Standar: Grip benar. Ada lecutan wrist. Transisi grip Forehand-Backhand terlihat lambat/jeda." },
      { score: 4, desc: "Baik: Transisi grip cepat. Menggunakan rotasi lengan bawah (pronation)." },
      { score: 5, desc: "Elite: Finger Power. Memukul dengan jari & kedutan (snap). Ayunan pendek tapi kencang." }
    ]
  },
  {
    id: 'footwork',
    title: '2. FOOTWORK (KAKI)',
    scores: [
      { score: 1, desc: "Buruk: Lari/Jogging. Langkah menyilang tidak beraturan. Mendarat dengan tumit (berat)." },
      { score: 2, desc: "Kurang: Mengejar bola tapi tidak bisa kembali (No Recovery). Keseimbangan goyah." },
      { score: 3, desc: "Standar: Langkah Chassé (geser) benar. Menutup lapangan standar." },
      { score: 4, desc: "Baik: Gerakan ringan (jinjit). Recovery ke tengah cepat. Jarang mati langkah." },
      { score: 5, desc: "Elite: Split Step. Melakukan lompatan kecil refleks setiap lawan memukul. Scissor Jump." }
    ]
  },
  {
    id: 'backhand',
    title: '3. BACKHAND OVERHEAD',
    scores: [
      { score: 1, desc: "Buruk: Nihil. Selalu lari memutar badan (Round-the-head). Jika terpaksa, cuma sentuh pelan." },
      { score: 2, desc: "Kurang: Bisa kena bola, tapi hasil Drop tanggung atau Lob setengah lapangan." },
      { score: 3, desc: "Standar: Bisa Clear lurus tapi tenaga pas-pasan (sering tidak sampai garis belakang)." },
      { score: 4, desc: "Baik: Clear konsisten sampai garis belakang (baseline). Posisi badan benar." },
      { score: 5, desc: "Elite: Mastery. Bisa Clear silang (Cross) atau lurus dari ujung ke ujung. Bisa Smash/Drop backhand." }
    ]
  },
  {
    id: 'attack',
    title: '4. ATTACK (SMASH)',
    scores: [
      { score: 1, desc: "Buruk: Smash pelan, nyangkut net, atau melambung keluar." },
      { score: 2, desc: "Kurang: Ada tenaga, tapi bola datar/tanggung. Mudah dikembalikan." },
      { score: 3, desc: "Standar: Keras dan kencang, tapi arah monoton (lurus terus). Mengandalkan otot bahu." },
      { score: 4, desc: "Baik: Tajam dan menukik (Steep). Bisa mengarahkan ke sisi kiri/kanan." },
      { score: 5, desc: "Elite: Variatif. Punya Full Smash meledak, Half Smash, dan Slice. Akurasi ke garis pinggir." }
    ]
  },
  {
    id: 'defense',
    title: '5. DEFENSE (BERTAHAN)',
    scores: [
      { score: 1, desc: "Buruk: Panik. Takut bola. Membuang raket atau angkat bola tanggung di depan net." },
      { score: 2, desc: "Kurang: Bisa kena bola, tapi pengembalian tidak terarah/tanggung. Raket di bawah lutut." },
      { score: 3, desc: "Standar: Bisa Block atau Lift tinggi ke belakang secara konsisten." },
      { score: 4, desc: "Baik: Pertahanan rapat (Wall). Mengarahkan bola ke ruang kosong." },
      { score: 5, desc: "Elite: Counter Attack. Mengubah bertahan jadi menyerang dengan Drive balik datar/silang." }
    ]
  },
  {
    id: 'gameiq',
    title: '6. GAME IQ (TAKTIK GANDA)',
    scores: [
      { score: 1, desc: "Buruk: Sering tabrakan raket. Saling diam saat bola tengah. Servis sering tanggung." },
      { score: 2, desc: "Kurang: Posisi statis (depan-belakang terus). Sering memberi bola enak ke lawan." },
      { score: 3, desc: "Standar: Paham rotasi dasar (Serang=Depan Belakang, Tahan=Kiri Kanan)." },
      { score: 4, desc: "Baik: Pandai cari celah kosong. Komunikasi partner baik. Jarang buang bola." },
      { score: 5, desc: "Elite: Antisipasi. Membaca pukulan lawan sebelum dipukul. Rotasi cair (fluid). Intercept cepat." }
    ]
  },
  {
    id: 'physique',
    title: '7. PHYSIQUE (FISIK & MENTAL)',
    scores: [
      { score: 1, desc: "Buruk: Habis Bensin. Napas memburu (gasping) atau tangan bertumpu di lutut. Sering blank." },
      { score: 2, desc: "Kurang: Speed Drop. Kecepatan kaki menurun drastis. Emosional/frustrasi." },
      { score: 3, desc: "Standar: Stabil. Mampu menyelesaikan game dengan tempo sedang. Sedikit tegang di poin kritis." },
      { score: 4, desc: "Baik: Terlatih. Pengaturan nafas teratur. Masih mampu sprint/smash di akhir game." },
      { score: 5, desc: "Elite: High Endurance & Ice Cold. Intensitas tinggi konsisten. Mental baja di poin kritis." }
    ]
  }
];
