import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useLogStore } from '../store/logStore';
import { useProfileStore } from '../store/profileStore';

// No auth anymore — the app is fully offline. We only wait for the persisted
// stores to hydrate from AsyncStorage before showing the tabs, so the first
// screen already has the user's saved data (and no write can race hydration).
export default function Index() {
  const logHydrated = useLogStore((s) => s._hasHydrated);
  const profileHydrated = useProfileStore((s) => s._hasHydrated);

  if (!logHydrated || !profileHydrated) {
    return (
      <View className="flex-1 items-center justify-center bg-bg">
        <ActivityIndicator color="#7C9FE4" size="large" />
      </View>
    );
  }

  return <Redirect href="/(tabs)/" />;
}
