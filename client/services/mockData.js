export const MOCK_PROFILE = {
  id: 1,
  userId: 1,
  age: 28,
  weight: 75,
  height: 178,
  activityLevel: 'moderate',
  dailyCalorieGoal: 2200,
  proteinGoal: 165,
  carbGoal: 220,
  fatGoal: 73,
};

export const MOCK_DAILY_LOG = {
  date: new Date().toISOString().split('T')[0],
  entries: [
    {
      id: 1,
      foodItem: { id: 'mock-1', name: 'Chicken Breast', brand: 'Generic', per100g: { calories: 165, protein: 31, carbs: 0, fat: 3.6 } },
      mealType: 'lunch',
      portionGrams: 200,
      date: new Date().toISOString().split('T')[0],
      macros: { calories: 330, protein: 62, carbs: 0, fat: 7.2 },
    },
    {
      id: 2,
      foodItem: { id: 'mock-5', name: 'Scrambled Eggs', brand: 'Generic', per100g: { calories: 143, protein: 13, carbs: 0.7, fat: 10 } },
      mealType: 'breakfast',
      portionGrams: 120,
      date: new Date().toISOString().split('T')[0],
      macros: { calories: 172, protein: 15.6, carbs: 0.8, fat: 12 },
    },
    {
      id: 3,
      foodItem: { id: 'mock-2', name: 'Brown Rice', brand: 'Generic', per100g: { calories: 112, protein: 2.6, carbs: 23, fat: 0.9 } },
      mealType: 'lunch',
      portionGrams: 150,
      date: new Date().toISOString().split('T')[0],
      macros: { calories: 168, protein: 3.9, carbs: 34.5, fat: 1.35 },
    },
    {
      id: 4,
      foodItem: { id: 'mock-4', name: 'Greek Yogurt', brand: 'Chobani', per100g: { calories: 59, protein: 10, carbs: 3.6, fat: 0.4 } },
      mealType: 'snacks',
      portionGrams: 200,
      date: new Date().toISOString().split('T')[0],
      macros: { calories: 118, protein: 20, carbs: 7.2, fat: 0.8 },
    },
  ],
  totals: { calories: 788, protein: 101.5, carbs: 42.5, fat: 21.35 },
};

export const MOCK_WEEKLY_DATA = [
  { date: '2026-06-22', calories: 1980, protein: 145, carbs: 210, fat: 65 },
  { date: '2026-06-23', calories: 2150, protein: 160, carbs: 225, fat: 70 },
  { date: '2026-06-24', calories: 1870, protein: 130, carbs: 195, fat: 60 },
  { date: '2026-06-25', calories: 2300, protein: 175, carbs: 240, fat: 75 },
  { date: '2026-06-26', calories: 2050, protein: 155, carbs: 215, fat: 68 },
  { date: '2026-06-27', calories: 1920, protein: 140, carbs: 200, fat: 62 },
  { date: '2026-06-28', calories: 788,  protein: 101, carbs: 42,  fat: 21  },
];
