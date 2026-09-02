'use client';

import React, { useState, useEffect, useRef } from 'react';
import { VoiceVisualizer } from './VoiceVisualizer';
import { sendChatMessage, generateSessionSummary } from '@/lib/n8nClient';
import { ActionPlanModal } from './ActionPlanModal';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  RefreshCw,
  FileCheck,
  Target,
  Users,
  DollarSign,
  Copy,
  Check,
  Zap,
  AlertCircle,
} from 'lucide-react';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

const TOPICS = [
  { id: 'retention', label: '90-Day Retention & Rebooking', icon: <Target className="w-4 h-4" /> },
  { id: 'upsell', label: 'High-Ticket Treatment Upsells', icon: <DollarSign className="w-4 h-4" /> },
  { id: 'reactivation', label: 'VIP Client LTV Reactivation', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'staff-performance', label: 'Provider Utilization & Booking', icon: <Users className="w-4 h-4" /> },
];

const SUGGESTIONS = [
  "Which clients haven't rebooked in the last 90 days and what revenue is at risk?",
  "How can our aesthetic injectors increase HydraFacial to Botox bundle conversion?",
  "Draft a high-converting 14-day check-in SMS script for dermal filler patients.",
  "What retention rate should we target to increase annual clinic profits by 25%?",
];

interface VoiceCoachTabProps {
  sessionId: string;
  onNewSession: () => void;
  prefilledPrompt?: string;
  clearPrefill?: () => void;
}

