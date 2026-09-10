// Food search — fully offline first, with an optional online boost.
//
// Offline sources (always available, no network):
//   1. The user's own custom foods (services/privateFoods)
//   2. The bundled food database (services/foodDatabase)
//
// Online boost (best-effort, free & open, no account/API key):
//   3. OpenFoodFacts — only queried when the user types a search term.
//      If there's no connection it simply fails silently and we fall back
//      to the local results.
import { FOOD_DATABASE } from './foodDatabase';
import { getPrivateFoods } from './privateFoods';

function filterLocal(foods, query) {
  const q = query.trim().toLowerCase();
  if (!q) return foods;
  return foods.filter(
    (f) =>
      f.name.toLowerCase().includes(q) ||
      (f.brand && f.brand.toLowerCase().includes(q))
  );
}

async function localFoods() {
  const custom = await getPrivateFoods();
  // Custom foods first so the user's own entries surface at the top.
  return [...custom, ...FOOD_DATABASE];
}

export async function browseFoods() {
  return localFoods();
}

async function searchOpenFoodFacts(query) {
  try {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=20`;
    const res = await fetch(url);
    const data = await res.json();
    return (data.products ?? [])
      .filter((p) => p.product_name && p.nutriments)
      .map((p) => ({
        id: `off-${p.id ?? p.code}`,
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
    // Offline or request failed — that's fine, we still have local results.
    return [];
  }
}

export async function searchFoods(query) {
  const local = filterLocal(await localFoods(), query);

  // No search term → just show the browsable local list, no network call.
  if (!query.trim()) return local;

  const offResults = await searchOpenFoodFacts(query);

  // De-dupe by id, keeping local (custom + database) matches first.
  const seen = new Set(local.map((f) => f.id));
  const merged = [...local];
  for (const f of offResults) {
    if (!seen.has(f.id)) {
      seen.add(f.id);
      merged.push(f);
    }
  }
  return merged;
}
