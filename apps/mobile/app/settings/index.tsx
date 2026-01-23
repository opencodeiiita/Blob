import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { trpc } from '@/utils/trpc';

type AIProvider = 'google' | 'openai';

const MODELS: Record<AIProvider, string[]> = {
  google: ['gemini-1.5-pro', 'gemini-1.5-flash'],
  openai: ['gpt-4o', 'gpt-4o-mini'],
};

export default function SettingsScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [selectedProvider, setSelectedProvider] =
    useState<AIProvider>('google');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState(MODELS.google[0]);
  const [hasExistingKey, setHasExistingKey] = useState(false);

  const { data, isLoading } = trpc.settings.get.useQuery(undefined, {
    retry: false,
  });

  useEffect(() => {
    if (!data?.settings) return;

    const s = data.settings;

    const provider: AIProvider = s.aiProvider ?? 'google';

    setSelectedProvider(provider);
    setHasExistingKey(s.hasApiKey);

    if (s.preferredModel) {
      setModel(s.preferredModel);
    } else {
      setModel(MODELS[provider][0]);
    }
  }, [data]);

  const updateAiProvider =
    trpc.settings.updateAiProvider.useMutation({
      onSuccess: () => {
        setHasExistingKey(true);
        setApiKey('');
        Alert.alert('Success', 'Settings saved successfully');
      },
      onError: (err) => {
        console.error(err);
        Alert.alert('Error', err.message ?? 'Failed to save settings');
      },
    });

  const removeApiKey =
    trpc.settings.removeApiKey.useMutation({
      onSuccess: () => {
        setHasExistingKey(false);
        Alert.alert('Success', 'API key removed');
      },
      onError: (err) => {
        console.error(err);
        Alert.alert('Error', 'Failed to remove API key');
      },
    });

  const isValidApiKey = () => {
    if (selectedProvider === 'google') return apiKey.startsWith('AIza');
    if (selectedProvider === 'openai') return apiKey.startsWith('sk-');
    return false;
  };

  const handleSave = () => {
    if (!apiKey.trim()) {
      Alert.alert('Error', 'Please enter an API key');
      return;
    }

    if (!isValidApiKey()) {
      Alert.alert('Invalid API Key', 'API key format is incorrect');
      return;
    }

    updateAiProvider.mutate({
      provider: selectedProvider,
      apiKey,
      model,
    });
  };

  const handleRemoveKey = () => {
    Alert.alert(
      'Remove API Key',
      'You will need to add it again to use AI features.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeApiKey.mutate(),
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white dark:bg-black">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      {/* Header */}
      <View className="flex-row items-center border-b p-4">
        <Pressable onPress={() => router.back()} className="mr-4">
          <Ionicons
            name="arrow-back"
            size={24}
            color={isDark ? '#fff' : '#000'}
          />
        </Pressable>
        <Text className="text-xl font-bold">Settings</Text>
      </View>

      <ScrollView className="p-4">
        {/* Provider */}
        <Text className="mb-3 text-lg font-semibold">AI Provider</Text>

        <View className="mb-4 flex-row">
          {(['google', 'openai'] as AIProvider[]).map((p) => (
            <Pressable
              key={p}
              onPress={() => {
                setSelectedProvider(p);
                setModel(MODELS[p][0]);
              }}
              className={`mr-2 flex-1 rounded-lg border-2 py-4 items-center ${
                selectedProvider === p
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200'
              }`}>
              <Text className="font-medium">
                {p === 'google' ? 'Google Gemini' : 'OpenAI'}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Model */}
        <Text className="mb-2 font-medium">Model</Text>
        {MODELS[selectedProvider].map((m) => (
          <Pressable
            key={m}
            onPress={() => setModel(m)}
            className={`mb-2 rounded-lg p-3 ${
              model === m ? 'bg-blue-600' : 'bg-gray-200'
            }`}>
            <Text className={model === m ? 'text-white' : ''}>{m}</Text>
          </Pressable>
        ))}

        {/* Existing key */}
        {hasExistingKey && (
          <View className="my-4 flex-row items-center rounded-lg bg-green-50 p-3">
            <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
            <Text className="ml-2 flex-1 text-green-800">
              API key configured
            </Text>
            <Pressable onPress={handleRemoveKey}>
              <Text className="text-red-600 font-medium">Remove</Text>
            </Pressable>
          </View>
        )}

        {/* API key input */}
        <Text className="mb-2 font-medium">
          {hasExistingKey ? 'Update API Key' : 'API Key'}
        </Text>

        <TextInput
          value={apiKey}
          onChangeText={setApiKey}
          placeholder="Enter API Key"
          secureTextEntry
          className="rounded-lg border p-4"
        />

        {/* Save */}
        <Pressable
          onPress={handleSave}
          disabled={updateAiProvider.isPending}
          className="mt-6 items-center rounded-lg bg-blue-600 py-4">
          {updateAiProvider.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="font-semibold text-white">
              {hasExistingKey ? 'Update API Key' : 'Save API Key'}
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
