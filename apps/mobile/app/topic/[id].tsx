import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';

// TODO: Import and use tRPC hooks
// import { trpc } from '@/utils/trpc';

// Placeholder data
const PLACEHOLDER_TOPIC = {
  id: '1',
  title: 'JavaScript Basics',
  description: 'Learn the fundamentals of JavaScript programming language',
  flashcardsCount: 12,
  quizzesCount: 3,
  mindMapsCount: 1,
};

export default function TopicDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // TODO: Replace with actual tRPC query
  // const { data, isLoading } = trpc.topics.getById.useQuery({ topicId: id });
  const isLoading = false;
  const topic = PLACEHOLDER_TOPIC;

  const handleGenerateAll = () => {
    // TODO: Navigate to generation screen or trigger generation
    console.log('Generate all study materials for topic:', id);
  };

  const handleViewFlashcards = () => {
    router.push(`/flashcard?topicId=${id}`);
  };

  const handleViewQuizzes = () => {
    router.push(`/quiz?topicId=${id}`);
  };

  const handleViewMindMaps = () => {
    router.push(`/mindmap?topicId=${id}`);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white dark:bg-black">
        <ActivityIndicator size="large" color={isDark ? '#60A5FA' : '#2563EB'} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center border-b border-gray-200 p-4 dark:border-gray-800">
          <Pressable onPress={() => router.back()} className="mr-4 p-1">
            <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
          </Pressable>
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-900 dark:text-white">{topic.title}</Text>
          </View>
          <Pressable className="p-1">
            <Ionicons name="ellipsis-vertical" size={24} color={isDark ? '#fff' : '#000'} />
          </Pressable>
        </View>

        <View className="p-4">
          {/* Description */}
          {topic.description && (
            <Text className="mb-6 text-gray-600 dark:text-gray-400">{topic.description}</Text>
          )}

          {/* AI Generate Button */}
          <Pressable
            onPress={handleGenerateAll}
            className="mb-6 flex-row items-center justify-center rounded-xl bg-purple-600 bg-gradient-to-r py-4 active:bg-purple-700">
            <Ionicons name="sparkles" size={20} color="white" />
            <Text className="ml-2 font-semibold text-white">Generate Study Materials with AI</Text>
          </Pressable>

          {/* Study Materials Sections */}
          <Text className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
            Study Materials
          </Text>

          {/* Flashcards */}
          <Pressable
            onPress={handleViewFlashcards}
            className="mb-3 flex-row items-center rounded-xl bg-blue-50 p-4 active:bg-blue-100 dark:bg-blue-900/20 dark:active:bg-blue-900/30">
            <View className="mr-4 rounded-full bg-blue-100 p-3 dark:bg-blue-900/40">
              <Ionicons name="albums" size={24} color="#2563EB" />
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-gray-900 dark:text-white">Flashcards</Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                {topic.flashcardsCount} cards
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
          </Pressable>

          {/* Quizzes */}
          <Pressable
            onPress={handleViewQuizzes}
            className="mb-3 flex-row items-center rounded-xl bg-green-50 p-4 active:bg-green-100 dark:bg-green-900/20 dark:active:bg-green-900/30">
            <View className="mr-4 rounded-full bg-green-100 p-3 dark:bg-green-900/40">
              <Ionicons name="help-circle" size={24} color="#16A34A" />
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-gray-900 dark:text-white">Quizzes</Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                {topic.quizzesCount} quizzes
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
          </Pressable>

          {/* Mind Maps */}
          <Pressable
            onPress={handleViewMindMaps}
            className="mb-3 flex-row items-center rounded-xl bg-orange-50 p-4 active:bg-orange-100 dark:bg-orange-900/20 dark:active:bg-orange-900/30">
            <View className="mr-4 rounded-full bg-orange-100 p-3 dark:bg-orange-900/40">
              <Ionicons name="git-network" size={24} color="#EA580C" />
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-gray-900 dark:text-white">Mind Maps</Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                {topic.mindMapsCount} maps
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
