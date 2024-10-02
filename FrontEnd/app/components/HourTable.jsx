import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Vibration } from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const HourTable = ({ tasks, clicked, todayDateNumber, all }) => {
  const router = useRouter();
  const hours = useMemo(() => Array.from({ length: 24 }, (_, index) => index), []);

  const [currentLine, setCurrentLine] = useState(0);

  useEffect(() => {
    const updateCurrentLine = () => {
      const currentTime = new Date();
      const hours12 = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      const amPm = hours12 >= 12 ? 'PM' : 'AM';
      const hour12 = hours12 % 12 || 12;

      let newCurrentLine = 10;
      if (amPm === "PM" && hour12 !== 12) {
        newCurrentLine += 240;
      }
      newCurrentLine += hour12 * 20;
      newCurrentLine += minutes / 3;

      setCurrentLine(newCurrentLine);
    };

    updateCurrentLine();
    const intervalId = setInterval(updateCurrentLine, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, []);

  const renderTasks = useMemo(() => {
    return tasks && tasks.map((task, index) => {
      let start = 10;
      let end = 10;

      if (task[0].slice(-2) === "PM") {
        start += 240;
      }
      if (task[0].slice(0, task[0].indexOf(':')) !== '12') {
        start += parseInt(task[0].slice(0, task[0].indexOf(':'))) * 20;
      }
      start += parseInt(task[0].slice(task[0].indexOf(':') + 1, task[0].indexOf(':') + 3)) / 3;

      if (task[1].slice(-2) === "PM") {
        end += 240;
      }
      if (task[1].slice(0, task[1].indexOf(':')) !== '12') {
        end += parseInt(task[1].slice(0, task[1].indexOf(':'))) * 20;
      }
      end += parseInt(task[1].slice(task[1].indexOf(':') + 1, task[1].indexOf(':') + 3)) / 3;

      const dif = end - start;

      return (
        <TouchableOpacity 
          key={index} 
          style={{ top: start * 4, height: dif * 4 }} 
          className={`absolute z-20 left-20 flex-row justify-start items-end rounded-lg overflow-hidden ${
            currentLine - 10 > start - 10 && currentLine - 10 < end - 10 ? 'border border-white' : 'border border-gray-700'
          } w-[70%] ${
            task[4] < currentLine - 10 && clicked === todayDateNumber ? '' : ''
          }`}
          activeOpacity={0.8}
          onPress={() => router.push({pathname: 'log/timer', params: {clicked, index, task, currentLine, all}})}
          onLongPress={() => {
            Vibration.vibrate(100);
            router.push({ pathname: 'log/editTask', params: {clicked, index, task, all} })
          }}
        >
          <LinearGradient
            colors={['#34d399', '#10b981']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={{flex: 1, width: '100%', height: '100%'}}
          >
            <View className="p-2 z-10">
              <Text className="text-white font-semibold text-lg">{task[2]}</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      );
    });
  }, [tasks, currentLine, clicked, todayDateNumber, router, all]);

  return (
    <View className="relative flex-1 h-[75%] w-full mt-6 border border-gray-700 bg-gray-950 rounded-md overflow-hidden">
      <ScrollView
        vertical={true} 
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        {todayDateNumber === clicked && (
          <View style={{top: currentLine * 4}} className="absolute z-50 w-full h-[2px] bg-teal-500"/> 
        )}

        {renderTasks}

        {hours.map((hour) => (
          <View key={hour} className="flex-row items-center h-20 border-b border-gray-800">
            <Text className="text-xs font-medium text-gray-500 w-16 text-right pr-2">
              {hour === 0 ? '12 AM' : 
               hour < 12 ? `${hour} AM` : 
               hour === 12 ? '12 PM' : 
               `${hour - 12} PM`}
            </Text>
            <View className="flex-1 h-[1px] bg-gray-800" />               
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default HourTable;