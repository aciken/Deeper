import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { icons } from '../../constants';

const StoppingSelect = () => {
  const router = useRouter();
  const { onboardingData: onboardingDataString } = useLocalSearchParams();
  
  const [onboardingData, setOnboardingData] = useState(null);
  const [selectedStopping, setSelectedStopping] = useState(null);

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

  const handleStoppingSelect = (stopping) => {
    setSelectedStopping(stopping);
    if (onboardingData) {
      setOnboardingData(prev => ({...prev, stopping: stopping}));
    }
  };

  const handleNext = () => {
    if (selectedStopping && onboardingData) {
      const updatedData = {
        ...onboardingData,
        stopping: selectedStopping
      };
      router.push({
        pathname: '/onboardingWork',
        params: { onboardingData: JSON.stringify(updatedData) }
      });
    }
  };

  const stoppingOptions = [
    {
      title: "Social media",
      description: "I get distracted by social platforms"
    },
    {
      title: "Lack of motivation",
      description: "I struggle to stay motivated"
    },
    {
      title: "External distractions",
      description: "People or events interrupt me"
    },
    {
      title: "Poor time management",
      description: "I don't organize my time well"
    }
  ];

  const StoppingButton = ({ option }) => (
    <TouchableOpacity
      onPress={() => handleStoppingSelect(option.title)}
      className={`w-full h-20 rounded-xl mb-4 flex justify-center px-4
        ${selectedStopping === option.title ? 'bg-sky-400' : 'bg-zinc-900/70'}`}
    >
      <Text className={`text-lg font-medium
        ${selectedStopping === option.title ? 'text-zinc-900' : 'text-white'}`}>
        {option.title}
      </Text>
      <Text className={`text-sm mt-1
        ${selectedStopping === option.title ? 'text-zinc-800' : 'text-zinc-400'}`}>
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
          What's stopping you from being more productive?
        </Text>

        {/* Stopping Options */}
        <View className="flex-1 justify-center">
          <View className="w-full">
            {stoppingOptions.map((option) => (
              <StoppingButton key={option.title} option={option} />
            ))}
          </View>
        </View>

        {/* Next Button */}
        <TouchableOpacity
          onPress={handleNext}
          className={`w-full h-14 rounded-full items-center justify-center mt-auto mb-4
            ${selectedStopping ? 'bg-white' : 'bg-zinc-900/70'}`}
        >
          <Text className={`text-lg font-medium
            ${selectedStopping ? 'text-black' : 'text-zinc-700'}`}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default StoppingSelect;
