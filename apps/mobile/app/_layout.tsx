import '../global.css';

import { StatusBar, useColorScheme } from 'react-native';
import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TRPCProvider } from '@/utils/TRPCProvider';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <TRPCProvider>
        <StatusBar
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={colorScheme === 'dark' ? '#000000' : '#ffffff'}
        />
        <Slot />
      </TRPCProvider>
    </SafeAreaProvider>
  );
}
