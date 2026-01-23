import { View, Text, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { trpc } from '@/utils/trpc';
import { useState } from 'react';
import { RefreshControl } from 'react-native';


export default function QuizzesListScreen() {
  const { topicId } = useLocalSearchParams<{ topicId: string }>();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [refreshing, setRefreshing] = useState(false);

  const {
    data,
    isLoading,
    error,
    refetch,
  } = trpc.quizzes.getByTopic.useQuery(
    { topicId },
    { enabled: !!topicId }
  );

  const quizzes = data?.quizzes ?? [];

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };


  const handleStartQuiz = (quizId: string) => {
    router.push(`/quiz/${quizId}`);
  };

  const handleGenerateWithAI = () => {
    console.log('Generate quiz with AI for topic:', topicId);
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
          Failed to load quizzes
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
        <Text className="flex-1 text-xl font-bold text-gray-900 dark:text-white">Quizzes</Text>
      </View>

      <View className="flex-1 p-4">
        <Pressable
          onPress={handleGenerateWithAI}
          className="mb-4 flex-row items-center justify-center rounded-lg bg-purple-600 py-3 active:bg-purple-700">
          <Ionicons name="sparkles" size={18} color="white" />
          <Text className="ml-2 font-semibold text-white">Generate Quiz with AI</Text>
        </Pressable>

        {quizzes.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Ionicons name="help-circle-outline" size={64} color={isDark ? '#4B5563' : '#9CA3AF'} />
            <Text className="mt-4 text-center text-lg text-gray-500 dark:text-gray-400">
              No quizzes yet
            </Text>
            <Text className="mt-2 text-center text-gray-400 dark:text-gray-500">
              Generate a quiz with AI to test your knowledge
            </Text>
          </View>
        ) : (
          <FlatList
            data={quizzes}
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
                onPress={() => handleStartQuiz(item.id)}
                className="mb-3 rounded-xl bg-gray-50 p-4 active:bg-gray-100 dark:bg-gray-900 dark:active:bg-gray-800">
                <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                  {item.title}
                </Text>
                {item.description && (
                  <Text className="mt-1 text-gray-600 dark:text-gray-400">{item.description}</Text>
                )}
                {/* Backend does not give question count */}
                {/*
                <View className="mt-3 flex-row items-center">
                  <Ionicons
                    name="help-circle-outline"
                    size={16}
                    color={isDark ? '#9CA3AF' : '#6B7280'}
                  />
                  <Text className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                    {item.questionCount} questions
                  </Text>
                </View>
                */}
                <View className="mt-3 flex-row justify-end">
                  <View className="flex-row items-center rounded-full bg-green-100 px-3 py-1 dark:bg-green-900/30">
                    <Ionicons name="play" size={14} color="#16A34A" />
                    <Text className="ml-1 text-sm font-medium text-green-700 dark:text-green-400">
                      Start Quiz
                    </Text>
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
