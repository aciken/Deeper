import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Vibration } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const PresetsTable = ({ preset, changeEditVisible, changeEditData, setIndex, work }) => {
  const router = useRouter();
  const hours = useMemo(() => Array.from({ length: 25 }, (_, index) => index), []);

  function convertTimeStringToDate(timeString) {
    const [hours, minutes] = timeString.split(':');
    
    let date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    date.setSeconds(0);
    date.setMilliseconds(0);
    
    return date;
  }

  const renderTasks = useMemo(() => {
    return preset.sessions.map((session, index) => {
      const [startTime, endTime, name, presetId, startPoint, endPoint] = session;
      const [startHour, startMinute] = startTime.split(':');
      const [endHour, endMinute] = endTime.split(':');

      const start = 10 + parseInt(startHour) * 20 + parseInt(startMinute) / 3;
      const end = 10 + parseInt(endHour) * 20 + parseInt(endMinute) / 3;
      const dif = end - start;

      return (
        <TouchableOpacity 
          key={index} 
          style={{ top: start * 4, height: dif * 4 }} 
          className="absolute z-20 left-20 flex-row justify-start items-end rounded-lg overflow-hidden border border-zinc-700 w-[70%]"
          activeOpacity={0.8}
          onLongPress={() => {
            Vibration.vibrate(100);
            changeEditVisible();
            setIndex(index);
            changeEditData(
              convertTimeStringToDate(startTime),
              convertTimeStringToDate(endTime),
              name,
              work.find(w => w._id === presetId)
            );
          }}
        >
          <LinearGradient 
            colors={work.find(w => w._id === presetId)?.colors}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            className="w-full h-full rounded-lg justify-center items-center">
            <View className="p-2 z-10">
              <Text className="text-white font-semibold text-lg">{name}</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      );
    });
  }, [preset.sessions]);

  return (
    <View className="relative flex-1 h-[75%] w-full mt-6 border border-zinc-700 bg-zinc-900 rounded-md overflow-hidden">
      <ScrollView
        vertical={true} 
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        {renderTasks}

        {hours.map((hour) => (
          <View key={hour} className="flex-row items-center h-20 border-b border-zinc-800">
            <Text className="text-xs font-medium text-zinc-500 w-16 text-right pr-2">
              {hour.toString().padStart(2, '0')}:00
            </Text>
            <View className="flex-1 h-[1px] bg-zinc-800" />               
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default PresetsTable;
