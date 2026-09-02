'use client';

import React from 'react';
import {
  LayoutGrid,
  MessageSquare,
  Users,
  BookOpen,
  Calendar,
  CheckSquare,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import { AuraLogo } from './AuraLogo';

export type ViewType = 'overview' | 'coach' | 'patients' | 'knowledge' | 'sessions' | 'actions';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  onOpenHelp: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  onOpenHelp,
}) => {
  const navItems: { id: ViewType; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'coach', label: 'AI Coach', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'patients', label: 'Patients', icon: <Users className="w-4 h-4" /> },
    { id: 'knowledge', label: 'Knowledge', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'sessions', label: 'Sessions', icon: <Calendar className="w-4 h-4" /> },
    { id: 'actions', label: 'Action Plans', icon: <CheckSquare className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between h-screen sticky top-0 flex-shrink-0 select-none">
      
      {/* Top Section: Brand Logo & Navigation */}
      <div className="p-6 space-y-7">
        
        {/* Logo & Clinic Title */}
        <div className="flex flex-col items-center text-center space-y-1.5 cursor-pointer" onClick={() => setActiveView('overview')}>
          <AuraLogo size={42} />
          <h1 className="text-sm font-serif font-bold tracking-widest text-slate-900 uppercase pt-1">
            AURA CLINIC
          </h1>
          <p className="text-[10px] font-sans font-medium text-amber-800/80 tracking-wide">
            AI Practice Intelligence
          </p>
        </div>

        {/* Nav Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${
                  isActive
                    ? 'bg-[#EBF3EA] text-[#1E3A2B] font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span className={isActive ? 'text-[#1E3A2B]' : 'text-slate-500'}>
                  {item.icon}
                </span>
                <span className="font-sans text-[13px]">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Help & User Profile */}
      <div className="p-4 border-t border-slate-100 space-y-3">
        
        {/* Help Button */}
        <button
          onClick={onOpenHelp}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
        >
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span className="font-medium text-[13px]">Help & Tour</span>
        </button>

        {/* User Card */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-slate-100/80 transition cursor-pointer">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full border border-amber-300 bg-amber-50 text-amber-900 font-serif font-bold text-xs flex items-center justify-center shadow-xs">
              CV
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">Dr. Chloe Vance</p>
              <p className="text-[10px] text-slate-500 font-medium">Clinic Director</p>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>

      </div>

    </aside>
  );
};
