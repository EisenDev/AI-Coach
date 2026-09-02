const CHAT_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_CHAT_WEBHOOK_URL || 'https://primary-production-c0ce.up.railway.app/webhook/chat';
const INGEST_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_INGEST_WEBHOOK_URL || 'https://primary-production-c0ce.up.railway.app/webhook/ingest';
const SUMMARIZE_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_SUMMARIZE_WEBHOOK_URL || 'https://primary-production-c0ce.up.railway.app/webhook/summarize';

export interface ChatRequest {
  message: string;
  session_id: string;
  topic: string;
}

export interface ChatResponse {
  response: string;
  session_id: string;
  topic: string;
}

export interface IngestRequest {
  content: string;
  document_id?: string;
  file_name?: string;
}

export interface IngestResponse {
  success: boolean;
  message: string;
}

export interface SummarizeRequest {
  session_id: string;
}

export interface SummarizeResponse {
  summary: string;
  session_id: string;
}

export async function sendChatMessage(req: ChatRequest): Promise<ChatResponse> {
  const startTime = performance.now();
  const res = await fetch(CHAT_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Chat webhook failed (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  const duration = Math.round(performance.now() - startTime);
  console.log(`[n8n Chat] Completed in ${duration}ms`, data);
  return data;
}

export async function ingestKnowledge(req: IngestRequest): Promise<IngestResponse> {
  const res = await fetch(INGEST_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Ingest webhook failed (${res.status}): ${errorText}`);
  }

  return await res.json();
}

export async function generateSessionSummary(req: SummarizeRequest): Promise<SummarizeResponse> {
  const res = await fetch(SUMMARIZE_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Summarize webhook failed (${res.status}): ${errorText}`);
  }

  return await res.json();
}
