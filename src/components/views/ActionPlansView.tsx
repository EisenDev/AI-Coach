'use client';

import React, { useState } from 'react';
import { ActionPlan } from '@/types/clinic';
import {
  Sparkles,
  Upload,
  CheckCircle2,
  Target,
  DollarSign,
  Calendar,
  MessageSquare,
  Plus,
  MoreVertical,
  FileText,
  Users,
} from 'lucide-react';

const INITIAL_PLANS: ActionPlan[] = [
  {
    id: 'plan-1',
    title: 'VIP Retention Sprint',
    status: 'Active',
    createdAt: 'Jun 27, 2026',
    category: 'Customer Retention',
    owners: ['CV', 'FD', 'MK'],
    completedCount: 1,
    totalCount: 5,
    summary:
      'Eight patients have not rebooked within 90 days. Three high-value patients represent $13,600 in at-risk lifetime value.',
    evidenceCount: 50,
    evidenceDoc: 'VIP Retention SOP',
    rebookingTarget: '65%',
    atRiskRecovered: '$8,000',
    dueInDays: '7 days',
    rationale:
      'High-value patients show the greatest risk of churn based on booking recency and lifetime value. Personal outreach and timely follow-ups have the highest impact on rebooking within 14 days.',
    actions: [
      {
        id: 'act-1',
        priority: 'High',
        action: 'Send personalized outreach to 3 high-value patients',
        owner: 'Dr. Chloe',
        ownerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
        dueDate: 'Today',
        status: 'Ready',
        completed: true,
      },
      {
        id: 'act-2',
        priority: 'High',
        action: 'Call patients inactive for more than 90 days',
        owner: 'Front Desk',
        dueDate: 'Tomorrow',
        status: 'Not started',
        completed: false,
      },
      {
        id: 'act-3',
        priority: 'Medium',
        action: 'Create a 14-day follow-up sequence',
        owner: 'Marketing',
        dueDate: 'Jun 30',
        status: 'Draft ready',
        completed: false,
      },
      {
        id: 'act-4',
        priority: 'Medium',
        action: 'Review Morpheus8 rebooking protocol',
        owner: 'Dr. Chloe',
        dueDate: 'Jul 01',
        status: 'Not started',
        completed: false,
      },
      {
        id: 'act-5',
        priority: 'Low',
        action: 'Measure outreach-to-booking conversion',
        owner: 'Operations',
        dueDate: 'Jul 08',
        status: 'Not started',
        completed: false,
      },
    ],
  },
  {
    id: 'plan-2',
    title: 'CoolSculpting Conversion',
    status: 'In progress',
    createdAt: 'Jun 25, 2026',
    category: 'Consultation Conversion',
    owners: ['CV', 'MS'],
    completedCount: 2,
    totalCount: 4,
    summary:
      'CoolSculpting consultation-to-treatment conversion dropped to 48%. Implementing 3D body contouring visualizer in consultations.',
    evidenceCount: 50,
    evidenceDoc: 'Consultation Objection Script',
    rebookingTarget: '70%',
    atRiskRecovered: '$12,400',
    dueInDays: '12 days',
    rationale:
      'Patients hesitate on price objection during body contouring consults. Structuring 2-area bundle packaging boosts immediate commitment.',
    actions: [
      {
        id: 'act-201',
        priority: 'High',
        action: 'Implement 3D before/after scan review protocol',
        owner: 'Marcus Sterling',
        dueDate: 'Jun 28',
        status: 'Ready',
        completed: true,
      },
      {
        id: 'act-202',
        priority: 'Medium',
        action: 'Train staff on tier-discount financing presentation',
        owner: 'Dr. Chloe',
        dueDate: 'Jul 02',
        status: 'Ready',
        completed: true,
      },
    ],
  },
  {
    id: 'plan-3',
    title: 'Monthly Clinic Review',
    status: 'Completed',
    createdAt: 'Jun 05, 2026',
    category: 'Operational Growth',
    owners: ['CV', 'OP'],
    completedCount: 5,
    totalCount: 5,
    summary:
      'Q2 Practice performance targets met with $57,980 monthly revenue and 4.8/5 satisfaction.',
    evidenceCount: 50,
    evidenceDoc: 'Injectables Pricing 2026',
    rebookingTarget: '60%',
    atRiskRecovered: '$15,000',
    dueInDays: '0 days',
    rationale: 'Quarterly review complete with positive provider room utilization.',
    actions: [],
  },
];

