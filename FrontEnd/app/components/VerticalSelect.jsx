import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';


const VerticalSelect = ({numberStyle, numberType,onNumberSelect}) => {
  const hoursArray = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutesArray = Array.from({ length: 59 }, (_, i) => i + 1);
  const [selectedHour, setSelectedHour] = useState(null);
  const [selectedMinute, setSelectedMinute] = useState(null);

  const handleSelectHour = (hour) => {
    setSelectedHour(hour);
    onNumberSelect(); // Call the passed callback function
  };

  const handleSelectMinute = (minute) => {
    setSelectedMinute(minute);
    onNumberSelect(); // Call the passed callback function
  };

  return (
    <View className={`flex-row h-50 w-14 `}>
      <ScrollView className={`flex-1 h-[160px]  rounded-md bg-gray-700`}
        showsVerticalScrollIndicator={false}
      >
{numberType == 'hour' ? (
  hoursArray.map((hour) => (
    <TouchableOpacity
      key={hour}
      className={`items-center justify-center p-2 rounded-md ${selectedHour === hour ? 'bg-blue-700' : 'bg-transparent'}`}
      onPress={() => handleSelectHour(hour)}
    >
      <Text className={`${numberStyle} drop-shadow-2xl`}>{hour}</Text>
    </TouchableOpacity>
  ))
) : (
  minutesArray.map((minute) => (
    <TouchableOpacity
      key={minute}
      className={`items-center justify-center p-2 rounded-md ${selectedMinute === minute ? 'bg-blue-700' : 'bg-transparent'}`}
      onPress={() => handleSelectMinute(minute)}
    >
      <Text className={`${numberStyle} drop-shadow-2xl`}>{minute}</Text>
    </TouchableOpacity>
  ))
)}

      </ScrollView>
    </View>
  );
};

export default VerticalSelect;