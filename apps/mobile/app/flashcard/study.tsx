import { View, Text, Pressable, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';

// TODO: Import and use tRPC hooks
// import { trpc } from '@/utils/trpc';

const { width } = Dimensions.get('window');

// Placeholder data
const PLACEHOLDER_FLASHCARDS = [
  { id: '1', front: 'What is a variable?', back: 'A container for storing data values' },
  {
    id: '2',
    front: 'What is a function?',
    back: 'A reusable block of code that performs a specific task',
  },
  {
    id: '3',
    front: 'What is closure?',
    back: 'A function that has access to variables from its outer scope',
  },
];

export default function FlashcardStudyScreen() {
  const { topicId } = useLocalSearchParams<{ topicId: string }>();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnimation = useRef(new Animated.Value(0)).current;

  // TODO: Replace with actual tRPC query
  const flashcards = PLACEHOLDER_FLASHCARDS;
  const currentCard = flashcards[currentIndex];

  const flipCard = () => {
    Animated.spring(flipAnimation, {
      toValue: isFlipped ? 0 : 1,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const goToNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      flipAnimation.setValue(0);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      flipAnimation.setValue(0);
    }
  };

  const frontAnimatedStyle = {
    transform: [
      {
        rotateY: flipAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '180deg'],
        }),
      },
    ],
  };

  const backAnimatedStyle = {
    transform: [
      {
        rotateY: flipAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: ['180deg', '360deg'],
        }),
      },
    ],
  };

  if (flashcards.length === 0) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white dark:bg-black">
        <Text className="text-gray-500 dark:text-gray-400">No flashcards to study</Text>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="text-blue-600">Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      {/* Header */}
      <View className="flex-row items-center border-b border-gray-200 p-4 dark:border-gray-800">
        <Pressable onPress={() => router.back()} className="mr-4 p-1">
          <Ionicons name="close" size={24} color={isDark ? '#fff' : '#000'} />
        </Pressable>
        <Text className="flex-1 text-center text-lg font-semibold text-gray-900 dark:text-white">
          {currentIndex + 1} / {flashcards.length}
        </Text>
        <View className="w-10" />
      </View>

      {/* Card */}
      <View className="flex-1 items-center justify-center p-6">
        <Pressable onPress={flipCard} className="h-[300px] w-full">
          {/* Front of card */}
          <Animated.View
            style={[frontAnimatedStyle, { backfaceVisibility: 'hidden' }]}
            className="absolute h-full w-full items-center justify-center rounded-2xl bg-blue-50 p-6 shadow-lg dark:bg-blue-900/20">
            <Text className="text-center text-xl font-semibold text-gray-900 dark:text-white">
              {currentCard.front}
            </Text>
            <Text className="mt-4 text-sm text-gray-500 dark:text-gray-400">Tap to flip</Text>
          </Animated.View>

          {/* Back of card */}
          <Animated.View
            style={[backAnimatedStyle, { backfaceVisibility: 'hidden' }]}
            className="absolute h-full w-full items-center justify-center rounded-2xl bg-green-50 p-6 shadow-lg dark:bg-green-900/20">
            <Text className="text-center text-lg text-gray-800 dark:text-gray-200">
              {currentCard.back}
            </Text>
            <Text className="mt-4 text-sm text-gray-500 dark:text-gray-400">Tap to flip back</Text>
          </Animated.View>
        </Pressable>
      </View>

      {/* Navigation */}
      <View className="flex-row items-center justify-between border-t border-gray-200 p-4 dark:border-gray-800">
        <Pressable
          onPress={goToPrevious}
          disabled={currentIndex === 0}
          className={`flex-row items-center rounded-lg px-4 py-3 ${
            currentIndex === 0
              ? 'opacity-50'
              : 'bg-gray-100 active:bg-gray-200 dark:bg-gray-800 dark:active:bg-gray-700'
          }`}>
          <Ionicons name="chevron-back" size={20} color={isDark ? '#fff' : '#000'} />
          <Text className="ml-1 font-medium text-gray-900 dark:text-white">Previous</Text>
        </Pressable>

        <Pressable
          onPress={goToNext}
          disabled={currentIndex === flashcards.length - 1}
          className={`flex-row items-center rounded-lg px-4 py-3 ${
            currentIndex === flashcards.length - 1 ? 'opacity-50' : 'bg-blue-600 active:bg-blue-700'
          }`}>
          <Text className="mr-1 font-medium text-white">Next</Text>
          <Ionicons name="chevron-forward" size={20} color="white" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
