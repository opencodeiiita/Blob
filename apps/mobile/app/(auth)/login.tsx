import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { MotiView } from "moti";

export default function LoginScreen() {
  return (
    <View className="flex-1 bg-black px-6 justify-center">
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 400 }}
        className="space-y-6"
      >
        <Text className="text-4xl font-bold text-white">
          Welcome back
        </Text>

        <Text className="text-base text-gray-400">
          Continue with your Google account
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          className="mt-8 flex-row items-center justify-center rounded-2xl bg-white py-4"
        >
          <Image
            source={{ uri: "https://developers.google.com/identity/images/g-logo.png" }}
            className="h-5 w-5 mr-3"
          />
          <Text className="text-base font-semibold text-black">
            Continue with Google
          </Text>
        </TouchableOpacity>
      </MotiView>
    </View>
  );
}

