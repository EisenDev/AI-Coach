import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dsjrmpyyinjcugcxsczx.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  treatment: string;
  provider: string;
  status: string;
  amount_spent: number;
  last_visit: string;
  rebooked: boolean;
  satisfaction_score: number;
  notes: string | null;
  created_at: string;
}

export interface Session {
  id: string;
  topic: string;
  summary: string | null;
  action_plan: string | null;
  created_at: string;
  ended_at: string | null;
}

export interface Message {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface KnowledgeChunk {
  id: string;
  document_id: string | null;
  content: string;
  created_at: string;
}
