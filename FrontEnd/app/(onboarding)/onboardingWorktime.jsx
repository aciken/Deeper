import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { icons } from '../../constants';

const WorktimeSelect = () => {
  const router = useRouter();
  const { onboardingData: onboardingDataString } = useLocalSearchParams();
  
  const [onboardingData, setOnboardingData] = useState(null);
  const [selectedWorktime, setSelectedWorktime] = useState(null);

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

  const handleWorktimeSelect = (worktime) => {
    setSelectedWorktime(worktime);
    if (onboardingData) {
      setOnboardingData(prev => ({...prev, worktime: worktime}));
    }
  };

  const handleNext = () => {
    if (selectedWorktime && onboardingData) {
      const updatedData = {
        ...onboardingData,
        worktime: selectedWorktime
      };
      router.push({
        pathname: '/onboardingResults',
        params: { onboardingData: JSON.stringify(updatedData) }
      });
    }
  };

  const worktimeOptions = [
    {
      title: "Morning",
      description: "4:00 AM - 12:00 PM"
    },
    {
      title: "Afternoon",
      description: "12:00 PM - 6:00 PM"
    },
    {
      title: "Evening",
      description: "6:00 PM - 10:00 PM"
    },
    {
      title: "Night",
      description: "10:00 PM - 4:00 AM"
    },
    {
      title: "Flexible",
      description: "No specific time preference"
    }
  ];

  const WorktimeButton = ({ option }) => (
    <TouchableOpacity
      onPress={() => handleWorktimeSelect(option.title)}
      className={`w-full h-20 rounded-xl mb-4 flex justify-center px-4
        ${selectedWorktime === option.title ? 'bg-sky-400' : 'bg-zinc-900/70'}`}
    >
      <Text className={`text-lg font-medium
        ${selectedWorktime === option.title ? 'text-zinc-900' : 'text-white'}`}>
        {option.title}
      </Text>
      <Text className={`text-sm mt-1
        ${selectedWorktime === option.title ? 'text-zinc-800' : 'text-zinc-400'}`}>
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
          When do you prefer to work?
        </Text>

        {/* Worktime Options */}
        <View className="flex-1 justify-center">
          <View className="w-full">
            {worktimeOptions.map((option) => (
              <WorktimeButton key={option.title} option={option} />
            ))}
          </View>
        </View>

        {/* Next Button */}
        <TouchableOpacity
          onPress={handleNext}
          className={`w-full h-14 rounded-full items-center justify-center mt-auto mb-4
            ${selectedWorktime ? 'bg-white' : 'bg-zinc-900/70'}`}
        >
          <Text className={`text-lg font-medium
            ${selectedWorktime ? 'text-black' : 'text-zinc-700'}`}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default WorktimeSelect;