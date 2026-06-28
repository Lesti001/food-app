import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

export function CalorieRing({ consumed, goal }) {
  const hasGoal   = goal !== null && goal !== undefined && goal > 0;
  const SIZE      = 220;
  const STROKE    = 18;
  const R         = (SIZE - STROKE) / 2;
  const CIRC      = 2 * Math.PI * R;
  const progress  = hasGoal ? Math.min(consumed / goal, 1) : 0;
  const overLimit = hasGoal && consumed > goal;
  const dash      = CIRC * progress;
  const remaining = hasGoal ? Math.max(goal - consumed, 0) : 0;

  const gradStart = overLimit ? '#FCA5A5' : '#A5F3D0';
  const gradEnd   = overLimit ? '#F87171' : '#6EE7B7';

  return (
    <View className="items-center justify-center">
      <Svg width={SIZE} height={SIZE}>
        <Defs>
          <LinearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={gradStart} />
            <Stop offset="100%" stopColor={gradEnd} />
          </LinearGradient>
        </Defs>
        <Circle cx={SIZE/2} cy={SIZE/2} r={R} stroke="#E8E0FF" strokeWidth={STROKE} fill="none" />
        <Circle
          cx={SIZE/2} cy={SIZE/2} r={R}
          stroke="url(#g)" strokeWidth={STROKE} fill="none"
          strokeDasharray={`${dash} ${CIRC}`}
          strokeLinecap="round"
          rotation="-90" origin={`${SIZE/2}, ${SIZE/2}`}
        />
      </Svg>
      <View className="absolute items-center">
        <Text className="text-5xl font-black text-ink tracking-tight">{Math.round(consumed)}</Text>
        <Text className="text-sm text-muted -mt-1">kcal</Text>
        <View className="w-8 h-px bg-border my-2" />
        <Text className={`text-sm font-semibold ${overLimit ? 'text-peach' : 'text-mint'}`}>
          {!hasGoal ? 'No goal set' : overLimit ? `${Math.round(consumed - goal)} over` : `${remaining} left`}
        </Text>
        <Text className="text-xs text-muted mt-0.5">{hasGoal ? `/ ${goal} goal` : 'Set a goal in your profile'}</Text>
      </View>
    </View>
  );
}
