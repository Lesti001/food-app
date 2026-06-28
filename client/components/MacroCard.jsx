import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

export function MacroCard({ label, consumed, goal, color, trackColor }) {
  const hasGoal = goal !== null && goal !== undefined && goal > 0;
  const SIZE  = 52;
  const STROKE = 5;
  const R     = (SIZE - STROKE) / 2;
  const CIRC  = 2 * Math.PI * R;
  const pct   = hasGoal ? Math.min(consumed / goal, 1) : 0;
  const dash  = CIRC * pct;

  return (
    <View className="flex-1 bg-surface rounded-2xl p-4 mx-1 items-center border border-border gap-2">
      <Svg width={SIZE} height={SIZE}>
        <Circle cx={SIZE/2} cy={SIZE/2} r={R} stroke={trackColor} strokeWidth={STROKE} fill="none" />
        <Circle
          cx={SIZE/2} cy={SIZE/2} r={R}
          stroke={color} strokeWidth={STROKE} fill="none"
          strokeDasharray={`${dash} ${CIRC}`}
          strokeLinecap="round"
          rotation="-90" origin={`${SIZE/2}, ${SIZE/2}`}
        />
      </Svg>
      <View className="items-center">
        <Text className="text-xs font-bold text-muted uppercase tracking-widest mb-0.5">{label}</Text>
        <Text className="text-xl font-bold text-ink">{Math.round(consumed)}<Text className="text-xs font-normal text-muted">g</Text></Text>
        <Text className="text-xs text-faint">{hasGoal ? `/ ${goal}g` : 'No goal'}</Text>
      </View>
    </View>
  );
}
