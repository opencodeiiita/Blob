import { Stack, Link } from 'expo-router';
import { View, Text, ActivityIndicator } from 'react-native';

import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { ScreenContent } from '@/components/ScreenContent';
import { trpc } from '@/utils/trpc';
import { getApiUrl } from '@/utils/api';

export default function Home() {
  const helloQuery = trpc.hello.useQuery({ name: 'React Native' });
  const timeQuery = trpc.getTime.useQuery();
  const echoMutation = trpc.echo.useMutation();
  const handleEcho = () => {
    echoMutation.mutate({ message: 'Hello from mobile app!' });
  };

  return (
    <View className={styles.container}>
      <Stack.Screen options={{ title: 'Home' }} />
      <Container>
        <ScreenContent path="app/index.tsx" title="Home">
          <View className="mt-4 space-y-4">
            <Text className="text-sm text-gray-600 dark:text-gray-400">API URL: {getApiUrl()}</Text>

            <View className="rounded border border-gray-200 dark:border-gray-800 p-4">
              <Text className="mb-2 font-bold text-black dark:text-white">Hello Query:</Text>
              {helloQuery.isLoading && <ActivityIndicator />}
              {helloQuery.error && (
                <Text className="text-red-500 dark:text-red-400">Error: {helloQuery.error.message}</Text>
              )}
              {helloQuery.data && (
                <Text className="text-green-600 dark:text-green-400">{helloQuery.data.greeting}</Text>
              )}
            </View>

            <View className="rounded border border-gray-200 dark:border-gray-800 p-4">
              <Text className="mb-2 font-bold text-black dark:text-white">Server Time Query:</Text>
              {timeQuery.isLoading && <ActivityIndicator />}
              {timeQuery.error && (
                <Text className="text-red-500 dark:text-red-400">Error: {timeQuery.error.message}</Text>
              )}
              {timeQuery.data && <Text className="text-blue-600 dark:text-blue-400">{timeQuery.data.time}</Text>}
            </View>

            <View className="rounded border border-gray-200 dark:border-gray-800 p-4">
              <Text className="mb-2 font-bold text-black dark:text-white">Echo Mutation:</Text>
              <Button
                title={echoMutation.isPending ? 'Sending...' : 'Test Echo'}
                onPress={handleEcho}
              />
              {echoMutation.error && (
                <Text className="mt-2 text-red-500 dark:text-red-400">Error: {echoMutation.error.message}</Text>
              )}
              {echoMutation.data && (
                <Text className="mt-2 text-green-600 dark:text-green-400">Response: {echoMutation.data.message}</Text>
              )}
            </View>

          </View>
        </ScreenContent>
        <Link href={{ pathname: '/details', params: { name: 'Dan' } }} asChild>
          <Button title="Show Details" />
        </Link>
      </Container>
    </View>
  );
}

const styles = {
  container: 'flex flex-1 bg-white dark:bg-black',
};
