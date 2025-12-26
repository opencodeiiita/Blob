import { View, Text, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useAuthStore } from '@/store/authStore';

export default function LoginScreen() {
  const login = useAuthStore((state) => state.login);

  const handleLogin = () => {
    login();
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right', 'bottom']}>
      {/* Custom Header with Back Button */}
      <View className="px-6 py-4">
        <Pressable 
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-gray-50 active:bg-gray-100"
        >
          <Ionicons name="chevron-back" size={24} color="#374151" />
        </Pressable>
      </View>

      <View className="flex-1 px-8 pb-10">
        {/* Header Section */}
        <View className="mb-12 items-center">
          <View className="mb-6 h-28 w-28 items-center justify-center rounded-3xl bg-white shadow-2xl shadow-orange-100">
            <Image 
              source={require('../../assets/icon.png')} 
              className="h-20 w-20"
              resizeMode="contain"
            />
          </View>
          <Text className="text-3xl font-extrabold text-gray-900">Welcome Back</Text>
          <Text className="mt-2 text-center text-base text-gray-500">
            Sign in to continue your AI-powered learning journey with Blob
          </Text>
        </View>

        {/* Login Options Section */}
        <View className="flex-1 justify-center">
          <Pressable
            className="mb-4 flex-row h-16 items-center justify-center rounded-2xl border-2 border-gray-100 bg-white active:bg-gray-50"
            onPress={handleLogin}>
            <Ionicons name="logo-google" size={24} color="#DB4437" />
            <Text className="ml-3 text-lg font-bold text-gray-800">Continue with Google</Text>
          </Pressable>

          <Pressable
            className="mb-4 flex-row h-16 items-center justify-center rounded-2xl bg-gray-900 active:bg-black"
            onPress={handleLogin}>
            <Ionicons name="logo-github" size={24} color="white" />
            <Text className="ml-3 text-lg font-bold text-white">Continue with GitHub</Text>
          </Pressable>

          <View className="my-6 flex-row items-center">
            <View className="h-[1px] flex-1 bg-gray-100" />
            <Text className="mx-4 text-sm font-medium text-gray-400 uppercase tracking-widest">or</Text>
            <View className="h-[1px] flex-1 bg-gray-100" />
          </View>

          <Pressable
            className="h-16 items-center justify-center rounded-2xl bg-orange-500 shadow-lg shadow-orange-200 active:bg-orange-600"
            onPress={handleLogin}>
            <Text className="text-lg font-bold text-white">Guest Access</Text>
          </Pressable>
        </View>

        {/* Footer info */}
        <View className="mt-8 items-center">
          <Text className="text-sm text-gray-500">
            Don't have an account? <Text className="font-bold text-orange-500">Join OpenCode</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
