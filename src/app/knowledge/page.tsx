'use client';

import React from 'react';
import { AppShell } from '@/components/AppShell';
import { KnowledgeView } from '@/components/views/KnowledgeView';

export default function KnowledgePage() {
  return (
    <AppShell>
      <KnowledgeView />
    </AppShell>
  );
}
