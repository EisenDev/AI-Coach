'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar, ViewType } from './Sidebar';
import { ClinicTourGuide } from './ClinicTourGuide';
import { Menu, Sparkles } from 'lucide-react';
import { AuraLogo } from './AuraLogo';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [tourStep, setTourStep] = useState(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Derive active view from pathname (7 Total Pages)
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
    : pathname.includes('/team')
    ? 'team'
    : 'overview';

  const handleNavigate = (view: ViewType) => {
    setIsMobileMenuOpen(false);
    router.push(`/${view}`);
  };

  const handleOpenHelp = () => {
    setIsMobileMenuOpen(false);
    setTourStep(1);
    setIsHelpOpen(true);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#FAF9F6] text-slate-900 font-sans antialiased overflow-hidden selection:bg-[#D5E6D3] selection:text-[#1E3A2B]">
      
      {/* Mobile Top Header with Hamburger Menu (Visible only on < md screens) */}
      <header className="md:hidden h-14 bg-white border-b border-slate-200/80 px-4 flex items-center justify-between z-30 flex-shrink-0 select-none">
        <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => handleNavigate('overview')}>
          <AuraLogo size={28} />
          <div>
            <h1 className="text-xs font-serif font-bold tracking-wider text-slate-900 uppercase">
              AURA CLINIC
            </h1>
            <p className="text-[9px] font-sans font-medium text-amber-800">
              AI Practice Intelligence
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition"
          title="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Desktop Left Navigation Sidebar */}
      <Sidebar
        activeView={activeView}
        setActiveView={handleNavigate}
        onOpenHelp={handleOpenHelp}
      />

      {/* Mobile Slide-in Drawer Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-fadeIn">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Sidebar */}
          <div className="relative z-10 animate-slideRight">
            <Sidebar
              activeView={activeView}
              setActiveView={handleNavigate}
              onOpenHelp={handleOpenHelp}
              onCloseMobileDrawer={() => setIsMobileMenuOpen(false)}
              isMobileDrawer={true}
            />
          </div>
        </div>
      )}

      {/* Main View Area (Responsive padding) */}
      <main className="flex-1 h-[calc(100vh-3.5rem)] md:h-screen overflow-y-auto px-4 sm:px-6 md:px-8 py-4 md:py-5">
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
