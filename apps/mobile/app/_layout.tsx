import '../global.css';

import { StatusBar } from 'react-native';
import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TRPCProvider } from '@/utils/TRPCProvider';
import { useEffect, useState } from 'react';
import { Appearance } from 'react-native';

export default function RootLayout() {
  const [theme, setTheme] = useState(Appearance.getColorScheme());

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <TRPCProvider>
        <StatusBar
          barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={theme === 'dark' ? '#000000' : '#ffffff'}
        />
        <div className={theme === 'dark' ? 'dark' : ''}> {/* Apply dark class */}
          <Slot />
        </div>
      </TRPCProvider>
    </SafeAreaProvider>
  );
}
