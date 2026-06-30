import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from '../store/authStore';
import { useProfileStore } from '../store/profileStore';
import { fetchProfile } from '../services/profile';
import { startNetworkSync } from '../services/network';
import { Toast } from '../components/Toast';
import '../global.css';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } },
});

export default function RootLayout() {
  const loadAuth = useAuthStore((s) => s.loadAuth);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setProfile = useProfileStore((s) => s.setProfile);

  useEffect(() => {
    loadAuth();
    startNetworkSync();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile().then((data) => { if (data) setProfile(data); });
    }
  }, [isAuthenticated]);

  return (
    <GestureHandlerRootView className="flex-1">
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F5F3FF' } }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="calendar" />
        </Stack>
        <Toast />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
