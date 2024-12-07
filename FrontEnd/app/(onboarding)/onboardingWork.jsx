import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { icons } from '../../constants';

const OnboardingWork = () => {
  const [workName, setWorkName] = useState('');
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 px-4">
        {/* Header */}
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-zinc-900 items-center justify-center mt-2"
        >
          <Image 
            source={icons.backIcon}
            className="w-6 h-6 tint-white"
          />
        </TouchableOpacity>

        {/* Title */}
        <Text className="text-white text-4xl font-bold mt-2 mb-8">
          Add something you{'\n'}want to work on:
        </Text>

        {/* Work Input */}
        <View className="flex-1 justify-center">
          <TextInput
            value={workName}
            onChangeText={setWorkName}
            placeholder="work name"
            placeholderTextColor="#52525b"
            className="w-full h-14 bg-zinc-900/70 rounded-xl px-4 text-white text-lg"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Next Button */}
        <TouchableOpacity
          onPress={() => {
            if (workName.trim()) {
              router.push('/onboardingWorktime');
            }
          }}
          className={`w-full h-14 rounded-full items-center justify-center mb-4
            ${workName.trim() ? 'bg-white' : 'bg-zinc-900/70'}`}
        >
          <Text className={`text-lg font-medium
            ${workName.trim() ? 'text-black' : 'text-zinc-700'}`}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingWork;