import { create } from 'zustand';
import { MOCK_PROFILE } from '../services/mockData';

export const useProfileStore = create((set) => ({
  profile: MOCK_PROFILE,
  setProfile: (profile) => set({ profile }),
  updateProfile: (data) => set((s) => ({ profile: { ...s.profile, ...data } })),
}));
