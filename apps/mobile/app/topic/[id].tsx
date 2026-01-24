import { useEffect } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { trpc } from '@/utils/trpc';

export default function TopicDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const utils = trpc.useUtils();

  const { data, isLoading, error } = trpc.topics.getById.useQuery({ topicId: id });

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error.message, [
        { text: 'Go Back', onPress: () => router.back() },
      ]);
    }
  }, [error]);

  const deleteTopic = trpc.topics.delete.useMutation({
    onSuccess: () => {
      utils.topics.getAll.invalidate();
      router.back();
    },
    onError: (err: any) => {
      Alert.alert('Error', err.message);
    },
  });

  const topic = data?.topic;

  const handleGenerateAll = () => {
    // TODO: Navigate to generation screen or trigger generation
    console.log('Generate all study materials for topic:', id);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Topic',
      'Are you sure you want to delete this topic? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTopic.mutate({ topicId: id }),
        },
      ]
    );
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

  if (error || !topic) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white dark:bg-black">
        <Text className="text-red-500">Failed to load topic</Text>
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
            <Text className="text-xl font-bold text-gray-900 dark:text-white" numberOfLines={1}>{topic.title}</Text>
          </View>
          <Pressable onPress={handleDelete} className="p-1">
            <Ionicons name="trash-outline" size={24} color={isDark ? '#EF4444' : '#DC2626'} />
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
                0 cards
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
                0 quizzes
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
                0 maps
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
