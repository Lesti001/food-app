import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';

function HomeIcon({ color, size = 22 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill={color} />
    </Svg>
  );
}
function LogIcon({ color, size = 22 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M17 2H7C5.9 2 5 2.9 5 4v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-5 2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM8 17v-2h8v2H8zm0-4v-2h8v2H8zm0-4V7h8v2H8z" fill={color} />
    </Svg>
  );
}
function SearchIcon({ color, size = 22 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill={color} />
    </Svg>
  );
}
function ProfileIcon({ color, size = 22 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill={color} />
    </Svg>
  );
}
const TABS = [
  { name: 'index',   label: 'Home',    Icon: HomeIcon    },
  { name: 'log',     label: 'Log',     Icon: LogIcon     },
  { name: 'search',  label: 'Search',  Icon: SearchIcon  },
  { name: 'profile', label: 'Profile', Icon: ProfileIcon },
];

export function TabBar({ state, navigation }) {
  return (
    <View className="absolute bottom-6 left-4 right-4">
      <View
        className="flex-row bg-surface rounded-full py-2.5 px-2 border border-border"
        style={{ shadowColor: '#7C9FE4', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 12 }}
      >
        {state.routes.map((route, index) => {
          const tab       = TABS.find((t) => t.name === route.name) ?? TABS[index];
          const isFocused = state.index === index;
          const color     = isFocused ? '#7C9FE4' : '#64748B';

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => {
                const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
              }}
              activeOpacity={0.7}
              className="flex-1 items-center justify-center py-1"
            >
              <View className={`items-center justify-center rounded-full px-4 py-1.5 ${isFocused ? 'bg-card' : ''}`}>
                <tab.Icon color={color} size={22} />
                <Text className={`text-xs mt-1 font-semibold ${isFocused ? 'text-primary' : 'text-muted'}`}>
                  {tab.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
