'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { SessionsView } from '@/components/views/SessionsView';

export default function SessionsPage() {
  const router = useRouter();

  return (
    <AppShell>
      <SessionsView
        onOpenSession={(id) => router.push(`/coach?sessionId=${id}`)}
        onNewSession={() => router.push('/coach?new=true')}
      />
    </AppShell>
  );
}
