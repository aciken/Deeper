import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { icons } from '../../constants';
import Slider from '@react-native-community/slider';

const OnboardingDeepTime = () => {
  const [deepHours, setDeepHours] = useState(8);
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
        <Text className="text-white text-4xl font-bold mt-2">
          How many of those{'\n'}working hours are{'\n'}deep work?
        </Text>

        {/* Hours Display */}
        <View className="flex-1 justify-center items-end">
          <Text className="text-white text-4xl font-bold mb-8">
            {deepHours}h
          </Text>

          {/* Slider */}
          <View className="w-full">
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={24}
              step={1}
              value={deepHours}
              onValueChange={setDeepHours}
              minimumTrackTintColor="#0EA5E9"
              maximumTrackTintColor="#3F3F46"
              thumbTintColor="white"
            />
          </View>
        </View>

        {/* Next Button */}
        <TouchableOpacity
          onPress={() => router.push('/onboardingProductive')}
          className="w-full h-14 rounded-full items-center justify-center mb-4 bg-white"
        >
          <Text className="text-lg font-medium text-black">
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingDeepTime;
