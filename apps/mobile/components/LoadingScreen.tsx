import React, { useMemo } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { quotes } from '../quotes';

export function LoadingScreen() {
  const randomQuote = useMemo(() => {
    if (!quotes || quotes.length === 0) return 'Loading...';
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-black px-6">
      <ActivityIndicator size="large" color="#3b82f6" />
      <Text className="mt-8 text-center text-lg font-medium text-gray-800 dark:text-gray-200">
        {randomQuote}
      </Text>
    </View>
  );
}
