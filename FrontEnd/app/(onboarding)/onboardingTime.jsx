import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { icons } from '../../constants';

const TimeSelect = () => {
  const router = useRouter();
  const { onboardingData: onboardingDataString } = useLocalSearchParams();
  
  const [onboardingData, setOnboardingData] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    if (onboardingDataString) {
      try {
        const parsedData = JSON.parse(onboardingDataString);
        setOnboardingData(parsedData);
        console.log('Received data:', parsedData); // Debug log
      } catch (error) {
        console.error('Error parsing onboarding data:', error);
        setOnboardingData({
          gender: null,
          born: null,
          time: null,
          deeptime: null,
          productive: null,
          stopping: null,
          work: null,
          workname: null,
          worktime: null,
        });
      }
    }
  }, [onboardingDataString]);

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    if (onboardingData) {
      setOnboardingData(prev => ({...prev, time: time}));
    }
  };

  const handleNext = () => {
    if (selectedTime && onboardingData) {
      const updatedData = {
        ...onboardingData,
        time: selectedTime
      };
      router.push({
        pathname: '/onboardingDeeptime',
        params: { onboardingData: JSON.stringify(updatedData) }
      });
    }
  };

  const timeOptions = [
    "Less than 2 hours",
    "2-4 hours",
    "4-6 hours",
    "6-8 hours",
    "More than 8 hours"
  ];

  const TimeButton = ({ time }) => (
    <TouchableOpacity
      onPress={() => handleTimeSelect(time)}
      className={`w-full h-14 rounded-xl mb-4 flex items-center justify-center
        ${selectedTime === time ? 'bg-sky-400' : 'bg-zinc-900/70'}`}
    >
      <Text className={`text-lg font-medium
        ${selectedTime === time ? 'text-zinc-900' : 'text-white'}`}>
        {time}
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
        <Text className="text-white text-4xl font-bold mt-2">
          How much time do you spend working daily?
        </Text>

        {/* Time Options */}
        <View className="flex-1 justify-center">
          <View className="w-full">
            {timeOptions.map((time) => (
              <TimeButton key={time} time={time} />
            ))}
          </View>
        </View>

        {/* Next Button */}
        <TouchableOpacity
          onPress={handleNext}
          className={`w-full h-14 rounded-full items-center justify-center mt-auto mb-4
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

export default TimeSelect;