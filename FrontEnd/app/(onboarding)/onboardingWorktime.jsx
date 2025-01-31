import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { icons } from '../../constants';

const WorktimeSelect = () => {
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
      setOnboardingData(prev => ({...prev, worktime: time}));
    }
  };

  const handleNext = () => {
    if (selectedTime && onboardingData) {
      const updatedData = {
        ...onboardingData,
        worktime: selectedTime
      };
      router.push({
        pathname: '/sign-up',
        params: { onboardingData: JSON.stringify(updatedData) }
      });
    }
  };

  const timeOptions = [
    {
      title: "1 hour",
      description: "Quick daily session"
    },
    {
      title: "2 hours",
      description: "Standard focus period"
    },
    {
      title: "4 hours",
      description: "Half day dedication"
    },
    {
      title: "6 hours",
      description: "Major daily commitment"
    },
    {
      title: "8 hours",
      description: "Full-time dedication"
    }
  ];

  const TimeButton = ({ option }) => (
    <TouchableOpacity
      onPress={() => handleTimeSelect(option.title.split(' ')[0]+'h')}
      className={`w-full h-20 rounded-xl mb-4 flex justify-center px-4
        ${selectedTime === option.title.split(' ')[0]+'h' ? 'bg-sky-400' : 'bg-zinc-900/70'}`}
    >
      <Text className={`text-lg font-medium
        ${selectedTime === option.title.split(' ')[0]+'h' ? 'text-zinc-900' : 'text-white'}`}>
        {option.title}
      </Text>
      <Text className={`text-sm mt-1
        ${selectedTime === option.title.split(' ')[0]+'h' ? 'text-zinc-800' : 'text-zinc-400'}`}>
        {option.description}
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
          How much time you plan to spend on {onboardingData?.workname}?
        </Text>

        {/* Time Options */}
        <View className="flex-1 justify-center">
          <View className="w-full">
            {timeOptions.map((option) => (
              <TimeButton key={option.title} option={option} />
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

export default WorktimeSelect;