import { describe, it, expect } from 'vitest';

function chunkDocumentText(text: string, chunkSize = 500, overlap = 50) {
  const chunks: { chunk_index: number; content: string }[] = [];
  let index = 0;
  for (let i = 0; i < text.length; i += (chunkSize - overlap)) {
    const chunk = text.substring(i, i + chunkSize).trim();
    if (chunk.length > 10) {
      chunks.push({
        chunk_index: index++,
        content: chunk,
      });
    }
  }
  return chunks;
}

describe('RAG Knowledge Ingestion Chunking Logic', () => {
  it('chunks a standard clinic SOP document with overlap correctly', () => {
    const sampleProtocol = `Client Retention Protocols for Aesthetic Clinics: Best practice requires scheduling a follow-up 6 to 8 weeks after any neurotoxin or dermal filler procedure. Clinics implementing automated 14-day check-in SMS messages experience a 38% higher rebooking rate. Inactive patients past 90 days should receive concierge phone outreach from clinical staff.`;
    
    const chunks = chunkDocumentText(sampleProtocol, 200, 30);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks[0].chunk_index).toBe(0);
    expect(chunks[0].content).toContain('Client Retention Protocols');
  });

  it('handles short text without generating empty chunks', () => {
    const shortText = 'HydraFacial 3-step protocol.';
    const chunks = chunkDocumentText(shortText);
    expect(chunks.length).toBe(1);
    expect(chunks[0].content).toBe(shortText);
  });
});
