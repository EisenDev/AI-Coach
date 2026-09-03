'use client';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  time?: string;
  evidence?: string;
}

export interface VoiceAudioMessage {
  id: string;
  role: 'user' | 'assistant';
  audioUrl?: string;
  durationText: string;
  timestamp: string;
  transcript?: string;
}

export interface CoachSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
  type: 'chat' | 'voice';
  patientId?: string;
  patientName?: string;
  messages: ChatMessage[];
  voiceAudioMessages?: VoiceAudioMessage[];
  notes?: string[];
  voiceDuration?: string;
  summary?: string;
}

const DEFAULT_SESSIONS: CoachSession[] = [
  {
    id: 'session-vic-1',
    title: 'Victoria Kensington — Retention Plan',
    createdAt: 'Sep 03, 2026, 10:02 AM',
    updatedAt: '2026-09-03T02:02:00.000Z',
    pinned: true,
    type: 'chat',
    patientId: 'cust-001',
    patientName: 'Victoria Kensington',
    messages: [
      {
        id: 'msg-v1',
        role: 'user',
        content: 'How should we reach out to Victoria Kensington, who spent $6800 on Full Face Liquid Facelift with Dr. Chloe Vance, MD on 2026-06-30 and hasn\'t rebooked yet? Draft a personalized retention strategy.',
        timestamp: '10:02 AM',
        time: '10:02 AM',
      },
      {
        id: 'msg-v2',
        role: 'assistant',
        content: `Victoria is exactly the kind of high-value patient we want to nurture. She invested $6,800 in a premium procedure with Dr. Vance, which signals trust in your clinical expertise and willingness to prioritize self-care.

**Personalized Retention Strategy:**

1. **Timing & Channel:** It has been roughly 3 months since her procedure. Send a personalized email from Dr. Vance's office with the subject: *"Victoria, how is your skin feeling 3 months post-treatment?"* Include a brief, warm note from Dr. Vance asking about her results and satisfaction.

2. **Value-Add Education:** Include a short, elegant PDF link to *"Extending Your Liquid Facelift Results"* focusing on maintenance treatments (touch-up neurotoxins, skin boosters) and home-care recommendations.

3. **Soft Rebooking Invitation:** Close with a low-pressure invitation: *"We'd love to see you for a complimentary 10-minute follow-up consultation with Dr. Vance to assess your results and discuss a personalized maintenance plan."*

**Your Next Steps:**
- **Today:** Draft and send the email (personalized with her procedure date).
- **Within 48 hours:** Have your front desk call her with a friendly, non-salesy voicemail if no response.
- **This week:** Track her response. If she books the consult, prepare a tailored maintenance plan ($2,000–$3,500 annually).`,
        timestamp: '10:03 AM',
        time: '10:03 AM',
        evidence: 'Checked 50 patient records · VIP Retention SOP · 2.4s',
      },
    ],
    voiceAudioMessages: [
      {
        id: 'va-1',
        role: 'user',
        durationText: '0:14',
        timestamp: '10:02 AM',
        transcript: 'How should we reach out to Victoria Kensington who spent $6,800 on Liquid Facelift?',
      },
      {
        id: 'va-2',
        role: 'assistant',
        durationText: '0:38',
        timestamp: '10:03 AM',
        transcript: 'Victoria has invested $6,800. Send a personalized email from Dr. Vance followed by complimentary 10-minute touch up review.',
      },
    ],
    notes: [
      'Dr. Vance (10:02 AM): "How should we reach out to Victoria Kensington who spent $6800 on Liquid Facelift?"',
      'AI Coach (10:03 AM): "Victoria invested $6,800. Send a personalized email from Dr. Vance followed by complimentary 10-minute review."',
      'Action: Front desk to call Thursday morning if no email response within 48 hours.',
    ],
  },
  {
    id: 'session-voice-1',
    title: '90-Day VIP Churn Voice Coaching',
    createdAt: 'Sep 03, 2026, 09:48 AM',
    updatedAt: '2026-09-03T01:48:00.000Z',
    pinned: true,
    type: 'voice',
    voiceDuration: '04:49',
    summary: 'Identified 3 high-value patients (Victoria Kensington, Isabella Cruz, Daniel Kim) representing $13,600 in at-risk LTV. Recommended personalized outreach cadences.',
    messages: [
      {
        id: 'msg-vc1',
        role: 'user',
        content: 'Which high-value patients have not returned in the last 90 days?',
        timestamp: '09:48 AM',
      },
      {
        id: 'msg-vc2',
        role: 'assistant',
        content: 'I found three high-value patients who should be contacted this week: Victoria Kensington ($6,800), Isabella Cruz ($3,600), and Daniel Kim ($3,200). Together, they represent $13,600 in lifetime value.',
        timestamp: '09:49 AM',
      },
    ],
    voiceAudioMessages: [
      {
        id: 'va-v1',
        role: 'user',
        durationText: '0:09',
        timestamp: '09:48 AM',
        transcript: 'Which high-value patients have not returned in the last 90 days?',
      },
      {
        id: 'va-v2',
        role: 'assistant',
        durationText: '0:26',
        timestamp: '09:49 AM',
        transcript: 'Found 3 high-value patients: Victoria Kensington ($6,800), Isabella Cruz ($3,600), and Daniel Kim ($3,200).',
      },
    ],
    notes: [
      'Dr. Vance (09:48 AM): "Which high-value patients have not returned in the last 90 days?"',
      'AI Coach (09:49 AM): "Identified Victoria Kensington, Isabella Cruz, and Daniel Kim ($13,600 at-risk LTV)."',
    ],
  },
  {
    id: 'session-consult-1',
    title: 'Improve consultation conversion rate',
    createdAt: 'Sep 02, 2026',
    updatedAt: '2026-09-02T14:30:00.000Z',
    pinned: false,
    type: 'chat',
    messages: [
      {
        id: 'msg-c1',
        role: 'user',
        content: 'Why are consultations not converting for CoolSculpting?',
        timestamp: 'Yesterday',
      },
      {
        id: 'msg-c2',
        role: 'assistant',
        content: 'Consultation drop-offs are primarily tied to price objections without visual roadmap previews. Structuring 3D imaging during consults increases closing rates by 22%.',
        timestamp: 'Yesterday',
      },
    ],
  },
  {
    id: 'session-q2-1',
    title: 'Q2 retention strategy review',
    createdAt: 'Jun 24, 2026',
    updatedAt: '2026-09-02T11:00:00.000Z',
    pinned: false,
    type: 'chat',
    messages: [],
  },
];

