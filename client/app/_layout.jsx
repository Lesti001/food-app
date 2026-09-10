import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toast } from '../components/Toast';
import '../global.css';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 0, staleTime: 30000 } },
});

export default function RootLayout() {
  return (
    <GestureHandlerRootView className="flex-1">
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F5F3FF' } }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="calendar" />
          <Stack.Screen name="privacy-policy" />
        </Stack>
        <Toast />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
