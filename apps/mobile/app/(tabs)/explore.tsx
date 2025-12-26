import { View, Text } from 'react-native';

export default function ExploreScreen() {
  return (
    <View className="flex-1 bg-gray-100">
      <View className="flex-1 items-center justify-center p-6">
        <Text className="mb-3 text-center text-3xl font-bold text-orange-600">Explore</Text>
        <Text className="mb-6 text-center text-lg text-gray-700">Discover new study materials</Text>
        <Text className="px-5 text-center text-sm leading-snug text-gray-600">
          This is a placeholder for the Explore screen.{'\n'}
          Future features will include browsing topics, discovering new flashcard sets, and
          community content.
        </Text>
      </View>
    </View>
  );
}
