import '../global.css';

import { Slot, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import { useColorScheme as useNwColorScheme } from 'nativewind';
import { useColorScheme as useSysColorScheme } from 'react-native';
import { TRPCProvider } from '@/utils/TRPCProvider';
import { useEffect, type ReactNode } from 'react';
import Constants from 'expo-constants';

import { initDatabase } from '../src/db';
import { configureGoogleSignIn } from '@/hooks/useGoogleAuth';
import { useAuthStore } from '@/store/authStore';
import { useAuthBootstrap } from '@/hooks/useAuthBootstrap';

function AuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const { isBootstrapping } = useAuthBootstrap();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isBootstrapping) return;

    const inOnboarding = segments[0] === '(onboarding)';
    const inTabs = segments[0] === '(tabs)';

    if (isAuthenticated && !inTabs) {
      router.replace('/(tabs)/home');
    } else if (!isAuthenticated && !inOnboarding) {
      router.replace('/(onboarding)/getting-started');
    }
  }, [isAuthenticated, isBootstrapping, router, segments]);

  if (isBootstrapping) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <ActivityIndicator />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const systemScheme = useSysColorScheme();
  const { setColorScheme, colorScheme } = useNwColorScheme();

  useEffect(() => {
    if (systemScheme === 'dark' || systemScheme === 'light') {
      setColorScheme(systemScheme);
    }
  }, [setColorScheme, systemScheme]);

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
        <AuthGate>
          <Slot />
        </AuthGate>
      </TRPCProvider>
    </SafeAreaProvider>
  );
}
