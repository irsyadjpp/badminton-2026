'use server';

// Mock Data Simpan
export async function submitTieResult(data: any) {
  // Simulasi simpan ke database
  await new Promise(r => setTimeout(r, 1000));
  console.log("Tie Result Saved:", data);
  return { success: true, message: "Berita Acara berhasil disimpan." };
}
