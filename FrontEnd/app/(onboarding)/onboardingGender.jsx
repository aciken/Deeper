import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { icons } from '../../constants';

const GenderSelect = () => {
  const [selectedGender, setSelectedGender] = useState(null);
  const router = useRouter();

  const GenderButton = ({ gender }) => (
    <TouchableOpacity
      onPress={() => setSelectedGender(gender)}
      className={`w-full h-14 rounded-xl mb-4 flex items-center justify-center
        ${selectedGender === gender ? 'bg-sky-400' : 'bg-zinc-900/70'}`}
    >
      <Text className={`text-white text-lg font-medium
        ${selectedGender === gender ? 'text-zinc-900' : 'text-white'}`}>
        {gender}
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
          Choose your Gender
        </Text>

        {/* Gender Options - Now centered vertically */}
        <View className="flex-1 justify-center">
          <View className="w-full">
            <GenderButton gender="Male" />
            <GenderButton gender="Female" />
            <GenderButton gender="Other" />
          </View>
        </View>

        {/* Next Button */}
        <TouchableOpacity
          onPress={() => {
            if (selectedGender) {
              // Handle navigation or data submission
              router.push('/onboardingBorn');
            }
          }}
          className={`w-full h-14 rounded-full items-center justify-center mt-auto mb-4
            ${selectedGender ? 'bg-white' : 'bg-zinc-900/70'}`}
        >
          <Text className={`text-lg font-medium
            ${selectedGender ? 'text-black' : 'text-zinc-700'}`}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default GenderSelect;