import React, { useRef } from 'react';
import { View, Text, Animated, PanResponder, Alert } from 'react-native';

export function LogEntryCard({ entry, onDelete }) {
  const translateX = useRef(new Animated.Value(0)).current;

  const pan = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 8,
    onPanResponderMove: (_, g) => { if (g.dx < 0) translateX.setValue(g.dx); },
    onPanResponderRelease: (_, g) => {
      if (g.dx < -80) {
        Alert.alert('Delete', `Remove ${entry.foodItem.name}?`, [
          { text: 'Cancel', onPress: () => Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start() },
          { text: 'Delete', style: 'destructive', onPress: () => onDelete(entry.id) },
        ]);
      } else {
        Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
      }
    },
  });

  return (
    <View className="my-1">
      <View className="absolute right-0 top-0 bottom-0 w-20 bg-peach rounded-2xl items-center justify-center">
        <Text className="text-white text-xs font-bold">Delete</Text>
      </View>
      <Animated.View
        {...pan.panHandlers}
        style={{ transform: [{ translateX }] }}
        className="bg-surface rounded-2xl p-4 flex-row items-center justify-between border border-border"
      >
        <View className="flex-1">
          <Text className="text-ink text-base font-semibold">{entry.foodItem.name}</Text>
          <Text className="text-muted text-xs mt-0.5">{entry.portionGrams}g</Text>
        </View>
        <View className="items-end">
          <Text className="text-primary text-base font-bold">{Math.round(entry.macros.calories)} kcal</Text>
          <Text className="text-faint text-xs mt-0.5">
            P {entry.macros.protein.toFixed(0)}g · C {entry.macros.carbs.toFixed(0)}g · F {entry.macros.fat.toFixed(0)}g
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}
