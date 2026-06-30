import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { login, register } from '../../services/auth';
import { Input } from '../../components/Input';
import { toast } from '../../store/toastStore';

export default function LoginScreen() {
  const [mode, setMode]         = useState('login');
  const [name, setName]         = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);

  async function handleSubmit() {
    if (!username || !password) return;
    setLoading(true);
    try {
      const result = mode === 'login'
        ? await login(username, password)
        : await register(name, username, password);
      setAuth(result.token, result.user);
      router.replace('/(tabs)/');
    } catch (err) {
      const message = err?.response?.data?.message ?? 'Something went wrong. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-bg"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 px-6 justify-center py-12">

          <View className="mb-10">
            <Text className="text-5xl font-black text-primary tracking-tight">Nutri</Text>
            <Text className="text-5xl font-black text-ink tracking-tight -mt-2">Track</Text>
            <Text className="text-base text-muted mt-2">Your daily nutrition companion</Text>
          </View>

          <View className="bg-surface rounded-3xl p-6 gap-4 shadow-sm border border-border">
            <Text className="text-2xl font-bold text-ink mb-1">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </Text>

            {mode === 'register' && (
              <View className="gap-1.5">
                <Text className="text-sm font-medium text-muted">Name</Text>
                <Input
                  value={name} onChangeText={setName}
                  placeholder="Your full name" placeholderTextColor="#CBD5E1"
                  className="bg-card rounded-2xl px-4 py-3.5 text-ink border border-border"
                  style={{ fontSize: 16 }}
                />
              </View>
            )}

            <View className="gap-1.5">
              <Text className="text-sm font-medium text-muted">Username</Text>
              <Input
                value={username} onChangeText={setUsername}
                placeholder="yourusername" placeholderTextColor="#CBD5E1"
                autoCapitalize="none"
                className="bg-card rounded-2xl px-4 py-3.5 text-ink border border-border"
                style={{ fontSize: 16 }}
              />
            </View>

            <View className="gap-1.5">
              <Text className="text-sm font-medium text-muted">Password</Text>
              <Input
                value={password} onChangeText={setPassword}
                placeholder="••••••••" placeholderTextColor="#CBD5E1"
                secureTextEntry
                className="bg-card rounded-2xl px-4 py-3.5 text-ink border border-border"
                style={{ fontSize: 16 }}
              />
            </View>

            <TouchableOpacity
              onPress={handleSubmit} disabled={loading}
              className="bg-primary rounded-2xl py-4 items-center mt-2"
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text className="text-white text-base font-bold">
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                  </Text>
              }
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="items-center py-1"
            >
              <Text className="text-muted text-sm">
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <Text className="text-primary font-semibold">
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
