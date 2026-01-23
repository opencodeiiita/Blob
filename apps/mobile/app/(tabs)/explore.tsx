import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ExploreScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-100 dark:bg-gray-900" edges={['top', 'bottom']}>
      <View className="flex-1 items-center justify-center p-6">
        <Text className="mb-3 text-center text-3xl font-bold text-orange-600 dark:text-orange-400">
          Explore
        </Text>
        <Text className="mb-6 text-center text-lg text-gray-700 dark:text-gray-300">
          Discover new study materials
        </Text>
        <Text className="px-5 text-center text-sm leading-snug text-gray-600 dark:text-gray-400">
          This is a placeholder for the Explore screen.{'\n'}
          Future features will include browsing topics, discovering new flashcard sets, and
          community content.
        </Text>
      </View>
    </SafeAreaView>
  );
}
