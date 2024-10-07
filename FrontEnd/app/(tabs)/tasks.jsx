import React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Tasks = () => {
  const screenWidth = Dimensions.get('window').width;
  const barWidth = (screenWidth - 80) / 7; // 80 is total padding

  // Sample data for the last week (hours worked each day)
  const weekData = [
    { day: 'Mon', hours: 6 },
    { day: 'Tue', hours: 8 },
    { day: 'Wed', hours: 7 },
    { day: 'Thu', hours: 9 },
    { day: 'Fri', hours: 5 },
    { day: 'Sat', hours: 3 },
    { day: 'Sun', hours: 2 },
  ];

  const maxHours = Math.max(...weekData.map(d => d.hours));

  return (
    <SafeAreaView className="h-full bg-gray-950">
      <ScrollView>
        <View className="w-full justify-start items-center px-4 my-6 p-4">
          <Text className="text-white text-xl font-bold mb-4">Last Week's Work Schedule</Text>
          <View className="flex-row justify-between w-full h-60">
            {weekData.map((day, index) => (
              <View key={index} className="items-center">
                <View className="flex-1 justify-end">
                  <View 
                    style={{
                      width: barWidth - 4,
                      height: `${(day.hours / maxHours) * 100}%`,
                      backgroundColor: '#2dd4bf',
                      borderRadius: 5,
                    }}
                  />
                </View>
                <Text className="text-white mt-2">{day.day}</Text>
                <Text className="text-white text-xs">{day.hours}h</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Tasks;