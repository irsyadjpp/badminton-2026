
'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

// This page is deprecated and functionality has been moved into the multi-step dashboard.
// Redirect users to the dashboard.
export default function DeprecatedProfilePage() {
  useEffect(() => {
    redirect('/player/dashboard');
  }, []);

  return null;
}
