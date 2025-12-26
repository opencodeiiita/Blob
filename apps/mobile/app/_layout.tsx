import '../global.css';

import { StatusBar, View, useColorScheme } from 'react-native';
import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TRPCProvider } from '@/utils/TRPCProvider';

// Dark mode approach:
// - Tailwind/NativeWind is configured with `darkMode: 'class'` (see tailwind.config.js).
// - We use React Native's `useColorScheme()` hook to detect system theme changes.
// - When the system theme is dark, we add the `dark` class to the top-level View so
//   all `dark:` variants throughout the app become active automatically.
// To extend: use utility classes like `bg-white dark:bg-black` and `text-black dark:text-white` in components.
export default function RootLayout() {
  const colorScheme = useColorScheme() ?? 'light'; // auto-updates on system changes
  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaProvider>
      <TRPCProvider>
        {/* StatusBar adapts to system theme */}
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={isDark ? '#000000' : '#ffffff'}
        />

        {/* The `dark` class here enables all `dark:` variants app-wide */}
        <View className={`flex-1 ${isDark ? 'dark' : ''} bg-white dark:bg-black`}>
          <Slot />
        </View>
      </TRPCProvider>
    </SafeAreaProvider>
  );
} 
