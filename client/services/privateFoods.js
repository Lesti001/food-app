// Custom foods the user adds by hand. Stored locally on the device only —
// no account, no server. Each client keeps its own list.
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'private_foods_v1';

export async function getPrivateFoods() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Kept for backwards compatibility with any caller expecting a "fetch".
export async function fetchPrivateFoods() {
  return getPrivateFoods();
}

export async function createPrivateFood(payload) {
  const foods = await getPrivateFoods();
  const food = {
    id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    source: 'custom',
    name: payload.name,
    brand: payload.brand,
    per100g: {
      calories: payload.calories ?? 0,
      protein: payload.protein ?? 0,
      carbs: payload.carbs ?? 0,
      fat: payload.fat ?? 0,
    },
  };
  foods.unshift(food);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(foods));
  return food;
}

export async function deletePrivateFood(id) {
  const foods = await getPrivateFoods();
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(foods.filter((f) => f.id !== id)));
}
