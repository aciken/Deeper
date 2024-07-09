import { View, Text,ScrollView,TouchableOpacity } from 'react-native';
import React from 'react';

const HourTable = () => {
  // Generate an array of 24 elements to represent hours
  const hours = Array.from({ length: 24 }, (_, index) => index);
  console.log(hours)

  return (
    <View className="flex-row items-center justify-center h-[75%] w-full mt-6 bg-gray-700 rounded-xl">
          <ScrollView
              vertical={true} 
              showsVerticalScrollIndicator={false}
          >

      {hours.map((hour) => (
        <View  key={hour} className="flex-1 justify-end items-start h-20">
          <Text className="text-xs font-psemibold text-gray-400 pl-2">{hour < 11 ? `${hour+1} AM` : hour == 11 ? `${hour+1} PM` : `${hour-11} PM` }</Text>
          <View className="h-[2px] w-full bg-gray-800" />
        </View>
      ))}
    </ScrollView>
    </View>
  );
};

export default HourTable;