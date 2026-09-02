'use client';

import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle2, Copy, Check, Download, X, Calendar, TrendingUp, Target } from 'lucide-react';

interface ActionPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: string;
  topic: string;
  sessionId: string;
}

export const ActionPlanModal: React.FC<ActionPlanModalProps> = ({
  isOpen,
  onClose,
  summary,
  topic,
  sessionId,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Trigger festive executive confetti
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E5A93B', '#E2847A', '#10B981', '#8B5CF6'],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([summary], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Aura_Clinic_Action_Plan_${sessionId}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-obsidian-900 border border-clinic-gold/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header with Luxury Gold Accent */}
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-obsidian-950 via-obsidian-900 to-obsidian-950 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-clinic-gold/15 border border-clinic-gold/40 flex items-center justify-center text-clinic-gold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white tracking-tight">7-Day Executive Action Plan</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Ready to Deploy
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Session Focus: <span className="text-clinic-gold font-medium capitalize">{topic}</span> • ID: {sessionId.slice(0, 8)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Plan Content (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-200 leading-relaxed font-sans">
          <div className="p-4 rounded-xl bg-obsidian-950 border border-white/5 whitespace-pre-wrap font-sans text-slate-200">
            {summary}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 bg-obsidian-950/90 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Saved to Supabase Sessions Table</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-white transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Plan'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-clinic-rose/20 hover:bg-clinic-rose/30 border border-clinic-rose/40 text-clinic-rose transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .MD</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-clinic-rose to-clinic-gold text-obsidian-950 hover:opacity-90 transition shadow"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
