import { describe, it, expect } from 'vitest';
import { GET } from '../src/app/api/customers/route';

describe('Backend API Integration Tests (/api/customers)', () => {
  it('returns 200 OK and an array of 50 seeded clinic patient records', async () => {
    const response = await GET();
    expect(response.status).toBe(200);

    const json = await response.json();
    const data = json.customers || json.data || json;
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(50);
  });

  it('validates essential medical and CRM fields across seeded patients', async () => {
    const response = await GET();
    const json = await response.json();
    const data = json.customers || json.data || json;

    const sample = data[0]; // Victoria Kensington
    expect(sample).toHaveProperty('id');
    expect(sample).toHaveProperty('name');
    expect(sample).toHaveProperty('treatment');
    expect(sample).toHaveProperty('provider');
    expect(sample).toHaveProperty('amount_spent');
    expect(sample).toHaveProperty('last_visit');
    expect(sample).toHaveProperty('rebooked');
    expect(sample).toHaveProperty('satisfaction_score');
    expect(sample).toHaveProperty('daysSinceLastVisit');

    expect(typeof sample.amount_spent).toBe('number');
    expect(sample.amount_spent).toBeGreaterThan(0);
    expect(sample.satisfaction_score).toBeGreaterThanOrEqual(1.0);
    expect(sample.satisfaction_score).toBeLessThanOrEqual(5.0);
  });

  it('verifies provider caseload distribution across clinical team', async () => {
    const response = await GET();
    const json = await response.json();
    const data = json.customers || json.data || json;

    const providers = new Set(data.map((p: any) => p.provider));
    expect(providers.has('Dr. Chloe Vance')).toBe(true);
    expect(providers.has('Dr. Julian Reed')).toBe(true);
    expect(providers.has('Sarah Lin')).toBe(true);
    expect(providers.has('Marcus Sterling')).toBe(true);
    expect(providers.has('Elena Rostova')).toBe(true);
  });
});
