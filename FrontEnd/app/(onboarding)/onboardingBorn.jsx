import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { icons } from '../../constants';
import { Picker } from '@react-native-picker/picker';

const OnboardingBorn = () => {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [selectedDay, setSelectedDay] = useState('1');
  const [selectedYear, setSelectedYear] = useState('2024');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const years = Array.from({ length: 100 }, (_, i) => (2027 - i).toString());

  const isDateValid = selectedMonth && selectedDay && selectedYear;

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

        {/* Title and Subtitle */}
        <Text className="text-white text-4xl font-bold mt-2">
          When were you born?
        </Text>




        {/* Date Pickers */}
        <View className="flex-1 justify-center">
          <View className="flex-row justify-center">
            {/* Month Picker */}
            <View className="flex-1 mx-1">
              <Picker
                selectedValue={selectedMonth}
                onValueChange={setSelectedMonth}
                itemStyle={{ color: 'white', height: 150 }}
                style={{ backgroundColor: 'transparent', color: 'white' }}
              >
                {months.map((month) => (
                  <Picker.Item key={month} label={month} value={month} />
                ))}
              </Picker>
            </View>

            {/* Day Picker */}
            <View className="flex-1 mx-1">
              <Picker
                selectedValue={selectedDay}
                onValueChange={setSelectedDay}
                itemStyle={{ color: 'white', height: 150 }}
                style={{ backgroundColor: 'transparent', color: 'white' }}
              >
                {days.map((day) => (
                  <Picker.Item key={day} label={day} value={day} />
                ))}
              </Picker>
            </View>

            {/* Year Picker */}
            <View className="flex-1 mx-1">
              <Picker
                selectedValue={selectedYear}
                onValueChange={setSelectedYear}
                itemStyle={{ color: 'white', height: 150 }}
                style={{ backgroundColor: 'transparent', color: 'white' }}
              >
                {years.map((year) => (
                  <Picker.Item key={year} label={year} value={year} />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        {/* Next Button */}
        <TouchableOpacity
          onPress={() => {
            if (isDateValid) {
              // Handle navigation with the selected date
              router.push('/onboardingTime');
            }
          }}
          className={`w-full h-14 rounded-full items-center justify-center mt-auto mb-4
            ${isDateValid ? 'bg-white' : 'bg-zinc-900/70'}`}
        >
          <Text className={`text-lg font-medium
            ${isDateValid ? 'text-black' : 'text-zinc-700'}`}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingBorn;