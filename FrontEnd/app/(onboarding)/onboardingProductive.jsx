import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { icons } from '../../constants';

const OnboardingProductive = () => {
  const [selectedTime, setSelectedTime] = useState(null);
  const router = useRouter();

  const TimeButton = ({ timeRange, description }) => (
    <TouchableOpacity
      onPress={() => setSelectedTime(timeRange)}
      className={`w-full h-24 rounded-xl mb-4 flex justify-center px-4
        ${selectedTime === timeRange ? 'bg-sky-400' : 'bg-zinc-900/70'}`}
    >
      <Text className={`text-xl font-medium
        ${selectedTime === timeRange ? 'text-zinc-900' : 'text-white'}`}>
        {timeRange}
      </Text>
      <Text className={`text-base mt-1
        ${selectedTime === timeRange ? 'text-zinc-800' : 'text-zinc-400'}`}>
        {description}
      </Text>
    </TouchableOpacity>
  );

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
          When are you most{'\n'}productive?
        </Text>

        {/* Time Options */}
        <View className="flex-1 justify-center">
          <View className="w-full">
            <TimeButton 
              timeRange="04:00 - 12:00" 
              description="Morning worker"
            />
            <TimeButton 
              timeRange="12:00 - 18:00" 
              description="Afternoon worker"
            />
            <TimeButton 
              timeRange="18:00 - 04:00" 
              description="Night worker"
            />
          </View>
        </View>

        {/* Next Button */}
        <TouchableOpacity
          onPress={() => {
            if (selectedTime) {
              router.push('/onboardingStopping');
            }
          }}
          className={`w-full h-14 rounded-full items-center justify-center mb-4
            ${selectedTime ? 'bg-white' : 'bg-zinc-900/70'}`}
        >
          <Text className={`text-lg font-medium
            ${selectedTime ? 'text-black' : 'text-zinc-700'}`}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingProductive;
