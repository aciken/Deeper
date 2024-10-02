import { View, Text, ScrollView,Animated,Dimensions, } from 'react-native'
import React, { useEffect, useState } from 'react';
import {router} from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router';
import ClickableIcon from '../components/ClickableIcon'
import Arrow from '../../assets/images/arrow.png'

const screenHeight = Dimensions.get('window').height;

const timer = () => {

    const {clicked, index, task,currentLine, todayDateNumber, all} = useLocalSearchParams();

    const today = new Date(); 
const dayOfMonth = today.getDate();







    const [currentTime, setCurrentTime] = useState(new Date()); 
const [h, setH] = useState(currentTime.getHours()); 
const [m, setM]= useState(currentTime.getMinutes()); 
const [s, setS] = useState(currentTime.getSeconds());



    const taskArray = task.split(',');
    const  [realTime, setRealTime] = useState((h * 20 + m / 3) / 20 * 3600 + s);



    const [timeInSeconds, setTimeInSeconds] = useState(Math.round(((taskArray[4] / 20) * 3600) - realTime));

    useEffect(() => {
    if(currentLine-600 < taskArray[3] && (clicked == dayOfMonth)) {
        setTimeInSeconds(Math.round(((taskArray[3] / 20) * 3600) - realTime));
        } else if(clicked > dayOfMonth) {
            setTimeInSeconds(Math.round(((taskArray[3] / 20) * 3600)) -realTime + 86400 * (clicked - dayOfMonth));
            console.log(timeInSeconds)
    }
    }, [] )


    console.log(`${timeInSeconds} - time, ${realTime} - current time`)

    

    useEffect(() => {

      if (timeInSeconds === 0) return;
  

      const intervalId = setInterval(() => {

        const rightTime = new Date()

        const inH = rightTime.getHours()
        const inM = rightTime.getMinutes()
        const inS = rightTime.getSeconds()

        


            const inRealTime = ((inH * 20 + inM / 3) / 20 * 3600 + inS);

            console.log(Math.round(((taskArray[4] / 20) * 3600)), inRealTime)

        setTimeInSeconds(Math.round(((taskArray[4] / 20) * 3600) - inRealTime));


          if(currentLine - 600 < taskArray[3] && (clicked == dayOfMonth)) {
              setTimeInSeconds(Math.round(((taskArray[3] / 20) * 3600) - inRealTime));
              } else if(clicked > dayOfMonth) {
                  setTimeInSeconds(Math.round(((taskArray[3] / 20) * 3600)) -inRealTime + 86400 * (clicked - dayOfMonth));
                  console.log(timeInSeconds)
          }

      }, 1000);
  

      return () => clearInterval(intervalId);

    }, [timeInSeconds]);
  

    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
  

    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

      console.log(taskArray[4], taskArray[3], currentLine, clicked, dayOfMonth)

  useEffect(() => {
    const logInterval = setInterval(() => {
      console.log(`Current line: ${currentLine}, Task start: ${taskArray[3]}`);
    }, 3000);

    return () => clearInterval(logInterval);
  }, []);

  return (
    <SafeAreaView className="h-full bg-gray-800 relative">
        <View style={{ height: screenHeight}} className={`w-full h-full flex-col justify-center items-center p-4 relative`}>
        <ClickableIcon
          ImageSource={Arrow}
          handlePress={() => router.back()}
          containerStyles=" top-4 left-4"
          imageStyle="w-6 h-6"
        />
        {parseInt(currentLine-600) > parseInt(taskArray[4]) && (clicked == dayOfMonth || all == 'true') ?  (
            <Text className="font-psemibold text-white text-3xl">This Task Is Finished</Text>
            ) : parseInt(currentLine-600) < (taskArray[3]) || clicked != dayOfMonth ? (
                <Text className="font-psemibold text-white text-3xl">This Task Starts in: {formattedTime}</Text>
            ) : (
                <Text className="font-psemibold text-white text-3xl text-center">{formattedTime}</Text>
            
        )}
        </View>
    </SafeAreaView>
  );
};

export default timer