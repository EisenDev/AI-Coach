'use client';

import React from 'react';
import { AppShell } from '@/components/AppShell';
import { TeamView } from '@/components/views/TeamView';

export default function TeamPage() {
  return (
    <AppShell>
      <TeamView />
    </AppShell>
  );
}
