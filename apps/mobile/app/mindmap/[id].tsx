import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';

const PLACEHOLDER_MINDMAP = {
  id: '1',
  root: 'JavaScript',
  nodes: [
    { id: '1', label: 'JavaScript', parentId: undefined },
    { id: '2', label: 'Variables', parentId: '1' },
    { id: '3', label: 'Functions', parentId: '1' },
    { id: '4', label: 'Objects', parentId: '1' },
    { id: '5', label: 'var', parentId: '2' },
    { id: '6', label: 'let', parentId: '2' },
    { id: '7', label: 'const', parentId: '2' },
    { id: '8', label: 'Arrow Functions', parentId: '3' },
    { id: '9', label: 'Regular Functions', parentId: '3' },
  ],
};

const TreeNode = ({
  node,
  nodes,
  level = 0,
  isDark,
}: {
  node: (typeof PLACEHOLDER_MINDMAP.nodes)[0];
  nodes: typeof PLACEHOLDER_MINDMAP.nodes;
  level?: number;
  isDark: boolean;
}) => {
  const children = nodes.filter((n) => n.parentId === node.id);
  const colors = [
    'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700',
    'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700',
    'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700',
    'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700',
  ];
  const colorClass = colors[level % colors.length];

  return (
    <View className="mb-2" style={{ marginLeft: level * 16 }}>
      <View className={`rounded-lg border p-3 ${colorClass}`}>
        <Text className="font-medium text-gray-900 dark:text-white">{node.label}</Text>
      </View>
      {children.map((child) => (
        <TreeNode key={child.id} node={child} nodes={nodes} level={level + 1} isDark={isDark} />
      ))}
    </View>
  );
};

export default function MindMapViewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const isLoading = false;
  const mindMap = PLACEHOLDER_MINDMAP;

  const rootNode = mindMap.nodes.find((n) => !n.parentId);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white dark:bg-black">
        <ActivityIndicator size="large" color={isDark ? '#60A5FA' : '#2563EB'} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <View className="flex-row items-center border-b border-gray-200 p-4 dark:border-gray-800">
        <Pressable onPress={() => router.back()} className="mr-4 p-1">
          <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
        </Pressable>
        <Text className="flex-1 text-xl font-bold text-gray-900 dark:text-white">
          {mindMap.root}
        </Text>
        <Pressable className="p-1">
          <Ionicons name="expand-outline" size={24} color={isDark ? '#fff' : '#000'} />
        </Pressable>
      </View>

      <ScrollView className="flex-1 p-4">
        <View className="mb-4 rounded-xl bg-yellow-50 p-4 dark:bg-yellow-900/20">
          <View className="flex-row items-center">
            <Ionicons name="information-circle" size={20} color="#CA8A04" />
            <Text className="ml-2 text-sm text-yellow-800 dark:text-yellow-200">
              This is a simplified tree view. Full interactive mind map visualization coming soon!
            </Text>
          </View>
        </View>

        {rootNode && <TreeNode node={rootNode} nodes={mindMap.nodes} isDark={isDark} />}
      </ScrollView>
    </SafeAreaView>
  );
}
