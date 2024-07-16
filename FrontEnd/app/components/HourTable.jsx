import { View, Text,ScrollView,TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import React,{useState} from 'react';

const HourTable = ({tasks, clicked, todayDateNumber}) => {
  const router = useRouter();
  // Generate an array of 24 elements to represent hours
  const hours = Array.from({ length: 24 }, (_, index) => index);


  const [currentTime, setCurrentTime] = useState(new Date());

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  // Split the time string by space to separate the time and AM/PM
const [time, amPm] = formattedTime.split(" ");

// Split the time part by colon to get hours, minutes, and seconds
const [hour, minutes, seconds] = time.split(":");



let currentLine = 0;
if(amPm == "PM" && hour != 12){
  currentLine += 240;
} 
  currentLine += hour*20;

currentLine += minutes / 3;







  return (
    <View className=" relative flex-row items-center justify-center h-[75%] w-full mt-6 bg-gray-700 rounded-xl ">
          <ScrollView
              vertical={true} 
              showsVerticalScrollIndicator={false}
          >
            {todayDateNumber == clicked && (
              <View style={{top: currentLine * 4}} className="absolute w-full h-[3px] bg-blue-800"/> 
            )}

          {tasks && tasks.map((task, index) => {
            let start = 0;
            let end = 0;
            let dif = 0


            if(task[0].slice(-2) == "PM"){
              start += 240;
             
            } else {
              start += 0;
            }
            if(task[0].slice(0, task[0].indexOf(':')) != 12){
            start += task[0].slice(0, task[0].indexOf(':'))*20;
            }
            start += task[0].slice(task[0].indexOf(':') + 1, task[0].indexOf(':') + 3) / 3;

            
            if(task[1].slice(-2) == "PM"){
              end += 240;
             
            } else {
              end += 0;
            }

            if(task[1].slice(0, task[1].indexOf(':')) != 12){
            end += task[1].slice(0, task[1].indexOf(':'))*20;
            }
            end += task[1].slice(task[1].indexOf(':') + 1, task[1].indexOf(':') + 3) / 3;

            dif = end - start;











            return (
              <TouchableOpacity key={index} style={{ top: start * 4, height: dif * 4 }} className={`absolute z-20 left-20 flex-row justify-start items-end bg-blue-500 rounded-md w-[50%] drop-shadow-2xl p-2`}
                activeOpacity={0.9}
                onPress={() => router.push({ pathname: 'log/editTask', params: {clicked, index, task} })}
              >
                <Text className="text-gray-200 font-psemibold text-xl">{task[2]}</Text>
                

            </TouchableOpacity>
            )

          })}
      {hours.map((hour) => (
        <View  key={hour} className="flex-1 justify-end items-start h-20">
          <Text className="text-xs font-psemibold text-gray-400 pl-2">{hour < 11 ? `${hour+1} AM` : hour == 11 ? `${hour+1} PM` : hour == 23 ? `${hour - 11} AM` : `${hour-11} PM` }</Text>
          <View className="h-[2px] w-full bg-gray-800" />               
        </View>
      ))}
    </ScrollView>
    </View>
  );
};

export default HourTable;