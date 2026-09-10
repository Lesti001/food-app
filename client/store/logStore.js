import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ZERO = { calories: 0, protein: 0, carbs: 0, fat: 0 };

function recalcTotals(entries) {
  return entries.reduce(
    (acc, e) => ({
      calories: acc.calories + e.macros.calories,
      protein:  acc.protein  + e.macros.protein,
      carbs:    acc.carbs    + e.macros.carbs,
      fat:      acc.fat      + e.macros.fat,
    }),
    { ...ZERO }
  );
}

function emptyDay(date) {
  return { date, entries: [], totals: { ...ZERO } };
}

function withDay(state, date, entries) {
  return {
    logsByDate: {
      ...state.logsByDate,
      [date]: { date, entries, totals: recalcTotals(entries) },
    },
  };
}

// `logsByDate` (persisted to AsyncStorage) is the single source of truth.
// Screens read the current day reactively via a selector, e.g.
//   useLogStore((s) => s.logsByDate[s.selectedDate])
// so the UI updates as soon as persisted data hydrates. We never overwrite a
// stored day with an empty one, which is what previously lost the user's data.
export const useLogStore = create(
  persist(
    (set, get) => ({
      selectedDate: new Date().toISOString().split('T')[0],
      logsByDate: {},

      // Becomes true once AsyncStorage has been read back into the store.
      _hasHydrated: false,
      setHasHydrated: (v) => set({ _hasHydrated: v }),

      setSelectedDate: (date) => set({ selectedDate: date }),

      getCachedLog: (date) => get().logsByDate[date] ?? null,
      getDay: (date) => get().logsByDate[date] ?? emptyDay(date),

      addEntry: (entry) =>
        set((state) => {
          const date = entry.date ?? state.selectedDate;
          const day = state.logsByDate[date] ?? emptyDay(date);
          return withDay(state, date, [...day.entries, entry]);
        }),

      removeEntry: (id) =>
        set((state) => {
          const date = state.selectedDate;
          const day = state.logsByDate[date];
          if (!day) return state;
          return withDay(state, date, day.entries.filter((e) => e.id !== id));
        }),

      moveEntry: (id, mealType) =>
        set((state) => {
          const date = state.selectedDate;
          const day = state.logsByDate[date];
          if (!day) return state;
          return withDay(
            state,
            date,
            day.entries.map((e) => (e.id === id ? { ...e, mealType } : e))
          );
        }),
    }),
    {
      name: 'log-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist the actual data. selectedDate is intentionally NOT persisted
      // so the app always opens on today, and _hasHydrated is runtime-only.
      partialize: (state) => ({ logsByDate: state.logsByDate }),
      onRehydrateStorage: () => (state) => { state?.setHasHydrated(true); },
    }
  )
);
