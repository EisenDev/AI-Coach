'use client';

import React from 'react';
import { Mic, Users, BookOpen, FileText, Sparkles, Activity, Sun, Moon, HelpCircle, Clock } from 'lucide-react';

export type TabType = 'coach' | 'crm' | 'knowledge' | 'actions';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isSessionActive: boolean;
  sessionDuration: number;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onOpenGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isSessionActive,
  sessionDuration,
  isDarkMode,
  setIsDarkMode,
  onOpenGuide,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'coach', label: 'Voice AI Coach', icon: <Mic className="w-4 h-4" /> },
    { id: 'crm', label: 'Practice CRM', icon: <Users className="w-4 h-4" />, badge: '25' },
    { id: 'knowledge', label: 'Knowledge RAG', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'actions', label: 'Action Plans', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-white/10 bg-white/95 dark:bg-obsidian-950/80 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & Clinic Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-700 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-base sm:text-lg">
                  AURA <span className="text-amber-700 dark:text-clinic-gold font-light">CLINIC</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  AI COACH MVP
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">Aesthetic Practice Revenue & Retention Intelligence</p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-100 dark:bg-obsidian-900/90 p-1 rounded-xl border border-slate-200 dark:border-white/10">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-300 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <span className={isActive ? 'text-amber-700' : 'text-slate-500'}>{item.icon}</span>
                  <span className="text-slate-900">{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-slate-200 text-slate-800 font-mono font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls: Guide, Timer & Online Pill */}
          <div className="flex items-center space-x-2.5">
            
            {/* Guide Button */}
            <button
              onClick={onOpenGuide}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold transition shadow-sm"
              title="Interactive Platform Guide"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
              <span>Guide Tour</span>
            </button>

            {/* Clean Session Timer */}
            {isSessionActive && (
              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-semibold">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Session: {formatTime(sessionDuration)}</span>
              </div>
            )}

            {/* Online Indicator */}
            <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>AI Coach Ready</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
