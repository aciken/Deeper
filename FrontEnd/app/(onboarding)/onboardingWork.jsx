import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { icons } from '../../constants';

const WorkSelect = () => {
  const router = useRouter();
  const { onboardingData: onboardingDataString } = useLocalSearchParams();
  
  const [onboardingData, setOnboardingData] = useState(null);
  const [selectedWork, setSelectedWork] = useState(null);

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

  const handleWorkSelect = (work) => {
    setSelectedWork(work);
    if (onboardingData) {
      setOnboardingData(prev => ({...prev, work: work}));
    }
  };

  const handleNext = () => {
    if (selectedWork && onboardingData) {
      const updatedData = {
        ...onboardingData,
        work: selectedWork
      };
      router.push({
        pathname: '/onboardingWorkname',
        params: { onboardingData: JSON.stringify(updatedData) }
      });
    }
  };

  const workOptions = [
    {
      title: "Student",
      description: "Studying and academic work"
    },
    {
      title: "Professional",
      description: "Full-time career work"
    },
    {
      title: "Creative",
      description: "Artistic or creative projects"
    },
    {
      title: "Entrepreneur",
      description: "Running your own business"
    },
  ];

  const WorkButton = ({ option }) => (
    <TouchableOpacity
      onPress={() => handleWorkSelect(option.title)}
      className={`w-full h-20 rounded-xl mb-4 flex justify-center px-4
        ${selectedWork === option.title ? 'bg-sky-400' : 'bg-zinc-900/70'}`}
    >
      <Text className={`text-lg font-medium
        ${selectedWork === option.title ? 'text-zinc-900' : 'text-white'}`}>
        {option.title}
      </Text>
      <Text className={`text-sm mt-1
        ${selectedWork === option.title ? 'text-zinc-800' : 'text-zinc-400'}`}>
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
          What type of work do you do?
        </Text>

        {/* Work Options */}
        <View className="flex-1 justify-center">
          <View className="w-full">
            {workOptions.map((option) => (
              <WorkButton key={option.title} option={option} />
            ))}
          </View>
        </View>

        {/* Next Button */}
        <TouchableOpacity
          onPress={handleNext}
          className={`w-full h-14 rounded-full items-center justify-center mt-auto mb-4
            ${selectedWork ? 'bg-white' : 'bg-zinc-900/70'}`}
        >
          <Text className={`text-lg font-medium
            ${selectedWork ? 'text-black' : 'text-zinc-700'}`}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default WorkSelect;