import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

export const useAuthStore = create((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  authLoaded: false,
  setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
  clearAuth: () => set({ token: null, user: null, isAuthenticated: false }),
  loadAuth: async () => {
    const token = await SecureStore.getItemAsync('auth_token');
    const userRaw = await SecureStore.getItemAsync('auth_user');
    if (token) {
      set({ token, isAuthenticated: true, user: userRaw ? JSON.parse(userRaw) : null });
    }
    set({ authLoaded: true });
  },
}));
