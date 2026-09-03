'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  getActiveSessions,
  CoachSession,
  createNewSession,
  togglePinSession,
  deleteSession,
} from '@/lib/sessionStore';
import {
  Calendar,
  Clock,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Pin,
  Trash2,
  Users,
  Search,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  Volume2,
} from 'lucide-react';

interface SessionsViewProps {
  onOpenSession?: (sessionId: string) => void;
  onNewSession?: () => void;
}

export const SessionsView: React.FC<SessionsViewProps> = ({
  onOpenSession,
  onNewSession,
}) => {
  const router = useRouter();
  const [sessions, setSessions] = useState<CoachSession[]>([]);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'pinned' | 'patient'>('all');

  const refreshSessions = () => {
    const list = getActiveSessions();
    setSessions(list);
  };

  useEffect(() => {
    refreshSessions();
  }, []);

  const handleStartNewSession = () => {
    const created = createNewSession('chat', 'New Clinical Strategy Session');
    refreshSessions();
    if (onNewSession) {
      onNewSession();
    } else {
      router.push(`/coach?sessionId=${created.id}`);
    }
  };

  const handleResumeSession = (sessionId: string) => {
    if (onOpenSession) {
      onOpenSession(sessionId);
    } else {
      router.push(`/coach?sessionId=${sessionId}`);
    }
  };

  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    togglePinSession(id);
    refreshSessions();
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this coaching session?')) {
      deleteSession(id);
      refreshSessions();
    }
  };

  const filteredSessions = sessions.filter((s) => {
    if (activeFilter === 'pinned' && !s.pinned) return false;
    if (activeFilter === 'patient' && !s.patientName) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        (s.patientName && s.patientName.toLowerCase().includes(q)) ||
        (s.summary && s.summary.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const totalSessions = sessions.length;
  const pinnedCount = sessions.filter((s) => s.pinned).length;
  const patientSessionsCount = sessions.filter((s) => s.patientName).length;

  return (
    <div className="space-y-6 pb-12 w-full">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Coaching Sessions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-sans">
            Review past strategic conversations, AI practice analyses, and clinical patient plans.
          </p>
        </div>

        <button
          onClick={handleStartNewSession}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#1E3A2B] hover:bg-[#162D21] text-white text-xs font-bold transition shadow-xs self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>New Coaching Session</span>
        </button>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-medium">
              <MessageSquare className="w-4 h-4 text-slate-700" />
              <span>Total Coaching Sessions</span>
            </div>
            <h3 className="text-2xl font-bold font-sans text-slate-900 mt-1">{totalSessions}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5 font-sans">Active AI practice records</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-medium">
              <Pin className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span>Pinned Key Strategies</span>
            </div>
            <h3 className="text-2xl font-bold font-sans text-slate-900 mt-1">{pinnedCount}</h3>
            <p className="text-[11px] text-amber-800 font-semibold mt-0.5">Quick access enabled</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-medium">
              <Users className="w-4 h-4 text-emerald-700" />
              <span>Patient-Bound Sessions</span>
            </div>
            <h3 className="text-2xl font-bold font-sans text-slate-900 mt-1">{patientSessionsCount}</h3>
            <p className="text-[11px] text-emerald-800 font-semibold mt-0.5">Personalized retention plans</p>
          </div>
        </div>
      </div>

      {/* Main Sessions Container */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-5">
        
        {/* Search & Filter Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                activeFilter === 'all'
                  ? 'bg-[#1E3A2B] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Sessions ({totalSessions})
            </button>

            <button
              onClick={() => setActiveFilter('pinned')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                activeFilter === 'pinned'
                  ? 'bg-[#1E3A2B] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Pinned ({pinnedCount})
            </button>

            <button
              onClick={() => setActiveFilter('patient')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                activeFilter === 'patient'
                  ? 'bg-[#1E3A2B] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Patient Specific ({patientSessionsCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sessions or patient names..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
            />
          </div>

        </div>

        {/* Sessions List */}
        <div className="space-y-3">
          {filteredSessions.length === 0 ? (
            <div className="p-12 text-center space-y-3 border border-dashed border-slate-200 rounded-2xl">
              <MessageSquare className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900 font-sans">No Matching Sessions</h3>
              <p className="text-xs text-slate-500 font-sans">
                Try clearing your search or start a new clinical session in AI Coach.
              </p>
            </div>
          ) : (
            filteredSessions.map((s) => (
              <div
                key={s.id}
                onClick={() => handleResumeSession(s.id)}
                className="p-5 rounded-2xl border border-slate-200/90 hover:border-[#1E3A2B] hover:bg-[#FAF9F6]/80 transition cursor-pointer space-y-3 group shadow-2xs"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-[#EBF3EA] border border-[#D5E6D3] text-[#1E3A2B] flex items-center justify-center font-bold text-xs flex-shrink-0">
                      AI
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-slate-900 font-sans group-hover:text-[#1E3A2B] transition">
                          {s.title}
                        </h4>
                        {s.pinned && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 font-mono flex items-center space-x-1">
                            <Pin className="w-2.5 h-2.5 fill-amber-500 text-amber-600" />
                            <span>Pinned</span>
                          </span>
                        )}
                        {s.patientName && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
                            Patient: {s.patientName}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5 font-mono">
                        <span>{s.createdAt || 'Sep 3, 2026'}</span>
                        <span>·</span>
                        <span>{s.messages.length} messages</span>
                        <span>·</span>
                        <span className="text-emerald-700 font-semibold">Supabase pgvector connected</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Right */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => handleTogglePin(s.id, e)}
                      className={`p-1.5 rounded-lg border transition ${
                        s.pinned
                          ? 'bg-amber-50 border-amber-200 text-amber-600'
                          : 'border-slate-200 hover:bg-slate-100 text-slate-400'
                      }`}
                      title={s.pinned ? 'Unpin' : 'Pin session'}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => handleDelete(s.id, e)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                      title="Delete session"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button className="px-3 py-1.5 rounded-xl bg-[#1E3A2B] text-white text-xs font-bold flex items-center space-x-1 shadow-xs group-hover:bg-[#162D21] transition">
                      <span>Resume in AI Coach</span>
                      <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                    </button>
                  </div>
                </div>

                {/* Session Message Preview */}
                {s.messages.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 font-sans leading-relaxed line-clamp-2">
                    <span className="font-bold text-slate-800">
                      {s.messages[s.messages.length - 1].role === 'user' ? 'Dr. Vance: ' : 'AI Coach: '}
                    </span>
                    {s.messages[s.messages.length - 1].content.replace(/[*#>`]/g, '').slice(0, 180)}...
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
};
