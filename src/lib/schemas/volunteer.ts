import { z } from "zod";

export const VOLUNTEER_DIVISIONS = [
  "MATCH CONTROL: Input skor digital, asisten wasit.",
  "GATE KEEPER: Cek aplikasi, tiket, keamanan.",
  "MEDIS & FISIO: P3K lapangan, bantu terapis.",
  "MEDIA & KREATIF: Foto, video reels, liputan story.",
  "LOGISTIK & RUNNER: Mobilitas tinggi, angkat barang.",
  "LIAISON OFFICER (LO): Mendampingi Sponsor/VIP.",
] as const;

export const volunteerSchema = z.object({
  // BAGIAN 1: DATA PRIBADI
  fullName: z.string().min(2, "Nama lengkap wajib diisi"),
  nickname: z.string().min(2, "Nama panggilan wajib diisi"),
  gender: z.enum(["Laki-laki", "Perempuan"], { required_error: "Pilih jenis kelamin" }),
  dob: z.string().min(1, "Tanggal lahir wajib diisi"), // Input type='date' returns string YYYY-MM-DD
  whatsapp: z.string().min(10, "Nomor WhatsApp minimal 10 digit").regex(/^\d+$/, "Hanya angka"),
  email: z.string().email("Email tidak valid"),
  address: z.string().min(5, "Alamat domisili wajib diisi"),
  instagram: z.string().min(2, "Instagram wajib diisi (tanpa @ boleh)"),
  shirtSize: z.enum(["S", "M", "L", "XL", "XXL", "XXXL"], { required_error: "Pilih ukuran baju" }),

  // BAGIAN 2: LATAR BELAKANG
  education: z.string({ required_error: "Pilih pendidikan terakhir" }),
  institution: z.string().min(2, "Nama institusi wajib diisi"),
  major: z.string().min(2, "Jurusan wajib diisi"),
  status: z.string({ required_error: "Pilih status saat ini" }), // Radio group value
  expertise: z.string().min(3, "Keahlian wajib diisi"),

  // BAGIAN 3: POSISI
  division1: z.string({ required_error: "Pilih divisi prioritas 1" }),
  division2: z.string({ required_error: "Pilih divisi prioritas 2" }),

  // BAGIAN 4: PENGALAMAN & ASET
  experience: z.string().min(10, "Ceritakan pengalaman minimal 1 kalimat panjang"),
  skills: z.array(z.string()).optional(),
  hasVehicle: z.enum(["Ya", "Tidak"], { required_error: "Info kendaraan wajib" }),
  hasLaptop: z.enum(["Ya", "Tidak"], { required_error: "Info laptop wajib" }),

  // BAGIAN 5: KOMITMEN
  // Form mengirim array string, jadi schema harus array
  availability: z.array(z.string()).min(1, "Pilih minimal 1 tanggal ketersediaan"),
  
  // BAGIAN 6: STUDI KASUS
  caseStudy1: z.string().min(20, "Jawaban terlalu pendek, berikan detail tindakan Anda."),
  caseStudy2: z.string().min(20, "Jawaban terlalu pendek, berikan solusi konkret."),

  // PERNYATAAN
  agreeData: z.literal(true, { errorMap: () => ({ message: "Wajib disetujui" }) }),
  agreeRules: z.literal(true, { errorMap: () => ({ message: "Wajib disetujui" }) }),
  agreeCompetitive: z.literal(true, { errorMap: () => ({ message: "Wajib disetujui" }) }),

}).refine((data) => data.division1 !== data.division2, {
  message: "Pilihan Divisi 2 tidak boleh sama dengan Divisi 1",
  path: ["division2"],
});

export type VolunteerFormValues = z.infer<typeof volunteerSchema>;
