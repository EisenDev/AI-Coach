'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OverviewPage from './overview/page';

export default function RootPage() {
  return <OverviewPage />;
}
