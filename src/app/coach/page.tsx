'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { AiCoachView } from '@/components/views/AiCoachView';

function CoachContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('sessionId') || 'session-vic-1';
  const prefill = searchParams.get('prompt') || '';
  const initialMode = (searchParams.get('mode') as 'chat' | 'voice') || 'chat';

  return (
    <AiCoachView
      sessionId={sessionId}
      prefilledPrompt={prefill}
      initialMode={initialMode}
      onNewSession={(newId) => router.push(`/coach?sessionId=${newId}`)}
      onOpenPatientDetail={(pId) => router.push(`/patients?filter=${pId}`)}
    />
  );
}

export default function CoachPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-8 text-slate-500 font-sans text-xs">Loading AI Coach...</div>}>
        <CoachContent />
      </Suspense>
    </AppShell>
  );
}
