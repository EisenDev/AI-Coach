'use client';

import React, { useState, useEffect } from 'react';
import { PatientRecord } from '@/types/clinic';
import { createOrGetPatientSession } from '@/lib/sessionStore';
import {
  Users,
  Calendar,
  CheckCircle2,
  DollarSign,
  Search,
  ArrowUpDown,
  MessageSquare,
  Sparkles,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';

const FALLBACK_PATIENTS: PatientRecord[] = [
  {
    id: "cust-001",
    name: "Victoria Kensington",
    email: "victoria.k@sovereign.co.uk",
    phone: "+1 (555) 123-7890",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
    treatment: "Full Face Liquid Facelift",
    provider: "Dr. Chloe Vance",
    status: "Follow-up due",
    amount_spent: 6800,
    last_visit: "2026-06-30",
    rebooked: false,
    satisfaction_score: 4.9,
    daysSinceLastVisit: 64,
  },
  {
    id: "cust-002",
    name: "Alexander Wright",
    email: "awright@capitalventures.com",
    phone: "+1 (555) 890-1234",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    treatment: "CoolSculpting Flanks",
    provider: "Marcus Sterling",
    status: "Rebooked",
    amount_spent: 4200,
    last_visit: "2026-07-01",
    rebooked: true,
    satisfaction_score: 4.6,
    daysSinceLastVisit: 63,
  },
  {
    id: "cust-003",
    name: "Lucas Bennett",
    email: "lbennett@bennettluxury.com",
    phone: "+1 (555) 890-4567",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    treatment: "CoolSculpting Abdomen",
    provider: "Marcus Sterling",
    status: "Rebooked",
    amount_spent: 3800,
    last_visit: "2026-07-18",
    rebooked: true,
    satisfaction_score: 4.6,
    daysSinceLastVisit: 46,
  },
  {
    id: "cust-004",
    name: "Isabella Cruz",
    email: "isabella.cruz@luxurygroup.com",
    phone: "+1 (555) 567-8901",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    treatment: "Morpheus8 RF Microneedling",
    provider: "Sarah Lin",
    status: "Follow-up due",
    amount_spent: 3600,
    last_visit: "2026-05-18",
    rebooked: false,
    satisfaction_score: 4.7,
    daysSinceLastVisit: 108,
  },
  {
    id: "cust-005",
    name: "Camila Navarro",
    email: "camila.n@valenciacapital.es",
    phone: "+1 (555) 123-0987",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
    treatment: "Sculptra Aesthetic (2 Vials)",
    provider: "Dr. Julian Reed",
    status: "Rebooked",
    amount_spent: 3400,
    last_visit: "2026-06-25",
    rebooked: true,
    satisfaction_score: 4.9,
    daysSinceLastVisit: 69,
  },
  {
    id: "cust-006",
    name: "Daniel Kim",
    email: "daniel.kim@kimenterprises.com",
    phone: "+1 (555) 456-3210",
    avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80",
    treatment: "Morpheus8 Face & Neck",
    provider: "Sarah Lin",
    status: "Follow-up due",
    amount_spent: 3200,
    last_visit: "2026-06-02",
    rebooked: false,
    satisfaction_score: 4.8,
    daysSinceLastVisit: 91,
  },
];

interface PatientsViewProps {
  onCoachClient: (prompt: string, sessionId?: string) => void;
  initialFilter?: string;
}

export const PatientsView: React.FC<PatientsViewProps> = ({
  onCoachClient,
  initialFilter = 'all',
}) => {
  const [patients, setPatients] = useState<PatientRecord[]>(FALLBACK_PATIENTS);
  const [activeFilter, setActiveFilter] = useState<string>(initialFilter);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'last_visit' | 'amount_spent' | 'satisfaction_score'>('last_visit');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    fetch('/api/customers')
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.customers || data?.data || []);
        if (Array.isArray(list) && list.length > 0) {
          setPatients(list);
        }
      })
      .catch((err) => {
        console.error('Failed to load customers from API, using seeded patients:', err);
      });
  }, []);

  const totalPatients = patients.length;
  const rebookedCount = patients.filter((p) => p.rebooked).length;
  const rebookingRate = Math.round((rebookedCount / totalPatients) * 100) || 60;
  const followUpsDue = patients.filter((p) => !p.rebooked).length;
  const atRiskValue = patients
    .filter((p) => !p.rebooked)
    .reduce((sum, p) => sum + (p.amount_spent || 0), 0);

  // Filter patients
  const filteredPatients = patients.filter((p) => {
    if (activeFilter === 'follow_up' && p.rebooked) return false;
    if (activeFilter === 'rebooked' && !p.rebooked) return false;
    if (activeFilter === 'high_value' && (p.amount_spent || 0) < 3000) return false;
    if (activeFilter === 'low_sat' && (p.satisfaction_score || 5) >= 4.5) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.treatment.toLowerCase().includes(q) ||
        p.provider.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Sort patients
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (typeof valA === 'string') {
      return sortAsc ? valA.localeCompare(valB as string) : (valB as string).localeCompare(valA);
    }
    return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
  });

  const totalPages = Math.max(1, Math.ceil(sortedPatients.length / pageSize));
  const paginatedPatients = sortedPatients.slice((page - 1) * pageSize, page * pageSize);

  const handlePatientCoachClick = (p: PatientRecord) => {
    const session = createOrGetPatientSession(
      p.id,
      p.name,
      p.treatment,
      p.amount_spent,
      p.last_visit
    );
    onCoachClient(
      `How should we reach out to ${p.name}, who spent $${p.amount_spent.toLocaleString()} on ${p.treatment} with ${p.provider} on ${p.last_visit} and hasn't rebooked yet? Draft a personalized retention strategy.`,
      session.id
    );
  };

  return (
    <div className="space-y-6 pb-12 w-full">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Patient Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-sans">
            Understand retention, value, and follow-up opportunities across your clinic.
          </p>
        </div>

        <button
          onClick={() =>
            onCoachClient(
              'Analyze all 50 patient records and highlight our top 3 high-value patients at risk of churn this week.'
            )
          }
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#1E3A2B] hover:bg-[#162D21] text-white text-xs font-bold transition shadow-xs self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Ask AI about patients</span>
        </button>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-medium">
              <Users className="w-4 h-4 text-slate-700" />
              <span>Total Patients</span>
            </div>
            <h3 className="text-2xl font-bold font-sans text-slate-900 mt-1">{totalPatients}</h3>
            <p className="text-[11px] text-emerald-800 font-semibold mt-0.5">↑ +8% this quarter</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Rebooking Rate</span>
            </div>
            <h3 className="text-2xl font-bold font-sans text-slate-900 mt-1">{rebookingRate}%</h3>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">🎯 Goal 65%</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-medium">
              <Calendar className="w-4 h-4 text-amber-700" />
              <span>Follow-ups Due</span>
            </div>
            <h3 className="text-2xl font-bold font-sans text-slate-900 mt-1">{followUpsDue}</h3>
            <p className="text-[11px] text-rose-700 font-semibold mt-0.5">↗ +3 vs last month</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-medium">
              <DollarSign className="w-4 h-4 text-amber-800" />
              <span>At-Risk Value</span>
            </div>
            <h3 className="text-2xl font-bold font-sans text-slate-900 mt-1">
              ${atRiskValue.toLocaleString()}
            </h3>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">↓ -12% vs last month</p>
          </div>
        </div>

      </div>

      {/* Main Grid: Left CRM Table, Right Smart Segments */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left 3 Cols: Patients Table */}
        <div className="lg:col-span-3 space-y-4">
          
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            
            {/* Table Header Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-slate-900 font-sans">Patient records</h3>

              {/* Filter Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => { setActiveFilter('all'); setPage(1); }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                    activeFilter === 'all'
                      ? 'bg-[#1E3A2B] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All {totalPatients}
                </button>
                <button
                  onClick={() => { setActiveFilter('follow_up'); setPage(1); }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                    activeFilter === 'follow_up'
                      ? 'bg-[#1E3A2B] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Needs follow-up {followUpsDue}
                </button>
                <button
                  onClick={() => { setActiveFilter('rebooked'); setPage(1); }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                    activeFilter === 'rebooked'
                      ? 'bg-[#1E3A2B] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Rebooked {rebookedCount}
                </button>
              </div>
            </div>

            {/* Search & Sort Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search patient, treatment, or provider..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => { setSortField('amount_spent'); setSortAsc(!sortAsc); }}
                  className="flex items-center space-x-1 text-xs border border-slate-200 px-3 py-1.5 rounded-xl bg-slate-50 text-slate-700 font-medium hover:bg-slate-100"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sort: {sortField === 'amount_spent' ? 'LTV' : 'Last visit'}</span>
                </button>
              </div>
            </div>

            {/* Patients Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5 px-2">Patient</th>
                    <th className="py-2.5 px-2">Treatment</th>
                    <th className="py-2.5 px-2">Provider</th>
                    <th className="py-2.5 px-2">Last visit</th>
                    <th className="py-2.5 px-2">Status</th>
                    <th className="py-2.5 px-2">LTV</th>
                    <th className="py-2.5 px-2">Score</th>
                    <th className="py-2.5 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedPatients.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-2">
                        <div className="flex items-center space-x-2">
                          <img
                            src={p.avatarUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80"}
                            alt={p.name}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <p className="font-bold text-slate-900 font-sans">{p.name}</p>
                            <p className="text-[10px] text-slate-400">{p.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700">
                          {p.treatment}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-slate-600 text-[11px]">{p.provider}</td>
                      <td className="py-3 px-2 text-slate-500 font-mono text-[11px]">{p.last_visit}</td>
                      <td className="py-3 px-2">
                        {p.rebooked ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            ● Rebooked
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            ● Follow-up due
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-2 font-bold text-slate-900 font-sans">
                        ${p.amount_spent.toLocaleString()}
                      </td>
                      <td className="py-3 px-2 font-bold text-slate-700">
                        ⭐ {p.satisfaction_score}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <button
                          onClick={() => handlePatientCoachClick(p)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#1E3A2B] hover:bg-[#EBF3EA] text-[#1E3A2B] text-[11px] font-bold inline-flex items-center space-x-1 shadow-xs transition"
                          title="Generate patient coaching session"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>Coach</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
              <span>
                Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, sortedPatients.length)} of {sortedPatients.length} patients
              </span>
              <div className="flex items-center space-x-1">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
                >
                  &lt;
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
                      page === p ? 'bg-[#1E3A2B] text-white' : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
                >
                  &gt;
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Right 1 Col: Smart Segments Sidebar */}
        <div className="space-y-4">
          
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 font-sans">Smart segments</h3>

            <div className="space-y-2 text-xs">
              
              <div
                onClick={() => { setActiveFilter('high_value'); setPage(1); }}
                className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                  activeFilter === 'high_value' ? 'bg-[#EBF3EA] border-[#2D5A3C] font-bold' : 'hover:bg-slate-50 border-slate-100'
                }`}
              >
                <div className="flex items-center space-x-2 text-rose-700">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span className="text-slate-800 font-sans">High-value inactive</span>
                </div>
                <span className="font-bold text-slate-900 font-mono">3 &gt;</span>
              </div>

              <div
                onClick={() => { setActiveFilter('follow_up'); setPage(1); }}
                className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                  activeFilter === 'follow_up' ? 'bg-[#EBF3EA] border-[#2D5A3C] font-bold' : 'hover:bg-slate-50 border-slate-100'
                }`}
              >
                <div className="flex items-center space-x-2 text-amber-700">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span className="text-slate-800 font-sans">Rebooking due</span>
                </div>
                <span className="font-bold text-slate-900 font-mono">8 &gt;</span>
              </div>

              <div
                onClick={() => { setActiveFilter('low_sat'); setPage(1); }}
                className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                  activeFilter === 'low_sat' ? 'bg-[#EBF3EA] border-[#2D5A3C] font-bold' : 'hover:bg-slate-50 border-slate-100'
                }`}
              >
                <div className="flex items-center space-x-2 text-slate-600">
                  <TrendingUp className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-800 font-sans">Low satisfaction</span>
                </div>
                <span className="font-bold text-slate-900 font-mono">2 &gt;</span>
              </div>

              <div
                onClick={() => { setActiveFilter('follow_up'); setPage(1); }}
                className="p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center space-x-2 text-indigo-700">
                  <UserCheck className="w-4 h-4 text-indigo-600" />
                  <span className="text-slate-800 font-sans">Consultation not converted</span>
                </div>
                <span className="font-bold text-slate-900 font-mono">5 &gt;</span>
              </div>

            </div>
          </div>

          {/* AI Insight Card */}
          <div className="bg-[#EBF3EA]/80 rounded-2xl p-5 border border-[#D5E6D3] shadow-xs space-y-2.5">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-[#1E3A2B]">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>AI INSIGHT</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 font-sans">
              Morpheus8 patients have the weakest 90-day rebooking rate.
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
              Consider proactive outreach and incentivized rebooking offers before day 90.
            </p>
            <button
              onClick={() =>
                onCoachClient(
                  'Why do Morpheus8 patients have lower rebooking rates, and how can Dr. Vance improve the 3-session package completion rate?'
                )
              }
              className="text-[11px] font-bold text-[#1E3A2B] hover:underline flex items-center space-x-1 pt-1"
            >
              <span>View full insight</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
