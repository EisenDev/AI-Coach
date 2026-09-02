'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AuraLogo } from '../AuraLogo';
import { sendChatMessage, generateSessionSummary } from '@/lib/n8nClient';
import { ActionPlanModal } from '../ActionPlanModal';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Send,
  Plus,
  ArrowLeft,
  Square,
  Users,
  TrendingUp,
  BookOpen,
  Target,
  FileText,
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  MoreHorizontal,
  Pause,
  Play,
  Keyboard,
  RotateCcw,
  Zap,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
  evidence?: string;
}

interface AiCoachViewProps {
  sessionId: string;
  onNewSession: () => void;
  prefilledPrompt?: string;
  clearPrefill?: () => void;
  onOpenPatientDetail?: (patientId: string) => void;
}

export const AiCoachView: React.FC<AiCoachViewProps> = ({
  sessionId,
  onNewSession,
  prefilledPrompt,
  clearPrefill,
  onOpenPatientDetail,
}) => {
  const [coachMode, setCoachMode] = useState<'voice' | 'chat'>('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(272);
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  const [summaryText, setSummaryText] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Restore chat history from localStorage
  useEffect(() => {
    if (!sessionId) return;
    const saved = localStorage.getItem(`aura_chat_${sessionId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      } catch (e) {
        console.warn('Failed to parse chat:', e);
      }
    }
  }, [sessionId]);

  // Save chat history to localStorage
  useEffect(() => {
    if (sessionId && messages.length > 0) {
      localStorage.setItem(`aura_chat_${sessionId}`, JSON.stringify(messages));
    }
  }, [sessionId, messages]);

  // Voice session timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (coachMode === 'voice') {
      timer = setInterval(() => {
        setVoiceSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [coachMode]);

  // Handle prefilled prompt (e.g. from CRM "Coach" button)
  useEffect(() => {
    if (prefilledPrompt) {
      setCoachMode('chat');
      handleSendMessage(prefilledPrompt);
      if (clearPrefill) clearPrefill();
    }
  }, [prefilledPrompt, clearPrefill]);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Web Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript.trim()) {
            setInputMessage(currentTranscript.trim());
          }
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleMic = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {
          setIsListening(false);
        }
      } else {
        const promptText = prompt("Dictate or type your question for the AI Coach:");
        if (promptText) {
          handleSendMessage(promptText);
        }
      }
    }
  };

  const playTTS = async (text: string) => {
    if (!isSpeakerOn) return;
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
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        currentAudioRef.current = audio;

        audio.onended = () => setIsPlayingAudio(false);
        audio.onerror = () => setIsPlayingAudio(false);
        await audio.play();
      } else {
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(text.replace(/[*#_`]/g, ''));
          utterance.rate = 1.05;
          utterance.onend = () => setIsPlayingAudio(false);
          utterance.onerror = () => setIsPlayingAudio(false);
          window.speechSynthesis.speak(utterance);
        } else {
          setIsPlayingAudio(false);
        }
      }
    } catch (e) {
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
        topic: 'retention',
      });

      const assistantMsg: Message = {
        id: 'msg-ai-' + Date.now(),
        role: 'assistant',
        content: chatRes.response || 'No response returned from coach.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        evidence: 'Checked 50 patient records · VIP Retention SOP · 2.4s',
      };

      setMessages((prev) => [...prev, assistantMsg]);
      playTTS(assistantMsg.content);
    } catch (err: any) {
      const errorMsg: Message = {
        id: 'msg-err-' + Date.now(),
        role: 'assistant',
        content: `⚠️ Connection notice: ${err.message}. Ensure n8n is active.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndSession = async () => {
    try {
      const res = await generateSessionSummary({ session_id: sessionId });
      setSummaryText(res.summary);
      setSummaryModalOpen(true);
    } catch (e: any) {
      alert(`Could not generate summary: ${e.message}`);
    }
  };

  const formatVoiceTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
  const lastAiMessage = [...messages].reverse().find((m) => m.role === 'assistant');

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-5rem)] flex flex-col">
      
      {/* MODE 1: LIVE VOICE COACHING (Screen 2) */}
      {coachMode === 'voice' ? (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs overflow-hidden">
          
          {/* Main Voice Center: 8 Cols */}
          <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
            
            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setCoachMode('chat')}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h3 className="text-base font-serif font-bold text-slate-900">Customer Retention</h3>
                <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>Live</span>
                </span>
                <span className="font-mono text-xs text-slate-500 font-semibold">{formatVoiceTime(voiceSeconds)}</span>
              </div>

              <button
                onClick={handleEndSession}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition"
              >
                <Square className="w-3 h-3 fill-rose-600 text-rose-600" />
                <span>End session</span>
              </button>
            </div>

            {/* Central Animated Soundwave Orb */}
            <div className="flex flex-col items-center justify-center text-center space-y-5 py-4">
              <span className="text-[11px] font-bold tracking-widest text-emerald-800 uppercase">
                {isListening ? 'AURA IS LISTENING' : isPlayingAudio ? 'AURA IS SPEAKING' : 'AURA READY'}
              </span>

              {/* Concentric Green Rings */}
              <div className="relative w-48 h-48 flex items-center justify-center">
                <div className={`absolute inset-0 rounded-full border-2 border-emerald-600/20 ${isListening || isPlayingAudio ? 'animate-ping duration-1000' : ''}`} />
                <div className="absolute inset-4 rounded-full border-2 border-emerald-600/30" />
                <div className="absolute inset-8 rounded-full border border-emerald-600/40" />
                
                <div className="w-28 h-28 rounded-full bg-emerald-50 border border-emerald-300 flex items-center justify-center shadow-xs">
                  {/* Green Audio Equalizer Bars */}
                  <div className="flex items-center space-x-1 h-10">
                    {[12, 24, 38, 20, 32, 16, 28, 36, 18, 10].map((h, i) => (
                      <div
                        key={i}
                        style={{ height: `${isListening || isPlayingAudio ? h : 6}px` }}
                        className="w-1 bg-[#2D5A3C] rounded-full transition-all duration-150"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Spoken Query in Serif */}
              <h4 className="text-base sm:text-lg font-serif font-bold text-slate-900 max-w-lg leading-snug">
                &ldquo;{lastUserMessage ? lastUserMessage.content : 'Which high-value patients have not returned in the last 90 days?'}&rdquo;
              </h4>
            </div>

            {/* AI Response Card */}
            <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-700 flex-shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-800 leading-relaxed font-sans font-medium">
                    {lastAiMessage
                      ? lastAiMessage.content
                      : 'I found three high-value patients who should be contacted this week. Together, they represent $13,600 in lifetime value.'}
                  </p>
                </div>
              </div>

              {/* Evidence Pill */}
              <div className="flex items-center space-x-2 text-[11px] text-slate-500 pt-1">
                <span className="flex items-center space-x-1 font-semibold text-emerald-800">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Checked 50 patient records · VIP Retention SOP · 2.4s</span>
                </span>
              </div>

              {/* Speaking Waveform */}
              {isPlayingAudio && (
                <div className="flex items-center space-x-1 h-3 pt-1">
                  {[4, 8, 12, 6, 10, 5, 9, 11, 7, 4].map((h, i) => (
                    <div key={i} style={{ height: `${h}px` }} className="w-0.5 bg-[#2D5A3C] rounded-full animate-pulse" />
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Controls Bar */}
            <div className="flex items-center justify-center space-x-6 pt-2">
              <button
                onClick={toggleMic}
                className="flex flex-col items-center space-y-1 text-slate-500 hover:text-slate-900"
              >
                <div className={`p-3 rounded-full border ${isListening ? 'bg-rose-50 border-rose-300 text-rose-700' : 'border-slate-200'}`}>
                  {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </div>
                <span className="text-[10px] font-medium">{isListening ? 'Mute mic' : 'Unmute mic'}</span>
              </button>

              <button
                onClick={toggleMic}
                className="w-14 h-14 rounded-full bg-[#1E3A2B] hover:bg-[#162D21] text-white flex items-center justify-center shadow-md transition"
              >
                {isListening ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              <button
                onClick={() => setCoachMode('chat')}
                className="flex flex-col items-center space-y-1 text-slate-500 hover:text-slate-900"
              >
                <div className="p-3 rounded-full border border-slate-200">
                  <Keyboard className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-medium">Switch to chat</span>
              </button>

              <button
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                className="flex flex-col items-center space-y-1 text-slate-500 hover:text-slate-900"
              >
                <div className={`p-3 rounded-full border ${isSpeakerOn ? 'border-slate-200' : 'bg-slate-100'}`}>
                  {isSpeakerOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </div>
                <span className="text-[10px] font-medium">{isSpeakerOn ? 'Speaker on' : 'Muted'}</span>
              </button>
            </div>

          </div>

          {/* Right Context Panel: 4 Cols */}
          <div className="lg:col-span-4 space-y-4 border-l border-slate-100 pl-6 flex flex-col justify-between">
            
            {/* Live Context Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center space-x-2 text-slate-800">
                <Users className="w-4 h-4 text-[#2D5A3C]" />
                <h4 className="text-xs font-bold">Live context</h4>
              </div>
              <p className="text-[11px] text-slate-500">3 high-value patients identified</p>

              <div className="space-y-2.5 divide-y divide-slate-100 text-xs">
                
                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80"
                      alt="Victoria"
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-slate-900">Victoria Kensington</p>
                      <p className="text-[10px] text-slate-400">64 days since last visit</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 font-mono">$6,800</span>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                      alt="Isabella"
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-slate-900">Isabella Cruz</p>
                      <p className="text-[10px] text-slate-400">108 days since last visit</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 font-mono">$3,600</span>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80"
                      alt="Daniel"
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-slate-900">Daniel Kim</p>
                      <p className="text-[10px] text-slate-400">91 days since last visit</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 font-mono">$3,200</span>
                </div>

              </div>

              <button
                onClick={() => setCoachMode('chat')}
                className="flex items-center justify-between text-xs font-bold text-[#1E3A2B] hover:underline pt-2 w-full"
              >
                <span>View details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Session Notes Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-slate-800">
                  <FileText className="w-4 h-4 text-[#2D5A3C]" />
                  <h4 className="text-xs font-bold">Session notes</h4>
                </div>
                <span className="flex items-center space-x-1 text-[10px] font-medium text-emerald-800">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Auto-saved</span>
                </span>
              </div>

              <ul className="space-y-2 text-xs text-slate-700 leading-relaxed font-sans list-disc list-inside">
                <li>Identified 3 high-value patients who have not returned in the last 90 days.</li>
                <li>Recommend outreach this week based on LTV and recency to maximize retention impact.</li>
              </ul>
            </div>

          </div>

        </div>
      ) : (
        /* MODE 2: CHAT & DICTATION MODE (Screen 3) */
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs overflow-hidden">
          
          {/* Main Chat Center: 8 or 12 Cols depending on panel collapse */}
          <div className={`${isPanelCollapsed ? 'lg:col-span-12' : 'lg:col-span-8'} flex flex-col justify-between space-y-4`}>
            
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <h3 className="text-base font-serif font-bold text-slate-900">AI Coach</h3>
                <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>Clinic data connected</span>
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={onNewSession}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-slate-200"
                  title="New Session"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={handleEndSession}
                  className="px-3.5 py-2 rounded-xl bg-[#1E3A2B] hover:bg-[#162D21] text-white text-xs font-bold transition shadow-xs"
                >
                  End & Synthesize Plan
                </button>
              </div>
            </div>

            {/* Conversation Stream or Welcome State */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {messages.length === 0 ? (
                /* Welcome Screen */
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-8">
                  <AuraLogo size={56} />

                  <div className="space-y-1 max-w-md">
                    <h3 className="text-2xl font-serif font-bold text-slate-900">
                      How can I help your clinic today?
                    </h3>
                    <p className="text-xs text-slate-500">
                      Ask about revenue, conversions, retention, patients, pricing, or clinic procedures.
                    </p>
                  </div>

                  {/* 4 Quick Starter Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl text-left pt-2">
                    
                    <button
                      onClick={() => handleSendMessage("Which patients need follow-up outreach in our clinic?")}
                      className="p-4 rounded-2xl border border-slate-200/80 hover:border-[#1E3A2B] bg-white hover:bg-slate-50 transition shadow-xs space-y-2 group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#EBF3EA] text-[#1E3A2B] flex items-center justify-center">
                        <Users className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-bold text-slate-900 font-sans group-hover:text-[#1E3A2B]">
                        Which patients need follow-up?
                      </p>
                    </button>

                    <button
                      onClick={() => handleSendMessage("Why are some consultations not converting and how can we improve them?")}
                      className="p-4 rounded-2xl border border-slate-200/80 hover:border-[#1E3A2B] bg-white hover:bg-slate-50 transition shadow-xs space-y-2 group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-bold text-slate-900 font-sans group-hover:text-[#1E3A2B]">
                        Why are consultations not converting?
                      </p>
                    </button>

                    <button
                      onClick={() => handleSendMessage("What does our pricing policy and SOP say about package discounts?")}
                      className="p-4 rounded-2xl border border-slate-200/80 hover:border-[#1E3A2B] bg-white hover:bg-slate-50 transition shadow-xs space-y-2 group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-bold text-slate-900 font-sans group-hover:text-[#1E3A2B]">
                        What does our pricing policy say?
                      </p>
                    </button>

                    <button
                      onClick={() => handleSendMessage("Build a 7-day retention plan for our 90-day inactive injectable clients.")}
                      className="p-4 rounded-2xl border border-slate-200/80 hover:border-[#1E3A2B] bg-white hover:bg-slate-50 transition shadow-xs space-y-2 group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                        <Target className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-bold text-slate-900 font-sans group-hover:text-[#1E3A2B]">
                        Build a 7-day retention plan
                      </p>
                    </button>

                  </div>
                </div>
              ) : (
                /* Chat Messages List */
                messages.map((m) => {
                  const isAI = m.role === 'assistant';
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isAI ? 'items-start' : 'items-end'} space-y-1`}
                    >
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                        {isAI ? 'Aura AI Business Coach' : 'Dr. Chloe Vance'} · {m.time}
                      </span>

                      <div
                        className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                          isAI
                            ? 'bg-slate-50 border border-slate-200 text-slate-900 rounded-tl-xs shadow-xs font-sans'
                            : 'bg-[#1E3A2B] text-white rounded-tr-xs font-sans shadow-xs'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{m.content}</div>

                        {isAI && (
                          <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                            <button
                              onClick={() => playTTS(m.content)}
                              className="flex items-center space-x-1 text-[#1E3A2B] font-bold hover:underline"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>Replay Voice</span>
                            </button>
                            {m.evidence && (
                              <span className="text-slate-400 text-[10px]">{m.evidence}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}

              {isLoading && (
                <div className="flex items-center space-x-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
                  <Zap className="w-4 h-4 animate-bounce text-emerald-700" />
                  <span>Aura is reasoning across 50 patient records & clinic knowledge...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Input Bar */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center space-x-2 bg-slate-50 p-2 rounded-2xl border border-slate-200"
              >
                <button
                  type="button"
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white transition"
                  title="Attach Document"
                >
                  <Plus className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={isListening ? "🎙️ Listening... speak clearly" : "Ask Aura about your clinic..."}
                  disabled={isLoading}
                  className="flex-1 bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none font-sans px-2"
                />

                {/* Mic Voice-to-Text Button */}
                <button
                  type="button"
                  onClick={toggleMic}
                  className={`p-2 rounded-xl transition ${
                    isListening ? 'bg-rose-500 text-white animate-pulse' : 'text-slate-500 hover:text-slate-900 hover:bg-white'
                  }`}
                  title="Voice Input"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                {/* Switch to Live Voice Mode Button */}
                <button
                  type="button"
                  onClick={() => setCoachMode('voice')}
                  className="p-2 rounded-xl bg-[#1E3A2B] text-white hover:bg-[#162D21] transition shadow-xs"
                  title="Switch to Live Voice Mode"
                >
                  <Volume2 className="w-4 h-4" />
                </button>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-2 rounded-xl bg-emerald-100 text-emerald-900 hover:bg-emerald-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <p className="text-center text-[10px] text-slate-400 font-sans">
                🔒 Aura can check your patient data and clinic knowledge.
              </p>
            </div>

          </div>

          {/* Right Context & Recent Conversations Panel: 4 Cols */}
          {!isPanelCollapsed && (
            <div className="lg:col-span-4 space-y-4 border-l border-slate-100 pl-6 flex flex-col justify-between">
              
              <div className="space-y-4">
                {/* Context Available Card */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 font-sans">Context available</h4>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center space-x-2.5 text-slate-700">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span><strong>50</strong> patient records</span>
                    </div>

                    <div className="flex items-center space-x-2.5 text-slate-700">
                      <BookOpen className="w-4 h-4 text-slate-400" />
                      <span><strong>6</strong> knowledge documents</span>
                    </div>

                    <div className="flex items-center space-x-2.5 text-slate-700">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span><strong>12</strong> saved sessions</span>
                    </div>
                  </div>
                </div>

                {/* Recent Conversations Card */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 font-sans">Recent conversations</h4>

                  <div className="space-y-2.5 divide-y divide-slate-100 text-xs">
                    
                    <div
                      onClick={() => handleSendMessage("Patients who haven't rebooked in 90 days")}
                      className="pt-2 cursor-pointer hover:bg-slate-50 p-1 rounded transition"
                    >
                      <p className="font-bold text-slate-800">Patients who haven&apos;t rebooked in 90 days</p>
                      <p className="text-[10px] text-slate-400">10:02 AM</p>
                    </div>

                    <div
                      onClick={() => handleSendMessage("How can we improve consultation conversion rate?")}
                      className="pt-2 cursor-pointer hover:bg-slate-50 p-1 rounded transition"
                    >
                      <p className="font-bold text-slate-800">Improve consultation conversion rate</p>
                      <p className="text-[10px] text-slate-400">Yesterday</p>
                    </div>

                    <div
                      onClick={() => handleSendMessage("Q2 retention strategy review")}
                      className="pt-2 cursor-pointer hover:bg-slate-50 p-1 rounded transition"
                    >
                      <p className="font-bold text-slate-800">Q2 retention strategy review</p>
                      <p className="text-[10px] text-slate-400">Jun 24</p>
                    </div>

                  </div>
                </div>
              </div>

              {/* Collapse Button */}
              <button
                onClick={() => setIsPanelCollapsed(true)}
                className="flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-700 pt-2"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Collapse panel</span>
              </button>

            </div>
          )}

        </div>
      )}

      {/* Summary Modal */}
      <ActionPlanModal
        isOpen={summaryModalOpen}
        onClose={() => setSummaryModalOpen(false)}
        summary={summaryText}
        topic="Customer Retention"
        sessionId={sessionId}
      />

    </div>
  );
};
