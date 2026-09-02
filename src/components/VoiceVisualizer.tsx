'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Volume2, Loader2 } from 'lucide-react';

interface VoiceVisualizerProps {
  isListening: boolean;
  isPlayingAudio: boolean;
  isLoading: boolean;
  onToggleListen: () => void;
  topic: string;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({
  isListening,
  isPlayingAudio,
  isLoading,
  onToggleListen,
  topic,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 glass-card rounded-2xl relative overflow-hidden bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 shadow-lg">
      
      {/* Dynamic Aura Ambient Glow */}
      <div className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
        isListening
          ? 'bg-gradient-to-t from-rose-500/15 via-amber-500/10 to-transparent opacity-100'
          : isPlayingAudio
          ? 'bg-gradient-to-t from-indigo-500/20 via-amber-500/10 to-transparent opacity-100'
          : isLoading
          ? 'bg-gradient-to-t from-amber-500/15 via-transparent to-transparent opacity-100'
          : 'opacity-0'
      }`} />

      {/* Main Interactive Orb */}
      <div className="relative flex items-center justify-center my-4">
        {/* Animated Ripple Rings when Listening */}
        {isListening && (
          <>
            <motion.div
              animate={{ scale: [1, 1.4, 1.8], opacity: [0.8, 0.4, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
              className="absolute w-28 h-28 rounded-full bg-rose-500/30 border border-rose-400/50"
            />
            <motion.div
              animate={{ scale: [1, 1.6, 2.2], opacity: [0.6, 0.2, 0] }}
              transition={{ repeat: Infinity, duration: 2, delay: 0.5, ease: "easeOut" }}
              className="absolute w-28 h-28 rounded-full bg-amber-500/20 border border-amber-400/30"
            />
          </>
        )}

        {/* Animated Rings when AI is Speaking (Playing Audio) */}
        {isPlayingAudio && (
          <>
            <motion.div
              animate={{ scale: [1, 1.3, 1.6], opacity: [0.7, 0.3, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              className="absolute w-28 h-28 rounded-full bg-indigo-500/30 border border-indigo-400/50"
            />
            <motion.div
              animate={{ scale: [1, 1.5, 2], opacity: [0.5, 0.2, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, delay: 0.4, ease: "easeInOut" }}
              className="absolute w-28 h-28 rounded-full bg-amber-500/25 border border-amber-400/40"
            />
          </>
        )}

        {/* Central Orb Button */}
        <button
          onClick={onToggleListen}
          disabled={isLoading}
          className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-xl focus:outline-none focus:ring-4 ${
            isListening
              ? 'bg-gradient-to-tr from-rose-600 to-rose-500 text-white shadow-rose-500/40 scale-105 ring-rose-400/40'
              : isPlayingAudio
              ? 'bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 text-white shadow-indigo-500/40 scale-105 ring-indigo-400/40'
              : isLoading
              ? 'bg-slate-100 dark:bg-obsidian-800 text-amber-600 dark:text-clinic-gold border border-amber-400/40 cursor-wait'
              : 'bg-gradient-to-tr from-slate-50 to-slate-100 dark:from-obsidian-800 dark:to-obsidian-850 text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-white border border-slate-200 dark:border-white/10 hover:border-amber-400/50 hover:scale-105 ring-amber-400/30 shadow-md'
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-8 h-8 animate-spin text-amber-600 dark:text-clinic-gold" />
          ) : isListening ? (
            <Mic className="w-9 h-9 animate-pulse text-white" />
          ) : isPlayingAudio ? (
            <Volume2 className="w-9 h-9 animate-bounce text-white" />
          ) : (
            <Mic className="w-8 h-8 text-amber-600 dark:text-clinic-gold" />
          )}

          <span className="text-[10px] font-bold tracking-wider uppercase mt-1">
            {isLoading ? 'Thinking' : isListening ? 'Listening' : isPlayingAudio ? 'Speaking' : 'Tap to Talk'}
          </span>
        </button>
      </div>

      {/* Dynamic Audio Waveform Bars */}
      <div className="flex items-center space-x-1.5 h-8 my-2">
        {Array.from({ length: 18 }).map((_, i) => {
          const isActive = isListening || isPlayingAudio;
          return (
            <motion.div
              key={i}
              animate={
                isActive
                  ? {
                      height: ['15%', `${Math.min(100, Math.max(25, ((i * 17) % 75) + 25))}%`, '15%'],
                    }
                  : { height: '15%' }
              }
              transition={
                isActive
                  ? {
                      repeat: Infinity,
                      duration: 0.6 + ((i % 5) * 0.15),
                      ease: 'easeInOut',
                    }
                  : { duration: 0.3 }
              }
              className={`w-1 rounded-full transition-colors ${
                isListening
                  ? 'bg-gradient-to-t from-rose-500 to-rose-300'
                  : isPlayingAudio
                  ? 'bg-gradient-to-t from-indigo-500 via-rose-500 to-amber-500'
                  : 'bg-slate-200 dark:bg-white/10'
              }`}
            />
          );
        })}
      </div>

      {/* Focus & Status Label */}
      <div className="text-center mt-1">
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Focus: <span className="text-amber-700 dark:text-clinic-gold font-bold capitalize">{topic.replace(/-/g, ' ')}</span>
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
          {isListening
            ? 'Listening to microphone... Speak clearly.'
            : isPlayingAudio
            ? 'Voice AI audio playing • Tap orb to pause'
            : isLoading
            ? 'DeepSeek RAG reasoning across 50 CRM records...'
            : 'Click orb to speak or type in the prompt bar below'}
        </p>
      </div>
    </div>
  );
};
