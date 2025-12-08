import { z } from "zod";

export const playerRegisterSchema = z.object({
  // DATA SENSITIF (Hanya Pemain & Admin)
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  nik: z.string().length(16, "NIK harus 16 digit"),
  fullName: z.string().min(3, "Nama lengkap sesuai KTP"),
  birthDate: z.string().min(1, "Tanggal lahir wajib"),
  gender: z.enum(["Laki-laki", "Perempuan"]),
  phone: z.string().min(10, "Nomor WA aktif"),
  address: z.string().min(10, "Alamat domisili"),
  
  // DATA PUBLIK (Bisa dilihat Manajer)
  nickname: z.string().min(2, "Nama Panggilan"),
  jerseySize: z.enum(["S", "M", "L", "XL", "XXL"]),
  photoUrl: z.string().optional(), // Avatar
});

export type PlayerRegisterValues = z.infer<typeof playerRegisterSchema>;
