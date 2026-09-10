import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { router } from 'expo-router';

const LAST_UPDATED = 'September 10, 2026';
// TODO: set a contact address before publishing (App Store requires a contact method).
const CONTACT_EMAIL = 'REPLACE_WITH_YOUR_CONTACT_EMAIL';

function Section({ title, children }) {
  return (
    <View className="mb-5">
      <Text className="text-ink text-base font-bold mb-1.5">{title}</Text>
      <Text className="text-muted text-sm leading-5">{children}</Text>
    </View>
  );
}

export default function PrivacyPolicyScreen() {
  return (
    <View className="flex-1 bg-bg">
      <ScrollView contentContainerStyle={{ paddingTop: 64, paddingHorizontal: 20, paddingBottom: 60 }}>
        <View className="flex-row items-center mb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-surface border border-border items-center justify-center mr-3"
          >
            <Text className="text-ink text-lg font-bold">‹</Text>
          </TouchableOpacity>
          <Text className="text-ink text-2xl font-black tracking-tight">Privacy Policy</Text>
        </View>

        <Text className="text-faint text-xs mb-6">Last updated: {LAST_UPDATED}</Text>

        <Section title="Overview">
          PlateLog is a fully offline app. It has no user accounts and no servers of its own. We do not
          collect, store, transmit, or have access to any of your personal information. Everything you
          enter stays on your device.
        </Section>

        <Section title="What's stored on your device">
          Your profile details (age, height, weight, activity level), your daily calorie and macro goals,
          the foods and meals you log, and any custom foods you add are all saved locally on your device
          using its standard app storage. This information never leaves your device and is not sent to us
          or anyone else.
        </Section>

        <Section title="Food search (OpenFoodFacts)">
          When you search for a food, the words you type are sent to OpenFoodFacts (openfoodfacts.org),
          a free and open food database, so the app can show nutrition information for matching products.
          Only the search term is sent — never your profile, your logs, or any personal identifier. When
          you're offline, search still works using the app's built-in food list and your own custom
          foods, with no network request at all. OpenFoodFacts has its own privacy policy at
          world.openfoodfacts.org/privacy.
        </Section>

        <Section title="No tracking or ads">
          PlateLog contains no analytics, no advertising, and no third-party tracking. We do not build a
          profile of you and have nothing to sell.
        </Section>

        <Section title="Deleting your data">
          Because your data lives only on your device, you are always in control. You can erase everything
          at any time using “Reset all data” in the Profile tab, or by deleting the app.
        </Section>

        <Section title="Children">
          PlateLog is not directed at children under 16 and does not knowingly collect any data from
          anyone.
        </Section>

        <Section title="Changes to this policy">
          If this policy changes, the updated version will be included in a new release of the app and
          posted at our public policy page.
        </Section>

        <Section title="Contact">
          Questions about this policy? Contact:{' '}
          <Text className="text-primary" onPress={() => Linking.openURL(`mailto:${CONTACT_EMAIL}`)}>
            {CONTACT_EMAIL}
          </Text>
        </Section>
      </ScrollView>
    </View>
  );
}
