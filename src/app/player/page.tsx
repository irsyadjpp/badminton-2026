
'use client';

import { redirect } from 'next/navigation';

// Halaman root dari /player hanya berfungsi untuk redirect
// ke halaman login atau dashboard.
export default function PlayerRootRedirect() {
  // Logika ini bisa diperluas untuk memeriksa cookie sesi
  // Jika ada sesi -> redirect('/player/dashboard')
  // Jika tidak -> redirect('/player/login')
  
  redirect('/player/login');
}