interface ActionPlansViewProps {
  onStartNewSession: () => void;
  onContinueCoach: (prompt: string) => void;
}

export const ActionPlansView: React.FC<ActionPlansViewProps> = ({
  onStartNewSession,
  onContinueCoach,
}) => {
  const [plans, setPlans] = useState<ActionPlan[]>(INITIAL_PLANS);
  const [selectedPlan, setSelectedPlan] = useState<ActionPlan>(INITIAL_PLANS[0]);

  const toggleActionComplete = (actionId: string) => {
    setSelectedPlan((prev) => {
      const updatedActions = prev.actions.map((act) =>
        act.id === actionId ? { ...act, completed: !act.completed } : act
      );
      const newCompleted = updatedActions.filter((a) => a.completed).length;
      return {
        ...prev,
        completedCount: newCompleted,
        actions: updatedActions,
      };
    });
  };

  const handleExport = () => {
    const md = `# Aura Clinic Action Plan: ${selectedPlan.title}
Generated: ${selectedPlan.createdAt} | Category: ${selectedPlan.category}

## Summary
${selectedPlan.summary}

## Priority Actions
${selectedPlan.actions.map((a, i) => `${i + 1}. [${a.completed ? 'X' : ' '}] (${a.priority}) ${a.action} - Owner: ${a.owner} (Due: ${a.dueDate})`).join('\n')}

## Rationale
${selectedPlan.rationale}
`;
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedPlan.title.toLowerCase().replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12 w-full">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Action Plans
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-sans">
            Turn coaching insights into focused, measurable clinic improvements.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          <button
            onClick={handleExport}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition shadow-xs"
          >
            <Upload className="w-3.5 h-3.5 rotate-180 text-slate-500" />
            <span>Export plan</span>
          </button>

          <button
            onClick={onStartNewSession}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#1E3A2B] hover:bg-[#162D21] text-white text-xs font-bold transition shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Start new session</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Plan List, Center Selected Plan, Right Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 3 Cols: Your Plans List */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-sans">Your plans</h3>
            <button className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {plans.map((plan) => {
              const isSelected = selectedPlan.id === plan.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-white border-[#2D5A3C] shadow-xs'
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#EBF3EA] text-[#1E3A2B] flex items-center justify-center font-bold text-xs">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 font-sans">{plan.title}</h4>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-500 mt-0.5">
                        <span className="inline-flex items-center space-x-1">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              plan.status === 'Active'
                                ? 'bg-emerald-600'
                                : plan.status === 'In progress'
                                ? 'bg-amber-500'
                                : 'bg-slate-400'
                            }`}
                          />
                          <span>{plan.status}</span>
                        </span>
                        <span>·</span>
                        <span>{plan.createdAt}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center 6 Cols: Selected Plan Detailed View */}
        <div className="lg:col-span-6 space-y-4">
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            
            {/* Header with Title, Badge, Owners, Progress */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-slate-900 font-sans">{selectedPlan.title}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF3EA] text-[#1E3A2B] border border-[#D5E6D3]">
                      ✨ AI-generated from coaching session
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-sans">
                    {selectedPlan.category} · Created {selectedPlan.createdAt}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-500 font-sans">Owners</span>
                  <div className="flex -space-x-1.5">
                    <div className="w-6 h-6 rounded-full bg-amber-50 border border-amber-300 text-[10px] font-bold text-amber-900 flex items-center justify-center">
                      CV
                    </div>
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80"
                      alt="Owner"
                      className="w-6 h-6 rounded-full object-cover border border-white"
                    />
                    <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-700 flex items-center justify-center">
                      FD
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-slate-600 font-mono">
                    {selectedPlan.completedCount} of {selectedPlan.actions.length} completed
                  </span>
                  <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{
                        width: `${
                          selectedPlan.actions.length > 0
                            ? (selectedPlan.completedCount / selectedPlan.actions.length) * 100
                            : 0
                        }%`,
                      }}
                      className="h-full bg-[#2D5A3C] rounded-full transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Session Summary Box */}
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100 space-y-2.5">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block font-sans">
                Session summary
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-sans">
                {selectedPlan.summary}
              </p>
              <div className="flex items-center space-x-2 pt-1">
                <span className="text-[10px] text-slate-400 font-medium">Evidence</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-slate-700 border border-slate-200 flex items-center space-x-1">
                  <Users className="w-3 h-3 text-slate-500" />
                  <span>{selectedPlan.evidenceCount} patient records</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-slate-700 border border-slate-200 flex items-center space-x-1">
                  <FileText className="w-3 h-3 text-slate-500" />
                  <span>{selectedPlan.evidenceDoc}</span>
                </span>
              </div>
            </div>

            {/* Priority Actions Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-sans">Priority actions</h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-2 px-1 w-6">#</th>
                      <th className="py-2 px-2">Priority</th>
                      <th className="py-2 px-2">Action</th>
                      <th className="py-2 px-2">Owner</th>
                      <th className="py-2 px-2">Due date</th>
                      <th className="py-2 px-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedPlan.actions.map((act, index) => (
                      <tr key={act.id} className="hover:bg-slate-50/60 transition">
                        <td className="py-3 px-1 text-slate-400 font-mono">
                          <input
                            type="checkbox"
                            checked={act.completed}
                            onChange={() => toggleActionComplete(act.id)}
                            className="rounded border-slate-300 text-[#1E3A2B] focus:ring-[#1E3A2B] cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              act.priority === 'High'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : act.priority === 'Medium'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-slate-50 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {act.priority}
                          </span>
                        </td>
                        <td className={`py-3 px-2 font-sans ${act.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {act.action}
                        </td>
                        <td className="py-3 px-2 text-slate-600 whitespace-nowrap">
                          <div className="flex items-center space-x-1.5">
                            {act.owner === 'Dr. Chloe' ? (
                              <div className="w-5 h-5 rounded-full bg-amber-50 border border-amber-300 text-[9px] font-bold text-amber-900 flex items-center justify-center">
                                CV
                              </div>
                            ) : act.owner === 'Front Desk' ? (
                              <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 text-[9px] font-bold text-slate-700 flex items-center justify-center">
                                FD
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-200 text-[9px] font-bold text-indigo-700 flex items-center justify-center">
                                {act.owner.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                            <span className="text-[11px]">{act.owner}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-slate-500 whitespace-nowrap text-[11px]">
                          {act.dueDate}
                        </td>
                        <td className="py-3 px-2 text-right whitespace-nowrap">
                          <span
                            className={`px-2.5 py-0.5 rounded text-[10px] font-semibold ${
                              act.completed
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : act.status === 'Ready' || act.status === 'Draft ready'
                                ? 'bg-emerald-50/60 text-emerald-800 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {act.completed ? '✓ Completed' : `✓ ${act.status}`}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>

        {/* Right 3 Cols: Success Metrics & AI Rationale */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Success Metrics Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 font-sans">Success metrics</h3>

            <div className="space-y-3 divide-y divide-slate-100 text-xs">
              
              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-slate-600">
                  <Target className="w-4 h-4 text-emerald-700" />
                  <span>Rebooking target</span>
                </div>
                <span className="font-bold text-slate-900 font-mono">{selectedPlan.rebookingTarget}</span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-slate-600">
                  <DollarSign className="w-4 h-4 text-amber-700" />
                  <span>At-risk value recovered</span>
                </div>
                <span className="font-bold text-slate-900 font-mono">{selectedPlan.atRiskRecovered}</span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-slate-600">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span>Due in</span>
                </div>
                <span className="font-bold text-slate-900 font-mono">{selectedPlan.dueInDays}</span>
              </div>

            </div>
          </div>

          {/* AI Rationale Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 font-sans">AI rationale</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              {selectedPlan.rationale}
            </p>

            <button
              onClick={() =>
                onContinueCoach(`Let's review progress on our ${selectedPlan.title} and next outreach steps for our 3 high-value patients.`)
              }
              className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl border border-slate-200 hover:border-[#1E3A2B] bg-white hover:bg-slate-50 text-[#1E3A2B] text-xs font-bold transition shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Continue with AI Coach</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
