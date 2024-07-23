import { View, Text, ScrollView,Animated,Dimensions, } from 'react-native'
import React, { useEffect, useState } from 'react';
import {router} from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router';
import ClickableIcon from '../components/ClickableIcon'
import Arrow from '../../assets/images/arrow.png'

const screenHeight = Dimensions.get('window').height;

const timer = () => {

    const {clicked, index, task,currentLine, todayDateNumber} = useLocalSearchParams();

    const today = new Date(); // Creates a new Date object with the current date and time
const dayOfMonth = today.getDate(); // Gets the day of the month







    const currentTime = new Date(); // Creates a new Date object with the current date and time
const h = currentTime.getHours(); // Gets the current hours
const m= currentTime.getMinutes(); // Gets the current minutes
const s = currentTime.getSeconds(); // Gets the current seconds

    const taskArray = task.split(',');
    const  realTime = (h * 20 + m / 3) / 20 * 3600 + s;

    const [timeInSeconds, setTimeInSeconds] = useState(Math.round(((taskArray[4] / 20) * 3600) - realTime));

    useEffect(() => {
    if(currentLine < taskArray[3] && clicked == dayOfMonth){
        setTimeInSeconds(Math.round(((taskArray[3] / 20) * 3600) - realTime));
        } else if(clicked > dayOfMonth) {
            setTimeInSeconds(Math.round(((taskArray[3] / 20) * 3600)) -realTime + 86400 * (clicked - dayOfMonth));
            console.log(timeInSeconds)
    }
    }, [] )

    console.log(timeInSeconds)

    

    useEffect(() => {
      // Exit early when we reach 0
      if (timeInSeconds === 0) return;
  
      // Save intervalId to clear the interval when the component re-renders
      const intervalId = setInterval(() => {
        // Decrease time by 1
        setTimeInSeconds(timeInSeconds - 1);
      }, 1000);
  
      // Clear interval on re-render to avoid memory leaks
      return () => clearInterval(intervalId);
      // Add timeInSeconds as a dependency to re-run the effect when it changes
    }, [timeInSeconds]);
  
    // Convert time in seconds to hours, minutes, and seconds
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
  
    // Format time for display
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <SafeAreaView className="h-full bg-gray-800 relative">
      <ScrollView>
        <View style={{ height: screenHeight}} className={`w-full h-full flex-col justify-center items-center p-4 relative`}>
        <ClickableIcon
          ImageSource={Arrow}
          handlePress={() => router.back()}
          containerStyles=" top-4 left-4"
          imageStyle="w-6 h-6"
        />
        {currentLine > taskArray[4] && clicked == dayOfMonth ? (
            <Text className="font-psemibold text-white text-3xl">This Task Is Finished</Text>
            ) : currentLine < taskArray[3] || clicked != dayOfMonth ? (
                <Text className="font-psemibold text-white text-3xl">This Task Starts in: {formattedTime} </Text>
            ) : (
                <Text className="font-psemibold text-white text-3xl text-center">{formattedTime}</Text>
            
        )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default timer