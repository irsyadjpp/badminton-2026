import { z } from "zod";

export const protestFormSchema = z.object({
  managerName: z.string().min(2, "Nama manajer wajib diisi"),
  teamName: z.string().min(2, "Nama tim pelapor wajib diisi"),
  managerWhatsapp: z.string().min(10, "Nomor WhatsApp wajib diisi"),
  category: z.enum(["Putra", "Putri", "Campuran"], { required_error: "Pilih kategori" }),
  
  // Detail Kejadian
  incidentTime: z.string().min(1, "Waktu kejadian wajib diisi"),
  courtNumber: z.string().min(1, "Nomor lapangan wajib diisi"),
  partaiNumber: z.coerce.number({invalid_type_error: "Partai harus berupa angka"}).min(1, "Partai ke- wajib diisi"),
  opponentTeam: z.string().min(2, "Nama tim lawan wajib diisi").regex(/^[A-Za-z\s]+$/, "Nama tim hanya boleh berisi huruf dan spasi"),
  opponentPlayer: z.string().min(2, "Nama pemain lawan wajib diisi").regex(/^[A-Za-z\s]+$/, "Nama pemain hanya boleh berisi huruf dan spasi"),

  // Jenis Pelanggaran (Minimal 1 dipilih)
  violationType: z.array(z.string()).min(1, "Wajib memilih minimal satu jenis pelanggaran"),

  // Keterangan Tambahan
  additionalEvidence: z.string().optional(),

  // Pernyataan Uang Jaminan
  depositAgreement: z.literal(true, { 
    errorMap: () => ({ message: "Persetujuan jaminan Rp 500.000 wajib dicentang." }) 
  }),
});

export type ProtestFormValues = z.infer<typeof protestFormSchema>;
