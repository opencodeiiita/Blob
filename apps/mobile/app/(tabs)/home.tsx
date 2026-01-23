import { View, Text, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

const PLACEHOLDER_TOPICS = [
  {
    id: '1',
    title: 'JavaScript Basics',
    description: 'Learn JS fundamentals',
    flashcardsCount: 12,
    quizzesCount: 3,
  },
  {
    id: '2',
    title: 'React Native',
    description: 'Mobile development',
    flashcardsCount: 8,
    quizzesCount: 2,
  },
];

export default function HomeScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const isLoading = false;
  const topics = PLACEHOLDER_TOPICS;

  const handleCreateTopic = () => {
    router.push('/topic/create');
  };

  const handleViewAllTopics = () => {
    router.push('/topic');
  };

  const handleTopicPress = (topicId: string) => {
    router.push(`/topic/${topicId}`);
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top', 'bottom']}>
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800">
          <View>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">Blob</Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              Your AI Study Companion
            </Text>
          </View>
          <View className="flex-row items-center">
            <ThemeSwitcher />
            <Pressable onPress={handleSettings} className="ml-2 p-2">
              <Ionicons name="settings-outline" size={24} color={isDark ? '#fff' : '#000'} />
            </Pressable>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="p-4">
          <Pressable
            onPress={handleCreateTopic}
            className="flex-row items-center rounded-xl bg-blue-600 p-4 active:bg-blue-700">
            <View className="mr-4 rounded-full bg-white/20 p-2">
              <Ionicons name="add" size={24} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-white">Create New Topic</Text>
              <Text className="text-blue-100">Start learning something new</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="white" />
          </Pressable>
        </View>

        {/* Recent Topics */}
        <View className="flex-1 px-4">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Topics
            </Text>
            <Pressable onPress={handleViewAllTopics}>
              <Text className="text-blue-600 dark:text-blue-400">View All</Text>
            </Pressable>
          </View>

          {isLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color={isDark ? '#60A5FA' : '#2563EB'} />
            </View>
          ) : topics.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <Ionicons name="book-outline" size={48} color={isDark ? '#4B5563' : '#9CA3AF'} />
              <Text className="mt-4 text-center text-gray-500 dark:text-gray-400">
                No topics yet
              </Text>
              <Text className="text-center text-sm text-gray-400 dark:text-gray-500">
                Create your first topic to get started
              </Text>
            </View>
          ) : (
            <FlatList
              data={topics.slice(0, 5)}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleTopicPress(item.id)}
                  className="mb-3 rounded-xl bg-gray-50 p-4 active:bg-gray-100 dark:bg-gray-900 dark:active:bg-gray-800">
                  <Text className="text-base font-semibold text-gray-900 dark:text-white">
                    {item.title}
                  </Text>
                  {item.description && (
                    <Text className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {item.description}
                    </Text>
                  )}
                  <View className="mt-2 flex-row">
                    <View className="mr-3 flex-row items-center">
                      <Ionicons
                        name="albums-outline"
                        size={14}
                        color={isDark ? '#9CA3AF' : '#6B7280'}
                      />
                      <Text className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                        {item.flashcardsCount} cards
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Ionicons
                        name="help-circle-outline"
                        size={14}
                        color={isDark ? '#9CA3AF' : '#6B7280'}
                      />
                      <Text className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                        {item.quizzesCount} quizzes
                      </Text>
                    </View>
                  </View>
                </Pressable>
              )}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
