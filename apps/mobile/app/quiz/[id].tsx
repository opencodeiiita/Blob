import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';

const PLACEHOLDER_QUIZ = {
  id: '1',
  title: 'JavaScript Basics Quiz',
  questions: [
    {
      id: '1',
      question: 'What is the correct way to declare a variable in JavaScript?',
      options: [
        { id: '1', text: 'var myVar = 5;', isCorrect: true },
        { id: '2', text: 'variable myVar = 5;', isCorrect: false },
        { id: '3', text: 'v myVar = 5;', isCorrect: false },
        { id: '4', text: 'int myVar = 5;', isCorrect: false },
      ],
    },
    {
      id: '2',
      question: 'Which method is used to add an element to the end of an array?',
      options: [
        { id: '1', text: 'push()', isCorrect: true },
        { id: '2', text: 'pop()', isCorrect: false },
        { id: '3', text: 'shift()', isCorrect: false },
        { id: '4', text: 'unshift()', isCorrect: false },
      ],
    },
  ],
};

export default function QuizTakeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const isLoading = false;
  const quiz = PLACEHOLDER_QUIZ;

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const hasSelectedAnswer = selectedAnswers[currentQuestion?.id];

  const handleSelectOption = (optionId: string) => {
    if (showResults) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: optionId,
    });
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResults(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((question) => {
      const selectedOptionId = selectedAnswers[question.id];
      const correctOption = question.options.find((o) => o.isCorrect);
      if (selectedOptionId === correctOption?.id) {
        correct++;
      }
    });
    return correct;
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white dark:bg-black">
        <ActivityIndicator size="large" color={isDark ? '#60A5FA' : '#2563EB'} />
      </SafeAreaView>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / quiz.questions.length) * 100);

    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-black">
        <View className="flex-1 items-center justify-center p-6">
          <View className="mb-6 h-32 w-32 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <Text className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              {percentage}%
            </Text>
          </View>
          <Text className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            Quiz Complete!
          </Text>
          <Text className="mb-6 text-gray-600 dark:text-gray-400">
            You got {score} out of {quiz.questions.length} questions correct
          </Text>
          <Pressable
            onPress={() => router.back()}
            className="rounded-lg bg-blue-600 px-8 py-3 active:bg-blue-700">
            <Text className="font-semibold text-white">Done</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <View className="flex-row items-center border-b border-gray-200 p-4 dark:border-gray-800">
        <Pressable onPress={() => router.back()} className="mr-4 p-1">
          <Ionicons name="close" size={24} color={isDark ? '#fff' : '#000'} />
        </Pressable>
        <Text className="flex-1 text-center text-lg font-semibold text-gray-900 dark:text-white">
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </Text>
        <View className="w-10" />
      </View>

      <View className="h-1 bg-gray-200 dark:bg-gray-800">
        <View
          className="h-full bg-blue-600"
          style={{
            width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
          }}
        />
      </View>

      <ScrollView className="flex-1 p-4">
        <Text className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
          {currentQuestion.question}
        </Text>

        {currentQuestion.options.map((option) => {
          const isSelected = selectedAnswers[currentQuestion.id] === option.id;
          return (
            <Pressable
              key={option.id}
              onPress={() => handleSelectOption(option.id)}
              className={`mb-3 flex-row items-center rounded-xl border-2 p-4 ${
                isSelected
                  ? 'border-blue-600 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                  : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900'
              }`}>
              <View
                className={`mr-3 h-6 w-6 items-center justify-center rounded-full border-2 ${
                  isSelected
                    ? 'border-blue-600 bg-blue-600'
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                {isSelected && <Ionicons name="checkmark" size={14} color="white" />}
              </View>
              <Text
                className={`flex-1 ${
                  isSelected
                    ? 'font-medium text-blue-900 dark:text-blue-100'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                {option.text}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View className="flex-row items-center justify-between border-t border-gray-200 p-4 dark:border-gray-800">
        <Pressable
          onPress={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className={`flex-row items-center rounded-lg px-4 py-3 ${
            currentQuestionIndex === 0
              ? 'opacity-50'
              : 'bg-gray-100 active:bg-gray-200 dark:bg-gray-800'
          }`}>
          <Ionicons name="chevron-back" size={20} color={isDark ? '#fff' : '#000'} />
          <Text className="ml-1 font-medium text-gray-900 dark:text-white">Previous</Text>
        </Pressable>

        <Pressable
          onPress={handleNext}
          disabled={!hasSelectedAnswer}
          className={`flex-row items-center rounded-lg px-4 py-3 ${
            !hasSelectedAnswer ? 'bg-gray-300 dark:bg-gray-700' : 'bg-blue-600 active:bg-blue-700'
          }`}>
          <Text className="mr-1 font-medium text-white">{isLastQuestion ? 'Finish' : 'Next'}</Text>
          <Ionicons
            name={isLastQuestion ? 'checkmark' : 'chevron-forward'}
            size={20}
            color="white"
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
