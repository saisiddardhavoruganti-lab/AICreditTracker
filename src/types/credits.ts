export type ToolCategory = 'text' | 'image' | 'video' | 'audio' | 'code' | 'multimodal' | 'search';

export interface AiTool {
  id: string;
  name: string;
  provider: string;
  model: string;
  category: ToolCategory;
  tier: string;
  availableCredits: number;
  totalCredits: number;
  unit: string;
  unitDescription: string; // Plain language translation for non-tech users
  resetsInDays: number;
  resetDate: string;
  monthlyCost: number;
  autoRenew: boolean;
  status: 'optimal' | 'moderate' | 'abundant' | 'low' | 'critical';
  accentColor: 'emerald' | 'blue' | 'amber' | 'rose' | 'teal';
  notes?: string;
  isUniversal?: boolean;
}

export interface BurnActivity {
  id: string;
  title: string;
  toolId: string;
  toolName: string;
  category: ToolCategory;
  timestamp: string;
  timeAgo: string;
  amountDelta: number;
  unit: string;
  universalDelta: number;
  detail: string;
  type: 'burn' | 'refill';
}

export interface WeeklyDayStat {
  day: string;
  date: string;
  burnCredits: number;
  activitiesCount: number;
  dominantCategory: ToolCategory;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  type: 'warning' | 'info' | 'success';
  read: boolean;
}
