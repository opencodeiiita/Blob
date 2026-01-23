import { useMemo } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { quotes } from '../quotes';

export default function LoadingScreen() {
  const quote = useMemo(() => {
    return quotes[Math.floor(Math.random() * quotes.length)];
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/loading.gif')}
        style={styles.gif}
        resizeMode="contain"
      />

      <Text style={styles.quote}>
        ✦ {quote}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  gif: {
    width: 120,
    height: 120,
    marginBottom: 22,
  },
  quote: {
    fontSize: 14,
    color: '#c2410c',
    textAlign: 'center',
    lineHeight: 21,
    fontWeight: '500',
    letterSpacing: 0.25,
    opacity: 0.9,
  },
});
