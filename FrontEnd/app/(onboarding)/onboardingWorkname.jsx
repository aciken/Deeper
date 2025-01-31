import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { icons } from '../../constants';

const WorknameSelect = () => {
  const router = useRouter();
  const { onboardingData: onboardingDataString } = useLocalSearchParams();
  
  const [onboardingData, setOnboardingData] = useState(null);
  const [workname, setWorkname] = useState('');

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

  const handleNext = () => {
    if (workname.trim() && onboardingData) {
      const updatedData = {
        ...onboardingData,
        workname: workname.trim()
      };
      router.push({
        pathname: '/onboardingWorktime',
        params: { onboardingData: JSON.stringify(updatedData) }
      });
    }
  };

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
          What are you working on?
        </Text>

        {/* Work Name Input */}
        <View className="flex-1 justify-center">
          <TextInput
            value={workname}
            onChangeText={setWorkname}
            placeholder="Enter work name"
            placeholderTextColor="#52525b"
            className="w-full h-14 bg-zinc-900/70 rounded-xl px-4 text-white text-lg"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Next Button */}
        <TouchableOpacity
          onPress={handleNext}
          className={`w-full h-14 rounded-full items-center justify-center mt-auto mb-4
            ${workname.trim() ? 'bg-white' : 'bg-zinc-900/70'}`}
        >
          <Text className={`text-lg font-medium
            ${workname.trim() ? 'text-black' : 'text-zinc-700'}`}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default WorknameSelect;
