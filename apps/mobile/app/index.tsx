import { Redirect } from 'expo-router';

import { useAuthStore } from '@/store/authStore';

export default function Index() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/(onboarding)/getting-started" />;
}
