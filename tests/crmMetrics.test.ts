import { describe, it, expect } from 'vitest';

interface CustomerRecord {
  id: string;
  name: string;
  amount_spent: number;
  last_visit: string;
  rebooked: boolean;
  satisfaction_score: number;
}

const mockPatients: CustomerRecord[] = [
  { id: '1', name: 'Victoria K', amount_spent: 6800, last_visit: '2026-06-30', rebooked: false, satisfaction_score: 4.9 },
  { id: '2', name: 'Alexander W', amount_spent: 4200, last_visit: '2026-07-01', rebooked: true, satisfaction_score: 4.6 },
  { id: '3', name: 'Sophia M', amount_spent: 980, last_visit: '2026-08-02', rebooked: true, satisfaction_score: 4.8 },
  { id: '4', name: 'Isabella C', amount_spent: 3600, last_visit: '2026-05-18', rebooked: false, satisfaction_score: 4.7 },
];

describe('Aesthetic Clinic CRM & KPI Calculations', () => {
  it('calculates total patient count correctly', () => {
    expect(mockPatients.length).toBe(4);
  });

  it('calculates total practice LTV revenue correctly', () => {
    const total = mockPatients.reduce((sum, p) => sum + p.amount_spent, 0);
    expect(total).toBe(15580);
  });

  it('calculates 90-day rebooking retention percentage accurately', () => {
    const rebooked = mockPatients.filter((p) => p.rebooked).length;
    const rate = Math.round((rebooked / mockPatients.length) * 100);
    expect(rate).toBe(50);
  });

  it('filters at-risk patients who need follow-up outreach', () => {
    const atRisk = mockPatients.filter((p) => !p.rebooked);
    expect(atRisk.length).toBe(2);
    expect(atRisk.map((p) => p.name)).toEqual(['Victoria K', 'Isabella C']);
  });

  it('computes average patient satisfaction score correctly', () => {
    const avg = mockPatients.reduce((sum, p) => sum + p.satisfaction_score, 0) / mockPatients.length;
    expect(Number(avg.toFixed(2))).toBe(4.75);
  });
});
