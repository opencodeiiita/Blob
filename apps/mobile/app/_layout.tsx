import '../global.css';

import { StatusBar, View, useColorScheme } from 'react-native';
import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TRPCProvider } from '@/utils/TRPCProvider';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <View className="flex-1 bg-white dark:bg-black" style={{ colorScheme: colorScheme ?? 'light' }}>
        <TRPCProvider>
          <StatusBar
            barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
            backgroundColor={colorScheme === 'dark' ? '#000000' : '#ffffff'}
          />
          <Slot />
        </TRPCProvider>
      </View>
    </SafeAreaProvider>
  );
}
