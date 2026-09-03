'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { PatientsView } from '@/components/views/PatientsView';

function PatientsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter') || 'all';

  const handleCoach = (prompt: string, sessionId?: string) => {
    if (sessionId) {
      router.push(`/coach?sessionId=${sessionId}`);
    } else {
      router.push(`/coach?prompt=${encodeURIComponent(prompt)}`);
    }
  };

  return (
    <PatientsView
      initialFilter={filter}
      onCoachClient={handleCoach}
    />
  );
}

export default function PatientsPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-8 text-slate-500 font-sans text-xs">Loading Patient Intelligence...</div>}>
        <PatientsContent />
      </Suspense>
    </AppShell>
  );
}
