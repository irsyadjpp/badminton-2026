
import { z } from "zod";

// Kategori yang tersedia
export const CATEGORIES = ["Beregu PUTRA", "Beregu PUTRI", "Beregu CAMPURAN"] as const;

// Schema untuk satu pemain (UPDATE: Tambah No HP & Tgl Lahir)
export const playerSchema = z.object({
  fullName: z.string().min(2, "Nama lengkap wajib diisi"),
  nik: z.string().length(16, "NIK harus 16 digit angka").regex(/^\d+$/, "NIK hanya boleh angka"),
  
  // --- FIELD BARU ---
  phone: z.string().min(10, "No HP minimal 10 digit").regex(/^\d+$/, "Hanya angka"),
  dob: z.string().refine((date) => new Date(date).toString() !== 'Invalid Date', { message: "Tanggal lahir wajib diisi" }),
  // ------------------

  motherName: z.string().min(2, "Nama ibu kandung wajib diisi"),
  ayoId: z.string().min(1, "Username Ayo wajib diisi"),
  level: z.enum(["Beginner", "Intermediate", "Advance"], {
    required_error: "Pilih level",
  }),
  videoUrl: z.string().url("URL tidak valid").includes("youtube", { message: "Wajib link YouTube" }),
  
  participation: z.array(z.enum(CATEGORIES))
    .min(1, "Pilih minimal 1 kategori")
    .refine((cats) => {
      const hasMale = cats.includes("Beregu PUTRA");
      const hasFemale = cats.includes("Beregu PUTRI");
      return !(hasMale && hasFemale);
    }, "Tidak boleh merangkap Beregu Putra dan Putri sekaligus."),
});

// Schema utama
export const registrationFormSchema = z.object({
  communityName: z.string().min(2, "Nama Komunitas wajib diisi"),
  managerName: z.string().min(2, "Nama manajer wajib diisi"),
  managerWhatsapp: z.string().min(10, "Nomor WhatsApp tidak valid"),
  managerEmail: z.string().email("Email tidak valid"),
  basecamp: z.string().min(2, "Basecamp wajib diisi"),
  instagram: z.string().optional(),
  players: z.array(playerSchema),
  transferProof: z.any()
    .refine((files) => files?.length == 1, "Bukti transfer wajib diupload")
    .refine((files) => files?.[0]?.size <= 5000000, `Maksimal 5MB.`)
    .refine(
      (files) => ['image/jpeg', 'image/png', 'application/pdf'].includes(files?.[0]?.type),
      "Format .jpg, .png, atau .pdf"
    ),

  waiverProof: z.any()
    .refine((files) => files?.length == 1, "Wajib mengunggah Formulir Waiver yang sudah ditandatangani dan bermaterai.")
    .refine((files) => files?.[0]?.size <= 5000000, `Ukuran file Waiver maksimal 5MB.`)
    .refine(
      (files) => ['image/jpeg', 'image/png', 'application/pdf'].includes(files?.[0]?.type),
      "Format file Waiver harus .jpg, .png, atau .pdf"
    ),
    
  agreementValidData: z.literal(true, { errorMap: () => ({ message: "Persetujuan data wajib dicentang" }) }),
  agreementWaiver: z.literal(true, { errorMap: () => ({ message: "Persetujuan Waiver wajib dicentang" }) }),
  agreementTpf: z.literal(true, { errorMap: () => ({ message: "Persetujuan TPF wajib dicentang" }) }),
  agreementRules: z.literal(true, { errorMap: () => ({ message: "Persetujuan aturan wajib dicentang" }) }),
})
.superRefine((data, ctx) => {
  // VALIDASI KUOTA DINAMIS
  const counts: Record<string, number> = {
    "Beregu PUTRA": 0,
    "Beregu PUTRI": 0,
    "Beregu CAMPURAN": 0
  };

  data.players.forEach(p => {
    p.participation.forEach(cat => {
      if (counts[cat] !== undefined) counts[cat]++;
    });
  });

  Object.entries(counts).forEach(([cat, count]) => {
    // ATURAN KUOTA BARU
    const minLimit = cat === "Beregu PUTRI" ? 11 : 10;
    const maxLimit = cat === "Beregu PUTRI" ? 18 : 14;
    
    if (count > 0) {
      if (count < minLimit) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${cat}: Kurang pemain! (Baru ${count}, Minimal ${minLimit})`,
          path: ["players"]
        });
      }
      if (count > maxLimit) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${cat}: Kelebihan pemain! (Ada ${count}, Maksimal ${maxLimit})`,
          path: ["players"]
        });
      }
    }
  });

  const totalParticipation = Object.values(counts).reduce((sum, p) => sum + p.length, 0);
  if (totalParticipation === 0 && data.players.length > 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Belum ada pemain yang didaftarkan ke kategori manapun.",
      path: ["players"],
    });
  }
});

export type RegistrationFormValues = z.infer<typeof registrationFormSchema>;
