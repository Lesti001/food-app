import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Platform } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useToastStore, dismissToast } from '../store/toastStore';

const VARIANTS = {
  success: { color: '#10B981', bg: '#D1FAE5' },
  error:   { color: '#EF4444', bg: '#FEE2E2' },
  info:    { color: '#7C9FE4', bg: '#DBEAFE' },
};

function CheckIcon({ color, size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}
function XIcon({ color, size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth={3} strokeLinecap="round" fill="none" />
    </Svg>
  );
}
function InfoIcon({ color, size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} fill="none" />
      <Path d="M12 11v5M12 8h.01" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    </Svg>
  );
}

const ICONS = { success: CheckIcon, error: XIcon, info: InfoIcon };

export function Toast() {
  const current = useToastStore((s) => s.toast);
  const translateY = useRef(new Animated.Value(-150)).current;
  const progress = useRef(new Animated.Value(1)).current;
  const closeTimerRef = useRef(null);

  useEffect(() => {
    if (!current) return;

    translateY.setValue(-150);
    progress.setValue(1);

    Animated.timing(translateY, { toValue: 0, duration: 280, useNativeDriver: true }).start();
    Animated.timing(progress, {
      toValue: 0,
      duration: current.duration,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) close();
    });

    return () => clearTimeout(closeTimerRef.current);
  }, [current?.id]);

  function close() {
    Animated.timing(translateY, { toValue: -150, duration: 200, useNativeDriver: true })
      .start(() => dismissToast());
  }

  if (!current) return null;

  const variant = VARIANTS[current.type] ?? VARIANTS.info;
  const Icon = ICONS[current.type] ?? InfoIcon;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        transform: [{ translateY }],
        zIndex: 999,
        elevation: 999,
      }}
    >
      <View style={{ paddingTop: Platform.OS === 'ios' ? 56 : 36, paddingHorizontal: 16 }} pointerEvents="box-none">
        <View
          className="bg-surface rounded-2xl border border-border overflow-hidden"
          style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.18, shadowRadius: 16, elevation: 12 }}
        >
          {/* Shrinking progress bar */}
          <View style={{ height: 3, backgroundColor: '#E2E8F0' }}>
            <Animated.View
              style={{
                height: 3,
                backgroundColor: variant.color,
                width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
              }}
            />
          </View>

          <TouchableOpacity activeOpacity={0.85} onPress={close} className="flex-row items-center px-4 py-3.5">
            <View
              className="w-8 h-8 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: variant.bg }}
            >
              <Icon color={variant.color} />
            </View>
            <Text className="text-ink text-sm font-semibold flex-1" numberOfLines={2}>
              {current.message}
            </Text>
            {current.actionLabel && (
              <TouchableOpacity
                onPress={() => { current.onAction?.(); close(); }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={{ marginLeft: 10 }}
              >
                <Text className="text-primary text-sm font-bold">{current.actionLabel}</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}
