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
          <button className="relative p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 transition shadow-xs">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-500" />
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

      {/* 4 KPI Metric Cards with Sparklines */}
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
          {/* Gold Sparkline */}
          <div className="h-7 w-full pt-1">
            <svg className="w-full h-full" viewBox="0 0 100 25" preserveAspectRatio="none">
              <path
                d="M0,22 Q15,19 25,14 T50,16 T75,9 T100,5"
                fill="none"
                stroke="#C5A880"
                strokeWidth="2.5"
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
          {/* Green Sparkline */}
          <div className="h-7 w-full pt-1">
            <svg className="w-full h-full" viewBox="0 0 100 25" preserveAspectRatio="none">
              <path
                d="M0,16 Q20,21 40,13 T70,15 T100,10"
                fill="none"
                stroke="#2D5A3C"
                strokeWidth="2.5"
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
          {/* Bar Graph */}
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
          {/* Green Sparkline */}
          <div className="h-7 w-full pt-1">
            <svg className="w-full h-full" viewBox="0 0 100 25" preserveAspectRatio="none">
              <path
                d="M0,18 Q30,12 60,8 T100,6"
                fill="none"
                stroke="#2D5A3C"
                strokeWidth="2.5"
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
              <div className="flex items-center space-x-4 text-[11px] text-slate-500 mt-1 font-sans">
                <span className="flex items-center space-x-1.5">
                  <span className="w-3 h-0.5 bg-[#C5A880]" />
                  <span>Revenue (USD)</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-3 h-0.5 bg-[#2D5A3C]" />
                  <span>Retention (%)</span>
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-1 text-xs border border-slate-200 px-3 py-1.5 rounded-xl bg-slate-50 text-slate-700 font-medium">
              <span>Last 90 days</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          {/* Chart with Dual Y-Axis */}
          <div className="relative h-48 w-full pt-2">
            <div className="flex h-full">
              
              {/* Left Y-Axis (Revenue) */}
              <div className="flex flex-col justify-between text-[10px] text-slate-400 font-mono pr-2 text-right w-10">
                <span>$80K</span>
                <span>$60K</span>
                <span>$40K</span>
                <span>$20K</span>
                <span>$0</span>
              </div>

              {/* Chart SVG */}
              <div className="flex-1 relative h-full">
                <svg className="w-full h-full" viewBox="0 0 500 160" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="0" x2="500" y2="0" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="0" y1="40" x2="500" y2="40" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="0" y1="80" x2="500" y2="80" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="0" y1="120" x2="500" y2="120" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="0" y1="160" x2="500" y2="160" stroke="#F1F5F9" strokeWidth="1" />
                  
                  {/* Revenue Gold Curve */}
                  <path
                    d="M0,110 C60,105 100,98 160,90 C220,95 280,72 340,66 C400,60 440,46 500,32"
                    fill="none"
                    stroke="#C5A880"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  {/* Retention Green Curve */}
                  <path
                    d="M0,88 C70,84 130,86 200,80 C270,82 350,76 420,78 C460,76 490,73 500,70"
                    fill="none"
                    stroke="#2D5A3C"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Right Y-Axis (Retention) */}
              <div className="flex flex-col justify-between text-[10px] text-slate-400 font-mono pl-2 text-left w-10">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>

            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-2 px-10">
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
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-sans">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
              <span className="text-slate-500 font-medium">Revenue</span>
              <span className="font-bold text-slate-900">$57,980</span>
              <span className="text-emerald-700 font-medium">↑ 8.4%</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#2D5A3C]" />
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
                  <h4 className="text-xs font-bold text-slate-900 font-sans">8 patients need follow-up</h4>
                  <p className="text-[11px] text-slate-500 font-sans">Outreach to rebook or check in</p>
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
                  <h4 className="text-xs font-bold text-slate-900 font-sans">5 consultations not converted</h4>
                  <p className="text-[11px] text-slate-500 font-sans">Review and improve conversion flow</p>
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
                  <h4 className="text-xs font-bold text-slate-900 font-sans">2 low-satisfaction patients</h4>
                  <p className="text-[11px] text-slate-500 font-sans">Address concerns to protect retention</p>
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
              <span className="text-xs font-bold font-sans">AI Coaching</span>
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
              <span className="text-xs font-bold font-sans">Knowledge Base</span>
              <span className="text-[10px] text-slate-400">· 6 documents · 184 chunks</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Status</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                RAG ready
              </span>
            </div>
            {/* Sparkline for indexing activity */}
            <div className="pt-1 flex items-center space-x-2">
              <span className="text-[10px] text-slate-400">Indexing activity (last 7 days)</span>
              <div className="h-4 flex-1">
                <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0,15 Q30,18 60,10 T100,5" fill="none" stroke="#2D5A3C" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
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
              <span className="text-xs font-bold font-sans">Action Plan Progress</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 font-sans">VIP Retention Sprint</h4>
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
          
          <div className="py-2.5 flex items-center justify-between hover:bg-slate-50/50 px-1 rounded transition cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 font-sans">3 follow-ups were completed</p>
                <p className="text-[11px] text-slate-400">Follow-up tasks marked complete</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-slate-400">
              <span className="text-[11px]">1 hour ago</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="py-2.5 flex items-center justify-between hover:bg-slate-50/50 px-1 rounded transition cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Users className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 font-sans">New patient: Victoria Kensington</p>
                <p className="text-[11px] text-slate-400">Consultation scheduled for Sep 8, 2026</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-slate-400">
              <span className="text-[11px]">3 hours ago</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="py-2.5 flex items-center justify-between hover:bg-slate-50/50 px-1 rounded transition cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 font-sans">Document indexed: Morpheus8 Treatment Protocol</p>
                <p className="text-[11px] text-slate-400">Added to knowledge base</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-slate-400">
              <span className="text-[11px]">5 hours ago</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
