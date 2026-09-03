'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  CoachSession,
  ChatMessage,
  getActiveSessions,
  createOrGetPatientSession,
  createNewSession,
  togglePinSession,
  deleteSession,
  saveSessionMessages,
  VoiceAudioMessage,
} from '@/lib/sessionStore';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  ArrowLeft,
  Pin,
  Trash2,
  Plus,
  Play,
  Pause,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  Users,
  Calendar,
  MessageSquare,
  HelpCircle,
  FileText,
} from 'lucide-react';

interface AiCoachViewProps {
  initialMode?: "chat" | "voice";
  sessionId?: string;
  prefilledPrompt?: string;
  onNewSession?: (sessionId: string) => void;
  onOpenPatientDetail?: (patientId: string) => void;
}

export const AiCoachView: React.FC<AiCoachViewProps> = ({
  sessionId: initialSessionId = 'session-vic-1',
  initialMode = 'chat',
  prefilledPrompt = '',
  onNewSession,
  onOpenPatientDetail,
}) => {
  const [sessions, setSessions] = useState<CoachSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>(initialSessionId);
  const [activeSession, setActiveSession] = useState<CoachSession | null>(null);

  // Chat / Voice Mode
  const [mode, setMode] = useState<'chat' | 'voice'>((initialMode as 'chat' | 'voice') || 'chat');
  const [inputMessage, setInputMessage] = useState(prefilledPrompt);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [copiedNotes, setCopiedNotes] = useState(false);

  // Voice Interaction State
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [voiceElapsedSeconds, setVoiceElapsedSeconds] = useState(291); // 04:51
  const [activePlayingAudioId, setActivePlayingAudioId] = useState<string | null>(null);
  const [playbackSpeeds, setPlaybackSpeeds] = useState<Record<string, number>>({});

  const chatScrollBottomRef = useRef<HTMLDivElement>(null);
  const voiceScrollBottomRef = useRef<HTMLDivElement>(null);

  // Load Sessions from Store
  const refreshSessions = () => {
    const list = getActiveSessions();
    setSessions(list);
    const found = list.find((s) => s.id === currentSessionId) || list[0] || null;
    setActiveSession(found);
  };

  useEffect(() => {
    refreshSessions();
  }, [currentSessionId]);

  // Handle URL prefilled prompt or sessionId change
  useEffect(() => {
    if (initialSessionId) {
      setCurrentSessionId(initialSessionId);
    }
  }, [initialSessionId]);

  // Auto-Trigger AI response if current session ended with an unanswered user message
  useEffect(() => {
    if (activeSession && activeSession.messages && activeSession.messages.length > 0) {
      const lastMsg = activeSession.messages[activeSession.messages.length - 1];
      if (lastMsg.role === 'user' && !isAiResponding) {
        // Trigger automated AI answer
        triggerAiAnswer(lastMsg.content, activeSession);
      }
    }
  }, [activeSession?.id]);

  // Voice Timer
  useEffect(() => {
    let timer: any;
    if (mode === 'voice') {
      timer = setInterval(() => {
        setVoiceElapsedSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [mode]);

  // Auto-scroll chat and voice containers
  useEffect(() => {
    chatScrollBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    voiceScrollBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, activeSession?.voiceAudioMessages, isAiResponding]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Generate Grounded AI Response
  const triggerAiAnswer = async (userPrompt: string, session: CoachSession) => {
    setIsAiResponding(true);

    // Simulate grounded clinical RAG context response
    setTimeout(() => {
      let aiText = '';

      if (userPrompt.toLowerCase().includes('denzel') || userPrompt.toLowerCase().includes('cust-047')) {
        aiText = `**Denzel Washington-Price** invested **$1,300** in Botox (Bro-tox Glabella) with Dr. Julian Reed on June 22, 2026. Because **72 days** have elapsed without a scheduled touch-up, he is entering the optimal re-engagement window before facial muscle movement fully returns.

### Personalized Retention Strategy:
1. **Timing & Channel:** Send a concise, high-touch SMS/Email from Dr. Reed's clinical coordinator:
   > *"Hi Denzel, Dr. Reed's office at Aura Clinic checking in. It has been 10 weeks since your Glabella smoothing treatment. To maintain natural, line-free relaxation, we recommend scheduling your 12-week maintenance before day 90."*
2. **Value-Add Proposal:** Offer a complimentary brow symmetry check and introduce our **Executive Bro-tox Quarterly Program** ($1,100 per cycle).
3. **Immediate Action:** Front desk calls at 11:00 AM on Thursday to secure his preferred early-morning appointment.`;
      } else if (userPrompt.toLowerCase().includes('victoria') || userPrompt.toLowerCase().includes('liquid facelift')) {
        aiText = `**Victoria Kensington** is an ultra-VIP client with **$6,800** lifetime spend on a Full Face Liquid Facelift. At **64 days** post-treatment, she requires an executive white-glove approach under **SOP-RET-001**.

### Personalized Retention Strategy:
1. **Timing & Channel:** Send a personal note from Dr. Chloe Vance: *"Victoria, how is your midface contour and skin radiance feeling 2 months post-facelift?"*
2. **Value-Add Protocol:** Attach *"Extending Your Liquid Facelift Results"* SOP with invitation for a complimentary 10-minute micro-infusion review.
3. **VIP Incentive:** Private invitation to preview our fall collagen biostimulator additions.`;
      } else if (userPrompt.toLowerCase().includes('morpheus') || userPrompt.toLowerCase().includes('isabella')) {
        aiText = `**Morpheus8 3-Session Retention Protocol:**
Analysis of our 50 patient records indicates Morpheus8 clients have the steepest drop-off after session 2.

### Action Plan:
1. **Pre-booking Enforcement:** Never let a Morpheus8 patient leave without locking in session 3 within 4–6 weeks.
2. **Recovery Check:** Send Day-3 post-RF soothing balm guide.
3. **Collagen Milestone Scan:** At 90 days, conduct a 3D skin analysis showing dermal density gains to secure their maintenance package.`;
      } else {
        aiText = `Based on Aura Clinic's **50 active patient records** and **VIP Retention SOP (SOP-RET-001)**:

### Strategic Recommendation:
1. **At-Risk Patient Prioritization:** Focus immediate concierge outreach on our **19 patients** currently due for follow-ups ($18,400 at-risk value).
2. **Channel Strategy:** Use Dr. Vance's verified outcome assessment template for neurotoxin clients past 10 weeks.
3. **Target:** Achieve a **65% rebooking rate** by securing 5 rebooking confirmations this week.`;
      }

      const newAssistantMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        role: 'assistant',
        content: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const updatedMsgs = [...session.messages, newAssistantMsg];
      
      // Update voice audio message if in voice mode
      const newVoiceAudio: VoiceAudioMessage = {
        id: `voice-ai-${Date.now()}`,
        role: 'assistant',
        audioUrl: '/audio/ai-response.mp3',
        durationText: '0:38',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        transcript: aiText.replace(/\*\*/g, '').slice(0, 160) + '...',
      };

      const updatedVoiceMsgs = [...(session.voiceAudioMessages || []), newVoiceAudio];

      const updatedNotes = [
        ...(session.notes || []),
        `AI Coach (${newAssistantMsg.timestamp}): ${aiText.slice(0, 140).replace(/\*\*/g, '')}...`,
      ];

      saveSessionMessages(session.id, updatedMsgs, updatedVoiceMsgs, updatedNotes);
      refreshSessions();
      setIsAiResponding(false);

      // Play audio TTS if speaker is on
      if (mode === 'voice' && isSpeakerOn && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const cleanSpeech = aiText.replace(/[*#>`]/g, '');
        const utter = new SpeechSynthesisUtterance(cleanSpeech.slice(0, 200));
        utter.rate = 1.05;
        window.speechSynthesis.speak(utter);
      }
    }, 900);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || !activeSession || isAiResponding) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMsgs = [...activeSession.messages, userMsg];
    const updatedNotes = [
      ...(activeSession.notes || []),
      `Dr. Vance (${userMsg.timestamp}): "${text}"`,
    ];

    saveSessionMessages(activeSession.id, updatedMsgs, activeSession.voiceAudioMessages, updatedNotes);
    setInputMessage('');
    refreshSessions();

    triggerAiAnswer(text, { ...activeSession, messages: updatedMsgs });
  };

  const handleVoiceRecordToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate owner talking for 4 seconds
      setTimeout(() => {
        setIsRecording(false);
        if (!activeSession) return;

        const ownerVoiceText = "How should we reach out to our high-value clients approaching 90 days without follow-ups?";
        const newVoiceMsg: VoiceAudioMessage = {
          id: `voice-owner-${Date.now()}`,
          role: 'user',
          audioUrl: '/audio/owner-voice.mp3',
          durationText: '0:14',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          transcript: ownerVoiceText,
        };

        const updatedVoice = [...(activeSession.voiceAudioMessages || []), newVoiceMsg];
        const updatedNotes = [
          ...(activeSession.notes || []),
          `Dr. Vance (${newVoiceMsg.timestamp}): "${ownerVoiceText}"`,
        ];

        saveSessionMessages(activeSession.id, activeSession.messages, updatedVoice, updatedNotes);
        refreshSessions();

        // Trigger AI Voice Answer
        triggerAiAnswer(ownerVoiceText, activeSession);
      }, 3500);
    } else {
      setIsRecording(false);
    }
  };

  const handleCreateNewSession = () => {
    const created = createNewSession('chat', 'New Clinical Strategy Session');
    setCurrentSessionId(created.id);
    refreshSessions();
    if (onNewSession) onNewSession(created.id);
  };

  const handlePin = (id: string, e: React.MouseEvent) => {
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

  const togglePlayAudio = (audioId: string, transcript?: string) => {
    if (activePlayingAudioId === audioId) {
      setActivePlayingAudioId(null);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } else {
      setActivePlayingAudioId(audioId);
      if (transcript && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const speed = playbackSpeeds[audioId] || 1;
        const utter = new SpeechSynthesisUtterance(transcript);
        utter.rate = speed;
        utter.onend = () => setActivePlayingAudioId(null);
        window.speechSynthesis.speak(utter);
      } else {
        setTimeout(() => setActivePlayingAudioId(null), 3000);
      }
    }
  };

  const cycleSpeed = (audioId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const current = playbackSpeeds[audioId] || 1;
    const next = current === 1 ? 1.5 : current === 1.5 ? 2 : 1;
    setPlaybackSpeeds({ ...playbackSpeeds, [audioId]: next });
  };

  const handleCopyNotes = () => {
    if (!activeSession) return;
    const notesText = (activeSession.notes || []).join('\n\n');
    navigator.clipboard.writeText(notesText);
    setCopiedNotes(true);
    setTimeout(() => setCopiedNotes(false), 2000);
  };

  const pinnedSessions = sessions.filter((s) => s.pinned);
  const recentSessions = sessions.filter((s) => !s.pinned);

  const quickStarters = [
    { label: 'Follow-ups due', query: 'Which patients are due for follow-ups this week and what is their recommended outreach protocol?' },
    { label: 'Conversion drops', query: 'Why is Morpheus8 package conversion lagging behind neurotoxins, and what SOP solves this?' },
    { label: 'Pricing policy', query: 'What is our 2026 pricing schedule for full face liquid facelifts and dermal filler bundles?' },
    { label: '7-day plan', query: 'Generate our 7-day high-priority VIP retention and churn prevention action plan.' },
  ];

  return (
    <div className="flex h-[calc(100vh-2.5rem)] w-full gap-5 overflow-hidden select-none">
      
      {/* LEFT & CENTER: CHAT OR VOICE WORKSPACE */}
      <div className="flex-1 flex flex-col bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden relative">
        
        {/* Sticky Header */}
        <div className="px-6 py-3.5 bg-white/95 backdrop-blur border-b border-slate-100 flex items-center justify-between z-20 flex-shrink-0 sticky top-0">
          <div className="flex items-center space-x-3">
            {mode === 'voice' ? (
              <button
                onClick={() => setMode('chat')}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Switch to Chat</span>
              </button>
            ) : null}

            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-slate-900 font-sans tracking-tight">
                  {activeSession?.title || 'Clinical Retention Strategy Session'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span>Clinic data connected</span>
                </span>
              </div>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center space-x-2">
            {mode === 'voice' ? (
              <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-mono font-bold border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Live {formatTimer(voiceElapsedSeconds)}</span>
              </div>
            ) : null}

            <button
              onClick={handleCreateNewSession}
              className="flex items-center space-x-1 px-3.5 py-1.5 rounded-xl bg-[#1E3A2B] hover:bg-[#162D21] text-white text-xs font-bold transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New session</span>
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* MODE 1: CHAT WORKSPACE                               */}
        {/* ---------------------------------------------------- */}
        {mode === 'chat' && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden relative">
            
            {/* Scrollable Chat Message History */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeSession?.messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
                  >
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider px-1">
                      {isUser ? `Dr. Chloe Vance · ${msg.timestamp}` : `Aura AI Practice Intelligence · ${msg.timestamp}`}
                    </span>

                    <div
                      className={`max-w-2xl p-4 sm:p-5 rounded-2xl text-xs sm:text-[13px] leading-relaxed select-text ${
                        isUser
                          ? 'bg-[#1E3A2B] text-white rounded-br-none shadow-xs font-sans'
                          : 'bg-[#FAF9F6] text-slate-800 border border-slate-200/80 rounded-bl-none shadow-xs font-sans whitespace-pre-line'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })}

              {isAiResponding && (
                <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono italic p-3 bg-slate-50 rounded-xl w-fit">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                  <span>Aura is querying 50 patient records & Supabase pgvector...</span>
                </div>
              )}

              <div ref={chatScrollBottomRef} />
            </div>

            {/* Floating Quick Starter Cards + Input Dock */}
            <div className="p-4 bg-white/95 border-t border-slate-100 space-y-2.5 z-10">
              
              {/* Floating 4 Starter Buttons */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
                {quickStarters.map((qs, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(qs.query)}
                    className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-[#EBF3EA] border border-slate-200/80 hover:border-[#2D5A3C] text-slate-700 hover:text-[#1E3A2B] text-xs font-medium transition flex items-center space-x-1.5"
                  >
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>{qs.label}</span>
                  </button>
                ))}
              </div>

              {/* Chat Input Pill */}
              <div className="flex items-center space-x-2 bg-[#FAF9F6] border border-slate-200 rounded-2xl px-4 py-2 focus-within:border-amber-500 transition shadow-xs">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  placeholder="Ask Aura about patient retention, 90-day churn, or clinical SOPs..."
                  className="flex-1 bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
                />

                <button
                  onClick={() => setMode('voice')}
                  className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition"
                  title="Switch to Voice AI Coach"
                >
                  <Mic className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isAiResponding}
                  className="p-1.5 rounded-xl bg-[#1E3A2B] hover:bg-[#162D21] text-white disabled:opacity-40 transition shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-[10px] text-center text-slate-400 font-sans">
                🔒 Aura queries 50 real patient records and clinical SOPs via Railway n8n pgvector.
              </p>
            </div>

          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* MODE 2: WHATSAPP-STYLE VOICE WORKSPACE               */}
        {/* ---------------------------------------------------- */}
        {mode === 'voice' && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden relative bg-[#FAF9F6]/40">
            
            {/* Top-Left Floating Pulsing Aura Ready Orb */}
            <div className="absolute top-4 left-6 z-20 flex items-center space-x-3 bg-white/90 backdrop-blur px-3 py-2 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-emerald-400 animate-ping opacity-75"></div>
                <div className="absolute inset-1 rounded-full bg-emerald-100 border border-emerald-300"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#1E3A2B] z-10"></div>
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-800 uppercase block">
                  {isRecording ? 'Listening...' : isAiResponding ? 'Aura Speaking...' : 'Aura Ready'}
                </span>
                <span className="text-[9px] text-slate-400 font-sans block">Voice AI Coach Active</span>
              </div>
            </div>

            {/* Scrollable WhatsApp-Style Voice Audio Stream */}
            <div className="flex-1 overflow-y-auto p-6 pt-18 space-y-4">
              
              {/* WhatsApp Audio Note Bubbles */}
              {(activeSession?.voiceAudioMessages || [
                {
                  id: 'default-owner-voice',
                  role: 'user',
                  durationText: '0:12',
                  timestamp: '05:25 PM',
                  transcript: 'How should we reach out to Victoria Kensington who spent $6,800 on Liquid Facelift?',
                },
                {
                  id: 'default-ai-voice',
                  role: 'assistant',
                  durationText: '0:38',
                  timestamp: '05:26 PM',
                  transcript: 'Victoria has invested $6,800. Send a personalized email from Dr. Vance followed by complimentary 10-minute touch up review.',
                },
              ]).map((audio) => {
                const isUser = audio.role === 'user';
                const isPlaying = activePlayingAudioId === audio.id;
                const speed = playbackSpeeds[audio.id] || 1;

                return (
                  <div
                    key={audio.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                  >
                    <span className="text-[10px] font-mono text-slate-400 px-2">
                      {isUser ? `Dr. Chloe Vance · ${audio.timestamp}` : `Aura Voice · ${audio.timestamp}`}
                    </span>

                    {/* WhatsApp Audio Player Capsule */}
                    <div
                      className={`flex items-center space-x-3 px-4 py-3 rounded-2xl shadow-sm border transition ${
                        isUser
                          ? 'bg-[#005C4B] text-white border-[#00473A] rounded-br-none'
                          : 'bg-[#1E3A2B] text-white border-emerald-950 rounded-bl-none'
                      }`}
                    >
                      {/* Play/Pause Button */}
                      <button
                        onClick={() => togglePlayAudio(audio.id, audio.transcript)}
                        className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
                      >
                        {isPlaying ? (
                          <Pause className="w-4 h-4 text-white fill-white" />
                        ) : (
                          <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                        )}
                      </button>

                      {/* WhatsApp Audio Waveform Representation */}
                      <div className="flex items-center space-x-0.5 h-6 w-36 sm:w-48">
                        {[40, 60, 30, 80, 50, 90, 70, 40, 100, 60, 40, 75, 50, 85, 45, 95, 30, 70, 50, 65].map((h, idx) => (
                          <div
                            key={idx}
                            style={{ height: `${h}%` }}
                            className={`w-1 rounded-full transition-all duration-200 ${
                              isPlaying ? 'bg-cyan-300 animate-pulse' : 'bg-white/60'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Speed Badge */}
                      <button
                        onClick={(e) => cycleSpeed(audio.id, e)}
                        className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-[10px] font-bold font-mono text-white/90"
                      >
                        {speed}x
                      </button>

                      {/* Duration & Timestamp */}
                      <div className="text-right">
                        <span className="text-[11px] font-mono block text-white/90">{audio.durationText}</span>
                        <span className="text-[9px] text-white/60 block">{audio.timestamp} ✓✓</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div ref={voiceScrollBottomRef} />
            </div>

            {/* Floating Sticky Voice Controls Dock at Bottom */}
            <div className="p-4 bg-white/95 backdrop-blur border-t border-slate-200/80 flex items-center justify-center space-x-6 z-20">
              
              {/* Mute Mic */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3 rounded-full border transition flex items-center justify-center ${
                  isMuted
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
                title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Central Record Button */}
              <button
                onClick={handleVoiceRecordToggle}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition shadow-lg ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-[#1E3A2B] hover:bg-[#162D21] text-white'
                }`}
                title={isRecording ? 'Stop speaking' : 'Tap to speak'}
              >
                {isRecording ? <Pause className="w-6 h-6" /> : <Mic className="w-6 h-6 text-amber-300" />}
              </button>

              {/* Switch to Chat */}
              <button
                onClick={() => setMode('chat')}
                className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
                title="Switch to chat view"
              >
                <MessageSquare className="w-5 h-5" />
              </button>

              {/* Speaker On / Off */}
              <button
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                className={`p-3 rounded-full border transition ${
                  isSpeakerOn
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-slate-100 text-slate-400 border-slate-200'
                }`}
                title={isSpeakerOn ? 'Speaker output active' : 'Speaker muted'}
              >
                {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>

            </div>

          </div>
        )}

      </div>

      {/* ---------------------------------------------------- */}
      {/* RIGHT SIDEBAR: PINNED, RECENT, OR SESSION NOTES       */}
      {/* ---------------------------------------------------- */}
      <div className="w-80 flex flex-col space-y-4 flex-shrink-0">
        
        {/* If in Voice Mode: Expanded Real-Time Session Notes */}
        {mode === 'voice' ? (
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-[#1E3A2B]" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase font-sans">
                    Session Notes & Transcript
                  </h3>
                </div>
                <span className="text-[10px] text-emerald-700 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                  Auto-saved
                </span>
              </div>

              {/* Scrollable Notes List */}
              <div className="space-y-2.5 text-xs max-h-[calc(100vh-16rem)] overflow-y-auto pr-1">
                {(activeSession?.notes || [
                  'Dr. Vance (10:02 AM): "How should we reach out to Victoria Kensington..."',
                  'AI Coach (10:03 AM): "Victoria invested $6,800. Send a personalized email from Dr. Vance followed by complimentary 10-minute review."',
                ]).map((note, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 leading-relaxed font-sans">
                    {note}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleCopyNotes}
              className="w-full mt-3 py-2 rounded-xl bg-slate-100 hover:bg-[#EBF3EA] text-slate-800 hover:text-[#1E3A2B] text-xs font-bold transition flex items-center justify-center space-x-1.5 border border-slate-200"
            >
              {copiedNotes ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedNotes ? 'Copied to Clipboard' : 'Copy Session Notes'}</span>
            </button>
          </div>
        ) : (
          /* If in Chat Mode: Pinned & Recent Sessions with Scrolling */
          <>
            {/* Pinned Sessions (Max 4 visible with scrollbar) */}
            <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-slate-800 text-xs font-bold font-sans">
                  <Pin className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                  <span>Pinned Sessions</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 font-bold">
                  {pinnedSessions.length}
                </span>
              </div>

              {/* Scrollable Pinned List */}
              <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1">
                {pinnedSessions.map((s) => {
                  const isActive = s.id === currentSessionId;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setCurrentSessionId(s.id)}
                      className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between group ${
                        isActive
                          ? 'bg-[#EBF3EA] border-[#2D5A3C] shadow-xs'
                          : 'bg-white border-slate-100 hover:bg-slate-50'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-slate-900 truncate font-sans">{s.title}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{new Date(s.updatedAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                      </div>

                      <button
                        onClick={(e) => handlePin(s.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-200 text-amber-600 transition"
                      >
                        <Pin className="w-3 h-3 fill-amber-500" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Sessions (With matching scroll height) */}
            <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs space-y-3 flex-1 flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-slate-800 text-xs font-bold font-sans">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Recent Sessions</span>
                </div>
                <button
                  onClick={handleCreateNewSession}
                  className="text-[10px] text-[#1E3A2B] font-bold hover:underline"
                >
                  + New
                </button>
              </div>

              {/* Scrollable Recent List */}
              <div className="flex-1 max-h-64 overflow-y-auto space-y-1.5 pr-1">
                {recentSessions.map((s) => {
                  const isActive = s.id === currentSessionId;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setCurrentSessionId(s.id)}
                      className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between group ${
                        isActive
                          ? 'bg-[#EBF3EA] border-[#2D5A3C] shadow-xs'
                          : 'bg-white border-slate-100 hover:bg-slate-50'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-slate-900 truncate font-sans">{s.title}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{new Date(s.updatedAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                      </div>

                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={(e) => handlePin(s.id, e)}
                          className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-amber-600"
                          title="Pin session"
                        >
                          <Pin className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(s.id, e)}
                          className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-rose-600"
                          title="Delete session"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Practice Database Metadata Pill */}
        <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Practice Dataset</span>
          <span className="font-bold text-[#1E3A2B] font-mono">50 Active Patients</span>
        </div>

      </div>

    </div>
  );
};
