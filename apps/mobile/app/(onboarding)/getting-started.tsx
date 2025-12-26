import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function GettingStartedScreen() {
  return (
    <SafeAreaView className="flex-1 bg-blue-50" edges={['top', 'left', 'right']}>
      <View className="flex-1 justify-between p-6">
        <View className="flex-1 items-center justify-center">
          <Text className="mb-3 text-center text-3xl font-bold text-blue-600">Welcome to Blob</Text>
          <Text className="mb-6 text-center text-xl text-gray-700">
            Your AI-Powered Study Companion
          </Text>
          <Text className="px-5 text-center text-base leading-6 text-gray-600">
            Transform your study materials into interactive flashcards, mind maps, and quizzes
          </Text>
        </View>

        <Pressable
          className="mb-5 items-center rounded-xl bg-blue-600 px-8 py-4"
          onPress={() => router.push('/(onboarding)/login')}>
          <Text className="text-lg font-semibold text-white">Get Started</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
