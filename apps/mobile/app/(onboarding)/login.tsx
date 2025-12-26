import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';

import { useAuthStore } from '@/store/authStore';

export default function LoginScreen() {
  const login = useAuthStore((state) => state.login);

  const handleLogin = () => {
    login();
    router.replace('/(tabs)/home');
  };

  return (
    <View className="flex-1 justify-between bg-green-50 p-6">
      <View className="flex-1 items-center justify-center">
        <Text className="mb-3 text-center text-3xl font-bold text-green-700">Login</Text>
        <Text className="mb-6 text-center text-lg text-gray-700">
          Sign in to continue your learning journey
        </Text>
        <Text className="px-5 text-center text-sm italic text-gray-600">
          (This is a placeholder screen. Tap the button below to simulate login)
        </Text>
      </View>

      <Pressable
        className="mb-5 items-center rounded-xl bg-green-700 px-8 py-4"
        onPress={handleLogin}>
        <Text className="text-lg font-semibold text-white">Login</Text>
      </Pressable>
    </View>
  );
}
