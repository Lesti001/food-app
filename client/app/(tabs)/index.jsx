import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, Modal, KeyboardAvoidingView, Platform, InputAccessoryView,
} from 'react-native';
import { Input } from '../../components/Input';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { CalorieRing } from '../../components/CalorieRing';
import { MacroCard } from '../../components/MacroCard';
import { useLogStore } from '../../store/logStore';
import { useProfileStore } from '../../store/profileStore';
import { fetchDailyLog, addLogEntry, deleteLogEntry } from '../../services/log';
import { toast } from '../../store/toastStore';

const QUICK_FIELDS = [
  { key: 'calories', label: 'Calories',      unit: 'kcal', color: '#7C9FE4', track: '#DBEAFE' },
  { key: 'protein',  label: 'Protein',        unit: 'g',    color: '#6EE7B7', track: '#D1FAE5' },
  { key: 'carbs',    label: 'Carbohydrates',  unit: 'g',    color: '#C4B5FD', track: '#EDE9FE' },
  { key: 'fat',      label: 'Fat',            unit: 'g',    color: '#FDE68A', track: '#FEF9C3' },
];

const INPUT_ACCESSORY_ID = 'quickAddInput';

export default function HomeScreen() {
  const { selectedDate, setDailyLog, dailyLog, addEntry, removeEntry } = useLogStore();
  const profile = useProfileStore((s) => s.profile);

  const [activeField, setActiveField] = useState(null);
  const [inputValue, setInputValue]   = useState('');
  const inputRef = useRef(null);

  const { data, isLoading } = useQuery({
    queryKey: ['dailyLog', selectedDate],
    queryFn: () => fetchDailyLog(selectedDate),
  });

  useEffect(() => { if (data) setDailyLog(data); }, [data]);

  const totals = dailyLog?.totals ?? { calories: 0, protein: 0, carbs: 0, fat: 0 };
  const today  = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  function openQuickAdd(field) {
    setActiveField(field);
    setInputValue('');
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  async function handleConfirm() {
    const amount = parseFloat(inputValue);
    const field = activeField;
    setActiveField(null);
    setInputValue('');

    if (isNaN(amount) || amount <= 0 || !field) return;

    const payload = {
      foodItem: {
        id: `manual-${Date.now()}`,
        name: 'Manual entry',
        per100g: { calories: 0, protein: 0, carbs: 0, fat: 0 },
      },
      mealType: 'snacks',
      portionGrams: 0,
      date: selectedDate,
      macros: { calories: 0, protein: 0, carbs: 0, fat: 0, [field.key]: amount },
    };

    const result = await addLogEntry(payload);
    const entry = result?.entries?.[result.entries.length - 1] ?? { id: Date.now(), ...payload };
    addEntry(entry);

    toast.success(`+${amount} ${field.unit} ${field.label} added`, {
      actionLabel: 'Undo',
      onAction: async () => {
        removeEntry(entry.id);
        await deleteLogEntry(entry.id);
      },
    });
  }

  return (
    <View className="flex-1 bg-bg">
      <ScrollView
        contentContainerStyle={{ paddingTop: 64, paddingHorizontal: 20, paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row justify-between items-center mb-8">
          <View>
            <Text className="text-muted text-sm capitalize">{today}</Text>
            <Text className="text-ink text-3xl font-black tracking-tight mt-0.5">Overview</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/search')}
            className="w-12 h-12 rounded-full bg-primary items-center justify-center"
            style={{ shadowColor: '#7C9FE4', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10 }}
            activeOpacity={0.8}
          >
            <Text className="text-white text-3xl font-light" style={{ lineHeight: 34 }}>+</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator color="#7C9FE4" size="large" style={{ marginTop: 60 }} />
        ) : (
          <>
            {/* Calorie Ring */}
            <View className="items-center mb-6">
              <CalorieRing consumed={totals.calories} goal={profile.dailyCalorieGoal} />
            </View>

            {/* Quick-add macro rows */}
            <View className="bg-surface rounded-3xl mb-8 border border-border overflow-hidden"
              style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}
            >
              {QUICK_FIELDS.map((field, i) => {
                const value  = totals[field.key] ?? 0;
                const isLast = i === QUICK_FIELDS.length - 1;
                return (
                  <View key={field.key} className={`flex-row items-center px-5 py-4 ${!isLast ? 'border-b border-border' : ''}`}>
                    <View className="w-2.5 h-2.5 rounded-full mr-3" style={{ backgroundColor: field.color }} />
                    <Text className="text-muted text-sm font-medium flex-1">{field.label}</Text>
                    <Text className="text-ink text-base font-bold mr-1">{Math.round(value)}</Text>
                    <Text className="text-faint text-xs w-8">{field.unit}</Text>
                    <TouchableOpacity
                      onPress={() => openQuickAdd(field)}
                      className="w-7 h-7 rounded-full items-center justify-center ml-2"
                      style={{ backgroundColor: field.track }}
                      activeOpacity={0.7}
                    >
                      <Text className="text-base font-bold" style={{ color: field.color, lineHeight: 20 }}>+</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>

            {/* Section label */}
            <Text className="text-faint text-xs font-bold tracking-widest mb-3 uppercase">Macros breakdown</Text>

            {/* Macro Cards */}
            <View className="flex-row mb-6">
              <MacroCard label="Protein" consumed={totals.protein} goal={profile.proteinGoal} color="#6EE7B7" trackColor="#D1FAE5" />
              <MacroCard label="Carbs"   consumed={totals.carbs}   goal={profile.carbGoal}    color="#C4B5FD" trackColor="#EDE9FE" />
              <MacroCard label="Fat"     consumed={totals.fat}     goal={profile.fatGoal}     color="#FDE68A" trackColor="#FEF9C3" />
            </View>

            {/* View log */}
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/log')}
              className="bg-surface rounded-2xl py-4 items-center border border-border"
              activeOpacity={0.8}
            >
              <Text className="text-muted text-sm font-medium">View today's log</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* Quick-add modal */}
      <Modal visible={!!activeField} transparent animationType="fade" statusBarTranslucent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' }}
            activeOpacity={1}
            onPress={() => setActiveField(null)}
          >
            <TouchableOpacity activeOpacity={1} onPress={() => {}}>
              <View className="bg-surface rounded-3xl px-6 pt-5 pb-10 mx-4 mb-8 border border-border"
                style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 24, elevation: 20 }}
              >
                <View className="w-10 h-1 rounded-full bg-border self-center mb-5" />

                {activeField && (
                  <>
                    <Text className="text-ink text-xl font-bold mb-1">
                      Add {activeField.label}
                    </Text>
                    <Text className="text-muted text-sm mb-5">
                      Enter the amount in {activeField.unit}
                    </Text>

                    {/* Input */}
                    <View
                      className="flex-row items-center rounded-2xl px-4 mb-6 border-2"
                      style={{ borderColor: activeField.color, backgroundColor: activeField.track, minHeight: 72 }}
                    >
                      <Input
                        ref={inputRef}
                        value={inputValue}
                        onChangeText={setInputValue}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor="#CBD5E1"
                        returnKeyType="done"
                        onSubmitEditing={handleConfirm}
                        inputAccessoryViewID={Platform.OS === 'ios' ? INPUT_ACCESSORY_ID : undefined}
                        className="flex-1 text-ink font-black"
                        style={{ fontSize: 40, lineHeight: 48, paddingVertical: 12 }}
                      />
                      <Text className="text-base font-semibold" style={{ color: activeField.color }}>
                        {activeField.unit}
                      </Text>
                    </View>

                    {/* iOS: empty InputAccessoryView removes the Done toolbar */}
                    {Platform.OS === 'ios' && (
                      <InputAccessoryView nativeID={INPUT_ACCESSORY_ID}>
                        <View />
                      </InputAccessoryView>
                    )}

                    {/* Buttons */}
                    <View className="flex-row gap-3">
                      <TouchableOpacity
                        onPress={() => setActiveField(null)}
                        className="flex-1 bg-card rounded-2xl py-4 items-center border border-border"
                      >
                        <Text className="text-muted text-base font-semibold">Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleConfirm}
                        className="flex-1 rounded-2xl py-4 items-center"
                        style={{ backgroundColor: activeField.color }}
                      >
                        <Text className="text-white text-base font-bold">Add</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
