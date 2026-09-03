'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Stethoscope,
  Users,
  Award,
  TrendingUp,
  Percent,
  Calendar,
  Sparkles,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  ChevronRight,
  UserCheck,
  Activity,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  title: string;
  type: 'doctor' | 'staff';
  avatarUrl: string;
  specialties: string[];
  closeRate: number;
  activePatients: number;
  totalProcedures: number;
  rebookingRate: number;
  notes: string;
  assignedTasks: string[];
  email: string;
  phone: string;
}

export const TeamView: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'doctors' | 'staff'>('all');

  const teamMembers: TeamMember[] = [
    {
      id: 'prov-01',
      name: 'Dr. Chloe Vance, MD',
      role: 'Clinic Director & Lead Injector',
      title: 'Board Certified Dermatologist & Master Injector',
      type: 'doctor',
      avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
      specialties: ['Full Face Liquid Facelifts', 'Ultherapy', 'Botox Precision', 'Sculptra'],
      closeRate: 78,
      activePatients: 18,
      totalProcedures: 142,
      rebookingRate: 74,
      notes: 'Highest conversion rate across the practice. Uses 3D facial modeling roadmaps during consultations.',
      assignedTasks: ['Direct VIP outreach for 3 high-value patients', 'Review Morpheus8 rebooking protocol'],
      email: 'dr.vance@auraclinic.com',
      phone: '+1 (555) 019-2834',
    },
    {
      id: 'prov-02',
      name: 'Dr. Julian Reed, MD',
      role: 'Aesthetic Physician',
      title: 'Aesthetic Medicine Specialist',
      type: 'doctor',
      avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
      specialties: ['Executive Bro-tox', 'Dermal Fillers (Lips & Cheeks)', 'Sculptra Aesthetic'],
      closeRate: 70,
      activePatients: 12,
      totalProcedures: 98,
      rebookingRate: 65,
      notes: 'Specializes in male aesthetics and upper-face neurotoxin retention. Day-72 rebooking outreach lead.',
      assignedTasks: ['Executive Bro-tox quarterly refresh outreach', 'Cheek contour touch-up reviews'],
      email: 'dr.reed@auraclinic.com',
      phone: '+1 (555) 019-5847',
    },
    {
      id: 'prov-03',
      name: 'Sarah Lin, RN',
      role: 'Senior Aesthetic Nurse Specialist',
      title: 'Lead Laser & RF Microneedling Specialist',
      type: 'doctor',
      avatarUrl: 'https://images.unsplash.com/photo-1594824813515-38a4d46b8474?w=150&auto=format&fit=crop&q=80',
      specialties: ['Morpheus8 RF Microneedling', 'PRP Facial Rejuvenation', 'Laser Genesis'],
      closeRate: 64,
      activePatients: 9,
      totalProcedures: 86,
      rebookingRate: 58,
      notes: 'Addressing the 40% Morpheus8 drop-off after session 2 by enforcing checkout pre-booking for session 3.',
      assignedTasks: ['Enforce 14-day Morpheus8 follow-up sequence', 'Skin density scan reviews'],
      email: 'sarah.lin@auraclinic.com',
      phone: '+1 (555) 019-9182',
    },
    {
      id: 'prov-04',
      name: 'Marcus Sterling',
      role: 'Body Contouring Specialist',
      title: 'Senior CoolSculpting Specialist',
      type: 'doctor',
      avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
      specialties: ['CoolSculpting Elite (Flanks & Abdomen)', 'Submental Contouring', 'Body Sculpting'],
      closeRate: 52,
      activePatients: 7,
      totalProcedures: 64,
      rebookingRate: 48,
      notes: 'Coaching focus: Introducing 0% APR CareCredit financing before quoting lump sum packages ($2,600–$4,800).',
      assignedTasks: ['Implement monthly financing script', '90-day post-freeze progress review calls'],
      email: 'marcus.s@auraclinic.com',
      phone: '+1 (555) 019-3321',
    },
    {
      id: 'prov-05',
      name: 'Elena Rostova',
      role: 'Master Medical Aesthetician',
      title: 'Clinical Aesthetician & Peel Specialist',
      type: 'doctor',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      specialties: ['HydraFacial Platinum & Deluxe', 'VI Peel Precision', 'Keravive Scalp Health'],
      closeRate: 84,
      activePatients: 14,
      totalProcedures: 120,
      rebookingRate: 82,
      notes: 'Exceptional patient satisfaction (5.0/5.0). Drives high recurring monthly membership retention.',
      assignedTasks: ['Monthly radiance VIP rebookings', 'Post-sun hyperpigmentation follow-ups'],
      email: 'elena.r@auraclinic.com',
      phone: '+1 (555) 019-4478',
    },
    {
      id: 'staff-01',
      name: 'Front Desk Team (FD)',
      role: 'Patient Care Coordinators & Reception',
      title: 'Concierge Patient Experience Team',
      type: 'staff',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      specialties: ['Inactivity Outreach (Day 60–90)', 'VIP Concierge Phone Service', 'Appointment Scheduling'],
      closeRate: 72,
      activePatients: 50,
      totalProcedures: 510,
      rebookingRate: 62,
      notes: 'Primary action owner for calling patients inactive for >90 days under SOP-RET-001.',
      assignedTasks: ['Call patients inactive for >90 days', 'Send Dr. Vance VIP check-in scripts'],
      email: 'concierge@auraclinic.com',
      phone: '+1 (555) 019-0000',
    },
    {
      id: 'staff-02',
      name: 'Aesthetic Marketing (MA)',
      role: 'Retention & Lifecycle Marketing',
      title: 'Digital Patient Engagement & CRM Campaigns',
      type: 'staff',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      specialties: ['14-Day Post-Op Sequences', 'Quarterly Neurotoxin Reminders', 'VIP Email Campaigns'],
      closeRate: 68,
      activePatients: 50,
      totalProcedures: 510,
      rebookingRate: 62,
      notes: 'Builds automated SMS/Email workflows connecting n8n webhooks with patient rebooking schedules.',
      assignedTasks: ['Deploy 14-day follow-up email sequence', 'Track newsletter promo conversions'],
      email: 'marketing@auraclinic.com',
      phone: '+1 (555) 019-1111',
    },
    {
      id: 'staff-03',
      name: 'Practice Operations (OP)',
      role: 'Practice Management & Analytics',
      title: 'Clinical Operations & Financial Compliance',
      type: 'staff',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      specialties: ['0% Financing Integration (CareCredit)', 'Close Rate Audits', 'SOP Compliance Monitoring'],
      closeRate: 75,
      activePatients: 50,
      totalProcedures: 510,
      rebookingRate: 62,
      notes: 'Measures outreach-to-booking conversion rates and audits consultation conversion drop-offs.',
      assignedTasks: ['Measure outreach-to-booking conversion', 'Implement CareCredit 0% APR at checkout'],
      email: 'operations@auraclinic.com',
      phone: '+1 (555) 019-2222',
    },
  ];

  const handleCoachProvider = (providerName: string) => {
    const prompt = `Conduct an AI practice audit for ${providerName}. Analyze their close rate, active patient caseload, and top retention strategies under our clinic SOPs.`;
    router.push(`/coach?prompt=${encodeURIComponent(prompt)}`);
  };

  const filteredMembers = teamMembers.filter((m) => {
    if (activeTab === 'doctors') return m.type === 'doctor';
    if (activeTab === 'staff') return m.type === 'staff';
    return true;
  });

  const doctorsList = filteredMembers.filter((m) => m.type === 'doctor');
  const staffList = filteredMembers.filter((m) => m.type === 'staff');

  return (
    <div className="space-y-6 pb-12 w-full select-none">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Clinic Team & Providers
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-sans">
            Medical directors, aesthetic injectors, clinicians, and operational action plan owners.
          </p>
        </div>

        <button
          onClick={() => router.push('/coach?prompt=' + encodeURIComponent('Analyze provider close rates across Dr. Vance, Marcus Sterling, Sarah Lin, and Dr. Reed. Where are our biggest coaching opportunities?'))}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#1E3A2B] hover:bg-[#162D21] text-white text-xs font-bold transition shadow-xs self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Audit Team Performance</span>
        </button>
      </div>

      {/* Top 4 KPI Cards: 2x2 on Mobile, 4-col on Desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-1.5 sm:space-x-2 text-slate-500 text-[11px] sm:text-xs font-medium">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-700" />
              <span>Total Team</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-bold font-sans text-slate-900 mt-1">8 Staff</h3>
            <p className="text-[10px] sm:text-[11px] text-emerald-800 font-semibold mt-0.5">5 Clinicians · 3 Support</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-1.5 sm:space-x-2 text-slate-500 text-[11px] sm:text-xs font-medium">
              <Stethoscope className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700" />
              <span>Clinical Doctors</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-bold font-sans text-slate-900 mt-1">5 Providers</h3>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold mt-0.5">MDs, RNs & Aestheticians</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-1.5 sm:space-x-2 text-slate-500 text-[11px] sm:text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-700" />
              <span>Action Owners</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-bold font-sans text-slate-900 mt-1">3 Teams</h3>
            <p className="text-[10px] sm:text-[11px] text-amber-800 font-semibold mt-0.5">Front Desk, Mktg, Ops</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-1.5 sm:space-x-2 text-slate-500 text-[11px] sm:text-xs font-medium">
              <Percent className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1E3A2B]" />
              <span>Avg. Close Rate</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-bold font-sans text-slate-900 mt-1">68.4%</h3>
            <p className="text-[10px] sm:text-[11px] text-emerald-800 font-semibold mt-0.5">Goal: 70% Target</p>
          </div>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center space-x-2 border-b border-slate-200/80 pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
            activeTab === 'all'
              ? 'bg-[#1E3A2B] text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All Team Members (8)
        </button>

        <button
          onClick={() => setActiveTab('doctors')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
            activeTab === 'doctors'
              ? 'bg-[#1E3A2B] text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Doctors & Clinicians (5)
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
            activeTab === 'staff'
              ? 'bg-[#1E3A2B] text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Operations & Staff (3)
        </button>
      </div>

      {/* SECTION 1: DOCTORS & CLINICIANS */}
      {(activeTab === 'all' || activeTab === 'doctors') && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Stethoscope className="w-5 h-5 text-[#1E3A2B]" />
            <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900">
              Clinical Doctors & Aesthetic Providers
            </h3>
            <span className="text-xs font-mono text-slate-400">({doctorsList.length} Seeded Clinicians)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {doctorsList.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:border-[#1E3A2B] transition space-y-4 flex flex-col justify-between"
              >
                {/* Provider Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3.5">
                    <img
                      src={doc.avatarUrl}
                      alt={doc.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-xs flex-shrink-0"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 font-sans">{doc.name}</h4>
                      <p className="text-xs text-[#1E3A2B] font-semibold font-sans">{doc.role}</p>
                      <p className="text-[11px] text-slate-400 font-sans">{doc.title}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono ${
                      doc.closeRate >= 70
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : doc.closeRate >= 60
                        ? 'bg-amber-50 text-amber-900 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {doc.closeRate}% Close Rate
                  </span>
                </div>

                {/* Performance Stats Row */}
                <div className="grid grid-cols-3 gap-2 bg-[#FAF9F6] p-3 rounded-2xl border border-slate-200/70 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Caseload</span>
                    <span className="text-xs font-bold text-slate-900 font-sans mt-0.5 block">
                      {doc.activePatients} Patients
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Procedures</span>
                    <span className="text-xs font-bold text-slate-900 font-sans mt-0.5 block">
                      {doc.totalProcedures} Done
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Rebooking</span>
                    <span className="text-xs font-bold text-[#1E3A2B] font-sans mt-0.5 block">
                      {doc.rebookingRate}%
                    </span>
                  </div>
                </div>

                {/* Specialties Badges */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    Core Clinical Specialties:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {doc.specialties.map((spec, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Clinical Notes */}
                <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  &ldquo;{doc.notes}&rdquo;
                </p>

                {/* Action Button */}
                <button
                  onClick={() => handleCoachProvider(doc.name)}
                  className="w-full py-2 px-3 rounded-xl bg-[#1E3A2B] hover:bg-[#162D21] text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Coach {doc.name.split(' ')[1] || doc.name} in AI Coach</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: OPERATIONS & SUPPORT STAFF (ACTION PLAN OWNERS) */}
      {(activeTab === 'all' || activeTab === 'staff') && (
        <div className="space-y-4 pt-4 border-t border-slate-200/80">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-amber-700" />
            <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900">
              Operations & Front Desk Staff (Action Plan Owners)
            </h3>
            <span className="text-xs font-mono text-slate-400">({staffList.length} Support Teams)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {staffList.map((staff) => (
              <div
                key={staff.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:border-[#1E3A2B] transition space-y-4 flex flex-col justify-between"
              >
                <div className="flex items-start space-x-3.5">
                  <img
                    src={staff.avatarUrl}
                    alt={staff.name}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-xs flex-shrink-0"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 font-sans">{staff.name}</h4>
                    <p className="text-xs text-amber-900 font-semibold font-sans">{staff.role}</p>
                    <p className="text-[11px] text-slate-400 font-sans">{staff.title}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    Active Action Plan Tasks:
                  </span>
                  <div className="space-y-1">
                    {staff.assignedTasks.map((t, idx) => (
                      <div key={idx} className="flex items-center space-x-1.5 text-slate-700 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span className="truncate">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <div className="flex items-center space-x-1">
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span className="truncate">{staff.email}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                    Action Owner
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
