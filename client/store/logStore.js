import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

function recalcTotals(entries) {
  return entries.reduce(
    (acc, e) => ({
      calories: acc.calories + e.macros.calories,
      protein:  acc.protein  + e.macros.protein,
      carbs:    acc.carbs    + e.macros.carbs,
      fat:      acc.fat      + e.macros.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

export const useLogStore = create(
  persist(
    (set, get) => ({
      dailyLog: null,
      selectedDate: new Date().toISOString().split('T')[0],
      logsByDate: {},

      setDailyLog: (log) =>
        set((state) => ({
          dailyLog: log,
          logsByDate: log ? { ...state.logsByDate, [log.date]: log } : state.logsByDate,
        })),

      getCachedLog: (date) => get().logsByDate[date] ?? null,

      setSelectedDate: (date) => set({ selectedDate: date }),

      removeEntry: (id) =>
        set((state) => {
          if (!state.dailyLog) return state;
          const entries = state.dailyLog.entries.filter((e) => e.id !== id);
          const updated = { ...state.dailyLog, entries, totals: recalcTotals(entries) };
          return { dailyLog: updated, logsByDate: { ...state.logsByDate, [updated.date]: updated } };
        }),

      addEntry: (entry) =>
        set((state) => {
          if (!state.dailyLog) return state;
          const entries = [...state.dailyLog.entries, entry];
          const updated = { ...state.dailyLog, entries, totals: recalcTotals(entries) };
          return { dailyLog: updated, logsByDate: { ...state.logsByDate, [updated.date]: updated } };
        }),

      moveEntry: (id, mealType) =>
        set((state) => {
          if (!state.dailyLog) return state;
          const entries = state.dailyLog.entries.map((e) => (e.id === id ? { ...e, mealType } : e));
          const updated = { ...state.dailyLog, entries };
          return { dailyLog: updated, logsByDate: { ...state.logsByDate, [updated.date]: updated } };
        }),
    }),
    {
      name: 'log-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ logsByDate: state.logsByDate, selectedDate: state.selectedDate }),
    }
  )
);
