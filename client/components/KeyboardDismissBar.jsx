import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, Platform, TouchableOpacity, Text, Animated, Easing } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useKeyboardBarStore } from '../store/keyboardBarStore';

/**
 * Floating "hide keyboard" button.
 *
 * Listens for the keyboard and shows a small pill while it is open; tapping it
 * calls Keyboard.dismiss(), which reliably closes the keyboard even when tapping
 * elsewhere on the screen does not (e.g. numeric keypads have no "return" key).
 *
 * Placement:
 *  - "bottom" (default): sits just above the keyboard. Used at the app root for
 *    normal screens (profile fields, the search bar, etc).
 *  - "top": pinned near the top of the screen. Used inside modals, whose bottom
 *    sheets already fill the space above the keyboard, so a bottom pill would
 *    cover the sheet's own action buttons.
 *
 * A React Native <Modal> renders in its own native window, so a root-level pill
 * cannot appear over it — each modal mounts its own instance.
 */
function KeyboardDownIcon({ color = '#fff', size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {/* keyboard outline */}
      <Path
        d="M4 4h16a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
        stroke={color}
        strokeWidth={2}
        fill="none"
        strokeLinejoin="round"
      />
      <Path
        d="M7 8h.01M11 8h2M17 8h.01M7 11.5h10"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* down chevron */}
      <Path
        d="M9 18l3 3 3-3"
        stroke={color}
        strokeWidth={2.2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function KeyboardDismissBar({ placement = 'bottom' }) {
  const [visible, setVisible] = useState(false);
  const [bottom, setBottom] = useState(0);
  const opacity = useRef(new Animated.Value(0)).current;
  const atTop = placement === 'top';
  // Modals with their own Cancel/Add buttons suppress the pill while open.
  const suppressed = useKeyboardBarStore((s) => s.suppressCount > 0);

  useEffect(() => {
    // iOS gives us the "will" events (smoother); Android only fires "did".
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      // For bottom placement on iOS, sit just above the keyboard. On Android the
      // window resizes (adjustResize) so bottom: 0 already clears the keyboard.
      setBottom(Platform.OS === 'ios' ? (e?.endCoordinates?.height ?? 0) : 0);
      setVisible(true);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 160,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 120,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }).start(() => setVisible(false));
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [opacity]);

  if (!visible || suppressed) return null;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        right: 12,
        ...(atTop
          ? { top: Platform.OS === 'ios' ? 56 : 32 }
          : { bottom: bottom + 10 }),
        opacity,
        zIndex: 1000,
        elevation: 1000,
      }}
    >
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Hide keyboard"
        activeOpacity={0.85}
        onPress={() => Keyboard.dismiss()}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        className="flex-row items-center bg-primary rounded-full px-4 py-2.5"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 10,
          elevation: 8,
        }}
      >
        <KeyboardDownIcon />
        <Text className="text-white text-sm font-bold ml-2">Done</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