const SESSIONS_KEY = 'aura_clinic_coach_sessions';
let inMemorySessions: CoachSession[] = [...DEFAULT_SESSIONS];

export const getStoredSessions = (): CoachSession[] => {
  if (typeof window === 'undefined') {
    return inMemorySessions;
  }
  const raw = localStorage.getItem(SESSIONS_KEY);
  if (!raw) {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(DEFAULT_SESSIONS));
    return DEFAULT_SESSIONS;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_SESSIONS;
  }
};

export const getActiveSessions = (): CoachSession[] => getStoredSessions();

export const saveStoredSessions = (sessions: CoachSession[]): void => {
  inMemorySessions = [...sessions];
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  }
};

export const getSessionById = (sessionId: string): CoachSession | undefined => {
  const sessions = getStoredSessions();
  return sessions.find((s) => s.id === sessionId);
};

export const deleteSession = (sessionId: string): CoachSession[] => {
  const sessions = getStoredSessions().filter((s) => s.id !== sessionId);
  saveStoredSessions(sessions);
  return sessions;
};

export const createOrGetPatientSession = (
  patientId: string,
  patientName: string,
  treatment: string = 'Aesthetic Care',
  ltv: number = 2500,
  lastVisit: string = '2026-07-01'
): CoachSession => {
  const sessions = getStoredSessions();
  const existing = sessions.find((s) => s.patientId === patientId);
  if (existing) {
    return existing;
  }

  const newSession: CoachSession = {
    id: `session-patient-${patientId}`,
    title: `${patientName} — Retention Plan`,
    createdAt: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    updatedAt: new Date().toISOString(),
    pinned: true,
    type: 'chat',
    patientId,
    patientName,
    messages: [
      {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: `How should we reach out to ${patientName}, who spent $${ltv.toLocaleString()} on ${treatment} with Aura Clinic on ${lastVisit} and hasn't rebooked yet? Draft a personalized retention strategy.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ],
    voiceAudioMessages: [
      {
        id: `va-${Date.now()}`,
        role: 'user',
        durationText: '0:12',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        transcript: `How should we reach out to ${patientName} on ${treatment}?`,
      },
    ],
    notes: [
      `Dr. Vance (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}): "Initiated retention session for ${patientName} ($${ltv.toLocaleString()} spend)."`,
    ],
  };

  const updated = [newSession, ...sessions];
  saveStoredSessions(updated);
  return newSession;
};

export const createNewSession = (type: 'chat' | 'voice' = 'chat', customTitle?: string): CoachSession => {
  const sessions = getStoredSessions();
  const dateStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const newSession: CoachSession = {
    id: `session-${Date.now()}`,
    title: customTitle || `New Coaching Session (${dateStr})`,
    createdAt: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    updatedAt: new Date().toISOString(),
    pinned: false,
    type,
    messages: [],
    voiceAudioMessages: [],
    notes: [],
  };

  const updated = [newSession, ...sessions];
  saveStoredSessions(updated);
  return newSession;
};

export const togglePinSession = (sessionId: string): CoachSession[] => {
  const sessions = getStoredSessions();
  const updated = sessions.map((s) =>
    s.id === sessionId ? { ...s, pinned: !s.pinned } : s
  );
  saveStoredSessions(updated);
  return updated;
};

export const saveSessionMessages = (
  sessionId: string,
  messages: ChatMessage[],
  voiceAudioMessages?: VoiceAudioMessage[],
  notes?: string[],
  summary?: string
): void => {
  const sessions = getStoredSessions();
  const updated = sessions.map((s) => {
    if (s.id === sessionId) {
      let title = s.title;
      if (s.title.startsWith('New Coaching Session') && messages.length > 0) {
        const firstUser = messages.find((m) => m.role === 'user');
        if (firstUser) {
          title = firstUser.content.slice(0, 36) + (firstUser.content.length > 36 ? '...' : '');
        }
      }
      return {
        ...s,
        title,
        messages,
        voiceAudioMessages: voiceAudioMessages || s.voiceAudioMessages,
        notes: notes || s.notes,
        summary: summary || s.summary,
        updatedAt: new Date().toISOString(),
      };
    }
    return s;
  });
  saveStoredSessions(updated);
};

export const updateSessionMessages = saveSessionMessages;
