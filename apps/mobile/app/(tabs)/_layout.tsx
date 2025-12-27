import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Appearance } from 'react-native';

export default function TabsLayout() {
  const [theme, setTheme] = useState(Appearance.getColorScheme());

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

  return (
    <div className={theme === 'dark' ? 'dark' : ''}> {/* Apply dark class */}
      <Tabs
        screenOptions={{
          headerShown: true,
          tabBarActiveTintColor: theme === 'dark' ? '#90CAF9' : '#1976D2',
          tabBarInactiveTintColor: theme === 'dark' ? '#757575' : '#999',
          tabBarStyle: {
            backgroundColor: theme === 'dark' ? '#000000' : '#ffffff',
            borderTopWidth: 1,
            borderTopColor: theme === 'dark' ? '#424242' : '#e0e0e0',
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        }}>
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color, size }) => <Ionicons name="compass" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
          }}
        />
      </Tabs>
    </div>
  );
}
