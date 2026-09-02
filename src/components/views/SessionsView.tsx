'use client';

import React, { useState, useEffect } from 'react';
import { supabase, Session } from '@/lib/supabaseClient';
import {
  Calendar,
  Clock,
  MessageSquare,
  Sparkles,
  ChevronRight,
  FileText,
  RotateCcw,
} from 'lucide-react';

interface SessionsViewProps {
  onOpenSession: (sessionId: string) => void;
  onNewSession: () => void;
}

export const SessionsView: React.FC<SessionsViewProps> = ({
  onOpenSession,
  onNewSession,
}) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        console.warn('Supabase sessions query note:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Coaching Sessions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-sans">
            Review past strategic conversations, AI analyses, and executive session transcripts.
          </p>
        </div>

        <button
          onClick={onNewSession}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#1E3A2B] hover:bg-[#162D21] text-white text-xs font-bold transition shadow-xs self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>New Coaching Session</span>
        </button>
      </div>

      {/* Sessions Timeline */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-2xl p-10 text-center text-xs text-slate-400 border border-slate-200/80">
            Loading past consultation sessions...
          </div>
        ) : sessions.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center space-y-3 border border-slate-200/80 shadow-xs">
            <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900">No Recorded Sessions</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Start an AI Coach session to record strategic business recommendations.
            </p>
          </div>
        ) : (
          sessions.map((s) => (
            <div
              key={s.id}
              onClick={() => onOpenSession(s.id)}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-[#1E3A2B] shadow-xs space-y-3 transition cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-[#EBF3EA] text-[#1E3A2B] flex items-center justify-center font-bold text-xs">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 capitalize font-sans">
                      {s.topic ? s.topic.replace(/-/g, ' ') : 'Clinic Practice Consultation'}
                    </h4>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5 font-mono">
                      <span>{new Date(s.created_at).toLocaleDateString()}</span>
                      <span>·</span>
                      <span>{new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs font-bold text-[#1E3A2B]">
                  <span>Resume Session</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {s.summary && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed font-sans line-clamp-2">
                  {s.summary}
                </div>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
};
