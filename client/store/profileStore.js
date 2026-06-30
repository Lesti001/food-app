import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_PROFILE } from '../services/mockData';

export const useProfileStore = create(
  persist(
    (set) => ({
      profile: MOCK_PROFILE,
      setProfile: (profile) => set({ profile }),
      updateProfile: (data) => set((s) => ({ profile: { ...s.profile, ...data } })),
    }),
    {
      name: 'profile-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
