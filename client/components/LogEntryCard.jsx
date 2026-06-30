import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';

function TrashIcon({ color = '#94A3B8', size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M9 3a1 1 0 0 0-1 1v1H4a1 1 0 1 0 0 2h1v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7h1a1 1 0 1 0 0-2h-4V4a1 1 0 0 0-1-1H9zm1 2h4v1h-4V5zM7 7h10v12H7V7zm3 2a1 1 0 0 0-1 1v6a1 1 0 1 0 2 0v-6a1 1 0 0 0-1-1zm4 0a1 1 0 0 0-1 1v6a1 1 0 1 0 2 0v-6a1 1 0 0 0-1-1z"
        fill={color}
      />
    </Svg>
  );
}

function DragHandleIcon({ color = '#CBD5E1', size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M9 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm6 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM9 13.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm6 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM9 21a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm6 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"
        fill={color}
      />
    </Svg>
  );
}

export function LogEntryCard({ entry, onDelete, dragHandlers, isDragging }) {
  return (
    <View
      className="bg-surface rounded-2xl p-4 mb-2.5 flex-row items-center border border-border"
      style={{ opacity: isDragging ? 0.3 : 1 }}
    >
      <View {...(dragHandlers ?? {})} style={{ paddingRight: 10 }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 4 }}>
        <DragHandleIcon />
      </View>

      <View className="flex-1">
        <Text className="text-ink text-base font-semibold">{entry.foodItem.name}</Text>
        <Text className="text-muted text-xs mt-0.5">{entry.portionGrams}g</Text>
      </View>

      <View className="items-end mr-3">
        <Text className="text-primary text-base font-bold">{Math.round(entry.macros.calories)} kcal</Text>
        <Text className="text-faint text-xs mt-0.5">
          P {entry.macros.protein.toFixed(0)}g · C {entry.macros.carbs.toFixed(0)}g · F {entry.macros.fat.toFixed(0)}g
        </Text>
      </View>

      <TouchableOpacity onPress={() => onDelete(entry)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <TrashIcon />
      </TouchableOpacity>
    </View>
  );
}
