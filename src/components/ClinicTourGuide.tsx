'use client';

import React from 'react';
import { Sparkles, Mic, Target, Users, BookOpen, FileCheck, ChevronRight, ChevronLeft, X } from 'lucide-react';

interface ClinicTourGuideProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const TOUR_STEPS = [
  {
    step: 1,
    title: 'Executive Voice AI Coach',
    subtitle: 'Private Strategy Room for Clinic Directors',
    icon: <Mic className="w-5 h-5 text-amber-600" />,
    description:
      'Interact naturally with your AI Business Coach via microphone or text. The AI uses dual-source intelligence: querying both your 50 Supabase CRM records and clinical protocols in real-time.',
    tip: 'Click the central orb to start voice dictation with real-time text streaming.',
  },
  {
    step: 2,
    title: 'Strategic Focus Selectors',
    subtitle: 'Targeted Clinical Revenue Modes',
    icon: <Target className="w-5 h-5 text-rose-600" />,
    description:
      'Switch between 4 specialized executive coaching modes: 90-Day Retention & Rebooking, High-Ticket Treatment Upselling (Botox / Morpheus8), VIP Client Reactivation, and Provider Schedule Utilization.',
    tip: 'The AI adapts its coaching prompt and clinical reasoning based on your selected topic.',
  },
  {
    step: 3,
    title: 'Practice CRM Intelligence',
    subtitle: '50 Patient Records & LTV Tracking',
    icon: <Users className="w-5 h-5 text-amber-700" />,
    description:
      'Monitor active patient metrics, 90-day retention rates, and total practice revenue. Click "Coach Client" next to any at-risk patient (e.g. Victoria Kensington, $6,800 spend) to generate personalized win-back scripts.',
    tip: 'Filter between Rebooked vs. Pending to spot revenue slipping away.',
  },
  {
    step: 4,
    title: 'RAG Knowledge & Vector Library',
    subtitle: '1024-dim Jina v3 pgvector Embeddings',
    icon: <BookOpen className="w-5 h-5 text-indigo-600" />,
    description:
      'Upload clinic consultation scripts, injectable pricing SOPs, and treatment guidelines. The n8n orchestrator vectors and stores them in Supabase pgvector so the AI quotes your exact protocols.',
    tip: 'Use the "View Vectorized Knowledge Library" button to inspect all stored chunks.',
  },
  {
    step: 5,
    title: '7-Day Priority Action Plans',
    subtitle: 'Executive Strategy Synthesis & Export',
    icon: <FileCheck className="w-5 h-5 text-emerald-600" />,
    description:
      'When your consultation is complete, click "End Session & Generate Action Plan". DeepSeek-V3 synthesizes the entire conversation transcript into a concrete 7-day numbered action plan ready to export to Markdown.',
    tip: 'All generated action plans are permanently recorded in Supabase sessions table.',
  },
];

export const ClinicTourGuide: React.FC<ClinicTourGuideProps> = ({
  isOpen,
  onClose,
  currentStep,
  setCurrentStep,
}) => {
  if (!isOpen) return null;

  const current = TOUR_STEPS[currentStep - 1] || TOUR_STEPS[0];

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Step Progress Bar */}
        <div className="h-1 bg-slate-100 flex">
          {TOUR_STEPS.map((s) => (
            <div
              key={s.step}
              className={`flex-1 transition-all duration-300 ${
                s.step <= currentStep ? 'bg-amber-600' : 'bg-transparent'
              }`}
            />
          ))}
        </div>

        {/* Modal Header */}
        <div className="p-6 pb-4 flex items-start justify-between border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
              {current.icon}
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-700 tracking-wider uppercase">
                Step {currentStep} of {TOUR_STEPS.length}
              </span>
              <h3 className="text-base font-bold text-slate-900">{current.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            {current.subtitle}
          </p>
          <p className="text-sm text-slate-700 leading-relaxed font-sans">
            {current.description}
          </p>

          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-start space-x-2 text-xs text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span><strong className="font-semibold">Pro Tip:</strong> {current.tip}</span>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition px-2 py-1"
          >
            Skip Tour
          </button>

          <div className="flex items-center space-x-2">
            {currentStep > 1 && (
              <button
                onClick={handlePrev}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition shadow-sm"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-amber-700 hover:bg-amber-800 text-white transition shadow-sm"
            >
              <span>{currentStep === TOUR_STEPS.length ? 'Start Coaching' : 'Next Step'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
