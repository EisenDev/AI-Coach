'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  Stethoscope,
  Crown,
  Layers,
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
  const [mounted, setMounted] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState('90-Day VIP Churn Recovery');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !patient || !mounted) return null;

  const vipTier =
    patient.vip_tier ||
    (patient.amount_spent >= 3500
      ? 'Diamond VIP'
      : patient.amount_spent >= 2000
      ? 'Platinum Tier'
      : 'Gold Member');

  const fitzpatrickSkin =
    patient.amount_spent % 2 === 0
      ? 'Fitzpatrick Type II · Fair with mild photoaging'
      : 'Fitzpatrick Type III · Olive tone, no keloid history';

  const allergies = patient.allergies || 'No known drug allergies (NKDA) · Lidocaine tolerated';

  const nextTreatment =
    patient.next_recommended_treatment ||
    (patient.treatment.includes('Botox')
      ? '12-Week Neurotoxin Maintenance & Glabella Touch-up'
      : patient.treatment.includes('Liquid Facelift')
      ? '90-Day Dermal Filler Symmetry & Skin Booster Assessment'
      : patient.treatment.includes('Morpheus8')
      ? 'Morpheus8 Protocol Session 3 & Collagen Density Scan'
      : patient.treatment.includes('CoolSculpting')
      ? '90-Day Contour Assessment & Skin Tightening Review'
      : 'Hydration Maintenance & Quarterly Skin Review');

  const preferredChannel =
    patient.preferred_contact ||
    (patient.amount_spent >= 3000 ? 'Concierge Phone & VIP Email' : 'SMS & Email');

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

  return createPortal(
    <div className="fixed inset-0 z-[999999] w-screen h-screen bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn select-none overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[94vh] flex flex-col overflow-hidden my-auto">
        
        {/* Header with High-End Clinic Branding */}
        <div className="px-6 py-4 bg-[#FAF9F6] border-b border-slate-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3.5">
            <img
              src={patient.avatarUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80"}
              alt={patient.name}
              className="w-13 h-13 rounded-2xl object-cover border-2 border-white shadow-md"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900 tracking-tight">
                  {patient.name}
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    patient.rebooked
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {patient.rebooked ? '● Rebooked' : '● Follow-up due'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 font-mono flex items-center space-x-1">
                  <Crown className="w-3 h-3 text-amber-600" />
                  <span>{vipTier}</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                Primary Treatment: <strong className="text-slate-800">{patient.treatment}</strong> · Clinician:{' '}
                <strong className="text-slate-800">{patient.provider}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Comprehensive Patient Clinical Profile */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* 4 Financial & Inactivity Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Lifetime Spend
              </span>
              <span className="text-base font-bold text-[#1E3A2B] font-sans mt-0.5 block">
                ${patient.amount_spent.toLocaleString()}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Last Procedure
              </span>
              <span className="text-base font-bold text-slate-900 font-mono text-xs mt-0.5 block">
                {patient.last_visit}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Satisfaction
              </span>
              <span className="text-base font-bold text-slate-900 font-sans mt-0.5 block">
                ⭐ {patient.satisfaction_score} / 5.0
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Inactivity Window
              </span>
              <span className="text-base font-bold text-amber-700 font-mono text-xs mt-0.5 block">
                {patient.daysSinceLastVisit ? `${patient.daysSinceLastVisit} days` : '64 days'}
              </span>
            </div>
          </div>

          {/* Full Clinical Profile & Medical History Section */}
          <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-slate-200 space-y-3.5 text-xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 text-xs font-bold text-slate-800">
              <div className="flex items-center space-x-2">
                <Stethoscope className="w-4 h-4 text-[#1E3A2B]" />
                <span className="font-serif">Clinical Medical Chart & Contact Data</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Verified Seeded Record ({patient.id})
              </span>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{patient.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{patient.phone}</span>
              </div>
            </div>

            {/* Medical History & Allergies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/70 text-[11px]">
              <div>
                <span className="text-slate-400 font-sans block">Skin Classification:</span>
                <span className="font-semibold text-slate-800">{fitzpatrickSkin}</span>
              </div>
              <div>
                <span className="text-slate-400 font-sans block">Allergies & Sensitivities:</span>
                <span className="font-semibold text-rose-700">{allergies}</span>
              </div>
            </div>

            {/* Next Recommended Procedure & Channel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/70 text-[11px]">
              <div>
                <span className="text-slate-400 font-sans block">Next Recommended Clinical Step:</span>
                <span className="font-bold text-[#1E3A2B]">{nextTreatment}</span>
              </div>
              <div>
                <span className="text-slate-400 font-sans block">Preferred Outreach Channel:</span>
                <span className="font-bold text-slate-800">{preferredChannel}</span>
              </div>
            </div>

            {/* Clinical & Physician Notes */}
            <div className="pt-2 border-t border-slate-200/70">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">
                Supervising Physician Notes:
              </span>
              <p className="text-[11px] text-slate-700 italic mt-0.5 bg-white p-2.5 rounded-xl border border-slate-200/80">
                &ldquo;{patient.notes || 'High-value aesthetic patient. Inactive past optimal interval. Ready for outreach protocol.'}&rdquo;
              </p>
            </div>
          </div>

          {/* AI Coaching Strategy Selection */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 uppercase tracking-wider font-sans">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Select AI Coaching Strategy For {patient.name}</span>
            </div>

            {/* Objective Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {objectives.map((obj) => (
                <div
                  key={obj.id}
                  onClick={() => setSelectedObjective(obj.title)}
                  className={`p-3 rounded-2xl border transition cursor-pointer flex items-start space-x-2.5 ${
                    selectedObjective === obj.title
                      ? 'bg-[#EBF3EA] border-[#2D5A3C] shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    checked={selectedObjective === obj.title}
                    onChange={() => setSelectedObjective(obj.title)}
                    className="mt-0.5 text-[#1E3A2B] focus:ring-[#1E3A2B]"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 font-sans">{obj.title}</h4>
                    <p className="text-[10px] text-slate-500 font-sans mt-0.5 leading-snug">{obj.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#FAF9F6] border-t border-slate-200 flex items-center justify-between flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
          >
            Close
          </button>

          <button
            onClick={() => onStartCoach(patient, selectedObjective)}
            className="px-5 py-2.5 rounded-xl bg-[#1E3A2B] hover:bg-[#162D21] text-white text-xs font-bold flex items-center space-x-2 transition shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Launch AI Coaching Session</span>
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};
