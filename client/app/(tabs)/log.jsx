import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, PanResponder } from 'react-native';
import { router } from 'expo-router';
import { useLogStore } from '../../store/logStore';
import { LogEntryCard } from '../../components/LogEntryCard';
import { deleteLogEntry, updateLogEntry } from '../../services/log';

const MEALS = [
  { key: 'breakfast', label: 'Breakfast', abbr: 'B', color: '#FDE68A', textColor: '#92400E' },
  { key: 'lunch',     label: 'Lunch',     abbr: 'L', color: '#A5F3D0', textColor: '#065F46' },
  { key: 'dinner',    label: 'Dinner',    abbr: 'D', color: '#C4B5FD', textColor: '#4C1D95' },
  { key: 'snacks',    label: 'Snacks',    abbr: 'S', color: '#FCA5A5', textColor: '#7F1D1D' },
];

export default function LogScreen() {
  const { dailyLog, removeEntry, moveEntry } = useLogStore();
  const entries = dailyLog?.entries ?? [];
  const totals  = dailyLog?.totals  ?? { calories: 0, protein: 0, carbs: 0, fat: 0 };

  const rootRef        = useRef(null);
  const rootOffset      = useRef(0);
  const sectionRefs      = useRef({});
  const sectionBounds   = useRef({});
  const dragY            = useRef(new Animated.Value(0)).current;
  const panResponderCache = useRef({});
  const draggingEntryRef = useRef(null);
  const hoverMealRef     = useRef(null);

  const [draggingEntry, setDraggingEntry] = useState(null);
  const [hoverMeal,     setHoverMeal]     = useState(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  async function handleDelete(id) {
    removeEntry(id);
    await deleteLogEntry(id);
  }

  function measureSections() {
    rootRef.current?.measure((x, y, width, height, pageX, pageY) => {
      rootOffset.current = pageY;
      MEALS.forEach((meal) => {
        const ref = sectionRefs.current[meal.key];
        ref?.measure?.((x2, y2, w2, h2, px2, py2) => {
          sectionBounds.current[meal.key] = { top: py2 - pageY, bottom: py2 - pageY + h2 };
        });
      });
    });
  }

  function getPanResponder(entry) {
    const cacheKey = `${entry.id}:${entry.mealType}`;
    if (panResponderCache.current[cacheKey]) return panResponderCache.current[cacheKey];

    const responder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 6 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderGrant: (evt) => {
        draggingEntryRef.current = entry;
        hoverMealRef.current = null;
        setDraggingEntry(entry);
        setScrollEnabled(false);
        dragY.setValue(evt.nativeEvent.pageY - rootOffset.current);
        measureSections();
      },
      onPanResponderMove: (evt) => {
        const localY = evt.nativeEvent.pageY - rootOffset.current;
        dragY.setValue(localY);
        const hit = Object.entries(sectionBounds.current).find(
          ([, b]) => localY >= b.top && localY <= b.bottom
        );
        const key = hit ? hit[0] : null;
        if (key !== hoverMealRef.current) {
          hoverMealRef.current = key;
          setHoverMeal(key);
        }
      },
      onPanResponderRelease: () => {
        const current = draggingEntryRef.current;
        const target = hoverMealRef.current;
        if (current && target && target !== current.mealType) {
          moveEntry(current.id, target);
          updateLogEntry(current.id, target);
        }
        draggingEntryRef.current = null;
        hoverMealRef.current = null;
        setDraggingEntry(null);
        setHoverMeal(null);
        setScrollEnabled(true);
      },
      onPanResponderTerminate: () => {
        draggingEntryRef.current = null;
        hoverMealRef.current = null;
        setDraggingEntry(null);
        setHoverMeal(null);
        setScrollEnabled(true);
      },
    });

    panResponderCache.current[cacheKey] = responder;
    return responder;
  }

  return (
    <View className="flex-1 bg-bg" ref={rootRef} collapsable={false}>
      <ScrollView
        scrollEnabled={scrollEnabled}
        contentContainerStyle={{ paddingTop: 64, paddingHorizontal: 20, paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-muted text-sm">Today</Text>
        <Text className="text-ink text-3xl font-black tracking-tight mt-0.5 mb-5">Food Log</Text>

        {/* Daily total */}
        <View className="bg-primary rounded-3xl p-5 mb-7 items-center"
          style={{ shadowColor: '#7C9FE4', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12 }}
        >
          <Text className="text-white text-3xl font-black">{Math.round(totals.calories)} kcal</Text>
          <Text className="text-white/70 text-sm mt-1">
            P {Math.round(totals.protein)}g · C {Math.round(totals.carbs)}g · F {Math.round(totals.fat)}g
          </Text>
        </View>

        {MEALS.map((meal) => {
          const mealEntries = entries.filter((e) => e.mealType === meal.key);
          const mealCal     = mealEntries.reduce((s, e) => s + e.macros.calories, 0);
          const isHovered   = draggingEntry && hoverMeal === meal.key && draggingEntry.mealType !== meal.key;

          return (
            <View
              key={meal.key}
              ref={(r) => { sectionRefs.current[meal.key] = r; }}
              collapsable={false}
              className="mb-6"
              style={isHovered ? { backgroundColor: '#EEF2FF', borderRadius: 20, padding: 8, margin: -8 } : null}
            >
              <View className="flex-row justify-between items-center mb-2.5">
                <View className="flex-row items-center gap-2.5">
                  <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: meal.color }}>
                    <Text className="text-sm font-black" style={{ color: meal.textColor }}>{meal.abbr}</Text>
                  </View>
                  <View>
                    <Text className="text-ink text-base font-bold">{meal.label}</Text>
                    {mealCal > 0 && <Text className="text-muted text-xs">{Math.round(mealCal)} kcal</Text>}
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => router.push({ pathname: '/(tabs)/search', params: { meal: meal.key } })}
                  className="bg-card rounded-xl px-3.5 py-2 border border-border"
                >
                  <Text className="text-primary text-sm font-semibold">+ Add</Text>
                </TouchableOpacity>
              </View>

              {mealEntries.length === 0 ? (
                <View className="bg-surface rounded-2xl py-4 items-center border border-dashed border-border">
                  <Text className="text-faint text-sm">No foods logged yet</Text>
                </View>
              ) : (
                mealEntries.map((e) => (
                  <LogEntryCard
                    key={e.id}
                    entry={e}
                    onDelete={handleDelete}
                    dragHandlers={getPanResponder(e).panHandlers}
                    isDragging={draggingEntry?.id === e.id}
                  />
                ))
              )}
            </View>
          );
        })}

        <Text className="text-faint text-xs text-center mt-2">
          Hold the ⠿ handle and drag a food to move it to another meal
        </Text>
      </ScrollView>

      {draggingEntry && (
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 20,
            right: 20,
            transform: [{ translateY: dragY }],
          }}
        >
          <View
            className="bg-surface rounded-2xl p-4 border-2 border-primary"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 12 }}
          >
            <Text className="text-ink text-base font-semibold">{draggingEntry.foodItem.name}</Text>
            <Text className="text-primary text-sm font-bold mt-0.5">
              {Math.round(draggingEntry.macros.calories)} kcal
            </Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
}
