import { z } from "zod";

// Schema untuk satu pemain
export const playerSchema = z.object({
  fullName: z.string().min(2, "Nama lengkap wajib diisi"),
  nik: z.string().length(16, "NIK harus 16 digit angka").regex(/^\d+$/, "NIK hanya boleh angka"),
  motherName: z.string().min(2, "Nama ibu kandung wajib diisi (untuk BPJS)"),
  ayoId: z.string().min(1, "Username Ayo Indonesia wajib diisi"),
  level: z.enum(["Beginner", "Intermediate", "Advance"], {
    required_error: "Pilih level pemain",
  }),
  videoUrl: z.string().url("Link harus berupa URL valid").includes("youtube", { message: "Wajib link YouTube" }),
});

// Schema utama formulir
export const registrationFormSchema = z.object({
  // Bagian 1: Identitas Tim
  teamName: z.string().min(2, "Nama tim wajib diisi"),
  category: z.enum(["Beregu PUTRA", "Beregu PUTRI", "Beregu CAMPURAN"], {
    required_error: "Pilih kategori pertandingan",
  }),
  managerName: z.string().min(2, "Nama manajer wajib diisi"),
  managerWhatsapp: z.string().min(10, "Nomor WhatsApp tidak valid").regex(/^\d+$/, "Hanya angka"),
  managerEmail: z.string().email("Email tidak valid"),
  basecamp: z.string().min(2, "Domisili/Basecamp wajib diisi"),
  instagram: z.string().optional(),

  // Bagian 2: Data Pemain (Minimal 10, Maksimal 14)
  players: z.array(playerSchema)
    .min(10, "Wajib mendaftarkan minimal 10 pemain")
    .max(14, "Maksimal 14 pemain"),

  // Bagian 3: Pembayaran
  transferProof: z.any()
    .refine((files) => files?.length == 1, "Bukti transfer wajib diupload")
    .refine((files) => files?.[0]?.size <= 5000000, `Ukuran file maksimal 5MB.`)
    .refine(
      (files) => ['image/jpeg', 'image/png', 'application/pdf'].includes(files?.[0]?.type),
      "Format file harus .jpg, .png, atau .pdf"
    ),

  // Bagian 4: Pernyataan Legal
  agreementValidData: z.literal(true, { errorMap: () => ({ message: "Anda harus menyetujui pernyataan ini" }) }),
  agreementWaiver: z.literal(true, { errorMap: () => ({ message: "Anda harus menyetujui pernyataan ini" }) }),
  agreementTpf: z.literal(true, { errorMap: () => ({ message: "Anda harus menyetujui pernyataan ini" }) }),
  agreementRules: z.literal(true, { errorMap: () => ({ message: "Anda harus menyetujui pernyataan ini" }) }),
});

export type RegistrationFormValues = z.infer<typeof registrationFormSchema>;