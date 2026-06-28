import { apiClient } from './api';

const MOCK_FOODS = [
  { id: 'mock-1', name: 'Chicken Breast (Grilled)', brand: 'Generic', per100g: { calories: 165, protein: 31, carbs: 0, fat: 3.6 } },
  { id: 'mock-2', name: 'Brown Rice (Cooked)', brand: 'Generic', per100g: { calories: 112, protein: 2.6, carbs: 23, fat: 0.9 } },
  { id: 'mock-3', name: 'Avocado', brand: 'Generic', per100g: { calories: 160, protein: 2, carbs: 9, fat: 15 } },
  { id: 'mock-4', name: 'Greek Yogurt (Plain)', brand: 'Chobani', per100g: { calories: 59, protein: 10, carbs: 3.6, fat: 0.4 } },
  { id: 'mock-5', name: 'Whole Egg (Large)', brand: 'Generic', per100g: { calories: 143, protein: 13, carbs: 0.7, fat: 10 } },
  { id: 'mock-6', name: 'Oats (Rolled)', brand: 'Generic', per100g: { calories: 389, protein: 17, carbs: 66, fat: 7 } },
  { id: 'mock-7', name: 'Banana', brand: 'Generic', per100g: { calories: 89, protein: 1.1, carbs: 23, fat: 0.3 } },
  { id: 'mock-8', name: 'Salmon (Baked)', brand: 'Generic', per100g: { calories: 206, protein: 20, carbs: 0, fat: 13 } },
];

async function searchBackendFoods(query) {
  try {
    const res = await apiClient.get('/foods/search', { params: query ? { q: query } : {} });
    return res.data;
  } catch {
    return [];
  }
}

export async function browseFoods() {
  return searchBackendFoods('');
}

async function searchOpenFoodFacts(query) {
  try {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=20`;
    const res = await fetch(url);
    const data = await res.json();
    return (data.products ?? [])
      .filter(p => p.product_name && p.nutriments)
      .map(p => ({
        id: p.id ?? p.code,
        source: 'openfoodfacts',
        name: p.product_name,
        brand: p.brands,
        per100g: {
          calories: p.nutriments?.['energy-kcal_100g'] ?? 0,
          protein: p.nutriments?.proteins_100g ?? 0,
          carbs: p.nutriments?.carbohydrates_100g ?? 0,
          fat: p.nutriments?.fat_100g ?? 0,
        },
      }));
  } catch {
    return [];
  }
}

export async function searchFoods(query) {
  if (!query.trim()) return browseFoods();

  const [backendResults, offResults] = await Promise.all([
    searchBackendFoods(query),
    searchOpenFoodFacts(query),
  ]);

  const combined = [...backendResults, ...offResults];
  if (combined.length > 0) return combined;

  return MOCK_FOODS.filter(f => f.name.toLowerCase().includes(query.toLowerCase()));
}
