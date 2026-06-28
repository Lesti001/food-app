import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  ActivityIndicator, Modal, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { searchFoods } from '../../services/foodSearch';
import { addLogEntry } from '../../services/log';
import { createPrivateFood } from '../../services/privateFoods';
import { useLogStore } from '../../store/logStore';
import { Input } from '../../components/Input';
import { SwipeSheet } from '../../components/SwipeSheet';

function debounce(fn, delay) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), delay); };
}

const MEAL_LABELS = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snacks: 'Snacks' };
const MEALS = ['breakfast', 'lunch', 'dinner', 'snacks'];

export default function SearchScreen() {
  const params = useLocalSearchParams();
  const [query,    setQuery]    = useState('');
  const [results,  setResults]  = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [selected, setSelected] = useState(null);
  const [portion,  setPortion]  = useState('100');
  const [mealType, setMealType] = useState(params.meal ?? 'lunch');
  const { addEntry, selectedDate } = useLogStore();

  const [addFoodVisible, setAddFoodVisible] = useState(false);
  const [newName,     setNewName]     = useState('');
  const [newBrand,    setNewBrand]    = useState('');
  const [newCalories, setNewCalories] = useState('');
  const [newProtein,  setNewProtein]  = useState('');
  const [newCarbs,    setNewCarbs]    = useState('');
  const [newFat,      setNewFat]      = useState('');
  const [savingFood,  setSavingFood]  = useState(false);

  const doSearch = useCallback(debounce(async (q) => {
    setLoading(true);
    setResults(await searchFoods(q));
    setLoading(false);
  }, 500), []);

  // Show a default browsable list of foods before the user types anything
  useEffect(() => {
    (async () => {
      setLoading(true);
      setResults(await searchFoods(''));
      setLoading(false);
    })();
  }, []);

  async function handleAdd() {
    if (!selected) return;
    const g = parseFloat(portion) || 100;
    const r = g / 100;
    const macros = {
      calories: (selected.per100g.calories ?? 0) * r,
      protein:  (selected.per100g.protein  ?? 0) * r,
      carbs:    (selected.per100g.carbs    ?? 0) * r,
      fat:      (selected.per100g.fat      ?? 0) * r,
    };
    const payload = { foodItem: selected, mealType, portionGrams: g, date: selectedDate, macros };
    const result = await addLogEntry(payload);
    const entry = result?.entries?.[result.entries.length - 1] ?? { id: Date.now(), ...payload };
    addEntry(entry);
    setSelected(null); setQuery(''); setResults([]);
  }

  function openAddFood() {
    setNewName(''); setNewBrand('');
    setNewCalories(''); setNewProtein(''); setNewCarbs(''); setNewFat('');
    setAddFoodVisible(true);
  }

  async function handleSaveCustomFood() {
    if (!newName.trim()) return;
    setSavingFood(true);
    try {
      await createPrivateFood({
        name: newName.trim(),
        brand: newBrand.trim() || undefined,
        calories: parseFloat(newCalories) || 0,
        protein: parseFloat(newProtein) || 0,
        carbs: parseFloat(newCarbs) || 0,
        fat: parseFloat(newFat) || 0,
      });
      setAddFoodVisible(false);
      if (query.trim()) doSearch(query);
    } catch (err) {
      const message = err?.response?.data?.message ?? 'Could not save this food. Please try again.';
      Alert.alert('Something went wrong', message);
    } finally {
      setSavingFood(false);
    }
  }

  const g = parseFloat(portion) || 0;
  const r = g / 100;

  return (
    <View className="flex-1 bg-bg">
      {/* Header */}
      <View className="pt-16 px-5 pb-3">
        <Text className="text-ink text-3xl font-black tracking-tight mb-4">Search Foods</Text>

        {/* Meal chips */}
        <View className="flex-row gap-2 mb-4">
          {MEALS.map((m) => (
            <TouchableOpacity
              key={m} onPress={() => setMealType(m)}
              className={`px-3.5 py-1.5 rounded-full border ${mealType === m ? 'bg-primary border-primary' : 'bg-surface border-border'}`}
            >
              <Text className={`text-xs font-semibold ${mealType === m ? 'text-white' : 'text-muted'}`}>
                {MEAL_LABELS[m]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search bar */}
        <View className="flex-row items-center bg-surface rounded-2xl px-4 border border-border">
          <Text className="text-muted text-sm mr-2.5 font-semibold">Search</Text>
          <Input
            value={query}
            onChangeText={(t) => { setQuery(t); doSearch(t); }}
            placeholder="Search for a food..."
            placeholderTextColor="#CBD5E1"
            className="flex-1 text-ink"
            style={{ fontSize: 16, paddingVertical: 14, minHeight: 48 }}
            autoFocus
          />
          {loading && <ActivityIndicator color="#7C9FE4" size="small" />}
        </View>

        <TouchableOpacity
          onPress={openAddFood}
          className="self-start mt-3 bg-card rounded-full px-4 py-2 border border-border"
        >
          <Text className="text-primary text-xs font-semibold">+ Add my own food</Text>
        </TouchableOpacity>
      </View>

      {/* Results */}
      <FlatList
        data={results}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 130 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => { setSelected(item); setPortion('100'); }}
            className="bg-surface rounded-2xl p-4 mb-2.5 flex-row items-center justify-between border border-border"
          >
            <View className="flex-1 pr-3">
              <Text className="text-ink text-base font-semibold">{item.name}</Text>
              {item.brand && <Text className="text-muted text-xs mt-0.5">{item.brand}</Text>}
            </View>
            <View className="items-end">
              <Text className="text-primary text-xl font-bold">{Math.round(item.per100g.calories)}</Text>
              <Text className="text-faint text-xs">kcal / 100g</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !loading ? (
            <View className="items-center mt-16">
              <Text className="text-muted text-base">
                {query ? 'No results found' : 'No foods yet'}
              </Text>
              <Text className="text-faint text-sm mt-1">
                {query ? 'Try a different keyword' : 'Search or add your own food to get started'}
              </Text>
            </View>
          ) : null
        }
      />

      {/* Portion Modal */}
      <Modal visible={!!selected} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
          <View className="flex-1 justify-end bg-black/30">
            <SwipeSheet
              visible={!!selected}
              onClose={() => setSelected(null)}
              className="bg-surface rounded-t-3xl p-7 pt-4 gap-4"
            >
              {selected && (
                <>
                  <Text className="text-ink text-xl font-bold">{selected.name}</Text>
                  {selected.brand && <Text className="text-muted text-sm -mt-2">{selected.brand}</Text>}

                  <Text className="text-muted text-sm font-medium">Portion size (grams)</Text>
                  <Input
                    value={portion} onChangeText={setPortion}
                    keyboardType="numeric" selectTextOnFocus
                    className="bg-bg rounded-2xl px-4 py-3.5 text-ink font-bold border border-border"
                    style={{ fontSize: 18 }}
                  />

                  {/* Preview */}
                  <View className="bg-card rounded-2xl p-4 items-center border border-border">
                    <Text className="text-primary text-4xl font-black">
                      {Math.round((selected.per100g.calories ?? 0) * r)}
                    </Text>
                    <Text className="text-muted text-sm -mt-1 mb-3">kcal</Text>
                    <View className="flex-row justify-around w-full">
                      <View className="items-center">
                        <Text className="text-mint text-base font-bold">{((selected.per100g.protein ?? 0) * r).toFixed(1)}g</Text>
                        <Text className="text-muted text-xs">Protein</Text>
                      </View>
                      <View className="items-center">
                        <Text className="text-lavender text-base font-bold">{((selected.per100g.carbs ?? 0) * r).toFixed(1)}g</Text>
                        <Text className="text-muted text-xs">Carbs</Text>
                      </View>
                      <View className="items-center">
                        <Text className="text-amber text-base font-bold">{((selected.per100g.fat ?? 0) * r).toFixed(1)}g</Text>
                        <Text className="text-muted text-xs">Fat</Text>
                      </View>
                    </View>
                  </View>

                  <View className="flex-row gap-3">
                    <TouchableOpacity onPress={() => setSelected(null)} className="flex-1 bg-card rounded-2xl py-4 items-center border border-border">
                      <Text className="text-muted text-base font-semibold">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleAdd} className="bg-primary rounded-2xl py-4 items-center" style={{ flex: 2 }}>
                      <Text className="text-white text-base font-bold">Add to {MEAL_LABELS[mealType]}</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </SwipeSheet>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Add custom food Modal */}
      <Modal visible={addFoodVisible} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
          <View className="flex-1 justify-end bg-black/30">
            <SwipeSheet
              visible={addFoodVisible}
              onClose={() => setAddFoodVisible(false)}
              className="bg-surface rounded-t-3xl p-7 pt-4 gap-3"
            >
              <Text className="text-ink text-xl font-bold">Add my own food</Text>
              <Text className="text-muted text-sm -mt-1 mb-1">Values are per 100g</Text>

              <Text className="text-sm font-medium text-muted">Name</Text>
              <Input
                value={newName} onChangeText={setNewName}
                placeholder="e.g. Homemade granola" placeholderTextColor="#CBD5E1"
                className="bg-bg rounded-2xl px-4 py-3.5 text-ink border border-border"
                style={{ fontSize: 16 }}
              />

              <Text className="text-sm font-medium text-muted">Brand (optional)</Text>
              <Input
                value={newBrand} onChangeText={setNewBrand}
                placeholder="e.g. Homemade" placeholderTextColor="#CBD5E1"
                className="bg-bg rounded-2xl px-4 py-3.5 text-ink border border-border"
                style={{ fontSize: 16 }}
              />

              <View className="flex-row gap-3">
                <View className="flex-1 gap-1.5">
                  <Text className="text-sm font-medium text-muted">Calories</Text>
                  <Input
                    value={newCalories} onChangeText={setNewCalories}
                    keyboardType="numeric" placeholder="0" placeholderTextColor="#CBD5E1"
                    className="bg-bg rounded-2xl px-4 py-3.5 text-ink font-semibold border border-border"
                    style={{ fontSize: 16 }}
                  />
                </View>
                <View className="flex-1 gap-1.5">
                  <Text className="text-sm font-medium text-muted">Protein (g)</Text>
                  <Input
                    value={newProtein} onChangeText={setNewProtein}
                    keyboardType="numeric" placeholder="0" placeholderTextColor="#CBD5E1"
                    className="bg-bg rounded-2xl px-4 py-3.5 text-ink font-semibold border border-border"
                    style={{ fontSize: 16 }}
                  />
                </View>
              </View>

              <View className="flex-row gap-3">
                <View className="flex-1 gap-1.5">
                  <Text className="text-sm font-medium text-muted">Carbs (g)</Text>
                  <Input
                    value={newCarbs} onChangeText={setNewCarbs}
                    keyboardType="numeric" placeholder="0" placeholderTextColor="#CBD5E1"
                    className="bg-bg rounded-2xl px-4 py-3.5 text-ink font-semibold border border-border"
                    style={{ fontSize: 16 }}
                  />
                </View>
                <View className="flex-1 gap-1.5">
                  <Text className="text-sm font-medium text-muted">Fat (g)</Text>
                  <Input
                    value={newFat} onChangeText={setNewFat}
                    keyboardType="numeric" placeholder="0" placeholderTextColor="#CBD5E1"
                    className="bg-bg rounded-2xl px-4 py-3.5 text-ink font-semibold border border-border"
                    style={{ fontSize: 16 }}
                  />
                </View>
              </View>

              <View className="flex-row gap-3 mt-2">
                <TouchableOpacity
                  onPress={() => setAddFoodVisible(false)}
                  className="flex-1 bg-card rounded-2xl py-4 items-center border border-border"
                >
                  <Text className="text-muted text-base font-semibold">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSaveCustomFood}
                  disabled={!newName.trim() || savingFood}
                  className="bg-primary rounded-2xl py-4 items-center"
                  style={{ flex: 2, opacity: !newName.trim() || savingFood ? 0.6 : 1 }}
                >
                  {savingFood
                    ? <ActivityIndicator color="#fff" />
                    : <Text className="text-white text-base font-bold">Save Food</Text>
                  }
                </TouchableOpacity>
              </View>
            </SwipeSheet>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
