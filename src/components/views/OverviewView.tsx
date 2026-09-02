'use client';

import React from 'react';
import {
  Bell,
  Sparkles,
  DollarSign,
  Target,
  Users,
  Star,
  ChevronRight,
  MessageSquare,
  BookOpen,
  CheckSquare,
  Calendar,
  TrendingUp,
  TrendingDown,
  ChevronDown,
} from 'lucide-react';

interface OverviewViewProps {
  onOpenCoach: () => void;
  onOpenPatients: (filter?: string) => void;
  onOpenKnowledge: () => void;
  onOpenActions: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  onOpenCoach,
  onOpenPatients,
  onOpenKnowledge,
  onOpenActions,
}) => {
  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Good morning, Dr. Vance
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-sans">
            Here&apos;s what needs your attention today.
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start sm:self-auto">
          <span className="text-xs font-medium text-slate-500 font-sans">
            September 3, 2026
          </span>
          <button className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 transition shadow-xs">
            <Bell className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenCoach}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#1E3A2B] hover:bg-[#162D21] text-white text-xs font-bold transition shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Open AI Coach</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards with Sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Revenue */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-slate-500">Revenue</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold font-sans text-slate-900">$57,980</h3>
            <p className="text-[11px] font-medium text-emerald-700 flex items-center space-x-1 mt-0.5">
              <span>↑ +8.4% this month</span>
            </p>
          </div>
          {/* Sparkline */}
          <div className="h-7 w-full pt-1">
            <svg className="w-full h-full" viewBox="0 0 100 25" preserveAspectRatio="none">
              <path
                d="M0,20 Q15,18 25,12 T50,15 T75,8 T100,5"
                fill="none"
                stroke="#C5A880"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: 90-Day Retention */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-slate-500">90-Day Retention</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold font-sans text-slate-900">60%</h3>
            <p className="text-[11px] font-medium text-slate-500 flex items-center space-x-1 mt-0.5">
              <span>🎯 Goal 65%</span>
            </p>
          </div>
          {/* Sparkline */}
          <div className="h-7 w-full pt-1">
            <svg className="w-full h-full" viewBox="0 0 100 25" preserveAspectRatio="none">
              <path
                d="M0,15 Q20,20 40,12 T70,14 T100,10"
                fill="none"
                stroke="#2D5A3C"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 3: Active Patients */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-slate-500">Active Patients</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold font-sans text-slate-900">50</h3>
            <p className="text-[11px] font-medium text-emerald-700 flex items-center space-x-1 mt-0.5">
              <span>↑ +6 this month</span>
            </p>
          </div>
          {/* Mini Bar Graph */}
          <div className="h-7 w-full flex items-end justify-between px-1 pt-1 gap-1">
            {[40, 60, 35, 80, 50, 65, 90, 70, 85, 95, 60, 75, 100].map((h, i) => (
              <div
                key={i}
                style={{ height: `${h}%` }}
                className="w-full bg-[#2D5A3C]/70 rounded-xs"
              />
            ))}
          </div>
        </div>

        {/* Card 4: Satisfaction */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Star className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-slate-500">Satisfaction</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold font-sans text-slate-900">4.8/5</h3>
            <p className="text-[11px] font-medium text-amber-800 flex items-center space-x-1 mt-0.5">
              <span>🏆 Top 5%</span>
            </p>
          </div>
          {/* Sparkline */}
          <div className="h-7 w-full pt-1">
            <svg className="w-full h-full" viewBox="0 0 100 25" preserveAspectRatio="none">
              <path
                d="M0,18 Q30,12 60,8 T100,6"
                fill="none"
                stroke="#2D5A3C"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

      </div>

      {/* Middle Grid: Clinic Performance Chart & Needs Attention Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Performance Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-sans">Clinic Performance</h3>
              <div className="flex items-center space-x-4 text-[11px] text-slate-500 mt-1">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C5A880]" />
                  <span>Revenue (USD)</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2D5A3C]" />
                  <span>Retention (%)</span>
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-1 text-xs border border-slate-200 px-3 py-1.5 rounded-xl bg-slate-50 text-slate-700 font-medium">
              <span>Last 90 days</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          {/* Dual Line Curve SVG Chart */}
          <div className="relative h-48 w-full pt-4">
            <svg className="w-full h-full" viewBox="0 0 500 160" preserveAspectRatio="none">
              {/* Grid Lines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="#F1F5F9" strokeWidth="1" />
              
              {/* Revenue Gold Curve */}
              <path
                d="M0,120 C60,110 100,105 160,95 C220,100 280,75 340,70 C400,65 440,50 500,35"
                fill="none"
                stroke="#C5A880"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Retention Green Curve */}
              <path
                d="M0,90 C70,85 130,88 200,82 C270,84 350,78 420,80 C460,78 490,75 500,72"
                fill="none"
                stroke="#2D5A3C"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>

            {/* X-Axis Labels */}
            <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-2">
              <span>Jun 6</span>
              <span>Jun 20</span>
              <span>Jul 4</span>
              <span>Jul 18</span>
              <span>Aug 1</span>
              <span>Aug 15</span>
              <span>Aug 29</span>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-slate-500 font-medium">Revenue</span>
              <span className="font-bold text-slate-900">$57,980</span>
              <span className="text-emerald-700 font-medium">↑ 8.4%</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-slate-500 font-medium">Retention</span>
              <span className="font-bold text-slate-900">60%</span>
              <span className="text-slate-400 font-medium">Goal 65%</span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Needs Attention Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 font-sans">Needs Attention</h3>

          <div className="space-y-2.5">
            
            {/* Item 1 */}
            <div
              onClick={() => onOpenPatients('needs-follow-up')}
              className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition cursor-pointer flex items-center justify-between border border-slate-100"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">8 patients need follow-up</h4>
                  <p className="text-[11px] text-slate-500">Outreach to rebook or check in</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            {/* Item 2 */}
            <div
              onClick={onOpenCoach}
              className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition cursor-pointer flex items-center justify-between border border-slate-100"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">5 consultations not converted</h4>
                  <p className="text-[11px] text-slate-500">Review and improve conversion flow</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            {/* Item 3 */}
            <div
              onClick={() => onOpenPatients('low-satisfaction')}
              className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition cursor-pointer flex items-center justify-between border border-slate-100"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">2 low-satisfaction patients</h4>
                  <p className="text-[11px] text-slate-500">Address concerns to protect retention</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

          </div>
        </div>

      </div>

      {/* Bottom 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: AI Coaching */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-slate-800">
              <MessageSquare className="w-4 h-4 text-[#2D5A3C]" />
              <span className="text-xs font-bold">AI Coaching</span>
              <span className="text-[10px] text-slate-400">· 3 sessions this week</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#EBF3EA] text-[#1E3A2B] text-xs font-medium border border-[#D5E6D3]">
              Latest insight: <strong>Morpheus8 has the weakest rebooking rate</strong>
            </div>
          </div>
          <button
            onClick={onOpenCoach}
            className="flex items-center justify-between text-xs font-bold text-[#1E3A2B] hover:underline pt-2"
          >
            <span>Open AI Coach</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Knowledge Base */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-slate-800">
              <BookOpen className="w-4 h-4 text-[#2D5A3C]" />
              <span className="text-xs font-bold">Knowledge Base</span>
              <span className="text-[10px] text-slate-400">· 6 documents · 184 chunks</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Status</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                RAG ready
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Indexing activity active across 1024-dim pgvector.
            </p>
          </div>
          <button
            onClick={onOpenKnowledge}
            className="flex items-center justify-between text-xs font-bold text-[#1E3A2B] hover:underline pt-2"
          >
            <span>Manage knowledge</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: Action Plan Progress */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-slate-800">
              <CheckSquare className="w-4 h-4 text-[#2D5A3C]" />
              <span className="text-xs font-bold">Action Plan Progress</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900">VIP Retention Sprint</h4>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>1 of 5 complete</span>
                <span>Due in 7 days</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#2D5A3C] w-1/5 rounded-full" />
              </div>
            </div>
          </div>
          <button
            onClick={onOpenActions}
            className="flex items-center justify-between text-xs font-bold text-[#1E3A2B] hover:underline pt-2"
          >
            <span>View plan</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 font-sans">Recent activity</h3>

        <div className="divide-y divide-slate-100 text-xs">
          
          <div className="py-2.5 flex items-center justify-between hover:bg-slate-50/50 px-1 rounded transition">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-bold text-slate-900">3 follow-ups were completed</p>
                <p className="text-[11px] text-slate-400">Follow-up tasks marked complete</p>
              </div>
            </div>
            <span className="text-[11px] text-slate-400">1 hour ago</span>
          </div>

          <div className="py-2.5 flex items-center justify-between hover:bg-slate-50/50 px-1 rounded transition">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Users className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-bold text-slate-900">New patient: Victoria Kensington</p>
                <p className="text-[11px] text-slate-400">Consultation scheduled for Sep 8, 2026</p>
              </div>
            </div>
            <span className="text-[11px] text-slate-400">3 hours ago</span>
          </div>

          <div className="py-2.5 flex items-center justify-between hover:bg-slate-50/50 px-1 rounded transition">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Document indexed: Morpheus8 Treatment Protocol</p>
                <p className="text-[11px] text-slate-400">Added to knowledge base</p>
              </div>
            </div>
            <span className="text-[11px] text-slate-400">5 hours ago</span>
          </div>

        </div>
      </div>

    </div>
  );
};
