import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { icons } from '../../constants';

const OnboardingStopping = () => {
  const [selectedReason, setSelectedReason] = useState(null);
  const router = useRouter();

  const ReasonButton = ({ reason }) => (
    <TouchableOpacity
      onPress={() => setSelectedReason(reason)}
      className={`w-full h-16 rounded-xl mb-4 flex justify-center px-4
        ${selectedReason === reason ? 'bg-sky-400' : 'bg-zinc-900/70'}`}
    >
      <Text className={`text-xl font-medium
        ${selectedReason === reason ? 'text-zinc-900' : 'text-white'}`}>
        {reason}
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
          What's stopping you{'\n'}from working more?
        </Text>

        {/* Reason Options */}
        <View className="flex-1 justify-center">
          <View className="w-full">
            <ReasonButton reason="Lack of motivation" />
            <ReasonButton reason="Distractions" />
            <ReasonButton reason="Burnout" />
            <ReasonButton reason="Lack of routine" />
          </View>
        </View>

        {/* Next Button */}
        <TouchableOpacity
          onPress={() => {
            if (selectedReason) {
              router.push('/next-screen');
            }
          }}
          className={`w-full h-14 rounded-full items-center justify-center mb-4
            ${selectedReason ? 'bg-white' : 'bg-zinc-900/70'}`}
        >
          <Text className={`text-lg font-medium
            ${selectedReason ? 'text-black' : 'text-zinc-700'}`}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingStopping;
