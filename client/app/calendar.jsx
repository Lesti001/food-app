import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { fetchCalorieSummary } from '../services/log';
import { useProfileStore } from '../store/profileStore';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function toDateString(year, month, day) {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

function buildMonthGrid(year, month) {
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // JS getDay(): 0=Sun..6=Sat. Convert to Mon-first index (0=Mon..6=Sun)
  const startOffset = (firstOfMonth.getDay() + 6) % 7;

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function getStatusColor(calories, goal) {
  if (!goal || goal <= 0 || calories === undefined || calories === null) {
    return { bg: '#F1F5F9', text: '#94A3B8' };
  }
  const diffPct = Math.abs(calories - goal) / goal;
  if (diffPct <= 0.05) return { bg: '#6EE7B7', text: '#065F46' };
  if (diffPct <= 0.15) return { bg: '#FDBA74', text: '#9A3412' };
  return { bg: '#FCA5A5', text: '#7F1D1D' };
}

export default function CalendarScreen() {
  const today = new Date();
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [summary,   setSummary]   = useState({});
  const [loading,   setLoading]   = useState(false);

  const goal = useProfileStore((s) => s.profile.dailyCalorieGoal);

  const loadMonth = useCallback(async (year, month) => {
    setLoading(true);
    const start = toDateString(year, month, 1);
    const end = toDateString(year, month, new Date(year, month + 1, 0).getDate());
    const data = await fetchCalorieSummary(start, end);
    const map = {};
    data.forEach((row) => { map[row.date] = row.calories; });
    setSummary(map);
    setLoading(false);
  }, []);

  useEffect(() => { loadMonth(viewYear, viewMonth); }, [viewYear, viewMonth, loadMonth]);

  function goPrevMonth() {
    if (viewMonth === 0) { setViewYear(viewYear - 1); setViewMonth(11); }
    else setViewMonth(viewMonth - 1);
  }

  function goNextMonth() {
    if (viewMonth === 11) { setViewYear(viewYear + 1); setViewMonth(0); }
    else setViewMonth(viewMonth + 1);
  }

  const cells = buildMonthGrid(viewYear, viewMonth);
  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const todayStr = toDateString(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <View className="flex-1 bg-bg">
      <ScrollView
        contentContainerStyle={{ paddingTop: 64, paddingHorizontal: 20, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center mb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-surface border border-border items-center justify-center mr-3"
          >
            <Text className="text-ink text-lg font-bold">‹</Text>
          </TouchableOpacity>
          <Text className="text-ink text-3xl font-black tracking-tight">Calendar</Text>
        </View>

        {/* Month navigation */}
        <View className="flex-row items-center justify-between mb-5">
          <TouchableOpacity
            onPress={goPrevMonth}
            className="w-10 h-10 rounded-full bg-surface border border-border items-center justify-center"
          >
            <Text className="text-ink text-lg font-bold">‹</Text>
          </TouchableOpacity>
          <Text className="text-ink text-lg font-bold">{monthLabel}</Text>
          <TouchableOpacity
            onPress={goNextMonth}
            className="w-10 h-10 rounded-full bg-surface border border-border items-center justify-center"
          >
            <Text className="text-ink text-lg font-bold">›</Text>
          </TouchableOpacity>
        </View>

        {/* Legend */}
        <View className="flex-row justify-center gap-4 mb-5">
          <View className="flex-row items-center gap-1.5">
            <View className="w-3 h-3 rounded-full" style={{ backgroundColor: '#6EE7B7' }} />
            <Text className="text-faint text-xs">On target</Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <View className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FDBA74' }} />
            <Text className="text-faint text-xs">Off target</Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <View className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FCA5A5' }} />
            <Text className="text-faint text-xs">Far off</Text>
          </View>
        </View>

        {/* Weekday header */}
        <View className="flex-row mb-2">
          {WEEKDAYS.map((wd) => (
            <View key={wd} className="flex-1 items-center">
              <Text className="text-faint text-xs font-bold">{wd}</Text>
            </View>
          ))}
        </View>

        {/* Grid */}
        {loading ? (
          <ActivityIndicator color="#7C9FE4" size="large" style={{ marginTop: 40 }} />
        ) : (
          <View className="flex-row flex-wrap">
            {cells.map((day, i) => {
              if (day === null) {
                return <View key={`empty-${i}`} style={{ width: `${100 / 7}%` }} className="aspect-square p-1" />;
              }
              const dateStr = toDateString(viewYear, viewMonth, day);
              const calories = summary[dateStr];
              const hasData = calories !== undefined;
              const { bg, text } = getStatusColor(calories, goal);
              const isToday = dateStr === todayStr;

              return (
                <View key={dateStr} style={{ width: `${100 / 7}%` }} className="aspect-square p-1">
                  <View
                    className="flex-1 rounded-xl items-center justify-center"
                    style={{
                      backgroundColor: bg,
                      borderWidth: isToday ? 2 : 0,
                      borderColor: '#7C9FE4',
                    }}
                  >
                    <Text className="text-sm font-bold" style={{ color: text }}>{day}</Text>
                    {hasData && (
                      <Text className="text-[9px] mt-0.5" style={{ color: text, opacity: 0.8 }}>
                        {Math.round(calories)}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {!goal && (
          <View className="bg-card rounded-2xl p-4 mt-6 border border-border">
            <Text className="text-muted text-sm text-center">
              Set a daily calorie goal in your profile to see color-coded progress.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
