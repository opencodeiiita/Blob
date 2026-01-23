import { useEffect, useRef } from 'react';
import { View, Text, Pressable, Image, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function GettingStartedScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(30)).current;
  const titleFade = useRef(new Animated.Value(0)).current;
  const descriptionSlide = useRef(new Animated.Value(20)).current;
  const descriptionFade = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(0.9)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonSlide = useRef(new Animated.Value(20)).current;
  const footerFade = useRef(new Animated.Value(0)).current;

  // Add breathing effect to logo after initial animation
  const breathingAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Main animation sequence
    Animated.sequence([
      // Stage 1: Container fade in and logo entrance
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 40,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      
      // Stage 2: Title animation
      Animated.parallel([
        Animated.timing(titleFade, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(titleSlide, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      
      // Stage 3: Description animation
      Animated.parallel([
        Animated.timing(descriptionFade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(descriptionSlide, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Stage 4: Button and footer animation
      Animated.parallel([
        Animated.spring(buttonScale, {
          toValue: 1,
          tension: 60,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(buttonSlide, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(footerFade, {
          toValue: 1,
          duration: 600,
          delay: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Start breathing animation for logo after everything loads
        Animated.loop(
          Animated.sequence([
            Animated.timing(breathingAnimation, {
              toValue: 1.05,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(breathingAnimation, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
          ])
        ).start();
      });
    });
  }, []);

  const logoRotateInterpolate = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-10deg', '0deg'],
  });

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-950" edges={['top', 'left', 'right']}>
      <Animated.View
        className="flex-1 items-center justify-center px-6"
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}>
        <Animated.Image
          source={require('../../assets/adaptive-icon.png')}
          style={{
            width: 150,
            height: 150,
            marginBottom: 32,
            transform: [
              { scale: Animated.multiply(logoScale, breathingAnimation) },
              { rotate: logoRotateInterpolate },
            ],
          }}
          resizeMode="contain"
        />

        <Animated.View
          style={{
            opacity: titleFade,
            transform: [{ translateY: titleSlide }],
          }}>
          <Text className="mb-4 text-center text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Learn Smarter with <Text className="text-orange-500">Blob</Text>
          </Text>
        </Animated.View>

        <Animated.View
          style={{
            opacity: descriptionFade,
            transform: [{ translateY: descriptionSlide }],
          }}>
          <Text className="px-5 text-center text-lg leading-6 text-gray-500 dark:text-gray-400">
            Your AI-powered study companion. Transform notes into interactive flashcards and quizzes
            instantly.
          </Text>
        </Animated.View>
      </Animated.View>

      <Animated.View
        className="px-6 pb-8"
        style={{
          transform: [{ scale: buttonScale }, { translateY: buttonSlide }],
          opacity: buttonOpacity,
        }}>
        <Pressable
          className="mb-4 h-14 flex-row items-center justify-center rounded-2xl bg-orange-500 shadow-sm active:bg-orange-600 dark:bg-orange-600 dark:active:bg-orange-700"
          onPress={() => router.push('/(onboarding)/login')}>
          <Text className="mr-2 text-lg font-semibold text-white">Continue</Text>
          <Ionicons name="arrow-forward" size={18} color="white" />
        </Pressable>

        <Animated.View style={{ opacity: footerFade }}>
          <Text className="px-4 text-center text-xs leading-5 text-gray-400 dark:text-gray-500">
            By continuing, you agree to our Terms and Privacy Policy
          </Text>
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
}
