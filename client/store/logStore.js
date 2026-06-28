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
  // Quick-add: bumps totals and inserts a minimal log entry
  quickAdd: (field, amount) =>
    set((state) => {
      const date   = state.selectedDate;
      const macros = { calories: 0, protein: 0, carbs: 0, fat: 0, [field]: amount };
      const entry  = {
        id: Date.now(),
        foodItem: {
          id: `manual-${Date.now()}`,
          name: 'Manual entry',
          per100g: { calories: 0, protein: 0, carbs: 0, fat: 0 },
        },
        mealType: 'snacks',
        portionGrams: 0,
        date,
        macros,
      };
      const base    = state.dailyLog ?? { date, entries: [], totals: { calories: 0, protein: 0, carbs: 0, fat: 0 } };
      const entries = [...base.entries, entry];
      return { dailyLog: { ...base, entries, totals: recalcTotals(entries) } };
    }),
}));
