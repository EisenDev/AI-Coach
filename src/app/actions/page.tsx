'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { ActionPlansView } from '@/components/views/ActionPlansView';

export default function ActionsPage() {
  const router = useRouter();

  return (
    <AppShell>
      <ActionPlansView
        onStartNewSession={() => router.push('/coach?new=true')}
        onContinueCoach={(prompt) => router.push(`/coach?prompt=${encodeURIComponent(prompt)}`)}
      />
    </AppShell>
  );
}
