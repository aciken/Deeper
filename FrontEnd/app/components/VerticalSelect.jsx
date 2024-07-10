import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';


const VerticalSelect = ({numberStyle}) => {
  const hoursArray = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutesArray = Array.from({ length: 59 }, (_, i) => i + 1);
  const [selectedHour, setSelectedHour] = useState(null);
  const [selectedMinute, setSelectedMinute] = useState(null);

  const handleSelectHour = (hour) => {
    setSelectedHour(hour);
  };

  const handleSelectMinute = (minute) => {
    setSelectedMinute(minute);
  };

  return (
    <View className={`flex-row h-50 w-20`}>
      <ScrollView className={`flex-1 h-[160px]`}
        showsVerticalScrollIndicator={false}
      >
        {minutesArray.map((minute) => (
          <TouchableOpacity
            key={minute}
            className={`items-center justify-center p-2 ${selectedMinute === minute ? 'bg-blue-200' : 'bg-transparent'}`}
            onPress={() => handleSelectMinute(minute)}
          >
            <Text className={`${numberStyle}`}>{minute}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default VerticalSelect;