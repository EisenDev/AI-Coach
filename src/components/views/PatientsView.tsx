'use client';

import React, { useState, useEffect } from 'react';
import { PatientRecord } from '@/types/clinic';
import {
  Users,
  Target,
  Calendar,
  DollarSign,
  Search,
  SlidersHorizontal,
  ChevronDown,
  MessageSquare,
  Sparkles,
  ChevronRight,
  MoreVertical,
  Star,
  RefreshCw,
} from 'lucide-react';

interface PatientsViewProps {
  onCoachClient: (prompt: string) => void;
  initialFilter?: string;
}

export const PatientsView: React.FC<PatientsViewProps> = ({
  onCoachClient,
  initialFilter = 'all',
}) => {
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'needs-follow-up' | 'rebooked'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    if (initialFilter === 'needs-follow-up') {
      setActiveFilter('needs-follow-up');
    }
  }, [initialFilter]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/customers');
      if (res.ok) {
        const data = await res.json();
        setPatients(data);
      }
    } catch (err) {
      console.warn('Failed to load customers from API:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleCoachClick = (patient: PatientRecord) => {
    const prompt = `How should we reach out to ${patient.name} who spent $${patient.amount_spent.toLocaleString()} on ${patient.treatment} with ${patient.provider} on ${patient.last_visit} and hasn't rebooked yet? Draft a personalized retention strategy and script.`;
    onCoachClient(prompt);
  };

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.treatment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'needs-follow-up') {
      return !p.rebooked || p.status.toLowerCase().includes('follow-up');
    }
    if (activeFilter === 'rebooked') {
      return p.rebooked;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredPatients.length / pageSize);
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const needsFollowUpCount = patients.filter((p) => !p.rebooked).length;
  const rebookedCount = patients.filter((p) => p.rebooked).length;

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
            onCoachClient('Give me an executive summary of our 50 patient records and identify our top 3 highest revenue at-risk clients.')
          }
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#1E3A2B] hover:bg-[#162D21] text-white text-xs font-bold transition shadow-xs self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Ask AI about patients</span>
        </button>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-slate-500">Total Patients</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold font-sans text-slate-900">50</h3>
            <p className="text-[11px] font-medium text-emerald-700 mt-0.5">
              ↑ +8% this quarter
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-slate-500">Rebooking Rate</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold font-sans text-slate-900">60%</h3>
            <p className="text-[11px] font-medium text-slate-500 mt-0.5">
              🎯 Goal 65%
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-slate-500">Follow-ups Due</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold font-sans text-slate-900">{needsFollowUpCount}</h3>
            <p className="text-[11px] font-medium text-rose-600 mt-0.5">
              ↗ +3 vs last month
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-slate-500">At-Risk Value</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold font-sans text-slate-900">$18,400</h3>
            <p className="text-[11px] font-medium text-slate-500 mt-0.5">
              ↓ -12% vs last month
            </p>
          </div>
        </div>

      </div>

      {/* Main Grid: Patient Records Table + Right Smart Segments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8-9 Cols: Patient Table */}
        <div className="lg:col-span-8 xl:col-span-9 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-slate-900 font-sans">Patient records</h3>

            {/* Filter Pills */}
            <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl text-xs">
              <button
                onClick={() => { setActiveFilter('all'); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  activeFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All <span className="font-mono text-[11px]">{patients.length}</span>
              </button>
              <button
                onClick={() => { setActiveFilter('needs-follow-up'); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  activeFilter === 'needs-follow-up'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Needs follow-up <span className="font-mono text-[11px]">{needsFollowUpCount}</span>
              </button>
              <button
                onClick={() => { setActiveFilter('rebooked'); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  activeFilter === 'rebooked'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Rebooked <span className="font-mono text-[11px]">{rebookedCount}</span>
              </button>
            </div>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder="Search patient, treatment, or provider..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium hover:bg-slate-100 transition">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <span>Filters</span>
              </button>

              <div className="flex items-center space-x-1 text-xs border border-slate-200 px-3 py-2 rounded-xl bg-slate-50 text-slate-700 font-medium cursor-pointer">
                <span>Sort: Last visit</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Patient Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-1.5">Patient</th>
                  <th className="py-2.5 px-1.5">Treatment</th>
                  <th className="py-2.5 px-1.5">Provider</th>
                  <th className="py-2.5 px-1.5">Last Visit ↓</th>
                  <th className="py-2.5 px-1.5">Status</th>
                  <th className="py-2.5 px-1.5">LTV</th>
                  <th className="py-2.5 px-1.5">Score</th>
                  <th className="py-2.5 px-1.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                      Loading patient intelligence from Supabase...
                    </td>
                  </tr>
                ) : paginatedPatients.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                      No patients match your search criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedPatients.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition group">
                      
                      {/* Patient Avatar & Name */}
                      <td className="py-3 px-1.5">
                        <div className="flex items-center space-x-2">
                          <img
                            src={p.avatarUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80"}
                            alt={p.name}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 font-sans truncate">{p.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono truncate">{p.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Treatment Pill */}
                      <td className="py-3 px-1.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#EBF3EA] text-[#1E3A2B] border border-[#D5E6D3] whitespace-nowrap">
                          {p.treatment}
                        </span>
                      </td>

                      {/* Provider */}
                      <td className="py-3 px-1.5 text-slate-700 font-medium whitespace-nowrap text-[11px]">
                        {p.provider}
                      </td>

                      {/* Last Visit */}
                      <td className="py-3 px-1.5 text-slate-600 font-medium whitespace-nowrap text-[11px]">
                        {p.last_visit}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-1.5 whitespace-nowrap">
                        {!p.rebooked ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            <span className="w-1 h-1 rounded-full bg-rose-500" />
                            <span>Follow-up due</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <span className="w-1 h-1 rounded-full bg-emerald-600" />
                            <span>Rebooked</span>
                          </span>
                        )}
                      </td>

                      {/* LTV */}
                      <td className="py-3 px-1.5 font-bold text-slate-900 font-sans whitespace-nowrap text-[11px]">
                        ${p.amount_spent.toLocaleString()}
                      </td>

                      {/* Satisfaction */}
                      <td className="py-3 px-1.5 whitespace-nowrap">
                        <span className="inline-flex items-center space-x-0.5 font-bold text-slate-800 text-[11px]">
                          <span>{p.satisfaction_score}</span>
                          <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        </span>
                      </td>

                      {/* Action Button */}
                      <td className="py-3 px-1.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleCoachClick(p)}
                          className="inline-flex items-center space-x-1 px-2 py-1 rounded-lg border border-slate-200 hover:border-[#1E3A2B] bg-white hover:bg-slate-50 text-[#1E3A2B] text-[11px] font-bold transition shadow-xs"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>Coach</span>
                        </button>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <span>
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, filteredPatients.length)} of {filteredPatients.length} patients
            </span>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 font-medium"
              >
                &lt;
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold ${
                    currentPage === num
                      ? 'bg-[#1E3A2B] text-white'
                      : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {num}
                </button>
              ))}

              {totalPages > 5 && <span className="px-1 text-slate-400">...</span>}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-2.5 py-1 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 font-medium"
              >
                &gt;
              </button>
            </div>
          </div>

        </div>

        {/* Right 3-4 Cols: Smart Segments & AI Insight */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-4">
          
          {/* Smart Segments Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 font-sans">Smart segments</h3>

            <div className="space-y-2">
              <div
                onClick={() => setActiveFilter('needs-follow-up')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition cursor-pointer flex items-center justify-between border border-slate-100 text-xs"
              >
                <div className="flex items-center space-x-2 text-slate-800">
                  <Target className="w-3.5 h-3.5 text-rose-600" />
                  <span className="font-medium">High-value inactive</span>
                </div>
                <span className="font-bold text-slate-900 font-mono">3 &gt;</span>
              </div>

              <div
                onClick={() => setActiveFilter('needs-follow-up')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition cursor-pointer flex items-center justify-between border border-slate-100 text-xs"
              >
                <div className="flex items-center space-x-2 text-slate-800">
                  <Calendar className="w-3.5 h-3.5 text-amber-700" />
                  <span className="font-medium">Rebooking due</span>
                </div>
                <span className="font-bold text-slate-900 font-mono">8 &gt;</span>
              </div>

              <div
                onClick={() => setActiveFilter('all')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition cursor-pointer flex items-center justify-between border border-slate-100 text-xs"
              >
                <div className="flex items-center space-x-2 text-slate-800">
                  <Star className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="font-medium">Low satisfaction</span>
                </div>
                <span className="font-bold text-slate-900 font-mono">2 &gt;</span>
              </div>

              <div
                onClick={() => setActiveFilter('all')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition cursor-pointer flex items-center justify-between border border-slate-100 text-xs"
              >
                <div className="flex items-center space-x-2 text-slate-800">
                  <Users className="w-3.5 h-3.5 text-indigo-700" />
                  <span className="font-medium">Consultation not converted</span>
                </div>
                <span className="font-bold text-slate-900 font-mono">5 &gt;</span>
              </div>
            </div>
          </div>

          {/* AI Insight Card */}
          <div className="rounded-2xl p-5 bg-[#EBF3EA] border border-[#D5E6D3] space-y-2.5 shadow-xs">
            <div className="flex items-center space-x-2 text-[#1E3A2B]">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold uppercase tracking-wider">AI Insight</span>
            </div>
            <p className="text-xs text-slate-800 font-semibold leading-relaxed">
              Morpheus8 patients have the weakest 90-day rebooking rate.
            </p>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Consider proactive outreach and incentivized rebooking offers before day 90.
            </p>
            <button
              onClick={() =>
                onCoachClient('Analyze why our Morpheus8 patients have the weakest 90-day rebooking rate and give me a specific action plan to fix it.')
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
