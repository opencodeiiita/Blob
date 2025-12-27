import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Appearance } from 'react-native';

export default function OnboardingLayout() {
  const [theme, setTheme] = useState(Appearance.getColorScheme());

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

  return (
    <div className={theme === 'dark' ? 'dark' : ''}> {/* Apply dark class */}
      <Stack
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: theme === 'dark' ? '#000000' : '#f5f5f5',
          },
          headerTintColor: theme === 'dark' ? '#ffffff' : '#333',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: theme === 'dark' ? '#000000' : '#ffffff',
          },
        }}>
        <Stack.Screen
          name="getting-started"
          options={{
            title: 'Welcome to Blob',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            title: 'Login',
          }}
        />
      </Stack>
    </div>
  );
}
