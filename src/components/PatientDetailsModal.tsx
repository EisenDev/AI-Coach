'use client';

import React, { useState } from 'react';
import { PatientRecord } from '@/types/clinic';
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Award,
  Sparkles,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldAlert,
  Activity,
  HeartPulse,
} from 'lucide-react';

interface PatientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientRecord | null;
  onStartCoach: (patient: PatientRecord, objective: string) => void;
}

export const PatientDetailsModal: React.FC<PatientDetailsModalProps> = ({
  isOpen,
  onClose,
  patient,
  onStartCoach,
}) => {
  const [selectedObjective, setSelectedObjective] = useState('90-Day VIP Churn Recovery');

  if (!isOpen || !patient) return null;

  const objectives = [
    {
      id: 'churn',
      title: '90-Day VIP Churn Recovery',
      desc: 'Draft personalized retention outreach and assess touch-up rebooking incentives under SOP-RET-001.',
    },
    {
      id: 'post_op',
      title: 'Post-Treatment Rebooking Strategy',
      desc: 'Formulate 14-day check-in cadence and procedure longevity maintenance plan.',
    },
    {
      id: 'upsell',
      title: 'Treatment Package & Syringe Upsell',
      desc: 'Identify complementary treatments (e.g. skin boosters, biostimulators, neurotoxins).',
    },
    {
      id: 'general',
      title: 'Comprehensive Clinical & Account Review',
      desc: 'Review past visit notes, provider notes, and satisfaction history with Dr. Vance.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn select-none">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#FAF9F6] border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <img
              src={patient.avatarUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80"}
              alt={patient.name}
              className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-xs"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-serif font-bold text-slate-900">{patient.name}</h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    patient.rebooked
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {patient.rebooked ? '● Rebooked' : '● Follow-up due'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 font-mono">
                  {patient.vip_tier || (patient.amount_spent >= 3000 ? 'Diamond VIP' : 'Gold Tier')}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                {patient.treatment} · Provider: <strong className="text-slate-700">{patient.provider}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* 4 Financial & Inactivity Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-medium block">Lifetime Spend</span>
              <span className="text-sm font-bold text-slate-900 font-sans">${patient.amount_spent.toLocaleString()}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-medium block">Last Visit</span>
              <span className="text-sm font-bold text-slate-900 font-mono text-xs">{patient.last_visit}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-medium block">Satisfaction</span>
              <span className="text-sm font-bold text-slate-900 font-sans">⭐ {patient.satisfaction_score} / 5</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-medium block">Inactivity</span>
              <span className="text-sm font-bold text-amber-700 font-mono text-xs">
                {patient.daysSinceLastVisit ? `${patient.daysSinceLastVisit} days` : '64 days'}
              </span>
            </div>
          </div>

          {/* Clinical Profile & Medical History */}
          <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-slate-200/70 space-y-3 text-xs">
            <div className="flex items-center justify-between font-medium text-slate-700">
              <span className="flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{patient.email}</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{patient.phone}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-[11px]">
              <div>
                <span className="text-slate-400 block font-sans">Next Recommended Procedure:</span>
                <span className="font-bold text-[#1E3A2B] font-sans">
                  {patient.next_recommended_treatment || '3-Month Neurotoxin & Dermal Assessment'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-sans">Preferred Contact Channel:</span>
                <span className="font-bold text-slate-800 font-sans">
                  {patient.preferred_contact || 'SMS & Email'}
                </span>
              </div>
            </div>

            {patient.notes && (
              <div className="pt-2 border-t border-slate-200/60">
                <span className="text-slate-400 text-[10px] block font-sans">Clinical & Physician Notes:</span>
                <p className="text-[11px] text-slate-700 font-sans italic mt-0.5">
                  &ldquo;{patient.notes}&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* AI Coach Action Launch Section */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 uppercase tracking-wider font-sans">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Select AI Coaching Strategy</span>
            </div>

            {/* Objective Options */}
            <div className="space-y-2">
              {objectives.map((obj) => (
                <div
                  key={obj.id}
                  onClick={() => setSelectedObjective(obj.title)}
                  className={`p-3 rounded-2xl border transition cursor-pointer flex items-start space-x-3 ${
                    selectedObjective === obj.title
                      ? 'bg-[#EBF3EA] border-[#2D5A3C] shadow-xs'
                      : 'bg-white border-slate-200/80 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    checked={selectedObjective === obj.title}
                    onChange={() => setSelectedObjective(obj.title)}
                    className="mt-1 text-[#1E3A2B] focus:ring-[#1E3A2B]"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 font-sans">{obj.title}</h4>
                    <p className="text-[11px] text-slate-500 font-sans mt-0.5">{obj.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#FAF9F6] border-t border-slate-200/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
          >
            Close
          </button>

          <button
            onClick={() => onStartCoach(patient, selectedObjective)}
            className="px-5 py-2 rounded-xl bg-[#1E3A2B] hover:bg-[#162D21] text-white text-xs font-bold flex items-center space-x-2 transition shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Launch AI Coaching Plan</span>
          </button>
        </div>

      </div>
    </div>
  );
};