export const VoiceCoachTab: React.FC<VoiceCoachTabProps> = ({
  sessionId,
  onNewSession,
  prefilledPrompt,
  clearPrefill,
}) => {
  const [selectedTopic, setSelectedTopic] = useState('retention');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [micNotice, setMicNotice] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryText, setSummaryText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const isListeningIntentRef = useRef<boolean>(false);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Load chat history from localStorage on sessionId change
  useEffect(() => {
    if (!sessionId) return;
    const saved = localStorage.getItem(`aura_chat_${sessionId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      } catch (e) {
        console.warn('Failed to parse saved chat:', e);
      }
    }
    
    // Default initial message
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: "Hello Dr. Vance. I am your **Aura Clinic AI Business Coach**. I have real-time access to your 50 customer CRM records and clinic clinical protocols. How can I help you accelerate your practice retention and revenue today?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [sessionId]);

  // Save messages to localStorage whenever they update
  useEffect(() => {
    if (sessionId && messages.length > 0) {
      localStorage.setItem(`aura_chat_${sessionId}`, JSON.stringify(messages));
    }
  }, [sessionId, messages]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle prefilled prompt (e.g. from CRM "Coach On This Client" button)
  useEffect(() => {
    if (prefilledPrompt) {
      setInputMessage(prefilledPrompt);
      if (clearPrefill) clearPrefill();
    }
  }, [prefilledPrompt, clearPrefill]);

  // Real-Time Speech Recognition Engine
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let fullTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            fullTranscript += event.results[i][0].transcript + ' ';
          }
          if (fullTranscript.trim()) {
            setInputMessage(fullTranscript.trim());
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('[Speech Recognition Error]:', event.error);
          if (event.error === 'network') {
            setMicNotice('Brave/Linux Shield notice: Browser blocked Google Speech cloud network. You can type or use quick chips below.');
          } else if (event.error === 'not-allowed') {
            setMicNotice('Microphone permission blocked. Please allow microphone access in your browser settings.');
          }
          setIsListening(false);
          isListeningIntentRef.current = false;
        };

        recognition.onend = () => {
          // If the user intended to keep listening and it stopped due to silence, restart unless explicitly stopped
          if (isListeningIntentRef.current) {
            try {
              recognition.start();
            } catch (e) {
              setIsListening(false);
              isListeningIntentRef.current = false;
            }
          } else {
            setIsListening(false);
          }
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleListen = async () => {
    if (isPlayingAudio) {
      stopAudio();
      return;
    }

    setMicNotice(null);

    if (isListening) {
      isListeningIntentRef.current = false;
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      isListeningIntentRef.current = true;
      setIsListening(true);

      // Check mediaDevices permission
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          await navigator.mediaDevices.getUserMedia({ audio: true });
        }
      } catch (err) {
        console.warn('Microphone getUserMedia request:', err);
      }

      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (err) {
          console.warn('Speech recognition start note:', err);
        }
      } else {
        const fallbackText = prompt("Voice Dictation: Enter your question for the AI Business Coach:");
        if (fallbackText) {
          setInputMessage(fallbackText);
        }
        setIsListening(false);
        isListeningIntentRef.current = false;
      }
    }
  };

  // Play audio response using Fish Audio TTS or browser SpeechSynthesis
  const playSpeech = async (text: string) => {
    stopAudio();

    try {
      setIsPlayingAudio(true);
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const contentType = res.headers.get('content-type');

      if (contentType && contentType.includes('audio/mpeg')) {
        const blob = await res.blob();
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        currentAudioRef.current = audio;

        audio.onended = () => {
          setIsPlayingAudio(false);
          URL.revokeObjectURL(audioUrl);
        };
        audio.onerror = () => {
          setIsPlayingAudio(false);
          URL.revokeObjectURL(audioUrl);
        };

        await audio.play();
      } else {
        // Browser SpeechSynthesis fallback
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          const cleanText = text.replace(/[*#_`]/g, '');
          const utterance = new SpeechSynthesisUtterance(cleanText);
          utterance.rate = 1.05;
          utterance.pitch = 1.0;
          utterance.onend = () => setIsPlayingAudio(false);
          utterance.onerror = () => setIsPlayingAudio(false);
          window.speechSynthesis.speak(utterance);
        } else {
          setIsPlayingAudio(false);
        }
      }
    } catch (err) {
      console.warn('[TTS Playback Exception]:', err);
      setIsPlayingAudio(false);
    }
  };

  const stopAudio = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || isLoading) return;

    if (isListening) {
      isListeningIntentRef.current = false;
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const userMsg: Message = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const chatRes = await sendChatMessage({
        message: textToSend,
        session_id: sessionId,
        topic: selectedTopic,
      });

      const assistantMsg: Message = {
        id: 'msg-ai-' + Date.now(),
        role: 'assistant',
        content: chatRes.response || 'No response returned from coach.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      playSpeech(assistantMsg.content);
    } catch (error: any) {
      console.error('[Chat Error]:', error);
      const errorMsg: Message = {
        id: 'msg-err-' + Date.now(),
        role: 'assistant',
        content: `⚠️ Coaching connection issue: ${error.message}. Please verify n8n webhook status.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    setIsSummarizing(true);
    try {
      const res = await generateSessionSummary({ session_id: sessionId });
      setSummaryText(res.summary);
      setIsModalOpen(true);
    } catch (err: any) {
      console.error('[Summary Error]:', err);
      alert(`Could not generate summary: ${err.message}`);
    } finally {
      setIsSummarizing(false);
    }
  };

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
      
      {/* LEFT COLUMN: Visualizer & Session Controls */}
      <div className="lg:col-span-1 space-y-4">
        {/* Voice Visualizer Orb */}
        <VoiceVisualizer
          isListening={isListening}
          isPlayingAudio={isPlayingAudio}
          isLoading={isLoading}
          onToggleListen={toggleListen}
          topic={selectedTopic}
        />

        {/* Topic Selector */}
        <div className="glass-card rounded-2xl p-4 space-y-2.5 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Coaching Focus</span>
            <span className="text-[10px] text-amber-700 font-bold">RAG CRM Context</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {TOPICS.map((t) => {
              const isSel = selectedTopic === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTopic(t.id)}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                    isSel
                      ? 'bg-amber-100/70 text-slate-900 border border-amber-300 font-bold shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200/60'
                  }`}
                >
                  <span className={isSel ? 'text-amber-800' : 'text-slate-500'}>{t.icon}</span>
                  <span className="truncate text-slate-900">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* End Session & Generate Action Plan Button */}
        <div className="glass-card rounded-2xl p-4 space-y-2.5 bg-white border border-slate-200 shadow-sm">
          <button
            onClick={handleGenerateSummary}
            disabled={isSummarizing || messages.length <= 1}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSummarizing ? (
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
            ) : (
              <FileCheck className="w-4 h-4 text-white" />
            )}
            <span>{isSummarizing ? 'Synthesizing 7-Day Plan...' : 'End Session & Generate Action Plan'}</span>
          </button>

          <button
            onClick={onNewSession}
            className="w-full flex items-center justify-center space-x-1.5 py-2 text-[11px] font-semibold text-slate-500 hover:text-slate-900 transition"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Start Fresh Consultation</span>
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: Live Chat Stream & Input */}
      <div className="lg:col-span-2 glass-card rounded-2xl flex flex-col h-[680px] overflow-hidden bg-white border border-slate-200 shadow-sm">
        
        {/* Chat Stream Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-xs font-bold text-slate-900 tracking-wide">Live Executive Coaching Stream</span>
          </div>

          <div className="flex items-center space-x-2">
            {isPlayingAudio && (
              <button
                onClick={stopAudio}
                className="flex items-center space-x-1 px-2.5 py-1 rounded text-[10px] bg-rose-50 text-rose-800 border border-rose-200 font-bold"
              >
                <VolumeX className="w-3 h-3" />
                <span>Mute Voice</span>
              </button>
            )}
            <span className="text-[11px] text-slate-500 font-mono font-medium">DeepSeek-V3 Engine</span>
          </div>
        </div>

        {/* Message Bubble List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-sm">
          {messages.map((m) => {
            const isAI = m.role === 'assistant';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isAI ? 'items-start' : 'items-end'} space-y-1`}
              >
                <div className="flex items-center space-x-2 px-1">
                  <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                    {isAI ? 'Aura AI Business Coach' : 'Clinic Director (You)'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{m.time}</span>
                </div>

                <div
                  className={`relative group max-w-[85%] rounded-2xl p-4 leading-relaxed ${
                    isAI
                      ? 'bg-slate-50 border border-slate-200 text-slate-900 rounded-tl-sm shadow-sm'
                      : 'bg-amber-700 text-white font-medium rounded-tr-sm shadow'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans text-[13.5px]">
                    {m.content}
                  </div>

                  {/* Actions Bar for Assistant Messages */}
                  {isAI && (
                    <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                      <button
                        onClick={() => playSpeech(m.content)}
                        className="flex items-center space-x-1 text-amber-800 font-bold hover:underline transition"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Replay Voice</span>
                      </button>

                      <button
                        onClick={() => copyMessage(m.id, m.content)}
                        className="flex items-center space-x-1 hover:text-slate-900 transition font-medium"
                      >
                        {copiedId === m.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedId === m.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Thinking Skeleton */}
          {isLoading && (
            <div className="flex flex-col items-start space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase px-1">Aura AI Business Coach</span>
              <div className="rounded-2xl rounded-tl-sm p-4 border border-amber-300 flex items-center space-x-2 text-amber-900 text-xs bg-amber-50 shadow-sm">
                <Zap className="w-4 h-4 animate-bounce text-amber-700" />
                <span>Analyzing 50 CRM patient records & clinical protocols...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Mic Notice (if Brave blocks cloud STT) */}
        {micNotice && (
          <div className="px-4 py-2 bg-amber-50 border-t border-amber-200 text-xs text-amber-900 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span className="leading-tight">{micNotice}</span>
          </div>
        )}

        {/* Suggested Quick Prompts */}
        <div className="px-4 py-2 border-t border-slate-200 flex items-center space-x-2 overflow-x-auto no-scrollbar bg-slate-50/60">
          {SUGGESTIONS.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(s)}
              disabled={isLoading}
              className="flex-shrink-0 text-[11px] px-3 py-1.5 rounded-full bg-white hover:bg-amber-50 border border-slate-200 text-slate-700 hover:text-amber-900 transition shadow-sm font-semibold"
            >
              {s.slice(0, 38)}...
            </button>
          ))}
        </div>

        {/* Real-time Streaming Input Bar */}
        <div className="p-3.5 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <button
              type="button"
              onClick={toggleListen}
              className={`p-2.5 rounded-xl transition ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-600/30'
                  : 'bg-slate-100 text-amber-800 hover:bg-slate-200 border border-slate-200'
              }`}
              title={isListening ? "Listening... (Click to stop)" : "Click to Speak"}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={isListening ? "🎙️ Listening... speak clearly into your mic" : "Ask about retention metrics, high-ticket upsells, or patient outreach..."}
              disabled={isLoading}
              className={`flex-1 px-4 py-2.5 rounded-xl border text-xs placeholder-slate-400 focus:outline-none focus:border-amber-500 transition font-sans ${
                isListening
                  ? 'bg-rose-50/60 border-rose-300 text-slate-900'
                  : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs transition disabled:opacity-40 disabled:cursor-not-allowed shadow"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

      {/* Celebratory Action Plan Modal */}
      <ActionPlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        summary={summaryText}
        topic={selectedTopic}
        sessionId={sessionId}
      />
    </div>
  );
};
