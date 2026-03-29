export type DealTag = 'bank' | 'credit card' | 'brokerage' | 'savings' | 'checking' | 'investment';

export type TrackingStatus = 'saved' | 'applied' | 'completed';

export interface Deal {
  id: string;
  title: string;
  payout: number;
  bank: string;
  description: string;
  tags: DealTag[];
  requirements: string[];
  deadline?: string;
  notes?: string;
}

export interface TrackedDeal {
  dealId: string;
  status: TrackingStatus;
  trackedAt: string;
}
