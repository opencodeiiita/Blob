import { View, Text } from 'react-native';
import { useEffect } from 'react';
import { initDatabase } from '../src/db';

export default function Index() {
  useEffect(() => {
    initDatabase()
      .then(() => console.log('SQLite initialized'))
      .catch(err => console.error('SQLite init failed', err));
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home</Text>
    </View>
  );
}