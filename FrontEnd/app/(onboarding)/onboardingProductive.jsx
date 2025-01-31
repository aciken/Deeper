import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { icons } from '../../constants';

const ProductiveSelect = () => {
  const router = useRouter();
  const { onboardingData: onboardingDataString } = useLocalSearchParams();
  
  const [onboardingData, setOnboardingData] = useState(null);
  const [selectedProductive, setSelectedProductive] = useState(null);

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

  const handleProductiveSelect = (productive) => {
    setSelectedProductive(productive);
    if (onboardingData) {
      setOnboardingData(prev => ({...prev, productive: productive}));
    }
  };

  const handleNext = () => {
    if (selectedProductive && onboardingData) {
      const updatedData = {
        ...onboardingData,
        productive: selectedProductive
      };
      router.push({
        pathname: '/onboardingStopping',
        params: { onboardingData: JSON.stringify(updatedData) }
      });
    }
  };

  const productiveOptions = [
    {
      title: "Not productive",
      description: "I get distracted easily"
    },
    {
      title: "Somewhat productive",
      description: "I can focus but need improvement"
    },
    {
      title: "Very productive",
      description: "I stay focused most of the time"
    },
    {
      title: "Extremely productive",
      description: "I'm a productivity machine"
    }
  ];

  const ProductiveButton = ({ option }) => (
    <TouchableOpacity
      onPress={() => handleProductiveSelect(option.title)}
      className={`w-full h-20 rounded-xl mb-4 flex justify-center px-4
        ${selectedProductive === option.title ? 'bg-sky-400' : 'bg-zinc-900/70'}`}
    >
      <Text className={`text-lg font-medium
        ${selectedProductive === option.title ? 'text-zinc-900' : 'text-white'}`}>
        {option.title}
      </Text>
      <Text className={`text-sm mt-1
        ${selectedProductive === option.title ? 'text-zinc-800' : 'text-zinc-400'}`}>
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
          How productive are you currently?
        </Text>

        {/* Productive Options */}
        <View className="flex-1 justify-center">
          <View className="w-full">
            {productiveOptions.map((option) => (
              <ProductiveButton key={option.title} option={option} />
            ))}
          </View>
        </View>

        {/* Next Button */}
        <TouchableOpacity
          onPress={handleNext}
          className={`w-full h-14 rounded-full items-center justify-center mt-auto mb-4
            ${selectedProductive ? 'bg-white' : 'bg-zinc-900/70'}`}
        >
          <Text className={`text-lg font-medium
            ${selectedProductive ? 'text-black' : 'text-zinc-700'}`}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProductiveSelect;
