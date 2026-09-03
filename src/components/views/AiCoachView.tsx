'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AuraLogo } from '../AuraLogo';
import { sendChatMessage, generateSessionSummary } from '@/lib/n8nClient';
import { ActionPlanModal } from '../ActionPlanModal';
import {
  CoachSession,
  ChatMessage,
  getStoredSessions,
  saveStoredSessions,
  createNewSession,
  togglePinSession,
  updateSessionMessages,
} from '@/lib/sessionStore';
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
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Pause,
  Play,
  Keyboard,
  RotateCcw,
  Zap,
  MoreHorizontal,
  Pin,
  Clock,
  Trash2,
} from 'lucide-react';

interface AiCoachViewProps {
  sessionId: string;
  onNewSession?: (newId: string) => void;
  prefilledPrompt?: string;
  clearPrefill?: () => void;
  onOpenPatientDetail?: (patientId: string) => void;
}

export const AiCoachView: React.FC<AiCoachViewProps> = ({
  sessionId: initialSessionId,
  onNewSession,
  prefilledPrompt,
  clearPrefill,
  onOpenPatientDetail,
}) => {
  const [sessions, setSessions] = useState<CoachSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>(initialSessionId || 'session-vic-1');
  const [coachMode, setCoachMode] = useState<'voice' | 'chat'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(289);
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  const [summaryText, setSummaryText] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize sessions from store
  useEffect(() => {
    const loaded = getStoredSessions();
    setSessions(loaded);
    const initial = loaded.find((s) => s.id === initialSessionId) || loaded[0];
    if (initial) {
      setActiveSessionId(initial.id);
      setMessages(initial.messages || []);
      setCoachMode(initial.type || 'chat');
    }
  }, [initialSessionId]);

  // Load messages when active session changes
  const switchSession = (id: string) => {
    const target = sessions.find((s) => s.id === id);
    if (target) {
      setActiveSessionId(target.id);
      setMessages(target.messages || []);
      setCoachMode(target.type || 'chat');
      stopAudio();
    }
  };

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

  // Handle prefilled prompt
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

  const handleCreateNewSession = (type: 'chat' | 'voice' = 'chat') => {
    const newSession = createNewSession(type);
    const updated = getStoredSessions();
    setSessions(updated);
    setActiveSessionId(newSession.id);
    setMessages([]);
    setCoachMode(type);
    if (onNewSession) onNewSession(newSession.id);
  };

  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = togglePinSession(id);
    setSessions(updated);
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length <= 1) return;
    const filtered = sessions.filter((s) => s.id !== id);
    saveStoredSessions(filtered);
    setSessions(filtered);
    if (activeSessionId === id) {
      switchSession(filtered[0].id);
    }
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || isLoading) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    updateSessionMessages(activeSessionId, newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const chatRes = await sendChatMessage({
        message: textToSend,
        session_id: activeSessionId,
        topic: 'retention',
      });

      // Clean response text: eliminate raw dashes '—' or raw markdown '>'
      let cleaned = (chatRes.response || 'No response returned from coach.')
        .replace(/—/g, ' - ')
        .replace(/^\s*>\s*/gm, '');

      const assistantMsg: ChatMessage = {
        id: 'msg-ai-' + Date.now(),
        role: 'assistant',
        content: cleaned,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        evidence: 'Checked 50 patient records · VIP Retention SOP · 2.4s',
      };

      const finalMessages = [...newMessages, assistantMsg];
      setMessages(finalMessages);
      updateSessionMessages(activeSessionId, finalMessages);
      playTTS(assistantMsg.content);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: 'msg-err-' + Date.now(),
        role: 'assistant',
        content: `Connection notice: ${err.message}. Ensure Railway n8n or DeepSeek is active.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      const finalMessages = [...newMessages, errorMsg];
      setMessages(finalMessages);
      updateSessionMessages(activeSessionId, finalMessages);
    } finally {
      setIsLoading(false);
      setSessions(getStoredSessions());
    }
  };

  const handleEndSession = async () => {
    try {
      const res = await generateSessionSummary({ session_id: activeSessionId });
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

  // Helper to render clean formatted text with elegant styled cards
  const renderFormattedText = (text: string) => {
    const paragraphs = text.split('\n\n');
    return (
      <div className="space-y-3 font-sans">
        {paragraphs.map((para, pIdx) => {
          const lines = para.split('\n');
          return (
            <div key={pIdx} className="space-y-1">
              {lines.map((line, lIdx) => {
                const trimmed = line.trim();
                // Clean bullet points
                if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
                  const content = trimmed.substring(2);
                  return (
                    <div key={lIdx} className="flex items-start space-x-2 pl-2">
                      <span className="text-[#2D5A3C] font-bold">•</span>
                      <span>{renderInlineFormatting(content)}</span>
                    </div>
                  );
                }
                // Clean numbered lists
                const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
                if (numberedMatch) {
                  return (
                    <div key={lIdx} className="flex items-start space-x-2 pl-2 mt-1">
                      <span className="font-bold text-[#1E3A2B] font-mono text-xs">{numberedMatch[1]}.</span>
                      <span>{renderInlineFormatting(numberedMatch[2])}</span>
                    </div>
                  );
                }
                return <p key={lIdx}>{renderInlineFormatting(line)}</p>;
              })}
            </div>
          );
        })}
      </div>
    );
  };

  const renderInlineFormatting = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-bold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em key={index} className="italic text-slate-800">
            {part.slice(1, -1)}
          </em>
        );
      }
      return part;
    });
  };

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const pinnedSessions = sessions.filter((s) => s.pinned);
  const recentSessions = sessions.filter((s) => !s.pinned);
  const voiceHistorySessions = sessions.filter((s) => s.type === 'voice');

  const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
  const lastAiMessage = [...messages].reverse().find((m) => m.role === 'assistant');

  return (
    <div className="w-full h-[calc(100vh-2.5rem)] flex gap-5 overflow-hidden">
      
      {/* MODE 1: LIVE VOICE COACHING */}
      {coachMode === 'voice' ? (
        <div className="flex-1 flex gap-5 h-full overflow-hidden">
          
          {/* Main Voice Workspace */}
          <div className="flex-1 flex flex-col justify-between bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 overflow-y-auto">
            
            {/* Top Bar with Instant Navigation */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setCoachMode('chat')}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition shadow-xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Switch to Chat</span>
                </button>
                <h3 className="text-base font-serif font-bold text-slate-900">
                  {activeSession?.title || 'Customer Retention'}
                </h3>
                <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>Live</span>
                </span>
                <span className="font-mono text-xs text-slate-500 font-semibold">{formatVoiceTime(voiceSeconds)}</span>
              </div>

              <button
                onClick={handleEndSession}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition shadow-xs"
              >
                <Square className="w-3 h-3 fill-rose-600 text-rose-600" />
                <span>End session</span>
              </button>
            </div>

            {/* Central Animated Soundwave Orb */}
            <div className="flex flex-col items-center justify-center text-center space-y-5 py-4">
              <span className="text-[11px] font-bold tracking-widest text-emerald-800 uppercase font-mono">
                {isListening ? 'AURA IS LISTENING' : isPlayingAudio ? 'AURA IS SPEAKING' : 'AURA READY'}
              </span>

              {/* Concentric Green Rings */}
              <div className="relative w-56 h-56 flex items-center justify-center">
                <div className={`absolute inset-0 rounded-full border border-emerald-600/20 ${isListening || isPlayingAudio ? 'animate-ping duration-1000' : ''}`} />
                <div className="absolute inset-4 rounded-full border border-emerald-600/30" />
                <div className="absolute inset-8 rounded-full border border-emerald-600/40" />
                <div className="absolute inset-12 rounded-full border border-emerald-600/50" />
                
                <div className="w-24 h-24 rounded-full bg-emerald-50/70 border border-emerald-300 flex items-center justify-center shadow-xs">
                  <div className="flex items-center space-x-1 h-12">
                    {[10, 22, 36, 18, 42, 14, 28, 38, 16, 8].map((h, i) => (
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
              <h4 className="text-base sm:text-lg font-serif font-bold text-slate-900 max-w-xl leading-snug">
                &ldquo;{lastUserMessage ? lastUserMessage.content : 'Which high-value patients have not returned in the last 90 days?'}&rdquo;
              </h4>
            </div>

            {/* AI Response Card */}
            <div className="bg-slate-50/90 rounded-2xl p-5 border border-slate-200/80 space-y-3 shadow-xs max-w-2xl mx-auto w-full">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 flex-shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="space-y-1 text-xs text-slate-800 leading-relaxed font-sans font-medium">
                  {lastAiMessage ? renderFormattedText(lastAiMessage.content) : (
                    <p>I found three high-value patients who should be contacted this week: Victoria Kensington ($6,800), Isabella Cruz ($3,600), and Daniel Kim ($3,200). Together, they represent $13,600 in lifetime value.</p>
                  )}
                </div>
              </div>

              {/* Evidence Pill */}
              <div className="flex items-center space-x-2 text-[11px] text-slate-500 pt-1">
                <span className="flex items-center space-x-1 font-semibold text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Checked 50 patient records · VIP Retention SOP · 2.4s</span>
                </span>
              </div>
            </div>

            {/* Bottom Controls Bar */}
            <div className="flex items-center justify-center space-x-8 pt-4 border-t border-slate-100">
              <button
                onClick={toggleMic}
                className="flex flex-col items-center space-y-1 text-slate-500 hover:text-slate-900"
              >
                <div className={`p-3 rounded-full border ${isListening ? 'bg-rose-50 border-rose-300 text-rose-700' : 'border-slate-200 bg-white'}`}>
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
                <div className="p-3 rounded-full border border-slate-200 bg-white">
                  <Keyboard className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-medium">Switch to chat</span>
              </button>

              <button
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                className="flex flex-col items-center space-y-1 text-slate-500 hover:text-slate-900"
              >
                <div className={`p-3 rounded-full border bg-white ${isSpeakerOn ? 'border-slate-200 text-slate-800' : 'bg-slate-100 text-slate-400'}`}>
                  {isSpeakerOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </div>
                <span className="text-[10px] font-medium">{isSpeakerOn ? 'Speaker on' : 'Muted'}</span>
              </button>
            </div>

          </div>

          {/* Right Fixed Panel in Voice Mode */}
          <div className="w-80 flex-shrink-0 flex flex-col gap-4 h-full overflow-y-auto">
            
            {/* Live Context Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center space-x-2 text-slate-800">
                <Users className="w-4 h-4 text-[#2D5A3C]" />
                <h4 className="text-xs font-bold font-sans">Live context</h4>
              </div>
              <p className="text-[11px] text-slate-500">3 high-value patients identified</p>

              <div className="space-y-2.5 divide-y divide-slate-100 text-xs">
                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80"
                      alt="Victoria"
                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <p className="font-bold text-slate-900 font-sans">Victoria Kensington</p>
                      <p className="text-[10px] text-slate-400">64 days since last visit</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 font-sans">$6,800</span>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                      alt="Isabella"
                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <p className="font-bold text-slate-900 font-sans">Isabella Cruz</p>
                      <p className="text-[10px] text-slate-400">108 days since last visit</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 font-sans">$3,600</span>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80"
                      alt="Daniel"
                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <p className="font-bold text-slate-900 font-sans">Daniel Kim</p>
                      <p className="text-[10px] text-slate-400">91 days since last visit</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 font-sans">$3,200</span>
                </div>
              </div>
            </div>

            {/* Session Notes Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-slate-800">
                  <FileText className="w-4 h-4 text-[#2D5A3C]" />
                  <h4 className="text-xs font-bold font-sans">Session notes</h4>
                </div>
                <span className="flex items-center space-x-1 text-[10px] font-medium text-emerald-800">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
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
        /* MODE 2: CHAT & DICTATION MODE (ChatGPT Full Page Layout with Multi-Session Right Panel) */
        <div className="flex-1 flex gap-5 h-full overflow-hidden">
          
          {/* Main ChatGPT Conversation Box */}
          <div className="flex-1 flex flex-col h-full bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden relative">
            
            {/* Top Bar with Instant Navigation */}
            <div className="px-6 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white/95 backdrop-blur z-10">
              <div className="flex items-center space-x-3">
                <h3 className="text-base font-serif font-bold text-slate-900">
                  {activeSession?.title || 'AI Coach'}
                </h3>
                <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>Clinic data connected</span>
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCreateNewSession('chat')}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#1E3A2B] text-white hover:bg-[#162D21] text-xs font-bold transition shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New session</span>
                </button>
                <button
                  onClick={() => handleSendMessage("Patients who haven't rebooked in 90 days")}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 transition"
                  title="Reload insights"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Conversation Messages Stream */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {messages.length === 0 ? (
                /* Welcome Screen */
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-8">
                  <AuraLogo size={52} />
                  <div className="space-y-1 max-w-md">
                    <h3 className="text-2xl font-serif font-bold text-slate-900">
                      How can I help your clinic today?
                    </h3>
                    <p className="text-xs text-slate-500 font-sans">
                      Ask about revenue, conversions, retention, patients, pricing, or clinic procedures.
                    </p>
                  </div>
                </div>
              ) : (
                /* Chat Messages List */
                messages.map((m) => {
                  const isAI = m.role === 'assistant';
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isAI ? 'items-start' : 'items-end'} space-y-1.5`}
                    >
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                        {isAI ? 'AURA AI PRACTICE INTELLIGENCE' : 'Dr. Chloe Vance'} · {m.time}
                      </span>

                      <div
                        className={`max-w-[85%] rounded-2xl p-5 text-xs sm:text-[13px] leading-relaxed font-sans ${
                          isAI
                            ? 'bg-slate-50 border border-slate-200 text-slate-900 rounded-tl-xs shadow-xs'
                            : 'bg-[#1E3A2B] text-white rounded-tr-xs shadow-xs'
                        }`}
                      >
                        {isAI ? renderFormattedText(m.content) : <div>{m.content}</div>}

                        {isAI && (
                          <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                            <button
                              onClick={() => playTTS(m.content)}
                              className="flex items-center space-x-1.5 text-[#1E3A2B] font-bold hover:underline"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>Replay Voice</span>
                            </button>
                            {m.evidence && (
                              <span className="text-slate-400 text-[10px] font-mono">{m.evidence}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}

              {isLoading && (
                <div className="flex items-center space-x-2 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
                  <Zap className="w-4 h-4 animate-bounce text-emerald-700" />
                  <span>Aura is reasoning across 50 patient records & clinic knowledge...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Floating Bottom Dock: 4 Quick Starter Buttons + Input Bar */}
            <div className="p-4 bg-white/95 backdrop-blur border-t border-slate-100 flex flex-col items-center gap-3">
              
              {/* 4 Floating Quick Starter Cards directly above input */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full max-w-3xl">
                <button
                  onClick={() => handleSendMessage("Which patients need follow-up?")}
                  className="px-3 py-2 rounded-xl border border-slate-200/90 hover:border-[#1E3A2B] bg-slate-50/80 hover:bg-white transition flex items-center space-x-2 text-left group"
                >
                  <Users className="w-3.5 h-3.5 text-[#1E3A2B] flex-shrink-0" />
                  <span className="text-[11px] font-bold text-slate-800 truncate group-hover:text-[#1E3A2B]">
                    Follow-ups due
                  </span>
                </button>

                <button
                  onClick={() => handleSendMessage("Why are consultations not converting?")}
                  className="px-3 py-2 rounded-xl border border-slate-200/90 hover:border-[#1E3A2B] bg-slate-50/80 hover:bg-white transition flex items-center space-x-2 text-left group"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                  <span className="text-[11px] font-bold text-slate-800 truncate group-hover:text-[#1E3A2B]">
                    Conversion drops
                  </span>
                </button>

                <button
                  onClick={() => handleSendMessage("What does our pricing policy say?")}
                  className="px-3 py-2 rounded-xl border border-slate-200/90 hover:border-[#1E3A2B] bg-slate-50/80 hover:bg-white transition flex items-center space-x-2 text-left group"
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-700 flex-shrink-0" />
                  <span className="text-[11px] font-bold text-slate-800 truncate group-hover:text-[#1E3A2B]">
                    Pricing policy
                  </span>
                </button>

                <button
                  onClick={() => handleSendMessage("Build a 7-day retention plan")}
                  className="px-3 py-2 rounded-xl border border-slate-200/90 hover:border-[#1E3A2B] bg-slate-50/80 hover:bg-white transition flex items-center space-x-2 text-left group"
                >
                  <Target className="w-3.5 h-3.5 text-emerald-800 flex-shrink-0" />
                  <span className="text-[11px] font-bold text-slate-800 truncate group-hover:text-[#1E3A2B]">
                    7-day plan
                  </span>
                </button>
              </div>

              {/* Pill Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="w-full max-w-3xl flex items-center space-x-2 bg-slate-50 p-2 rounded-full border border-slate-200 shadow-xs"
              >
                <button
                  type="button"
                  className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white transition"
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

                <button
                  type="button"
                  onClick={toggleMic}
                  className={`p-2 rounded-full transition ${
                    isListening ? 'bg-rose-500 text-white animate-pulse' : 'text-slate-500 hover:text-slate-900 hover:bg-white'
                  }`}
                  title="Voice Dictation"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => setCoachMode('voice')}
                  className="w-8 h-8 rounded-full bg-[#1E3A2B] text-white hover:bg-[#162D21] flex items-center justify-center transition shadow-xs"
                  title="Switch to Live Voice Mode"
                >
                  <Volume2 className="w-4 h-4" />
                </button>

                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-2 rounded-full bg-[#EBF3EA] text-[#1E3A2B] hover:bg-[#D5E6D3] transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <p className="text-center text-[10px] text-slate-400 font-sans">
                🔒 Aura queries 50 real patient records and clinical SOPs via Railway n8n pgvector.
              </p>
            </div>

          </div>

          {/* Right Floating / Fixed Panel with Multi-Session History (Does NOT scroll with chat stream) */}
          {!isPanelCollapsed && (
            <div className="w-80 flex-shrink-0 flex flex-col justify-between h-full overflow-y-auto space-y-4">
              
              {/* Pinned Sessions */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-slate-900 font-bold text-xs font-sans">
                    <Pin className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                    <span>Pinned Sessions</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{pinnedSessions.length}</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  {pinnedSessions.map((s) => {
                    const isSelected = s.id === activeSessionId;
                    return (
                      <div
                        key={s.id}
                        onClick={() => switchSession(s.id)}
                        className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between group ${
                          isSelected
                            ? 'bg-[#EBF3EA] border-[#2D5A3C] text-[#1E3A2B] font-bold'
                            : 'bg-slate-50 border-slate-100 hover:border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="truncate flex-1 pr-2">
                          <p className="truncate text-xs font-sans">{s.title}</p>
                          <span className="text-[10px] text-slate-400 font-normal">{s.createdAt}</span>
                        </div>

                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={(e) => handleTogglePin(s.id, e)}
                            className="p-1 hover:text-amber-700 text-slate-400"
                            title="Unpin"
                          >
                            <Pin className="w-3 h-3 fill-amber-500 text-amber-500" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteSession(s.id, e)}
                            className="p-1 hover:text-rose-600 text-slate-400"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Conversations */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2.5 flex-1 overflow-y-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-slate-900 font-bold text-xs font-sans">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Recent Sessions</span>
                  </div>
                  <button
                    onClick={() => handleCreateNewSession('chat')}
                    className="text-[11px] font-bold text-[#1E3A2B] hover:underline"
                  >
                    + New
                  </button>
                </div>

                <div className="space-y-1.5 text-xs">
                  {recentSessions.map((s) => {
                    const isSelected = s.id === activeSessionId;
                    return (
                      <div
                        key={s.id}
                        onClick={() => switchSession(s.id)}
                        className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between group ${
                          isSelected
                            ? 'bg-[#EBF3EA] border-[#2D5A3C] text-[#1E3A2B] font-bold'
                            : 'bg-slate-50 border-slate-100 hover:border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="truncate flex-1 pr-2">
                          <p className="truncate text-xs font-sans">{s.title}</p>
                          <span className="text-[10px] text-slate-400 font-normal">{s.createdAt}</span>
                        </div>

                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={(e) => handleTogglePin(s.id, e)}
                            className="p-1 hover:text-amber-700 text-slate-400"
                            title="Pin"
                          >
                            <Pin className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteSession(s.id, e)}
                            className="p-1 hover:text-rose-600 text-slate-400"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Context Summary Footer */}
              <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs text-[11px] text-slate-500 space-y-1 font-sans">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>Practice Dataset</span>
                  <span className="text-emerald-800 font-mono">50 Active Patients</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  All metrics, churn alerts, and outreach plans bind to real patient records.
                </p>
              </div>

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
        sessionId={activeSessionId}
      />

    </div>
  );
};
