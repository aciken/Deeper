import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { icons } from '../../constants';

const DeeptimeSelect = () => {
  const router = useRouter();
  const { onboardingData: onboardingDataString } = useLocalSearchParams();
  
  const [onboardingData, setOnboardingData] = useState(null);
  const [selectedDeeptime, setSelectedDeeptime] = useState(null);

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

  const handleDeeptimeSelect = (deeptime) => {
    setSelectedDeeptime(deeptime);
    if (onboardingData) {
      setOnboardingData(prev => ({...prev, deeptime: deeptime}));
    }
  };

  const handleNext = () => {
    if (selectedDeeptime && onboardingData) {
      const updatedData = {
        ...onboardingData,
        deeptime: selectedDeeptime
      };
      router.push({
        pathname: '/onboardingProductive',
        params: { onboardingData: JSON.stringify(updatedData) }
      });
    }
  };

  const deeptimeOptions = [
    "Less than 1 hour",
    "1-2 hours",
    "2-4 hours",
    "4-6 hours",
    "More than 6 hours"
  ];

  const DeeptimeButton = ({ deeptime }) => (
    <TouchableOpacity
      onPress={() => handleDeeptimeSelect(deeptime)}
      className={`w-full h-14 rounded-xl mb-4 flex items-center justify-center
        ${selectedDeeptime === deeptime ? 'bg-sky-400' : 'bg-zinc-900/70'}`}
    >
      <Text className={`text-lg font-medium
        ${selectedDeeptime === deeptime ? 'text-zinc-900' : 'text-white'}`}>
        {deeptime}
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
          How much deep work do you do daily?
        </Text>

        {/* Deeptime Options */}
        <View className="flex-1 justify-center">
          <View className="w-full">
            {deeptimeOptions.map((deeptime) => (
              <DeeptimeButton key={deeptime} deeptime={deeptime} />
            ))}
          </View>
        </View>

        {/* Next Button */}
        <TouchableOpacity
          onPress={handleNext}
          className={`w-full h-14 rounded-full items-center justify-center mt-auto mb-4
            ${selectedDeeptime ? 'bg-white' : 'bg-zinc-900/70'}`}
        >
          <Text className={`text-lg font-medium
            ${selectedDeeptime ? 'text-black' : 'text-zinc-700'}`}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DeeptimeSelect;
