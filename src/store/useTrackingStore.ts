import { create } from 'zustand';
import { TrackedDeal, TrackingStatus } from '../types';

interface TrackingStore {
  trackedDeals: TrackedDeal[];
  trackDeal: (dealId: string, status: TrackingStatus) => void;
  updateStatus: (dealId: string, status: TrackingStatus) => void;
  untrackDeal: (dealId: string) => void;
  getTrackedDeal: (dealId: string) => TrackedDeal | undefined;
  getDealsByStatus: (status: TrackingStatus) => TrackedDeal[];
}

export const useTrackingStore = create<TrackingStore>((set, get) => ({
  trackedDeals: [],
  trackDeal: (dealId, status) => {
    const existing = get().trackedDeals.find(d => d.dealId === dealId);
    if (existing) {
      set(state => ({
        trackedDeals: state.trackedDeals.map(d =>
          d.dealId === dealId ? { ...d, status } : d
        ),
      }));
    } else {
      set(state => ({
        trackedDeals: [
          ...state.trackedDeals,
          { dealId, status, trackedAt: new Date().toISOString() },
        ],
      }));
    }
  },
  updateStatus: (dealId, status) => {
    set(state => ({
      trackedDeals: state.trackedDeals.map(d =>
        d.dealId === dealId ? { ...d, status } : d
      ),
    }));
  },
  untrackDeal: (dealId) => {
    set(state => ({
      trackedDeals: state.trackedDeals.filter(d => d.dealId !== dealId),
    }));
  },
  getTrackedDeal: (dealId) => {
    return get().trackedDeals.find(d => d.dealId === dealId);
  },
  getDealsByStatus: (status) => {
    return get().trackedDeals.filter(d => d.status === status);
  },
}));
