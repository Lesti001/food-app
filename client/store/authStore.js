import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

export const useAuthStore = create((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
  clearAuth: () => set({ token: null, user: null, isAuthenticated: false }),
  loadToken: async () => {
    const token = await SecureStore.getItemAsync('auth_token');
    if (token) set({ token, isAuthenticated: true });
  },
}));
