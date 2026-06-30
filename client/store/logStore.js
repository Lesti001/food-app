import { create } from 'zustand';

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

export const useLogStore = create((set) => ({
  dailyLog: null,
  selectedDate: new Date().toISOString().split('T')[0],
  setDailyLog: (log) => set({ dailyLog: log }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  removeEntry: (id) =>
    set((state) => {
      if (!state.dailyLog) return state;
      const entries = state.dailyLog.entries.filter((e) => e.id !== id);
      return { dailyLog: { ...state.dailyLog, entries, totals: recalcTotals(entries) } };
    }),
  addEntry: (entry) =>
    set((state) => {
      if (!state.dailyLog) return state;
      const entries = [...state.dailyLog.entries, entry];
      return { dailyLog: { ...state.dailyLog, entries, totals: recalcTotals(entries) } };
    }),
  moveEntry: (id, mealType) =>
    set((state) => {
      if (!state.dailyLog) return state;
      const entries = state.dailyLog.entries.map((e) => (e.id === id ? { ...e, mealType } : e));
      return { dailyLog: { ...state.dailyLog, entries } };
    }),
}));
