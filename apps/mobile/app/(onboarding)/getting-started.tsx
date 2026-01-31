import { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import {
  SafeAreaView,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const containerFade = useRef(new Animated.Value(0)).current;
  const containerSlide = useRef(new Animated.Value(40)).current;

  const logoScale = useRef(new Animated.Value(0.85)).current;
  const logoIdle = useRef(new Animated.Value(1)).current;

  const titleFade = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(24)).current;

  const descFade = useRef(new Animated.Value(0)).current;
  const descSlide = useRef(new Animated.Value(20)).current;

  const buttonFade = useRef(new Animated.Value(0)).current;
  const buttonSlide = useRef(new Animated.Value(16)).current;

  const footerFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(containerFade, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(containerSlide, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 30,
          friction: 10,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(titleFade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(titleSlide, {
          toValue: 0,
          tension: 40,
          friction: 9,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(descFade, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.spring(descSlide, {
          toValue: 0,
          tension: 40,
          friction: 9,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(buttonFade, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(buttonSlide, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(footerFade, {
          toValue: 1,
          duration: 400,
          delay: 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(logoIdle, {
              toValue: 1.03,
              duration: 3000,
              useNativeDriver: true,
            }),
            Animated.timing(logoIdle, {
              toValue: 1,
              duration: 3000,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }, 800);
    });
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <Animated.View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 24,
            opacity: containerFade,
            transform: [{ translateY: containerSlide }],
          }}
        >
          <Animated.Image
            source={{
              uri: 'https://docs.expo.dev/static/images/tutorial/background.png',
            }}
            resizeMode="contain"
            style={{
              width: 140,
              height: 140,
              marginBottom: 28,
              transform: [{ scale: Animated.multiply(logoScale, logoIdle) }],
            }}
          />

          <Animated.View
            style={{
              opacity: titleFade,
              transform: [{ translateY: titleSlide }],
            }}
          >
            <Text
              style={{
                fontSize: 32,
                fontWeight: '800',
                textAlign: 'center',
                color: '#111',
              }}
            >
              Learn Smarter with <Text style={{ color: '#f97316' }}>Blob</Text>
            </Text>
          </Animated.View>

          <Animated.View
            style={{
              opacity: descFade,
              transform: [{ translateY: descSlide }],
            }}
          >
            <Text
              style={{
                marginTop: 12,
                fontSize: 16,
                color: '#666',
                textAlign: 'center',
                lineHeight: 22,
              }}
            >
              Your AI-powered study companion. Transform notes into interactive
              flashcards and quizzes instantly.
            </Text>
          </Animated.View>
        </Animated.View>

        <Animated.View
          style={{
            paddingHorizontal: 24,
            paddingBottom: 32,
            opacity: buttonFade,
            transform: [{ translateY: buttonSlide }],
          }}
        >
          <Pressable
            style={{
              height: 56,
              backgroundColor: '#f97316',
              borderRadius: 18,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => console.log('Continue pressed')}
          >
            <Text
              style={{
                color: 'white',
                fontSize: 18,
                fontWeight: '600',
              }}
            >
              Continue
            </Text>
            <Ionicons
              name="arrow-forward"
              size={18}
              color="white"
              style={{ marginLeft: 8 }}
            />
          </Pressable>

          <Animated.Text
            style={{
              marginTop: 14,
              fontSize: 11,
              textAlign: 'center',
              color: '#999',
              opacity: footerFade,
            }}
          >
            By continuing, you agree to our Terms and Privacy Policy
          </Animated.Text>
        </Animated.View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
