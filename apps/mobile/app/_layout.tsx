import '../global.css';

import { Stack } from 'expo-router';
import { View, useColorScheme } from 'react-native';
import { TRPCProvider } from '@/utils/TRPCProvider';

export default function Layout() {
  const colorScheme = useColorScheme();

  return (
    <View className="flex-1 bg-white dark:bg-black" style={{ colorScheme: colorScheme ?? 'light' }}>
      <TRPCProvider>
        <Stack />
      </TRPCProvider>
    </View>
  );
}
