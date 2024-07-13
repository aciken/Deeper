import { View, Text,ScrollView,TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import React from 'react';

const HourTable = ({tasks, clicked}) => {
  const router = useRouter();
  // Generate an array of 24 elements to represent hours
  const hours = Array.from({ length: 24 }, (_, index) => index);
  console.log(tasks)

  return (
    <View className=" relative flex-row items-center justify-center h-[75%] w-full mt-6 bg-gray-700 rounded-xl ">
          <ScrollView
              vertical={true} 
              showsVerticalScrollIndicator={false}
          >
          {tasks && tasks.map((task, index) => {
            let start = 0;
            let end = 0;
            let dif = 0
            console.log(task[0].slice(-2));

            if(task[0].slice(-2) == "PM" && task[0].slice(0, task[0].indexOf(':')) != 12){
              start += 240;
             
            } else {
              start += 0;
            }
            start += task[0].slice(0, task[0].indexOf(':'))*20;
            start += task[0].slice(task[0].indexOf(':') + 1, task[0].indexOf(':') + 3) / 3;

            
            if(task[1].slice(-2) == "PM" && task[1].slice(0, task[1].indexOf(':')) != 12){
              end += 240;
             
            } else {
              end += 0;
            }

            end += task[1].slice(0, task[1].indexOf(':'))*20;
            end += task[1].slice(task[1].indexOf(':') + 1, task[1].indexOf(':') + 3) / 3;

            dif = end - start;

            console.log(end,start,dif)









            // console.log(task[0].splice(5,2));

            // if(task[0].splice(5,2) == "AM"){

              
            // } else {
            //   start += 240;

            // }
            return (
              <TouchableOpacity key={index} style={{ top: start * 4, height: dif * 4 }} className={`absolute left-20 flex-row justify-start items-center bg-blue-500 rounded-md w-[50%]`}
                activeOpacity={0.9}
                onPress={() => router.push({ pathname: 'log/editTask', params: {clicked, index, task} })}
              >
                

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