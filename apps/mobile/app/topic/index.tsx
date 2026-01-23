import { View, Text, Pressable, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';

import { trpc } from '@/utils/trpc';
import { useState } from 'react';

export default function TopicsListScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const {
    data,
    isLoading,
    error,
    refetch,
  } = trpc.topics.getAll.useQuery();
  
  const topics = data?.topics ?? [];

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleCreateTopic = () => {
    router.push('/topic/create');
  };

  const handleTopicPress = (topicId: string) => {
    router.push(`/topic/${topicId}`);
  };

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
          Failed to load topics
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
    <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['bottom']}>
      <View className="flex-1 p-4">
        {/* Header */}
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">My Topics</Text>
          <Pressable
            onPress={handleCreateTopic}
            className="rounded-full bg-blue-600 p-2 active:bg-blue-700">
            <Ionicons name="add" size={24} color="white" />
          </Pressable>
        </View>

        {/* Topics List */}
        {topics.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Ionicons name="book-outline" size={64} color={isDark ? '#4B5563' : '#9CA3AF'} />
            <Text className="mt-4 text-center text-lg text-gray-500 dark:text-gray-400">
              No topics yet
            </Text>
            <Text className="mt-2 text-center text-gray-400 dark:text-gray-500">
              Create your first topic to get started
            </Text>
            <Pressable
              onPress={handleCreateTopic}
              className="mt-4 rounded-lg bg-blue-600 px-6 py-3 active:bg-blue-700">
              <Text className="font-semibold text-white">Create Topic</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={topics}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={isDark ? '#60A5FA' : '#2563EB'}
              />
            }
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleTopicPress(item.id)}
                className="mb-3 rounded-xl bg-gray-50 p-4 active:bg-gray-100 dark:bg-gray-900 dark:active:bg-gray-800">
                <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                  {item.title}
                </Text>
                {item.description && (
                  <Text className="mt-1 text-gray-600 dark:text-gray-400">{item.description}</Text>
                )}
                <View className="mt-3 flex-row">
                  <View className="mr-3 flex-row items-center">
                    <Ionicons
                      name="albums-outline"
                      size={16}
                      color={isDark ? '#9CA3AF' : '#6B7280'}
                    />
                    <Text className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                      0 flashcards
                    </Text>
                  </View>
                  <View className="mr-3 flex-row items-center">
                    <Ionicons
                      name="help-circle-outline"
                      size={16}
                      color={isDark ? '#9CA3AF' : '#6B7280'}
                    />
                    <Text className="ml-1 text-sm text-gray-500 dark:text-gray-400">0 quizzes</Text>
                  </View>
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
