import { View, Text, TextInput, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';

// TODO: Import and use tRPC hooks
// import { trpc } from '@/utils/trpc';

export default function CreateTopicScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Replace with actual tRPC mutation
  // const createTopic = trpc.topics.create.useMutation({
  //     onSuccess: (data) => {
  //         router.replace(`/topic/${data.topic.id}`);
  //     },
  // });

  const handleCreate = async () => {
    if (!title.trim()) return;

    setIsLoading(true);
    // TODO: Call actual mutation
    // createTopic.mutate({ title: title.trim(), description: description.trim() || undefined });

    // Placeholder: simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.back();
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View className="flex-row items-center border-b border-gray-200 p-4 dark:border-gray-800">
          <Pressable onPress={() => router.back()} className="mr-4 p-1">
            <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
          </Pressable>
          <Text className="text-xl font-bold text-gray-900 dark:text-white">Create Topic</Text>
        </View>

        {/* Form */}
        <View className="p-4">
          <View className="mb-4">
            <Text className="mb-2 font-medium text-gray-700 dark:text-gray-300">Title *</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g., JavaScript Basics"
              placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              className="rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </View>

          <View className="mb-6">
            <Text className="mb-2 font-medium text-gray-700 dark:text-gray-300">
              Description (optional)
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Brief description of what you'll study"
              placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              className="min-h-[100px] rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </View>

          <Pressable
            onPress={handleCreate}
            disabled={!title.trim() || isLoading}
            className={`items-center rounded-lg py-4 ${
              !title.trim() || isLoading
                ? 'bg-gray-300 dark:bg-gray-700'
                : 'bg-blue-600 active:bg-blue-700'
            }`}>
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="font-semibold text-white">Create Topic</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
