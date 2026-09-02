'use client';

import React, { useState, useEffect } from 'react';
import { Customer } from '@/lib/supabaseClient';
import {
  Users,
  Target,
  DollarSign,
  Star,
  Search,
  ArrowUpDown,
  Sparkles,
  CheckCircle,
  Clock,
  RefreshCw,
} from 'lucide-react';

interface CrmDashboardTabProps {
  onCoachClient: (prompt: string) => void;
}

export const CrmDashboardTab: React.FC<CrmDashboardTabProps> = ({ onCoachClient }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortField, setSortField] = useState<'name' | 'amount_spent' | 'last_visit' | 'satisfaction_score'>('amount_spent');
  const [sortAsc, setSortAsc] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/customers');
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (err: any) {
      console.warn('[CRM Fetch error]:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Compute Metrics
  const totalPatients = customers.length;
  const totalRevenue = customers.reduce((sum, c) => sum + (Number(c.amount_spent) || 0), 0);
  const rebookedCount = customers.filter((c) => c.rebooked).length;
  const retentionRate = totalPatients > 0 ? Math.round((rebookedCount / totalPatients) * 100) : 0;
  const avgSatisfaction = totalPatients > 0
    ? (customers.reduce((sum, c) => sum + (Number(c.satisfaction_score) || 0), 0) / totalPatients).toFixed(1)
    : '4.8';

  // Filter & Search
  const filteredCustomers = customers
    .filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.treatment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.provider.toLowerCase().includes(searchQuery.toLowerCase());

      if (filterStatus === 'rebooked') return matchesSearch && c.rebooked;
      if (filterStatus === 'pending') return matchesSearch && !c.rebooked;
      return matchesSearch;
    })
    .sort((a, b) => {
      const aVal = a[sortField] || 0;
      const bVal = b[sortField] || 0;
      if (typeof aVal === 'string') {
        return sortAsc ? (aVal as string).localeCompare(bVal as string) : (bVal as string).localeCompare(aVal as string);
      }
      return sortAsc ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
    });

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Active Patients */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-200 dark:border-white/10 relative overflow-hidden bg-white dark:bg-obsidian-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Patients</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-clinic-rose/15 flex items-center justify-center text-rose-600 dark:text-clinic-rose">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{loading ? '...' : totalPatients}</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">+12% this qtr</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Aura Clinic patient database</p>
        </div>

        {/* Card 2: 90-Day Retention Rate */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-200 dark:border-white/10 relative overflow-hidden bg-white dark:bg-obsidian-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">90-Day Retention Rate</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">{loading ? '...' : `${retentionRate}%`}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Goal: 65%</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{rebookedCount} of {totalPatients} rebooked on schedule</p>
        </div>

        {/* Card 3: Practice Gross Revenue */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-200 dark:border-white/10 relative overflow-hidden bg-white dark:bg-obsidian-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total LTV Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-clinic-gold/15 flex items-center justify-center text-amber-600 dark:text-clinic-gold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-amber-600 dark:text-clinic-gold tracking-tight">
              {loading ? '...' : `$${totalRevenue.toLocaleString()}`}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Avg ${Math.round(totalRevenue / (totalPatients || 1))}</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Injectable & high-ticket procedure value</p>
        </div>

        {/* Card 4: Avg Satisfaction */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-200 dark:border-white/10 relative overflow-hidden bg-white dark:bg-obsidian-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Satisfaction Score</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-violet-500/15 flex items-center justify-center text-indigo-600 dark:text-violet-400">
              <Star className="w-4 h-4 fill-indigo-500 dark:fill-violet-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{loading ? '...' : `${avgSatisfaction}/5.0`}</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Top 5%</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Verified post-procedure reviews</p>
        </div>

      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border border-slate-200 dark:border-white/10 bg-white dark:bg-obsidian-900">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient, treatment, provider..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 dark:focus:border-clinic-gold/50"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-obsidian-950 p-1 rounded-xl border border-slate-200 dark:border-white/10">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                filterStatus === 'all'
                  ? 'bg-white dark:bg-clinic-rose/20 text-slate-900 dark:text-clinic-rose font-bold shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All ({customers.length})
            </button>
            <button
              onClick={() => setFilterStatus('rebooked')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                filterStatus === 'rebooked'
                  ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Rebooked ({rebookedCount})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                filterStatus === 'pending'
                  ? 'bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 font-bold shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Pending ({totalPatients - rebookedCount})
            </button>
          </div>

          <button
            onClick={fetchCustomers}
            className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
            title="Refresh CRM Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* CRM CLIENTS TABLE */}
      <div className="glass-card rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-lg bg-white dark:bg-obsidian-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-obsidian-950/80 text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                <th onClick={() => handleSort('name')} className="py-3.5 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition">
                  <div className="flex items-center space-x-1">
                    <span>Patient</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Treatment</th>
                <th className="py-3.5 px-4">Provider</th>
                <th onClick={() => handleSort('amount_spent')} className="py-3.5 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition">
                  <div className="flex items-center space-x-1">
                    <span>Total Spend</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th onClick={() => handleSort('last_visit')} className="py-3.5 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition">
                  <div className="flex items-center space-x-1">
                    <span>Last Visit</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Status</th>
                <th onClick={() => handleSort('satisfaction_score')} className="py-3.5 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <span>Score</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right">AI Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-xs text-slate-700 dark:text-slate-200">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-500">
                    {loading ? 'Loading patient records...' : 'No matching patient records found.'}
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.03] transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white">
                      <div>{c.name}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">{c.email || c.phone || 'VIP Patient'}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-300 font-medium">
                        {c.treatment}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{c.provider}</td>
                    <td className="py-3.5 px-4 font-bold text-amber-600 dark:text-clinic-gold font-mono text-[13px]">
                      ${Number(c.amount_spent).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">{c.last_visit}</td>
                    <td className="py-3.5 px-4">
                      {c.rebooked ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                          <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span>Rebooked</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30">
                          <Clock className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                          <span>Needs Follow-up</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center space-x-1 text-amber-600 dark:text-clinic-gold font-bold">
                        <span>{c.satisfaction_score}</span>
                        <Star className="w-3 h-3 fill-amber-500 dark:fill-clinic-gold text-amber-500" />
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() =>
                          onCoachClient(
                            `How should we reach out to ${c.name}, who spent $${c.amount_spent} on ${c.treatment} with ${c.provider} on ${c.last_visit} and hasn't rebooked yet? Draft a personalized retention strategy.`
                          )
                        }
                        className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-amber-50 hover:bg-amber-100 dark:bg-gradient-to-r dark:from-clinic-rose/20 dark:to-clinic-gold/20 text-amber-800 dark:text-clinic-gold border border-amber-300 dark:border-clinic-gold/30 transition shadow-sm"
                      >
                        <Sparkles className="w-3 h-3 text-amber-600 dark:text-clinic-gold" />
                        <span>Coach Client</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
