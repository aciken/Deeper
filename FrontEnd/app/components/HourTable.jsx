import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Vibration } from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';


const HourTable = ({ user, clicked, todayDateNumber, all, changeEditVisible, changeEditData,setIndex }) => {
  const router = useRouter();
  const hours = useMemo(() => Array.from({ length: 25 }, (_, index) => index), []);

  const [currentLine, setCurrentLine] = useState(0);

  useEffect(() => {
    const updateCurrentLine = () => {
      const currentTime = new Date();
      const hours24 = currentTime.getHours();
      const minutes = currentTime.getMinutes();

      let newCurrentLine = 10 + hours24 * 20 + minutes / 3;

      setCurrentLine(newCurrentLine);
    };

    updateCurrentLine();
    const intervalId = setInterval(updateCurrentLine, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, []);



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
    return user.array[clicked-1] && user.array[clicked-1].map((task, index) => {
      const [startHour, startMinute] = task[0].split(':');
      const [endHour, endMinute] = task[1].split(':');

      const start = 10 + parseInt(startHour) * 20 + parseInt(startMinute) / 3;
      const end = 10 + parseInt(endHour) * 20 + parseInt(endMinute) / 3;
      const dif = end - start;

      return (
        <TouchableOpacity 
          key={index} 
          style={{ top: start * 4, height: dif * 4 }} 
          className={`absolute z-20 left-20 flex-row justify-start items-end rounded-lg overflow-hidden ${
            currentLine > start && currentLine < end ? 'border border-zinc-200' : 'border border-zinc-700'
          } w-[70%] ${
            task[5] < (currentLine-10) && clicked === todayDateNumber ? 'opacity-60' : ''
          }`}
          activeOpacity={0.8}
          onPress={() => router.push({pathname: 'log/timer', params: {clicked, index, task, currentLine, all}})}
          onLongPress={() => {
            Vibration.vibrate(100);
            changeEditVisible()
            setIndex(index)
            changeEditData(
              convertTimeStringToDate(task[0]),
              convertTimeStringToDate(task[1]),
              task[2],
              task[3]
            )
          }}
        >
          <LinearGradient 
							colors={task[3].colors}
							start={{x: 0, y: 0}}
							end={{x: 1, y: 1}}
							className="w-full h-full rounded-lg justify-center items-center">
            <View className="p-2 z-10">
          <Text className="text-white font-semibold text-lg">{task[2]}</Text>
          </View>
          </LinearGradient>
        </TouchableOpacity>
      );
    });
  }, [user, currentLine, clicked, todayDateNumber, router, all]);

  return (
    <View className="relative flex-1 h-[75%] w-full mt-6 border border-zinc-700 bg-zinc-900 rounded-md overflow-hidden">
      <ScrollView
        vertical={true} 
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        {todayDateNumber === clicked && (
          <View style={{top: currentLine * 4}} className="absolute z-50 w-full h-[2px] bg-sky-600"/> 
        )}

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

export default HourTable;