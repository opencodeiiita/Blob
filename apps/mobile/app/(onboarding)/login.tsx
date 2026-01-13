import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  useWindowDimensions,
  Animated,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { signInWithGoogle, isGoogleSignInAvailable } from '@/hooks/useGoogleAuth';
import { router } from 'expo-router';
import { trpc } from '@/utils/trpc';
import { useAuthStore } from '@/store/authStore';

const FLOW_STEPS = [
  {
    icon: 'bulb-outline' as const,
    label: 'Give a Topic',
    description: 'Choose what you want to learn',
  },
  {
    icon: 'sparkles-outline' as const,
    label: 'AI Generates Material',
    description: 'Get personalized content',
  },
  { icon: 'fitness-outline' as const, label: 'Practice', description: 'Interactive exercises' },
  { icon: 'trophy-outline' as const, label: 'Ace It!', description: 'Master your subject' },
];

export default function LoginScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const titleFade = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(0.95)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  const stepAnims = useRef(
    FLOW_STEPS.map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(20),
    }))
  ).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(titleFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      const stepAnimations = stepAnims.map((anim, index) =>
        Animated.parallel([
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration: 400,
            delay: index * 150,
            useNativeDriver: true,
          }),
          Animated.spring(anim.translateY, {
            toValue: 0,
            tension: 50,
            friction: 7,
            delay: index * 150,
            useNativeDriver: true,
          }),
        ])
      );

      Animated.parallel([
        ...stepAnimations,
        Animated.sequence([
          Animated.delay(stepAnims.length * 150),
          Animated.parallel([
            Animated.spring(buttonScale, {
              toValue: 1,
              tension: 50,
              friction: 7,
              useNativeDriver: true,
            }),
            Animated.timing(buttonOpacity, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]).start();
    });
  }, []);

  const login = useAuthStore((state) => state.login);
  const verifyToken = trpc.verifyGoogleToken.useMutation();

  const handleGoogleSignIn = async () => {
    if (!isGoogleSignInAvailable()) {
      Alert.alert(
        'Dev Build Required',
        'Google Sign-In is only available in dev builds. For testing in Expo Go, you will be redirected to the home screen.',
        [{ text: 'OK', onPress: () => router.push('/(tabs)/home') }]
      );
      return;
    }

    try {
      const { idToken } = await signInWithGoogle();
      if (!idToken) {
        Alert.alert('Sign-In Error', 'Failed to get ID token from Google.');
        return;
      }
      const result = await verifyToken.mutateAsync({ idToken });

      if (result.success && result.token && result.user) {
        await login(result.token, {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          image: result.user.image,
        });
      }

      router.replace('/(tabs)/home');
    } catch (error) {
      console.error('Sign-in error:', error);
      Alert.alert('Sign-In Error', 'Failed to sign in with Google. Please try again.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-950" edges={['top', 'left', 'right']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow justify-between px-6 py-12"
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <Animated.View
          className="flex-1 justify-center"
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}>
          <Animated.View style={{ opacity: titleFade }} className="mb-12">
            <Text className="mb-3 text-center text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Welcome to <Text className="text-orange-500">Blob</Text>
            </Text>
            <Text className="text-center text-lg text-gray-500 dark:text-gray-400">
              Your AI-powered study companion
            </Text>
          </Animated.View>

          <View className="space-y-4">
            {FLOW_STEPS.map((step, index) => (
              <Animated.View
                key={step.label}
                style={{
                  opacity: stepAnims[index].opacity,
                  transform: [{ translateY: stepAnims[index].translateY }],
                }}
                className="mb-6">
                <View className="flex-row items-center">
                  <View className="h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 dark:bg-orange-900/30">
                    <Ionicons name={step.icon} size={28} color="#f97316" />
                  </View>
                  <View className="ml-5 flex-1">
                    <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {step.label}
                    </Text>
                    <Text className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {step.description}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        <Animated.View
          className="mt-8"
          style={{ transform: [{ scale: buttonScale }], opacity: buttonOpacity }}>
          <Pressable
            className="mb-4 h-14 flex-row items-center justify-center rounded-2xl border border-gray-300 bg-white shadow-sm active:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:active:bg-gray-800"
            onPress={handleGoogleSignIn}>
            <Ionicons name="logo-google" size={20} color="#EA4335" />
            <Text className="ml-3 text-lg font-semibold text-gray-700 dark:text-gray-200">
              Continue with Google
            </Text>
          </Pressable>

          <Text className="px-4 text-center text-xs leading-5 text-gray-400 dark:text-gray-500">
            By continuing, you agree to our Terms and Privacy Policy
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
