import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

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

        <Text className="text-faint text-xs mb-6">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>

        <Section title="What we collect">
          When you create an account, we collect your username and password (stored as a secure hash,
          never in plain text). You may optionally provide your age, height, weight, activity level, and
          nutrition goals. As you use the app, we store the foods, meals, and quantities you log, along
          with the dates you logged them.
        </Section>

        <Section title="Why we collect it">
          This data is used only to provide the app's core functionality: calculating your daily calorie
          and macronutrient targets, tracking your progress over time, and letting you search and save
          foods. We do not use your data for advertising, and we do not sell or rent it to third parties.
        </Section>

        <Section title="Where it's stored">
          Your data is stored in a managed PostgreSQL database hosted on Microsoft Azure. Data sent
          between the app and our server is encrypted in transit (TLS). A local copy of your recent data
          may also be cached on your device so the app keeps working without an internet connection;
          this local cache is not encrypted at rest.
        </Section>

        <Section title="Who can see it">
          Your data is private to your account. We do not share your personal information, profile
          details, or food logs with other users or third parties, except where required by law or where
          necessary to operate our hosting infrastructure (e.g. our cloud database provider).
        </Section>

        <Section title="Your rights">
          You can update or correct your profile information at any time from the Profile tab. You may
          request a copy of your data or request that your account and associated data be deleted by
          contacting us at the email address below. We aim to act on such requests within a reasonable
          time.
        </Section>

        <Section title="Data retention">
          We retain your account and logged data for as long as your account remains active. If you
          request deletion, we will remove your personal data from our active systems, except where we
          are required to retain certain records by law.
        </Section>

        <Section title="Children">
          This app is not directed at children under the age of 16, and we do not knowingly collect data
          from children under that age.
        </Section>

        <Section title="Changes to this policy">
          We may update this policy from time to time. If we make material changes, we will make
          reasonable efforts to notify you within the app.
        </Section>

        <Section title="Contact">
          If you have questions about this policy or your data, contact us at: lestak.andras1@gmail.com
        </Section>
      </ScrollView>
    </View>
  );
}
