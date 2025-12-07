import { z } from "zod";

export const DIVISIONS = [
  "MATCH CONTROL (Skor, Wasit, Jadwal)",
  "GATE KEEPER (Keamanan & Ticketing)",
  "LOGISTIK & RUNNER (Perlengkapan)",
  "MEDIA & DOKUMENTASI (Konten Kreatif)",
  "LIAISON OFFICER (LO - Tamu VIP)",
  "MEDIS & KEBERSIHAN (P3K)",
  "SPONSORSHIP & FUNDRAISING"
] as const;

export const recruitmentSchema = z.object({
  // BAGIAN 1: DATA PRIBADI
  fullName: z.string().min(2, "Nama lengkap wajib diisi"),
  nickname: z.string().min(2, "Nama panggilan wajib diisi"),
  gender: z.enum(["Laki-laki", "Perempuan"], { required_error: "Pilih jenis kelamin" }),
  dob: z.string().min(1, "Tanggal lahir wajib diisi"),
  whatsapp: z.string().min(10, "Nomor WhatsApp tidak valid").regex(/^\d+$/, "Hanya angka"),
  email: z.string().email("Email tidak valid"),
  address: z.string().min(10, "Alamat domisili lengkap wajib diisi"),
  instagram: z.string().min(2, "Instagram wajib diisi"),
  
  // BAGIAN 2: LATAR BELAKANG
  education: z.string({ required_error: "Pilih pendidikan terakhir" }),
  status: z.string({ required_error: "Pilih status saat ini" }),
  major: z.string().min(2, "Jurusan/Bidang pekerjaan wajib diisi"),

  // BAGIAN 3: DIVISI
  division1: z.string({ required_error: "Pilih prioritas 1" }),
  division2: z.string({ required_error: "Pilih prioritas 2" }),

  // BAGIAN 4: KEAHLIAN
  hasExperience: z.enum(["Ya", "Tidak"], { required_error: "Pilih status pengalaman" }),
  experienceDetail: z.string().optional(),
  skills: z.array(z.string()).optional(),
  equipment: z.array(z.string()).optional(),

  // BAGIAN 5: KOMITMEN
  availability: z.array(z.string()).min(1, "Wajib memilih ketersediaan"),
  attendBriefing: z.enum(["Ya", "Tidak"], { required_error: "Wajib hadir briefing" }),
  shirtSize: z.string({ required_error: "Pilih ukuran baju" }),

  // BAGIAN 6: STUDI KASUS (Lebih detail untuk panitia)
  caseStudy1: z.string().min(50, "Jawaban terlalu singkat. Jelaskan analisa Anda (min 50 karakter)."),
  caseStudy2: z.string().min(50, "Jawaban terlalu singkat. Berikan solusi konkret (min 50 karakter)."),

  // PERNYATAAN
  agreeData: z.literal(true, { errorMap: () => ({ message: "Wajib disetujui" }) }),
  agreeRules: z.literal(true, { errorMap: () => ({ message: "Wajib disetujui" }) }),
  agreeCompetitive: z.literal(true, { errorMap: () => ({ message: "Wajib disetujui" }) }),
}).refine((data) => data.division1 !== data.division2, {
  message: "Divisi Cadangan tidak boleh sama dengan Utama",
  path: ["division2"],
});

export type RecruitmentFormValues = z.infer<typeof recruitmentSchema>;