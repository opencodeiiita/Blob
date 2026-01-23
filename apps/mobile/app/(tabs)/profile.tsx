import { View, Text, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';

import { useAuthStore } from '@/store/authStore';

export default function ProfileScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    router.replace('/(onboarding)/getting-started');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top', 'bottom']}>
      <View className="flex-1 p-6">
        {/* Profile Header */}
        <View className="mb-6 items-center">
          {user?.image ? (
            <Image source={{ uri: user.image }} className="h-24 w-24 rounded-full" />
          ) : (
            <View className="h-24 w-24 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
              <Ionicons name="person" size={40} color="#9333EA" />
            </View>
          )}
          <Text className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            {user?.name || 'Guest User'}
          </Text>
          <Text className="mt-1 text-gray-500 dark:text-gray-400">
            {user?.email || 'Not signed in'}
          </Text>
        </View>

        {/* Menu Items */}
        <View className="flex-1">
          {/* AI Settings */}
          <Pressable
            onPress={handleSettings}
            className="mb-3 flex-row items-center rounded-xl bg-gray-50 p-4 active:bg-gray-100 dark:bg-gray-900 dark:active:bg-gray-800">
            <View className="mr-4 rounded-full bg-purple-100 p-2 dark:bg-purple-900/30">
              <Ionicons name="key-outline" size={20} color="#9333EA" />
            </View>
            <View className="flex-1">
              <Text className="font-medium text-gray-900 dark:text-white">AI Settings</Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                Configure your API key
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
          </Pressable>

          {/* Study Statistics - Placeholder */}
          <Pressable
            className="mb-3 flex-row items-center rounded-xl bg-gray-50 p-4 active:bg-gray-100 dark:bg-gray-900 dark:active:bg-gray-800"
            disabled>
            <View className="mr-4 rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
              <Ionicons name="stats-chart-outline" size={20} color="#2563EB" />
            </View>
            <View className="flex-1">
              <Text className="font-medium text-gray-900 dark:text-white">Study Statistics</Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">Coming soon</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
          </Pressable>

          {/* About */}
          <Pressable
            className="mb-3 flex-row items-center rounded-xl bg-gray-50 p-4 active:bg-gray-100 dark:bg-gray-900 dark:active:bg-gray-800"
            disabled>
            <View className="mr-4 rounded-full bg-green-100 p-2 dark:bg-green-900/30">
              <Ionicons name="information-circle-outline" size={20} color="#16A34A" />
            </View>
            <View className="flex-1">
              <Text className="font-medium text-gray-900 dark:text-white">About Blob</Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">Version 1.0.0</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
          </Pressable>
        </View>

        {/* Logout Button */}
        <Pressable
          className="items-center rounded-xl bg-red-50 py-4 active:bg-red-100 dark:bg-red-900/20 dark:active:bg-red-900/30"
          onPress={handleLogout}>
          <Text className="font-semibold text-red-600 dark:text-red-400">Logout</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
