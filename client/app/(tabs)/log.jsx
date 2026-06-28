import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useLogStore } from '../../store/logStore';
import { LogEntryCard } from '../../components/LogEntryCard';
import { deleteLogEntry } from '../../services/log';

const MEALS = [
  { key: 'breakfast', label: 'Breakfast', abbr: 'B', color: '#FDE68A', textColor: '#92400E' },
  { key: 'lunch',     label: 'Lunch',     abbr: 'L', color: '#A5F3D0', textColor: '#065F46' },
  { key: 'dinner',    label: 'Dinner',    abbr: 'D', color: '#C4B5FD', textColor: '#4C1D95' },
  { key: 'snacks',    label: 'Snacks',    abbr: 'S', color: '#FCA5A5', textColor: '#7F1D1D' },
];

export default function LogScreen() {
  const { dailyLog, removeEntry } = useLogStore();
  const entries = dailyLog?.entries ?? [];
  const totals  = dailyLog?.totals  ?? { calories: 0, protein: 0, carbs: 0, fat: 0 };

  async function handleDelete(id) {
    removeEntry(id);
    await deleteLogEntry(id);
  }

  return (
    <View className="flex-1 bg-bg">
      <ScrollView
        contentContainerStyle={{ paddingTop: 64, paddingHorizontal: 20, paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-muted text-sm">Today</Text>
        <Text className="text-ink text-3xl font-black tracking-tight mt-0.5 mb-5">Food Log</Text>

        {/* Daily total */}
        <View className="bg-primary rounded-3xl p-5 mb-7 items-center"
          style={{ shadowColor: '#7C9FE4', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12 }}
        >
          <Text className="text-white text-3xl font-black">{Math.round(totals.calories)} kcal</Text>
          <Text className="text-white/70 text-sm mt-1">
            P {Math.round(totals.protein)}g · C {Math.round(totals.carbs)}g · F {Math.round(totals.fat)}g
          </Text>
        </View>

        {MEALS.map((meal) => {
          const mealEntries = entries.filter((e) => e.mealType === meal.key);
          const mealCal     = mealEntries.reduce((s, e) => s + e.macros.calories, 0);
          return (
            <View key={meal.key} className="mb-6">
              <View className="flex-row justify-between items-center mb-2.5">
                <View className="flex-row items-center gap-2.5">
                  <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: meal.color }}>
                    <Text className="text-sm font-black" style={{ color: meal.textColor }}>{meal.abbr}</Text>
                  </View>
                  <View>
                    <Text className="text-ink text-base font-bold">{meal.label}</Text>
                    {mealCal > 0 && <Text className="text-muted text-xs">{Math.round(mealCal)} kcal</Text>}
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => router.push({ pathname: '/(tabs)/search', params: { meal: meal.key } })}
                  className="bg-card rounded-xl px-3.5 py-2 border border-border"
                >
                  <Text className="text-primary text-sm font-semibold">+ Add</Text>
                </TouchableOpacity>
              </View>

              {mealEntries.length === 0 ? (
                <View className="bg-surface rounded-2xl py-4 items-center border border-dashed border-border">
                  <Text className="text-faint text-sm">No foods logged yet</Text>
                </View>
              ) : (
                mealEntries.map((e) => <LogEntryCard key={e.id} entry={e} onDelete={handleDelete} />)
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
