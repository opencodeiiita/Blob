import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useAuthStore } from '@/store/authStore';

export default function ProfileScreen() {
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    router.replace('/(onboarding)/getting-started');
  };

  return (
    <SafeAreaView className="flex-1 bg-purple-50 dark:bg-purple-950" edges={['bottom']}>
      <View className="flex-1 justify-between p-6">
        <View className="flex-1 items-center justify-center">
          <Text className="mb-3 text-center text-3xl font-bold text-purple-700 dark:text-purple-400">
            Profile
          </Text>
          <Text className="mb-6 text-center text-lg text-gray-700 dark:text-gray-300">
            Manage your account and settings
          </Text>
          <Text className="px-5 text-center text-sm leading-snug text-gray-600 dark:text-gray-400">
            This is a placeholder for the Profile screen.{'\n'}
            Future features will include user settings, study statistics, and account management.
          </Text>
        </View>

        <Pressable
          className="mb-5 items-center rounded-xl bg-purple-700 px-8 py-4 active:bg-purple-800"
          onPress={handleLogout}>
          <Text className="text-lg font-semibold text-white">Logout</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
