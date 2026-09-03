import { describe, it, expect } from 'vitest';
import {
  getActiveSessions,
  createOrGetPatientSession,
  createNewSession,
  togglePinSession,
  deleteSession,
  saveSessionMessages,
  CoachSession,
} from '../src/lib/sessionStore';

describe('AI Coaching Session Core User Flow & Memory Store', () => {
  it('retrieves seeded initial clinical sessions', () => {
    const sessions = getActiveSessions();
    expect(sessions.length).toBeGreaterThanOrEqual(4);

    const victoriaSession = sessions.find((s) => s.patientId === 'cust-001');
    expect(victoriaSession).toBeDefined();
    expect(victoriaSession?.title).toContain('Victoria Kensington');
    expect(victoriaSession?.messages.length).toBeGreaterThan(0);
  });

  it('creates or reuses a patient-bound coaching session idempotently', () => {
    const createdFirst = createOrGetPatientSession(
      'cust-047',
      'Denzel Washington-Price',
      '90-Day VIP Churn Recovery',
      'Draft rebooking strategy for Denzel'
    );

    expect(createdFirst.id).toBe('session-patient-cust-047');
    expect(createdFirst.patientId === 'cust-047').toBe(true);

    // Calling it again should reuse the existing session
    const retrievedAgain = createOrGetPatientSession(
      'cust-047',
      'Denzel Washington-Price',
      '90-Day VIP Churn Recovery',
      'Draft rebooking strategy for Denzel'
    );

    expect(retrievedAgain.id).toBe(createdFirst.id);
  });

  it('allows toggling pinned session status', () => {
    const initialSessions = getActiveSessions();
    const target = initialSessions[0];
    const initialPinned = target.pinned;

    togglePinSession(target.id);
    const updated = getActiveSessions().find((s) => s.id === target.id);
    expect(updated?.pinned).toBe(!initialPinned);

    // Toggle back
    togglePinSession(target.id);
    const restored = getActiveSessions().find((s) => s.id === target.id);
    expect(restored?.pinned).toBe(initialPinned);
  });

  it('appends and saves conversation messages with timestamps and RAG evidence', () => {
    const session = createNewSession('chat', 'Test Rebooking Flow');
    const newMessages = [
      { id: 'msg-1', role: 'user' as const, content: 'Why did Isabella Cruz miss session 3?', timestamp: '10:15 AM' },
      { id: 'msg-2', role: 'assistant' as const, content: 'Isabella Cruz completed 2 of 3 Morpheus8 sessions...', timestamp: '10:15 AM', evidence: 'Checked 50 records · 1.8s' },
    ];

    saveSessionMessages(session.id, newMessages);
    const saved = getActiveSessions().find((s) => s.id === session.id);
    expect(saved?.messages.length).toBe(2);
    expect(saved?.messages[1].evidence).toBe('Checked 50 records · 1.8s');
  });
});
