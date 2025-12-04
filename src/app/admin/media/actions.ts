'use server';

// MOCK DATA
let LIVE_CONFIG = {
  court1: "https://www.youtube.com/embed/live_stream_id_1",
  court2: "",
  isLive: true,
  announcement: "Pertandingan Final akan dimulai pukul 14.00 WIB.",
};

let GALLERY_ITEMS = [
  { id: 1, title: "Opening Ceremony", url: "/images/gallery/opening.jpg", date: "2026-06-13" },
  { id: 2, title: "Match Point Kevin/Marcus", url: "/images/gallery/match1.jpg", date: "2026-06-14" },
];

export async function getMediaConfig() {
  return LIVE_CONFIG;
}

export async function updateLiveConfig(data: any) {
  await new Promise(r => setTimeout(r, 500));
  LIVE_CONFIG = { ...LIVE_CONFIG, ...data };
  return { success: true, message: "Konfigurasi Live Stream diperbarui." };
}

export async function getGallery() {
  return GALLERY_ITEMS;
}

export async function uploadGalleryItem(data: FormData) {
  await new Promise(r => setTimeout(r, 1000));
  // Simulasi upload file
  const newItem = {
    id: Date.now(),
    title: data.get('title') as string,
    url: "https://placehold.co/600x400?text=Uploaded+Image", // Mock URL
    date: new Date().toISOString().split('T')[0]
  };
  GALLERY_ITEMS.unshift(newItem);
  return { success: true, message: "Foto berhasil ditambahkan ke Galeri Website." };
}
