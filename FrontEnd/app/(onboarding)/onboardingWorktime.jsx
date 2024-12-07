import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { icons } from '../../constants';
import DateTimePicker from '@react-native-community/datetimepicker';


const OnboardingWorktime = () => {
  const [time, setTime] = useState(new Date());
  const router = useRouter();

  const onTimeChange = (event, selectedTime) => {
    if (selectedTime) {
      setTime(selectedTime);
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
        <Text className="text-white text-4xl font-bold mt-2 mb-8">
        How many hours per day you want to work on it?
        </Text>

        {/* Time Picker */}
        <View className="flex-1 justify-center items-center">
          <DateTimePicker
            value={time}
            mode="time"
            is24Hour={true}
            display="spinner"
            onChange={onTimeChange}
            textColor="white"
            themeVariant="dark"
            style={{ width: '100%' }}
          />
        </View>

        {/* Next Button */}
        <TouchableOpacity
          onPress={() => router.push('/onboardingSettingup')}
          className="w-full h-14 rounded-full items-center justify-center mb-4 bg-white"
        >
          <Text className="text-lg font-medium text-black">
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingWorktime;