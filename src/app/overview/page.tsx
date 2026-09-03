'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { OverviewView } from '@/components/views/OverviewView';

export default function OverviewPage() {
  const router = useRouter();

  return (
    <AppShell>
      <OverviewView
        onOpenCoach={() => router.push('/coach')}
        onOpenPatients={(filter) => router.push(filter ? `/patients?filter=${filter}` : '/patients')}
        onOpenKnowledge={() => router.push('/knowledge')}
        onOpenActions={() => router.push('/actions')}
      />
    </AppShell>
  );
}
