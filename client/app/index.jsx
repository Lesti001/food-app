import { Redirect } from 'expo-router';

// No auth anymore — the app is fully offline, so open straight to the tabs.
export default function Index() {
  return <Redirect href="/(tabs)/" />;
}
