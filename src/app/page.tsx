'use client';

import React, { useState, useEffect } from 'react';
import { Header, TabType } from '@/components/Header';
import { VoiceCoachTab } from '@/components/VoiceCoachTab';
import { CrmDashboardTab } from '@/components/CrmDashboardTab';
import { KnowledgeBaseTab } from '@/components/KnowledgeBaseTab';
import { ActionPlansTab } from '@/components/ActionPlansTab';
import { ClinicTourGuide } from '@/components/ClinicTourGuide';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('coach');
  const [sessionId, setSessionId] = useState<string>('');
  const [isSessionActive, setIsSessionActive] = useState<boolean>(true);
  const [sessionDuration, setSessionDuration] = useState<number>(0);
  const [prefilledCoachPrompt, setPrefilledCoachPrompt] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  // Interactive Guide State
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [guideStep, setGuideStep] = useState<number>(1);

  // Initialize or restore active session ID
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

  // Update HTML root class for dark/light theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Timer for active session
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSessionActive) {
      interval = setInterval(() => {
        setSessionDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive]);

  const startNewSession = () => {
    const newId = 'session-' + Date.now();
    setSessionId(newId);
    localStorage.setItem('aura_active_session_id', newId);
    setSessionDuration(0);
    setIsSessionActive(true);
  };

  const handleCoachClient = (prompt: string) => {
    setPrefilledCoachPrompt(prompt);
    setActiveTab('coach');
  };

  const openGuide = () => {
    setGuideStep(1);
    setIsGuideOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFC] text-slate-900 flex flex-col font-sans selection:bg-amber-200 selection:text-slate-950">
      
      {/* Top Luxury Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSessionActive={isSessionActive}
        sessionDuration={sessionDuration}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onOpenGuide={openGuide}
      />

      {/* Main Workspace View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'coach' && (
          <VoiceCoachTab
            sessionId={sessionId}
            onNewSession={startNewSession}
            prefilledPrompt={prefilledCoachPrompt}
            clearPrefill={() => setPrefilledCoachPrompt('')}
          />
        )}

        {activeTab === 'crm' && (
          <CrmDashboardTab onCoachClient={handleCoachClient} />
        )}

        {activeTab === 'knowledge' && (
          <KnowledgeBaseTab />
        )}

        {activeTab === 'actions' && (
          <ActionPlansTab />
        )}
      </main>

      {/* Subtle Minimal Footer */}
      <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-500 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-semibold text-slate-700">Aura Clinic Executive Voice AI • V-Unite Challenge Final MVP</span>
          <div className="flex items-center space-x-3 text-[11px] text-slate-500 font-medium">
            <span>Fish Audio TTS</span>
            <span>•</span>
            <span>DeepSeek-V3 RAG</span>
            <span>•</span>
            <span>n8n Orchestrated</span>
            <span>•</span>
            <span>Supabase pgvector</span>
          </div>
        </div>
      </footer>

      {/* Interactive Step-by-Step Clinic Tour Guide */}
      <ClinicTourGuide
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        currentStep={guideStep}
        setCurrentStep={setGuideStep}
      />

    </div>
  );
}
