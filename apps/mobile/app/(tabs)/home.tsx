import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center p-6">
        <Text className="mb-3 text-center text-3xl font-bold text-blue-600">Home</Text>
        <Text className="mb-6 text-center text-lg text-gray-700">
          Welcome to your study dashboard
        </Text>
        <Text className="px-5 text-center text-sm leading-snug text-gray-600">
          This is a placeholder for the Home screen.{'\n'}
          Future features will include your recent flashcards, study progress, and quick actions.
        </Text>
      </View>
    </View>
  );
}
