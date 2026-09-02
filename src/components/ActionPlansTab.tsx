'use client';

import React, { useState, useEffect } from 'react';
import { supabase, Session } from '@/lib/supabaseClient';
import { ActionPlanModal } from './ActionPlanModal';
import {
  FileText,
  Calendar,
  Sparkles,
  Copy,
  Check,
  ChevronRight,
  Clock,
  Target,
  RefreshCw,
} from 'lucide-react';

export const ActionPlansTab: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setSessions(data);
    } catch (err: any) {
      console.warn('[Supabase Sessions Fetch Error]:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const openPlan = (session: Session) => {
    setSelectedSession(session);
    setModalOpen(true);
  };

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/10 relative overflow-hidden bg-white dark:bg-obsidian-900 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-clinic-gold/15 border border-amber-200 dark:border-clinic-gold/30 flex items-center justify-center text-amber-600 dark:text-clinic-gold shadow-sm">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Executive 7-Day Action Plans</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 dark:bg-clinic-rose/15 text-rose-700 dark:text-clinic-rose border border-rose-200 dark:border-clinic-rose/30">
                  AI Synthesized Strategy
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Action plans synthesized by DeepSeek-V3 after each coaching session. Review priority initiatives, target retention metrics, and clinical outreach scripts.
              </p>
            </div>
          </div>

          <button
            onClick={fetchSessions}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition self-start md:self-auto font-medium"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Plans</span>
          </button>
        </div>
      </div>

      {/* SESSIONS LIST */}
      <div className="space-y-4">
        {loading ? (
          <div className="glass-card rounded-2xl p-10 text-center text-slate-500 text-xs bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-white/10">
            Loading session action plans from Supabase...
          </div>
        ) : sessions.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center space-y-3 border border-slate-200 dark:border-white/10 bg-white dark:bg-obsidian-900">
            <Sparkles className="w-8 h-8 text-amber-500 mx-auto opacity-80" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">No Action Plans Generated Yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Start a coaching session on the **Voice AI Coach** tab and click **"End Session & Generate Action Plan"** to synthesize your first executive strategy.
            </p>
          </div>
        ) : (
          sessions.map((s) => (
            <div
              key={s.id}
              className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-200 dark:border-white/10 space-y-3 bg-white dark:bg-obsidian-900 shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-clinic-rose/15 text-rose-600 dark:text-clinic-rose flex items-center justify-center font-bold text-xs">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white capitalize">
                      {s.topic ? s.topic.replace(/-/g, ' ') : 'Clinic Growth & Retention Session'}
                    </h3>
                    <div className="flex items-center space-x-3 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(s.created_at).toLocaleDateString()}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-auto">
                  {s.summary && (
                    <button
                      onClick={() => copyText(s.id, s.summary!)}
                      className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 transition"
                    >
                      {copiedId === s.id ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === s.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => openPlan(s)}
                    className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-500 to-rose-500 text-white hover:opacity-90 transition shadow-sm"
                  >
                    <span>View Plan</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Summary Snippet */}
              {s.summary ? (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-white/5 text-xs text-slate-700 dark:text-slate-300 line-clamp-3 leading-relaxed font-sans">
                  {s.summary}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Session in progress / pending summary synthesis.</p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Action Plan Modal */}
      {selectedSession && (
        <ActionPlanModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          summary={selectedSession.summary || 'No summary text available.'}
          topic={selectedSession.topic || 'General Practice Growth'}
          sessionId={selectedSession.id}
        />
      )}

    </div>
  );
};
