import '../global.css';

import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { useColorScheme as useNwColorScheme } from 'nativewind';
import { useColorScheme as useSysColorScheme } from 'react-native';
import { TRPCProvider } from '@/utils/TRPCProvider';
import { useEffect } from 'react';
import Constants from 'expo-constants';

import { initDatabase } from '../src/db';
import { configureGoogleSignIn } from '@/hooks/useGoogleAuth';

export default function RootLayout() {
  const systemScheme = useSysColorScheme();
  const { setColorScheme, colorScheme } = useNwColorScheme();

  useEffect(() => {
    if (systemScheme === 'dark' || systemScheme === 'light') {
      setColorScheme(systemScheme);
    }
  }, [systemScheme]);

  useEffect(() => {
    if (Constants.expoRuntimeVersion === undefined) {
      configureGoogleSignIn();
    }
  }, []);

  useEffect(() => {
    initDatabase()
      .then(() => console.log('SQLite initialized'))
      .catch(err => console.error('SQLite init failed', err));
  }, []);

  return (
    <SafeAreaProvider>
      <TRPCProvider>
        <StatusBar
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        />
        <Slot />
      </TRPCProvider>
    </SafeAreaProvider>
  );
}
