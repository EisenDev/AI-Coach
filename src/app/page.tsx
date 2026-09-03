'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar, ViewType } from '@/components/Sidebar';
import { OverviewView } from '@/components/views/OverviewView';
import { AiCoachView } from '@/components/views/AiCoachView';
import { PatientsView } from '@/components/views/PatientsView';
import { KnowledgeView } from '@/components/views/KnowledgeView';
import { ActionPlansView } from '@/components/views/ActionPlansView';
import { SessionsView } from '@/components/views/SessionsView';
import { ClinicTourGuide } from '@/components/ClinicTourGuide';

export default function Home() {
  const [activeView, setActiveView] = useState<ViewType>('overview');
  const [sessionId, setSessionId] = useState<string>('');
  const [prefilledCoachPrompt, setPrefilledCoachPrompt] = useState<string>('');
  const [patientsInitialFilter, setPatientsInitialFilter] = useState<string>('all');
  
  // Interactive Tour State
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [tourStep, setTourStep] = useState<number>(1);

  // Restore or generate active session ID
  useEffect(() => {
    const savedSessionId = localStorage.getItem('aura_active_session_id');
    if (savedSessionId) {
      setSessionId(savedSessionId);
    } else {
      const newId = 'session-' + Date.now();
      setSessionId(newId);
      localStorage.setItem('aura_active_session_id', newId);
    }
  }, []);

  const handleStartNewSession = () => {
    const newId = 'session-' + Date.now();
    setSessionId(newId);
    localStorage.setItem('aura_active_session_id', newId);
    setActiveView('coach');
  };

  const handleCoachClient = (prompt: string) => {
    setPrefilledCoachPrompt(prompt);
    setActiveView('coach');
  };

  const handleOpenPatientsWithFilter = (filter?: string) => {
    if (filter) setPatientsInitialFilter(filter);
    setActiveView('patients');
  };

  const handleOpenHelp = () => {
    setTourStep(1);
    setIsHelpOpen(true);
  };

  return (
    <div className="flex h-screen bg-[#FAF9F6] text-slate-900 font-sans antialiased overflow-hidden selection:bg-[#D5E6D3] selection:text-[#1E3A2B]">
      
      {/* Left Sidebar Navigation */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenHelp={handleOpenHelp}
      />

      {/* Main Content Workspace - Compact Full Width without artificial margins */}
      <main className="flex-1 h-screen overflow-y-auto px-5 sm:px-8 py-5">
        {activeView === 'overview' && (
          <OverviewView
            onOpenCoach={() => setActiveView('coach')}
            onOpenPatients={handleOpenPatientsWithFilter}
            onOpenKnowledge={() => setActiveView('knowledge')}
            onOpenActions={() => setActiveView('actions')}
          />
        )}

        {activeView === 'coach' && (
          <AiCoachView
            sessionId={sessionId}
            onNewSession={handleStartNewSession}
            prefilledPrompt={prefilledCoachPrompt}
            clearPrefill={() => setPrefilledCoachPrompt('')}
          />
        )}

        {activeView === 'patients' && (
          <PatientsView
            onCoachClient={handleCoachClient}
            initialFilter={patientsInitialFilter}
          />
        )}

        {activeView === 'knowledge' && (
          <KnowledgeView />
        )}

        {activeView === 'sessions' && (
          <SessionsView
            onOpenSession={(id) => {
              setSessionId(id);
              localStorage.setItem('aura_active_session_id', id);
              setActiveView('coach');
            }}
            onNewSession={handleStartNewSession}
          />
        )}

        {activeView === 'actions' && (
          <ActionPlansView
            onStartNewSession={handleStartNewSession}
            onContinueCoach={handleCoachClient}
          />
        )}
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
}
