import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../store/authStore';

export default function Index() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const authLoaded = useAuthStore((s) => s.authLoaded);

  if (!authLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-bg">
        <ActivityIndicator color="#7C9FE4" size="large" />
      </View>
    );
  }

  return <Redirect href={isAuthenticated ? '/(tabs)/' : '/(auth)/login'} />;
}
