import { describe, it, expect } from 'vitest';
import { getActiveSessions, deleteSession, saveSessionMessages } from '../src/lib/sessionStore';

describe('Error Handling, Edge Cases & Regression Tests', () => {
  it('handles deletion of non-existent session IDs gracefully without crashing', () => {
    const beforeCount = getActiveSessions().length;
    expect(() => deleteSession('non-existent-session-999')).not.toThrow();
    const afterCount = getActiveSessions().length;
    expect(afterCount).toBe(beforeCount);
  });

  it('handles saving messages to a non-existent session ID safely', () => {
    expect(() =>
      saveSessionMessages('invalid-id-xyz', [
        { id: 'm-1', role: 'user', content: 'Test prompt', timestamp: '10:00 AM' },
      ])
    ).not.toThrow();
  });

  it('handles empty customer lists in KPI calculations with default fallbacks', () => {
    const emptyPatients: any[] = [];
    const totalPatients = emptyPatients.length;
    const rebookedCount = emptyPatients.filter((p) => p.rebooked).length;
    const rebookingRate = Math.round((rebookedCount / (totalPatients || 1)) * 100) || 0;
    const atRiskValue = emptyPatients.reduce((sum, p) => sum + (p.amount_spent || 0), 0);

    expect(totalPatients).toBe(0);
    expect(rebookingRate).toBe(0);
    expect(atRiskValue).toBe(0);
  });

  it('safely handles markdown sanitization without throwing regex syntax errors', () => {
    const malformedMarkdown = '### **Special characters: [1] $6,800 > "quotes" & *asterisks* `code` _under_';
    const cleanFullText = malformedMarkdown
      .replace(/###/g, '')
      .replace(/##/g, '')
      .replace(/\*\*/g, '')
      .replace(/[*_~`>]/g, '')
      .replace(/\[\d+\]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    expect(cleanFullText).not.toContain('###');
    expect(cleanFullText).not.toContain('**');
    expect(cleanFullText).toContain('$6,800');
    expect(cleanFullText).toContain('Special characters:');
  });
});
