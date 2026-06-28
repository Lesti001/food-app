import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useProfileStore } from '../../store/profileStore';
import { useAuthStore } from '../../store/authStore';
import { updateProfile } from '../../services/profile';
import { logout } from '../../services/auth';
import { Input } from '../../components/Input';

const ACTIVITY_OPTIONS = [
  { key: 'sedentary',   label: 'Sedentary',   multiplier: 1.2   },
  { key: 'light',       label: 'Light',        multiplier: 1.375 },
  { key: 'moderate',    label: 'Moderate',     multiplier: 1.55  },
  { key: 'active',      label: 'Active',       multiplier: 1.725 },
  { key: 'very_active', label: 'Very Active',  multiplier: 1.9   },
];

function calcTDEE(weight, height, age, multiplier) {
  return Math.round((10 * weight + 6.25 * height - 5 * age + 5) * multiplier);
}

function toFieldString(value) {
  return value === null || value === undefined ? '' : String(value);
}

function Field({ label, value, onChange, unit, placeholder }) {
  return (
    <View className="gap-1.5">
      <Text className="text-sm font-medium text-muted">{label}</Text>
      <View className="flex-row items-center bg-bg rounded-2xl px-4 border border-border">
        <Input
          value={value} onChangeText={onChange}
          keyboardType="numeric"
          placeholder={placeholder} placeholderTextColor="#CBD5E1"
          className="flex-1 text-ink font-semibold"
          style={{ paddingVertical: 13, fontSize: 16 }}
        />
        {unit && <Text className="text-faint text-sm">{unit}</Text>}
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const { profile, updateProfile: updateLocal } = useProfileStore();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const [weight,      setWeight]      = useState(toFieldString(profile.weight));
  const [height,      setHeight]      = useState(toFieldString(profile.height));
  const [age,         setAge]         = useState(toFieldString(profile.age));
  const [calorieGoal, setCalorieGoal] = useState(toFieldString(profile.dailyCalorieGoal));
  const [proteinGoal, setProteinGoal] = useState(toFieldString(profile.proteinGoal));
  const [carbGoal,    setCarbGoal]    = useState(toFieldString(profile.carbGoal));
  const [fatGoal,     setFatGoal]     = useState(toFieldString(profile.fatGoal));
  const [activity,    setActivity]    = useState(profile.activityLevel);

  // Keep the form fields in sync once the real profile arrives from the backend
  useEffect(() => {
    setWeight(toFieldString(profile.weight));
    setHeight(toFieldString(profile.height));
    setAge(toFieldString(profile.age));
    setCalorieGoal(toFieldString(profile.dailyCalorieGoal));
    setProteinGoal(toFieldString(profile.proteinGoal));
    setCarbGoal(toFieldString(profile.carbGoal));
    setFatGoal(toFieldString(profile.fatGoal));
    setActivity(profile.activityLevel);
  }, [profile]);

  const mult = ACTIVITY_OPTIONS.find((a) => a.key === activity)?.multiplier ?? 1.55;
  const tdee = calcTDEE(parseFloat(weight) || 75, parseFloat(height) || 175, parseInt(age) || 25, mult);

  async function handleSave() {
    const updates = {
      weight: parseFloat(weight), height: parseFloat(height), age: parseInt(age),
      activityLevel: activity,
      dailyCalorieGoal: parseInt(calorieGoal),
      proteinGoal: parseInt(proteinGoal), carbGoal: parseInt(carbGoal), fatGoal: parseInt(fatGoal),
    };
    updateLocal(updates);
    await updateProfile(updates);
    Alert.alert('Saved', 'Your profile has been updated.');
  }

  async function handleLogout() {
    await logout();
    clearAuth();
    router.replace('/(auth)/login');
  }

  function applyTDEE() {
    setCalorieGoal(String(tdee));
    setProteinGoal(String(Math.round((parseFloat(weight) || 75) * 2)));
    setCarbGoal(String(Math.round((tdee * 0.4) / 4)));
    setFatGoal(String(Math.round((tdee * 0.3) / 9)));
  }

  return (
    <View className="flex-1 bg-bg">
      <ScrollView
        contentContainerStyle={{ paddingTop: 64, paddingHorizontal: 20, paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-ink text-3xl font-black tracking-tight mb-6">Profile & Goals</Text>

        {/* Personal info */}
        <View className="bg-surface rounded-3xl p-5 mb-4 gap-4 border border-border">
          <Text className="text-xs font-bold text-faint tracking-widest uppercase">Personal Info</Text>
          <Field label="Age"    value={age}    onChange={setAge}    unit="yrs" placeholder="e.g. 28"  />
          <Field label="Weight" value={weight} onChange={setWeight} unit="kg"  placeholder="e.g. 75"  />
          <Field label="Height" value={height} onChange={setHeight} unit="cm"  placeholder="e.g. 178" />
          <View className="gap-1.5">
            <Text className="text-sm font-medium text-muted">Activity Level</Text>
            <View className="flex-row flex-wrap gap-2">
              {ACTIVITY_OPTIONS.map((a) => (
                <TouchableOpacity
                  key={a.key} onPress={() => setActivity(a.key)}
                  className={`px-3.5 py-2 rounded-full border ${activity === a.key ? 'bg-primary border-primary' : 'bg-bg border-border'}`}
                >
                  <Text className={`text-sm font-semibold ${activity === a.key ? 'text-white' : 'text-muted'}`}>
                    {a.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* TDEE */}
        <View className="bg-surface rounded-3xl p-5 mb-4 gap-4 border border-border">
          <View className="flex-row justify-between items-center">
            <Text className="text-xs font-bold text-faint tracking-widest uppercase">TDEE Calculator</Text>
            <TouchableOpacity onPress={applyTDEE} className="bg-primary rounded-xl px-4 py-1.5">
              <Text className="text-white text-xs font-bold">Apply</Text>
            </TouchableOpacity>
          </View>
          <View className="bg-card rounded-2xl p-4 items-center border border-border">
            <Text className="text-primary text-5xl font-black">{tdee}</Text>
            <Text className="text-muted text-sm mt-0.5">kcal / day</Text>
            <Text className="text-faint text-xs mt-1">Estimated daily calorie need</Text>
          </View>
        </View>

        {/* Goals */}
        <View className="bg-surface rounded-3xl p-5 mb-5 gap-4 border border-border">
          <Text className="text-xs font-bold text-faint tracking-widest uppercase">Daily Goals</Text>
          <Field label="Calories"      value={calorieGoal} onChange={setCalorieGoal} unit="kcal" placeholder="e.g. 2200" />
          <Field label="Protein"       value={proteinGoal} onChange={setProteinGoal} unit="g"    placeholder="e.g. 150"  />
          <Field label="Carbohydrates" value={carbGoal}    onChange={setCarbGoal}    unit="g"    placeholder="e.g. 220"  />
          <Field label="Fat"           value={fatGoal}     onChange={setFatGoal}     unit="g"    placeholder="e.g. 70"   />
        </View>

        <TouchableOpacity
          onPress={handleSave}
          className="bg-primary rounded-3xl py-5 items-center mb-3"
          style={{ shadowColor: '#7C9FE4', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 }}
        >
          <Text className="text-white text-base font-bold">Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogout}
          className="bg-surface rounded-3xl py-5 items-center border border-border mb-6"
        >
          <Text className="text-peach text-base font-semibold">Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
