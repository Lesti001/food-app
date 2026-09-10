import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';

const OFFSCREEN = 600;

export function SwipeSheet({ visible, onClose, children, className, style }) {
  const translateY = useRef(new Animated.Value(OFFSCREEN)).current;

  useEffect(() => {
    if (visible) {
      translateY.setValue(OFFSCREEN);
      Animated.timing(translateY, { toValue: 0, duration: 250, useNativeDriver: true }).start();
    }
  }, [visible]);

  // gesture-handler (not the core responder system) is what actually receives
  // touches inside a React Native <Modal>. runOnJS(true) keeps the callbacks on
  // the JS thread so we can drive the classic Animated.Value directly.
  const pan = Gesture.Pan()
    .runOnJS(true)
    .onUpdate((e) => {
      translateY.setValue(Math.max(0, e.translationY));
    })
    .onEnd((e) => {
      if (e.translationY > 90 || e.velocityY > 800) {
        Animated.timing(translateY, { toValue: OFFSCREEN, duration: 180, useNativeDriver: true })
          .start(() => onClose());
      } else {
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 4 }).start();
      }
    });

  return (
    // A dedicated root is required for gestures to work inside a Modal, since the
    // Modal renders outside the app-level GestureHandlerRootView.
    <GestureHandlerRootView>
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[{ transform: [{ translateY }] }, style]}
          className={className}
        >
          {/* Grabber handle */}
          <View className="items-center" style={{ paddingVertical: 8, marginBottom: 6 }}>
            <View className="w-10 h-1.5 rounded-full bg-border" />
          </View>
          {children}
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}
