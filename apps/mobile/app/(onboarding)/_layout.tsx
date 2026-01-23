import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="getting-started" />
      <Stack.Screen name="login" />
    </Stack>
  );
}
