import { View, Text, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { useState } from 'react';
import { RefreshControl } from 'react-native';
import { trpc } from '@/utils/trpc';


export default function FlashcardsListScreen() {
  const { topicId } = useLocalSearchParams<{ topicId: string }>();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleStudy = () => {
    router.push({
      pathname: '/flashcard/study',
      params: { topicId },
    });
  };

  const handleCreateFlashcard = () => {
    // router.push({
    //   pathname: '/flashcard/create',
    //   params: { topicId },
    // });
  };

  const handleGenerateWithAI = () => {
    console.log('Generate flashcards with AI for topic:', topicId);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  if (!topicId || typeof topicId !== 'string') {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white dark:bg-black">
        <Text className="text-gray-500 dark:text-gray-400">
          Invalid topic
        </Text>
      </SafeAreaView>
    );
  }

  const {
    data,
    isLoading,
    error,
    refetch,
  } = trpc.flashcards.getByTopic.useQuery(
    { topicId },
    { enabled: !!topicId }
  );
  
  const flashcards = data?.flashcards ?? [];

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white dark:bg-black">
        <ActivityIndicator size="large" color={isDark ? '#60A5FA' : '#2563EB'} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white dark:bg-black">
        <Text className="mb-2 text-gray-700 dark:text-gray-300">
          Failed to load flashcards
        </Text>
        <Pressable
          onPress={() => refetch()}
          className="rounded-lg bg-blue-600 px-4 py-2">
          <Text className="font-semibold text-white">Retry</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <View className="flex-row items-center border-b border-gray-200 p-4 dark:border-gray-800">
        <Pressable onPress={() => router.back()} className="mr-4 p-1">
          <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
        </Pressable>
        <Text className="flex-1 text-xl font-bold text-gray-900 dark:text-white">Flashcards</Text>
        <Pressable onPress={handleCreateFlashcard} className="p-1">
          <Ionicons name="add" size={24} color={isDark ? '#fff' : '#000'} />
        </Pressable>
      </View>

      <View className="flex-1 p-4">
        <View className="mb-4 flex-row">
          <Pressable
            onPress={handleStudy}
            className="mr-2 flex-1 flex-row items-center justify-center rounded-lg bg-blue-600 py-3 active:bg-blue-700">
            <Ionicons name="play" size={18} color="white" />
            <Text className="ml-2 font-semibold text-white">Study</Text>
          </Pressable>
          <Pressable
            onPress={handleGenerateWithAI}
            className="flex-1 flex-row items-center justify-center rounded-lg bg-purple-600 py-3 active:bg-purple-700">
            <Ionicons name="sparkles" size={18} color="white" />
            <Text className="ml-2 font-semibold text-white">Generate</Text>
          </Pressable>
        </View>

        {flashcards.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Ionicons name="albums-outline" size={64} color={isDark ? '#4B5563' : '#9CA3AF'} />
            <Text className="mt-4 text-center text-lg text-gray-500 dark:text-gray-400">
              No flashcards yet
            </Text>
            <Text className="mt-2 text-center text-gray-400 dark:text-gray-500">
              Generate with AI or create manually
            </Text>
          </View>
        ) : (
          <FlatList
            data={flashcards}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={isDark ? '#60A5FA' : '#2563EB'}
              />
            }
            renderItem={({ item, index }) => (
              <Pressable className="mb-3 rounded-xl bg-gray-50 p-4 active:bg-gray-100 dark:bg-gray-900 dark:active:bg-gray-800">
                <View className="mb-2 flex-row items-center justify-between">
                  <Text className="text-sm text-gray-500 dark:text-gray-400">Card {index + 1}</Text>
                  {item.difficulty && (
                    <Text
                      className={`rounded-full px-2 py-1 text-xs font-medium ${getDifficultyColor(item.difficulty)}`}>
                      {item.difficulty}
                    </Text>
                  )}
                </View>
                <Text className="text-base font-medium text-gray-900 dark:text-white">
                  {item.front}
                </Text>
                <View className="mt-2 border-t border-gray-200 pt-2 dark:border-gray-700">
                  <Text className="text-sm text-gray-600 dark:text-gray-400">{item.back}</Text>
                </View>
              </Pressable>
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
