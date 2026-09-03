'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Sidebar, ViewType } from './Sidebar';
import { ClinicTourGuide } from './ClinicTourGuide';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [tourStep, setTourStep] = useState(1);

  // Derive active view from pathname
  const activeView: ViewType = pathname.includes('/coach')
    ? 'coach'
    : pathname.includes('/patients')
    ? 'patients'
    : pathname.includes('/knowledge')
    ? 'knowledge'
    : pathname.includes('/sessions')
    ? 'sessions'
    : pathname.includes('/actions')
    ? 'actions'
    : 'overview';

  const handleNavigate = (view: ViewType) => {
    router.push(`/${view}`);
  };

  const handleOpenHelp = () => {
    setTourStep(1);
    setIsHelpOpen(true);
  };

  return (
    <div className="flex h-screen bg-[#FAF9F6] text-slate-900 font-sans antialiased overflow-hidden selection:bg-[#D5E6D3] selection:text-[#1E3A2B]">
      
      {/* Left Navigation Sidebar */}
      <Sidebar
        activeView={activeView}
        setActiveView={handleNavigate}
        onOpenHelp={handleOpenHelp}
      />

      {/* Main View Area */}
      <main className="flex-1 h-screen overflow-y-auto px-5 sm:px-8 py-5">
        {children}
      </main>

      {/* Interactive Tour Guide Modal */}
      <ClinicTourGuide
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        currentStep={tourStep}
        setCurrentStep={setTourStep}
      />

    </div>
  );
};
