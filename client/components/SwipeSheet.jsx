import React, { useEffect, useRef } from 'react';
import { View, Animated, PanResponder } from 'react-native';

const OFFSCREEN = 600;

export function SwipeSheet({ visible, onClose, children, className }) {
  const translateY = useRef(new Animated.Value(OFFSCREEN)).current;

  useEffect(() => {
    if (visible) {
      translateY.setValue(OFFSCREEN);
      Animated.timing(translateY, { toValue: 0, duration: 250, useNativeDriver: true }).start();
    }
  }, [visible]);

  const pan = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => g.dy > 6 && Math.abs(g.dx) < 20,
    onPanResponderMove: (_, g) => { if (g.dy > 0) translateY.setValue(g.dy); },
    onPanResponderRelease: (_, g) => {
      if (g.dy > 90 || g.vy > 1.5) {
        Animated.timing(translateY, { toValue: OFFSCREEN, duration: 180, useNativeDriver: true })
          .start(() => onClose());
      } else {
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 4 }).start();
      }
    },
  });

  return (
    <Animated.View style={{ transform: [{ translateY }] }} className={className}>
      <View {...pan.panHandlers} className="items-center" style={{ paddingBottom: 8 }}>
        <View className="w-10 h-1 rounded-full bg-border" />
      </View>
      {children}
    </Animated.View>
  );
}
