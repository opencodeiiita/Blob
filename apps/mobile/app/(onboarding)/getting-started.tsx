import { View, Text, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function GettingStartedScreen() {
  return (
    // Root uses `bg-white dark:bg-black` so the background follows system theme
    <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top', 'left', 'right', 'bottom']}>
      <View className="flex-1 px-8 pb-10 pt-16">
        {/* Hero Section */}
        <View className="flex-1 items-center justify-center">
          <View className=" items-center justify-center">
            {/* Glow effect behind logo */}
            <View className="opacity-30" />
            <Image source={require('../../assets/adaptive-icon.png')} className="h-60 w-60" />
          </View>

          <Text className="mb-4 text-center text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Learn Smarter with <Text className="text-orange-500 dark:text-orange-400">Blob</Text>
          </Text>

          <Text className="text-center text-lg leading-7 text-gray-500 dark:text-gray-300">
            Your AI-powered study companion. Transform notes into interactive flashcards and quizzes
            instantly.
          </Text>
        </View>

        {/* Action Section */}
        <View className="mt-12">
          <Pressable
            className="h-16 items-center justify-center rounded-2xl bg-orange-500 shadow-lg shadow-orange-200 active:bg-orange-600"
            onPress={() => router.push('/(onboarding)/login')}>
            <View className="flex-row items-center">
              <Text className="mr-2 text-xl font-bold text-white">Continue</Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </View>
          </Pressable>
        </View>

        {/* Footer info */}
        <Text className="mt-auto text-center text-xs text-gray-400 dark:text-gray-500">
          By continuing, you agree to our Terms and Privacy Policy
        </Text>
      </View>
    </SafeAreaView>
  );
}
