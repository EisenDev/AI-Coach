export interface PatientRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  treatment: string;
  provider: string;
  status: 'Rebooked' | 'Follow-up due' | 'Needs Follow-up' | 'Consultation pending';
  amount_spent: number;
  last_visit: string;
  rebooked: boolean;
  satisfaction_score: number;
  daysSinceLastVisit?: number;
  notes?: string;
  // Hardened Clinical & CRM Fields
  medical_history?: string;
  preferred_contact?: 'Email' | 'SMS' | 'Phone' | 'WhatsApp';
  vip_tier?: 'Diamond VIP' | 'Platinum' | 'Gold' | 'Standard';
  retention_risk_level?: 'High' | 'Moderate' | 'Low' | 'On-Track';
  conversion_status?: 'Converted' | 'Consultation Pending' | 'Follow-up Due' | 'Completed';
  next_recommended_treatment?: string;
  allergies?: string;
}

export interface KnowledgeDoc {
  id: string;
  title: string;
  category: 'Retention' | 'Pricing' | 'Treatment' | 'Sales' | 'Operations' | 'Clinical Protocol';
  type: 'PDF' | 'TXT';
  chunks: number;
  status: 'Ready' | 'Indexing' | 'Vectorized in pgvector';
  updated: string;
  description: string;
  isBuiltIn?: boolean; // Core practice SOPs cannot be deleted, but can be edited
  indexingProgress?: number;
  contentPages?: { title: string; content: string }[];
}

export interface ActionItem {
  id: string;
  priority: 'High' | 'Medium' | 'Low';
  action: string;
  owner: string;
  ownerAvatar?: string;
  dueDate: string;
  status: 'Ready' | 'Draft ready' | 'Not started' | 'Completed';
  completed: boolean;
}

export interface ActionPlan {
  id: string;
  title: string;
  status: 'Active' | 'In progress' | 'Completed';
  createdAt: string;
  category: string;
  owners: string[];
  completedCount: number;
  totalCount: number;
  summary: string;
  evidenceCount: number;
  evidenceDoc: string;
  rebookingTarget: string;
  atRiskRecovered: string;
  dueInDays: string;
  rationale: string;
  actions: ActionItem[];
}
